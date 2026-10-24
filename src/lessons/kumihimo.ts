import type { Course, LessonState, LessonStep, Vec3 } from './types'

/**
 * Original eight-strand round-braid model. The slot sequence is transcribed from
 * Fire Mountain Gems' own 8 Strand Round Braid lesson, not inferred from a generic
 * helix: 17→31, 1→15, rotate counterclockwise 90°, then 25→7, 9→23, etc.
 * https://www.firemountaingems.com/learn/categories/essential-resources/how-tos/RC3D-gallery-of-designs-inspiration-with-instructions.html
 * Susan E. Horton's original PieceWork lesson also describes eight separate cords:
 * https://pieceworkmagazine.com/making-round-braids-on-a-kumihimo-disk/
 *
 * Each lifted working end travels along its actual left/right transfer chord.
 * The complete collision-free configuration path is embedded monotonically along
 * the braid axis. Turning the disk rotates ALL strands rigidly; it does not add a
 * fictitious helix to the braid. Final dressing is authored offline, with contact,
 * curvature and disk-clearance constraints, then stored as deterministic poses.
 * There is no runtime physics, downloaded mesh, or third-party tutorial artwork.
 */
const RADIUS = .04
const MOVES = 16
const TAU = Math.PI * 2
const COLORS = ['#b47a29', '#356dbb', '#bd5750', '#499374', '#9c5ca5', '#31a0aa', '#dc8b38', '#647a8d']
const INITIAL_SLOTS = [32, 1, 8, 9, 16, 17, 24, 25]
const clamp = (v: number) => Math.max(0, Math.min(1, v))
const ease = (v: number) => { const t = clamp(v); return t * t * t * (10 - 15 * t + 6 * t * t) }
const mix = (a: Vec3, b: Vec3, t: number): Vec3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: Vec3, n: number): Vec3 => [a[0] * n, a[1] * n, a[2] * n]
const unit = (a: Vec3): Vec3 => mul(a, 1 / Math.max(1e-12, Math.hypot(...a)))
const slotAngle = (n: number) => Math.PI / 2 - TAU * (n - .5) / 32
const slot = (n: number): Vec3 => [Math.cos(slotAngle(n)), Math.sin(slotAngle(n)), 0]
interface Move { cord: number; from: number; to: number; pair: number }
const moves: Move[] = []
const configurations: number[][] = [INITIAL_SLOTS.slice()]
let slots = INITIAL_SLOTS.slice()
for (let pair = 0; pair < MOVES / 2; pair++) {
  const rotation = pair * Math.PI / 2
  const positions = slots.map((n, cord) => ({ n, cord, x: Math.cos(slotAngle(n) + rotation), y: Math.sin(slotAngle(n) + rotation) }))
  const top = positions.slice().sort((a, b) => b.y - a.y).slice(0, 2).sort((a, b) => a.x - b.x)
  const bottom = positions.slice().sort((a, b) => a.y - b.y).slice(0, 2).sort((a, b) => a.x - b.x)
  for (const [source, to] of [[bottom[0], (top[0].n + 30) % 32 + 1], [top[1], (bottom[1].n + 30) % 32 + 1]] as const) {
    moves.push({ cord: source.cord, from: source.n, to, pair })
    slots[source.cord] = to
    configurations.push(slots.slice())
  }
}

