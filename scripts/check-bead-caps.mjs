#!/usr/bin/env node
/**
 * Read-only bead-course end-cap regression check using production meshes.
 *
 *   node scripts/check-bead-caps.mjs
 *   node scripts/check-bead-caps.mjs --course=flower --samples=101 --report=/tmp/caps.json
 *   node scripts/check-bead-caps.mjs --markers-source=/absolute/path/old-cordEnds.ts
 *
 * Default samples: 0, all five step boundaries, .86, .90, and 1 (deduplicated).
 * --samples=N adds N evenly spaced samples including both endpoints; N >= 2.
 * Only canvas painting is stubbed. CordEndMarkers, DynamicCord, updateBeads,
 * mesh draw ranges, world matrices, and bead axial scaling are production code.
 * No browser, WebGL context, source-file rewrite, or expected-pass list is used.
 * This detects mesh intersections/containment, not physical craft correctness.
 */
import { createServer } from 'vite'
import * as THREE from 'three'
import { readFile, writeFile, stat, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { dirname, isAbsolute, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const EPSILON = 1e-7
const PARITY_MERGE_EPSILON = 1e-6
const VECTOR_UNIT_EPSILON = 1e-6
const vector = values => new THREE.Vector3(...values)
const sha256 = data => createHash('sha256').update(data).digest('hex')

function options() {
  const result = {}
  for (const argument of process.argv.slice(2)) {
    if (argument === '--help') {
      console.log('Usage: node scripts/check-bead-caps.mjs [--course=id] [--samples=N] [--report=path] [--markers-source=/absolute/path/cordEnds.ts]')
      process.exit(0)
    }
    const match = /^--(course|samples|report|markers-source)=(.+)$/.exec(argument)
    if (!match) throw new Error(`Unknown or empty option: ${argument}`)
    if (result[match[1]] !== undefined) throw new Error(`Duplicate option: --${match[1]}`)
    result[match[1]] = match[2]
  }
  if (result.samples !== undefined) {
    result.samples = Number(result.samples)
    if (!Number.isSafeInteger(result.samples) || result.samples < 2) throw new Error('--samples must be an integer >= 2')
  }
  if (result['markers-source'] && !isAbsolute(result['markers-source'])) throw new Error('--markers-source must be an absolute path')
  return result
}

function progressSamples(course, count) {
  const values = [0, ...course.steps.map(step => step.time), .86, .90, 1]
  if (count) for (let i = 0; i < count; i++) values.push(i / (count - 1))
  return [...new Set(values)].sort((a, b) => a - b)
}

async function sourceIdentity(files) {
  return Object.fromEntries(await Promise.all(files.map(async file => {
    const absolute = isAbsolute(file) ? file : resolve(root, file)
    const [source, metadata] = await Promise.all([readFile(absolute), stat(absolute)])
    return [file, { sha256: sha256(source), mtime: metadata.mtime.toISOString() }]
  })))
}

function canvasDocument() {
  return {
    createElement(tag) {
      if (tag !== 'canvas') throw new Error(`Unexpected DOM request: ${tag}`)
      const context = {
        clearRect() {}, fillRect() {}, beginPath() {}, roundRect() {}, arc() {},
        moveTo() {}, lineTo() {}, closePath() {}, fill() {}, stroke() {}, fillText() {},
      }
      return { width: 0, height: 0, getContext(kind) {
        if (kind !== '2d') throw new Error(`Unexpected canvas context: ${kind}`)
        return context
      } }
    },
  }
}

/** Respect the active draw range: reusable tube buffers contain unused vertices. */
function meshData(mesh) {
  mesh.updateWorldMatrix(true, false)
  const geometry = mesh.geometry
  const positions = geometry.getAttribute('position'), index = geometry.index
  const start = geometry.drawRange.start
  const limit = Math.min(index?.count ?? positions.count, start + geometry.drawRange.count)
  const used = new Set()
  for (let i = start; i < limit; i++) used.add(index ? index.getX(i) : i)
  const vertices = new Map([...used].map(i => [i,
    new THREE.Vector3().fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld),
  ]))
  const triangles = []
  for (let i = start; i < limit; i += 3) {
    const points = [0, 1, 2].map(j => vertices.get(index ? index.getX(i + j) : i + j))
    triangles.push({ points, box: new THREE.Box3().setFromPoints(points), ordinal: i / 3 })
  }
  const list = [...vertices.values()]
  return { mesh, vertices: list, triangles, box: new THREE.Box3().setFromPoints(list) }
}

const ray = new THREE.Ray(), hit = new THREE.Vector3()
const parityDirection = new THREE.Vector3(.812371, .337921, .475137).normalize()

function edgeHitsTriangle(a, b, triangle) {
  const delta = b.clone().sub(a), length = delta.length()
  if (length < EPSILON) return false
  ray.set(a, delta.divideScalar(length))
  return ray.intersectTriangle(...triangle.points, false, hit) !== null && hit.distanceTo(a) <= length + EPSILON
}

function surfaceIntersections(a, b) {
  const hits = []
  for (const first of a.triangles) for (const second of b.triangles) {
    if (!first.box.intersectsBox(second.box)) continue
    for (let edge = 0; edge < 3; edge++) {
      if (edgeHitsTriangle(first.points[edge], first.points[(edge + 1) % 3], second)
        || edgeHitsTriangle(second.points[edge], second.points[(edge + 1) % 3], first)) {
        hits.push([first.ordinal, second.ordinal, ...hit.toArray()])
        break
      }
    }
  }
  return hits
}

/** Parity containment is used only against closed cap/bead part surfaces. */
function insideMesh(point, data) {
  if (!data.box.containsPoint(point)) return false
  ray.set(point, parityDirection)
  const distances = []
  for (const triangle of data.triangles) {
    if (!ray.intersectTriangle(...triangle.points, false, hit)) continue
    const distance = hit.distanceTo(point)
    if (distance < EPSILON) return false
    distances.push(distance)
  }
  distances.sort((a, b) => a - b)
  let count = 0, last = -Infinity
  for (const distance of distances) if (distance - last > PARITY_MERGE_EPSILON) {
    count++
    last = distance
  }
  return count % 2 === 1
}

function closedCheck(a, b) {
  if (!a.box.intersectsBox(b.box)) return null
  const hits = surfaceIntersections(a, b)
  const insideA = a.vertices.filter(point => insideMesh(point, b)).length
  const insideB = b.vertices.filter(point => insideMesh(point, a)).length
  return hits.length || insideA || insideB ? {
    surfaceTrianglePairs: hits.length, firstPairs: hits.slice(0, 4),
    aVerticesInsideB: insideA, bVerticesInsideA: insideB,
  } : null
}

function createHarness(StudioScene, CordEndMarkers) {
  // Use updateBeads without constructing a renderer. All generated bead geometry
  // and transforms still come from StudioScene's actual implementation.
  const scene = Object.create(StudioScene.prototype)
  Object.assign(scene, {
    scene: new THREE.Group(), beadMeshes: new Map(), beadGeometryCache: new Map(),
    beadLabels: new Map(), labelTextures: new Set(), upAxis: new THREE.Vector3(0, 1, 0),
  })
  return { scene, markers: new CordEndMarkers(), cordEngines: new Map() }
}

function disposeHarness(harness) {
  const geometries = new Set(), materials = new Set()
  for (const group of [harness.scene.scene, harness.markers.group]) group.traverse(object => {
    if (object.geometry) geometries.add(object.geometry)
    if (object.material) for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material)
  })
  for (const geometry of harness.scene.beadGeometryCache.values()) geometries.add(geometry)
  for (const engine of harness.cordEngines.values()) {
    geometries.add(engine.mesh.geometry)
    materials.add(engine.mesh.material)
  }
  for (const geometry of geometries) geometry.dispose()
  for (const material of materials) material.dispose()
  for (const texture of harness.scene.labelTextures) texture.dispose()
  harness.markers.disposeTextures()
}

