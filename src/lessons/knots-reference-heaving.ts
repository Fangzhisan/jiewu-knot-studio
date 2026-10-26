import type { Course, LessonState, LessonStep, Vec3 } from './types';

const RADIUS = 0.055;
const TAU = Math.PI * 2;
const clamp = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const distance = (a: Vec3, b: Vec3) => Math.hypot(...a.map((n, i) => n - b[i]!));
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => a.map((n, i) => mix(n, b[i]!, t)) as Vec3;

/** 缓入缓出，倒放时也走相同路线。 */
function ease(n: number) {
  const t = clamp(n);
  return t * t * (3 - 2 * t);
}

/** 连续绳路保留每圈和回穿的动作边界。 */
class HeavingPath {
  points: Vec3[] = [];
  lengths: number[] = [];
  marks: number[] = [];
  total = 0;

  add(point: Vec3) {
    const previous = this.points.at(-1);
    const length = previous ? distance(previous, point) : 0;
    if (previous && length < 1e-9) return;
    this.total += length;
    this.points.push(point);
    this.lengths.push(this.total);
  }

  line(point: Vec3) {
    const start = this.points.at(-1)!;
    const count = Math.max(2, Math.ceil(distance(start, point) / 0.018));
    for (let i = 1; i <= count; i++) this.add(lerp(start, point, i / count));
  }

  cubic(b: Vec3, c: Vec3, d: Vec3) {
    const a = this.points.at(-1)!;
    for (let i = 1; i <= 100; i++) {
      const t = i / 100,
        s = 1 - t;
      this.add(
        [0, 1, 2].map(
          (k) => a[k]! * s ** 3 + 3 * b[k]! * s * s * t + 3 * c[k]! * s * t * t + d[k]! * t ** 3,
        ) as Vec3,
      );
    }
  }

  mark() {
    this.marks.push(this.total);
  }

  /** 按弧长取样，避免管壁在很短的相邻点之间翻折。 */
  sample(amount: number) {
    const end = Math.min(this.total, Math.max(0.3, amount));
    const count = Math.max(24, Math.ceil(end / 0.018));
    let index = 1;
    return Array.from({ length: count + 1 }, (_, i) => {
      const offset = (end * i) / count;
      while (index < this.lengths.length - 1 && this.lengths[index]! < offset) index++;
      return lerp(
        this.points[index - 1]!,
        this.points[index]!,
        (offset - this.lengths[index - 1]!) / (this.lengths[index]! - this.lengths[index - 1]!),
      );
    });
  }
}

