import type { Course, LessonState, LessonStep, Vec3 } from './types';
import { getFiremanDressing } from './firemanDressing';

const TAU = Math.PI * 2;
const RADIUS = 0.038;
const clamp = (v: number) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
const ease = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => a.map((v, i) => mix(v, b[i]!, t)) as Vec3;
const dist = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** 连续绳路的弧长标记用于逐步展开，几何由进度直接重建。 */
class RopePath {
  points: Vec3[] = [];
  lengths: number[] = [];
  marks: number[] = [];
  total = 0;
  dressingRange: [number, number] = [0, 0];

  add(p: Vec3) {
    const before = this.points.at(-1);
    const d = before ? dist(before, p) : 0;
    if (before && d < 1e-8) {
      return;
    }
    this.total += d;
    this.points.push(p);
    this.lengths.push(this.total);
  }

  line(to: Vec3) {
    const start = this.points.at(-1)!;
    const count = Math.max(2, Math.ceil(dist(start, to) / 0.02));
    for (let i = 1; i <= count; i++) {
      this.add(lerp(start, to, i / count));
    }
  }

  curve(b: Vec3, c: Vec3, end: Vec3) {
    const a = this.points.at(-1)!;
    for (let i = 1; i <= 80; i++) {
      const t = i / 80;
      const s = 1 - t;
      this.add(
        [0, 1, 2].map(
          (k) => s ** 3 * a[k]! + 3 * s * s * t * b[k]! + 3 * s * t * t * c[k]! + t ** 3 * end[k]!,
        ) as Vec3,
      );
    }
  }

  mark() {
    this.marks.push(this.total);
  }

  prefix(length: number, sampleCount?: number) {
    const end = Math.max(0.12, Math.min(this.total, length));
    const n = sampleCount ?? Math.max(12, Math.ceil(end / 0.018));
    let cursor = 1;
    return Array.from({ length: n + 1 }, (_, i) => {
      const at = (end * i) / n;
      while (cursor < this.lengths.length - 1 && this.lengths[cursor]! < at) {
        cursor++;
      }
      return lerp(
        this.points[cursor - 1]!,
        this.points[cursor]!,
        (at - this.lengths[cursor - 1]!) / (this.lengths[cursor]! - this.lengths[cursor - 1]!),
      );
    });
  }
}

/** 主端旁置余绳圈为工作端供绳，成结段收紧时仍保持整绳长度。 */
function firemanReserve(start: Vec3) {
  const path = new RopePath();
  path.add([-1.65, -2.1, start[2]]);
  path.curve([-1.65, -1.75, start[2] + 0.016], [start[0], -2.05, start[2]], start);
  return path;
}

/** 反算余绳角度，离散点也与固定预算等长。 */
function firemanWholeCord(worked: Vec3[], budget: number) {
  const connection = firemanReserve(worked[0]!);
  for (const point of worked.slice(1)) {
    connection.add(point);
  }
  const remaining = budget - connection.total;
  const radius = 0.65;
  const pitch = 0.12 / TAU;
  const count = Math.max(24, Math.ceil(remaining / 0.014));
  let angle = remaining / Math.hypot(radius, pitch);
  for (let i = 0; i < 4; i++) {
    const q = angle / count;
    const segment = Math.hypot(2 * radius * Math.sin(q / 2), pitch * q);
    const derivative = (radius ** 2 * Math.sin(q) + pitch ** 2 * q) / segment;
    angle -= (count * segment - remaining) / derivative;
  }
  const path = new RopePath();
  for (let i = 0; i <= count; i++) {
    const theta = -angle + (angle * i) / count;
    path.add([
      -2.3 + radius * Math.cos(theta),
      -2.1 + radius * Math.sin(theta),
      worked[0]![2] + pitch * theta,
    ]);
  }
  for (const point of connection.points.slice(1)) {
    path.add(point);
  }
  return path.points;
}