function tubeData(cord, harness, DynamicCord) {
  let engine = harness.cordEngines.get(cord.id)
  if (!engine) {
    engine = new DynamicCord(new THREE.MeshStandardMaterial())
    harness.cordEngines.set(cord.id, engine)
  }
  engine.update(cord.points, cord.radius, cord.flatness ?? 1, cord.thicknessScales)
  // Read the production class's actual ring resolution, not a copied mesh.
  const trianglesPerSegment = engine.sides * 2
  if (!Number.isSafeInteger(trianglesPerSegment) || trianglesPerSegment <= 0) throw new Error('Cannot determine DynamicCord ring resolution')
  const lengths = [0]
  for (let i = 1; i < cord.points.length; i++) lengths.push(lengths[i - 1] + vector(cord.points[i]).distanceTo(vector(cord.points[i - 1])))
  return { cord, ...meshData(engine.mesh), lengths, total: lengths.at(-1), trianglesPerSegment }
}

function checkCapAgainstCords(cap, tubes, detail) {
  const point = vector(cap.end.point), direction = vector(cap.end.direction)
  let inward = 0
  for (const part of cap.parts) for (const vertex of part.vertices) inward = Math.max(inward, -vertex.clone().sub(point).dot(direction))
  // Exclude only the immediate same-end sleeve, measured from actual transformed
  // cap vertices. Other cords and remote sections of the owner remain testable.
  const sleeve = inward + cap.end.radius + PARITY_MERGE_EPSILON
  detail.ownerSleeveExclusions.push({ label: cap.end.label, length: sleeve })
  const bounds = new THREE.Box3()
  for (const part of cap.parts) bounds.union(part.box)
  const owner = cap.end.id.slice(0, cap.end.id.lastIndexOf(':'))
  const start = cap.end.id.endsWith(':start')
  for (const tube of tubes) {
    if (!tube.box.intersectsBox(bounds)) continue
    const nearby = { ...tube, triangles: tube.triangles.filter(triangle => {
      if (!triangle.box.intersectsBox(bounds)) return false
      if (tube.cord.id !== owner) return true
      const segment = Math.floor(triangle.ordinal / tube.trianglesPerSegment)
      const distance = start ? tube.lengths[segment] : tube.total - tube.lengths[segment + 1]
      return distance > sleeve
    }) }
    if (!nearby.triangles.length) continue
    for (const [partIndex, part] of cap.parts.entries()) {
      const hits = surfaceIntersections(part, nearby)
      let contained
      for (const triangle of nearby.triangles) {
        for (const vertex of triangle.points) if (insideMesh(vertex, part)) {
          contained = { triangle: triangle.ordinal, point: vertex.toArray() }
          break
        }
        if (contained) break
      }
      if (!hits.length && !contained) continue
      detail.capCord.push({
        cap: cap.end.label, part: partIndex, cord: tube.cord.id, owner,
        capEndpoint: cap.end.point, threadRadius: cap.end.radius,
        capWorldScale: part.mesh.getWorldScale(new THREE.Vector3()).toArray(),
        surfaceTrianglePairs: hits.length, firstPairsAndHitCoordinates: hits.slice(0, 4), contained,
        hitSegments: [...new Set(hits.map(value => Math.floor(value[1] / tube.trianglesPerSegment)))].slice(0, 32).map(index => ({
          index, point: tube.cord.points[index],
          arcFromOwnEnd: tube.cord.id === owner ? (start ? tube.lengths[index] : tube.total - tube.lengths[index + 1]) : null,
        })),
      })
    }
  }
}