function sample(path: Vec3[], t: number): Vec3 {
  const n = path.length - 1, u = clamp(t) * n, i = Math.min(n - 1, Math.floor(u)), f = u - i
  const point = (index: number): Vec3 => index < 0 ? mix(path[0], path[1], index) : index > n ? mix(path[n], path[n - 1], n - index) : path[index]
  const q = [point(i - 1), point(i), point(i + 1), point(i + 2)]
  const w = [(1 - f) ** 3 / 6, (3 * f ** 3 - 6 * f * f + 4) / 6, (-3 * f ** 3 + 3 * f * f + 3 * f + 1) / 6, f ** 3 / 6]
  return [0, 1, 2].map(k => q.reduce((sum, p, j) => sum + p[k] * w[j], 0)) as Vec3
}
function bezier(a: Vec3, b: Vec3, c: Vec3, d: Vec3, count: number): Vec3[] {
  return Array.from({ length: count + 1 }, (_, i) => {
    const t = i / count, s = 1 - t
    return [0, 1, 2].map(k => s ** 3 * a[k] + 3 * s * s * t * b[k] + 3 * s * t * t * c[k] + t ** 3 * d[k]) as Vec3
  })
}
const rawBody: Vec3[][] = Array.from({ length: 8 }, (_, cord) => Array.from({ length: MOVES * 12 + 1 }, (_, i) => {
  const t = i / 12, move = Math.min(MOVES - 1, Math.floor(t)), action = moves[move]
  const a = mul(slot(configurations[move][cord]), .45)
  const q = cord === action.cord ? mix(a, mul(slot(action.to), .45), ease(t - move)) : a
  return [q[0], q[1], t * .36]
}))
interface Action { kind: 'move' | 'rotate'; start: number; end: number; index: number }
const actions: Action[] = []
let actionTime = .08
for (let pair = 0; pair < MOVES / 2; pair++) {
  for (let half = 0; half < 2; half++) {
    const duration = pair === 0 ? .10 : .48 / 14
    actions.push({ kind: 'move', start: actionTime, end: actionTime + duration, index: pair * 2 + half })
    actionTime += duration
  }
  const duration = pair === 0 ? .03 : .03 / 7
  actions.push({ kind: 'rotate', start: actionTime, end: actionTime + duration, index: pair })
  actionTime += duration
}
function phase(progress: number) {
  let completed = 0, rotation = 0, active = -1, fraction = 0, lift = 0
  for (const action of actions) {
    if (progress < action.start) break
    const u = Math.min(1, (progress - action.start) / (action.end - action.start))
    if (action.kind === 'rotate') {
      rotation = (action.index + ease(u)) * Math.PI / 2
      completed = (action.index + 1) * 2
    } else {
      active = action.index
      fraction = ease((u - .18) / .64)
      lift = u < .18 ? ease(u / .18) : u > .82 ? 1 - ease((u - .82) / .18) : 1
      completed = action.index + fraction
      rotation = Math.floor(action.index / 2) * Math.PI / 2
    }
    if (u < 1) break
    active = -1
  }
  return { completed, rotation, active, fraction, lift }
}
function formation(progress: number): Vec3[][] {
  const current = phase(progress), stateSlots = configurations[Math.floor(Math.min(MOVES, current.completed))]
  return Array.from({ length: 8 }, (_, cord) => {
    const maxT = current.completed / MOVES, atEnd = sample(rawBody[cord], maxT), shift = -1.20 - atEnd[2]
    const count = Math.max(1, Math.ceil(current.completed * 48))
    const built = Array.from({ length: count + 1 }, (_, i): Vec3 => {
      const q = sample(rawBody[cord], maxT * i / count)
      return [q[0], q[1], q[2] + shift]
    })
    if (current.completed === 0) built.splice(0, 1)
    const first = built[0], outward = unit([first[0], first[1], 0])
    const tailStart: Vec3 = [first[0] + outward[0] * .28, first[1] + outward[1] * .28, first[2] - .52]
    const tail = bezier(tailStart, [tailStart[0], tailStart[1], tailStart[2] + .16], [first[0], first[1], first[2] - .18], first, 36)
    const prev = sample(rawBody[cord], Math.max(0, maxT - .0001))
    const tangent: Vec3 = current.completed > 0 ? unit([atEnd[0] - prev[0], atEnd[1] - prev[1], atEnd[2] - prev[2]]) : [0, 0, 1]
    let head = mul(slot(stateSlots[cord]), 1.82), lift = 0
    if (current.active >= 0 && moves[current.active].cord === cord) {
      const move = moves[current.active]
      head = mix(mul(slot(move.from), 1.82), mul(slot(move.to), 1.82), current.fraction)
      lift = current.lift
    }
    const h = .15 + .65 * lift, root = built[built.length - 1]
    const ledge: Vec3 = [root[0], root[1], h - .08 - .27 * lift], tip: Vec3 = [head[0], head[1], h]
    const headUnit = unit([head[0], head[1], 0])
    const rise = bezier(root, add(root, mul(tangent, .20)), [ledge[0], ledge[1], ledge[2] - .20], ledge, 40)
    const bend = ease((.6 - Math.hypot(...head)) / .4) * lift
    const endDirection = unit(mix(headUnit, [0, 0, 1], bend)), handle = .35 * (1 - bend) + .11 * bend
    const fan = bezier(ledge, [ledge[0], ledge[1], ledge[2] + .18 - .07 * bend], add(tip, mul(endDirection, -handle)), tip, 60)
    return [...tail, ...built.slice(1), ...rise.slice(1), ...fan.slice(1)]
  })
}

