import type { Course, LessonState, LessonStep, Vec3 } from './types'

// These lessons lay out a checked route and then dress its knot core with an
// authored, reversible deformation. No accumulated physics state is used.
const RADIUS = 0.06
const TIMES = [0, 0.14, 0.40, 0.66, 0.82, 1] as const
const clamp = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0))
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t) }
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => a.map((v, i) => mix(v, b[i], t)) as Vec3
const sub = (a: Vec3, b: Vec3): Vec3 => a.map((v, i) => v - b[i]) as Vec3
const dot = (a: Vec3, b: Vec3) => a.reduce((sum, v, i) => sum + v * b[i], 0)
const length = (v: Vec3) => Math.hypot(...v)
const distance = (a: Vec3, b: Vec3) => length(sub(a, b))
const unit = (v: Vec3): Vec3 => { const d = length(v); return v.map(x => x / (d || 1)) as Vec3 }
type Path = { points: Vec3[]; lengths: number[]; total: number; marks: number[]; controls?: Vec3[] }

function makePath(points: Vec3[], marks: number[] = []): Path {
  const lengths = [0]
  for (let i = 1; i < points.length; i++) lengths.push(lengths[i - 1] + distance(points[i - 1], points[i]))
  return { points, lengths, total: lengths[lengths.length - 1], marks }
}

/** A convex-hull C2 spline preserves the authored crossing depths. */
function spline(controls: Vec3[]): Path {
  const first = controls[0], last = controls[controls.length - 1]
  const padded = [first, first, ...controls, last, last]
  const points: Vec3[] = [[...first]]
  const marks: number[] = []
  let travelled = 0
  for (let span = 0; span < padded.length - 3; span++) {
    const a = padded[span], b = padded[span + 1], c = padded[span + 2], d = padded[span + 3]
    const divisions = Math.max(20, Math.ceil((distance(a, b) + distance(b, c) + distance(c, d)) / 0.04))
    for (let i = 1; i <= divisions; i++) {
      const t = i / divisions, t2 = t * t, t3 = t2 * t
      const w = [(1 - 3 * t + 3 * t2 - t3) / 6, (4 - 6 * t2 + 3 * t3) / 6, (1 + 3 * t + 3 * t2 - 3 * t3) / 6, t3 / 6]
      const point = [0, 1, 2].map(k => a[k] * w[0] + b[k] * w[1] + c[k] * w[2] + d[k] * w[3]) as Vec3
      const segment = distance(points[points.length - 1], point)
      if (segment > 1e-9) { points.push(point); travelled += segment }
    }
    marks.push(travelled)
  }
  return { ...makePath(points, marks), controls }
}

function pointAt(path: Path, offset: number): Vec3 {
  const s = Math.max(0, Math.min(path.total, offset))
  let low = 1, high = path.points.length - 1
  while (low < high) { const mid = (low + high) >> 1; if (path.lengths[mid] < s) low = mid + 1; else high = mid }
  const span = path.lengths[low] - path.lengths[low - 1]
  return lerp(path.points[low - 1], path.points[low], span > 0 ? (s - path.lengths[low - 1]) / span : 0)
}

function prefix(path: Path, offset: number): Vec3[] {
  const s = Math.max(0.3, Math.min(path.total, offset))
  const count = Math.max(16, Math.ceil(s / 0.023))
  return Array.from({ length: count + 1 }, (_, i) => pointAt(path, s * i / count))
}

function checkpoint(progress: number): number {
  for (let i = TIMES.length - 2; i >= 0; i--) if (progress >= TIMES[i]) return i
  return 0
}

function amount(progress: number, cuts: readonly number[]): number {
  const step = checkpoint(progress)
  return mix(cuts[step], cuts[step + 1], ease((progress - TIMES[step]) / (TIMES[step + 1] - TIMES[step])))
}

function steps(titles: string[], instructions: string[]): LessonStep[] {
  return titles.map((title, i) => ({ time: TIMES[i], title, instruction: instructions[i] }))
}

