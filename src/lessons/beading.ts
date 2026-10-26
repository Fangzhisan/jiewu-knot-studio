import type { Course, LessonBead, LessonState, LessonStep, Vec3 } from './types';

/** 原创教学几何，不计算张力。珠子先分开放在虚拟支架上，让每次穿孔都看得清，最后一章再收拢；珠子半径和线粗始终不变。
 * 中心线由珠孔内直线、五次曲线连接段和孔口圆弯组成，请直接使用，不要重新拟合样条。
 * 工艺来源见各课程资料。这里只教针法样片，不包含装扣和首饰收尾结。 */
const BLUE = '#477eae';
const COPPER = '#b97a4b';
const THREAD_RADIUS = 0.018;
const GATHER_START = 0.82;
const X: Vec3 = [1, 0, 0];
const Y: Vec3 = [0, 1, 0];
// 把进度限制在 0～1。
const clamp = (value: number) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

// 让动作起停更平缓。
const ease = (value: number) => {
  const t = clamp(value);

  return t * t * (3 - 2 * t);
};

// 换算最后一章的收紧程度。
const gather = (progress: number) => ease((clamp(progress) - GATHER_START) / (1 - GATHER_START));
// 复制坐标，不改原数组。
const copy = (p: Vec3): Vec3 => [p[0], p[1], p[2]];
// 沿给定方向平移。
const add = (a: Vec3, b: Vec3, amount = 1): Vec3 => [
  a[0] + b[0] * amount,
  a[1] + b[1] * amount,
  a[2] + b[2] * amount,
];

// 在两值之间插值。
const mix = (a: Vec3, b: Vec3, t: number): Vec3 => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

// 计算两点间的直线距离。
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
// 用点积判断方向是否一致。
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
// 创建一颗带孔轴的珠子。
const bead = (
  id: string,
  position: Vec3,
  axis: Vec3,
  radius: number,
  color: string,
  label: string,
): LessonBead => ({ id, position, axis, radius, color, label, active: false });

/* 按珠子半径算出真实孔口，并给转弯留出线粗的余量。 */
function mouth(bead: LessonBead) {
  // 孔口沿用 scene.ts 的打孔球体轮廓。向外多留一点空间，线的表面就能先离开孔沿，再开始转弯。
  const hole = Math.max(0.055, Math.min(0.12, bead.radius * 0.36));

  return Math.sqrt(bead.radius ** 2 - hole ** 2) + 0.022;
}

/* 一次真实穿孔的珠子标识与线长区间。 */
interface Passage {
  beadId: string;
  from: number;
  to: number;
}
/* 完整路线以及按长度显示、高亮所需的记录。 */
interface Path {
  points: Vec3[];
  distances: number[];
  length: number;
  passages: Passage[];
}

/* 记录连续走线、穿孔和累计长度。 */
class ThreadPath {
  readonly points: Vec3[];
  readonly distances = [0];
  readonly passages: Passage[] = [];
  length = 0;
  tangent: Vec3;

