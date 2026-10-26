import { createServer } from 'vite';
import * as THREE from 'three';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// 直接调用页面使用的端帽组件，检查完整精灵矩形，比圆角绘制边缘稍严格一点。
// 字体实际显示和页面浮层仍要到浏览器里看，这份检查只负责几何布局。
// 示例：node scripts/check-end-labels.mjs --report=/tmp/end-labels.json
// 用 --course=plain-weave 只查一课；--markers-source=/tmp/old.ts 可只读比较旧版本。
const root = fileURLToPath(new URL('..', import.meta.url));
// 读取形如 --名称=值 的可选参数。
const option = (name) =>
  process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);

const source = option('markers-source');
const virtualSource = resolve(root, 'src/__end_labels_component_under_test__.ts');
const tolerance = 0.5; // 单位是样式像素，只容忍亚像素计算带来的轻微接触。
const scrubJumpLimit = 2; // 进度每走万分之一，超过两样式像素的跳动就值得检查。
// 覆盖窄手机到宽桌面的几个视口，尺寸单位为样式像素。
const viewports = [
  [290, 438],
  [360, 600],
  [960, 600],
  [1440, 850],
];

// 复位、俯视、正视和斜视都要过一遍布局。
const views = ['reset', 'top', 'front', 'oblique'];
// 起点、末段和成品各留一个代表进度。
const progresses = [0, 0.82, 1];
// 文字纹理只需这一小块二维画布；记住实际写下的文字，才能认出对应的精灵。
const oldDocument = globalThis.document;
const oldWindow = globalThis.window;
// 给文字纹理一个够用的画布替身，并记住实际画出的标签。
const canvasDocument = {
  /* 这里仅允许创建画布，意外的元素请求会直接报错。 */ createElement(tag) {
    if (tag !== 'canvas') {
      throw new Error(`Unexpected DOM element: ${tag}`);
    }

    const canvas = { width: 0, height: 0, paintedLabel: '' };
    // 绘图调用不真正落笔，只留下检查需要的文字。
    const context = {
      clearRect() {},
      beginPath() {},
      roundRect() {},
      fill() {},
      stroke() {},
      /* 记住真实绘制的标签，后面用它核对精灵身份。 */ fillText(text) {
        canvas.paintedLabel = text;
      },
    };

    canvas.getContext = (kind) => (kind === '2d' ? context : null);

    return canvas;
  },
};

const server = await createServer({
  root,
  configFile: false,
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  plugins: source
    ? [
        {
          name: 'read-only-end-label-baseline',
          /* 将检查专用的模块地址交给下面的加载钩子。 */ resolveId(id) {
            if (id === '/src/__end_labels_component_under_test__.ts') {
              return virtualSource;
            }
          },
          /* 读取指定的旧文件，供前后版本对照。 */ async load(id) {
            if (id === virtualSource) {
              return readFile(source, 'utf8');
            }
          },
        },
      ]
    : [],
});

globalThis.document = canvasDocument;
globalThis.window = { devicePixelRatio: 1 };
// 整轮结果按正常视角、放大压力和连续拖动分别记录。
const report = {
  time: new Date().toISOString(),
  source: source ?? 'src/cordEnds.ts',
  method:
    'Actual CordEndMarkers Sprite world transforms; actual StudioScene resize/setView/fitToModel methods; no WebGL or copied layout solver.',
  tolerancePixels: tolerance,
  scrubJumpLimitPixels: scrubJumpLimit,
  viewports,
  views,
  progresses,
  normal: {
    cases: 0,
    labels: 0,
    failedCases: 0,
    collisions: 0,
    outside: 0,
    nonFinite: 0,
    identityErrors: 0,
    endpointsOutsideCases: 0,
  },
  stress: { cases: 0, failedCases: 0, collisions: 0, outside: 0, endpointsOutsideCases: 0 },
  failures: [],
  stressFindings: [],
  temporal: [],
  reproduction: null,
};