/** 上端绳弯夹住横穿的工作尾，两条芯线先上行再回折。 */
function capuchinRoute(tension: number) {
  const path = new HeavingPath();
  const offset = mix(0.13, 0.0565, tension);
  const rx = mix(0.3, 0.134, tension);
  const rz = mix(0.34, 0.169, tension);
  const pitch = mix(0.2, 0.114, tension);
  const half = (8 * pitch) / 2;
  const eyeRadius = mix(0.23, 0.114, tension);
  const eyeCenter = half + mix(0.28, 0.16, tension);
  const eyeHandle = mix(0.16, 0.09, tension);
  const bend = mix(0.14, 0.07, tension);
  const handle = mix(0.32, 0.16, tension);
  const returnHandle = mix(0.25, 0.12, tension);
  path.add([0, -1.8, 0.13]);
  path.cubic([0, -1.5, 0.13], [0, -half - 0.4, offset], [0, -half - 0.2, offset]);
  path.line([0, half, offset]);
  path.cubic(
    [0, half + eyeHandle, offset],
    [0, eyeCenter - eyeHandle, eyeRadius],
    [0, eyeCenter, eyeRadius],
  );
  for (let i = 1; i <= 96; i++) {
    const angle = (Math.PI * i) / 96;
    path.add([0, eyeCenter + eyeRadius * Math.sin(angle), eyeRadius * Math.cos(angle)]);
  }
  path.cubic(
    [0, eyeCenter - eyeHandle, -eyeRadius],
    [0, half + eyeHandle, -offset],
    [0, half, -offset],
  );
  path.line([0, -half, -offset]);
  path.mark();
  const lower = new HeavingPath();
  lower.add([0, half, -rz]);
  lower.cubic(
    [handle, half + (handle * pitch) / (TAU * rx), -rz],
    [bend + returnHandle, half + bend, offset],
    [bend, half + bend, offset],
  );
  for (let i = 1; i <= 48; i++) {
    const angle = Math.PI / 2 + (Math.PI * i) / 96;
    lower.add([bend + bend * Math.cos(angle), half + bend * Math.sin(angle), offset]);
  }
  for (const point of [...lower.points].reverse().slice(1)) {
    path.add([point[0], -point[1], -point[2]]);
  }
  for (let turn = 0; turn < 8; turn++) {
    for (let i = 1; i <= 180; i++) {
      const along = turn + i / 180;
      const angle = Math.PI / 2 + TAU * along;
      path.add([rx * Math.cos(angle), -half + pitch * along, rz * Math.sin(angle)]);
    }
    path.mark();
  }
  const entry = mix(0.38, 0.24, tension);
  path.cubic(
    [-entry, half + (entry * pitch) / (TAU * rx), rz],
    [-entry, eyeCenter, 0],
    [-0.12, eyeCenter, 0],
  );
  path.line([0.45, eyeCenter, 0]);
  path.mark();
  const angle = Math.PI / 3;
  path.points = path.points.map(([x, y, z]) => [
    x * Math.cos(angle) + z * Math.sin(angle),
    y,
    -x * Math.sin(angle) + z * Math.cos(angle),
  ]);
  return path;
}

