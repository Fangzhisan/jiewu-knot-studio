import type { Course, LessonState, LessonStep, LessonSupport, Vec3 } from './types'

// Original, progress-derived teaching paths. The final dressing keeps the
// crossing order and cord thickness; these are not tension simulations.
const TAU = Math.PI * 2
const TIMES = [0, .18, .40, .64, .82, 1] as const
const clamp = (v: number) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0))
const ease = (v: number) => { const t = clamp(v); return t * t * (3 - 2 * t) }
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => a.map((v, k) => mix(v, b[k]!, t)) as Vec3
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
function atStep(p: number) { for (let i = 4; i >= 0; i--) if (p >= TIMES[i]!) return i; return 0 }
class Route {
  points: Vec3[] = []
  lengths: number[] = []
  marks: number[] = []
  total = 0
  add(p: Vec3) {
    const previous = this.points.at(-1)
    const d = previous ? distance(previous, p) : 0
    if (previous && d < 1e-9) return
    this.total += d; this.points.push([...p]); this.lengths.push(this.total)
  }
  line(to: Vec3) {
    const from = this.points.at(-1)!
    const n = Math.max(2, Math.ceil(distance(from, to) / .018))
    for (let i = 1; i <= n; i++) this.add(lerp(from, to, i / n))
  }
  cubic(b: Vec3, c: Vec3, d: Vec3) {
    const a = this.points.at(-1)!
    for (let i = 1; i <= 80; i++) {
      const t = i / 80, s = 1 - t
      this.add([0, 1, 2].map(k => a[k]! * s ** 3 + 3 * b[k]! * s ** 2 * t + 3 * c[k]! * s * t * t + d[k]! * t ** 3) as Vec3)
    }
  }
  mark() { this.marks.push(this.total) }
  smooth() {
    // Fair the authored polyline into C2 bends before generating tube rings.
    // All clearance checks below use this final path, never the control polygon.
    const oldTotal = this.total, sampled = this.prefix(oldTotal)
    const controls = sampled.filter((_, i) => i % 6 === 0)
    if (distance(controls.at(-1)!, sampled.at(-1)!) > 1e-9) controls.push(sampled.at(-1)!)
    const closed = distance(controls[0]!, controls.at(-1)!) < 1e-6
    const first = controls[0]!, last = controls.at(-1)!
    if (closed) controls.pop()
    const padded = closed ? [controls.at(-1)!, ...controls, controls[0]!, controls[1]!]
      : [first, first, ...controls, last, last]
    this.points = []; this.lengths = []; this.total = 0
    for (let span = 0; span < padded.length - 3; span++) {
      for (let i = 0; i <= 8; i++) {
        const t = i / 8, t2 = t * t, t3 = t2 * t
        const weights = [(1 - t) ** 3 / 6, (4 - 6 * t2 + 3 * t3) / 6, (1 + 3 * t + 3 * t2 - 3 * t3) / 6, t3 / 6]
        this.add([0, 1, 2].map(k => weights.reduce((sum, w, j) => sum + w * padded[span + j]![k]!, 0)) as Vec3)
      }
    }
    if (closed) this.add([...this.points[0]!])
    this.marks = this.marks.map(mark => mark / oldTotal * this.total)
  }
  prefix(amount: number) {
    const length = Math.max(.25, Math.min(this.total, amount)), n = Math.max(24, Math.ceil(length / .018))
    let cursor = 1
    return Array.from({ length: n + 1 }, (_, i) => {
      const x = length * i / n
      while (cursor < this.lengths.length - 1 && this.lengths[cursor]! < x) cursor++
      return lerp(this.points[cursor - 1]!, this.points[cursor]!, (x - this.lengths[cursor - 1]!) / (this.lengths[cursor]! - this.lengths[cursor - 1]!))
    })
  }
}
function shown(route: Route, p: number) {
  route.smooth()
  if (p >= .82) return route.prefix(route.total)
  const i = atStep(p), cuts = [.35, ...route.marks, route.total]
  return route.prefix(mix(cuts[i]!, cuts[i + 1]!, ease((p - TIMES[i]!) / (TIMES[i + 1]! - TIMES[i]!))))
}
function state(route: Route, p: number, radius: number, supports: LessonSupport[], color: string): LessonState {
  const points = shown(route, p)
  return { points, tip: [...points.at(-1)!], radius, color, supports, checkpoint: atStep(p), endCaps: { start: '1B', end: '1A' } }
}
function steps(titles: string[], instructions: string[]): LessonStep[] {
  return titles.map((title, i) => ({ time: TIMES[i]!, title, instruction: instructions[i]! }))
}

