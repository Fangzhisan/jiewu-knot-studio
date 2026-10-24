import type { Course, LessonState, Vec3 } from './types'

// A single diagonal row of three double half hitches. Each working cord is
// continuous: fixed tail, first collar, overpassing bridge, second collar,
// working tail. Polar routes keep the collars outside the holding cord.
const HOLDING_RADIUS = .065
const WORKING_RADIUS = .045
const COLORS = ['#c49648', '#b87551', '#6387a1'] as const
const TIMES = [0, .08, .25, .42, .82] as const
const TAU = Math.PI * 2
const GATE = .30
const AXIS: Vec3 = [.8, -.6, 0]
const ACROSS: Vec3 = [-.6, -.8, 0]
const clamp = (x: number) => Math.max(0, Math.min(1, Number.isFinite(x) ? x : 0))
const ease = (x: number) => { const t = clamp(x); return t * t * (3 - 2 * t) }
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => a.map((v, k) => mix(v, b[k]!, t)) as Vec3
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
const world = ([u, v, z]: Vec3): Vec3 => [u * AXIS[0] + v * ACROSS[0], u * AXIS[1] + v * ACROSS[1], z]
const polar = (u: number, theta: number, radius: number): Vec3 => [u, radius * Math.sin(theta), radius * Math.cos(theta)]

function resample(points: Vec3[], amount = 1): Vec3[] {
  const lengths = [0]
  for (let i = 1; i < points.length; i++) lengths.push(lengths[i - 1]! + distance(points[i - 1]!, points[i]!))
  const length = lengths.at(-1)! * amount
  const divisions = Math.max(12, Math.ceil(length / .018)), output: Vec3[] = []
  let cursor = 1
  for (let i = 0; i <= divisions; i++) {
    const offset = length * i / divisions
    while (cursor < lengths.length - 1 && lengths[cursor]! < offset) cursor++
    output.push(world(lerp(points[cursor - 1]!, points[cursor]!, (offset - lengths[cursor - 1]!) / (lengths[cursor]! - lengths[cursor - 1]! || 1))))
  }
  return output
}

function workingRoute(index: number, progress: number, gather: number): Vec3[] {
  const baseStation = (index - 1) * .72
  const station = mix(baseStation, (index - 1) * .42, gather)
  const pairProgress = index === 0 ? clamp((progress - .08) / .34)
    : clamp((progress - (.42 + (index - 1) * .20)) / .20)
  const firstDress = mix(.85 * ease((pairProgress - .42) / .08), 1, gather)
  const secondDress = mix(.85 * ease((pairProgress - .90) / .10), 1, gather)
  const firstR = mix(.31, .115, firstDress), secondR = mix(.31, .115, secondDress)
  const firstPitch = mix(.16, .105, firstDress), secondPitch = mix(.16, .105, secondDress)
  const a = mix(.18, .075, Math.min(firstDress, secondDress))
  const firstBridgeRadius = firstR + .123, secondBridgeRadius = secondR + .123
  const points: Vec3[] = []
  const entry = polar(station - a, GATE, firstR)
  const entryTangent: Vec3 = [0, Math.cos(GATE), -Math.sin(GATE)]
  const fixed: Vec3 = [(index - 1) * .55 - .18, -1.55, .72]
  const lead = entry.map((v, k) => v - entryTangent[k]! * .55) as Vec3
  // Cubic approach keeps the fixed B end stationary during local dressing.
  const control1: Vec3 = [fixed[0], fixed[1] + .5, fixed[2]]
  const control2 = lead
  for (let i = 0; i <= 50; i++) {
    const t = i / 50, s = 1 - t
    points.push([0, 1, 2].map(k => s ** 3 * fixed[k]! + 3 * s * s * t * control1[k]! + 3 * s * t * t * control2[k]! + t ** 3 * entry[k]!) as Vec3)
  }
  const firstStart = points.length - 1
  for (let i = 1; i <= 120; i++) {
    const t = i / 120
    points.push(polar(station + mix(-a, -a - firstPitch, ease(t)), GATE + (TAU - 2 * GATE) * t, mix(firstR, firstBridgeRadius, ease((t - .68) / .32))))
  }
  const bridgeLeft = station - a - firstPitch, bridgeRight = station + a + secondPitch
  const leftRound = firstBridgeRadius * GATE, rightRound = secondBridgeRadius * GATE
  // Rounded corners join circumferential collars to the front bridge with
  // matching tangents. A straight diagonal bridge would kink at both joins.
  for (let i = 1; i <= 30; i++) {
    const q = i / 30 * Math.PI / 2
    points.push(polar(bridgeLeft + leftRound * (1 - Math.cos(q)), TAU - GATE + GATE * Math.sin(q), firstBridgeRadius))
  }
  let firstEnd = points.length - 1
  for (let i = 1; i <= 40; i++) {
    const t = i / 40
    points.push(polar(mix(bridgeLeft + leftRound, bridgeRight - rightRound, t), TAU, mix(firstBridgeRadius, secondBridgeRadius, ease(t))))
    if (i === 12) firstEnd = points.length - 1
  }
  for (let i = 1; i <= 30; i++) {
    const q = i / 30 * Math.PI / 2
    points.push(polar(bridgeRight - rightRound + rightRound * Math.sin(q), TAU + GATE * (1 - Math.cos(q)), secondBridgeRadius))
  }
  for (let i = 1; i <= 120; i++) {
    const t = i / 120
    points.push(polar(station + mix(a + secondPitch, a, ease(t)), TAU + GATE + (TAU - 2 * GATE) * t, mix(secondBridgeRadius, secondR, ease(t / .32))))
  }
  const exit = points.at(-1)!, finalAngle = 2 * TAU - GATE
  const tailLength = 1.30
  for (let i = 1; i <= 50; i++) {
    const t = i / 50
    points.push([exit[0], exit[1] + tailLength * t * Math.cos(finalAngle), exit[2] - tailLength * t * Math.sin(finalAngle)])
  }
  // Reveal a continuous route. A is always the actual end of that route;
  // this is a laying-out diagram, not an inextensible-rope simulation.
  const arc = [0]
  for (let i = 1; i < points.length; i++) arc.push(arc[i - 1]! + distance(points[i - 1]!, points[i]!))
  const firstCut = arc[firstEnd]!, full = arc.at(-1)!
  const firstFraction = clamp(pairProgress * 2)
  const amount = pairProgress < .5
    ? mix(arc[firstStart]!, firstCut, ease(firstFraction))
    : mix(firstCut, full, ease((pairProgress - .5) * 2))
  return resample(points, amount / full)
}

