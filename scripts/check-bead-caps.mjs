#!/usr/bin/env node
/**
 * 直接用课程实际生成的网格，检查珠编端帽有没有穿插；整个过程只读。
 *
 *   node scripts/check-bead-caps.mjs
 *   node scripts/check-bead-caps.mjs --course=flower --samples=101 --report=/tmp/caps.json
 *   node scripts/check-bead-caps.mjs --markers-source=/absolute/path/old-cordEnds.ts
 *
 * 默认检查起点、五个步骤边界、.86、.90 和终点，重复进度只算一次。
 * --samples=N 可加上包含两端的 N 个均匀采样，N 至少为 2。
 * 只有画布绘制用了替身。端帽、绳管、珠子更新、绘制范围、世界矩阵和
 * 珠子轴向与径向缩放都来自实际实现，不另抄一套几何，也不改写源文件。
 * 这里没有预设通过名单；它能检查相交和包含，工艺是否正确仍要另行核对。
 */
import { createServer } from 'vite';
import * as THREE from 'three';
import { readFile, writeFile, stat, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const EPSILON = 1e-7;
const PARITY_MERGE_EPSILON = 1e-6;
const VECTOR_UNIT_EPSILON = 1e-6;
// 把三轴数组转成向量，便于做几何距离和投影运算。
const vector = (values) => new THREE.Vector3(...values);
// 取源码摘要，确认检查期间没有被别的进程改动。
const sha256 = (data) => createHash('sha256').update(data).digest('hex');

/** 解析本次检查选项，拼错或重复的参数直接报错。 */
function options() {
  const result = {};

  for (const argument of process.argv.slice(2)) {
    if (argument === '--help') {
      console.log(
        'Usage: node scripts/check-bead-caps.mjs [--course=id] [--samples=N] [--report=path] [--markers-source=/absolute/path/cordEnds.ts]',
      );
      process.exit(0);
    }

    const match = /^--(course|samples|report|markers-source)=(.+)$/.exec(argument);

    if (!match) {
      throw new Error(`Unknown or empty option: ${argument}`);
    }

    if (result[match[1]] !== undefined) {
      throw new Error(`Duplicate option: --${match[1]}`);
    }

    result[match[1]] = match[2];
  }

  if (result.samples !== undefined) {
    result.samples = Number(result.samples);

    if (!Number.isSafeInteger(result.samples) || result.samples < 2) {
      throw new Error('--samples must be an integer >= 2');
    }
  }

  if (result['markers-source'] && !isAbsolute(result['markers-source'])) {
    throw new Error('--markers-source must be an absolute path');
  }

  return result;
}

/** 收集步骤边界与收紧阶段的关键进度，也允许额外均匀采样。 */
function progressSamples(course, count) {
  const values = [0, ...course.steps.map((step) => step.time), 0.86, 0.9, 1];

  if (count) {
    for (let i = 0; i < count; i++) {
      values.push(i / (count - 1));
    }
  }

  return [...new Set(values)].sort((a, b) => a - b);
}

/** 为每个源文件记下摘要和修改时间，供前后比对。 */
async function sourceIdentity(files) {
  return Object.fromEntries(
    await Promise.all(
      files.map(async (file) => {
        const absolute = isAbsolute(file) ? file : resolve(root, file);
        const [source, metadata] = await Promise.all([readFile(absolute), stat(absolute)]);

        return [file, { sha256: sha256(source), mtime: metadata.mtime.toISOString() }];
      }),
    ),
  );
}

/** 准备纹理绘制需要的最小画布环境，网格仍由真实课程代码生成。 */
function canvasDocument() {
  return {
    /* 不允许意外创建别的页面元素，避免检查偷偷依赖浏览器。 */ createElement(tag) {
      if (tag !== 'canvas') {
        throw new Error(`Unexpected DOM request: ${tag}`);
      }

      // 这些绘图接口只接住调用，不生成像素。
      const context = {
        clearRect() {},
        fillRect() {},
        beginPath() {},
        roundRect() {},
        arc() {},
        moveTo() {},
        lineTo() {},
        closePath() {},
        fill() {},
        stroke() {},
        /* 文字纹理不参与网格碰撞，因此不实际排字。 */ fillText() {},
      };

      return {
        width: 0,
        height: 0,
        /* 只接受二维绘图请求，其他上下文类型直接报错。 */ getContext(kind) {
          if (kind !== '2d') {
            throw new Error(`Unexpected canvas context: ${kind}`);
          }

          return context;
        },
      };
    },
  };
}

/** 读取网格当前绘制范围内的顶点和三角形，跳过复用缓冲区里的闲置数据。 */
function meshData(mesh) {
  mesh.updateWorldMatrix(true, false);
  const geometry = mesh.geometry;
  const positions = geometry.getAttribute('position'),
    index = geometry.index;

  const start = geometry.drawRange.start;
  const limit = Math.min(index?.count ?? positions.count, start + geometry.drawRange.count);
  const used = new Set();

  for (let i = start; i < limit; i++) {
    used.add(index ? index.getX(i) : i);
  }

  const vertices = new Map(
    [...used].map((i) => [
      i,
      new THREE.Vector3().fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld),
    ]),
  );

  const triangles = [];

  for (let i = start; i < limit; i += 3) {
    const points = [0, 1, 2].map((j) => vertices.get(index ? index.getX(i + j) : i + j));
    triangles.push({ points, box: new THREE.Box3().setFromPoints(points), ordinal: i / 3 });
  }

  const list = [...vertices.values()];

  return { mesh, vertices: list, triangles, box: new THREE.Box3().setFromPoints(list) };
}