  /* 从起点和初始方向开始记录路线。 */
  constructor(
    start: Vec3,
    tangent: Vec3,
    private readonly maxHandle = 0.16,
  ) {
    this.points = [copy(start)];
    this.tangent = copy(tangent);
  }
  /* 追加采样点并累计线长。 */
  private push(point: Vec3) {
    const span = distance(this.points[this.points.length - 1]!, point);

    if (span < 1e-10) {
      return;
    }

    this.length += span;
    this.points.push(point);
    this.distances.push(this.length);
  }
  /* 沿直线补足采样点。 */
  line(end: Vec3) {
    const start = this.points[this.points.length - 1]!;
    const count = Math.max(1, Math.ceil(distance(start, end) / 0.018));

    for (let i = 1; i <= count; i++) {
      this.push(mix(start, end, i / count));
    }
  }
  /* 平滑连接孔口，保持两端切线一致。 */
  connect(end: Vec3, endAxis: Vec3) {
    const start = this.points[this.points.length - 1]!;
    const span = distance(start, end);

    if (span < 1e-8) {
      this.tangent = copy(endAxis);

      return;
    }

    const chord: Vec3 = [end[0] - start[0], end[1] - start[1], end[2] - start[2]];
    let handle = Math.min(this.maxHandle, span * 0.23);

    // 两端切线接近平行的斜向连接，要把控制柄留在前方的空隙里，免得孔口冒出一个反向小卷。
    if (dot(this.tangent, endAxis) > 0.95 && dot(chord, endAxis) > 0) {
      handle = Math.min(handle, dot(chord, endAxis) * 0.22);
    }

    const controls = [
      start,
      add(start, this.tangent, handle),
      add(start, this.tangent, handle * 2),
      add(end, endAxis, -handle * 2),
      add(end, endAxis, -handle),
      end,
    ];

    const count = Math.max(36, Math.ceil((span + handle * 4) / 0.014));

    for (let i = 1; i <= count; i++) {
      const t = i / count,
        u = 1 - t;

      const weights = [
        u ** 5,
        5 * u ** 4 * t,
        10 * u ** 3 * t ** 2,
        10 * u ** 2 * t ** 3,
        5 * u * t ** 4,
        t ** 5,
      ];

      this.push(
        [0, 1, 2].map((axis) =>
          controls.reduce((sum, point, index) => sum + point[axis]! * weights[index]!, 0),
        ) as Vec3,
      );
    }

    this.tangent = copy(endAxis);
  }
  /* 用两段四分之一圆弧和中间直线完成回头弯。 */
  uTurn(end: Vec3, endAxis: Vec3, corridorX: number) {
    const start = this.points[this.points.length - 1]!,
      side = this.tangent[0],
      direction = Math.sign(end[1] - start[1]);

    const radius = Math.abs(corridorX - start[0]),
      span = Math.abs(end[1] - start[1]),
      total = Math.PI * radius + span - 2 * radius;

    // 沿弯道长度平滑切换深度。
    const push = (x: number, y: number, length: number) =>
      this.push([x, y, start[2] + (end[2] - start[2]) * ease(length / total)]);

    const arcSteps = Math.max(16, Math.ceil((Math.PI * radius) / 0.016));

    for (let i = 1; i <= arcSteps; i++) {
      const angle = (Math.PI * 0.5 * i) / arcSteps;
      push(
        start[0] + side * radius * Math.sin(angle),
        start[1] + direction * radius * (1 - Math.cos(angle)),
        radius * angle,
      );
    }

    const middle = span - 2 * radius,
      middleSteps = Math.max(1, Math.ceil(middle / 0.014));

    for (let i = 1; i <= middleSteps; i++) {
      push(
        corridorX,
        start[1] + direction * (radius + (middle * i) / middleSteps),
        Math.PI * radius * 0.5 + (middle * i) / middleSteps,
      );
    }

    for (let i = 1; i <= arcSteps; i++) {
      const angle = (Math.PI * 0.5 * i) / arcSteps;
      push(
        end[0] + side * radius * Math.cos(angle),
        end[1] - direction * radius * (1 - Math.sin(angle)),
        Math.PI * radius * 0.5 + middle + radius * angle,
      );
    }

    this.tangent = copy(endAxis);
  }
  /* 把连接线抬到珠片前后方，再转回下一个珠孔。 */
  liftedBridge(end: Vec3, endAxis: Vec3, side: number) {
    // 密排的佩约特珠片要从前后珠缝离开珠孔。转弯从空的孔内开始，不能从实心孔沿里拐出去。
    const start = copy(this.points[this.points.length - 1]!),
      startAxis = copy(this.tangent),
      radius = 0.04,
      height = side * 0.18;

    for (let i = 1; i <= 16; i++) {
      const angle = (Math.PI * 0.5 * i) / 16;
      this.push([
        start[0] + startAxis[0] * radius * Math.sin(angle),
        start[1],
        start[2] + side * radius * (1 - Math.cos(angle)),
      ]);
    }

    this.line([start[0] + startAxis[0] * radius, start[1], height]);
    this.tangent = [0, 0, side];
    this.connect([end[0] - endAxis[0] * radius, end[1], height], [0, 0, -side]);
    this.line([end[0] - endAxis[0] * radius, end[1], end[2] + side * radius]);

    for (let i = 1; i <= 16; i++) {
      const angle = (Math.PI * 0.5 * i) / 16;
      this.push([
        end[0] - endAxis[0] * radius * Math.cos(angle),
        end[1],
        end[2] + side * radius * (1 - Math.sin(angle)),
      ]);
    }

    this.tangent = copy(endAxis);
  }
  /* 穿过珠孔，记下这趟线长。 */
  visit(item: LessonBead, direction = 1, lane = 0, halfLength = mouth(item), lifted = false) {
    const axis = item.axis.map((value) => value * direction) as Vec3;
    const center = add(item.position, [0, 0, 1], lane);
    const entry = add(center, axis, -halfLength);

    if (lifted) {
      this.liftedBridge(entry, axis, lane < 0 ? -1 : 1);
    } else {
      this.connect(entry, axis);
    }

    const from = this.length;
    this.line(add(center, axis, halfLength));
    this.passages.push({ beadId: item.id, from, to: this.length });
  }
  /* 导出路线和穿孔记录。 */
  finish(): Path {
    return {
      points: this.points,
      distances: this.distances,
      length: this.length,
      passages: this.passages,
    };
  }
}

