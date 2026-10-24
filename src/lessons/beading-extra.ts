import type { Course, LessonBead, LessonState, LessonStep, Vec3 } from './types'

/** Original, reversible stitch diagrams. Bore passages are straight and the
 * rounded exterior bridges are authored explicitly; do not respline them.
 * A teaching jig holds the loose beads until the final gathering chapter. */
const Y: Vec3 = [0, 1, 0]
const Z: Vec3 = [0, 0, 1]
const GATHER = 0.82
const clamp = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0))
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t) }
const gather = (p: number) => ease((clamp(p) - GATHER) / (1 - GATHER))
const cp = (p: Vec3): Vec3 => [...p]
const add = (a: Vec3, b: Vec3, s = 1): Vec3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]
const mix = (a: Vec3, b: Vec3, t: number): Vec3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const dist = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const unit = (a: Vec3): Vec3 => { const d = Math.hypot(...a); return a.map(n => n / d) as Vec3 }
const bead = (id: string, position: Vec3, axis: Vec3, radius: number, color: string, label = ''): LessonBead => ({ id, position, axis, radius, color, label, active: false })
interface Passage { id: string; start: number; end: number }

class Trace {
  points: Vec3[]
  distances = [0]
  passages: Passage[] = []
  length = 0
  tangent: Vec3
  constructor(start: Vec3, tangent: Vec3) { this.points = [cp(start)]; this.tangent = cp(tangent) }
  get end() { return this.points[this.points.length - 1]! }
  push(point: Vec3) {
    const d = dist(this.end, point)
    if (d < 1e-10) return
    this.length += d; this.points.push(cp(point)); this.distances.push(this.length)
  }
  line(end: Vec3) {
    const start = cp(this.end), count = Math.max(1, Math.ceil(dist(start, end) / 0.012))
    for (let i = 1; i <= count; i++) this.push(mix(start, end, i / count))
  }
  curve(end: Vec3, axis: Vec3, maxHandle = 0.05) {
    const start = cp(this.end), span = dist(start, end)
    if (span < 1e-9) { this.tangent = cp(axis); return }
    const h = Math.min(maxHandle, span * 0.23)
    const control = [start, add(start, this.tangent, h), add(start, this.tangent, 2 * h), add(end, axis, -2 * h), add(end, axis, -h), end]
    const count = Math.max(32, Math.ceil((span + h * 4) / 0.01))
    for (let i = 1; i <= count; i++) {
      const t = i / count, u = 1 - t
      const weights = [u ** 5, 5 * u ** 4 * t, 10 * u ** 3 * t ** 2, 10 * u ** 2 * t ** 3, 5 * u * t ** 4, t ** 5]
      this.push([0, 1, 2].map(k => control.reduce((sum, p, j) => sum + p[k]! * weights[j]!, 0)) as Vec3)
    }
    this.tangent = cp(axis)
  }
  arc(fn: (angle: number) => Vec3, axis: Vec3, maxAngle = Math.PI / 2) {
    const n = 24
    for (let i = 1; i <= n; i++) this.push(fn(maxAngle * i / n))
    this.tangent = cp(axis)
  }
  aligned(end: Vec3, axis: Vec3) {
    const chord = add(end, this.end, -1), span = Math.hypot(...chord)
    return span < 1e-8 || (dot(this.tangent, axis) > 0.99999 && dot(chord, axis) > 0 && Math.abs(dot(chord, axis) - span) < 1e-7)
  }
  planarBridge(end: Vec3, axis: Vec3, radius: number, layer: number) {
    if (this.aligned(end, axis)) { this.line(end); this.tangent = cp(axis); return }
    const start = cp(this.end), begin = cp(this.tangent), side = Math.sign(layer)
    this.arc(a => add(add(start, begin, radius * Math.sin(a)), Z, side * radius * (1 - Math.cos(a))), [0, 0, side])
    this.line([this.end[0], this.end[1], layer])
    this.curve([end[0] - axis[0] * radius, end[1] - axis[1] * radius, layer], [0, 0, -side])
    this.line([end[0] - axis[0] * radius, end[1] - axis[1] * radius, end[2] + side * radius])
    this.arc(a => add(add(end, axis, -radius * Math.cos(a)), Z, side * radius * (1 - Math.sin(a))), axis)
  }
  bore(item: LessonBead, axis: Vec3, lane: Vec3, half: number) {
    const center = add(item.position, lane), start = this.length
    this.line(add(center, axis, half))
    this.tangent = cp(axis)
    this.passages.push({ id: item.id, start, end: this.length })
  }
  visit(item: LessonBead, direction: number, lane: number, half: number, turn: number, layer: number) {
    const axis = add([0, 0, 0], item.axis, direction), offset: Vec3 = [0, 0, lane]
    this.planarBridge(add(add(item.position, offset), axis, -half), axis, turn, layer)
    this.bore(item, axis, offset, half)
  }
}

