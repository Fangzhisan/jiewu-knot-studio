import type { Course, LessonState, LessonStep, Vec3 } from './types'

// Independent two-rope joins, with pre-authored route construction and
// continuous dressing. Progress is pure input; no accumulated simulation.
const RADIUS = 0.06
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


const SHEET_LOOSE: Vec3[][] = [
  [
    [-2.7, 0.0, 0.0],
    [-2.1, 0.0, 0.288],
    [-1.98, -0.11, 0.288],
    [-0.88, -0.264, 0.16],
    [0.11, -0.726, -0.288],
    [0.968, -0.858, -0.288],
    [1.716, -0.638, 0.288],
    [2.09, -0.176, 0.288],
    [2.024, 0.462, 0.288],
    [1.694, 0.858, 0.288],
    [1.232, 0.99, -0.4],
    [0.726, 0.902, -0.4],
    [-0.022, 0.528, -0.4],
    [-0.88, 0.594, 0.288],
    [-1.87, 0.902, 0.288],
    [-2.1, 1.3, 0.288],
    [-2.4, 1.6, 0.0],
  ],
  [
    [2.7, 0.0, 0.0],
    [2.55, 0.0, -0.288],
    [2.42, 0.0, -0.288],
    [1.628, 0.0, -0.288],
    [1.078, 0.308, 0.24],
    [0.484, 0.748, 0.384],
    [-0.154, 1.166, 0.384],
    [-0.748, 1.232, 0.16],
    [-1.21, 1.034, -0.288],
    [-1.54, 0.594, -0.288],
    [-1.562, -0.022, -0.288],
    [-1.32, -0.572, 0.24],
    [-0.858, -0.836, 0.288],
    [-0.33, -0.682, 0.288],
    [0.022, -0.264, 0.24],
    [0.286, 0.286, 0.0],
    [0.572, 1.034, -0.032],
    [0.88, 1.9, -0.032],
    [1.25, 2.2, -0.032],
    [1.5, 2.5, 0.0],
  ],
]

const SHEET_TIGHT: Vec3[][] = [
  [
    [-2.7, 0.0, 0.0],
    [-1.2, 0.0, 0.0],
    [-0.8558823, 0.0357524, 0.045698],
    [-0.2434948, 0.125959, 0.10601],
    [8.98e-05, 0.0812835, -0.06463],
    [0.212312, -0.0254417, 0.0910957],
    [0.3130551, 0.0510957, 0.1111176],
    [0.3354871, 0.0986918, 0.0975591],
    [0.3499766, 0.1362949, 0.0844889],
    [0.3396911, 0.1908275, 0.0454458],
    [0.3038792, 0.2269977, -0.0273634],
    [0.2017001, 0.2095508, -0.0775167],
    [0.0417447, 0.1962321, -0.1003291],
    [-0.2191511, 0.2419103, 0.1329515],
    [-0.8549761, 0.3268829, 0.0461153],
    [-1.3286133, 0.4012336, 0.0833126],
    [-2.7, 0.45, 0.0],
  ],
  [
    [2.7, 0.0, 0.0],
    [1.2, 0.0, 0.0],
    [1.1079923, 0.0329312, -0.0464238],
    [0.6048835, 0.0627346, -0.0021296],
    [0.2023249, 0.0673049, -0.0717457],
    [0.208953, 0.2232252, 0.2232839],
    [-0.011264, 0.3523993, 0.1052413],
    [-0.1224688, 0.3516366, -0.0798721],
    [-0.1824925, 0.201233, -0.099042],
    [-0.1872771, 0.143332, -0.0889783],
    [-0.199189, 0.0604765, -0.0889513],
    [-0.1824146, 0.0006558, -0.046125],
    [-0.1583413, -0.0227811, -0.0052105],
    [-0.1058015, -0.0385183, 0.0714545],
    [0.0088119, 0.0782527, 0.1523691],
    [0.0904617, 0.2458328, 0.0074355],
    [0.3257742, 0.3681812, 0.0501105],
    [0.5634913, 0.3920073, 0.0174106],
    [0.736516, 0.5015113, 0.0142275],
    [2.7, 0.45, 0.0],
  ],
]

const sheetLoose = SHEET_LOOSE.map(controls => spline(controls))
function sheetState(progress: number): LessonState {
  const p = clamp(progress), tension = ease((p - .82) / .18)
  const paths = tension > 0 ? SHEET_LOOSE.map((controls, cord) => spline(controls.map((point, i) => lerp(point, SHEET_TIGHT[cord]![i]!, tension)))) : sheetLoose
  const visible = paths.map((path, cord) => {
    const loose = sheetLoose[cord]!
    const cuts = cord === 0 ? [.55, loose.total, loose.total, loose.total, loose.total, loose.total]
      : [.55, loose.marks[2]!, loose.marks[7]!, loose.marks[15]!, loose.total, loose.total]
    return prefix(path, tension > 0 ? path.total : revealed(p, cuts))
  })
  return pairedState(visible, p)
}
function pairedState(visible: Vec3[][], p: number): LessonState {
  const points = visible[0]!
  return { points, tip: [...points.at(-1)!], checkpoint: stepAt(p), radius: RADIUS, color: '#4d7798',
    endCaps: { start: '1B', end: '1A' },
    strands: [{ id: 'join-red', points: visible[1]!, color: '#b76554', radius: RADIUS, label: '红绳', endCaps: { start: '2B', end: '2A' } }] }
}

