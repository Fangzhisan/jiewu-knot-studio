import { createServer } from 'vite'
import * as THREE from 'three'
import { fileURLToPath } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// Exercise the production component, not a second implementation of its layout.
// This checks full Sprite quads (slightly stricter than their rounded painted
// borders); it does not replace browser checks of font rendering or HTML overlays.
// node scripts/check-end-labels.mjs --report=/tmp/end-labels.json
// --course=plain-weave limits the catalog. --markers-source=/tmp/old.ts permits
// read-only before/after regression comparisons without replacing project files.
const root = fileURLToPath(new URL('..', import.meta.url))
const option = name => process.argv.find(value => value.startsWith(`--${name}=`))?.slice(name.length + 3)
const source = option('markers-source')
const virtualSource = resolve(root, 'src/__end_labels_component_under_test__.ts')
const tolerance = .5 // CSS pixels; ignores only subpixel numerical contacts.
const scrubJumpLimit = 2 // CSS pixels per .0001 progress: flags visible discontinuities.
const viewports = [[290, 438], [360, 600], [960, 600], [1440, 850]]
const views = ['reset', 'top', 'front', 'oblique']
const progresses = [0, .82, 1]

// CanvasTexture construction/painting needs only this small 2D surface. Capture
// the actual painted identifier to associate the real Sprite with its label.
const oldDocument = globalThis.document
const oldWindow = globalThis.window
const canvasDocument = {
  createElement(tag) {
    if (tag !== 'canvas') throw new Error(`Unexpected DOM element: ${tag}`)
    const canvas = { width: 0, height: 0, paintedLabel: '' }
    const context = {
      clearRect() {}, beginPath() {}, roundRect() {}, fill() {}, stroke() {},
      fillText(text) { canvas.paintedLabel = text },
    }
    canvas.getContext = kind => kind === '2d' ? context : null
    return canvas
  },
}

const server = await createServer({
  root, configFile: false, appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  plugins: source ? [{
    name: 'read-only-end-label-baseline',
    resolveId(id) { if (id === '/src/__end_labels_component_under_test__.ts') return virtualSource },
    async load(id) { if (id === virtualSource) return readFile(source, 'utf8') },
  }] : [],
})
globalThis.document = canvasDocument
globalThis.window = { devicePixelRatio: 1 }

const report = {
  time: new Date().toISOString(), source: source ?? 'src/cordEnds.ts',
  method: 'Actual CordEndMarkers Sprite world transforms; actual StudioScene resize/setView/fitToModel methods; no WebGL or copied layout solver.',
  tolerancePixels: tolerance, scrubJumpLimitPixels: scrubJumpLimit, viewports, views, progresses,
  normal: { cases: 0, labels: 0, failedCases: 0, collisions: 0, outside: 0, nonFinite: 0, identityErrors: 0, endpointsOutsideCases: 0 },
  stress: { cases: 0, failedCases: 0, collisions: 0, outside: 0, endpointsOutsideCases: 0 },
  failures: [], stressFindings: [], temporal: [], reproduction: null,
}

function project(point, camera, width, height) {
  const ndc = point.clone().project(camera)
  return { x: (ndc.x + 1) * width / 2, y: (1 - ndc.y) * height / 2, z: ndc.z }
}

// A Three.js Sprite is a camera-facing quad, independent of its object's local
// rotation. Project its four actual world-size corners using camera basis vectors.
function spriteRectangles(group, camera, width, height) {
  group.updateMatrixWorld(true)
  const right = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 0)
  const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1)
  const rectangles = []
  group.traverseVisible(sprite => {
    if (!sprite.isSprite) return
    const position = sprite.getWorldPosition(new THREE.Vector3())
    const scale = sprite.getWorldScale(new THREE.Vector3())
    const angle = sprite.material.rotation, cos = Math.cos(angle), sin = Math.sin(angle)
    const corners = []
    for (const x of [0, 1]) for (const y of [0, 1]) {
      const dx = (x - sprite.center.x) * scale.x, dy = (y - sprite.center.y) * scale.y
      const corner = position.clone().addScaledVector(right, cos * dx - sin * dy).addScaledVector(up, sin * dx + cos * dy)
      corners.push(project(corner, camera, width, height))
    }
    rectangles.push({
      label: sprite.material.map.image.paintedLabel,
      left: Math.min(...corners.map(p => p.x)), right: Math.max(...corners.map(p => p.x)),
      top: Math.min(...corners.map(p => p.y)), bottom: Math.max(...corners.map(p => p.y)),
      center: project(position, camera, width, height),
    })
  })
  return rectangles
}