/** 抛绳结用S形折返形成三股芯，线尾从下端环穿出。 */
function heavingLineRoute(tension: number) {
  const path = new HeavingPath();
  const separation = mix(0.26, 0.116, tension);
  const radius = mix(0.39, 0.185, tension);
  const pitch = mix(0.2, 0.115, tension);
  const half = ((9 + 1 / 4) * pitch) / 2;
  const a: Vec3 = [-separation / 2, 0, -separation / Math.sqrt(12)];
  const b: Vec3 = [separation / 2, 0, -separation / Math.sqrt(12)];
  const c: Vec3 = [0, 0, separation / Math.sqrt(3)];
  const topRadius = mix(0.17, 0.061, tension);
  const topCenter = half + mix(0.24, 0.12, tension);
  const topHandle = mix(0.14, 0.07, tension);
  const start: Vec3 = [-0.13, -1.8, -0.26 / Math.sqrt(12)];
  path.add(start);
  path.cubic([start[0], -1.5, start[2]], [a[0], -half - 0.4, a[2]], [a[0], -half - 0.2, a[2]]);
  path.line([a[0], half, a[2]]);
  path.cubic(
    [a[0], half + topHandle, a[2]],
    [-topRadius, topCenter - topHandle, a[2]],
    [-topRadius, topCenter, a[2]],
  );
  for (let i = 1; i <= 96; i++) {
    const angle = Math.PI - (Math.PI * i) / 96;
    path.add([topRadius * Math.cos(angle), topCenter + topRadius * Math.sin(angle), a[2]]);
  }
  path.cubic(
    [topRadius, topCenter - topHandle, b[2]],
    [b[0], half + topHandle, b[2]],
    [b[0], half, b[2]],
  );
  path.line([b[0], -half, b[2]]);
  const v: Vec3 = [-0.5, 0, Math.sqrt(3) / 2];
  const w: Vec3 = [Math.sqrt(3) / 2, 0, 0.5];
  const shift = mix(0.35, 0.14, tension);
  const eyeRadius = mix(0.25, 0.15, tension);
  const center: Vec3 = [
    (b[0] + c[0]) / 2 + shift * w[0],
    -half - mix(0.36, 0.21, tension),
    (b[2] + c[2]) / 2 + shift * w[2],
  ];
  const eyePoint = (side: number): Vec3 => [
    center[0] + side * eyeRadius * v[0],
    center[1],
    center[2] + side * eyeRadius * v[2],
  ];
  const eyeStart = eyePoint(-1),
    eyeEnd = eyePoint(1);
  const eyeHandle = mix(0.18, 0.09, tension);
  path.cubic(
    [b[0], -half - eyeHandle, b[2]],
    [eyeStart[0], center[1] + eyeHandle, eyeStart[2]],
    eyeStart,
  );
  for (let i = 1; i <= 96; i++) {
    const angle = (Math.PI * i) / 96;
    const q = -eyeRadius * Math.cos(angle);
    path.add([
      center[0] + q * v[0],
      center[1] - mix(0.25, 0.114, tension) * Math.sin(angle),
      center[2] + q * v[2],
    ]);
  }
  path.cubic(
    [eyeEnd[0], center[1] + eyeHandle, eyeEnd[2]],
    [c[0], -half - eyeHandle, c[2]],
    [c[0], -half, c[2]],
  );
  const coreExitZ = c[2] + mix(0.03, 0.018, tension);
  const coreExitY = half + mix(0.1, 0.05, tension);
  const flareStart = half - mix(0.16, 0.08, tension);
  const flareHandle = (coreExitY - flareStart) / 3;
  path.line([c[0], flareStart, c[2]]);
  path.cubic(
    [c[0], flareStart + flareHandle, c[2]],
    [c[0], coreExitY - flareHandle, coreExitZ],
    [c[0], coreExitY, coreExitZ],
  );
  path.mark();
  const returnPath = new HeavingPath();
  const bend = mix(0.17, 0.075, tension),
    handle = mix(0.46, 0.23, tension),
    returnHandle = mix(0.34, 0.17, tension);
  returnPath.add([0, half, -radius]);
  returnPath.cubic(
    [handle, half + (handle * pitch) / (TAU * radius), -radius],
    [bend + returnHandle, coreExitY + bend, coreExitZ],
    [bend, coreExitY + bend, coreExitZ],
  );
  for (let i = 1; i <= 48; i++) {
    const angle = Math.PI / 2 + (Math.PI * i) / 96;
    returnPath.add([bend + bend * Math.cos(angle), coreExitY + bend * Math.sin(angle), coreExitZ]);
  }
  for (const point of [...returnPath.points].reverse().slice(1))
    path.add([-point[0], point[1], point[2]]);
  for (let turn = 0; turn < 9; turn++) {
    for (let i = 1; i <= 180; i++) {
      const along = turn + i / 180,
        angle = -Math.PI / 2 + TAU * along;
      path.add([radius * Math.cos(angle), half - pitch * along, radius * Math.sin(angle)]);
    }
    path.mark();
  }
  // 最后一小段包绕直接向下端环回穿，收紧后转接贴着结芯。
  for (let i = 1; i <= 90; i++) {
    const along = 9 + i / 360;
    const angle = -Math.PI / 2 + TAU * along;
    path.add([radius * Math.cos(angle), half - pitch * along, radius * Math.sin(angle)]);
  }
  const from = path.points.at(-1)!;
  const direction: Vec3 = [-w[0] + 0.53 * v[0], 0, -w[2] + 0.53 * v[2]];
  const entry: Vec3 = center.map((n, i) => n - 0.02 * direction[i]!) as Vec3;
  const handleIn = mix(0.36, 0.32, tension);
  const handleOut = mix(0.2, 0.17, tension);
  path.cubic(
    [from[0], from[1] - (handleIn * pitch) / (TAU * radius), from[2] + handleIn],
    entry.map((n, i) => n - handleOut * direction[i]!) as Vec3,
    entry,
  );
  path.line(center.map((n, i) => n + 0.5 * direction[i]!) as Vec3);
  path.mark();
  const angle = Math.PI / 3;
  path.points = path.points.map(([x, y, z]) => [
    x * Math.cos(angle) + z * Math.sin(angle),
    y,
    -x * Math.sin(angle) + z * Math.cos(angle),
  ]);
  return path;
}