interface BakedData { counts: number[]; times: number[]; order: number[]; blockFrames: number; sizes: number[]; orders: number[]; payload: string }

function decodeGather(data: BakedData, stride: number) {
    const bytes = atob(data.payload);
    const values = new Int16Array(data.times.length * stride);
    let blockOffset = 0;
    for (let block = 0; block < data.sizes.length; block++) {
        const lengths = Array.from({ length: 32 }, (_, i) => bytes.charCodeAt(blockOffset + i));
        const left = [0], right = [0], symbols = [-1];
        let code = 0;
        for (let bits = 1; bits <= Math.max(...lengths); bits++) {
            for (let symbol = 0; symbol < 32; symbol++)
                if (lengths[symbol] === bits) {
                    let node = 0;
                    for (let bit = bits - 1; bit >= 0; bit--) {
                        const children = (code >>> bit) & 1 ? right : left;
                        if (!children[node]) {
                            children[node] = symbols.length;
                            left.push(0);
                            right.push(0);
                            symbols.push(-1);
                        }
                        node = children[node];
                    }
                    symbols[node] = symbol;
                    code++;
                }
            code <<= 1;
        }
        const lookup = new Int32Array(1024);
        for (let prefix = 0; prefix < lookup.length; prefix++) {
            let node = 0, bits = 0;
            while (symbols[node] < 0 && bits < 10) {
                node = (prefix >>> bits) & 1 ? right[node] : left[node];
                bits++;
            }
            lookup[prefix] = symbols[node] >= 0 ? (bits << 16) | (symbols[node] + 1) : -node - 1;
        }
        let cursor = blockOffset + 32, buffer = 0, available = 0;
        const order = data.orders[block];
        const firstFrame = block * data.blockFrames, lastFrame = Math.min(data.times.length, firstFrame + data.blockFrames);
        for (let frame = firstFrame; frame < lastFrame; frame++) {
            let offset = frame * stride;
            for (const count of data.counts) {
                for (let axis = 0; axis < 3; axis++) {
                    let previous = 0, beforePrevious = 0;
                    for (let point = 0; point < count; point++) {
                        while (available < 10) {
                            buffer |= (bytes.charCodeAt(cursor++) || 0) << available;
                            available += 8;
                        }
                        const entry = lookup[buffer & 1023];
                        let symbol;
                        if (entry > 0) {
                            const bits = entry >>> 16;
                            buffer >>>= bits;
                            available -= bits;
                            symbol = (entry & 65535) - 1;
                        }
                        else {
                            buffer >>>= 10;
                            available -= 10;
                            let node = -entry - 1;
                            while (symbols[node] < 0) {
                                if (!available) {
                                    buffer = bytes.charCodeAt(cursor++) || 0;
                                    available = 8;
                                }
                                node = buffer & 1 ? right[node] : left[node];
                                buffer >>>= 1;
                                available--;
                            }
                            symbol = symbols[node];
                        }
                        if (symbol === 31) {
                            let extra = 0, shift = 0, byte;
                            do {
                                while (available < 8) {
                                    buffer |= (bytes.charCodeAt(cursor++) || 0) << available;
                                    available += 8;
                                }
                                byte = buffer & 255;
                                buffer >>>= 8;
                                available -= 8;
                                extra |= (byte & 127) << shift;
                                shift += 7;
                            } while (byte & 128);
                            symbol += extra;
                        }
                        let value = ((symbol >>> 1) ^ -(symbol & 1)) + previous + (order === 1 ? previous - beforePrevious : 0);
                        beforePrevious = previous;
                        previous = value;
                        const at = offset + point * 3 + axis;
                        if (frame > 0)
                            value += values[at - stride];
                        if (order === 2 && frame > 1)
                            value += values[at - stride] - values[at - 2 * stride];
                        values[at] = value;
                    }
                }
                offset += count * 3;
            }
        }
        blockOffset += data.sizes[block];
    }
    return values;
}

