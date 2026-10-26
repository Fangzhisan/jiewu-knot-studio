import type { LessonSupport, Vec3 } from './lessons/types';

/** 锁扣门在右侧，绕下端铰点向内打开；尺寸均为金属管中心线尺寸。 */
export function carabinerGate(support: LessonSupport): [Vec3, Vec3] {
  const width = support.width ?? support.length * (6 / 11);
  const halfGate = support.length / 4;
  const angle = (Math.PI / 3) * Math.max(0, Math.min(1, support.gateOpen ?? 0));
  const hinge: Vec3 = [width / 2, -halfGate, 0];
  return [
    hinge,
    [hinge[0] - 2 * halfGate * Math.sin(angle), hinge[1] + 2 * halfGate * Math.cos(angle), 0],
  ];
}

/** 连续圆角框保留底部直座，模型与碰撞检查使用同一条中心线。 */
export function carabinerBody(support: LessonSupport): Vec3[] {
  const width = support.width ?? support.length * (6 / 11);
  const x = width / 2;
  const y = support.length / 2;
  const corner = Math.min(width / 4, support.length * 0.15);
  const points: Vec3[] = [
    [x, support.length / 4, 0],
    [x, y - corner, 0],
  ];
  const arc = (cx: number, cy: number, start: number) => {
    for (let i = 1; i <= 24; i++) {
      const angle = start + (i * Math.PI) / 48;
      points.push([cx + corner * Math.cos(angle), cy + corner * Math.sin(angle), 0]);
    }
  };
  arc(x - corner, y - corner, 0);
  points.push([-x + corner, y, 0]);
  arc(-x + corner, y - corner, Math.PI / 2);
  points.push([-x, -y + corner, 0]);
  arc(-x + corner, -y + corner, Math.PI);
  points.push([x - corner, -y, 0]);
  arc(x - corner, -y + corner, (Math.PI * 3) / 2);
  points.push([x, -support.length / 4, 0]);
  return points;
}

/** 将局部 XY 锁扣转到支撑物的法线方向，与渲染器的四元数旋转一致。 */
export function supportPlanePoint(point: Vec3, support: LessonSupport): Vec3 {
  const magnitude = Math.hypot(...support.axis);
  const n = magnitude > 1e-10 ? support.axis.map((v) => v / magnitude) : [0, 0, 1];
  const sine = Math.hypot(n[0]!, n[1]!);
  let rotated: Vec3;
  if (sine < 1e-10) {
    rotated = n[2]! >= 0 ? point : [-point[0], point[1], -point[2]];
  } else {
    const k: Vec3 = [-n[1]! / sine, n[0]! / sine, 0];
    const dot = k[0] * point[0] + k[1] * point[1];
    const cross: Vec3 = [k[1] * point[2], -k[0] * point[2], k[0] * point[1] - k[1] * point[0]];
    rotated = point.map((v, i) => v * n[2]! + cross[i]! * sine + k[i]! * dot * (1 - n[2]!)) as Vec3;
  }
  return rotated.map((v, i) => v + support.position[i]!) as Vec3;
}

/** 包含活动门的世界坐标中心线，供投影、取景和线段距离检查复用。 */
export function carabinerWorldLines(support: LessonSupport): Vec3[][] {
  return [carabinerBody(support), carabinerGate(support)].map((line) =>
    line.map((point) => supportPlanePoint(point, support)),
  );
}