/** 供绳圈接在主端，整根绳子的真实工作端仍用于穿绕。 */
function reserveConnection(start: Vec3) {
  const path = new HeavingPath();
  path.add([-1.1, -2.1, start[2]]);
  path.cubic(
    [-1.1, -1.75, start[2] + (0.35 * 0.18) / (TAU * 0.6)],
    [start[0], -2.15, start[2]],
    start,
  );
  return path;
}

/** 供绳量按离散长度反算，不在工作端之后附加虚假的尾巴。 */
function wholeCord(worked: Vec3[], budget: number) {
  const connection = reserveConnection(worked[0]!);
  for (const point of worked.slice(1)) {
    connection.add(point);
  }
  const remaining = budget - connection.total;
  const radius = 0.6;
  const pitch = 0.18 / TAU;
  const count = Math.max(24, Math.ceil(remaining / 0.014));
  let angle = remaining / Math.hypot(radius, pitch);
  for (let i = 0; i < 4; i++) {
    const q = angle / count;
    const segment = Math.hypot(2 * radius * Math.sin(q / 2), pitch * q);
    const derivative = (radius * radius * Math.sin(q) + pitch * pitch * q) / segment;
    angle -= (count * segment - remaining) / derivative;
  }
  const path = new HeavingPath();
  for (let i = 0; i <= count; i++) {
    const theta = -angle + (angle * i) / count;
    path.add([
      -1.7 + radius * Math.cos(theta),
      -2.1 + radius * Math.sin(theta),
      worked[0]![2] + pitch * theta,
    ]);
  }
  for (const point of connection.points.slice(1)) {
    path.add(point);
  }
  return path.points;
}

/** 乌利结先包绕折回的双股芯，最后仅穿上方端环。 */
function capuchinCourse(): Course {
  const descriptions: [string, string][] = [
    ['折出长绳弯', '主端 1B 从下方引来，工作端 1A 折回向下，留出包绕用的双股绳段和上方端环。'],
    ...Array.from({ length: 8 }, (_, index): [string, string] => [
      `包绕第${index + 1}圈`,
      `工作端围住两条芯线绕第 ${index + 1} 圈，按同一方向从下向上排齐。上方端环继续保持打开。`,
    ]),
    ['穿过上方端环', '工作端从端环的一侧穿到另一侧。这里只穿最上方的小环，保留可以捏住的自由尾。'],
    [
      '收拢端环与圈列',
      '逐圈整理外绕绳，沿主段抽回余量，使上端绳弯夹住工作尾。检查两端回弯贴合、圈列密实。',
    ],
  ];
  const times = descriptions.map((_, i) => (i * 0.84) / (descriptions.length - 1));
  const loose = capuchinRoute(0);
  const cuts = [0.4, ...loose.marks, loose.total];
  const budget = loose.total + reserveConnection(loose.points[0]!).total + 0.9;
  return {
    id: 'capuchin-heaving-stopper',
    category: 'knots',
    name: '乌利结',
    title: '双股芯上的八圈绳端包绕',
    description: '以八圈为例制作紧密绳端，辨认双股芯和上方端环收尾。',
    material: '一根柔软圆绳',
    materialNote: '左下圈是主端备用余绳；工作端1A绕过双股芯后只穿上端小环。',
    duration: 56,
    initialProgress: times.at(-2)!,
    steps: descriptions.map(([title, instruction], i) => ({ time: times[i]!, title, instruction })),
    source: 'https://knots3d.com/zh-CN/%E4%B9%8C%E5%88%A9%E7%BB%93',
    sourceName: 'Knots 3D · 乌利结',
    application: {
      scenarios: ['outdoors', 'accessories'],
      task: '认识轻绳端的密集包绕结构',
      focus: '双股芯、逐圈包绕与上端环收尾',
      boundary: '用于软绳结构练习，不演示抛投或实际承重。',
    },
    projectionBounds: { minX: -0.45, maxX: 0.6, minY: -0.66, maxY: 0.82 },
    getState(progress): LessonState {
      const p = clamp(progress);
      let checkpoint = 0;
      for (let i = times.length - 1; i >= 0; i--) {
        if (p >= times[i]!) {
          checkpoint = i;
          break;
        }
      }
      const tension = ease((p - 0.84) / 0.16);
      const path = tension > 0 ? capuchinRoute(tension) : loose;
      const amount =
        p >= 0.84
          ? path.total
          : mix(
              cuts[checkpoint]!,
              cuts[checkpoint + 1]!,
              ease((p - times[checkpoint]!) / ((times[checkpoint + 1] ?? 1) - times[checkpoint]!)),
            );
      const points = wholeCord(path.sample(amount), budget);
      return {
        points,
        tip: [...points.at(-1)!],
        checkpoint,
        radius: RADIUS,
        color: '#4d8c88',
        endCaps: { start: '1B', end: '1A' },
      };
    },
  };
}