let baked: BakedData | undefined
let preparing: Promise<void> | undefined
function prepareKumihimo(): Promise<void> {
  return preparing ??= import('./data/kumihimo').then(module => {
    baked = module.default
  }).catch(error => {
    preparing = undefined
    throw error
  })
}

let coordinates: Int16Array | undefined
let looseCompleted: Vec3[][] | undefined
function dressed(gather: number): Vec3[][] {
  const data = baked!, stride = data.counts.reduce((sum, count) => sum + count * 3, 0)
  coordinates ??= decodeGather(data, stride)
  looseCompleted ??= formation(.82)
  let right = 1
  while (right < data.times.length - 1 && data.times[right] < gather) right++
  const left = right - 1, fraction = (gather - data.times[left]) / (data.times[right] - data.times[left])
  let offset = 0
  return data.counts.map((count, cord) => {
    const control: Vec3[] = Array.from({ length: count }, (_, i) => [0, 1, 2].map(axis => {
      const index = offset + i * 3 + axis
      const a = coordinates![left * stride + index], b = coordinates![right * stride + index]
      return (a + (b - a) * fraction) / 8000 - (axis === 2 ? 3.65 : 0)
    }) as Vec3)
    offset += count * 3
    // The small initial blend joins the exact demonstration curve continuously
    // to its evenly sampled C2 representation. It does not jump at 82%.
    return Array.from({ length: 905 }, (_, i) => {
      const point = sample(control, i / 904)
      return gather < .004 ? mix(looseCompleted![cord][i], point, ease(gather / .004)) : point
    })
  })
}
const STEPS: readonly LessonStep[] = [
  { time: 0, title: '四组各放两股', instruction: '将8根绳穿过中心孔，短端朝盘下。把工作端分放32/1、8/9、16/17、24/25槽，形成上、右、下、左四组。先固定短端，再观察绳端编号。' },
  { time: .08, title: '下左股移到上左', instruction: '抬起当前下方左股：17槽的绳移到31槽。让它从左侧越过盘面，放到上方两股的左边；其他7股保持在槽中。' },
  { time: .18, title: '上右股移到下右', instruction: '接着把原来1槽的上方右股移到15槽，放在下方两股的右边。先上移下左股，再下移上右股，这两次移动组成一组。' },
  { time: .28, title: '逆时针转盘并重复', instruction: '每完成一组，将整个圆盘逆时针转90°。下一组为25→7、9→23；继续按“下左上移、上右下移、转盘”的规则。盘下已编部分持续保留。' },
  { time: .82, title: '匀拉八股收紧圆辫', instruction: '稳住盘下绳束，均匀调整8股的张力，让展开的交叉段逐渐贴合成圆辫。检查股线连续、受力均匀，再按相同顺序继续编到所需长度。' },
]
function uniformTubePath(path: Vec3[]): Vec3[] {
  // Feed-in begins with arbitrarily short material. Equal arc-length rings avoid
  // a tiny new ring beside a much longer segment, which can invert tube faces
  // despite a valid centreline. Endpoints stay exact; no physical solve runs here.
  const arc = [0]
  for (let i = 1; i < path.length; i++) arc.push(arc[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1], path[i][2] - path[i - 1][2]))
  const length = arc[arc.length - 1], count = Math.max(2, Math.ceil(length / .010))
  let next = 1
  const uniform = Array.from({ length: count + 1 }, (_, i) => {
    if (i === 0) return path[0]
    if (i === count) return path[path.length - 1]
    const distance = length * i / count
    while (next < path.length - 1 && arc[next] < distance) next++
    return mix(path[next - 1], path[next], (distance - arc[next - 1]) / Math.max(1e-12, arc[next] - arc[next - 1]))
  })
  // Two cardinal cubic passes rounds the original polygon's sub-millimetre
  // sampling corners rather than concentrating them in one new tube ring.
  // Keep both material ends exact; the operation is deterministic and local.
  let rounded = uniform
  for (let pass = 0; pass < 2; pass++) {
    const previous = rounded
    rounded = previous.map((point, i) => i === 0 || i === count ? point :
      point.map((value, axis) => (previous[i - 1][axis] + 4 * value + previous[i + 1][axis]) / 6) as Vec3)
  }
  return rounded
}
export function getKumihimoState(progress: number): LessonState {
  if (!baked) throw new Error('Course "kumihimo-eight-strand" is not prepared; await course.prepare() first.')
  const p = Number.isFinite(progress) ? clamp(progress) : 0
  const current = phase(Math.min(.82, p)), gather = ease((p - .82) / .18)
  const local = p <= .82 ? formation(p) : dressed(gather)
  // Tilt the entire supported braid toward its side during final presentation.
  // The same rigid transform is used for the disk and every strand.
  const ny = .74 + .18 * gather, nz = Math.sqrt(1 - ny * ny)
  const cos = Math.cos(current.rotation), sin = Math.sin(current.rotation)
  const world = (q: Vec3): Vec3 => {
    const x = q[0] * cos - q[1] * sin, y = q[0] * sin + q[1] * cos
    return [x, 1 + nz * y + ny * q[2], -ny * y + nz * q[2]]
  }
  const paths = local.map(path => uniformTubePath(path).map(world))
  let checkpoint = 0
  for (let i = STEPS.length - 1; i >= 0; i--) if (p >= STEPS[i].time) { checkpoint = i; break }
  const activeSlots = current.active >= 0 ? [moves[current.active].from, moves[current.active].to] : []
  return {
    points: paths[0], tip: paths[0][paths[0].length - 1], checkpoint,
    color: COLORS[0], radius: RADIUS, showEndLabels: false, hideMainTip: true,
    strands: paths.slice(1).map((points, i) => ({ id: `kumihimo-cord-${i + 2}`, points, color: COLORS[i + 1], radius: RADIUS })),
    supports: [{ id: 'kumihimo-disk', kind: 'braiding-disk', position: [0, 1, 0], axis: [0, ny, nz], radius: 1.65, innerRadius: .56, length: .12, rotation: current.rotation, activeSlots, color: '#e7dec9' }],
  }
}
export const KUMIHIMO_COURSES: Course[] = [{
  id: 'kumihimo-eight-strand', category: 'weaving', name: '八股圆形组纽', title: '用圆盘编一段八股圆辫',
  description: '从四组槽位出发，逐股移线、逆时针转盘，让8根绳在中心孔下交错成为圆辫。',
  material: '8根等长绳、32槽圆形组纽盘、固定夹',
  materialNote: '先固定盘下短端，按颜色和两端编号跟踪每根绳。示范两轮盘序，之后可重复到所需长度。',
  duration: 150, initialProgress: .13, steps: STEPS,
  source: 'https://www.firemountaingems.com/learn/categories/essential-resources/how-tos/RC3D-gallery-of-designs-inspiration-with-instructions.html',
  sourceName: 'Fire Mountain Gems · 8 Strand Round Braid', projectionFocus: 'curves',
  projectionBounds: { minX: -.27, maxX: .26, minY: -1.85, maxY: -.43 }, prepare: prepareKumihimo, getState: getKumihimoState,
}]
