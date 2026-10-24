import type { Course, LessonState, LessonStep, Vec3 } from './types'

// Authored knot routes with deterministic, reversible dressing; no runtime
// rope solver. Cylindrical coordinates keep the hitch routes outside the bar.
const RADIUS = 0.06
const BAR_RADIUS = 0.30
const BAR_Y = 0.65
const TIMES = [0, 0.14, 0.38, 0.62, 0.82, 1] as const
const clamp = (v: number) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0))
const ease = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t) }
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => a.map((v, i) => mix(v, b[i]!, t)) as Vec3
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
type Path = { points: Vec3[]; lengths: number[]; total: number; marks: number[] }

function pathOf(points: Vec3[], marks: number[] = []): Path {
  const lengths = [0]
  for (let i = 1; i < points.length; i++) lengths.push(lengths[i - 1]! + distance(points[i - 1]!, points[i]!))
  return { points, lengths, total: lengths.at(-1)!, marks }
}

function spline(controls: Vec3[], transform: (p: Vec3) => Vec3 = p => p): Path {
  const first = controls[0]!, last = controls.at(-1)!
  const padded = [first, first, ...controls, last, last]
  const points: Vec3[] = [transform([...first])], marks: number[] = []
  let arc = 0
  for (let span = 0; span < padded.length - 3; span++) {
    for (let i = 1; i <= 36; i++) {
      const t = i / 36, t2 = t * t, t3 = t2 * t
      const w = [(1 - t) ** 3 / 6, (4 - 6 * t2 + 3 * t3) / 6, (1 + 3 * t + 3 * t2 - 3 * t3) / 6, t3 / 6]
      const point = transform([0, 1, 2].map(a => w.reduce((sum, weight, k) => sum + padded[span + k]![a]! * weight, 0)) as Vec3)
      const step = distance(points.at(-1)!, point)
      if (step > 1e-10) { points.push(point); arc += step }
    }
    marks.push(arc)
  }
  return pathOf(points, marks)
}

function at(path: Path, offset: number): Vec3 {
  const s = Math.max(0, Math.min(path.total, offset))
  let left = 1, right = path.points.length - 1
  while (left < right) { const middle = (left + right) >> 1; if (path.lengths[middle]! < s) left = middle + 1; else right = middle }
  return lerp(path.points[left - 1]!, path.points[left]!, (s - path.lengths[left - 1]!) / (path.lengths[left]! - path.lengths[left - 1]! || 1))
}
function prefix(path: Path, amount: number): Vec3[] {
  const length = Math.max(0.25, Math.min(path.total, amount)), divisions = Math.max(16, Math.ceil(length / 0.018))
  return Array.from({ length: divisions + 1 }, (_, i) => at(path, length * i / divisions))
}
function stepAt(p: number) { for (let i = 4; i >= 0; i--) if (p >= TIMES[i]!) return i; return 0 }
function makeSteps(titles: string[], text: string[]): LessonStep[] { return titles.map((title, i) => ({ time: TIMES[i]!, title, instruction: text[i]! })) }
function revealed(p: number, cuts: number[]) { const i = stepAt(p); return mix(cuts[i]!, cuts[i + 1]!, ease((p - TIMES[i]!) / (TIMES[i + 1]! - TIMES[i]!))) }