/** 抛绳结先排好三股芯，再向下包绕并穿下端环。 */
function heavingLineCourse(): Course {
  const descriptions: [string, string][] = [
    ['排出S形双环', '先向上折回，再向下折回，形成三条并排绳段和上下两个端环。工作端1A回到上方。'],
    ...Array.from({ length: 9 }, (_, index): [string, string] => [
      `包绕第${index + 1}圈`,
      `工作端向下包绕第 ${index + 1} 圈，逐圈围住S形的三股芯。下方端环保持打开，预备穿入工作尾。`,
    ]),
    ['穿过下方端环', '完成向下包绕后，把工作尾穿过下方小环，留出一段尾线。不要回穿整列圈心。'],
    [
      '收拢端环与圈列',
      '整理上下端环，让下端环夹住工作尾，并抽走上端环余量。逐圈排齐，使圈列和回弯贴紧三股芯。',
    ],
  ];
  const times = descriptions.map((_, i) => (i * 0.84) / (descriptions.length - 1));
  const loose = heavingLineRoute(0);
  const cuts = [0.4, ...loose.marks, loose.total];
  const budget = loose.total + reserveConnection(loose.points[0]!).total + 0.9;
  return {
    id: 'heaving-line-stopper',
    frameWholeProcess: true,
    category: 'knots',
    name: '抛绳结',
    title: 'S形三股芯上的抛绳端结',
    description: '练习S形三股芯的连续包绕与下端环收尾。',
    material: '一根柔软圆绳',
    materialNote: '左下圈是主端备用余绳；上下端环属于同一条S形折绳。',
    duration: 62,
    initialProgress: times.at(-2)!,
    steps: descriptions.map(([title, instruction], i) => ({ time: times[i]!, title, instruction })),
    source: 'https://knots3d.com/zh-CN/%E6%8A%9B%E7%BB%B3%E7%BB%93',
    sourceName: 'Knots 3D · 抛绳结',
    application: {
      scenarios: ['outdoors', 'accessories'],
      task: '认识轻绳端的密集包绕结构',
      focus: '三股芯、向下包绕与下端环收尾',
      boundary: '用于软绳结构练习，不演示抛投或实际承重。',
    },
    projectionBounds: { minX: -0.45, maxX: 0.6, minY: -0.95, maxY: 0.88 },
    getState(progress): LessonState {
      const p = clamp(progress);
      let checkpoint = 0;
      for (let i = times.length - 1; i >= 0; i--) {
        if (p >= times[i]!) {
          checkpoint = i;
          break;
        }
      }
      const tension = ease((p - 0.84) / 0.16);
      const path = tension > 0 ? heavingLineRoute(tension) : loose;
      const amount =
        p >= 0.84
          ? path.total
          : mix(
              cuts[checkpoint]!,
              cuts[checkpoint + 1]!,
              ease((p - times[checkpoint]!) / ((times[checkpoint + 1] ?? 1) - times[checkpoint]!)),
            );
      const points = wholeCord(path.sample(amount), budget);
      return {
        points,
        tip: [...points.at(-1)!],
        checkpoint,
        radius: RADIUS,
        color: '#b98757',
        endCaps: { start: '1B', end: '1A' },
      };
    },
  };
}

export const REFERENCE_HEAVING_COURSES = [capuchinCourse(), heavingLineCourse()];