/* 按线长截取路线，保留准确线尖。 */
function prefix(path: Path, requested: number): Vec3[] {
  const length = Math.max(0, Math.min(path.length, requested));
  const points = [copy(path.points[0]!)];

  for (let i = 1; i < path.points.length; i++) {
    const end = path.distances[i]!;

    if (end <= length + 1e-10) {
      points.push(copy(path.points[i]!));
    } else {
      const previous = path.distances[i - 1]!;

      if (length > previous + 1e-10) {
        points.push(
          mix(path.points[i - 1]!, path.points[i]!, (length - previous) / (end - previous)),
        );
      }

      break;
    }
  }

  return points;
}

/* 在相邻时间节点之间平滑计算已经放出的线长。 */
function atProgress(progress: number, times: readonly number[], lengths: readonly number[]) {
  const p = clamp(progress);

  for (let i = 1; i < times.length; i++) {
    if (p <= times[i]!) {
      return (
        lengths[i - 1]! +
        (lengths[i]! - lengths[i - 1]!) * ease((p - times[i - 1]!) / (times[i]! - times[i - 1]!))
      );
    }
  }

  return lengths[lengths.length - 1]!;
}

/* 找到当前教学步骤。 */
function checkpoint(progress: number, steps: readonly LessonStep[]) {
  let current = 0;

  for (let i = 1; i < steps.length; i++) {
    if (progress >= steps[i]!.time) {
      current = i;
    }
  }

  return current;
}

/* 找出当前线尖正在穿过的珠子，给高亮提供目标。 */
function activeBead(path: Path, length: number) {
  return path.passages.find((passage) => length <= passage.to + 1e-9)?.beadId;
}

/* 复制当前珠阵，并更新高亮与收紧时逐渐淡出的编号。 */
function cloneBeads(
  beads: LessonBead[],
  active: Array<string | undefined>,
  progress: number,
): LessonBead[] {
  const labelOpacity = 1 - gather(progress);

  return beads.map((item) => ({
    ...item,
    position: copy(item.position),
    axis: copy(item.axis),
    active: active.includes(item.id),
    labelOpacity,
  }));
}

/* 把当前线长、珠子高亮和渲染参数组成一帧。 */
function pathState(
  progress: number,
  path: Path,
  beads: LessonBead[],
  times: readonly number[],
  lengths: readonly number[],
  steps: readonly LessonStep[],
  color = COPPER,
): LessonState {
  const p = clamp(progress);
  const length = atProgress(p, times, lengths);
  const points = prefix(path, length);

  return {
    points,
    tip: copy(points[points.length - 1]!),
    checkpoint: checkpoint(p, steps),
    beads: cloneBeads(beads, p < GATHER_START ? [activeBead(path, length)] : [], p),
    color,
    radius: THREAD_RADIUS,
    showEndLabels: false,
    hideMainTip: true,
  };
}