// A complete round turn about a horizontal pole, followed by a genuine
// clove-hitch route around the standing part (two same-handed half hitches).
function roundTurnRoute(g: number) {
  const path = new Route(), r = mix(.80, .43, g), barY = .9
  const polePoint = (x: number, a: number): Vec3 => [x, barY + r * Math.sin(a), r * Math.cos(a)]
  path.add([-2.8, -1.35, .12]); path.line([.90, -1.35, .12]); path.mark()
  const entry = polePoint(.90, -.38)
  path.cubic([.90, -.65, .12], [.90, entry[1] - .4, entry[2] - .12], entry)
  for (let i = 1; i <= 320; i++) { const t = i / 320; path.add(polePoint(mix(.90, 1.45, t), -.38 + TAU * 1.5 * t)) }
  // The far side of the round turn returns toward the standing-part axis.
  const end = path.points.at(-1)!
  path.cubic([1.85, end[1] - .35, -r - .35], [1.90, -.80, -r - .35], [1.50, -1.35, .20])
  path.cubic([1.20, -1.70, 1.05], [.65, -1.70, 1.05], [.35, -1.70, 1.05])
  path.mark()
  const mainY = -1.35, mainZ = .12, rr = mix(.46, .155, g), gate = .32
  const polar = (x: number, a: number, rad: number): Vec3 => [x, mainY + rad * Math.sin(a), mainZ + rad * Math.cos(a)]
  const a = mix(.40, .24, g), pitch = .15, lift = .29
  const first = polar(.02, gate, rr)
  path.cubic([.20, -1.70, 1.05], [.02, first[1] - .23, first[2]], first)
  for (let i = 1; i <= 130; i++) {
    const t = i / 130
    path.add(polar(mix(.02, -.13, ease(t)), gate + (TAU - 2 * gate) * t, rr + lift * ease((t - .65) / .35)))
  }
  const bridgeStart = path.points.at(-1)!, bridgeEnd = polar(a + pitch, TAU + gate, rr + lift)
  path.cubic([bridgeStart[0] - .12, bridgeStart[1] + .10, bridgeStart[2]], [bridgeEnd[0] + .12, bridgeEnd[1] - .10, bridgeEnd[2]], bridgeEnd)
  path.mark()
  for (let i = 1; i <= 130; i++) {
    const t = i / 130
    path.add(polar(mix(a + pitch, a, ease(t)), TAU + gate + (TAU - 2 * gate) * t, rr + lift * (1 - ease(t / .35))))
  }
  const tail = path.points.at(-1)!
  path.cubic([tail[0], tail[1] + .3, tail[2] + .10], [tail[0], -.7, .9], [tail[0], -.4, .95]); path.mark()
  return path
}
function getRoundTurnState(progress: number) {
  const p = clamp(progress), g = ease((p - .82) / .18)
  return state(roundTurnRoute(g), p, .047, [{ id: 'round-turn-pole', kind: 'cylinder', position: [0, .9, 0], axis: [1, 0, 0], radius: .35, length: 3.8, color: '#b2a082' }], '#b87351')
}

// Constrictor: two encircling turns, the diagonal riding turn, then a tuck
// beneath that diagonal AND the first turn. It is not an unlinked helix.
function constrictorRoute(g: number) {
  const path = new Route(), r = mix(.94, .68, g), a = mix(.62, .25, g), gate = .65, lift = .34
  const polar = (x: number, theta: number, rad = r): Vec3 => [x, rad * Math.sin(theta), rad * Math.cos(theta)]
  const entry = polar(0, .70)
  path.add([0, entry[1] + 1.8 * Math.cos(.70), entry[2] - 1.8 * Math.sin(.70)])
  path.line(entry); path.mark()
  for (let i = 1; i <= 50; i++) path.add(polar(0, mix(.70, -gate, i / 50)))
  for (let i = 1; i <= 180; i++) {
    const t = i / 180; path.add(polar(-a * ease(t), -gate - (TAU - 2 * gate) * t))
  }
  path.mark()
  for (let i = 1; i <= 70; i++) {
    const t = i / 70; path.add(polar(mix(-a, a, ease(t)), -TAU + gate - 2 * gate * t, r + lift * Math.sin(Math.PI * t)))
  }
  for (let i = 1; i <= 180; i++) {
    const t = i / 180; path.add(polar(a, -TAU - gate - (TAU - 2 * gate) * t))
  }
  path.mark()
  // One tuck passes beneath the standing first turn and the raised riding
  // turn. Continue outward: an extra return here would add another crossing.
  for (let i = 1; i <= 70; i++) {
    const t = i / 70; path.add(polar(mix(a, -a - .18, ease(t)), -2 * TAU + gate - 1.5 * gate * t, r - .105 * Math.sin(Math.PI * t)))
  }
  const end = path.points.at(-1)!, exitAngle = -gate / 2
  path.line([end[0] - .55, end[1] - 1.2 * Math.cos(exitAngle), end[2] + 1.2 * Math.sin(exitAngle)]); path.mark()
  return path
}
function getConstrictorState(progress: number) {
  const p = clamp(progress), g = ease((p - .82) / .18)
  return state(constrictorRoute(g), p, .042, [{ id: 'binding-bundle', kind: 'cylinder', position: [0, 0, 0], axis: [1, 0, 0], radius: .52, length: 3.2, color: '#adad86' }], '#5e8993')
}

