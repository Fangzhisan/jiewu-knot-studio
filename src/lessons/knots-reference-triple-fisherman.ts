import type { Course, LessonState, Vec3 } from './types';

const TAU = Math.PI * 2;
const RADIUS = 0.045;
const CORE_SPACING = 0.1;
const CORE_OFFSET = CORE_SPACING / 2;
const CORE_CENTER_X = (-Math.sqrt(3) * CORE_SPACING) / 6;
const TIMES = [0, 0.12, 0.21, 0.3, 0.39, 0.48, 0.55, 0.63, 0.71, 0.79, 0.87, 0.93];
const clamp = (value: number) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const distance = (a: Vec3, b: Vec3) => Math.hypot(...a.map((v, i) => v - b[i]!));
const lerp = (a: Vec3, b: Vec3, t: number) => a.map((v, i) => mix(v, b[i]!, t)) as Vec3;
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

/** 每根绳独立保存连续路径，逐圈与回穿动作按弧长展开。 */
class FishermanRoute {
  points: Vec3[] = [];
  lengths: number[] = [];
  marks: number[] = [];
  total = 0;

  add(point: Vec3) {
    const previous = this.points.at(-1);
    const length = previous ? distance(previous, point) : 0;
    if (previous && length < 1e-9) {
      return;
    }
    this.total += length;
    this.points.push(point);
    this.lengths.push(this.total);
  }

  line(point: Vec3) {
    const start = this.points.at(-1)!;
    const count = Math.max(2, Math.ceil(distance(start, point) / 0.015));
    for (let i = 1; i <= count; i++) {
      this.add(lerp(start, point, i / count));
    }
  }

  cubic(b: Vec3, c: Vec3, d: Vec3) {
    const a = this.points.at(-1)!;
    for (let i = 1; i <= 100; i++) {
      const t = i / 100,
        s = 1 - t;
      this.add(
        a.map(
          (v, k) => v * s ** 3 + 3 * b[k]! * s * s * t + 3 * c[k]! * s * t * t + d[k]! * t ** 3,
        ) as Vec3,
      );
    }
  }

  mark() {
    this.marks.push(this.total);
  }