interface Model { beads: LessonBead[]; path: Trace; marks: number[] }
function prefix(path: Trace, length: number) {
  const result = [cp(path.points[0]!)]
  for (let i = 1; i < path.points.length; i++) {
    const end = path.distances[i]!, start = path.distances[i - 1]!
    if (end <= length + 1e-10) result.push(cp(path.points[i]!))
    else { if (length > start + 1e-10) result.push(mix(path.points[i - 1]!, path.points[i]!, (length - start) / (end - start))); break }
  }
  return result
}
function state(p: number, model: Model, steps: readonly LessonStep[], radius: number, color: string): LessonState {
  p = clamp(p)
  let index = 0
  while (index + 1 < steps.length && p >= steps[index + 1]!.time) index++
  const from = steps[index]!.time, to = steps[index + 1]?.time ?? 1
  const length = model.marks[index]! + (model.marks[index + 1]! - model.marks[index]!) * ease((p - from) / (to - from))
  const points = prefix(model.path, length), active = p < GATHER ? model.path.passages.find(v => length <= v.end + 1e-9)?.id : undefined
  return {
    points, tip: cp(points[points.length - 1]!), checkpoint: index, color, radius, hideMainTip: true, showEndLabels: false,
    beads: model.beads.map(v => ({ ...v, position: cp(v.position), axis: cp(v.axis), active: v.id === active, labelOpacity: 1 - gather(p) })),
  }
}

const NETTING_STEPS: readonly LessonStep[] = [
  { time: 0, title: '排出第一列网边', instruction: '绿色珠是网格交点。先穿一颗交点珠，再重复三颗蓝珠、一颗交点珠，向下建立第一列。' },
  { time: 0.22, title: '在底部转回', instruction: '穿到最下方的交点后，加三颗蓝珠，回穿刚才的交点珠，形成转弯的小环。' },
  { time: 0.42, title: '连接下方网格', instruction: '加入三颗蓝珠、一颗新交点珠、三颗蓝珠，再穿回第一列的中间交点，闭合下方网格。' },
  { time: 0.62, title: '再连接一格', instruction: '重复三蓝、一绿、三蓝的七珠组合，穿回最上方交点。共有的绿色珠把两格连接起来。' },
  { time: GATHER, title: '均匀收紧网片', instruction: '轻拉工作端并整理交点，让相邻珠子靠拢。网眼保留，蓝珠之间的松线逐渐收短；本课演示网片单元，不含收尾结。' },
]
function makeNetting(g: number): Model {
  const pitch = 0.34 + (0.211 - 0.34) * g, d = 4 * pitch / Math.sqrt(2), r = 0.105
  const positions: Vec3[] = [[0, 2 * d, 0], [-d, d, 0], [0, 0, 0], [-d, -d, 0], [0, -2 * d, 0], [d, -d, 0], [d, d, 0]]
  const junctions = positions.map((p, i) => bead(`net-j-${i}`, p, Y, r, '#83a79c', String(i + 1)))
  const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2], [2, 6], [6, 0]]
  const runs = edges.map(([a, b], i) => {
    const start = positions[a!]!, end = positions[b!]!, axis = unit(add(end, start, -1))
    return [1, 2, 3].map(k => bead(`net-e-${i}-${k}`, mix(start, end, k / 4), axis, r, '#aacadb'))
  })
  const s = pitch / Math.sqrt(2), y = positions[4]![1]
  const picot = [bead('net-turn-0', [s, y - s, 0], Y, r, '#aacadb'), bead('net-turn-1', [0, y - 2 * s, 0], [-1, 0, 0], r, '#aacadb'), bead('net-turn-2', [-s, y - s, 0], Y, r, '#aacadb')]
  const beads = [...junctions, ...runs.flat(), ...picot]
  const path = new Trace([0, positions[0]![1] + 0.55 + g * 0.15, -0.015], [0, -1, 0])
  path.line([0, positions[0]![1] + 0.3, -0.015])
  const marks = [path.length]
  const visit = (b: LessonBead, direction: number, lane: number) => path.visit(b, direction, lane, 0.0555, 0.05, lane < 0 ? -0.16 : 0.16)
  visit(junctions[0]!, -1, -0.015)
  for (let i = 0; i < 4; i++) {
    for (const b of runs[i]!) visit(b, 1, -0.015)
    visit(junctions[i + 1]!, -1, -0.015)
    if (i === 1) marks.push(path.length)
  }
  visit(picot[0]!, -1, -0.015); visit(picot[1]!, 1, -0.015); visit(picot[2]!, 1, -0.015)
  visit(junctions[4]!, 1, 0.015); marks.push(path.length)
  for (let i = 4; i < 8; i++) {
    for (const b of runs[i]!) visit(b, 1, 0.015)
    visit(junctions[edges[i]![1]!]!, 1, 0.015)
    if (i === 5) marks.push(path.length)
  }
  // Fan out the two free ends after the shared junction. Their ferrules
  // must not overlap or sit against the other tail in the finished sample.
  path.curve([0.2, positions[0]![1] + 0.35, 0.015], Y, 0.08)
  path.line([0.2, positions[0]![1] + 0.55 + 0.15 * g, 0.015]); marks.push(path.length, path.length)
  return { beads, path, marks }
}
const nettingLoose = makeNetting(0)