// 教学步骤与路线进度保持对应。
const CROSS_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '分出两个线端',
    instruction: '先把 1 号珠放在线的中点，分出左右两端。蓝色与铜色表示同一根线的两端。',
  },
  {
    time: 0.12,
    title: '各穿一颗边珠',
    instruction: '两端各穿一颗边珠，再朝上方的 4 号共享珠靠拢。',
  },
  {
    time: 0.3,
    title: '相向穿共享珠',
    instruction: '蓝端从左、铜端从右穿过同一个珠孔，方向相反。这样闭合第一个四珠单元。',
  },
  {
    time: 0.48,
    title: '连续延伸单元',
    instruction: '交叉后两端互换左右。再各加一颗边珠、相向穿过共享珠，重复完成第二、第三个单元。',
  },
  {
    time: GATHER_START,
    title: '拉紧交叉珠链',
    instruction:
      '向两侧均匀牵拉工作端，珠子靠拢，三格线桥收短成紧凑菱形链。共享珠孔内的两条线仍保持相反方向。',
  },
];

/* 按收紧量摆出共享珠和左右边珠，保持珠子尺寸不变。 */
function makeCrossBeads(tightness: number) {
  const finalSide = Math.sqrt(0.491 ** 2 - 0.3 ** 2);
  const beads: LessonBead[] = [],
    rowGap = 1.3 - 0.7 * tightness,
    sideX = 0.72 + (finalSide - 0.72) * tightness;

  for (let row = 0; row < 4; row++) {
    beads.push(
      bead(
        `cross-shared-${row}`,
        [0, (row - 1.5) * rowGap, 0],
        X,
        0.26,
        '#e9be78',
        String(row * 3 + 1),
      ),
    );

    if (row < 3) {
      beads.push(
        bead(
          `cross-left-${row}`,
          [-sideX, (row - 1) * rowGap, 0],
          Y,
          0.23,
          '#b8cfdf',
          String(row * 3 + 2),
        ),
      );
      beads.push(
        bead(
          `cross-right-${row}`,
          [sideX, (row - 1) * rowGap, 0],
          Y,
          0.23,
          '#dfc1c6',
          String(row * 3 + 3),
        ),
      );
    }
  }

  return beads;
}

/* 沿交叉珠链安排一侧工作端，并记下各教学节点的线长。 */
function crossPath(beads: LessonBead[], initialSide: number, lane: number, tightness: number) {
  const crossById = new Map(beads.map((item) => [item.id, item]));
  const base = beads[0]!.position;
  const path = new ThreadPath(base, [initialSide, 0, 0]);
  path.line(add(base, [initialSide, 0, 0], 0.34));
  const lengths = [path.length];

  for (let unit = 0; unit < 3; unit++) {
    const side = initialSide * (unit % 2 ? -1 : 1);
    const sideBead = crossById.get(`cross-${side < 0 ? 'left' : 'right'}-${unit}`)!;
    const entry = add(add(sideBead.position, [0, 0, 1], lane), Y, -mouth(sideBead));

    if (unit === 0) {
      path.connect(entry, Y);
      lengths.push(path.length);
    }

    path.visit(sideBead, 1, lane);
    const shared = crossById.get(`cross-shared-${unit + 1}`)!;
    const axis: Vec3 = [-side, 0, 0];
    const sharedEntry = add(add(shared.position, [0, 0, 1], lane), axis, -mouth(shared));
    path.connect(sharedEntry, axis);

    if (unit === 0) {
      lengths.push(path.length);
    }

    path.visit(shared, -side, lane);

    if (unit === 0) {
      lengths.push(path.length);
    }
  }

  const end = path.points[path.points.length - 1]!;
  path.line(add(end, path.tangent, 0.36 + 0.35 * tightness));
  lengths.push(path.length, path.length);

  return { path: path.finish(), lengths };
}

const crossBeads = makeCrossBeads(0);
const crossBlue = crossPath(crossBeads, -1, 0.025, 0);
const crossCopper = crossPath(crossBeads, 1, -0.025, 0);