/** 把世界坐标投到画布像素上，同时保留深度。 */
function project(point, camera, width, height) {
  const ndc = point.clone().project(camera);

  return { x: ((ndc.x + 1) * width) / 2, y: ((1 - ndc.y) * height) / 2, z: ndc.z };
}

// 精灵总是朝向相机，不能直接拿对象自身旋转来算边界。
// 四角按实际世界尺寸展开，再沿相机的右方和上方投影。
function spriteRectangles(group, camera, width, height) {
  group.updateMatrixWorld(true);
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0);
  const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
  const rectangles = [];
  group.traverseVisible(
    /* 遍历可见精灵，跳过那些没有标签矩形的对象。 */ (sprite) => {
      if (!sprite.isSprite) {
        return;
      }

      const position = sprite.getWorldPosition(new THREE.Vector3());
      const scale = sprite.getWorldScale(new THREE.Vector3());
      const angle = sprite.material.rotation,
        cos = Math.cos(angle),
        sin = Math.sin(angle);

      const corners = [];

      for (const x of [0, 1]) {
        for (const y of [0, 1]) {
          const dx = (x - sprite.center.x) * scale.x,
            dy = (y - sprite.center.y) * scale.y;

          const corner = position
            .clone()
            .addScaledVector(right, cos * dx - sin * dy)
            .addScaledVector(up, sin * dx + cos * dy);

          corners.push(project(corner, camera, width, height));
        }
      }

      rectangles.push({
        label: sprite.material.map.image.paintedLabel,
        left: Math.min(...corners.map((p) => p.x)),
        right: Math.max(...corners.map((p) => p.x)),
        top: Math.min(...corners.map((p) => p.y)),
        bottom: Math.max(...corners.map((p) => p.y)),
        center: project(position, camera, width, height),
      });
    },
  );

  return rectangles;
}

/** 检查标签是否互相遮挡、跑出画布或产生无效坐标。 */
function inspect(rectangles, width, height) {
  const collisions = [],
    outside = [],
    nonFinite = [];

  for (let i = 0; i < rectangles.length; i++) {
    const a = rectangles[i];

    if (![a.left, a.right, a.top, a.bottom, a.center.z].every(Number.isFinite)) {
      nonFinite.push(a);
    }

    if (
      a.left < -tolerance ||
      a.right > width + tolerance ||
      a.top < -tolerance ||
      a.bottom > height + tolerance
    ) {
      outside.push(a);
    }

    for (let j = i + 1; j < rectangles.length; j++) {
      const b = rectangles[j];
      const dx = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const dy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);

      if (dx > tolerance && dy > tolerance) {
        collisions.push({ labels: [a.label, b.label], overlap: [dx, dy], rectangles: [a, b] });
      }
    }
  }

  return { collisions, outside, nonFinite };
}

/** 释放这节课用过的标签纹理、几何和材质。 */
function disposeMarkers(markers) {
  const geometries = new Set(),
    materials = new Set();

  markers.group.traverse((object) => {
    if (object.geometry) {
      geometries.add(object.geometry);
    }

    for (const material of Array.isArray(object.material)
      ? object.material
      : object.material
        ? [object.material]
        : []) {
      materials.add(material);
    }
  });
  markers.disposeTextures();

  for (const geometry of geometries) {
    geometry.dispose();
  }

  for (const material of materials) {
    material.dispose();
  }
}