export function getDiagonalHitchState(progress: number): LessonState {
  const p = clamp(progress), gather = ease((p - .82) / .18)
  const strands = Array.from({ length: 3 }, (_, index) => ({
    id: `diagonal-working-${index + 2}`, points: workingRoute(index, p, gather), color: COLORS[index]!, radius: WORKING_RADIUS,
    endCaps: { start: `${index + 2}B`, end: `${index + 2}A` },
  }))
  const active = p < .42 ? 0 : p < .62 ? 1 : 2
  const points = [world([-1.65, 0, 0]), world([1.65, 0, 0])]
  return {
    points, radius: HOLDING_RADIUS, color: '#326558', endCaps: { start: '1B', end: '1A' },
    strands, tip: [...strands[active]!.points.at(-1)!], hideMainTip: true,
    checkpoint: TIMES.reduce<number>((result, time, index) => p >= time ? index : result, 0),
  }
}

export const DIAGONAL_HITCH_COURSES: Course[] = [{
  id: 'macrame-diagonal-double-half-hitch', category: 'weaving', name: '斜卷结编织', title: '斜卷结 · 同一根连续挂结两次',
  description: '保持一根承绳斜向拉直，三根工作绳依次各做两个半结，形成一排斜向结纹。',
  material: '一根承绳 + 三根工作绳', materialNote: '上端预先固定；1 号是承绳，2–4 号是工作绳。画面逐段铺线示意穿绕路径。',
  duration: 40, initialProgress: .42, projectionFocus: 'curves',
  steps: [
    { time: 0, title: '拉直斜向承绳', instruction: '保持绿色 1 号承绳的 1B 固定端和 1A 拉持端张力；金、陶红、蓝工作绳的 B 端预先固定。' },
    { time: .08, title: '2A 绕出第一个半结', instruction: '沿金绳 2A 观察：跨过承绳、绕到后方，再穿过自己留下的圈。工作段越过自身固定段，形成第一个半结。' },
    { time: .25, title: '同一根再挂结一次', instruction: '仍使用 2A，按相同方向再做一个半结，放在第一个的右下方；两次合成一个斜卷结。' },
    { time: .42, title: '3A、4A 依次重复', instruction: '陶红 3A 连续做两次，随后蓝色 4A 连续做两次。已完成的结对保留，承绳与工作绳始终不交换角色。' },
    { time: .82, title: '逐对靠拢并收紧', instruction: '继续拉直承绳，逐个整理三对半结，使圈口贴合并沿斜线靠拢。确认每根工作绳都有两次同向挂结，绳端连续且没有穿过其他绳身。' },
  ],
  source: 'https://www.dmc.com/FI/en-GB/sbs-macrame-stitch-diagrams', sourceName: 'DMC · Diagonal Double Half Hitch',
  getState: getDiagonalHitchState,
}]
