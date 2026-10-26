import type { Course, LessonState, Vec3 } from './types';

const ROPE = 0.045;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const distance = (a: Vec3, b: Vec3) => Math.hypot(...a.map((v, i) => v - b[i]!));
const add = (a: Vec3, b: Vec3, scale = 1) => a.map((v, i) => v + scale * b[i]!) as Vec3;
const lerp = (a: Vec3, b: Vec3, t: number) => a.map((v, i) => mix(v, b[i]!, t)) as Vec3;
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

/** 保留曲线的连接切线，避免翻圈时在柱前形成急折。 */
class PilePath {
  points: Vec3[] = [];
  cubic(b: Vec3, c: Vec3, d: Vec3) {
    const a = this.points.at(-1)!;
    for (let i = 1; i <= 100; i++) {
      const t = i / 100,
        s = 1 - t;
      this.points.push(
        a.map(
          (v, k) => v * s ** 3 + 3 * b[k]! * s * s * t + 3 * c[k]! * s * t * t + d[k]! * t ** 3,
        ) as Vec3,
      );
    }
  }
}

/** 按弧长对齐两个形态，避免连接段采样密度不同产生假折角。 */
function resample(input: Vec3[], count = 400) {
  const points = input.filter((point, i) => i === 0 || distance(point, input[i - 1]!) > 1e-8);
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths.at(-1)! + distance(points[i - 1]!, points[i]!));
  }
  let j = 1;
  return Array.from({ length: count + 1 }, (_, i) => {
    const at = (lengths.at(-1)! * i) / count;
    while (j < points.length - 1 && lengths[j]! < at) {
      j++;
    }
    return lerp(
      points[j - 1]!,
      points[j]!,
      (at - lengths[j - 1]!) / (lengths[j]! - lengths[j - 1]!),
    );
  });
}

/** 双股先绕柱，绳弯始终在两股下方；翻圈只转动绳弯外侧。 */
function wrappedRoute(tight: number, angle: number, rotation: number) {
  const radius = mix(0.72, 0.327, tight);
  const separation = mix(0.3, 0.1, tight);
  const drop = mix(0.5, 0.208, tight) * ease(angle / 5.4);
  const arm = (y: number): Vec3[] =>
    Array.from({ length: 401 }, (_, i) => {
      if (i < 100) {
        return [mix(-1.8, 0, i / 100), y, radius];
      }
      const u = (i - 100) / 300,
        theta = angle * u;
      return [
        radius * Math.sin(theta),
        y - drop * ease((u - 0.55) / 0.45),
        radius * Math.cos(theta),
      ];
    });
  const first = arm(separation / 2),
    second = arm(-separation / 2);
  const path = new PilePath();
  path.points.push(...first);
  const a = first.at(-1)!,
    b = second.at(-1)!;
  const tangent: Vec3 = [Math.cos(angle), 0, -Math.sin(angle)];
  const loop = mix(1.7, 0.327, tight),
    height = mix(0.6, 0.2, tight);
  const front = mix(1.45, 0.6, tight),
    handle = mix(0.7, 0.5, tight);
  const rotate = ([x, y, z]: Vec3): Vec3 => [
    x,
    -0.8 + (y + 0.8) * Math.cos(rotation) - (z - 0.72) * Math.sin(rotation),
    0.72 + (y + 0.8) * Math.sin(rotation) + (z - 0.72) * Math.cos(rotation),
  ];
  path.cubic(add(a, tangent, handle), rotate([-loop, height, front]), rotate([-loop, height, 0]));
  for (let i = 1; i <= 200; i++) {
    const theta = -Math.PI / 2 - (Math.PI * i) / 200;
    path.points.push(rotate([loop * Math.sin(theta), height, loop * Math.cos(theta)]));
  }
  path.cubic(rotate([loop, height, front]), add(b, tangent, handle), b);
  path.points.push(...second.slice(0, -1).reverse());
  return path.points;
}

/** 旁置备用圈提供翻圈余量，收紧后仍保留完整绳长。 */
function supply(formed: Vec3[]) {
  const anchor = formed[0]!;
  const connection = new PilePath();
  const exit: Vec3 = [anchor[0] - 0.9, anchor[1], anchor[2]];
  connection.points.push(exit);
  connection.cubic(
    [exit[0] + 0.3, exit[1] + 0.012, exit[2]],
    [anchor[0] - 0.3, anchor[1], anchor[2]],
    anchor,
  );
  connection.points.push(...formed.slice(1));
  const used = connection.points
    .slice(1)
    .reduce((sum, point, i) => sum + distance(connection.points[i]!, point), 0);
  const remaining = 26 - used,
    radius = 0.6,
    pitch = 0.14 / (2 * Math.PI);
  const count = Math.max(24, Math.ceil(remaining / 0.012));
  let angle = remaining / Math.hypot(radius, pitch);
  for (let i = 0; i < 5; i++) {
    const q = angle / count;
    const segment = Math.hypot(2 * radius * Math.sin(q / 2), pitch * q);
    angle -=
      (count * segment - remaining) /
      ((radius * radius * Math.sin(q) + pitch * pitch * q) / segment);
  }
  const points: Vec3[] = Array.from({ length: count + 1 }, (_, i) => {
    const theta = angle * (i / count - 1);
    return [
      exit[0] + radius * Math.sin(theta),
      exit[1] + pitch * theta,
      exit[2] + radius * (Math.cos(theta) - 1),
    ];
  });
  points.push(...connection.points.slice(1));
  return points.filter((point, i) => i === 0 || distance(point, points[i - 1]!) > 1e-8);
}