try {
  const { COURSES } = await server.ssrLoadModule('/src/lessons/catalog.ts');
  const { CordEndMarkers, getCordEnds } = await server.ssrLoadModule(
    source ? '/src/__end_labels_component_under_test__.ts' : '/src/cordEnds.ts',
  );

  const { StudioScene } = await server.ssrLoadModule('/src/scene.ts');
  const courses = COURSES.filter((course) => !option('course') || course.id === option('course'));

  if (!courses.length) {
    throw new Error(`No course matching ${option('course')}`);
  }

  report.courseCount = courses.length;

  // 只跳过 WebGL 创建；相机尺寸、预设视角和适配仍调用页面里那一套方法。
  function fittedCamera(state, width, height, view) {
    const harness = Object.create(StudioScene.prototype);
    harness.camera = new THREE.OrthographicCamera(-5, 5, 3.6, -3.6, 0.05, 80);
    harness.controls = {
      target: new THREE.Vector3(),
      enableDamping: true,
      minZoom: 0.35,
      maxZoom: 4.2,
      /* 让相机重新看向目标，并刷新它的世界矩阵。 */ update() {
        harness.camera.lookAt(this.target);
        harness.camera.updateMatrixWorld(true);
      },
    };
    harness.canvas = { getBoundingClientRect: () => ({ width, height }) };
    harness.renderer = { setSize() {}, getPixelRatio: () => 1 };

    harness.requestRender = () => {};

    harness.baseState = state;
    harness.disposed = false;
    harness.contextLost = false;
    harness.resize();
    harness.setView(view === 'oblique' ? 'reset' : view);

    if (view === 'oblique') {
      harness.camera.position.set(6, -4, 8);
      harness.controls.update();
    }

    harness.fitToModel();
    harness.camera.updateMatrixWorld(true);

    return harness;
  }

  /** 更新一次端帽布局，并把身份、位置和碰撞问题拍成快照。 */
  function snapshot(markers, course, state, camera, width, height, context) {
    markers.update(state);
    markers.layout(camera, width, height);
    const rectangles = spriteRectangles(markers.group, camera, width, height);
    const findings = inspect(rectangles, width, height);
    const ends = getCordEnds(state),
      expectedLabels = ends.map((end) => end.label).sort();

    const actualLabels = rectangles.map((item) => item.label).sort();
    const identityErrors =
      JSON.stringify(expectedLabels) === JSON.stringify(actualLabels) &&
      new Set(actualLabels).size === actualLabels.length
        ? []
        : [{ expectedLabels, actualLabels }];

    const endpointsOutside = ends
      .filter((end) => {
        const p = new THREE.Vector3().fromArray(end.point).project(camera);

        return Math.abs(p.x) > 1 || Math.abs(p.y) > 1 || Math.abs(p.z) > 1;
      })
      .map((end) => end.label);

    return {
      course: course.id,
      ...context,
      viewport: [width, height],
      labelCount: rectangles.length,
      endpointsOutside,
      identityErrors,
      ...findings,
      rectangles,
    };
  }

  // 任一种碰撞、越界、无效值或身份错误，都算这次快照失败。
  const hasFailure = (result) =>
    result.collisions.length ||
    result.outside.length ||
    result.nonFinite.length ||
    result.identityErrors.length;

  /** 把快照并入对应统计，失败时保留精简后的复现信息。 */
  function record(result, kind) {
    const stats = report[kind];
    stats.cases++;
    stats.collisions += result.collisions.length;
    stats.outside += result.outside.length;
    stats.endpointsOutsideCases += Number(result.endpointsOutside.length > 0);

    if (kind === 'normal') {
      stats.labels += result.labelCount;
      stats.nonFinite += result.nonFinite.length;
      stats.identityErrors += result.identityErrors.length;
    }

    if (hasFailure(result)) {
      stats.failedCases++;
      const { rectangles: _, ...compact } = result;
      report[kind === 'normal' ? 'failures' : 'stressFindings'].push(compact);
    }
  }

  for (const course of courses) {
    await course.prepare?.();
    const markers = new CordEndMarkers();

    try {
      for (const progress of progresses) {
        const state = course.getState(progress);

        for (const [width, height] of viewports) {
          for (const view of views) {
            const harness = fittedCamera(state, width, height, view);
            const result = snapshot(markers, course, state, harness.camera, width, height, {
              progress,
              view,
              mode: 'fit',
            });

            record(result, 'normal');

            if (
              course.id === 'plain-weave' &&
              progress === 1 &&
              width === 290 &&
              view === 'reset'
            ) {
              report.reproduction = { ...result, camera: harness.getCameraState() };
            }

            // 故意放大到适配范围之外；端点已经出画的情况另列，不混入正常适配结果。
            if (progress === 1 && ['reset', 'oblique'].includes(view)) {
              harness.camera.zoom = Math.min(4.2, harness.camera.zoom * 2);
              harness.camera.updateProjectionMatrix();
              record(
                snapshot(markers, course, state, harness.camera, width, height, {
                  progress,
                  view,
                  mode: 'zoom-stress',
                  zoom: harness.camera.zoom,
                }),
                'stress',
              );
            }
          }
        }
      }

      if (course.id === 'plain-weave') {
        for (const view of views) {
          const [width, height] = viewports[0];
          const harness = fittedCamera(course.getState(1), width, height, view);
          const temporal = {
            course: course.id,
            view,
            viewport: [width, height],
            from: 0.98,
            to: 1,
            frames: 201,
            maxDisplacement: 0,
            maxDisplacementAt: null,
            repeatDelta: 0,
            failedFrames: 0,
          };

          let previous;

          for (let frame = 0; frame <= 200; frame++) {
            const progress = 0.98 + frame / 10000;
            const result = snapshot(
              markers,
              course,
              course.getState(progress),
              harness.camera,
              width,
              height,
              { progress, view, mode: 'fixed-fit-scrub' },
            );

            record(result, 'normal');
            temporal.failedFrames += Number(Boolean(hasFailure(result)));

            if (previous) {
              for (const rectangle of result.rectangles) {
                const before = previous.rectangles.find((item) => item.label === rectangle.label);

                if (!before) {
                  continue;
                }

                const displacement = Math.hypot(
                  rectangle.center.x - before.center.x,
                  rectangle.center.y - before.center.y,
                );

                if (displacement > temporal.maxDisplacement) {
                  temporal.maxDisplacement = displacement;
                  temporal.maxDisplacementAt = {
                    label: rectangle.label,
                    from: previous.progress,
                    to: progress,
                    before: before.center,
                    after: rectangle.center,
                  };
                }
              }
            }

            // 绕到别的进度再回来，相机与进度相同就该得到相同标签位置。
            if (frame % 25 === 0) {
              snapshot(markers, course, course.getState(0.31), harness.camera, width, height, {});
              const replay = snapshot(
                markers,
                course,
                course.getState(progress),
                harness.camera,
                width,
                height,
                {},
              );

              for (const rectangle of result.rectangles) {
                const repeated = replay.rectangles.find((item) => item.label === rectangle.label);
                temporal.repeatDelta = repeated
                  ? Math.max(
                      temporal.repeatDelta,
                      Math.hypot(
                        rectangle.center.x - repeated.center.x,
                        rectangle.center.y - repeated.center.y,
                      ),
                    )
                  : Infinity;
              }
            }

            previous = result;
          }

          report.temporal.push(temporal);
        }
      }
    } finally {
      disposeMarkers(markers);
    }
  }

  const passed =
    report.normal.failedCases === 0 &&
    report.temporal.every(
      (item) => item.repeatDelta < 1e-7 && item.maxDisplacement < scrubJumpLimit,
    );

  report.passed = passed;

  if (option('report')) {
    await writeFile(option('report'), JSON.stringify(report, null, 2) + '\n');
  }

  console.log(
    `${passed ? 'PASS' : 'FAIL'}: ${courses.length} courses; ${report.normal.cases} fitted/scrub snapshots, ${report.normal.labels} actual Sprite rectangles.`,
  );
  console.log(
    JSON.stringify(
      { normal: report.normal, stress: report.stress, temporal: report.temporal },
      null,
      2,
    ),
  );

  if (!passed) {
    console.error('First failures:', JSON.stringify(report.failures.slice(0, 6), null, 2));
    process.exitCode = 1;
  }
} finally {
  await server.close();

  // 恢复原来的全局环境，检查结束后不留下画布替身。
  if (oldDocument === undefined) {
    delete globalThis.document;
  } else {
    globalThis.document = oldDocument;
  }

  if (oldWindow === undefined) {
    delete globalThis.window;
  } else {
    globalThis.window = oldWindow;
  }
}