// The blue overhand surrounds the red standing part; the second overhand
// is its half-turn partner. Both slide together while their loop axes close.
const FISHER_LOOSE: Vec3[][] = [
  [
    [2.7, -0.6828571, 0.0],
    [2.0, -0.6828571, 0.0],
    [1.3, -0.6828571, 0.0],
    [0.5, -0.6828571, 0.0],
    [-0.3, -0.6828571, 0.0],
    [-1.2766074, -0.0177406, 0.3106809],
    [-1.4992344, 0.1013345, -0.3756467],
    [-1.6393254, 0.3050571, -0.5446873],
    [-1.665326, 0.5502819, -0.4188525],
    [-1.5713798, 0.7857339, -0.1604042],
    [-1.3786475, 0.9516785, 0.1121421],
    [-1.1305401, 1.0107381, 0.3122432],
    [-0.8829418, 0.9496102, 0.3820704],
    [-0.6916218, 0.7820632, 0.2933543],
    [-0.5996733, 0.5458355, 0.0478204],
    [-0.6278069, 0.3009948, -0.3244218],
    [-0.7696857, 0.0984046, -0.7691064],
    [-0.9933527, -0.0188782, -1.225571],
    [-1.2504, -0.3116571, -1.1419429],
    [-2.1064, -0.0332571, -1.0971429],
    [-2.2072, 0.5351429, 0.9636571],
    [-1.0664, 0.4583429, 0.9636571],
    [-1.0664, 0.4583429, -1.3659429],
    [-2.6, 0.9, -1.3659429],
    [-2.6, -0.8, -0.8],
    [-2.7, -1.05, 0.0],
  ],
  [
    [-2.7, 0.6828571, 0.0],
    [-2.0, 0.6828571, 0.0],
    [-1.3, 0.6828571, 0.0],
    [-0.5, 0.6828571, 0.0],
    [0.3, 0.6828571, 0.0],
    [1.2766074, 0.0177406, 0.3106809],
    [1.4992344, -0.1013345, -0.3756467],
    [1.6393254, -0.3050571, -0.5446873],
    [1.665326, -0.5502819, -0.4188525],
    [1.5713798, -0.7857339, -0.1604042],
    [1.3786475, -0.9516785, 0.1121421],
    [1.1305401, -1.0107381, 0.3122432],
    [0.8829418, -0.9496102, 0.3820704],
    [0.6916218, -0.7820632, 0.2933543],
    [0.5996733, -0.5458355, 0.0478204],
    [0.6278069, -0.3009948, -0.3244218],
    [0.7696857, -0.0984046, -0.7691064],
    [0.9933527, 0.0188782, -1.225571],
    [1.2504, 0.3116571, -1.1419429],
    [2.1064, 0.0332571, -1.0971429],
    [2.2072, -0.5351429, 0.9636571],
    [1.0664, -0.4583429, 0.9636571],
    [1.0664, -0.4583429, -1.3659429],
    [2.6, -0.9, -1.3659429],
    [2.6, 0.8, -0.8],
    [2.7, 1.05, 0.0],
  ],
]

const FISHER_TIGHT: Vec3[][] = [
  [
    [2.7, -0.0650268, 0.0],
    [2.0060257, -0.0654114, -7.3e-06],
    [1.2350045, -0.0708615, -0.0044973],
    [0.380194, -0.0812091, -0.0012182],
    [0.0964108, -0.0697644, 0.0059955],
    [0.0816848, -0.2305775, 0.0121369],
    [-0.3025286, -0.1539851, -0.1130286],
    [-0.2480677, 0.1127823, -0.1382788],
    [-0.2385931, 0.1706522, -0.0981161],
    [-0.2260668, 0.216977, -0.0287486],
    [-0.2008745, 0.2104307, 0.0655056],
    [-0.1733187, 0.1504549, 0.1325674],
    [-0.1357629, 0.0844913, 0.1361386],
    [-0.1066032, -0.0189764, 0.210592],
    [-0.0483358, -0.1041913, 0.1526396],
    [-0.0106911, -0.0608448, 0.0153317],
    [-0.0070518, -0.0640102, -0.0653438],
    [-0.0088665, -0.1207014, -0.149306],
    [-0.0330773, -0.2479301, -0.1781314],
    [-0.1302027, -0.3549708, -0.0648058],
    [-0.183281, -0.2402635, 0.0922922],
    [-0.145767, -0.0281162, 0.0465981],
    [-0.109363, -0.0253056, -0.2158009],
    [-0.3400824, -0.081994, -0.3038705],
    [-1.7445472, -0.1992032, -0.1134605],
    [-2.7, -0.2599579, 0.0],
  ],
  [
    [-2.7, 0.0650268, 0.0],
    [-2.0060257, 0.0654114, -7.3e-06],
    [-1.2350045, 0.0708615, -0.0044973],
    [-0.380194, 0.0812091, -0.0012182],
    [-0.0964108, 0.0697644, 0.0059955],
    [-0.0816848, 0.2305775, 0.0121369],
    [0.3025286, 0.1539851, -0.1130286],
    [0.2480677, -0.1127823, -0.1382788],
    [0.2385931, -0.1706522, -0.0981161],
    [0.2260668, -0.216977, -0.0287486],
    [0.2008745, -0.2104307, 0.0655056],
    [0.1733187, -0.1504549, 0.1325674],
    [0.1357629, -0.0844913, 0.1361386],
    [0.1066032, 0.0189764, 0.210592],
    [0.0483358, 0.1041913, 0.1526396],
    [0.0106911, 0.0608448, 0.0153317],
    [0.0070518, 0.0640102, -0.0653438],
    [0.0088665, 0.1207014, -0.149306],
    [0.0330773, 0.2479301, -0.1781314],
    [0.1302027, 0.3549708, -0.0648058],
    [0.183281, 0.2402635, 0.0922922],
    [0.145767, 0.0281162, 0.0465981],
    [0.109363, 0.0253056, -0.2158009],
    [0.3400824, 0.081994, -0.3038705],
    [1.7445472, 0.1992032, -0.1134605],
    [2.7, 0.2599579, 0.0],
  ],
]