function trace(path: Path, cuts: number[], color: string, tightControls?: Vec3[]): (progress: number) => LessonState {
  return progress => {
    const p = clamp(progress)
    const tension = ease((p - 0.82) / 0.18)
    const active = tension > 0 && tightControls && path.controls
      ? spline(path.controls.map((point, i) => lerp(point, tightControls[i], tension))) : path
    const points = prefix(active, tension > 0 ? active.total : amount(p, cuts))
    return { points, tip: [...points[points.length - 1]], checkpoint: checkpoint(p), color, radius: RADIUS }
  }
}

function circleGuides(): Vec3[] {
  const guides: Vec3[] = [[-2.65, -1.45, 0.30], [-1.65, -1.38, 0.30]]
  for (let i = 0; i <= 12; i++) {
    const u = i / 12, angle = mix(-1.3, 4.45, u)
    guides.push([1.2 * Math.cos(angle), 0.35 + 1.2 * Math.sin(angle), 0.30 * Math.exp(-u / 0.065) - 0.30 * Math.exp(-(1 - u) / 0.065)])
  }
  return guides
}

// Each passage crosses the initial loop from front to back. The second
// return travels outside its right rim before re-entering, adding two
// crossings: the closed diagram is T(2,5), not a relabelled single overhand.
// Topology reference: https://www.katlas.org/wiki/T%285%2C2%29
const doublePath = spline([
  ...circleGuides(),
  [0.1, -1.55, -0.30], [1.45, -1.55, -0.10], [1.85, -0.65, 0.60],
  [-0.35, -0.10, 0.60], [-0.35, -0.10, -0.60],
  [1.85, 0.30, -0.60], [2.3, 1.0, -0.10], [1.5, 1.85, 0.60],
  [0.20, 0.55, 0.60], [0.20, 0.55, -0.60], [-0.70, 0.99, -0.60], [-2.45, 1.85, -0.60],
])
// Offline dressed centerline: each bend seats against neighboring strands.
const doubleTight: Vec3[] = [
  [-2.65, -0.75, 0.15],
  [-1.1, -0.75, 0.15],
  [-0.085478, -0.064566, 0.050789],
  [0.037626, -0.108228, -0.047836],
  [0.147919, 0.008686, 0.002064],
  [0.100036, 0.105596, 0.013578],
  [0.080481, 0.128898, -0.01548],
  [0.070679, 0.211927, -0.053022],
  [-0.01251, 0.297496, 0.014109],
  [-0.112821, 0.263291, 0.068085],
  [-0.159603, 0.166559, 0.080096],
  [-0.156862, 0.077206, 0.026691],
  [-0.125473, 0.005786, -0.028804],
  [-0.103333, -0.031163, -0.093152],
  [-0.059105, -0.13074, -0.137701],
  [-0.00455, -0.212416, -0.069494],
  [0.040408, -0.221334, 0.030851],
  [0.086586, -0.101407, 0.120908],
  [-0.019609, 0.041379, 0.077412],
  [-0.002118, 0.035476, -0.098007],
  [0.165953, 0.075816, -0.137231],
  [0.226127, 0.192939, -0.025232],
  [0.131215, 0.220052, 0.101084],
  [-0.022234, 0.170139, 0.09494],
  [-0.04001, 0.132231, -0.028597],
  [-0.187339, 0.255175, -0.089566],
  [-2.65, 1.3, -0.21],
]

