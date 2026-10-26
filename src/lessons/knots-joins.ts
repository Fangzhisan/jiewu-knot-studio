import type { Course, LessonState, LessonStep, Vec3 } from './types';
import { SINGLE_FISHERMAN_COURSE } from './knots-reference-single-fisherman';

// 两根绳分别沿预先编排的路线穿绕，再连续收紧。
// 每一帧只取决于当前进度，不带上一次模拟留下的状态。
const RADIUS = 0.06;
/** 步骤起点，末尾的 1 用于计算最后一步时长。 */
const TIMES = [0, 0.14, 0.38, 0.62, 0.82, 1] as const;
/** 限制进度范围，无效值回到起点。 */
const clamp = (v: number) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));

/** 用平滑缓动衔接动作。 */
const ease = (v: number) => {
  const t = clamp(v);

  return t * t * (3 - 2 * t);
};

/** 按比例插值。 */
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
/** 插值三维位置。 */
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => a.map((v, i) => mix(v, b[i]!, t)) as Vec3;
/** 计算两点距离。 */
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
/** 绳路与弧长；marks 保存教学分界。 */
type Path = { points: Vec3[]; lengths: number[]; total: number; marks: number[] };

/** 计算路径弧长，保留教学分界。 */
function pathOf(points: Vec3[], marks: number[] = []): Path {
  const lengths = [0];

  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths[i - 1]! + distance(points[i - 1]!, points[i]!));
  }

  return { points, lengths, total: lengths.at(-1)!, marks };
}

/** 平滑控制点，并记录各段弧长。 */
function spline(controls: Vec3[], transform: (p: Vec3) => Vec3 = (p) => p): Path {
  const first = controls[0]!,
    last = controls.at(-1)!;

  const padded = [first, first, ...controls, last, last];
  const points: Vec3[] = [transform([...first])],
    marks: number[] = [];

  let arc = 0;

  for (let span = 0; span < padded.length - 3; span++) {
    for (let i = 1; i <= 36; i++) {
      const t = i / 36,
        t2 = t * t,
        t3 = t2 * t;

      const w = [
        (1 - t) ** 3 / 6,
        (4 - 6 * t2 + 3 * t3) / 6,
        (1 + 3 * t + 3 * t2 - 3 * t3) / 6,
        t3 / 6,
      ];

      const point = transform(
        [0, 1, 2].map((a) =>
          w.reduce((sum, weight, k) => sum + padded[span + k]![a]! * weight, 0),
        ) as Vec3,
      );

      const step = distance(points.at(-1)!, point);

      if (step > 1e-10) {
        points.push(point);
        arc += step;
      }
    }

    marks.push(arc);
  }

  return pathOf(points, marks);
}

/** 按弧长二分定位，再插值取点。 */
function at(path: Path, offset: number): Vec3 {
  const s = Math.max(0, Math.min(path.total, offset));
  let left = 1,
    right = path.points.length - 1;

  while (left < right) {
    const middle = (left + right) >> 1;

    if (path.lengths[middle]! < s) {
      left = middle + 1;
    } else {
      right = middle;
    }
  }

  return lerp(
    path.points[left - 1]!,
    path.points[left]!,
    (s - path.lengths[left - 1]!) / (path.lengths[left]! - path.lengths[left - 1]! || 1),
  );
}

/** 按弧长截取并均匀采样可见绳段。 */
function prefix(path: Path, amount: number): Vec3[] {
  const length = Math.max(0.25, Math.min(path.total, amount)),
    divisions = Math.max(16, Math.ceil(length / 0.018));

  return Array.from({ length: divisions + 1 }, (_, i) => at(path, (length * i) / divisions));
}

/** 查找当前步骤。 */
function stepAt(p: number) {
  for (let i = 4; i >= 0; i--) {
    if (p >= TIMES[i]!) {
      return i;
    }
  }

  return 0;
}

/** 配好每一步的时间和说明。 */
function makeSteps(titles: string[], text: string[]): LessonStep[] {
  return titles.map((title, i) => ({ time: TIMES[i]!, title, instruction: text[i]! }));
}

/** 按步骤分界推进可见绳长。 */
function revealed(p: number, cuts: number[]) {
  const i = stepAt(p);

  return mix(cuts[i]!, cuts[i + 1]!, ease((p - TIMES[i]!) / (TIMES[i + 1]! - TIMES[i]!)));
}

/** 单编结松开坐标：蓝色绳弯在前，红色工作绳在后。 */
const SHEET_LOOSE: Vec3[][] = [
  [
    [-2.7, 0.0, 0.0],
    [-2.1, 0.0, 0.288],
    [-1.98, -0.11, 0.288],
    [-0.88, -0.264, 0.16],
    [0.11, -0.726, -0.288],
    [0.968, -0.858, -0.288],
    [1.716, -0.638, 0.288],
    [2.09, -0.176, 0.288],
    [2.024, 0.462, 0.288],
    [1.694, 0.858, 0.288],
    [1.232, 0.99, -0.4],
    [0.726, 0.902, -0.4],
    [-0.022, 0.528, -0.4],
    [-0.88, 0.594, 0.288],
    [-1.87, 0.902, 0.288],
    [-2.1, 1.3, 0.288],
    [-2.4, 1.6, 0.0],
  ],
  [
    [2.7, 0.0, 0.0],
    [2.55, 0.0, -0.288],
    [2.42, 0.0, -0.288],
    [1.628, 0.0, -0.288],
    [1.078, 0.308, 0.24],
    [0.484, 0.748, 0.384],
    [-0.154, 1.166, 0.384],
    [-0.748, 1.232, 0.16],
    [-1.21, 1.034, -0.288],
    [-1.54, 0.594, -0.288],
    [-1.562, -0.022, -0.288],
    [-1.32, -0.572, 0.24],
    [-0.858, -0.836, 0.288],
    [-0.33, -0.682, 0.288],
    [0.022, -0.264, 0.24],
    [0.286, 0.286, 0.0],
    [0.572, 1.034, -0.032],
    [0.88, 1.9, -0.032],
    [1.25, 2.2, -0.032],
    [1.5, 2.5, 0.0],
  ],
];