// Ring plane is YZ; the line crosses its opening along X, then bends around
// the rim. Five complete standing-part wraps precede the two distinct tucks.
function clinchRoute(g: number) {
  const path = new Route(), ringX = -1.6
  const standZ = -.16, coilR = mix(.44, .19, g), x0 = mix(-.50, -.85, g), x1 = mix(1.20, .20, g)
  path.add([2.8, .05, standZ]); path.line([ringX + .25, .05, standZ]); path.mark()
  path.line([ringX - .24, .05, standZ])
  path.cubic([ringX - .62, .05, standZ], [ringX - .62, .65, .14], [ringX - .18, .66, .14])
  path.cubic([ringX + .32, .66, .14], [x0 - .05, -.15, standZ + coilR], [x0, .05, standZ + coilR])
  path.mark()
  for (let i = 1; i <= 700; i++) {
    const t = i / 700, angle = TAU * 5 * t
    path.add([mix(x0, x1, t), .05 + coilR * Math.sin(angle), standZ + coilR * Math.cos(angle)])
  }
  path.mark()
  const looseY = mix(-.80, -.54, g)
  // Return to the small eye-side loop; pass below the standing part and
  // above the original eye-to-wrap segment, then return through the large
  // loop left by this return. The final tail stays visibly separate.
  path.cubic([x1 + .10, .40, standZ + coilR], [x1 + .55, .40, .52], [x1 + .55, -.30, .52])
  path.cubic([x1 + .55, looseY, .52], [x1, looseY, .52], [-.82, looseY, .52])
  path.cubic([-1.12, looseY, .52], [-1.27, -.20, .40], [-1.18, .22, -.05])
  path.cubic([-1.15, .35, -.30], [-1.10, -.55, -.40], [-.90, -.35, .10])
  path.cubic([-.70, -.15, .60], [-.06, -.48, .80], [.46, -.48, .80]); path.mark()
  return path
}
function getClinchState(progress: number) {
  const p = clamp(progress), g = ease((p - .82) / .18)
  const result = state(clinchRoute(g), p, .033, [{ id: 'fishing-eye', kind: 'ring', position: [-1.6, 0, 0], axis: [1, 0, 0], radius: .36, length: .10, color: '#ae9567' }], '#547b9b')
  // Turn the entire model so the eye is an opening in the default view,
  // instead of the edge-on bar produced by an X-normal ring.
  const angle = Math.PI / 5
  const rotate = ([x, y, z]: Vec3): Vec3 => [x * Math.cos(angle) + z * Math.sin(angle), y, -x * Math.sin(angle) + z * Math.cos(angle)]
  return { ...result, points: result.points.map(rotate), tip: rotate(result.tip), supports: result.supports!.map(s => ({ ...s, position: rotate(s.position), axis: rotate(s.axis) })) }
}