// Form the right-hand loop over the standing strand, travel behind and
// around the standing strand on the left, then pass down through the loop.
const figurePath = spline([
  [-2.65, 0, 0], [-1.65, 0, 0], [-0.45, 0, 0],
  [0.25, -0.70, 0], [1.40, -1.05, 0], [2.0, -0.30, 0],
  [1.90, 0.70, 0], [0.80, 1.0, 0], [-0.65, 0, 0.60],
  [-1.0, -0.85, 0.60], [-2.0, -0.70, -0.60], [-2.05, 0.75, -0.60],
  [-1.20, 1.30, 0.60], [0.45, 0.60, 0.60], [0.90, 0.40, 0.60], [0.90, 0.40, -0.60], [0.90, -0.25, -0.60],
  [1.0, -1.65, -0.60], [1.0, -2.35, -0.60],
])
// Offline dressed centerline: each bend seats against neighboring strands.
const figureTight: Vec3[] = [
  [-2.65, 0, 0],
  [-1.1, 0, 0],
  [-0.104258, 0.003208, -0.104399],
  [-0.153761, -0.240519, -0.008888],
  [0.009399, -0.294258, 0.114911],
  [0.17785, -0.144278, 0.063197],
  [0.027395, -0.017321, -0.055459],
  [-0.069453, -0.048314, -0.001907],
  [-0.143833, -0.019835, 0.077623],
  [-0.271044, -0.1855, 0.04655],
  [-0.252729, -0.188076, -0.170673],
  [-0.15293, -0.00875, -0.225442],
  [-0.03636, 0.138929, 0.039041],
  [0.025929, -0.008152, 0.113997],
  [-0.010291, -0.134981, 0.089847],
  [-0.005805, -0.170196, -0.038608],
  [0.09054, -0.285536, -0.036561],
  [0.509433, -1.524517, -0.149855],
  [0.8, -2.65, -0.23],
]
// Dress the paired figure-eight while keeping its external fixed eye.
const figureLoopTight: Vec3[] = [
  [-2.65, 0, 0],
  [-1.65, 0, 0],
  [-0.543084, -0.409272, -0.193089],
  [-0.403197, -0.780063, -0.321562],
  [-0.305639, -0.875439, 0.127661],
  [0.054687, -0.535236, 0.072839],
  [-0.071644, -0.358047, -0.058254],
  [-0.245189, -0.480978, -0.18195],
  [-0.332889, -0.534982, -0.117397],
  [-0.673204, -0.777736, -0.094202],
  [-0.830412, -0.617364, -0.335812],
  [-0.472058, -0.30578, -0.388848],
  [-0.38081, -0.312713, -0.07117],
  [-0.316537, -0.44602, -0.000706],
  [-0.279953, -0.558242, 0.022646],
  [-0.086328, -0.70809, -0.117892],
  [-0.042557, -0.765391, -0.073698],
  [1, -1.65, -0.432],
  [1, -2.15, -0.432],
]

const slipPath = spline([
  ...circleGuides(),
  [0.1, -1.55, -0.30], [1.45, -1.55, -0.10], [1.85, -0.65, 0.60],
  [-0.25, 0.25, 0.60], [-0.25, 0.25, -0.60],
  [-1.70, 1.0, -0.60], [-2.0, 2.0, -0.60], [-1.0, 2.4, -0.60],
  [-0.10, 1.50, -0.60], [0.35, 0.65, -0.60], [0.35, 0.65, 0.60],
  [1.05, 0.93, 0.60], [2.45, 1.5, 0.60],
])
// Offline dressed centerline: each bend seats against neighboring strands.
const slipTight: Vec3[] = [
  [-2.65, -0.55, 0.16],
  [-1.1, -0.55, 0.16],
  [-0.12612, 0.066407, 0.089659],
  [-0.114815, 0.086393, -0.081798],
  [0.032144, 0.151895, -0.096953],
  [0.048098, 0.185789, -0.110798],
  [0.151494, 0.30486, -0.093192],
  [0.123543, 0.390762, 0.056732],
  [0.012623, 0.323809, 0.139341],
  [-0.097644, 0.252429, 0.128339],
  [-0.147793, 0.205322, 0.110249],
  [-0.225211, 0.165761, 0.046228],
  [-0.254547, 0.118012, -0.071578],
  [-0.191276, -0.008116, -0.108388],
  [-0.088332, -0.046125, -0.060576],
  [-0.055045, -0.028475, -0.013514],
  [-0.024441, -0.014689, -0.005145],
  [0.004186, 0.029114, 0.019332],
  [-0.028872, 0.118825, 0.084002],
  [-0.040734, 0.254006, -0.050593],
  [-1.36, 0.8, -0.204],
  [-1.6, 1.6, -0.204],
  [-0.8, 1.92, -0.204],
  [-0.08, 1.2, -0.204],
  [-0.038658, 0.223292, -0.016151],
  [0.148913, 0.23979, 0.062298],
  [0.32715, 0.231249, 0.046051],
  [2.65, 0.6, 0.24],
]