const BRICK_STEPS: readonly LessonStep[] = [
  { time: 0, title: '从梯式底行开始', instruction: '先备好五颗珠的梯式底行，让工作线从右侧珠的上孔穿出。开始新一行时，先穿第一颗新珠。' },
  { time: 0.16, title: '行首加入两颗珠', instruction: '再穿第二颗新珠。砖式针每行的开头用两颗珠，之后每次只加一颗。' },
  { time: 0.34, title: '钩住下方线桥', instruction: '把针从底行两珠之间的线桥下穿过，再由下向上回穿第二颗新珠。旋转视角可看清线桥背后的绕行。' },
  { time: 0.54, title: '逐颗接成砖式行', instruction: '每次加一颗珠，穿过下一个线桥下方，再向上回穿新珠。针钩住的是已有线桥，而不是再穿底行珠孔。' },
  { time: GATHER, title: '收紧错位珠片', instruction: '逐个收短钩住线桥的线圈，整理成上下错开半颗珠的砖墙排列。珠子靠拢，外沿保留真实工作线与线尾。' },
]
function makeBrick(g: number): Model {
  const pitch = 0.64 + (0.361 - 0.64) * g, row = 0.9 + (Math.sqrt(3) * 0.361 / 2 - 0.9) * g
  const bottom = Array.from({ length: 5 }, (_, i) => bead(`brick-base-${i}`, [(i - 2) * pitch, -row / 2, 0], Y, 0.18, '#b9c5cf', String(i + 1)))
  const top = Array.from({ length: 5 }, (_, i) => bead(`brick-new-${i}`, [(i - 1.5) * pitch, row / 2, 0], Y, 0.18, '#c29e81', String(i + 6)))
  const path = new Trace(add(add(bottom[0]!.position, [0, 0, -0.011]), Y, -0.65 - g * 0.12), Y)
  const counts = new Map<string, number>(), anchors = new Map<number, Vec3>()
  let previous: LessonBead | undefined, previousLane = -0.011
  const smoother = (n: number) => { const t = clamp(n); return t ** 3 * (10 - 15 * t + 6 * t * t) }
  const visit = (item: LessonBead, direction: number, laneOverride?: number) => {
    const count = counts.get(item.id) ?? 0; counts.set(item.id, count + 1)
    const lane = laneOverride ?? -0.011 + count * 0.011, axis: Vec3 = [0, direction, 0], half = 0.16, turn = 0.04
    const entry = add(add(item.position, [0, 0, lane]), axis, -half)
    const sameRow = previous && previous.id.split('-')[1] === item.id.split('-')[1]
    if (sameRow) {
      const start = cp(path.end), side = path.tangent[1], sx = Math.sign(entry[0] - start[0]), foundation = item.id.startsWith('brick-base-')
      const raw: Vec3[] = [[start[0], start[1], 0]], distances = [0]
      const append = (p: Vec3) => { distances.push(distances.at(-1)! + dist(raw.at(-1)!, p)); raw.push(p) }
      const rise = foundation ? 0.025 : turn
      for (let i = 1; i <= 32; i++) { const t = Math.PI / 2 * i / 32; append([start[0] + sx * turn * (1 - Math.cos(t)), start[1] + side * rise * Math.sin(t), 0]) }
      const x0 = raw.at(-1)![0], x1 = entry[0] - sx * turn, y = start[1] + side * rise
      for (let i = 1; i <= 128; i++) { const t = i / 128; append([x0 + (x1 - x0) * t, y - side * (foundation ? 0.08 : 0) * Math.sin(Math.PI * t) ** 4, 0]) }
      for (let i = 1; i <= 32; i++) { const t = Math.PI / 2 * i / 32; append([entry[0] - sx * turn * (1 - Math.sin(t)), entry[1] - axis[1] * rise * Math.cos(t), 0]) }
      const total = distances.at(-1)!
      for (let i = 1; i < raw.length; i++) {
        const q = raw[i]!, s = distances[i]! / total
        if (foundation && side > 0) {
          // The triangular gap between three round beads is approached in
          // depth. Only the small shoulder crossing is lifted; the actual
          // stitch anchor stays in the interstice instead of on a wide loop.
          const pair = Math.min(Number(previous!.id.split('-').at(-1)), Number(item.id.split('-').at(-1))), above = top[pair]!
          const clearanceSquared = 0.205 ** 2 - ((q[0] - above.position[0]) * 0.361 / pitch) ** 2 - (q[1] + row / 2 - Math.sqrt(3) * 0.361 / 2) ** 2
          const lift = Math.sqrt((clearanceSquared + Math.sqrt(clearanceSquared ** 2 + 0.000064)) / 2)
          q[2] = -g * lift * smoother(s / 0.08) * smoother((1 - s) / 0.08)
        }
      }
      for (let i = 1; i < raw.length; i++) {
        const s = distances[i]! / total, tangent = unit(add(raw[Math.min(i + 1, raw.length - 1)]!, raw[i - 1]!, -1))
        const scale = i === raw.length - 1 ? 1 : 1 / Math.max(0.1, Math.hypot(tangent[0], tangent[1]))
        const q = add(raw[i]!, Z, (previousLane + (lane - previousLane) * smoother(s)) * scale)
        path.push(q)
        if (foundation && side > 0 && i === 96) {
          const pair = Math.min(Number(previous!.id.split('-').at(-1)), Number(item.id.split('-').at(-1)))
          if (!anchors.has(pair)) anchors.set(pair, cp(q))
        }
      }
      path.tangent = cp(axis)
    } else if (path.aligned(entry, axis)) { path.line(entry); path.tangent = cp(axis) }
    else path.planarBridge(entry, axis, 0.04, 0.13)
    path.bore(item, axis, [0, 0, lane], half)
    previous = item; previousLane = lane
  }
  visit(bottom[0]!, 1); visit(bottom[1]!, -1); visit(bottom[0]!, 1); visit(bottom[1]!, -1)
  for (let i = 2; i < 5; i++) { const direction = i % 2 ? -1 : 1; visit(bottom[i]!, direction); visit(bottom[i - 1]!, -direction); visit(bottom[i]!, direction) }
  const marks = [path.length]
  visit(top[4]!, 1, -0.03); marks.push(path.length)
  visit(top[3]!, -1, -0.03); marks.push(path.length)
  const hook = (item: LessonBead, pair: number) => {
    const anchor = anchors.get(pair)!, start = cp(path.end), radius = 0.075 - 0.03 * g, turn = 0.022, y = anchor[1] - 0.002
    // This single U passes behind and below the foundation thread, then
    // returns through the new bead. The foundation lies inside its opening.
    path.line([item.position[0], y + turn * 2, -0.03])
    const departure = cp(path.end)
    path.arc(a => [departure[0], departure[1] - turn * Math.sin(a), departure[2] - turn * (1 - Math.cos(a))], [0, 0, -1])
    path.line([item.position[0], y + turn, anchor[2] - radius + turn])
    const corner = cp(path.end)
    path.arc(a => [corner[0], corner[1] - turn * (1 - Math.cos(a)), corner[2] - turn * Math.sin(a)], [0, -1, 0])
    path.arc(a => [item.position[0], y - radius * Math.sin(a), anchor[2] - radius * Math.cos(a)], Y, Math.PI)
    path.curve([item.position[0], start[1], 0.03], Y, 0.04)
    path.bore(item, Y, [0, 0, 0.03], 0.16)
    previousLane = 0.03
  }
  hook(top[3]!, 3); marks.push(path.length)
  for (let i = 2; i >= 0; i--) { visit(top[i]!, -1, -0.03); hook(top[i]!, i) }
  path.line(add(path.end, Y, 0.55 + 0.15 * g)); marks.push(path.length, path.length)
  return { beads: [...bottom, ...top], path, marks }
}
const brickLoose = makeBrick(0)