// A preclosed loop shown as a complete structure: three turns on each side
// of its central collar, with the two loaded legs passing beneath it. The
// loop has no free ends. Segment joins are internal and never receive caps.
function getPrusikState(progress: number): LessonState {
  const p = clamp(progress), g = ease((p - .82) / .18), radius = .040
  const rr = mix(.50, .22, g), pitch = mix(.19, .115, g), a = mix(.20, .075, g), gate = .30
  // Local u is the vertical main rope; rotate the teaching loop to the left.
  const world = (u: number, angle: number, r: number): Vec3 => [-r * Math.cos(angle), u, r * Math.sin(angle)]
  const route = new Route()
  const lower = world(-a, gate, rr), upper = world(a, gate, rr)
  route.add([-2.15, -.24, .02]); route.cubic([-1.2, -.24, .02], [-.85, lower[1], lower[2]], lower)
  for (let i = 1; i <= 450; i++) {
    const t = i / 450
    route.add(world(-a - pitch * 3 * t, gate + (3 * TAU - 2 * gate) * t, rr))
  }
  const collarStart = route.points.at(-1)!, collarEnd = world(a + pitch * 3, 3 * TAU - gate, rr)
  // An outside collar crosses in front of both exiting legs.
  route.cubic([collarStart[0] - .30, collarStart[1] - .10, rr * Math.sin(gate) + .23], [collarEnd[0] - .30, collarEnd[1] + .10, rr * Math.sin(gate) + .23], collarEnd)
  for (let i = 1; i <= 450; i++) {
    const t = i / 450
    route.add(world(a + pitch * 3 * (1 - t), 3 * TAU - gate - (3 * TAU - 2 * gate) * t, rr))
  }
  route.cubic([-.85, upper[1], upper[2]], [-1.1, .6, .02], [-1.7, .60, .02])
  route.cubic([-2.40, .60, .02], [-2.65, -.24, .02], [-2.15, -.24, .02])
  route.smooth()
  const active = ['#ae8f54', '#b87351', '#b87351', '#ae8f54', '#ae8f54'][atStep(p)]!
  return { points: [[0, -1.85, 0], [0, 1.85, 0]], tip: [...lower], radius: .15, color: '#a76658', hideMainTip: true,
    checkpoint: atStep(p), endCaps: { start: '1B', end: '1A' },
    strands: [{ id: 'prusik-preclosed-loop', points: route.prefix(route.total), radius, color: active, endCaps: { start: false, end: false } }],
  }
}