// The doubled overhand keeps its own stable controls, so dressing the
// single-strand lesson cannot change this paired route.
const overhandPath = spline([
  [-2.565, -1.3775, 0.255],
  [-1.5675, -1.311, 0.255],
  [0.304949, -0.765956, 0.255],
  [0.777037, -0.501654, 0.070754],
  [1.074105, -0.049466, 0.019631],
  [1.12924, 0.488757, 0.005445],
  [0.930024, 0.991784, 0.001502],
  [0.521328, 1.346313, 0.000387],
  [-0.004792, 1.47249, 0],
  [-0.529833, 1.341894, -0.000387],
  [-0.935534, 0.983941, -0.001502],
  [-1.130514, 0.479257, -0.005445],
  [-1.070856, -0.058483, -0.019631],
  [-0.769997, -0.508157, -0.070754],
  [-0.295703, -0.768481, -0.255],
  [0.292358, -1.207494, -0.272],
  [1.13231, -1.367406, -0.068],
  [1.982485, -0.466661, 0.578],
  [0.114, 0.456, 0.578],
  [0.114, 0.456, -0.578],
  [-2.0425, 1.615, -0.578],
])
const overhandTight: Vec3[] = [
  [-2.565, -1.3775, 0.255],
  [-1.5675, -1.311, 0.255],
  [-0.437168, 0.17711, -0.148507],
  [-0.193782, -0.009297, -0.237075],
  [-0.030127, 0.037784, -0.11247],
  [-0.028286, 0.127217, -0.022998],
  [-0.059169, 0.188309, 0.023972],
  [-0.103564, 0.225603, 0.038395],
  [-0.145096, 0.240423, 0.044768],
  [-0.187329, 0.243797, 0.062338],
  [-0.382939, 0.28624, 0.076518],
  [-0.507867, 0.28942, -0.122283],
  [-0.51929, 0.142761, -0.314332],
  [-0.426307, -0.090967, -0.294151],
  [-0.399954, -0.14652, -0.251918],
  [-0.36005, -0.195932, -0.20049],
  [-0.280473, -0.202583, -0.163062],
  [-0.214077, -0.091896, -0.052529],
  [-0.360632, 0.186141, -0.014659],
  [0.114, 0.456, -0.41616],
  [-2.0425, 1.615, -0.578],
]

/** Double the route side by side in the teaching projection, closing its bight. */
function doubled(points: Vec3[], opening: number): { points: Vec3[]; tip: Vec3 } {
  const forward: Vec3[] = [], backward: Vec3[] = []
  const arc = [0]
  for (let i = 1; i < points.length; i++) arc.push(arc[i - 1] + distance(points[i - 1], points[i]))
  const total = arc[arc.length - 1]
  let normal: Vec3 = [0, 1, 0]
  let tangent: Vec3 = [1, 0, 0]
  let halfWidth = 0.10
  for (let i = 0; i < points.length; i++) {
    tangent = unit(sub(points[Math.min(i + 1, points.length - 1)], points[Math.max(0, i - 1)]))
    const planar: Vec3 = [-tangent[1], tangent[0], 0]
    normal = length(planar) > 1e-6 ? unit(planar)
      : unit(sub(normal, tangent.map(v => v * dot(normal, tangent)) as Vec3))
    const spread = opening * ease((arc[i] - total + 1.25) / 1.25)
    // Outside the knot, spread the two legs into a visible fixed eye. Keep
    // the eye in the teaching plane and its tangent continuous at the bend.
    // Seat the paired strands almost tangent while the functional eye stays open.
    halfWidth = mix(0.10, 0.062, opening) + (0.46 - mix(0.10, 0.062, opening)) * spread
    forward.push(points[i].map((v, a) => v + halfWidth * normal[a]) as Vec3)
    backward.push(points[i].map((v, a) => v - halfWidth * normal[a]) as Vec3)
  }
  const end = points[points.length - 1]
  const bight: Vec3[] = []
  for (let i = 1; i < 24; i++) {
    const angle = Math.PI * i / 24
    bight.push(end.map((v, a) => v + halfWidth * (normal[a] * Math.cos(angle) + tangent[a] * Math.sin(angle))) as Vec3)
  }
  const rope = [...forward, ...bight, ...backward.reverse()]
  return { points: rope, tip: [...rope[rope.length - 1]] }
}