const fisherLoose = FISHER_LOOSE.map(controls => spline(controls))
function fishermanState(progress: number): LessonState {
  const p = clamp(progress), tension = ease((p - .82) / .18)
  const paths = tension > 0 ? FISHER_LOOSE.map((controls, cord) => spline(controls.map((point, i) => lerp(point, FISHER_TIGHT[cord]![i]!, tension)))) : fisherLoose
  const visible = paths.map((path, cord) => {
    const loose = fisherLoose[cord]!
    const cuts = cord === 0 ? [.55, loose.marks[4]!, loose.total, loose.total, loose.total, loose.total]
      : [.55, loose.marks[4]!, loose.marks[4]!, loose.marks[20]!, loose.total, loose.total]
    return prefix(path, tension > 0 ? path.total : revealed(p, cuts))
  })
  return pairedState(visible, p)
}

export const JOINT_KNOT_COURSES: Course[] = [
  {
    id: 'sheet-bend', category: 'knots', name: '单编结', title: '穿入绳弯，绕过双股，再压到自身下方',
    description: '蓝绳形成一个绳弯，红绳绕过两股后扣住自身；最后检查两个工作端位于结的同一侧。',
    material: '两根圆绳', materialNote: '本课用等径绳辨认结构。若绳子粗细不同，应由较粗的绳形成绳弯。仅作工艺结构教学。', duration: 30, initialProgress: .62,
    steps: makeSteps(['折出蓝色绳弯', '红绳穿入绳弯', '绕过蓝绳两股', '压到红绳自身下方', '拉紧单编结'], [
      '沿蓝绳 1A 折出绳弯；红绳 2A 是接下来穿绕的工作端。保持两股蓝绳清楚可见。',
      '让红色工作端从蓝色绳弯内穿入，留出足够的绳尾。',
      '依次从蓝绳的绳尾与固定段后方绕过，把两股一起圈住。',
      '把红色工作端压到红绳自身下方穿出，不再穿回蓝色绳弯。',
      '向外轻拉并整理四个绳段，让圈口贴合。蓝、红两个工作端应位于结的同一侧。',
    ]), source: 'https://www.animatedknots.com/sheet-bend-knot', sourceName: 'Animated Knots · Sheet Bend',
    getState: sheetState,
  },
  {
    id: 'fishermans-knot', category: 'knots', name: '渔人结', title: '各自在对方主绳上打单结，再把两结拉拢',
    description: '两根绳各打一个单结，分别套住对方的主绳；拉动两根主绳，让两个结芯相互贴住。',
    material: '两根圆绳', materialNote: '本课展示单渔人结：每根绳各绕一次形成单结，区别于绕两圈的双渔人结。仅作工艺结构教学。', duration: 32, initialProgress: .62,
    steps: makeSteps(['对向放置两根绳', '蓝端打一个单结', '红端绕蓝绳成圈', '红端穿圈并检查', '拉紧并靠拢两结'], [
      '让两根绳的工作端朝向相反方向，先把两段主绳并排放好。',
      '蓝色工作端 1A 绕住红色主绳，穿回自己的圈中，形成第一个单结。',
      '红色工作端 2A 在另一侧绕住蓝色主绳，做出第二个单结的绳圈。',
      '把红色工作端穿回红圈。检查两个单结都各自套住对方主绳，工作端分别朝外。',
      '先整理两个单结，再向相反方向拉主绳 1B、2B，让两个结芯沿绳滑近并紧密相抵。',
    ]), source: 'https://www.netknots.com/rope_knots/fishermans-knot', sourceName: 'NetKnots · Fisherman’s Knot',
    getState: fishermanState,
  },
]