/** 初始锁圈保持竖立，收紧时转为围住挂环双腿的小套。 */
function firemanRoute(tuck: number, tension: number) {
  const path = new RopePath();
  const coilRadius = 1.15;
  const first = -2.25;
  const last = Math.PI / 2 + 0.6 - TAU * 4;
  const coilPoint = (t: number): Vec3 => {
    const angle = mix(first, last, t);
    return [coilRadius * Math.cos(angle), coilRadius * Math.sin(angle), mix(-0.12, 0.145, t)];
  };
  const entry = coilPoint(0);
  const direction: Vec3 = [Math.sin(first), -Math.cos(first), 0.265 / (first - last) / coilRadius];
  path.add([-0.92, -1.7, -0.12]);
  path.curve([-0.92, -1.38, -0.12], entry.map((v, i) => v - direction[i]! * 0.24) as Vec3, entry);
  for (let i = 1; i <= 1600; i++) {
    path.add(coilPoint(i / 1600));
  }
  path.mark();
  const dressingStart = path.points.length - 1 - 120;

  const tilt = (tension * Math.PI) / 2;
  const center: Vec3 = [0, mix(1.61, 1.4, tension), mix(0.28, 0.16, tension)];
  const rx = mix(0.3, 0.24, tension);
  const ry = mix(0.4, 0.14, tension);
  const angle0 = -1.14;
  const span = TAU - 2 - angle0;
  const eyePoint = (t: number): Vec3 => {
    const angle = angle0 + span * t;
    const pitch = -0.18 * (t - 0.5);
    return [
      rx * Math.cos(angle),
      center[1] + ry * Math.sin(angle) * Math.cos(tilt) + pitch * Math.sin(tilt),
      center[2] - ry * Math.sin(angle) * Math.sin(tilt) + pitch * Math.cos(tilt),
    ];
  };
  const tangent = (a: Vec3, b: Vec3): Vec3 => {
    const length = dist(a, b);
    return a.map((v, i) => (b[i]! - v) / length) as Vec3;
  };
  const advance = (a: Vec3, d: Vec3, amount: number): Vec3 =>
    a.map((v, i) => v + d[i]! * amount) as Vec3;
  const before = path.points.at(-1)!;
  const eyeStart = eyePoint(0);
  const inControl: Vec3 = [
    before[0] + Math.sin(last) * 0.28,
    before[1] - Math.cos(last) * 0.28,
    before[2],
  ];
  const outControl = advance(eyeStart, tangent(eyePoint(0), eyePoint(0.0001)), -0.18);
  const ab = lerp(before, inControl, 0.5);
  const bc = lerp(inControl, outControl, 0.5);
  const cd = lerp(outControl, eyeStart, 0.5);
  const left = lerp(ab, bc, 0.5);
  const right = lerp(bc, cd, 0.5);
  const middle = lerp(left, right, 0.5);
  for (const point of [left, right, middle]) {
    point[2] += 0.3 * tension;
  }
  path.curve(ab, left, middle);
  path.curve(right, cd, eyeStart);
  for (let i = 1; i <= 500; i++) {
    path.add(eyePoint(i / 500));
  }
  path.mark();

  const eyeEnd = path.points.at(-1)!;
  path.curve(
    advance(eyeEnd, tangent(eyePoint(0.9999), eyePoint(1)), 0.08),
    [0.07, 1.22, 0.24],
    [0.07, 1.1, 0.24],
  );
  const under = new RopePath();
  for (let i = 0; i <= 200; i++) {
    const angle = -Math.PI * (i / 200);
    under.add([0.07, 1.1 + 0.11 * Math.sin(angle), 0.24 * Math.cos(angle)]);
  }
  for (const q of under.points.slice(1)) {
    path.add(q);
  }
  const dressingEnd = path.points.length - 1;

  // 整个绳弯先在后侧成形，再一起移入锁圈；末端始终留在下方。
  const insert = ease((tuck - 0.35) / 0.65);
  const headY = mix(1.5, mix(1.87, 1.95, tension), ease(tuck / 0.55));
  const headZ = mix(-0.24, mix(0.45, 0.23, tension), insert);
  const leg = new RopePath();
  for (let i = 0; i <= 200; i++) {
    const angle = Math.PI - (Math.PI / 2) * insert * (i / 200);
    leg.add([0.07, 1.1 + 0.14 * Math.sin(angle), 0.24 * Math.cos(angle)]);
  }
  const angle = Math.PI - (Math.PI / 2) * insert;
  const front = leg.points.at(-1)!;
  const d: Vec3 = [0, -0.14 * Math.cos(angle), 0.24 * Math.sin(angle)];
  const size = Math.hypot(...d);
  const h = mix(0.07, 0.13, insert);
  const shoulder: Vec3 = [0.15, headY - 0.15, headZ];
  leg.curve(
    front.map((v, i) => v + (d[i]! / size) * h) as Vec3,
    [shoulder[0], shoulder[1] - mix(0.08, 0.2, insert), shoulder[2]],
    shoulder,
  );
  for (const q of leg.points.slice(1)) {
    path.add(q);
  }
  for (let i = 1; i <= 200; i++) {
    const angle = Math.PI - Math.PI * (i / 200);
    path.add([-0.15 * Math.cos(angle), headY - 0.15 + 0.15 * Math.sin(angle), headZ]);
  }
  for (const q of leg.points.slice(0, -1).reverse()) {
    path.add([-q[0], q[1], q[2]]);
  }
  // 从后半圈的下方顺出工作尾，避免完整回弯后突然反向折返。
  for (let i = 1; i <= 100; i++) {
    const angle = -Math.PI + (Math.PI / 2) * (i / 100);
    path.add([-0.07, 1.1 + 0.11 * Math.sin(angle), 0.24 * Math.cos(angle)]);
  }
  const tailBase = path.points.at(-1)!;
  for (let i = 1; i <= 80; i++) {
    const angle = (Math.PI / 2) * (i / 80);
    path.add([
      -0.07,
      tailBase[1] - 0.07 * (1 - Math.cos(angle)),
      tailBase[2] + 0.07 * Math.sin(angle),
    ]);
  }
  path.line([-0.07, 0.35, 0.07]);
  path.mark();
  path.dressingRange = [dressingStart, dressingEnd];
  return path;
}

