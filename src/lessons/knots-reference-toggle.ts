import type { Course, LessonState, Vec3 } from './types';

const RADIUS = 0.045;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const distance = (a: Vec3, b: Vec3) => Math.hypot(...a.map((v, i) => v - b[i]!));
const lerp = (a: Vec3, b: Vec3, t: number) => a.map((v, i) => mix(v, b[i]!, t)) as Vec3;

/** 每次移动都保留完整绳长，主端的备用绳圈提供工作长度。 */
class TogglePath {
  points: Vec3[] = [];
  marks: number[] = [];
  length = 0;
  add(point: Vec3) {
    if (this.points.length) {
      this.length += distance(this.points.at(-1)!, point);
    }
    this.points.push(point);
  }
  line(point: Vec3) {
    const from = this.points.at(-1)!;
    const count = Math.max(2, Math.ceil(distance(from, point) / 0.012));
    for (let i = 1; i <= count; i++) {
      this.add(lerp(from, point, i / count));
    }
  }
  cubic(b: Vec3, c: Vec3, d: Vec3) {
    const a = this.points.at(-1)!;
    for (let i = 1; i <= 120; i++) {
      const t = i / 120,
        s = 1 - t;
      this.add(
        a.map(
          (v, k) => s ** 3 * v + 3 * s * s * t * b[k]! + 3 * s * t * t * c[k]! + t ** 3 * d[k]!,
        ) as Vec3,
      );
    }
  }
  mark() {
    this.marks.push(this.points.length - 1);
  }
}

/** 环外两侧在插销后，中间主段在插销前；上方交叉再回到环后。 */
function toggleRoute(tight: number) {
  const sx = mix(1, 0.34, tight),
    sy = mix(1, 0.46, tight);
  const path = new TogglePath();
  path.add([0, -1.8, 0]);
  path.line([0, -1.12 * sy, 0]);
  path.mark();
  path.cubic([0, -0.85 * sy, 0], [0.5 * sx, -0.45 * sy, 0], [0.55 * sx, -0.05 * sy, 0]);
  path.mark();
  path.cubic([0.62 * sx, 0.45 * sy, 0], [0.35 * sx, 0.75 * sy, 0], [-0.08 * sx, 0.72 * sy, 0]);
  path.cubic([-0.54 * sx, 0.69 * sy, 0], [-0.65 * sx, 0.17 * sy, 0], [-0.47 * sx, -0.23 * sy, 0]);
  path.cubic([-0.31 * sx, -0.59 * sy, 0], [-0.02 * sx, -0.71 * sy, 0], [0.16 * sx, -0.52 * sy, 0]);
  const switchAt = path.points.length - 1;
  path.mark();
  path.cubic([0.32 * sx, -0.34 * sy, 0], [-0.06 * sx, -0.22 * sy, 0], [-0.08 * sx, 0.1 * sy, 0]);
  path.cubic([-0.1 * sx, 0.42 * sy, 0], [-0.1 * sx, 0.8 * sy, 0], [-0.1 * sx, 1.1 * sy, 0]);
  path.line([-0.1 * sx, 1.8, 0]);
  path.mark();
  const back = (y: number) =>
    mix(0.16, 0.047, tight) +
    mix(0.09, 0.08, tight) * Math.exp(-((y / mix(0.25, 0.12, tight)) ** 4));
  const lifted = path.points.map(([x, y], i) => {
    const z = back(y);
    const crossOver = ease((i - switchAt + 120) / 120);
    const upperReturn = ease((y - 0.18 * sy) / (0.54 * sy));
    return [
      x,
      y,
      i <= switchAt ? mix(-z, z, crossOver) : z - mix(0.418, 0.192, tight) * upperReturn,
    ] as Vec3;
  });
  const out = new TogglePath();
  for (const point of lifted) {
    out.add(point);
  }
  // 抬高路径会改变弧长，按每个动作终点重新记录长度。
  const lengths = [0];
  for (let i = 1; i < lifted.length; i++) {
    lengths.push(lengths.at(-1)! + distance(lifted[i - 1]!, lifted[i]!));
  }
  out.marks = path.marks.map((index) => lengths[index]!);
  return out;
}