const ray = new THREE.Ray(),
  hit = new THREE.Vector3();

const parityDirection = new THREE.Vector3(0.812371, 0.337921, 0.475137).normalize();

/** 把有限线段作为射线检测，交点超过线段末端就不算。 */
function edgeHitsTriangle(a, b, triangle) {
  const delta = b.clone().sub(a),
    length = delta.length();

  if (length < EPSILON) {
    return false;
  }

  ray.set(a, delta.divideScalar(length));

  return (
    ray.intersectTriangle(...triangle.points, false, hit) !== null &&
    hit.distanceTo(a) <= length + EPSILON
  );
}

/** 先筛包围盒，再用双方三角形的边检查表面穿插。 */
function surfaceIntersections(a, b) {
  const hits = [];

  for (const first of a.triangles) {
    for (const second of b.triangles) {
      if (!first.box.intersectsBox(second.box)) {
        continue;
      }

      for (let edge = 0; edge < 3; edge++) {
        if (
          edgeHitsTriangle(first.points[edge], first.points[(edge + 1) % 3], second) ||
          edgeHitsTriangle(second.points[edge], second.points[(edge + 1) % 3], first)
        ) {
          hits.push([first.ordinal, second.ordinal, ...hit.toArray()]);
          break;
        }
      }
    }
  }

  return hits;
}

/** 只对闭合端帽或珠子表面，用射线交点奇偶数判断点是否在内部。 */
function insideMesh(point, data) {
  if (!data.box.containsPoint(point)) {
    return false;
  }

  ray.set(point, parityDirection);
  const distances = [];

  for (const triangle of data.triangles) {
    if (!ray.intersectTriangle(...triangle.points, false, hit)) {
      continue;
    }

    const distance = hit.distanceTo(point);

    if (distance < EPSILON) {
      return false;
    }

    distances.push(distance);
  }

  distances.sort((a, b) => a - b);
  let count = 0,
    last = -Infinity;

  for (const distance of distances) {
    if (distance - last > PARITY_MERGE_EPSILON) {
      count++;
      last = distance;
    }
  }

  return count % 2 === 1;
}

/** 检查两个闭合部件既有的表面相交，也有完全包住对方的情况。 */
function closedCheck(a, b) {
  if (!a.box.intersectsBox(b.box)) {
    return null;
  }

  const hits = surfaceIntersections(a, b);
  const insideA = a.vertices.filter((point) => insideMesh(point, b)).length;
  const insideB = b.vertices.filter((point) => insideMesh(point, a)).length;

  return hits.length || insideA || insideB
    ? {
        surfaceTrianglePairs: hits.length,
        firstPairs: hits.slice(0, 4),
        aVerticesInsideB: insideA,
        bVerticesInsideA: insideB,
      }
    : null;
}

