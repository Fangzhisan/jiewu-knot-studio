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
class StopperRoute {
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

/** 接回段藏在首末圈包络内，圆弧负责由横向平顺转为轴向。 */
function upperReturn(half: number, tension: number) {
  const path = new StopperRoute();
  const offset = mix(0.13, 0.0565, tension);
  const rx = mix(0.3, 0.134, tension);
  const rz = mix(0.34, 0.169, tension);
  const pitch = mix(0.22, 0.114, tension);
  const bend = mix(0.14, 0.07, tension);
  const handle = mix(0.32, 0.16, tension);
  const returnHandle = mix(0.25, 0.12, tension);
  path.add([0, half, -rz]);
  path.cubic(
    [handle, half + (handle * pitch) / (TAU * rx), -rz],
    [bend + returnHandle, half + bend, offset],
    [bend, half + bend, offset],
  );
  for (let i = 1; i <= 48; i++) {
    const angle = Math.PI / 2 + (Math.PI * i) / 96;
    path.add([bend + bend * Math.cos(angle), half + bend * Math.sin(angle), offset]);
  }
  return path;
}

/** 圈数按完整穿绕计算；首末接回已占圈列两端，中段螺旋少半圈。 */
function barrelRoute(turns: number, tension: number) {
  const route = new StopperRoute();
  const offset = mix(0.13, 0.0565, tension);
  const rx = mix(0.3, 0.134, tension);
  const rz = mix(0.34, 0.169, tension);
  const pitch = mix(0.22, 0.114, tension);
  const half = ((turns - 0.5) * pitch) / 2;
  route.add([0, 1.7, -0.13]);
  route.cubic([0, 1.4, -0.13], [0, half + 0.4, -offset], [0, half + 0.2, -offset]);
  route.line([0, -half, -offset]);
  route.mark();
  const cap = upperReturn(half, tension);
  for (const point of [...cap.points].reverse().slice(1)) {
    route.add([point[0], -point[1], -point[2]]);
  }
  // 首圈已由下接回段起头，末圈由上接回段补齐；不额外叠出两只松圈。
  const segments = [0.75, ...Array.from({ length: turns - 2 }, () => 1), 0.75];
  let turnOffset = 0;
  for (const [index, span] of segments.entries()) {
    const count = Math.ceil(span * 180);
    for (let i = 1; i <= count; i++) {
      const along = turnOffset + (span * i) / count;
      const angle = Math.PI / 2 + TAU * along;
      route.add([rx * Math.cos(angle), -half + pitch * along, rz * Math.sin(angle)]);
    }
    turnOffset += span;
    if (index < turns - 1) {
      route.mark();
    }
  }
  for (const point of cap.points.slice(1)) {
    route.add(point);
  }
  route.mark();
  route.line([0, -1.5, offset]);
  route.mark();
  return route;
}

/** 主端旁置余绳圈的固定接入点，工作端保持为真正穿圈的最末点。 */
function reserveConnection() {
  const path = new StopperRoute();
  path.add([-1.1, 2.1, -0.13]);
  path.cubic([-1.1, 1.75, -0.13 + (0.35 * 0.18) / (TAU * 0.6)], [0, 2.05, -0.13], [0, 1.7, -0.13]);
  return path;
}

/** 展开和收紧的余量在主端抽送，按离散弧长保持整绳长度。 */
function wholeCord(worked: Vec3[], budget: number) {
  const connection = reserveConnection();
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
  const path = new StopperRoute();
  for (let i = 0; i <= count; i++) {
    const theta = -angle + (angle * i) / count;
    path.add([
      -1.7 + radius * Math.cos(theta),
      2.1 - radius * Math.sin(theta),
      -0.13 + pitch * theta,
    ]);
  }
  for (const point of connection.points.slice(1)) {
    path.add(point);
  }
  return path.points;
}

/** 绕圈逐圈推进，全部回穿之后才整理结芯。 */
function makeCourse(turns: 3 | 6): Course {
  const name = turns === 3 ? '三重反手结' : '多重反手结';
  const descriptions: [string, string][] = [
    [
      '留出工作绳尾',
      '主绳 1B 向上，预留足够工作端 1A。把工作端引到主段下方，给后续绕圈和回穿留出空间。',
    ],
    ...Array.from({ length: turns }, (_, index): [string, string] => [
      `绕出第${index + 1}圈`,
      `工作端按同一方向绕主段，形成第 ${index + 1} 圈。新圈排在前一圈旁边，保留贯穿圈心的通道。`,
    ]),
    [
      '回穿全部绳圈',
      `把工作端折回，依次穿过全部 ${turns} 圈的内部通道；它与原来的主段并排，不从相邻两圈之间钻出。`,
    ],
    [
      '逐圈整理收紧',
      `按顺序排齐 ${turns} 圈，沿主段抽走多余绳量。检查圈列贴合、出绳方向顺畅，保留可辨认的绳尾。`,
    ],
  ];
  const times = descriptions.map((_, i) => (i * 0.84) / (descriptions.length - 1));
  const loose = barrelRoute(turns, 0);
  const cuts = [0.4, ...loose.marks, loose.total];
  const budget = loose.total + reserveConnection().total + 0.9;
  const steps: LessonStep[] = descriptions.map(([title, instruction], i) => ({
    time: times[i]!,
    title,
    instruction,
  }));
  return {
    id: turns === 3 ? 'triple-overhand-stopper' : 'multiple-overhand-stopper',
    category: 'knots',
    name,
    title: turns === 3 ? '把三圈整理成紧实止端' : '六圈回穿，整理连续桶形结芯',
    description:
      turns === 3
        ? '给帽绳、抽绳或装饰挂绳制作三圈止端。'
        : '以六圈为例，练习多重反手结的排圈与整齐收尾。',
    material: '一根柔软圆绳',
    materialNote: '用柔软圆绳练习。左上圈是主端备用余绳；1A 始终是真正绕圈、回穿的工作端。',
    duration: turns === 3 ? 38 : 54,
    initialProgress: times.at(-2)!,
    steps,
    source: `https://knots3d.com/zh-CN/${encodeURIComponent(name)}`,
    sourceName: `Knots 3D · ${name}`,
    application: {
      scenarios: ['home', 'accessories'],
      task: '整理抽绳或挂绳的止端结',
      focus: `${turns} 圈同向绕行、共同回穿与逐圈收紧`,
      boundary: '仅演示非承重绳端的制作结构，不能据此判断绳材的实际止脱能力。',
    },
    projectionBounds: {
      minX: -0.44,
      maxX: 0.44,
      minY: -turns * 0.057 - 0.5,
      maxY: turns * 0.057 + 0.5,
    },
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
      const route = tension > 0 ? barrelRoute(turns, tension) : loose;
      const amount =
        p >= 0.84
          ? route.total
          : mix(
              cuts[checkpoint]!,
              cuts[checkpoint + 1]!,
              ease((p - times[checkpoint]!) / ((times[checkpoint + 1] ?? 1) - times[checkpoint]!)),
            );
      const points = wholeCord(route.sample(amount), budget);
      return {
        points,
        tip: [...points.at(-1)!],
        checkpoint,
        radius: RADIUS,
        color: turns === 3 ? '#af8063' : '#658978',
        endCaps: { start: '1B', end: '1A' },
      };
    },
  };
}

export const REFERENCE_STOPPER_COURSES = [makeCourse(3), makeCourse(6)];