const FIREMAN_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '盘出等大的圈',
    instruction: '把绳盘成圆圈，留出工作段。左下方的旁置圈为同一根绳的备用余量。',
  },
  {
    time: 0.28,
    title: '在上缘做出锁圈',
    instruction: '工作段在绳盘上缘形成交叉的小圈，圈口先保持竖立，暂时不要收紧。',
  },
  {
    time: 0.48,
    title: '在后方折出完整绳弯',
    instruction: '让工作段绕到绳盘背后，折出完整的绳弯；自由尾留在下方，准备把中间弯部穿入。',
  },
  {
    time: 0.62,
    title: '把整段绳弯穿入锁圈',
    instruction:
      '抬起后侧的绳弯，将两条腿一起从锁圈后方穿到前方。跟随弯部运动，不是把自由尾穿过圈。',
  },
  {
    time: 0.84,
    title: '收住挂环并整理绳束',
    instruction:
      '收紧原锁圈，让它夹住穿入绳弯的双腿。上方保留挂环，下方短尾用于抽解；挂环仅用于收纳绳束。',
  },
  {
    time: 0.94,
    title: '整理结芯并检查挂环',
    instruction:
      '继续抽回锁圈附近的松量，让结芯贴住绳束；保留上方可挂放的绳环与下方抽解尾，核对前后穿压。',
  },
];

const FIREMAN_LOOSE = firemanRoute(0, 0);
const FIREMAN_DRESS_BASE = firemanRoute(1, 1);
const FIREMAN_BUDGET =
  Math.max(
    ...Array.from({ length: 41 }, (_, i) => {
      const p = i / 40;
      return firemanRoute(Math.min(1, p * 2), Math.max(0, p * 2 - 1)).total;
    }),
  ) +
  firemanReserve(FIREMAN_LOOSE.points[0]!).total +
  0.6;

