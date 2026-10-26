import type { LessonBead, Vec3 } from './types';

/** 珠串成品共用向量和限幅，孔轴始终归一化。 */
export const clamp = (p: number) => Math.max(0, Math.min(1, Number.isFinite(p) ? p : 0));
export const ease = (p: number) => {
  const t = clamp(p);
  return t * t * (3 - 2 * t);
};
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const add = (a: Vec3, b: Vec3, n = 1): Vec3 => a.map((v, i) => v + b[i]! * n) as Vec3;
export const lerp = (a: Vec3, b: Vec3, t: number): Vec3 =>
  a.map((v, i) => mix(v, b[i]!, t)) as Vec3;
export const distance = (a: Vec3, b: Vec3) => Math.hypot(...a.map((v, i) => v - b[i]!));
export const unit = (a: Vec3): Vec3 => {
  const d = Math.hypot(...a);
  return a.map((v) => v / d) as Vec3;
};

/** 每次穿孔记录真实累计线长，便于高亮和检查回穿。 */
export interface BeadPassage {
  beadId: string;
  from: number;
  to: number;
  direction: number;
  lane: number;
}

/** 连续线段保留切线和弧长；珠孔内直走，孔外才转弯。 */
export class BeadProjectPath {
  points: Vec3[] = [];
  lengths: number[] = [];
  passages: BeadPassage[] = [];
  marks: number[] = [];
  length = 0;
  tangent: Vec3 = [1, 0, 0];

  /** 滤掉重复点，避免渲染器收到退化切线。 */
  push(point: Vec3) {
    const last = this.points.at(-1);
    const d = last ? distance(last, point) : 0;
    if (last && d < 1e-10) {
      return;
    }
    if (last) {
      this.tangent = unit(add(point, last, -1));
    }
    this.length += d;
    this.points.push(point);
    this.lengths.push(this.length);
  }

  /** 直线也采样，孔沿和端帽检查能覆盖整段。 */
  line(end: Vec3) {
    const start = this.points.at(-1)!;
    const count = Math.max(1, Math.ceil(distance(start, end) / 0.012));
    for (let i = 1; i <= count; i++) {
      this.push(lerp(start, end, i / count));
    }
  }

  /** 孔外连接保留两端指定切线。 */
  connect(end: Vec3, endAxis: Vec3, handle = 0.08) {
    const start = this.points.at(-1)!;
    const d = distance(start, end);
    if (d < 1e-9) {
      this.tangent = endAxis;
      return;
    }
    const h = Math.min(handle, d * 0.3);
    const b = add(start, this.tangent, h),
      c = add(end, endAxis, -h);
    const count = Math.max(24, Math.ceil((d + 4 * h) / 0.01));
    for (let i = 1; i <= count; i++) {
      const t = i / count,
        u = 1 - t;
      this.push(
        start.map(
          (v, k) => v * u ** 3 + 3 * b[k]! * u * u * t + 3 * c[k]! * u * t * t + end[k]! * t ** 3,
        ) as Vec3,
      );
    }
    this.tangent = endAxis;
  }

  /** 同一孔的回穿用前后两条通道，不占用同一条中心线。 */
  visit(bead: LessonBead, direction = 1, lane = 0.009) {
    const axis = add([0, 0, 0], bead.axis, direction);
    const hole = Math.min(bead.radius * 0.8, Math.max(0.055, Math.min(0.12, bead.radius * 0.36)));
    const half = Math.sqrt(bead.radius ** 2 - hole ** 2) * (bead.axialScale ?? 1) + 0.011;
    const center = add(bead.position, [0, 0, lane]);
    const entry = add(center, axis, -half),
      exit = add(center, axis, half);
    if (!this.points.length) {
      this.push(entry);
      this.tangent = axis;
    } else {
      this.connect(entry, axis);
    }
    const from = this.length;
    this.line(exit);
    this.tangent = axis;
    this.passages.push({ beadId: bead.id, from, to: this.length, direction, lane });
  }

  /** 记下步骤边界对应的实际工作线长。 */
  mark() {
    this.marks.push(this.length);
  }

  /** 按弧长截取，真实工作端平滑走完全部穿孔路线。 */
  prefix(amount: number) {
    const end = Math.max(0.001, Math.min(this.length, amount));
    const result: Vec3[] = [this.points[0]!];
    for (let i = 1; i < this.points.length; i++) {
      if (this.lengths[i]! <= end) {
        result.push(this.points[i]!);
      } else {
        result.push(
          lerp(
            this.points[i - 1]!,
            this.points[i]!,
            (end - this.lengths[i - 1]!) / (this.lengths[i]! - this.lengths[i - 1]!),
          ),
        );
        break;
      }
    }
    return result;
  }
}

/** 线先围住扣件金属管，再回到压管的另一条孔内通道。 */
export function connectorEye(
  path: BeadProjectPath,
  contact: Vec3,
  outward: Vec3,
  radius: number,
  front = -1,
) {
  path.connect(add(contact, [0, 0, front * radius]), outward, 0.06);
  for (let i = 1; i <= 80; i++) {
    const angle = (Math.PI * i) / 80;
    path.push(
      add(add(contact, outward, radius * Math.sin(angle)), [
        0,
        0,
        front * radius * Math.cos(angle),
      ]),
    );
  }
  path.tangent = add([0, 0, 0], outward, -1);
}