function polarToWorld([x, angle, radius]: Vec3): Vec3 { return [x, BAR_Y + radius * Math.sin(angle), radius * Math.cos(angle)] }
function worldToPolar([x, y, z]: Vec3, turns = 0): Vec3 { return [x, Math.atan2(y - BAR_Y, z) + turns * Math.PI * 2, Math.hypot(y - BAR_Y, z)] }
type HitchKind = 'clove' | 'cow'
function hitchGuides(kind: HitchKind, tension: number): Vec3[] {
  const a = mix(0.52, 0.105, tension), pitch = mix(0.20, 0.126, tension)
  const radius = mix(0.95, 0.363, tension), lift = mix(0.50, 0.235, tension)
  const gate = 0.34, turn = Math.PI * 2
  const tangentTail = (x: number, angle: number, length: number, direction: number): Vec3 => {
    const y = BAR_Y + radius * Math.sin(angle) + length * direction * Math.cos(angle)
    const z = radius * Math.cos(angle) - length * direction * Math.sin(angle)
    const polar = worldToPolar([x, y, z])
    polar[1] += Math.round((angle - polar[1]) / turn) * turn
    return polar
  }
  const result: Vec3[] = Array.from({ length: 20 }, (_, i) => tangentTail(-a, gate, (20 - i) * 0.1, -1))
  // Approach the gate inside the returning collar; the collar crosses OVER
  // the standing tail, rather than simply forming two unlinked helical turns.
  for (let i = 0; i <= 20; i++) {
    const u = i / 20
    result.push([mix(-a, -a - pitch, ease(u)), gate + (turn - 2 * gate) * u, radius + lift * ease((u - 0.70) / 0.30)])
  }
  const bridgeStart = turn - gate, bridgeEnd = kind === 'clove' ? turn + gate : bridgeStart
  for (let i = 1; i <= 8; i++) {
    const u = i / 8, halfWidth = a + pitch
    result.push(kind === 'cow'
      ? [-halfWidth * Math.cos(Math.PI * u), bridgeEnd + halfWidth / (radius + lift) * Math.sin(Math.PI * u), radius + lift]
      : [mix(-halfWidth, halfWidth, u), mix(bridgeStart, bridgeEnd, u), radius + lift])
  }
  for (let i = 1; i <= 20; i++) {
    const u = i / 20, direction = kind === 'clove' ? 1 : -1
    result.push([mix(a + pitch, a, ease(u)), bridgeEnd + direction * (turn - 2 * gate) * u, radius + lift * (1 - ease(u / 0.30))])
  }
  const finalAngle = kind === 'clove' ? 2 * turn - gate : gate
  for (let i = 1; i <= 20; i++) result.push(tangentTail(a, finalAngle, i * 0.1, kind === 'clove' ? 1 : -1))
  return result
}
const hitchLoose = { clove: spline(hitchGuides('clove', 0), polarToWorld), cow: spline(hitchGuides('cow', 0), polarToWorld) }
function hitchState(kind: HitchKind, progress: number): LessonState {
  const p = clamp(progress), tension = ease((p - 0.82) / 0.18), loose = hitchLoose[kind]
  const path = tension > 0 ? spline(hitchGuides(kind, tension), polarToWorld) : loose
  const cuts = [0.7, loose.marks[20]!, loose.marks[41]!, loose.marks[49]!, loose.total, loose.total]
  const points = prefix(path, tension > 0 ? path.total : revealed(p, cuts))
  return { points, tip: [...points.at(-1)!], checkpoint: stepAt(p), radius: RADIUS, color: kind === 'clove' ? '#b87551' : '#c49648',
    supports: [{ id: 'hitch-bar', kind: 'cylinder', position: [0, BAR_Y, 0], axis: [1, 0, 0], radius: BAR_RADIUS, length: 3.6, color: '#bab5a9' }] }
}