/** 绳束和挂环保留原位，只整理锁圈及其连接段。 */
function dressedFiremanRoute(progress: number) {
  const frames = getFiremanDressing();
  const frame = ease(progress) * (frames.length - 1);
  const index = Math.min(frames.length - 2, Math.floor(frame));
  const core = frames[index]!.map((point, i) => lerp(point, frames[index + 1]![i]!, frame - index));
  // 控制点只在自身凸包内平滑，检查与渲染共用同一组细分后的中心线。
  const controls = [core[0]!, core[0]!, ...core, core.at(-1)!, core.at(-1)!];
  const smooth: Vec3[] = [core[0]!];
  for (let span = 0; span < controls.length - 3; span++) {
    for (let i = 1; i <= 6; i++) {
      const t = i / 6;
      const weights = [
        (1 - t) ** 3 / 6,
        (4 - 6 * t * t + 3 * t ** 3) / 6,
        (1 + 3 * t + 3 * t * t - 3 * t ** 3) / 6,
        t ** 3 / 6,
      ];
      smooth.push(
        [0, 1, 2].map((k) =>
          weights.reduce((sum, weight, j) => sum + controls[span + j]![k]! * weight, 0),
        ) as Vec3,
      );
    }
  }
  const [begin, end] = FIREMAN_DRESS_BASE.dressingRange;
  const path = new RopePath();
  for (const point of [
    ...FIREMAN_DRESS_BASE.points.slice(0, begin),
    ...smooth,
    ...FIREMAN_DRESS_BASE.points.slice(end + 1),
  ]) {
    path.add(point);
  }
  return path;
}

/** 锁圈完成后，移动的是完整绳弯，真实工作端始终保留。 */
function firemansCoil(progress: number): LessonState {
  const p = clamp(progress);
  const tuck = ease((p - 0.62) / 0.22);
  const tension = ease((p - 0.84) / 0.1);
  const path = p >= 0.62 ? firemanRoute(tuck, tension) : FIREMAN_LOOSE;
  let checkpoint = 0;
  for (let i = 1; i < FIREMAN_STEPS.length; i++) {
    if (p >= FIREMAN_STEPS[i]!.time) {
      checkpoint = i;
    }
  }
  let amount = path.total;
  if (p < 0.62) {
    const cuts = [0.2, ...FIREMAN_LOOSE.marks];
    const start = FIREMAN_STEPS[checkpoint]!.time;
    const end = FIREMAN_STEPS[checkpoint + 1]!.time;
    amount = mix(cuts[checkpoint]!, cuts[checkpoint + 1]!, ease((p - start) / (end - start)));
  }
  let worked = path.prefix(amount);
  if (p >= 0.935) {
    const dressed = dressedFiremanRoute((p - 0.94) / 0.06);
    const sampleCount = Math.ceil(FIREMAN_DRESS_BASE.total / 0.018);
    if (p < 0.94) {
      const blend = ease((p - 0.935) / 0.005);
      const target = dressed.prefix(dressed.total, worked.length - 1);
      worked = worked.map((point, i) => lerp(point, target[i]!, blend));
    } else {
      worked = dressed.prefix(dressed.total, sampleCount);
    }
  }
  const points = firemanWholeCord(worked, FIREMAN_BUDGET);
  return {
    points,
    tip: [...points.at(-1)!],
    checkpoint,
    radius: RADIUS,
    color: '#bd7655',
    endCaps: { start: '1B', end: '1A' },
  };
}

export const FIREMANS_COIL_COURSE: Course = {
  id: 'firemans-coil',
  category: 'knots',
  name: '消防员收绳结',
  title: '消防员收绳结 · 绳弯穿圈的快解挂环',
  description: '把完整绳弯绕到绳盘背后，再穿入初始锁圈，留下挂放绳束的环。',
  material: '一根柔软练习绳',
  materialNote: '上方是同一根绳折出的挂环，下方保留抽解工作尾，左下圈为备用余绳。',
  duration: 48,
  frameWholeProcess: true,
  initialProgress: 0.62,
  projectionBounds: { minX: -1.25, maxX: 1.25, minY: -1.3, maxY: 2.1 },
  steps: FIREMAN_STEPS,
  source: 'https://knots3d.com/en/firemans-coil-knot',
  sourceName: "Knots 3D · Fireman's Coil · ABOK #3094",
  application: {
    scenarios: ['storage', 'home', 'outdoors'],
    task: '整理带有挂环的收纳绳束',
    focus: '整段绳弯穿圈与原锁圈收紧',
    boundary: '挂环只用于收纳绳束，不用于人员承重。',
  },
  getState: firemansCoil,
};