/** 准备实际的珠子、端帽和绳管实现，省去不需要的渲染器。 */
function createHarness(StudioScene, CordEndMarkers) {
  // 不创建渲染器也能调用珠子更新；几何和变换依旧来自页面使用的场景实现。
  const scene = Object.create(StudioScene.prototype);
  Object.assign(scene, {
    scene: new THREE.Group(),
    beadMeshes: new Map(),
    beadGeometryCache: new Map(),
    beadLabels: new Map(),
    labelTextures: new Set(),
    upAxis: new THREE.Vector3(0, 1, 0),
  });

  return { scene, markers: new CordEndMarkers(), cordEngines: new Map() };
}

/** 释放这一套检查环境产生的全部几何、材质和纹理。 */
function disposeHarness(harness) {
  const geometries = new Set(),
    materials = new Set();

  for (const group of [harness.scene.scene, harness.markers.group]) {
    group.traverse((object) => {
      if (object.geometry) {
        geometries.add(object.geometry);
      }

      if (object.material) {
        for (const material of Array.isArray(object.material)
          ? object.material
          : [object.material]) {
          materials.add(material);
        }
      }
    });
  }

  for (const geometry of harness.scene.beadGeometryCache.values()) {
    geometries.add(geometry);
  }

  for (const engine of harness.cordEngines.values()) {
    geometries.add(engine.mesh.geometry);
    materials.add(engine.mesh.material);
  }

  for (const geometry of geometries) {
    geometry.dispose();
  }

  for (const material of materials) {
    material.dispose();
  }

  for (const texture of harness.scene.labelTextures) {
    texture.dispose();
  }

  harness.markers.disposeTextures();
}

/** 用真实绳管实现生成几何，并记录沿绳的累计长度。 */
function tubeData(cord, harness, DynamicCord) {
  let engine = harness.cordEngines.get(cord.id);

  if (!engine) {
    engine = new DynamicCord(new THREE.MeshStandardMaterial());
    harness.cordEngines.set(cord.id, engine);
  }

  engine.update(cord.points, cord.radius, cord.flatness ?? 1, cord.thicknessScales);
  // 从真实绳管类读取截面分段数，不能在检查里另猜一个数。
  const trianglesPerSegment = engine.sides * 2;

  if (!Number.isSafeInteger(trianglesPerSegment) || trianglesPerSegment <= 0) {
    throw new Error('Cannot determine DynamicCord ring resolution');
  }

  const lengths = [0];

  for (let i = 1; i < cord.points.length; i++) {
    lengths.push(lengths[i - 1] + vector(cord.points[i]).distanceTo(vector(cord.points[i - 1])));
  }

  return { cord, ...meshData(engine.mesh), lengths, total: lengths.at(-1), trianglesPerSegment };
}