/* 分别计算蓝端和铜端的路线，让同一根线的两端同步前进。 */
function crossState(progress: number): LessonState {
  const p = clamp(progress),
    tightness = gather(p),
    times = [0, 0.12, 0.3, 0.48, GATHER_START, 1];

  const beads = tightness > 0 ? makeCrossBeads(tightness) : crossBeads;
  const blue = tightness > 0 ? crossPath(beads, -1, 0.025, tightness) : crossBlue;
  const copper = tightness > 0 ? crossPath(beads, 1, -0.025, tightness) : crossCopper;
  const blueLength = atProgress(p, times, blue.lengths);
  const copperLength = atProgress(p, times, copper.lengths);
  const points = prefix(blue.path, blueLength);

  return {
    points,
    tip: copy(points[points.length - 1]!),
    checkpoint: checkpoint(p, CROSS_STEPS),
    beads: cloneBeads(
      beads,
      p < GATHER_START
        ? [activeBead(blue.path, blueLength), activeBead(copper.path, copperLength)]
        : [],
      p,
    ),
    strands: [
      {
        id: 'cross-copper-end',
        points: prefix(copper.path, copperLength),
        color: COPPER,
        radius: THREAD_RADIUS,
        label: '铜',
        endCaps: { start: false, end: '1B' },
      },
    ],
    color: BLUE,
    radius: THREAD_RADIUS,
    showEndLabels: false,
    hideMainTip: true,
    endCaps: { start: false, end: '1A' },
  };
}

// 教学步骤与路线进度保持对应。
const LADDER_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '穿入起始两珠',
    instruction: '先固定线尾，依次穿过 1、2 号珠。两颗珠并排，珠孔方向保持平行。',
  },
  {
    time: 0.12,
    title: '回穿形成一格',
    instruction: '再穿 1 号珠，然后回到 2 号珠。两颗珠被线圈连接，形成第一格。',
  },
  {
    time: 0.28,
    title: '加入第三颗',
    instruction: '穿入 3 号珠，再回穿 2 号珠，最后穿回 3 号珠，让新珠靠在上一颗旁边。',
  },
  {
    time: 0.46,
    title: '逐颗延长梯形',
    instruction: '加入 4、5、6 号珠时，重复“新珠 → 前一珠 → 新珠”。观察上下交替的线桥。',
  },
  {
    time: GATHER_START,
    title: '拉紧基础梯',
    instruction:
      '牵拉线尾并逐格整理，六颗珠子并排靠拢，上下线桥随间距缩短。每相邻两珠仍保留回穿连接。',
  },
];

// 排出梯式底行，收紧时只改变珠间距离。
const makeLadderBeads = (tightness: number) =>
  Array.from({ length: 6 }, (_, i) =>
    bead(
      `ladder-${i + 1}`,
      [(i - 2.5) * (0.8 - 0.239 * tightness), 0, 0],
      Y,
      0.28,
      i % 2 ? '#d9c7e7' : '#e7d9b8',
      String(i + 1),
    ),
  );

/* 按梯式回穿顺序连好底行，并留下各步的线长标记。 */
function makeLadder(tightness: number) {
  const beads = makeLadderBeads(tightness),
    firstX = beads[0]!.position[0];

  const path = new ThreadPath([firstX, -0.72, -0.045], Y);
  path.line([firstX, -0.48, -0.045]);
  const lengths = [path.length],
    visits = Array(6).fill(0) as number[];

  // 穿过珠孔，记下这趟线长。
  const visit = (i: number) => {
    path.visit(beads[i]!, i % 2 ? -1 : 1, [-0.045, 0, 0.045][visits[i]!]!);
    visits[i]!++;
  };

  visit(0);
  visit(1);
  lengths.push(path.length);
  visit(0);
  visit(1);
  lengths.push(path.length);
  visit(2);
  visit(1);
  visit(2);
  lengths.push(path.length);

  for (let i = 3; i <= 5; i++) {
    visit(i);
    visit(i - 1);
    visit(i);
  }

  path.line(add(path.points[path.points.length - 1]!, path.tangent, 0.34 + 0.25 * tightness));
  lengths.push(path.length, path.length);

  return { path: path.finish(), lengths, beads };
}