  prefix(amount: number) {
    const length = Math.max(0.3, Math.min(this.total, amount));
    const count = Math.ceil(length / 0.012);
    const result: Vec3[] = [];
    let j = 1;
    for (let i = 0; i <= count; i++) {
      const at = (length * i) / count;
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

/** 接回段占首末圈的部分周长，避免三圈外再多出松弯。 */
function endReturn(half: number, tension: number) {
  const radius = mix(0.38, 0.15, tension),
    pitch = mix(0.22, 0.095, tension);
  const bend = mix(0.18, 0.065, tension),
    handle = mix(0.4, 0.16, tension);
  const returnHandle = mix(0.32, 0.12, tension);
  const path = new FishermanRoute();
  path.add([CORE_CENTER_X, half, -radius]);
  path.cubic(
    [CORE_CENTER_X + handle, half + (handle * pitch) / (TAU * radius), -radius],
    [bend + returnHandle, half + bend, CORE_OFFSET],
    [bend, half + bend, CORE_OFFSET],
  );
  for (let i = 1; i <= 60; i++) {
    const angle = Math.PI / 2 + (Math.PI * i) / 120;
    path.add([bend + bend * Math.cos(angle), half + bend * Math.sin(angle), CORE_OFFSET]);
  }
  return path;
}

/** 本端主段、回穿尾和另一绳主段占三个通道，圈列围住三股。 */
function halfRoute(tension: number, center: number) {
  const path = new FishermanRoute();
  const radius = mix(0.38, 0.15, tension),
    pitch = mix(0.22, 0.095, tension);
  const half = (2.5 * pitch) / 2;
  path.add([0, 3 - center, -CORE_OFFSET]);
  path.line([0, -half, -CORE_OFFSET]);
  path.mark();
  const upper = endReturn(half, tension);
  for (const point of upper.points.slice().reverse().slice(1)) {
    path.add([point[0], -point[1], -point[2]]);
  }
  let done = 0;
  for (const [index, span] of [0.75, 1, 0.75].entries()) {
    const count = Math.ceil(span * 240);
    for (let i = 1; i <= count; i++) {
      const along = done + (span * i) / count,
        angle = Math.PI / 2 + TAU * along;
      path.add([
        CORE_CENTER_X + radius * Math.cos(angle),
        -half + pitch * along,
        radius * Math.sin(angle),
      ]);
    }
    done += span;
    if (index < 2) {
      path.mark();
    }
  }
  for (const point of upper.points.slice(1)) {
    path.add(point);
  }
  path.mark();
  path.line([0, -half - 0.15, CORE_OFFSET]);
  path.cubic(
    [0, -half - 0.4, CORE_OFFSET],
    [0.4, -half - 0.55, CORE_OFFSET],
    [0.55, -half - 0.8, CORE_OFFSET],
  );
  path.mark();
  return path;
}

/** 两条主段平行，回穿股位于第三个通道；另一半整体反向放置。 */
function toWorld([x, y, z]: Vec3, center: number): Vec3 {
  return [
    CORE_OFFSET / 2 + (Math.sqrt(3) / 2) * x - 0.5 * z,
    y + center,
    (Math.sqrt(3) * CORE_OFFSET) / 2 + 0.5 * x + (Math.sqrt(3) / 2) * z,
  ];
}

/** 两根绳各保留固定长度，旁置余绳与真实主端相连。 */
function supply(body: Vec3[], reverse: boolean) {
  const path = new FishermanRoute(),
    pitch = 0.13 / TAU;
  path.add([-1.2, 3.8, 0]);
  path.cubic([-1.2, 3.48, (0.32 * pitch) / 0.6], [0.05, 3.3, 0], [0.05, 3, 0]);
  for (const point of body.slice(1)) {
    path.add(point);
  }
  const remaining = 18 - path.total;
  const count = Math.max(24, Math.ceil(remaining / 0.012));
  let angle = remaining / Math.hypot(0.6, pitch);
  for (let i = 0; i < 5; i++) {
    const q = angle / count;
    const segment = Math.hypot(1.2 * Math.sin(q / 2), pitch * q);
    angle -= (count * segment - remaining) / ((0.36 * Math.sin(q) + pitch * pitch * q) / segment);
  }
  const points: Vec3[] = [];
  for (let i = 0; i <= count; i++) {
    const theta = -angle + (angle * i) / count;
    points.push([-1.8 + 0.6 * Math.cos(theta), 3.8 - 0.6 * Math.sin(theta), pitch * theta]);
  }
  points.push(...path.points.slice(1));
  return reverse ? points.map(([x, y, z]): Vec3 => [-x, -y, z]) : points;
}

/** 先分别收紧两半，最后才拉主段把两半移到相接的位置。 */
function ropeState(p: number, second: boolean) {
  const tension = second ? ease((p - 0.87) / 0.06) : ease((p - 0.48) / 0.07);
  const center = -mix(1, 0.211, ease((p - 0.93) / 0.07));
  const route = halfRoute(tension, center);
  let amount: number;
  if (p <= 0.12) {
    amount = mix(0.3, route.marks[0]!, ease(p / 0.12));
  } else if (second && p < 0.55) {
    amount = route.marks[0]!;
  } else {
    const times = second ? [0.55, 0.63, 0.71, 0.79, 0.87] : [0.12, 0.21, 0.3, 0.39, 0.48];
    let index = 0;
    while (index < times.length - 2 && p >= times[index + 1]!) {
      index++;
    }
    amount =
      p >= times.at(-1)!
        ? route.total
        : mix(
            route.marks[index]!,
            route.marks[index + 1]!,
            ease((p - times[index]!) / (times[index + 1]! - times[index]!)),
          );
  }
  return supply(
    route.prefix(amount).map((point) => toWorld(point, center)),
    second,
  );
}

function tripleFisherman(progress: number): LessonState {
  const p = clamp(progress),
    first = ropeState(p, false),
    second = ropeState(p, true);
  let checkpoint = 0;
  for (let i = 0; i < TIMES.length; i++) {
    if (p >= TIMES[i]!) {
      checkpoint = i;
    }
  }
  return {
    points: first,
    radius: RADIUS,
    tip: first.at(-1)!,
    checkpoint,
    color: '#528f91',
    endCaps: { start: '1B', end: '1A' },
    strands: [
      {
        id: 'rope-b',
        points: second,
        radius: RADIUS,
        color: '#9566a3',
        endCaps: { start: '2B', end: '2A' },
      },
    ],
  };
}

export const TRIPLE_FISHERMAN_COURSE: Course = {
  id: 'reference-triple-fisherman',
  category: 'knots',
  name: '三重渔人结',
  title: '三重渔人结 · 先收紧两半，再拉合结芯',
  description: '两根绳反向平行，分别围着对方主段打三重反手结，先单独收紧，再拉合。',
  material: '两根同粗的柔软圆绳',
  materialNote: '青色1A、1B与紫色2A、2B分别对应两根绳的真实端头，旁置圈保留各自的备用绳量。',
  duration: 78,
  initialProgress: 0.39,
  frameWholeProcess: true,
  projectionBounds: { minX: -0.65, maxX: 0.65, minY: -0.75, maxY: 0.75 },
  steps: [
    ['反向并排两根绳', '把青、紫两根绳的主段反向平行放置，认清四个真实端头。'],
    ['青色工作端绕第一圈', '青色1A围着对方主段绕出第一圈，保留与自身主段并排的通道。'],
    ['青色工作端绕第二圈', '沿相同方向再绕一圈，新圈排在第一圈旁边。'],
    ['青色工作端绕第三圈', '继续同向完成第三圈，把工作端带回圈列上方。'],
    ['青色工作端回穿三圈', '把1A沿共同通道回穿全部三圈，再从结体外侧引出，留出清楚的尾段。'],
    ['先收紧青色半结', '单独排齐青色圈列并收紧；紫色主段仍从青色结芯内部通过。'],
    ['紫色工作端绕第一圈', '紫色2A在另一侧围着青色主段绕出第一圈，与已完成的青色半结反向放置。'],
    ['紫色工作端绕第二圈', '继续沿紫色半结原来的方向绕第二圈，保持两根主段的位置。'],
    ['紫色工作端绕第三圈', '完成紫色第三圈，保留贯穿圈心的回穿通道。'],
    ['紫色工作端回穿三圈', '把2A回穿全部三圈，从紫色结体外侧引出；不要从两圈之间钻出。'],
    ['单独收紧紫色半结', '排齐并收紧紫色圈列，先确认两半各自成形。'],
    ['拉主段使两半相接', '向两侧拉两条主段，让两个三重反手结相向滑动并相接，核对圈列与四个端头。'],
  ].map(([title, instruction], i) => ({
    time: TIMES[i]!,
    title: title!,
    instruction: instruction!,
  })),
  source: 'https://knots3d.com/zh-CN/%E4%B8%89%E9%87%8D%E6%B8%94%E4%BA%BA%E7%BB%93',
  sourceName: "Knots 3D · Triple Fisherman's Knot",
  application: {
    scenarios: ['fishing', 'outdoors', 'climbing', 'rescue'],
    task: '认识两根绳以两组三重反手结相接的结构。',
    focus: '两侧各三圈回穿、分别收紧与相向拉合',
    boundary: '仅作桌面结构教学，不据此判断绳材、绳尾长度或实际承载是否适合攀登与救援。',
  },
  getState: tripleFisherman,
};