/** 检查端帽与绳管的穿插，只放过端帽本来就包住的那一小段绳。 */
function checkCapAgainstCords(cap, tubes, detail) {
  const point = vector(cap.end.point),
    direction = vector(cap.end.direction);

  let inward = 0;

  for (const part of cap.parts) {
    for (const vertex of part.vertices) {
      inward = Math.max(inward, -vertex.clone().sub(point).dot(direction));
    }
  }

  // 用端帽变换后的顶点量出套口长度，只排除紧邻这一端的自有绳段。
  // 其他绳股，以及本绳远离端头的部分，都照常参与检查。
  const sleeve = inward + cap.end.radius + PARITY_MERGE_EPSILON;
  detail.ownerSleeveExclusions.push({ label: cap.end.label, length: sleeve });
  const bounds = new THREE.Box3();

  for (const part of cap.parts) {
    bounds.union(part.box);
  }

  const owner = cap.end.id.slice(0, cap.end.id.lastIndexOf(':'));
  const start = cap.end.id.endsWith(':start');

  for (const tube of tubes) {
    if (!tube.box.intersectsBox(bounds)) {
      continue;
    }

    const nearby = {
      ...tube,
      triangles: tube.triangles.filter(
        /* 其他绳股全部参与；自有绳股只排除端头允许的长度。 */ (triangle) => {
          if (!triangle.box.intersectsBox(bounds)) {
            return false;
          }

          if (tube.cord.id !== owner) {
            return true;
          }

          const segment = Math.floor(triangle.ordinal / tube.trianglesPerSegment);
          const distance = start ? tube.lengths[segment] : tube.total - tube.lengths[segment + 1];

          return distance > sleeve;
        },
      ),
    };

    if (!nearby.triangles.length) {
      continue;
    }

    for (const [partIndex, part] of cap.parts.entries()) {
      const hits = surfaceIntersections(part, nearby);
      let contained;

      for (const triangle of nearby.triangles) {
        for (const vertex of triangle.points) {
          if (insideMesh(vertex, part)) {
            contained = { triangle: triangle.ordinal, point: vertex.toArray() };
            break;
          }
        }

        if (contained) {
          break;
        }
      }

      if (!hits.length && !contained) {
        continue;
      }

      detail.capCord.push({
        cap: cap.end.label,
        part: partIndex,
        cord: tube.cord.id,
        owner,
        capEndpoint: cap.end.point,
        threadRadius: cap.end.radius,
        capWorldScale: part.mesh.getWorldScale(new THREE.Vector3()).toArray(),
        surfaceTrianglePairs: hits.length,
        firstPairsAndHitCoordinates: hits.slice(0, 4),
        contained,
        hitSegments: [
          ...new Set(hits.map((value) => Math.floor(value[1] / tube.trianglesPerSegment))),
        ]
          .slice(0, 32)
          .map((index) => ({
            index,
            point: tube.cord.points[index],
            arcFromOwnEnd:
              tube.cord.id === owner
                ? start
                  ? tube.lengths[index]
                  : tube.total - tube.lengths[index + 1]
                : null,
          })),
      });
    }
  }
}

/** 保存端帽状态及部件的世界矩阵，连缩放和旋转也一起比较。 */
function markerSnapshot(markers) {
  markers.group.updateMatrixWorld(true);
  const parts = markers.group.children
    .filter((child) => child.isGroup && child.visible)
    .map((cap) =>
      cap.children
        .filter((child) => child.isMesh && child.visible)
        .map((mesh) => mesh.matrixWorld.elements.slice()),
    );

  // 状态接口没有缩放信息，所以还要保存实际世界矩阵；尺寸或朝向随历史漂移也能发现。
  return JSON.stringify({ state: markers.getState(), parts });
}