const ladder = makeLadder(0);

// 教学步骤与路线进度保持对应。
const SQUARE_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '串好第一行',
    instruction: '固定线尾，顺次穿过下方四颗珠。这一行是方形针的底行。',
  },
  {
    time: 0.16,
    title: '上方加入新珠',
    instruction: '从底行末端折返，穿过右上方的 5 号新珠，让它位于底珠正上方。',
  },
  {
    time: 0.32,
    title: '回穿下珠锁定',
    instruction: '回穿它正下方的 4 号珠，再穿一次 5 号珠。闭合的线圈把上下两珠连接。',
  },
  {
    time: 0.48,
    title: '逐格重复回穿',
    instruction: '向左依次加入 6、7、8 号珠。每加一颗，都回穿对应底珠，再穿回新珠。',
  },
  {
    time: GATHER_START,
    title: '拉紧方形网格',
    instruction:
      '逐格拉紧线桥，使行列同时靠拢，两行珠子仍一一上下对齐。线从各自的珠孔内收过，形成整齐的方形样片。',
  },
];

/* 逐颗回穿上一行，生成方形针的完整走线。 */
function makeSquare(tightness: number) {
  const beads: LessonBead[] = [],
    columnGap = 1.05 - 0.5568 * tightness,
    halfRowGap = 0.55 - 0.3034 * tightness;

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 4; col++) {
      beads.push(
        bead(
          `square-${row}-${col}`,
          [(col - 1.5) * columnGap, row ? halfRowGap : -halfRowGap, 0],
          X,
          0.245,
          row ? '#b9d1dc' : '#e6c5b8',
          String(row ? 8 - col : col + 1),
        ),
      );
    }
  }

  const halfBore = mouth(beads[0]!) + (0.212 - mouth(beads[0]!)) * tightness;
  const path = new ThreadPath([-2.4, -halfRowGap - 0.03, 0], X);
  path.line([beads[0]!.position[0] - 0.55, -halfRowGap - 0.03, 0]);

  // 穿过珠孔，记下这趟线长。
  const visit = (
    index: number,
    direction: number,
    yLane: number,
    zEntry: number,
    zExit = zEntry,
    turn = false,
  ) => {
    const item = beads[index]!,
      axis: Vec3 = [direction, 0, 0];

    const connectorBore = mouth(item) + (0.15 - mouth(item)) * tightness;
    const entryHalf = index >= 4 && zEntry < 0 && !turn ? connectorBore : halfBore;
    const exitHalf = index >= 4 && yLane < 0 ? connectorBore : halfBore;
    const entry = add(add(item.position, [0, yLane, zEntry]), axis, -entryHalf);

    if (turn) {
      path.uTurn(entry, axis, item.position[0] - direction * columnGap * 0.5);
    } else {
      path.connect(entry, axis);
    }

    const from = path.length,
      count = Math.ceil((entryHalf + exitHalf) / 0.01);

    // 回穿占用真实珠孔里的另一条通道。下方回程在空孔内改变深度，Y 向偏移始终与原来的底行线分开。
    for (let i = 1; i <= count; i++) {
      const t = i / count,
        point: Vec3 = [
          item.position[0] + direction * (-entryHalf + (entryHalf + exitHalf) * t),
          item.position[1] + yLane,
          zEntry + (zExit - zEntry) * ease(t),
        ];

      const span = distance(path.points.at(-1)!, point);

      if (span > 1e-10) {
        path.length += span;
        path.points.push(point);
        path.distances.push(path.length);
      }
    }

    path.tangent = copy(axis);
    path.passages.push({ beadId: item.id, from, to: path.length });
  };

  const lengths = [path.length];

  for (let i = 0; i < 4; i++) {
    visit(i, 1, -0.03, 0);
  }

  lengths.push(path.length);
  visit(7, -1, 0.03, -0.055, -0.055, true);
  lengths.push(path.length);
  visit(3, 1, 0.03, -0.055, 0.055, true);
  visit(7, -1, -0.03, 0.055, 0.055, true);
  lengths.push(path.length);

  for (let col = 2; col >= 0; col--) {
    visit(4 + col, -1, 0.03, -0.055);
    visit(col, 1, 0.03, -0.055, 0.055, true);
    visit(4 + col, -1, -0.03, 0.055, 0.055, true);
  }

  path.line(add(path.points.at(-1)!, path.tangent, 0.42 + 0.25 * tightness));
  lengths.push(path.length, path.length);

  return { path: path.finish(), lengths, beads };
}