function markerSnapshot(markers) {
  markers.group.updateMatrixWorld(true)
  const parts = markers.group.children.filter(child => child.isGroup && child.visible).map(cap =>
    cap.children.filter(child => child.isMesh && child.visible).map(mesh => mesh.matrixWorld.elements.slice()))
  // getState omits scale. Include actual part world matrices so seek checks
  // catch a history-dependent cap size or orientation as well as its anchor.
  return JSON.stringify({ state: markers.getState(), parts })
}

function auditSnapshot(course, progress, harness, production) {
  const { markers, scene } = harness
  const { DynamicCord, getCordEnds } = production
  const state = course.getState(progress)
  const cords = [{ id: 'main', points: state.points, radius: state.radius ?? (state.beads ? .025 : .06),
    flatness: state.flatness, thicknessScales: state.thicknessScales }, ...(state.strands ?? [])]
  markers.update(state)
  markers.group.updateMatrixWorld(true)
  scene.baseState = state
  scene.updateBeads(state.beads ?? [])
  scene.scene.updateMatrixWorld(true)
  const beads = [...scene.beadMeshes].filter(([, mesh]) => mesh.visible).map(([id, mesh]) => ({ id, ...meshData(mesh) }))
  const ends = getCordEnds(state), rendered = markers.getState()
  const roots = markers.group.children.filter(child => child.isGroup && child.visible)
  if (roots.length !== ends.length || rendered.length !== ends.length) throw new Error(`Rendered cap count mismatch: ${course.id} @ ${progress}`)
  // getState and child groups share insertion order. Match the current end by
  // label, since conditional end suppression can change getCordEnds ordering.
  const caps = roots.map((capRoot, index) => {
    const end = ends.find(item => item.label === rendered[index].label)
    if (!end) throw new Error(`Unmatched rendered end: ${rendered[index].label}`)
    return { end, parts: capRoot.children.filter(child => child.isMesh && child.visible).map(meshData) }
  })
  const tubes = cords.map(cord => tubeData(cord, harness, DynamicCord))
  const detail = {
    course: course.id, name: course.name, progress, count: ends.length, cordCount: cords.length,
    labels: ends.map(end => end.label), capCap: [], capCord: [], capBead: [], ownerSleeveExclusions: [],
    finite: ends.every(end => [...end.point, ...end.direction].every(Number.isFinite)),
    maxUnitError: Math.max(0, ...ends.map(end => Math.abs(Math.hypot(...end.direction) - 1))),
  }
  for (const cap of caps) {
    checkCapAgainstCords(cap, tubes, detail)
    for (const [partIndex, part] of cap.parts.entries()) for (const bead of beads) {
      const collision = closedCheck(part, bead)
      if (!collision) continue
      const model = state.beads.find(item => item.id === bead.id)
      detail.capBead.push({
        cap: cap.end.label, part: partIndex, capEndpoint: cap.end.point,
        capScale: part.mesh.getWorldScale(new THREE.Vector3()).toArray(),
        bead: bead.id, beadPosition: model.position, beadAxis: model.axis, beadRadius: model.radius,
        axialScale: model.axialScale ?? 1, holeRadius: Math.max(.055, Math.min(.12, model.radius * .36)), ...collision,
      })
    }
  }
  for (let i = 0; i < caps.length; i++) for (let j = i + 1; j < caps.length; j++) {
    for (const [first, a] of caps[i].parts.entries()) for (const [second, b] of caps[j].parts.entries()) {
      const collision = closedCheck(a, b)
      if (collision) detail.capCap.push({ labels: [caps[i].end.label, caps[j].end.label], parts: [first, second], ...collision })
    }
  }
  const history = markerSnapshot(markers)
  markers.update(course.getState(1 - progress))
  markers.update(course.getState(progress))
  detail.seekStable = history === markerSnapshot(markers)
  detail.passed = !detail.capCap.length && !detail.capCord.length && !detail.capBead.length
    && detail.finite && detail.maxUnitError <= VECTOR_UNIT_EPSILON && detail.seekStable
  return detail
}