// Two opposite half knots, independently authored from the reference route.
// Blue passes U/O/U, then U/O/U in the finished projection. The packed
// controls are offline authored data; every frame is a pure seekable morph.
const SQUARE_LOOSE: Vec3[][] = [
  [
    [-2.7, 0.0, 0.0],
    [-2.1, 0.0, -0.3],
    [-1.43, 0.0, -0.3],
    [-0.66, -0.132, -0.3],
    [0.242, -0.638, 0.3],
    [1.056, -0.748, 0.3],
    [1.54, -0.462, -0.3],
    [1.606, 0.088, -0.3],
    [1.32, 0.638, -0.3],
    [0.726, 0.902, -0.3],
    [0.11, 0.77, 0.3],
    [-0.55, 0.418, 0.3],
    [-1.21, 0.748, -0.3],
    [-1.87, 1.298, -0.3],
    [-2.4, 1.95, 0.0],
  ],
  [
    [2.7, 0.0, 0.0],
    [2.1, 0.0, 0.3],
    [1.54, 0.0, 0.3],
    [0.77, -0.066, 0.3],
    [0.11, -0.506, -0.3],
    [-0.572, -0.594, -0.3],
    [-0.99, -0.352, 0.3],
    [-1.144, 0.132, 0.3],
    [-1.122, 0.638, 0.3],
    [-0.858, 0.88, 0.3],
    [-0.462, 0.858, 0.3],
    [-0.198, 0.572, -0.3],
    [0.11, 0.308, -0.3],
    [0.55, 0.396, -0.3],
    [1.232, 0.902, 0.3],
    [2.2, 1.76, 0.3],
    [2.4, 1.95, 0.0],
  ],
]
const SQUARE_TIGHT: Vec3[][] = [
  [
    [-2.7, 0.0, 0.0],
    [-1.25, 0.0, 0.0],
    [-0.6532046, 0.0233046, -0.0187737],
    [-0.0844421, 0.094463, -0.0589375],
    [0.0280685, 0.0756208, 0.0913703],
    [0.1514551, -0.0725627, 0.032197],
    [0.2309572, -0.0095924, -0.1082465],
    [0.2343848, 0.079793, -0.1273583],
    [0.2236797, 0.1166781, -0.1330136],
    [0.1572773, 0.366679, -0.0860453],
    [0.012841, 0.3016902, 0.0931851],
    [-0.0389354, 0.1577803, 0.0005662],
    [-0.4987955, 0.3057551, -0.0565781],
    [-0.8696023, 0.3561659, -0.0447163],
    [-2.7, 0.45, 0.0],
  ],
  [
    [2.7, 0.0, 0.0],
    [1.25, 0.0, 0.0],
    [0.6986869, 0.0404848, 0.0125472],
    [0.1762921, 0.1132698, 0.0332898],
    [0.0898989, 0.0563834, -0.0996491],
    [-0.034467, -0.0778541, -0.0203836],
    [-0.1188163, -0.0063624, 0.111956],
    [-0.1357155, 0.1312172, 0.1131634],
    [-0.1457263, 0.1879177, 0.1294108],
    [-0.1366835, 0.2695819, 0.126382],
    [-0.1100418, 0.3504163, 0.0378533],
    [-0.0368629, 0.3146247, -0.0894869],
    [0.0686392, 0.1940664, -0.0742738],
    [0.1249695, 0.202692, 0.0466147],
    [0.5569614, 0.2883014, 0.0272571],
    [0.9815429, 0.4117999, 0.0528704],
    [2.7, 0.45, 0.0],
  ],
]
const squareLoose = SQUARE_LOOSE.map(controls => spline(controls))
function squareState(progress: number): LessonState {
  const p = clamp(progress), tension = ease((p - .82) / .18)
  const paths = tension > 0 ? SQUARE_LOOSE.map((controls, cord) => spline(controls.map((point, i) => lerp(point, SQUARE_TIGHT[cord]![i]!, tension)))) : squareLoose
  const visible = paths.map((path, cord) => {
    const loose = squareLoose[cord]!
    const cuts = cord === 0 ? [.55, loose.marks[2]!, loose.marks[8]!, loose.marks[11]!, loose.total, loose.total]
      : [.55, loose.marks[2]!, loose.marks[9]!, loose.marks[12]!, loose.total, loose.total]
    return prefix(path, tension > 0 ? path.total : revealed(p, cuts))
  })
  const points = visible[0]!
  return { points, tip: [...points.at(-1)!], checkpoint: stepAt(p), radius: RADIUS, color: '#4d7798',
    endCaps: { start: '1B', end: '1A' },
    strands: [{ id: 'reef-red', points: visible[1]!, color: '#b76554', radius: RADIUS, label: '红绳', endCaps: { start: '2B', end: '2A' } }] }
}