const square = makeSquare(0);

/* 根据进度显示方形针路线，并处理当前穿珠高亮。 */
function squareState(progress: number): LessonState {
  const state = gatheredState(
    progress,
    square,
    makeSquare,
    [0, 0.16, 0.32, 0.48, GATHER_START, 1],
    SQUARE_STEPS,
  );

  // 保留连续且准确的线尖，去掉几乎重合的末端采样环，避免拖动进度时管面朝向突然翻转。
  while (
    state.points.length > 2 &&
    distance(state.points.at(-1)!, state.points.at(-2)!) <
      0.5 * distance(state.points.at(-2)!, state.points.at(-3)!)
  ) {
    state.points.splice(state.points.length - 2, 1);
  }

  return state;
}

// 教学步骤与路线进度保持对应。
const PEYOTE_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '串起六颗底珠',
    instruction:
      '固定线尾，按 1 → 6 串起偶数颗底珠。教学支架预排成高低两行，便于看清“隔一颗”的位置。',
  },
  {
    time: 0.16,
    title: '加一颗，隔一颗',
    instruction: '加上 7 号新珠，跳过 6 号，反向穿过 5 号珠。新珠落在 6 号珠上方。',
  },
  {
    time: 0.38,
    title: '继续隔珠回穿',
    instruction: '加上 8 号珠，跳过 4 号，穿过 3 号珠。每次都只穿高珠，不穿低珠。',
  },
  {
    time: 0.6,
    title: '完成这一行',
    instruction: '加上 9 号珠，跳过 2 号，穿过 1 号珠。三个新增珠分别填入上一行的间隙。',
  },
  {
    time: GATHER_START,
    title: '拉紧错位珠片',
    instruction:
      '沿工作端拉紧线，逐段缩短斜向线桥，三行珠子错位靠拢。保留“加一颗、隔一颗、穿一颗”的孔路，形成砖墙般的样片。',
  },
];

/* 排出错位珠行，再按佩约特针法逐颗穿过突出珠。 */
function makePeyote(tightness: number) {
  const columnGap = 0.8 - 0.5534 * tightness,
    rowGap = 0.72 + (Math.sqrt(3) * 0.2466 - 0.72) * tightness;

  const beads: LessonBead[] = Array.from({ length: 6 }, (_, i) =>
    bead(
      `peyote-${i + 1}`,
      [(i - 2.5) * columnGap, i % 2 ? -rowGap : 0, 0],
      X,
      0.245,
      i % 2 ? '#e8d8b6' : '#c9c0dd',
      String(i + 1),
    ),
  );

  for (let i = 0; i < 3; i++) {
    beads.push(
      bead(
        `peyote-${i + 7}`,
        [(2.5 - i * 2) * columnGap, rowGap, 0],
        X,
        0.245,
        '#b7d2ce',
        String(i + 7),
      ),
    );
  }

  const path = new ThreadPath([-2.65, 0, -0.03], X, 0.07);
  path.line([-2.4, 0, -0.03]);
  const lengths = [path.length];

  for (let i = 0; i < 6; i++) {
    path.visit(beads[i]!, 1, -0.03, 0.2066, i > 0);
  }

  lengths.push(path.length);

  for (let i = 0; i < 3; i++) {
    path.visit(beads[6 + i]!, -1, 0.03, 0.2066, true);
    path.visit(beads[4 - i * 2]!, -1, 0.03, 0.2066, true);

    if (i < 2) {
      lengths.push(path.length);
    }
  }

  path.line(add(path.points[path.points.length - 1]!, path.tangent, 0.38 + 0.2 * tightness));
  lengths.push(path.length, path.length);

  return { path: path.finish(), lengths, beads };
}