async function main() {
  const args = options(), markersSource = args['markers-source']
  // Track all lesson sources so newly registered bead courses are covered too.
  const lessonFiles = (await readdir(resolve(root, 'src/lessons'))).filter(file => file.endsWith('.ts')).map(file => `src/lessons/${file}`)
  const files = [...lessonFiles, 'src/cordEnds.ts', 'src/scene.ts', ...(markersSource ? [markersSource] : [])]
  const sourceBefore = await sourceIdentity(files)
  const virtualScene = resolve(root, 'src/__bead_cap_scene_audit__.ts')
  const virtualMarkers = resolve(root, 'src/__bead_cap_markers_audit__.ts')
  const server = await createServer({
    root, configFile: false, appType: 'custom',
    // Data/TS modules need neither the app's Vue plugin nor a dev websocket.
    // Disable discovery so this audit cannot invalidate the running app's cache.
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    plugins: [{
      name: 'read-only-bead-cap-mesh-audit',
      resolveId(id) {
        if (id === '/src/__bead_cap_scene_audit__.ts') return virtualScene
        if (id === '/src/__bead_cap_markers_audit__.ts' && markersSource) return virtualMarkers
      },
      async load(id) {
        if (id === virtualScene) return await readFile(resolve(root, 'src/scene.ts'), 'utf8') + '\nexport { DynamicCord };\n'
        if (id === virtualMarkers && markersSource) return readFile(markersSource, 'utf8')
      },
    }],
  })
  const previousDocument = globalThis.document
  globalThis.document = canvasDocument()
  const snapshots = [], failures = []
  try {
    const { COURSES } = await server.ssrLoadModule('/src/lessons/catalog.ts')
    const { CordEndMarkers, getCordEnds } = await server.ssrLoadModule(markersSource ? '/src/__bead_cap_markers_audit__.ts' : '/src/cordEnds.ts')
    const { StudioScene, DynamicCord } = await server.ssrLoadModule('/src/__bead_cap_scene_audit__.ts')
    const courses = COURSES.filter(course => course.category === 'beads' && (!args.course || course.id === args.course))
    if (!courses.length) throw new Error(args.course ? `No registered bead course: ${args.course}` : 'No registered bead courses')
    for (const course of courses) {
      const harness = createHarness(StudioScene, CordEndMarkers)
      try {
        for (const progress of progressSamples(course, args.samples)) {
          const detail = auditSnapshot(course, progress, harness, { DynamicCord, getCordEnds })
          snapshots.push(detail)
          if (!detail.passed) failures.push(detail)
        }
      } finally { disposeHarness(harness) }
      const checked = snapshots.filter(snapshot => snapshot.course === course.id)
      console.log(`${checked.every(snapshot => snapshot.passed) ? 'PASS' : 'FAIL'} ${course.id}: ${checked.length} snapshots, ${checked.filter(snapshot => !snapshot.passed).length} failed`)
    }
    const sourceAfter = await sourceIdentity(files)
    const changedFiles = files.filter(file => sourceBefore[file].sha256 !== sourceAfter[file].sha256)
    const report = {
      time: new Date().toISOString(), markersSource: markersSource ?? null,
      markersSha256: sourceBefore[markersSource ?? 'src/cordEnds.ts'].sha256,
      sampling: { critical: '0, step times, .86, .90, 1', additionalUniformSamples: args.samples ?? 0 },
      tolerances: { intersection: EPSILON, parityMerge: PARITY_MERGE_EPSILON, directionUnit: VECTOR_UNIT_EPSILON },
      method: 'Production CordEndMarkers part meshes and matrixWorld; production DynamicCord active tube geometry; production updateBeads drilled meshes including axialScale. Triangle-edge intersections and closed-part parity containment. Only the actual same-end sleeve is excluded by inward cap extent plus cord radius; other cords are never excluded.',
      courses: courses.map(course => ({ id: course.id, name: course.name })),
      sourceBefore, sourceAfter, changedFiles, snapshots, failures,
      passed: changedFiles.length === 0 && failures.length === 0,
    }
    if (args.report) await writeFile(resolve(args.report), JSON.stringify(report, null, 2) + '\n')
    console.log(`${report.passed ? 'PASS' : 'FAIL'}: ${courses.length} bead courses, ${snapshots.length} snapshots, ${failures.length} failed snapshots; ${changedFiles.length} source changes during audit.`)
    if (changedFiles.length) console.error(`Source changed during audit: ${changedFiles.join(', ')}`)
    if (!report.passed) process.exitCode = 1
  } finally {
    if (previousDocument === undefined) delete globalThis.document
    else globalThis.document = previousDocument
    await server.close()
  }
}

main().catch(error => {
  console.error(`FAIL: ${error.stack ?? error}`)
  process.exitCode = 1
})
