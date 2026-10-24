import type { Course, LessonBead, LessonState, LessonStep, Vec3 } from './types'

// One continuous thread: down a fringe, around three turning beads, back
// through the fringe and its edge bead, then across to the next edge bead.
const Y: Vec3 = [0, 1, 0]
const X: Vec3 = [1, 0, 0]
const Z: Vec3 = [0, 0, 1]
const GATHER = 0.82
const THREAD_RADIUS = 0.008
const clamp = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0))
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t) }
const gather = (p: number) => ease((clamp(p) - GATHER) / (1 - GATHER))
const cp = (p: Vec3): Vec3 => [...p]
const add = (a: Vec3, b: Vec3, s = 1): Vec3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s]
const mix = (a: Vec3, b: Vec3, t: number): Vec3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]

class FringePath {
  points: Vec3[]
  distances = [0]
  passages: { id: string; start: number; end: number }[] = []
  length = 0
  tangent: Vec3
  constructor(start: Vec3, tangent: Vec3, readonly tightening: number) { this.points = [cp(start)]; this.tangent = cp(tangent) }
  get end() { return this.points[this.points.length - 1]! }
  push(point: Vec3) {
    const d = distance(this.end, point)
    if (d < 1e-10) return
    this.length += d; this.points.push(cp(point)); this.distances.push(this.length)
  }
  line(end: Vec3) {
    const start = cp(this.end), count = Math.max(1, Math.ceil(distance(start, end) / 0.01))
    for (let i = 1; i <= count; i++) this.push(mix(start, end, i / count))
  }
  curve(end: Vec3, axis: Vec3, maxHandle = 0.05) {
    const start = cp(this.end), span = distance(start, end)
    if (span < 1e-9) { this.tangent = cp(axis); return }
    const h = Math.min(maxHandle, span * 0.23)
    const control = [start, add(start, this.tangent, h), add(start, this.tangent, 2 * h), add(end, axis, -2 * h), add(end, axis, -h), end]
    const count = Math.max(32, Math.ceil((span + h * 4) / 0.008))
    for (let i = 1; i <= count; i++) {
      const t = i / count, u = 1 - t, weights = [u ** 5, 5 * u ** 4 * t, 10 * u ** 3 * t ** 2, 10 * u ** 2 * t ** 3, 5 * u * t ** 4, t ** 5]
      this.push([0, 1, 2].map(k => control.reduce((sum, p, j) => sum + p[k]! * weights[j]!, 0)) as Vec3)
    }
    this.tangent = cp(axis)
  }
  arc(fn: (angle: number) => Vec3, axis: Vec3) {
    for (let i = 1; i <= 24; i++) this.push(fn(Math.PI / 2 * i / 24))
    this.tangent = cp(axis)
  }
  visit(item: LessonBead, direction: number, lane: number, column: number) {
    const axis = add([0, 0, 0], item.axis, direction), offset = add([0, 0, 0], X, lane)
    const entry = add(add(item.position, offset), axis, -0.0555)
    const chord = add(entry, this.end, -1), span = Math.hypot(...chord)
    if (span < 1e-9 || (dot(this.tangent, axis) > 0.99999 && Math.abs(dot(chord, axis) - span) < 1e-8)) {
      this.line(entry); this.tangent = cp(axis)
    } else {
      const start = cp(this.end), begin = cp(this.tangent), side = Math.sign(lane), turn = 0.05, layer = column + side * (0.16 - 0.06 * this.tightening)
      this.arc(a => add(add(start, begin, turn * Math.sin(a)), X, side * turn * (1 - Math.cos(a))), [side, 0, 0])
      this.line([layer, this.end[1], this.end[2]])
      this.curve([layer, entry[1] - axis[1] * turn, entry[2] - axis[2] * turn], [-side, 0, 0], 0.03)
      this.line([entry[0] + side * turn, entry[1] - axis[1] * turn, entry[2] - axis[2] * turn])
      this.arc(a => add(add(entry, axis, -turn * Math.cos(a)), X, side * turn * (1 - Math.sin(a))), axis)
    }
    const start = this.length
    this.line(add(add(item.position, offset), axis, 0.0555)); this.tangent = cp(axis)
    this.passages.push({ id: item.id, start, end: this.length })
  }
}

interface FringeModel { beads: LessonBead[]; path: FringePath; marks: number[] }
const bead = (id: string, position: Vec3, axis: Vec3, color: string, label = ''): LessonBead => ({ id, position, axis, radius: 0.105, color, label, active: false })