const SPIRAL_STEPS: readonly LessonStep[] = [
  { time: 0, title: '四颗芯珠与三颗外珠', instruction: '先串四颗金色芯珠，再串三颗蓝色外圈珠。芯珠构成中轴，外圈珠形成第一个环。' },
  { time: 0.2, title: '同向回穿四颗芯珠', instruction: '把工作线带回第一颗芯珠，从下向上再次穿过四颗芯珠，闭合外圈。把外圈推向一侧。' },
  { time: 0.38, title: '加一芯、三外珠', instruction: '加入一颗新芯珠和三颗外圈珠，再回穿上一轮最上方的三颗芯珠与这颗新芯珠，仍共穿四颗芯珠。' },
  { time: 0.6, title: '向同一方向叠放外圈', instruction: '重复加一芯、三外珠，并回穿最近四颗芯珠。把新外圈推到前一个外圈旁，始终保持同一旋转方向。' },
  { time: GATHER, title: '收拢螺旋珠绳', instruction: '一边拉紧工作线，一边整理外圈。芯珠连成紧密中轴，三组外珠依次绕在芯珠周围；转动视角查看立体结构。' },
]
function makeSpiral(g: number): Model {
  const pitch = 0.64 + (0.361 - 0.64) * g, radial = 0.9 + (Math.sqrt(3) * 0.361 / 2 - 0.9) * g
  const core = Array.from({ length: 6 }, (_, i) => bead(`spiral-core-${i}`, [0, (i - 2.5) * pitch, 0], Y, 0.18, '#ddb766', String(i + 1)))
  const radialAxis = (i: number): Vec3 => [Math.cos(i * Math.PI * 2 / 3), 0, Math.sin(i * Math.PI * 2 / 3)]
  const loops = Array.from({ length: 3 }, (_, i) => Array.from({ length: 3 }, (_, k) => bead(`spiral-loop-${i}-${k}`, add([0, (i + k - 2) * pitch, 0], radialAxis(i), radial), Y, 0.18, ['#75a9c3', '#91b9b4', '#a2a0c6'][i]!)))
  const transverse: Vec3 = [Math.sqrt(3) / 2, 0, -0.5]
  const path = new Trace(add(add(core[0]!.position, transverse, -0.048), Y, -0.6 - g * 0.12), Y)
  let previous: LessonBead | undefined
  const visit = (item: LessonBead, direction: number, lane: number) => {
    const axis: Vec3 = [0, direction, 0], offset = add([0, 0, 0], transverse, lane), half = 0.15, turn = 0.0305
    const entry = add(add(item.position, offset), axis, -half)
    if (path.aligned(entry, axis)) { path.line(entry); path.tangent = cp(axis) }
    else {
      const fromCore = previous!.id.startsWith('spiral-core'), outer = fromCore ? item : previous!
      const ring = Number(outer.id.split('-')[2]), outward = radialAxis(ring)
      const startEscape = add([0, 0, 0], outward, fromCore ? 1 : -1), endEscape = add([0, 0, 0], startEscape, -1)
      const start = cp(path.end), begin = cp(path.tangent)
      path.arc(a => add(add(start, begin, turn * Math.sin(a)), startEscape, turn * (1 - Math.cos(a))), startEscape)
      const end = add(add(entry, axis, -turn), endEscape, turn), first = cp(path.end), span = dist(first, end), handle = Math.min(0.075, span * 0.23)
      const controls = [first, add(first, startEscape, handle), add(first, startEscape, 2 * handle), add(end, startEscape, -2 * handle), add(end, startEscape, -handle), end]
      const count = Math.max(64, Math.ceil(span / 0.006))
      for (let i = 1; i <= count; i++) {
        const t = i / count, u = 1 - t, weights = [u ** 5, 5 * u ** 4 * t, 10 * u ** 3 * t ** 2, 10 * u ** 2 * t ** 3, 5 * u * t ** 4, t ** 5]
        const point = [0, 1, 2].map(k => controls.reduce((sum, p, j) => sum + p[k]! * weights[j]!, 0)) as Vec3
        // Lift over the neighboring core's shoulder, rather than wrapping a
        // large empty cylinder outside all the beads. This lift vanishes at
        // both mouths with zero first and second derivatives.
        point[1] += (fromCore ? 1 : -1) * (0.09 - 0.035 * g) * 64 * t ** 3 * u ** 3
        path.push(point)
      }
      path.tangent = cp(startEscape)
      path.arc(a => add(add(entry, axis, -turn * Math.cos(a)), endEscape, turn * (1 - Math.sin(a))), axis)
    }
    path.bore(item, axis, offset, half); previous = item
  }
  path.line(add(add(core[0]!.position, transverse, -0.048), Y, -0.32))
  const marks = [path.length]
  for (const b of core.slice(0, 4)) visit(b, 1, -0.048)
  for (const b of [...loops[0]!].reverse()) visit(b, -1, 0)
  marks.push(path.length)
  for (const b of core.slice(0, 4)) visit(b, 1, -0.016)
  marks.push(path.length)
  for (let i = 1; i < 3; i++) {
    visit(core[i + 3]!, 1, -0.016 + (i - 1) * 0.032)
    for (const b of [...loops[i]!].reverse()) visit(b, -1, 0)
    for (const b of core.slice(i, i + 4)) visit(b, 1, -0.016 + i * 0.032)
    if (i === 1) marks.push(path.length)
  }
  path.line(add(path.end, Y, 0.55 + 0.15 * g)); marks.push(path.length, path.length)
  return { beads: [...core, ...loops.flat()], path, marks }
}
const spiralLoose = makeSpiral(0)

