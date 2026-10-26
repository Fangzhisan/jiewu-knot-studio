import type { Vec3 } from './types';

/** 编织模型共用的进度与线段插值，不改变线股身份。 */
export const clamp = (v: number) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp = (a: Vec3, b: Vec3, t: number): Vec3 =>
  a.map((v, i) => mix(v, b[i]!, t)) as Vec3;
export const distance = (a: Vec3, b: Vec3) => Math.hypot(...a.map((v, i) => v - b[i]!));
export const ease = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};

/** 连续中心线保留弧长和操作分界，工作端按真实线长前进。 */
export class WeavingRoute {
  points: Vec3[] = [];
  lengths: number[] = [];
  marks: number[] = [];
  total = 0;

  /** 接入一处坐标，滤掉连续重复点。 */
  add(p: Vec3) {
    const previous = this.points.at(-1);
    const length = previous ? distance(previous, p) : 0;
    if (previous && length < 1e-9) {
      return;
    }
    this.total += length;
    this.points.push(p);
    this.lengths.push(this.total);
  }

  /** 等距接出直线。 */
  line(end: Vec3) {
    const start = this.points.at(-1)!;
    const n = Math.max(2, Math.ceil(distance(start, end) / 0.012));
    for (let i = 1; i <= n; i++) {
      this.add(lerp(start, end, i / n));
    }
  }

  /** 三次曲线的两段控制柄保留连接方向。 */
  cubic(b: Vec3, c: Vec3, end: Vec3) {
    const a = this.points.at(-1)!;
    for (let i = 1; i <= 100; i++) {
      const t = i / 100;
      const s = 1 - t;
      this.add(
        a.map(
          (v, k) => v * s ** 3 + 3 * b[k]! * s * s * t + 3 * c[k]! * s * t * t + end[k]! * t ** 3,
        ) as Vec3,
      );
    }
  }

  /** 记下当前操作结束的线长。 */
  mark() {
    this.marks.push(this.total);
  }

  /** 按弧长截取连续路线，端点不会跳到下一段。 */
  prefix(amount: number, minimum = 0.08) {
    const end = Math.max(minimum, Math.min(this.total, amount));
    if (end <= 1e-9) {
      return [this.points[0]!];
    }
    const n = Math.max(12, Math.ceil(end / 0.012));
    const result: Vec3[] = [];
    let j = 1;
    for (let i = 0; i <= n; i++) {
      const at = (end * i) / n;
      while (j < this.lengths.length - 1 && this.lengths[j]! < at) {
        j++;
      }
      result.push(
        lerp(
          this.points[j - 1]!,
          this.points[j]!,
          (at - this.lengths[j - 1]!) / (this.lengths[j]! - this.lengths[j - 1]!),
        ),
      );
    }
    return result;
  }
}