/** 工作端沿独立绳路前进，其余绳量始终接在主端。 */
function supply(path: TogglePath, amount: number): Vec3[] {
  const worked: Vec3[] = [path.points[0]!];
  let consumed = 0;
  for (let i = 1; i < path.points.length; i++) {
    const a = path.points[i - 1]!,
      b = path.points[i]!,
      size = distance(a, b);
    if (consumed + size >= amount) {
      worked.push(lerp(a, b, (amount - consumed) / size));
      break;
    }
    worked.push(b);
    consumed += size;
  }
  const connection = new TogglePath();
  const start: Vec3 = [-0.8, -2, -0.4];
  connection.add(start);
  connection.cubic([-0.8, -1.65, -0.39], [0, -2.15, worked[0]![2]], worked[0]!);
  for (const point of worked.slice(1)) {
    connection.add(point);
  }
  const remaining = 18 - connection.length,
    radius = 0.6,
    pitch = 0.14 / (2 * Math.PI);
  const count = Math.max(12, Math.ceil(remaining / 0.012));
  let theta = remaining / Math.hypot(radius, pitch);
  for (let i = 0; i < 5; i++) {
    const angle = theta / count,
      size = Math.hypot(2 * radius * Math.sin(angle / 2), pitch * angle);
    theta -=
      (count * size - remaining) /
      ((radius * radius * Math.sin(angle) + pitch * pitch * angle) / size);
  }
  const result: Vec3[] = [];
  for (let i = 0; i <= count; i++) {
    const angle = theta * (i / count - 1);
    result.push([
      -1.4 + radius * Math.cos(angle),
      -2 + radius * Math.sin(angle),
      -0.4 + pitch * angle,
    ]);
  }
  result.push(...connection.points.slice(1));
  return result;
}

const TIMES = [0, 0.1, 0.22, 0.4, 0.57, 0.82];
const LOOSE = toggleRoute(0);
const CUTS = [0.15, ...LOOSE.marks, LOOSE.length, LOOSE.length];

/** 先成环，再将插销从外圈与中间主段之间穿入。 */
export const MARLINSPIKE_COURSE: Course = {
  id: 'reference-marlinspike-hitch',
  category: 'knots',
  name: '绳针结',
  title: '绳针结 · 在绳圈中穿入临时把手',
  description: '形成绳中环口，让插销经过外圈前方、中间主段后方，最后整理贴合。',
  material: '一根软绳 + 圆木插销',
  materialNote: '使用光滑圆杆练习；辨认插销与中间绳段的前后关系。左下备用绳保持整绳连续。',
  duration: 38,
  initialProgress: 0.57,
  frameWholeProcess: true,
  steps: [
    ['准备绳段与插销', '取绳中一段，留出两侧自由绳段，先把插销放在旁边。'],
    ['向侧面弯出环口', '让绳段向侧面绕回，保留一个可观察穿压顺序的宽环。'],
    ['回绕成环', '沿同一方向完成绳圈，注意下方交叉处的上下关系。'],
    ['把主段引到环后', '中间绳段从环口中向上引出，上方经过外圈后面。插销将从这条中间段后方通过。'],
    ['穿入圆木插销', '让插销从侧面穿过环口，位于外圈前方、中间主段后方；不要穿入绳体。'],
    ['整理并拉紧两端', '保持插销位置，拉紧两侧绳段，整理交叉并让绳圈贴住插销。'],
  ].map(([title, instruction], i) => ({
    time: TIMES[i]!,
    title: title!,
    instruction: instruction!,
  })),
  source: 'https://knots3d.com/zh-CN/%E7%BB%B3%E9%92%88%E7%BB%93',
  sourceName: 'Knots 3D · Marlinspike Hitch · ABOK #1789',
  application: {
    scenarios: ['home', 'camping', 'fixing'],
    task: '在软绳上安装可移除的圆杆把手。',
    focus: '插销、外圈和中间主段的穿压关系',
    boundary: '仅作桌面结构练习，不用于人员承重。',
  },
  projectionBounds: { minX: -1.3, maxX: 1.3, minY: -0.7, maxY: 0.7 },
  getState(progress): LessonState {
    const p = clamp(progress),
      tension = ease((p - 0.82) / 0.18),
      route = tension > 0 ? toggleRoute(tension) : LOOSE;
    let checkpoint = 0;
    for (let i = 0; i < TIMES.length; i++) {
      if (p >= TIMES[i]!) {
        checkpoint = i;
      }
    }
    const amount =
      p >= 0.57
        ? route.length
        : mix(
            CUTS[checkpoint]!,
            CUTS[checkpoint + 1]!,
            ease((p - TIMES[checkpoint]!) / (TIMES[checkpoint + 1]! - TIMES[checkpoint]!)),
          );
    const points = supply(route, amount);
    return {
      points,
      radius: RADIUS,
      tip: points.at(-1)!,
      checkpoint,
      color: '#7e75ab',
      endCaps: { start: '1B', end: '1A' },
      supports: [
        {
          id: 'toggle',
          kind: 'cylinder',
          axis: [1, 0, 0],
          position: [mix(3.2, 0, ease((p - 0.57) / 0.23)), 0, 0],
          radius: 0.08,
          length: 2.4,
          color: '#b39b78',
        },
      ],
    };
  },
};