export const SCENIC_KNOT_COURSES: Course[] = [
  {
    id: 'round-turn-two-half-hitches', category: 'knots', name: '横杆固定：双绕双半结', title: '绕住横杆，再在主绳上打两个半结',
    description: '把绳系在晾晒杆或露营支杆上，分清绕杆部分与锁住主绳的两个半结。',
    material: '一根练习绳 · 圆杆', materialNote: '棕色圆杆代表晾晒杆或支杆。1B 是主绳端，1A 是工作端；逐段显露路径，末段整理收紧。',
    duration: 42, initialProgress: .64,
    application: { scenarios: ['fixing', 'home', 'garden', 'camping'], task: '把轻型晾晒绳或露营辅助绳固定在圆杆上', focus: '围杆后双半结收尾', boundary: '此课演示系杆结构，不计算材料摩擦或承载能力。' },
    steps: steps(['辨认横杆与主绳', '围绕横杆完整绕行', '在主绳上做第一半结', '同向再做第二半结', '整理绕杆与收尾'], [
      '棕色物体是圆杆。画面中的 1B 留作主绳端，1A 沿完整路径逐段展开；先确认绳子需要系住的物体。',
      '工作端围着杆连续经过两次，形成圆绕部分；它与后面绕主绳的小圈属于不同位置。',
      '把工作端带回主绳旁，围着主绳做第一个半结，辨认工作端从自己留下的圈下穿出。',
      '沿相同方向继续做第二个半结；两个半结都绕在主绳上，不再绕圆杆。',
      '先让绕杆部分贴近圆杆，再排列两个半结。观察绳径保持不变，工作尾仍在外侧。',
    ]),
    source: 'https://www.animatedknots.com/round-turn-two-half-hitches-knot', sourceName: 'Animated Knots · Round Turn & Two Half Hitches', getState: getRoundTurnState,
  },
  {
    id: 'constrictor-binding', category: 'knots', name: '圆束扎紧：束紧结', title: '绕住圆束，把工作端藏到压绳下',
    description: '以圆束为对象，辨认两个绕圈、斜跨压绳和最后的穿压结构。',
    material: '一根细练习绳 · 圆形束物', materialNote: '灰绿圆柱表示圆束的外轮廓；不是平面箱体。工作端标为 1A，固定尾为 1B。', duration: 40, initialProgress: .64,
    application: { scenarios: ['binding', 'home', 'storage', 'garden'], task: '学习束口、圆形材料归拢时的扎紧结构', focus: '两圈下方穿压扎紧', boundary: '曲面束物结构示意；束紧后可能难以解开，课程不展示真实材料压缩。' },
    steps: steps(['确定要扎紧的圆束', '绕过束物第一圈', '斜跨后再绕一圈', '从压绳与前圈下穿出', '整理并收紧束口'], [
      '以圆柱代表束物，留住 1B，沿 1A 的路线观察。绳子需要围住物体，不能只在物体前面打一个结。',
      '把工作端从束物背面带回正面，完成第一圈。保留余量，准备下一次斜跨。',
      '斜跨主段后再绕束物，正面形成交叉的压绳。第二圈与第一圈保持不同轴向位置。',
      '工作端从初始绳段与斜跨压绳的下方一次穿出，确认两段都压住工作尾。沿连续路径检查这次穿压，它区别于普通双套结。',
      '牵引两端，把两个绕圈和正面穿压整理靠拢。圆束不变形，绳径不变，收紧可倒拖查看。',
    ]),
    source: 'https://www.animatedknots.com/constrictor-knot-rope-end-method', sourceName: 'Animated Knots · Constrictor, Rope End Method', getState: getConstrictorState,
  },
  {
    id: 'improved-clinch-eye', category: 'knots', name: '钓线接环：改良克林奇结', title: '穿环眼、绕主线，再辨认两次回穿',
    description: '以金属环眼代表钩眼或转环，查看五次绕主线和眼旁小圈、返回大圈的不同位置。',
    material: '一根练习线 · 金属环眼', materialNote: '环眼独立显示，1B 是主线端，1A 是线尾。使用放大教学间距；不演示剪尾和真实钓线受力变形。', duration: 46, initialProgress: .64, projectionFocus: 'full',
    application: { scenarios: ['fishing', 'outdoors'], task: '认识钓线与钩眼、转环连接时的穿绕路线', focus: '穿眼五绕两次回穿', boundary: '放大的结构示意；线材适配、润湿和拉力检查须依实际器材说明。' },
    steps: steps(['辨认环眼与主线', '把工作端穿过环眼', '围主线连续绕五圈', '回到眼旁，再穿返回圈', '整理线圈与线尾'], [
      '金色环是钩眼或转环的连接部位。1B 留作主线，1A 是要穿过环眼的工作端。',
      '让 1A 穿过金属环的开口，绕过环边后回到主线旁，保留环眼旁的小圈。',
      '工作端围着主线完整绕五圈，各圈依次排开。主线位于五圈的内部，避免把它看成五个独立绳圈。',
      '沿返回线追到环眼旁的小圈，再看线尾穿过返回时留下的大圈。改良结构比基本绕线多一次回穿。',
      '缓慢整理五圈和两次回穿，保留可辨认的外露线尾。画面保留放大间隙，不模拟实际钓线拉紧后的内部扭转。',
    ]),
    source: 'https://www.animatedknots.com/improved-clinch-knot', sourceName: 'Animated Knots · Improved Clinch', getState: getClinchState,
  },
  {
    id: 'prusik-structure', category: 'knots', name: '抓绳认知：普鲁士结', title: '对照主绳、闭合绳环与对称绕圈',
    description: '观察预先闭合的细绳环如何在粗主绳上形成对称三绕结构，识别绕圈和出环腿。',
    material: '一根粗主绳 · 一只预闭合练习绳环', materialNote: '红色主绳有 1A、1B 两个真实端点。金色线是已闭合绳环，没有自由端；本课不包含绳环接头制作，逐步辨认完整结构。', duration: 40, initialProgress: .64,
    application: { scenarios: ['mountaineering', 'climbing', 'rescue'], task: '在登山、攀岩、救援课程前认识抓绳结构', focus: '闭合环对称抓绳结构', boundary: '仅限结构认知，不是上升、保护、承重或救援操作训练；实际系统需由合格教练指导。' },
    steps: steps(['辨认粗主绳与闭合环', '查看下侧三次绕行', '查看上侧对称绕行', '找出中央套口与双腿', '整理圈列，核对结构'], [
      '红色是粗主绳，金色是预先闭合的细绳环。整条绳环始终显示，播放用于辨认结构，不演示接头和实际承重动作。',
      '沿绳环下侧观察三次绕主绳的路线。每圈绕过背面再回到前面，各圈彼此分开。',
      '从中央套口转到上侧，对照另外三圈。上下两侧对称，不是把全部圈数挤在同一侧。',
      '找出跨过前方的中央套口，以及从它下方伸出的两条环腿。两腿在外侧连接成同一个闭合环。',
      '让圈列靠拢，检查主绳保持直线、两侧各三圈、双腿从中央引出。这里只展示整理形态，不测试抓持力。',
    ]),
    source: 'https://www.animatedknots.com/prusik-knot', sourceName: 'Animated Knots · Prusik', getState: getPrusikState,
  },
]
