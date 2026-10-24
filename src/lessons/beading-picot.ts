import type { Course, LessonBead, LessonState, LessonStep, Vec3 } from './types'

const GATHER = 0.82
const BEAD_RADIUS = 0.105
const THREAD_RADIUS = 0.008
const MOUTH = 0.098
const Y: Vec3 = [0, 1, 0]
const X: Vec3 = [1, 0, 0]
const clamp = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0))
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t) }
const copy = (v: Vec3): Vec3 => [...v]
const add = (a: Vec3, b: Vec3, scale = 1): Vec3 => [a[0] + b[0] * scale, a[1] + b[1] * scale, a[2] + b[2] * scale]
const mix = (a: Vec3, b: Vec3, t: number): Vec3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])

// A single continuous thread. Every visit crosses the complete drilled hole;
// exterior connections have matching tangents at both mouths.
class PicotPath {
  points: Vec3[]
  distances = [0]
  passages: { id: string; start: number; end: number }[] = []
  length = 0
  tangent: Vec3
  constructor(start: Vec3, direction: Vec3) { this.points = [copy(start)]; this.tangent = copy(direction) }
  get end() { return this.points[this.points.length - 1]! }
  push(point: Vec3) {
    const span = distance(this.end, point)
    if (span < 1e-10) return
    this.length += span; this.points.push(copy(point)); this.distances.push(this.length)
  }
  line(end: Vec3) {
    const start = copy(this.end), count = Math.max(1, Math.ceil(distance(start, end) / 0.006))
    for (let i = 1; i <= count; i++) this.push(mix(start, end, i / count))
  }
  connect(end: Vec3, direction: Vec3) {
    const start = copy(this.end), span = distance(start, end)
    if (span < 1e-9) { this.tangent = copy(direction); return }
    const h = Math.min(0.07, span * 0.23)
    const control = [start, add(start, this.tangent, h), add(start, this.tangent, 2 * h), add(end, direction, -2 * h), add(end, direction, -h), end]
    const count = Math.max(32, Math.ceil((span + 4 * h) / 0.005))
    for (let i = 1; i <= count; i++) {
      const t = i / count, u = 1 - t, weights = [u ** 5, 5 * u ** 4 * t, 10 * u ** 3 * t ** 2, 10 * u ** 2 * t ** 3, 5 * u * t ** 4, t ** 5]
      this.push([0, 1, 2].map(k => control.reduce((sum, p, j) => sum + p[k]! * weights[j]!, 0)) as Vec3)
    }
    this.tangent = copy(direction)
  }
  visit(bead: LessonBead, direction = 1) {
    const axis = add([0, 0, 0], bead.axis, direction)
    this.connect(add(bead.position, axis, -MOUTH), axis)
    const start = this.length
    this.line(add(bead.position, axis, MOUTH)); this.tangent = copy(axis)
    this.passages.push({ id: bead.id, start, end: this.length })
  }
}

const bead = (id: string, position: Vec3, axis: Vec3, color: string, label = ''): LessonBead => ({
  id, position, axis: copy(axis), radius: BEAD_RADIUS, color, label, active: false,
})

function makePicot(tightening: number) {
  const pitch = 0.43 + (0.214 - 0.43) * tightening
  const baseY = -0.24
  const edges = Array.from({ length: 6 }, (_, i) => bead(`picot-edge-${i + 1}`, [(i - 2.5) * pitch, baseY, 0], Y, '#c7a36c', String(i + 1)))
  const teeth = Array.from({ length: 3 }, (_, i) => {
    const left = edges[i * 2]!.position[0]
    return [
      bead(`picot-new-${i * 3 + 1}`, [left, baseY + pitch, 0], Y, '#a8bdc3'),
      bead(`picot-new-${i * 3 + 2}`, [left + pitch / 2, baseY + pitch * (1 + Math.sqrt(3) / 2), 0], X, '#e2c2a5'),
      bead(`picot-new-${i * 3 + 3}`, [left + pitch, baseY + pitch, 0], Y, '#a8bdc3'),
    ]
  })
  const path = new PicotPath(add(edges[0]!.position, Y, -0.58), Y)
  path.line(add(edges[0]!.position, Y, -0.35))
  const marks = [path.length]
  path.visit(edges[0]!)
  path.visit(teeth[0]![0]!); path.visit(teeth[0]![1]!); path.visit(teeth[0]![2]!, -1)
  marks.push(path.length)
  path.visit(edges[1]!, -1); path.visit(edges[2]!)
  marks.push(path.length)
  path.visit(teeth[1]![0]!); path.visit(teeth[1]![1]!); path.visit(teeth[1]![2]!, -1)
  path.visit(edges[3]!, -1); path.visit(edges[4]!)
  marks.push(path.length)
  path.visit(teeth[2]![0]!); path.visit(teeth[2]![1]!); path.visit(teeth[2]![2]!, -1)
  path.visit(edges[5]!, -1)
  path.line(add(edges[5]!.position, Y, -0.58))
  marks.push(path.length, path.length)
  return { beads: [...edges, ...teeth.flat()], path, marks }
}