function inspect(rectangles, width, height) {
  const collisions = [], outside = [], nonFinite = []
  for (let i = 0; i < rectangles.length; i++) {
    const a = rectangles[i]
    if (![a.left, a.right, a.top, a.bottom, a.center.z].every(Number.isFinite)) nonFinite.push(a)
    if (a.left < -tolerance || a.right > width + tolerance || a.top < -tolerance || a.bottom > height + tolerance) outside.push(a)
    for (let j = i + 1; j < rectangles.length; j++) {
      const b = rectangles[j]
      const dx = Math.min(a.right, b.right) - Math.max(a.left, b.left)
      const dy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)
      if (dx > tolerance && dy > tolerance) collisions.push({ labels: [a.label, b.label], overlap: [dx, dy], rectangles: [a, b] })
    }
  }
  return { collisions, outside, nonFinite }
}

function disposeMarkers(markers) {
  const geometries = new Set(), materials = new Set()
  markers.group.traverse(object => {
    if (object.geometry) geometries.add(object.geometry)
    for (const material of Array.isArray(object.material) ? object.material : object.material ? [object.material] : []) materials.add(material)
  })
  markers.disposeTextures()
  for (const geometry of geometries) geometry.dispose()
  for (const material of materials) material.dispose()
}

try {
  const { COURSES } = await server.ssrLoadModule('/src/lessons/catalog.ts')
  const { CordEndMarkers, getCordEnds } = await server.ssrLoadModule(source ? '/src/__end_labels_component_under_test__.ts' : '/src/cordEnds.ts')
  const { StudioScene } = await server.ssrLoadModule('/src/scene.ts')
  const courses = COURSES.filter(course => !option('course') || course.id === option('course'))
  if (!courses.length) throw new Error(`No course matching ${option('course')}`)
  report.courseCount = courses.length

  // Bypass only WebGL construction. Camera sizing, presets and model fitting
  // execute the same production methods used by the Fit button.
  function fittedCamera(state, width, height, view) {
    const harness = Object.create(StudioScene.prototype)
    harness.camera = new THREE.OrthographicCamera(-5, 5, 3.6, -3.6, .05, 80)
    harness.controls = {
      target: new THREE.Vector3(), enableDamping: true, minZoom: .35, maxZoom: 4.2,
      update() { harness.camera.lookAt(this.target); harness.camera.updateMatrixWorld(true) },
    }
    harness.canvas = { getBoundingClientRect: () => ({ width, height }) }
    harness.renderer = { setSize() {}, getPixelRatio: () => 1 }
    harness.requestRender = () => {}
    harness.baseState = state; harness.disposed = false; harness.contextLost = false
    harness.resize(); harness.setView(view === 'oblique' ? 'reset' : view)
    if (view === 'oblique') {
      harness.camera.position.set(6, -4, 8)
      harness.controls.update()
    }
    harness.fitToModel()
    harness.camera.updateMatrixWorld(true)
    return harness
  }

  function snapshot(markers, course, state, camera, width, height, context) {
    markers.update(state); markers.layout(camera, width, height)
    const rectangles = spriteRectangles(markers.group, camera, width, height)
    const findings = inspect(rectangles, width, height)
    const ends = getCordEnds(state), expectedLabels = ends.map(end => end.label).sort()
    const actualLabels = rectangles.map(item => item.label).sort()
    const identityErrors = JSON.stringify(expectedLabels) === JSON.stringify(actualLabels) && new Set(actualLabels).size === actualLabels.length
      ? [] : [{ expectedLabels, actualLabels }]
    const endpointsOutside = ends.filter(end => {
      const p = new THREE.Vector3().fromArray(end.point).project(camera)
      return Math.abs(p.x) > 1 || Math.abs(p.y) > 1 || Math.abs(p.z) > 1
    }).map(end => end.label)
    return { course: course.id, ...context, viewport: [width, height], labelCount: rectangles.length, endpointsOutside, identityErrors, ...findings, rectangles }
  }

  const hasFailure = result => result.collisions.length || result.outside.length || result.nonFinite.length || result.identityErrors.length

  function record(result, kind) {
    const stats = report[kind]
    stats.cases++; stats.collisions += result.collisions.length; stats.outside += result.outside.length
    stats.endpointsOutsideCases += Number(result.endpointsOutside.length > 0)
    if (kind === 'normal') { stats.labels += result.labelCount; stats.nonFinite += result.nonFinite.length; stats.identityErrors += result.identityErrors.length }
    if (hasFailure(result)) {
      stats.failedCases++
      const { rectangles: _, ...compact } = result
      report[kind === 'normal' ? 'failures' : 'stressFindings'].push(compact)
    }
  }

  for (const course of courses) {
    await course.prepare?.()
    const markers = new CordEndMarkers()
    try {
      for (const progress of progresses) {
        const state = course.getState(progress)
        for (const [width, height] of viewports) for (const view of views) {
          const harness = fittedCamera(state, width, height, view)
          const result = snapshot(markers, course, state, harness.camera, width, height, { progress, view, mode: 'fit' })
          record(result, 'normal')
          if (course.id === 'plain-weave' && progress === 1 && width === 290 && view === 'reset') {
            report.reproduction = { ...result, camera: harness.getCameraState() }
          }
          // Zoom beyond fit intentionally; out-of-frame endpoints are identified
          // separately and never silently counted as a normal fitted layout.
          if (progress === 1 && ['reset', 'oblique'].includes(view)) {
            harness.camera.zoom = Math.min(4.2, harness.camera.zoom * 2)
            harness.camera.updateProjectionMatrix()
            record(snapshot(markers, course, state, harness.camera, width, height, { progress, view, mode: 'zoom-stress', zoom: harness.camera.zoom }), 'stress')
          }
        }
      }
      if (course.id === 'plain-weave') {
        for (const view of views) {
          const [width, height] = viewports[0]
          const harness = fittedCamera(course.getState(1), width, height, view)
          const temporal = { course: course.id, view, viewport: [width, height], from: .98, to: 1, frames: 201, maxDisplacement: 0, maxDisplacementAt: null, repeatDelta: 0, failedFrames: 0 }
          let previous
          for (let frame = 0; frame <= 200; frame++) {
            const progress = .98 + frame / 10000
            const result = snapshot(markers, course, course.getState(progress), harness.camera, width, height, { progress, view, mode: 'fixed-fit-scrub' })
            record(result, 'normal')
            temporal.failedFrames += Number(Boolean(hasFailure(result)))
            if (previous) for (const rectangle of result.rectangles) {
              const before = previous.rectangles.find(item => item.label === rectangle.label)
              if (!before) continue
              const displacement = Math.hypot(rectangle.center.x - before.center.x, rectangle.center.y - before.center.y)
              if (displacement > temporal.maxDisplacement) {
                temporal.maxDisplacement = displacement
                temporal.maxDisplacementAt = { label: rectangle.label, from: previous.progress, to: progress, before: before.center, after: rectangle.center }
              }
            }
            // Replay after an unrelated seek: the same camera/progress must
            // produce the same actual Sprite positions, regardless of history.
            if (frame % 25 === 0) {
              snapshot(markers, course, course.getState(.31), harness.camera, width, height, {})
              const replay = snapshot(markers, course, course.getState(progress), harness.camera, width, height, {})
              for (const rectangle of result.rectangles) {
                const repeated = replay.rectangles.find(item => item.label === rectangle.label)
                temporal.repeatDelta = repeated ? Math.max(temporal.repeatDelta, Math.hypot(rectangle.center.x - repeated.center.x, rectangle.center.y - repeated.center.y)) : Infinity
              }
            }
            previous = result
          }
          report.temporal.push(temporal)
        }
      }
    } finally { disposeMarkers(markers) }
  }
  const passed = report.normal.failedCases === 0 && report.temporal.every(item => item.repeatDelta < 1e-7 && item.maxDisplacement < scrubJumpLimit)
  report.passed = passed
  if (option('report')) await writeFile(option('report'), JSON.stringify(report, null, 2) + '\n')
  console.log(`${passed ? 'PASS' : 'FAIL'}: ${courses.length} courses; ${report.normal.cases} fitted/scrub snapshots, ${report.normal.labels} actual Sprite rectangles.`)
  console.log(JSON.stringify({ normal: report.normal, stress: report.stress, temporal: report.temporal }, null, 2))
  if (!passed) {
    console.error('First failures:', JSON.stringify(report.failures.slice(0, 6), null, 2))
    process.exitCode = 1
  }
} finally {
  await server.close()
  if (oldDocument === undefined) delete globalThis.document
  else globalThis.document = oldDocument
  if (oldWindow === undefined) delete globalThis.window
  else globalThis.window = oldWindow
}