export const KNOT_UTILITY_COURSES: Course[] = [
  {
    id: 'square-knot', category: 'knots', name: '平结（方结）', title: '两个方向相反的半结，拉成平整的成品',
    description: '沿蓝、红两根绳认识两次反向穿绕；成品中同一根绳的头尾从同一侧引出。',
    material: '两根粗细相近、颜色不同的圆绳', materialNote: '适合认识轻载捆扎结构。平结不适合作为攀登、救援或重要承重的接绳结。', duration: 30, initialProgress: .62,
    steps: makeSteps(['辨认两根绳', '打第一个半结', '把工作端向上带回', '反向完成第二个半结', '同时拉紧平结'], [
      '蓝绳的工作端是 1A，红绳的工作端是 2A；1B、2B 保留在两侧。',
      '红绳压过蓝绳，再从下方绕回，完成第一个半结。留出足够的工作长度。',
      '把两个工作端向上带回。它们已经交换左右，准备从相反方向再绕一次。',
      '仍让红绳压过蓝绳，再绕回穿出；两次半结的方向相反，不能连续同向绕。',
      '向两侧均匀拉紧四个绳段，整理成扁平、贴合的结芯。检查每根绳的头尾都从同一侧引出。',
    ]), source: 'https://www.animatedknots.com/square-knot', sourceName: 'Animated Knots · Square / Reef Knot',
    getState: squareState,
  },
  {
    id: 'clove-hitch', category: 'knots', name: '双套结', title: '同向绕两圈，再从交叉段下穿出',
    description: '沿横杆辨认两个同向绕圈与前方斜跨绳段，认识双套结的结构。',
    material: '一根圆绳 + 一根横杆', materialNote: '展示从绳端绕杆的打法；用于认识临时固定结构，不用于安全关键承重。', duration: 26, initialProgress: 0.62,
    steps: makeSteps(['辨认横杆与绳端', '绕杆第一圈', '上跨固定段', '同向再绕并穿出', '收紧双套结'], [
      '横杆是被固定的物体。沿 1A 工作端观察路线，1B 是保留的固定段（另一端）。',
      '工作端完整绕横杆一周，回到固定段附近。',
      '把工作段从固定段上方跨过，斜向移到另一侧。',
      '沿同一方向再绕横杆一圈，从斜跨段的下方穿出。',
      '向两端轻拉，让两圈贴住横杆，整理斜跨段压住两个出口。绳径不变。',
    ]), source: 'https://www.animatedknots.com/clove-hitch-knot-rope-end', sourceName: 'Animated Knots · Clove Hitch — Rope End',
    getState: progress => hitchState('clove', progress),
  },
  {
    id: 'larks-head', category: 'knots', name: '雀头结', title: '反向绕第二圈，留下成对的垂线',
    description: '用单绳绕杆法形成雀头结，对比双套结的同向绕圈。',
    material: '一根圆绳 + 一根横杆', materialNote: '本课是 Cow Hitch 的绳端打法，也称 Lark’s Head；两圈方向相反，两个绳端留在同侧。', duration: 26, initialProgress: 0.64,
    steps: makeSteps(['辨认两个绳端', '绕杆第一圈', '绕回固定段前方', '反向绕第二圈', '拉紧雀头结'], [
      '辨认横杆、1A 工作端和保留的固定段 1B（另一端）。',
      '工作端绕横杆一周，先形成左侧的一个绕圈。',
      '绕回自身前方，在固定段外侧形成横向的套口。',
      '改变绕杆方向完成第二圈，从套口内侧沿原绳段旁引出；两端都朝下。',
      '同时轻拉两个绳端，让两圈贴杆、前方套口贴合，保留左右成对的垂线。',
    ]), source: 'https://www.animatedknots.com/cow-hitch-knot-end-method', sourceName: 'Animated Knots · Cow Hitch — End Method',
    getState: progress => hitchState('cow', progress),
  },
]