const STEPS: readonly LessonStep[] = [
  { time: 0, title: '从边珠穿出，串三颗珠', instruction: '金色 1–6 号是已完成珠片的边缘珠，本课只显示这一排。从 1 号珠向上穿出，顺次串三颗新珠，让中间珠成为尖齿顶端。' },
  { time: 0.20, title: '回到边缘，换下一针', instruction: '向下穿过相邻的 2 号边珠，第一组三珠尖齿便接到边缘。线从下方绕到 3 号边珠，再向上穿出。' },
  { time: 0.40, title: '接出第二个三珠尖齿', instruction: '再串三颗珠，向下穿过 4 号边珠；从下方换到 5 号边珠并向上穿出。每个尖齿都由同一根线连续接出。' },
  { time: 0.61, title: '完成第三个尖齿', instruction: '串最后三颗珠，向下穿过 6 号边珠，留出工作端。转动视角，确认线沿珠孔通过，边缘下方的短桥也保持连续。' },
  { time: GATHER, title: '轻收余线，排齐珠齿', instruction: '轻拉工作端，缩短珠间空隙，让三组中间珠凸起、两侧珠贴拢。珠子与线的粗细保持不变；这里保留真实头尾，未演示藏线打结。' },
]

const loose = makePicot(0)
function getPicotState(progress: number): LessonState {
  const p = clamp(progress), g = ease((p - GATHER) / (1 - GATHER)), model = g > 0 ? makePicot(g) : loose
  let checkpoint = 0
  while (checkpoint + 1 < STEPS.length && p >= STEPS[checkpoint + 1]!.time) checkpoint++
  const from = model.marks[checkpoint]!, to = model.marks[checkpoint + 1]!
  const t0 = STEPS[checkpoint]!.time, t1 = STEPS[checkpoint + 1]?.time ?? 1
  const length = from + (to - from) * ease((p - t0) / (t1 - t0))
  const points = [copy(model.path.points[0]!)]
  for (let i = 1; i < model.path.points.length; i++) {
    const start = model.path.distances[i - 1]!, end = model.path.distances[i]!
    if (end <= length + 1e-10) points.push(copy(model.path.points[i]!))
    else { if (length > start + 1e-10) points.push(mix(model.path.points[i - 1]!, model.path.points[i]!, (length - start) / (end - start))); break }
  }
  const active = p < GATHER ? model.path.passages.find(passage => length <= passage.end + 1e-9)?.id : undefined
  return {
    points, tip: copy(points.at(-1)!), checkpoint, color: '#8c654b', radius: THREAD_RADIUS, hideMainTip: true, showEndLabels: false,
    beads: model.beads.map(item => ({ ...item, position: copy(item.position), axis: copy(item.axis), active: item.id === active, labelOpacity: 1 - g })),
  }
}

export const PICOT_COURSES: Course[] = [{
  id: 'picot-edge', category: 'beads', name: '三珠珠齿花边', title: '沿珠片边缘接出三个尖齿',
  description: '用一根线连续接出三珠尖齿，练习已有珠片的装饰边。',
  material: '6 颗边珠 · 9 颗新珠 · 柔软珠线',
  materialNote: '金色边珠属于预先完成的珠片，本课只显示边缘一排，并从穿出第一颗边珠开始。三颗一组接出尖齿；实物收紧后还需藏线固定。',
  duration: 52, initialProgress: 0, steps: STEPS,
  source: 'https://artbeads.com/design-studio/how-to-make-a-picot-edge/', sourceName: 'Artbeads · How to Make a Picot Edge',
  getState: getPicotState,
}]