const peyote = makePeyote(0);

// 收紧前复用设计好的路径；收紧时，孔内段和连接桥都按同一组移动珠坐标重新计算。
// 不靠整体缩放来收紧，免得珠子尺寸变了，或者线对不上孔。
function gatheredState(
  progress: number,
  loose: ReturnType<typeof makeLadder>,
  build: (tightness: number) => ReturnType<typeof makeLadder>,
  times: readonly number[],
  steps: readonly LessonStep[],
) {
  const tightness = gather(progress),
    model = tightness > 0 ? build(tightness) : loose;

  return pathState(progress, model.path, model.beads, times, model.lengths, steps);
}

// 这组工艺的课程入口。
export const BEADING_COURSES: Course[] = [
  {
    id: 'cross-weave',
    category: 'beads',
    name: '双线交叉串珠',
    title: '双线交叉 · 从四珠单元到珠链',
    description: '用两种线色分辨双端，观察相向穿过共享珠的路线。',
    material: '10 颗珠 + 一根线的两个线端',
    materialNote: '可在同一根线两端各装一枚串珠针。图中蓝、铜两色用于区分两个工作端。',
    duration: 28,
    initialProgress: 0.58,
    steps: CROSS_STEPS,
    source: 'https://www.beadsbaublesandjewels.com/projects/1000_Series/1005/1005-1Mag.pdf',
    sourceName: 'Interweave · Right-angle Bangle 基础双针链',
    getState: crossState,
  },
  {
    id: 'ladder-stitch',
    category: 'beads',
    name: '梯式串珠',
    title: '梯式串珠 · 用回穿连接相邻珠',
    description: '上下交替回穿，把六颗平行珠连接成基础梯。',
    material: '6 颗珠 + 串珠针与线',
    materialNote: '固定线尾后开始。珠子在教学支架上分开放置，线桥与重复穿孔均可观察。',
    duration: 28,
    initialProgress: 0.6,
    steps: LADDER_STEPS,
    source: 'https://beadaholique.com/products/how-to-do-ladder-stitch-bead-weaving',
    sourceName: 'Beadaholique · Ladder Stitch',
    getState: (p) =>
      gatheredState(p, ladder, makeLadder, [0, 0.12, 0.28, 0.46, GATHER_START, 1], LADDER_STEPS),
  },
  {
    id: 'square-stitch',
    category: 'beads',
    name: '方形针串珠',
    title: '方形针 · 把新珠锁在底珠上方',
    description: '逐格回穿上下两颗珠，形成整齐对位的两行网格。',
    material: '8 颗珠 + 串珠针与线',
    materialNote: '两色珠方便区分底行与新增行。实际制作先固定线尾，保持各格张力一致。',
    duration: 30,
    initialProgress: 0.64,
    steps: SQUARE_STEPS,
    source: 'https://beadaholique.com/products/how-to-do-square-stitch-bead-weaving',
    sourceName: 'Beadaholique · Square Stitch',
    getState: squareState,
  },
  {
    id: 'peyote-even',
    category: 'beads',
    name: '偶数佩约特',
    title: '偶数佩约特 · 看懂隔珠与错位',
    description: '从六颗底珠出发，练习加一、隔一、穿一的平面针法。',
    material: '9 颗珠 + 串珠针与线',
    materialNote: '基础串为偶数六珠，再加三珠完成一行。图中用间隙和预排高低行解释孔路。',
    duration: 28,
    initialProgress: 0.67,
    steps: PEYOTE_STEPS,
    source:
      'https://beadaholique.com/products/instructions-for-making-the-beadaholique-peyote-bracelet-kits-with-size-10-beads',
    sourceName: 'Beadaholique · Flat Even-count Peyote',
    getState: (p) =>
      gatheredState(p, peyote, makePeyote, [0, 0.16, 0.38, 0.6, GATHER_START, 1], PEYOTE_STEPS),
  },
];