export const BEADING_EXTRA_COURSES: Course[] = [
  {
    id: 'netting-seven', category: 'beads', name: '七珠网格针', title: '把交点连成珠网',
    description: '用七珠组合与共享交点，织出两个透空菱形网格。', material: '7 颗交点珠 · 27 颗同尺寸间隔珠 · 一根珠线',
    materialNote: '两色珠同尺寸。示意保留底部三珠转弯环；最终网眼是结构本身，并非尚未拉紧。', duration: 56, initialProgress: 0,
    steps: NETTING_STEPS, source: 'https://www.beadjewelrymaking.com/Arts_and_Craft_Idea/bead_netting_instruction.html', sourceName: 'BeadJewelryMaking · Bead Netting Instructions',
    getState: p => state(p, gather(p) > 0 ? makeNetting(gather(p)) : nettingLoose, NETTING_STEPS, 0.008, '#9c7152'),
  },
  {
    id: 'brick-stitch', category: 'beads', name: '砖式针', title: '让新珠钩住线桥',
    description: '从梯式底行起步，钩住线桥，接成错位排列的珠片。', material: '10 颗同尺寸圆珠 · 细珠线 · 珠针',
    materialNote: '五珠梯式底行已预先完成。重点观察线桥下方的绕行；圆珠用于看清孔路，实物也常用圆柱米珠。', duration: 54, initialProgress: 0,
    steps: BRICK_STEPS, source: 'https://www.beadworkersguild.com/wp-content/uploads/2021/04/Brick-ladder-stitch-1.pdf', sourceName: 'The Beadworkers Guild · Brick / Ladder Stitch',
    getState: p => state(p, gather(p) > 0 ? makeBrick(gather(p)) : brickLoose, BRICK_STEPS, 0.0038, '#6b8492'),
  },
  {
    id: 'spiral-rope', category: 'beads', name: '基础螺旋珠绳', title: '围着芯珠层层绕行',
    description: '四颗芯珠作一轮，三颗外珠成一环，连续叠出立体螺旋。', material: '6 颗芯珠 · 9 颗同尺寸外圈珠 · 细珠线',
    materialNote: '每轮回穿最近四颗芯珠；孔内用细小通道区分多次穿线。三组外圈依次转向，尺寸始终不变。', duration: 58, initialProgress: 0,
    steps: SPIRAL_STEPS, source: 'https://tacklethatbeadstash.blogspot.com/2011/04/basic-stitch-tutorial-spiral-rope.html', sourceName: 'Tackle That Bead Stash · Spiral Rope',
    getState: p => state(p, gather(p) > 0 ? makeSpiral(gather(p)) : spiralLoose, SPIRAL_STEPS, 0.007, '#ad7554'),
  },
]
