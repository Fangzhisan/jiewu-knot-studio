import type { Course, LessonState, Vec3 } from './types'

// Each barrel is one continuous strand: standing part, two full coils,
// then the working end returning through BOTH coils. The other standing
// part remains in its core. This is not a second decorative surface loop.
const RADIUS = .06
const TIMES = [0, .14, .38, .62, .82, 1] as const
const clamp = (v: number) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0))
const ease = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t) }
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)]
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
type Route = { points: Vec3[]; lengths: number[]; marks: number[]; total: number }

function barrel(tension: number, slide: number): Route {
  const radius = mix(.65, .32, tension), half = mix(.5, .2, tension)
  const offset = mix(.13, .09, tension), tailHeight = mix(.26, .135, tension)
  const bend = mix(.5, .3, tension), center = -mix(1.3, .361, slide)
  const points: Vec3[] = [], lengths: number[] = [], marks: number[] = []
  let total = 0
  const add = (point: Vec3) => {
    const previous = points.at(-1)
    if (previous) { const d = distance(previous, point); if (d < 1e-10) return; total += d }
    points.push(point); lengths.push(total)
  }
  const line = (end: Vec3) => {
    const start = points.at(-1)!, divisions = Math.max(2, Math.ceil(distance(start, end) / .014))
    for (let i = 1; i <= divisions; i++) add(lerp(start, end, i / divisions))
  }
  const cubic = (b: Vec3, c: Vec3, d: Vec3) => {
    const a = points.at(-1)!
    for (let i = 1; i <= 80; i++) {
      const t = i / 80, s = 1 - t
      add([0, 1, 2].map(axis => a[axis]! * s ** 3 + 3 * b[axis]! * s * s * t + 3 * c[axis]! * s * t * t + d[axis]! * t ** 3) as Vec3)
    }
  }
  add([3, -offset, 0])
  line([center - half - bend, -offset, 0])
  // A round hairpin keeps the entering strand's local bend radius larger
  // than the cord; a single cubic U-turn can silently fold the tube mesh.
  const turnRadius = mix(.24, .15, tension), turnX = center - half - bend
  for (let i = 1; i <= 80; i++) {
    const angle = Math.PI * i / 80
    add([turnX - turnRadius * Math.sin(angle), -offset - turnRadius * (1 - Math.cos(angle)), 0])
  }
  cubic([turnX + bend * .55, -offset - 2 * turnRadius, 0], [center - half - .025, -radius * .8, radius], [center - half, 0, radius])
  marks.push(total)
  for (let i = 1; i <= 360; i++) {
    const u = i / 360, angle = Math.PI * 4 * u
    add([center - half + 2 * half * u, radius * Math.sin(angle), radius * Math.cos(angle)])
  }
  marks.push(total)
  cubic([center + half + .05, radius * .8, radius], [center + half + bend, 0, tailHeight], [center + half - .06, 0, tailHeight])
  line([-3, 0, tailHeight])
  marks.push(total)
  return { points, lengths, marks, total }
}

function prefix(route: Route, amount: number): Vec3[] {
  const limit = Math.min(route.total, Math.max(.3, amount)), result: Vec3[] = []
  const divisions = Math.max(16, Math.ceil(limit / .014))
  let index = 1
  // Equal arc spacing avoids a microscopic final segment: the renderer's
  // end tangent would otherwise rotate a full tube ring across that segment.
  for (let i = 0; i <= divisions; i++) {
    const offset = limit * i / divisions
    while (index < route.points.length - 1 && route.lengths[index]! < offset) index++
    result.push(lerp(route.points[index - 1]!, route.points[index]!, (offset - route.lengths[index - 1]!) / (route.lengths[index]! - route.lengths[index - 1]!)))
  }
  return result
}
function checkpoint(p: number) { for (let i = 4; i >= 0; i--) if (p >= TIMES[i]!) return i; return 0 }
const loose = barrel(0, 0)
function getState(progress: number): LessonState {
  const p = clamp(progress), step = checkpoint(p)
  // Dress both barrels before moving them together; neither phase shrinks
  // the cord radius. All state is derived from progress, including rewind.
  const tension = ease((p - .82) / .09), slide = ease((p - .91) / .09)
  const route = p > .82 ? barrel(tension, slide) : loose
  const blueCuts = [.55, loose.marks[0]!, loose.marks[1]!, loose.total, loose.total, loose.total]
  const redCuts = [.55, loose.marks[0]!, loose.marks[0]!, loose.marks[0]!, loose.total, loose.total]
  const local = ease((p - TIMES[step]!) / (TIMES[step + 1]! - TIMES[step]!))
  const blue = prefix(route, p >= .82 ? route.total : mix(blueCuts[step]!, blueCuts[step + 1]!, local))
  const red = prefix(route, p >= .82 ? route.total : mix(redCuts[step]!, redCuts[step + 1]!, local)).map(([x, y, z]) => [-x, -y, z] as Vec3)
  return {
    points: blue, tip: [...blue.at(-1)!], checkpoint: step, radius: RADIUS, color: '#4d7798',
    endCaps: { start: '1B', end: '1A' },
    strands: [{ id: 'double-fisherman-red', points: red, color: '#b76554', radius: RADIUS, label: '红绳', endCaps: { start: '2B', end: '2A' } }],
  }
}

export const DOUBLE_FISHERMAN_COURSES: Course[] = [{
  id: 'double-fishermans-knot', category: 'knots', name: '双渔人结', title: '各绕两圈，再从双圈内回穿',
  description: '蓝、红两端各绕两圈并从双圈内回穿，分别形成双绕结芯；先整理每个结芯，再沿主绳拉拢。',
  material: '两根等径圆绳', materialNote: '对照单渔人结辨认多出的一次绕行与共同回穿通道。仅作工艺结构教学。',
  duration: 38, initialProgress: .62,
  steps: [
    { time: TIMES[0], title: '对向并排两根绳', instruction: '蓝绳主段 1B 在右，红绳主段 2B 在左；把两根绳相向重叠，工作端 1A、2A 分别朝向另一侧。' },
    { time: TIMES[1], title: '蓝端连续绕两圈', instruction: '用蓝色工作端 1A 把红色主绳和自己的主段一起绕住，连续绕两圈。两圈沿绳轴依次排开，不互相穿越。' },
    { time: TIMES[2], title: '蓝端回穿两个圈', instruction: '让 1A 从第二圈后方折回，沿双圈内部依次穿过两圈，朝左露出绳尾；保留内部通道，便于看清回穿。' },
    { time: TIMES[3], title: '红端对称绕穿', instruction: '在另一侧，用 2A 围绕蓝色主绳和红绳自身连续绕两圈，再从双圈内部回穿。两个工作端分别向外露出。' },
    { time: TIMES[4], title: '先收结芯，再拉拢', instruction: '先分别整理蓝、红双绕结芯，确认每个工作端穿过自己的两圈；再向外拉主绳 1B、2B，使两个结芯沿绳滑近相抵。' },
  ],
  source: 'https://www.animatedknots.com/double-fishermans-bend-knot', sourceName: 'Animated Knots · Double Fisherman’s Bend',
  getState,
}]