/** 单编结收紧坐标，与松开状态逐点对应。 */
const SHEET_TIGHT: Vec3[][] = [
  [
    [-2.7, 0.0, 0.0],
    [-1.2, 0.0, 0.0],
    [-0.8558823, 0.0357524, 0.045698],
    [-0.2434948, 0.125959, 0.10601],
    [8.98e-5, 0.0812835, -0.06463],
    [0.212312, -0.0254417, 0.0910957],
    [0.3130551, 0.0510957, 0.1111176],
    [0.3354871, 0.0986918, 0.0975591],
    [0.3499766, 0.1362949, 0.0844889],
    [0.3396911, 0.1908275, 0.0454458],
    [0.3038792, 0.2269977, -0.0273634],
    [0.2017001, 0.2095508, -0.0775167],
    [0.0417447, 0.1962321, -0.1003291],
    [-0.2191511, 0.2419103, 0.1329515],
    [-0.8549761, 0.3268829, 0.0461153],
    [-1.3286133, 0.4012336, 0.0833126],
    [-2.7, 0.45, 0.0],
  ],
  [
    [2.7, 0.0, 0.0],
    [1.2, 0.0, 0.0],
    [1.1079923, 0.0329312, -0.0464238],
    [0.6048835, 0.0627346, -0.0021296],
    [0.2023249, 0.0673049, -0.0717457],
    [0.208953, 0.2232252, 0.2232839],
    [-0.011264, 0.3523993, 0.1052413],
    [-0.1224688, 0.3516366, -0.0798721],
    [-0.1824925, 0.201233, -0.099042],
    [-0.1872771, 0.143332, -0.0889783],
    [-0.199189, 0.0604765, -0.0889513],
    [-0.1824146, 0.0006558, -0.046125],
    [-0.1583413, -0.0227811, -0.0052105],
    [-0.1058015, -0.0385183, 0.0714545],
    [0.0088119, 0.0782527, 0.1523691],
    [0.0904617, 0.2458328, 0.0074355],
    [0.3257742, 0.3681812, 0.0501105],
    [0.5634913, 0.3920073, 0.0174106],
    [0.736516, 0.5015113, 0.0142275],
    [2.7, 0.45, 0.0],
  ],
];

const sheetLoose = SHEET_LOOSE.map((controls) => spline(controls));

/** 展开单编结的两根绳，再一起收紧。 */
function sheetState(progress: number): LessonState {
  const p = clamp(progress),
    tension = ease((p - 0.82) / 0.18);

  const paths =
    tension > 0
      ? SHEET_LOOSE.map((controls, cord) =>
          spline(controls.map((point, i) => lerp(point, SHEET_TIGHT[cord]![i]!, tension))),
        )
      : sheetLoose;

  const visible = paths.map((path, cord) => {
    const loose = sheetLoose[cord]!;
    const cuts =
      cord === 0
        ? [0.55, loose.total, loose.total, loose.total, loose.total, loose.total]
        : [0.55, loose.marks[2]!, loose.marks[7]!, loose.marks[15]!, loose.total, loose.total];

    return prefix(path, tension > 0 ? path.total : revealed(p, cuts));
  });

  return pairedState(visible, p);
}

/** 合并蓝、红两根绳的画面。 */
function pairedState(visible: Vec3[][], p: number): LessonState {
  const points = visible[0]!;

  return {
    points,
    tip: [...points.at(-1)!],
    checkpoint: stepAt(p),
    radius: RADIUS,
    color: '#4d7798',
    endCaps: { start: '1B', end: '1A' },
    strands: [
      {
        id: 'join-red',
        points: visible[1]!,
        color: '#b76554',
        radius: RADIUS,
        label: '红绳',
        endCaps: { start: '2B', end: '2A' },
      },
    ],
  };
}

export const JOINT_KNOT_COURSES: Course[] = [
  /** 单编结先摆蓝色绳弯，再让红绳绕双股并压回自身下方。 */
  {
    id: 'sheet-bend',
    category: 'knots',
    name: '单编结',
    title: '穿入绳弯，绕过双股，再压到自身下方',
    description: '蓝绳形成一个绳弯，红绳绕过两股后扣住自身；最后检查两个工作端位于结的同一侧。',
    material: '两根圆绳',
    materialNote: '本课用等径绳辨认结构。若绳子粗细不同，应由较粗的绳形成绳弯。仅作工艺结构教学。',
    duration: 30,
    initialProgress: 0.62,
    steps: makeSteps(
      ['折出蓝色绳弯', '红绳穿入绳弯', '绕过蓝绳两股', '压到红绳自身下方', '拉紧单编结'],
      [
        '沿蓝绳 1A 折出绳弯；红绳 2A 是接下来穿绕的工作端。保持两股蓝绳清楚可见。',
        '让红色工作端从蓝色绳弯内穿入，留出足够的绳尾。',
        '依次从蓝绳的绳尾与固定段后方绕过，把两股一起圈住。',
        '把红色工作端压到红绳自身下方穿出，不再穿回蓝色绳弯。',
        '向外轻拉并整理四个绳段，让圈口贴合。蓝、红两个工作端应位于结的同一侧。',
      ],
    ),
    source: 'https://www.animatedknots.com/sheet-bend-knot',
    sourceName: 'Animated Knots · Sheet Bend',
    getState: sheetState,
  },
  SINGLE_FISHERMAN_COURSE,
];