function onBight(path: Path, cuts: number[], color: string, tightControls: Vec3[]): (progress: number) => LessonState {
  return progress => {
    const p = clamp(progress), tension = ease((p - 0.82) / 0.18)
    const active = tension > 0 && path.controls
      ? spline(path.controls.map((point, i) => lerp(point, tightControls[i], tension))) : path
    const result = doubled(prefix(active, tension > 0 ? active.total : amount(p, cuts)), tension)
    return { ...result, checkpoint: checkpoint(p), color, radius: RADIUS, showEndLabels: false, hideMainTip: true }
  }
}

const figureCuts = [0.7, figurePath.marks[2], figurePath.marks[9], figurePath.marks[12], figurePath.total, figurePath.total]
const overhandCuts = [0.7, overhandPath.total * 0.15, overhandPath.total * 0.56, overhandPath.total * 0.82, overhandPath.total, overhandPath.total]

export const KNOT_EXTRA_COURSES: Course[] = [
  {
    id: 'double-overhand', category: 'knots', name: '双重单结', title: '同一绳圈，连续穿过两次',
    description: '在单结的基础上增加一次穿环，认识双重单结的两次缠绕。',
    material: '一根柔软圆绳', materialNote: '先展开两次穿环的路径，最后牵引绳端，使结芯收拢；绳径保持不变。', duration: 22, initialProgress: 0.72,
    steps: steps(['准备绳线', '形成绳圈', '第一次穿环', '第二次穿环', '拉紧双重单结'], [
      '辨认标为 1B 的固定端和 1A 的工作端。演示沿绳子的真实连续路径逐段展开。',
      '绕出一个绳圈，让后续工作端能穿过圈内。',
      '工作端由圈前穿到圈后，完成第一次穿环。',
      '沿圈外绕回前方，再穿过同一个绳圈一次。',
      '向外牵引绳端，让两个绕圈靠拢。结芯收小，尾段拉直，两次穿环的上下关系保持不变。',
    ]),
    source: 'https://www.animatedknots.com/double-overhand-stopper-knot', sourceName: 'Animated Knots · Double Overhand Stopper',
    getState: trace(doublePath, [0.7, doublePath.marks[2], doublePath.marks[15], doublePath.marks[20], doublePath.total, doublePath.total], '#c98b51', doubleTight),
  },
  {
    id: 'figure-eight', category: 'knots', name: '八字结', title: '绕过固定段，再穿回绳圈',
    description: '通过成圈、绕固定段和穿环，认识八字止索结的四处交叉。',
    material: '一根柔软圆绳', materialNote: '先看清四处交叉，再牵引绳端，让两个弯圈逐渐收拢。', duration: 23, initialProgress: 0.73,
    steps: steps(['准备绳线', '上跨成圈', '绕过固定段', '向下穿环', '拉紧八字结'], [
      '固定段放在左侧，沿标为 1A 的工作端观察绳线的行进方向。',
      '工作端从自身上方跨过，形成右侧的第一个绳圈。',
      '继续从固定段下方经过，再绕到它的另一侧。',
      '回到原绳圈前方，把工作端向下穿入圈中并引出。',
      '牵引固定段和工作端，使两个弯圈收拢、尾段拉直；四处交叉继续保持原来的上下关系。',
    ]),
    source: 'https://www.animatedknots.com/figure-8-knot', sourceName: 'Animated Knots · Figure 8 Knot',
    getState: trace(figurePath, figureCuts, '#a86a46', figureTight),
  },
  {
    id: 'slip-knot', category: 'knots', name: '活结', title: '把绳弯穿进去，留下可抽出的活套',
    description: '用短端形成绳弯代替整根绳头穿环，认识单结活套的结构。',
    material: '一根柔软圆绳', materialNote: '先看清活套的两条腿，最后收紧结芯，保留可以抽出的活套。', duration: 22, initialProgress: 0.78,
    steps: steps(['准备短端', '形成绳圈', '辨认绳弯', '绳弯穿环', '拉紧活结'], [
      '辨认短的工作端，活结的绳弯由短端形成。',
      '先绕出一个绳圈，为短端绳弯留下入口。',
      '沿短端的走线看它如何折返；要穿入的是折弯部分。',
      '展示绳弯的两条腿从圈内经过，短端仍留在圈外。',
      '收小结芯并整理绳尾，保留活套。注意活套由短端的绳弯构成，拉短端可以把它抽出。',
    ]),
    source: 'https://www.animatedknots.com/slip-knot', sourceName: 'Animated Knots · Slip Knot',
    getState: trace(slipPath, [0.7, slipPath.marks[2], slipPath.marks[15], slipPath.marks[22], slipPath.total, slipPath.total], '#be7857', slipTight),
  },
  {
    id: 'overhand-loop', category: 'knots', name: '单结绳圈', title: '把双股当一根绳，打出固定绳圈',
    description: '折绳后以绳弯作为工作端，双股一起形成单结。',
    material: '一根对折的圆绳', materialNote: '两股属于同一根绳；最后集中结芯，把结外绳弯整理成明显的固定绳圈。', duration: 23, initialProgress: 0.76,
    steps: steps(['对折成绳弯', '双股绕圈', '绳弯靠近入口', '双股一起穿环', '拉紧单结绳圈'], [
      '先对折绳子，前端圆弯连接着两条并排绳段。',
      '把两股看成一根粗绳，一起绕出单结的绳圈。',
      '保持两股并排，把折弯端带到圈前。',
      '折弯端完整穿过绳圈，两股沿相同路径前进。',
      '牵引双股固定段，使结芯集中；把结外双股分开整理成绳圈，保留清楚的套环。',
    ]),
    source: 'https://www.netknots.com/rope_knots/overhand-loop-knot', sourceName: 'NetKnots · Overhand Loop Knot',
    getState: onBight(overhandPath, overhandCuts, '#b87e48', overhandTight),
  },
  {
    id: 'figure-eight-loop', category: 'knots', name: '八字绳圈', title: '用折弯端，完成双股八字路径',
    description: '将对折绳子的双股作为一个工作单元，形成八字固定绳圈。',
    material: '一根对折的圆绳', materialNote: '采用绳弯打法，只有一个固定绳圈；不是双耳八字结，也不是回穿系挂演示。', duration: 25, initialProgress: 0.77,
    steps: steps(['对折绳子', '双股上跨成圈', '绕过双股固定段', '折弯端穿环', '拉紧八字绳圈'], [
      '前端圆弯是工作端，两条并排的线始终属于同一根绳。',
      '双股一起上跨，形成八字结的第一个圈。',
      '把折弯端从双股固定段下方绕过去。',
      '折弯端向下穿回最初的绳圈，带着两股一起通过。',
      '把双股八字结的结芯收拢、绳尾拉顺，结外绳弯展开成一个固定绳圈。',
    ]),
    source: 'https://gravitec.com/resources/how-to-tie-knots/figure-eight-on-a-bight-knot/', sourceName: 'Gravitec · Figure-Eight on a Bight',
    getState: onBight(figurePath, figureCuts, '#ad7354', figureLoopTight),
  },
]