function makeFringe(g: number): FringeModel {
  const pitch = 0.34 + (0.211 - 0.34) * g, spacing = 0.72 + (0.211 - 0.72) * g, top = 0.95
  const heads = [0, 1, 2].map(i => bead(`fringe-edge-${i}`, [(i - 1) * spacing, top, 0], Y, '#c7a36c', String(i + 1)))
  const fringes = [3, 5, 7].map((count, i) => Array.from({ length: count }, (_, j) => bead(`fringe-drop-${i}-${j}`, [(i - 1) * spacing, top - (j + 1) * pitch, 0], Y, j % 2 ? '#9eb5bf' : '#e0cbb3')))
  // The little turning loops stand perpendicular to the sheet of hanging
  // strands. Their three-dimensional placement avoids intersecting adjacent
  // fringe columns, while every neighboring bead still meets at the finish.
  const turns = fringes.map((run, i) => {
    const end = run.at(-1)!.position, s = pitch / Math.sqrt(2)
    return [bead(`fringe-turn-${i}-0`, add(add(end, Y, -s), Z, s), Y, '#c7a36c'), bead(`fringe-turn-${i}-1`, add(end, Y, -2 * s), Z, '#c7a36c'), bead(`fringe-turn-${i}-2`, add(add(end, Y, -s), Z, -s), Y, '#c7a36c')]
  })
  const path = new FringePath([heads[0]!.position[0] - 0.015, top + 0.55 + 0.15 * g, 0], [0, -1, 0], g)
  path.line([path.end[0], top + 0.3, 0])
  const marks = [path.length]
  for (let i = 0; i < 3; i++) {
    const column = heads[i]!.position[0]
    if (i > 0) {
      // Adjacent edge beads connect with a short bridge over their mouths.
      // The outgoing and returning lanes are separated inside each hole.
      const start = cp(path.end), entry: Vec3 = [column - 0.015, top + 0.0555, 0], turn = 0.05
      path.arc(a => [start[0] + turn * (1 - Math.cos(a)), start[1] + turn * Math.sin(a), 0], X)
      path.line([entry[0] - turn, entry[1] + turn, 0])
      path.arc(a => [entry[0] - turn * (1 - Math.sin(a)), entry[1] + turn * Math.cos(a), 0], [0, -1, 0])
    }
    path.visit(heads[i]!, -1, -0.015, column)
    for (const item of fringes[i]!) path.visit(item, -1, -0.015, column)
    if (i === 0) marks.push(path.length)
    path.visit(turns[i]![0]!, -1, -0.015, column)
    path.visit(turns[i]![1]!, -1, -0.015, column)
    path.visit(turns[i]![2]!, 1, -0.015, column)
    for (const item of [...fringes[i]!].reverse()) path.visit(item, 1, 0.015, column)
    path.visit(heads[i]!, 1, 0.015, column)
    if (i < 2) marks.push(path.length)
  }
  path.line(add(path.end, Y, 0.55 + 0.15 * g)); marks.push(path.length, path.length)
  return { beads: [...heads, ...fringes.flat(), ...turns.flat()], path, marks }
}

const STEPS: readonly LessonStep[] = [
  { time: 0, title: '从边珠穿出第一条', instruction: '金色的 1、2、3 是已完成珠片的边缘珠。从 1 号珠向下穿出，再串三颗主珠，建立第一条流苏。' },
  { time: 0.2, title: '绕过转弯珠，原路回穿', instruction: '加三颗金色转弯珠，再向上回穿整条主珠和 1 号边珠。回程跳过三颗转弯珠；转动视角可以看清底端的小环。' },
  { time: 0.4, title: '换到第二颗边珠', instruction: '从上方跨到 2 号边珠，向下穿出。这条增加为五颗主珠，加入三颗转弯珠后，再原路回穿到边缘。' },
  { time: 0.61, title: '再接一条渐长流苏', instruction: '继续到 3 号边珠。这次用七颗主珠，仍以三颗转弯珠收底并回穿。三条长短变化形成斜向下垂的轮廓。' },
  { time: GATHER, title: '收掉余线，留住垂感', instruction: '轻拉工作端，把珠间余线收短，让每条流苏的珠子贴合。实物只拉到没有空隙，不能紧到僵硬；这里保留头尾，未演示藏线打结。' },
]
const loose = makeFringe(0)
function getFringeState(progress: number): LessonState {
  const p = clamp(progress), g = gather(p), model = g > 0 ? makeFringe(g) : loose
  let checkpoint = 0
  while (checkpoint + 1 < STEPS.length && p >= STEPS[checkpoint + 1]!.time) checkpoint++
  const t0 = STEPS[checkpoint]!.time, t1 = STEPS[checkpoint + 1]?.time ?? 1
  const from = model.marks[checkpoint]!, to = model.marks[checkpoint + 1]!, length = from + (to - from) * ease((p - t0) / (t1 - t0))
  const points = [cp(model.path.points[0]!)]
  for (let i = 1; i < model.path.points.length; i++) {
    const start = model.path.distances[i - 1]!, end = model.path.distances[i]!
    if (end <= length + 1e-10) points.push(cp(model.path.points[i]!))
    else { if (length > start + 1e-10) points.push(mix(model.path.points[i - 1]!, model.path.points[i]!, (length - start) / (end - start))); break }
  }
  const active = p < GATHER ? model.path.passages.find(v => length <= v.end + 1e-9)?.id : undefined
  return {
    points, tip: cp(points.at(-1)!), checkpoint, color: '#8c654b', radius: THREAD_RADIUS, hideMainTip: true, showEndLabels: false,
    beads: model.beads.map(b => ({ ...b, position: cp(b.position), axis: cp(b.axis), active: b.id === active, labelOpacity: 1 - g })),
  }
}

export const BEADING_FRINGE_COURSES: Course[] = [{
  id: 'graduated-fringe', category: 'beads', name: '渐长回穿流苏', title: '让珠串从边缘垂下来',
  description: '用一根线接出三条渐长流苏，理解转弯珠与原路回穿。', material: '3 颗边珠 · 15 颗主珠 · 9 颗转弯珠 · 柔软珠线',
  materialNote: '本课只显示珠片边缘的三颗珠。为看清孔路，演示统一珠径；实物可换用更小的转弯珠，并保留柔软垂感。',
  duration: 56, initialProgress: 0, steps: STEPS,
  source: 'https://beadaholique.com/products/how-to-make-beaded-fringe', sourceName: 'Beadaholique · Julie Bean · How to Make Beaded Fringe',
  getState: getFringeState,
}]