const TIMES = [0, 0.12, 0.4, 0.48, 0.64, 0.82];

/** 保持两端在圈外，以整段绳弯翻过开放柱顶。 */
function pileState(progress: number): LessonState {
  const p = clamp(progress),
    tight = ease((p - 0.82) / 0.18);
  const grow = ease((p - 0.48) / 0.16),
    push = ease((p - 0.4) / 0.08);
  const angle = 5.4 * ease(p / 0.4),
    rotation = (Math.PI / 2) * (1 - ease((p - 0.64) / 0.18));
  const route = wrappedRoute(tight, angle, rotation);
  const target = resample(route.slice(400, 801));
  const a = route[400]!,
    b = route[800]!,
    radius = (a[1] - b[1]) / 2;
  const direction: Vec3 = [Math.cos(angle), 0, -Math.sin(angle)];
  const small: Vec3[] = [];
  for (let i = 0; i <= 100; i++) {
    small.push(add(a, direction, (0.9 * push * i) / 100));
  }
  const center: Vec3 = [
    a[0] + direction[0] * 0.9 * push,
    (a[1] + b[1]) / 2,
    a[2] + direction[2] * 0.9 * push,
  ];
  for (let i = 1; i <= 200; i++) {
    const theta = (Math.PI * i) / 200;
    small.push(
      add(add(center, direction, radius * Math.sin(theta)), [0, radius * Math.cos(theta), 0]),
    );
  }
  for (let i = 1; i <= 100; i++) {
    small.push(add(b, direction, 0.9 * push * (1 - i / 100)));
  }
  route.splice(400, 401, ...resample(small).map((point, i) => lerp(point, target[i]!, grow)));
  const points = supply(route);
  let checkpoint = 0;
  for (let i = 0; i < TIMES.length; i++) {
    if (p >= TIMES[i]!) {
      checkpoint = i;
    }
  }
  return {
    points,
    radius: ROPE,
    tip: points.at(-1)!,
    checkpoint,
    color: '#638c91',
    endCaps: { start: '1A', end: '1B' },
    supports: [
      {
        id: 'pile',
        kind: 'cylinder',
        axis: [0, 1, 0],
        position: [0, 0, 0],
        radius: 0.28,
        length: 2.4,
        color: '#aaa9a3',
      },
    ],
  };
}

export const PILE_HITCH_COURSE: Course = {
  id: 'reference-pile-hitch',
  category: 'knots',
  name: '桩结',
  title: '桩结 · 双股绕柱，再翻过柱顶',
  description: '用绳中折弯绕过立柱，把整个绳弯提过开放柱顶，最后同时整理两条绳腿。',
  material: '一根软绳 + 顶端开放的圆柱',
  materialNote: '用桌面圆杆练习。两个真实绳端都留在圈外，左侧备用圈提供翻圈余量。',
  duration: 44,
  initialProgress: 0.48,
  frameWholeProcess: true,
  steps: [
    ['对折后开始绕柱', '取绳中一个绳弯，让两股并排从柱前绕向侧面；两端始终留在外面。'],
    ['双股绕到柱前', '继续绕过柱后，把绳弯带回柱前，并从原来的两条绳腿下方引出。'],
    ['留出翻转空间', '把下方绳弯向前拉开，给接下来的提圈留出空间。'],
    ['向上提起绳弯', '展开绳弯，从柱前提到高于柱顶的位置，注意绕开的两条绳腿。'],
    ['翻过开放柱顶', '把整个绳弯翻过柱顶，落到柱后；不让绳端穿圈，也不横穿柱体。'],
    ['整理并拉紧两股', '同时拉紧两条绳腿，让绕柱段贴住柱面，整理前方骑跨并检查上下关系。'],
  ].map(([title, instruction], i) => ({
    time: TIMES[i]!,
    title: title!,
    instruction: instruction!,
  })),
  source: 'https://knots3d.com/zh-CN/%E6%A1%A9%E7%BB%93',
  sourceName: 'Knots 3D · Pile Hitch · ABOK #1815',
  application: {
    scenarios: ['fixing', 'camping', 'outdoors'],
    task: '把绳中一段临时固定在顶端开放的柱子上。',
    focus: '双股绕柱、完整翻圈与贴柱收紧',
    boundary: '本课作桌面结构练习，不能直接据此判断实际系泊或承重条件。',
  },
  projectionBounds: { minX: -0.85, maxX: 0.85, minY: -0.6, maxY: 0.55 },
  getState: pileState,
};