/** 在一个课程进度上检查端帽与珠子、绳管及其他端帽的关系。 */
function auditSnapshot(course, progress, harness, production) {
  const { markers, scene } = harness;
  const { DynamicCord, getCordEnds } = production;
  const state = course.getState(progress);
  const cords = [
    {
      id: 'main',
      points: state.points,
      radius: state.radius ?? (state.beads ? 0.025 : 0.06),
      flatness: state.flatness,
      thicknessScales: state.thicknessScales,
    },
    ...(state.strands ?? []),
  ];

  markers.update(state);
  markers.group.updateMatrixWorld(true);
  scene.baseState = state;
  scene.updateBeads(state.beads ?? []);
  scene.scene.updateMatrixWorld(true);
  const beads = [...scene.beadMeshes]
    .filter(([, mesh]) => mesh.visible)
    .map(([id, mesh]) => ({ id, ...meshData(mesh) }));

  const ends = getCordEnds(state),
    rendered = markers.getState();

  const roots = markers.group.children.filter((child) => child.isGroup && child.visible);

  if (roots.length !== ends.length || rendered.length !== ends.length) {
    throw new Error(`Rendered cap count mismatch: ${course.id} @ ${progress}`);
  }

  // 状态与子组的插入顺序相同；绳端列表可能隐藏部分端头，所以最后按标签匹配。
  const caps = roots.map((capRoot, index) => {
    const end = ends.find((item) => item.label === rendered[index].label);

    if (!end) {
      throw new Error(`Unmatched rendered end: ${rendered[index].label}`);
    }

    return {
      end,
      parts: capRoot.children.filter((child) => child.isMesh && child.visible).map(meshData),
    };
  });

  const tubes = cords.map((cord) => tubeData(cord, harness, DynamicCord));
  const detail = {
    course: course.id,
    name: course.name,
    progress,
    count: ends.length,
    cordCount: cords.length,
    labels: ends.map((end) => end.label),
    capCap: [],
    capCord: [],
    capBead: [],
    ownerSleeveExclusions: [],
    finite: ends.every((end) => [...end.point, ...end.direction].every(Number.isFinite)),
    maxUnitError: Math.max(0, ...ends.map((end) => Math.abs(Math.hypot(...end.direction) - 1))),
  };

  for (const cap of caps) {
    checkCapAgainstCords(cap, tubes, detail);

    for (const [partIndex, part] of cap.parts.entries()) {
      for (const bead of beads) {
        const collision = closedCheck(part, bead);

        if (!collision) {
          continue;
        }

        const model = state.beads.find((item) => item.id === bead.id);
        detail.capBead.push({
          cap: cap.end.label,
          part: partIndex,
          capEndpoint: cap.end.point,
          capScale: part.mesh.getWorldScale(new THREE.Vector3()).toArray(),
          bead: bead.id,
          beadPosition: model.position,
          beadAxis: model.axis,
          beadRadius: model.radius,
          axialScale: model.axialScale ?? 1,
          holeRadius: Math.max(0.055, Math.min(0.12, model.radius * 0.36)),
          ...collision,
        });
      }
    }
  }

  for (let i = 0; i < caps.length; i++) {
    for (let j = i + 1; j < caps.length; j++) {
      for (const [first, a] of caps[i].parts.entries()) {
        for (const [second, b] of caps[j].parts.entries()) {
          const collision = closedCheck(a, b);

          if (collision) {
            detail.capCap.push({
              labels: [caps[i].end.label, caps[j].end.label],
              parts: [first, second],
              ...collision,
            });
          }
        }
      }
    }
  }

  // 跳到相反进度再回来，端帽的位置、大小和朝向都应与原快照一致。
  const history = markerSnapshot(markers);
  markers.update(course.getState(1 - progress));
  markers.update(course.getState(progress));
  detail.seekStable = history === markerSnapshot(markers);
  detail.passed =
    !detail.capCap.length &&
    !detail.capCord.length &&
    !detail.capBead.length &&
    detail.finite &&
    detail.maxUnitError <= VECTOR_UNIT_EPSILON &&
    detail.seekStable;

  return detail;
}

/** 组织整轮采样与资源清理，并在结束前复查源码是否变化。 */
async function main() {
  const args = options(),
    markersSource = args['markers-source'];

  // 把整个课程目录纳入源码检查，新登记的珠编课程也不会漏掉。
  const lessonFiles = (await readdir(resolve(root, 'src/lessons')))
    .filter((file) => file.endsWith('.ts'))
    .map((file) => `src/lessons/${file}`);

  // 课程、场景和可选旧实现都参与检查前后的版本核对。
  const files = [
    ...lessonFiles,
    'src/cordEnds.ts',
    'src/scene.ts',
    ...(markersSource ? [markersSource] : []),
  ];

  const sourceBefore = await sourceIdentity(files);
  const virtualScene = resolve(root, 'src/__bead_cap_scene_audit__.ts');
  const virtualMarkers = resolve(root, 'src/__bead_cap_markers_audit__.ts');
  const server = await createServer({
    root,
    configFile: false,
    appType: 'custom',
    // 数据模块无需页面插件或开发连接，关闭依赖发现也能保护正在使用的开发缓存。
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    plugins: [
      {
        name: 'read-only-bead-cap-mesh-audit',
        /* 把检查入口映射到两个虚拟模块。 */ resolveId(id) {
          if (id === '/src/__bead_cap_scene_audit__.ts') {
            return virtualScene;
          }

          if (id === '/src/__bead_cap_markers_audit__.ts' && markersSource) {
            return virtualMarkers;
          }
        },
        /* 在内存中补出导出项或读取旧文件，磁盘源码保持原样。 */ async load(id) {
          if (id === virtualScene) {
            return (
              (await readFile(resolve(root, 'src/scene.ts'), 'utf8')) +
              '\nexport { DynamicCord };\n'
            );
          }

          if (id === virtualMarkers && markersSource) {
            return readFile(markersSource, 'utf8');
          }
        },
      },
    ],
  });

  const previousDocument = globalThis.document;
  globalThis.document = canvasDocument();
  const snapshots = [],
    failures = [];

  try {
    const { COURSES } = await server.ssrLoadModule('/src/lessons/catalog.ts');
    const { CordEndMarkers, getCordEnds } = await server.ssrLoadModule(
      markersSource ? '/src/__bead_cap_markers_audit__.ts' : '/src/cordEnds.ts',
    );

    const { StudioScene, DynamicCord } = await server.ssrLoadModule(
      '/src/__bead_cap_scene_audit__.ts',
    );

    const courses = COURSES.filter(
      (course) => course.category === 'beads' && (!args.course || course.id === args.course),
    );

    if (!courses.length) {
      throw new Error(
        args.course ? `No registered bead course: ${args.course}` : 'No registered bead courses',
      );
    }

    for (const course of courses) {
      const harness = createHarness(StudioScene, CordEndMarkers);

      try {
        for (const progress of progressSamples(course, args.samples)) {
          const detail = auditSnapshot(course, progress, harness, { DynamicCord, getCordEnds });
          snapshots.push(detail);

          if (!detail.passed) {
            failures.push(detail);
          }
        }
      } finally {
        disposeHarness(harness);
      }

      const checked = snapshots.filter((snapshot) => snapshot.course === course.id);
      console.log(
        `${checked.every((snapshot) => snapshot.passed) ? 'PASS' : 'FAIL'} ${course.id}: ${checked.length} snapshots, ${checked.filter((snapshot) => !snapshot.passed).length} failed`,
      );
    }

    const sourceAfter = await sourceIdentity(files);
    const changedFiles = files.filter(
      (file) => sourceBefore[file].sha256 !== sourceAfter[file].sha256,
    );

    // 完整报告保留源码身份、采样策略、误差阈值和所有失败细节。
    const report = {
      time: new Date().toISOString(),
      markersSource: markersSource ?? null,
      markersSha256: sourceBefore[markersSource ?? 'src/cordEnds.ts'].sha256,
      sampling: {
        critical: '0, step times, .86, .90, 1',
        additionalUniformSamples: args.samples ?? 0,
      },
      tolerances: {
        intersection: EPSILON,
        parityMerge: PARITY_MERGE_EPSILON,
        directionUnit: VECTOR_UNIT_EPSILON,
      },
      method:
        'Production CordEndMarkers part meshes and matrixWorld; production DynamicCord active tube geometry; production updateBeads drilled meshes including axialScale. Triangle-edge intersections and closed-part parity containment. Only the actual same-end sleeve is excluded by inward cap extent plus cord radius; other cords are never excluded.',
      courses: courses.map((course) => ({ id: course.id, name: course.name })),
      sourceBefore,
      sourceAfter,
      changedFiles,
      snapshots,
      failures,
      passed: changedFiles.length === 0 && failures.length === 0,
    };

    if (args.report) {
      await writeFile(resolve(args.report), JSON.stringify(report, null, 2) + '\n');
    }

    console.log(
      `${report.passed ? 'PASS' : 'FAIL'}: ${courses.length} bead courses, ${snapshots.length} snapshots, ${failures.length} failed snapshots; ${changedFiles.length} source changes during audit.`,
    );

    if (changedFiles.length) {
      console.error(`Source changed during audit: ${changedFiles.join(', ')}`);
    }

    if (!report.passed) {
      process.exitCode = 1;
    }
  } finally {
    if (previousDocument === undefined) {
      delete globalThis.document;
    } else {
      globalThis.document = previousDocument;
    }

    await server.close();
  }
}

main().catch((error) => {
  console.error(`FAIL: ${error.stack ?? error}`);
  process.exitCode = 1;
});
