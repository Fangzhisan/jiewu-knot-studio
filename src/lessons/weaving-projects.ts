import type { Course, LessonState, LessonStep, LessonSupport, Vec3 } from './types';

// 这些项目使用逐段设计的几何路线。纱线移动时，框架和圆环保持固定；演示停在脱框收尾、打结之前。
const GREEN = '#477264';
const GOLD = '#c4934f';
const CORD_RADIUS = 0.045;
// 把进度限制在 0～1。
const clamp = (value: number) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));

// 让动作起停更平缓。
const ease = (value: number) => {
  const t = clamp(value);

  return t * t * t * (10 - 15 * t + 6 * t * t);
};

// 在两值之间插值。
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
// 复制坐标，不改原数组。
const copy = (point: Vec3): Vec3 => [...point];
// 在两点之间插值。
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => [
  mix(a[0], b[0], t),
  mix(a[1], b[1], t),
  mix(a[2], b[2], t),
];

// 找到当前教学步骤。
const checkpoint = (p: number, steps: readonly LessonStep[]) =>
  steps.reduce((result, step, index) => (p >= step.time ? index : result), 0);

// 沿直线补足采样点。
const line = (a: Vec3, b: Vec3, samples = 30): Vec3[] =>
  Array.from({ length: samples + 1 }, (_, index) => lerp(a, b, index / samples));

/* 量取折线的累计长度，后续就能按实际长度逐步显示。 */
function measured(points: Vec3[]) {
  const lengths = [0];

  for (let index = 1; index < points.length; index++) {
    const a = points[index - 1]!,
      b = points[index]!;

    lengths.push(lengths[index - 1]! + Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]));
  }

  return { points, lengths, total: lengths.at(-1)! };
}

/* 按线长截取路线，保留准确线尖。 */
function prefix(path: ReturnType<typeof measured>, amount: number): Vec3[] {
  const result = [copy(path.points[0]!)];

  for (let index = 1; index < path.points.length; index++) {
    if (path.lengths[index]! <= amount) {
      result.push(copy(path.points[index]!));
    } else {
      const before = path.lengths[index - 1]!;

      if (amount > before) {
        result.push(
          lerp(
            path.points[index - 1]!,
            path.points[index]!,
            (amount - before) / (path.lengths[index]! - before),
          ),
        );
      }

      break;
    }
  }

  return result;
}

// 一根连续的经线绕过上下横杆的前后两面；前后错开半列，避免绕线重叠。打紧纬线时，经线在框上的固定点保持原位。
const WARP_COUNT = 8;
const ROW_COUNT = 12;
const FRAME_HALF_HEIGHT = 1.9;
const FRAME_HALF_WIDTH = 1.5;
const FRAME_RADIUS = 0.12;
const WARP_RADIUS = 0.037;
const WARP_PLANE = FRAME_RADIUS + WARP_RADIUS + 0.005;
// 把经线列号换成框内的横向位置。
const warpX = (column: number) => (column - (WARP_COUNT - 1) / 2) * 0.26;
// 杯垫织框的四根固定横竖杆，打纬时保持原位。
const FRAME: LessonSupport[] = [
  {
    id: 'coaster-frame-top',
    kind: 'cylinder',
    position: [0, FRAME_HALF_HEIGHT, 0],
    axis: [1, 0, 0],
    radius: FRAME_RADIUS,
    length: FRAME_HALF_WIDTH * 2 + 0.24,
    color: '#b4a18a',
  },
  {
    id: 'coaster-frame-bottom',
    kind: 'cylinder',
    position: [0, -FRAME_HALF_HEIGHT, 0],
    axis: [1, 0, 0],
    radius: FRAME_RADIUS,
    length: FRAME_HALF_WIDTH * 2 + 0.24,
    color: '#b4a18a',
  },
  {
    id: 'coaster-frame-left',
    kind: 'cylinder',
    position: [-FRAME_HALF_WIDTH, 0, 0],
    axis: [0, 1, 0],
    radius: FRAME_RADIUS,
    length: FRAME_HALF_HEIGHT * 2,
    color: '#b4a18a',
  },
  {
    id: 'coaster-frame-right',
    kind: 'cylinder',
    position: [FRAME_HALF_WIDTH, 0, 0],
    axis: [0, 1, 0],
    radius: FRAME_RADIUS,
    length: FRAME_HALF_HEIGHT * 2,
    color: '#b4a18a',
  },
];

/* 用一根连续经线绕过框的前后两面，固定点始终贴着框。 */
function frameWarp(): Vec3[] {
  const points = line(
    [warpX(0) - 0.13, -1.37, -WARP_PLANE],
    [warpX(0) - 0.13, -FRAME_HALF_HEIGHT, -WARP_PLANE],
  );

  for (let column = 0; column < WARP_COUNT; column++) {
    // 从下横杆后方开始，绕半圈后把这一列带到横杆前面。
    for (let sample = 1; sample <= 36; sample++) {
      const t = sample / 36,
        angle = Math.PI * t;

      points.push([
        mix(warpX(column) - 0.13, warpX(column), ease(t)),
        -FRAME_HALF_HEIGHT - WARP_PLANE * Math.sin(angle),
        -WARP_PLANE * Math.cos(angle),
      ]);
    }

    points.push(
      ...line(points.at(-1)!, [warpX(column), FRAME_HALF_HEIGHT, WARP_PLANE], 100).slice(1),
    );

    for (let sample = 1; sample <= 36; sample++) {
      const t = sample / 36,
        angle = Math.PI * t;

      points.push([
        warpX(column) + 0.13 * ease(t),
        FRAME_HALF_HEIGHT + WARP_PLANE * Math.sin(angle),
        WARP_PLANE * Math.cos(angle),
      ]);
    }

    points.push(
      ...line(
        points.at(-1)!,
        [warpX(column) + 0.13, column === WARP_COUNT - 1 ? -1.37 : -FRAME_HALF_HEIGHT, -WARP_PLANE],
        100,
      ).slice(1),
    );
  }

  return points;
}

// 预先绕好的连续经线，正面与背面共同属于这一根线。
const FRAME_WARP = frameWarp();

/* 按平纹来回穿梭，打紧时缩小纬线行距。 */
function coasterWeft(packing: number) {
  const pitch = mix(0.205, 0.16, packing),
    edge = 1.08;

  // 把行号换成当前间距下的纵向位置。
  const yAt = (row: number) => -0.93 + row * pitch;
  const points = line([-1.34, yAt(0) - 0.1, WARP_PLANE], [-edge, yAt(0), WARP_PLANE], 20);
  const starts: number[] = [];

  for (let row = 0; row < ROW_COUNT; row++) {
    starts.push(points.length - 1);
    const direction = row % 2 ? -1 : 1;
    const nodes: Vec3[] = [[-edge, yAt(row), WARP_PLANE]];

    for (let column = 0; column < WARP_COUNT; column++) {
      nodes.push([warpX(column), yAt(row), WARP_PLANE + ((row + column) % 2 ? -0.095 : 0.095)]);
    }

    nodes.push([edge, yAt(row), WARP_PLANE]);

    if (direction < 0) {
      nodes.reverse();
    }

    for (let node = 1; node < nodes.length; node++) {
      const a = nodes[node - 1]!,
        b = nodes[node]!;

      for (let sample = 1; sample <= 24; sample++) {
        const t = sample / 24;
        points.push([mix(a[0], b[0], t), a[1], mix(a[2], b[2], ease(t))]);
      }
    }

    if (row < ROW_COUNT - 1) {
      for (let sample = 1; sample <= 32; sample++) {
        const angle = (Math.PI * sample) / 32;
        points.push([
          direction * (edge + (pitch / 2) * Math.sin(angle)),
          yAt(row) + (pitch / 2) * (1 - Math.cos(angle)),
          WARP_PLANE,
        ]);
      }
    }
  }

  points.push(...line(points.at(-1)!, [-1.34, yAt(ROW_COUNT - 1) + 0.15, WARP_PLANE], 20).slice(1));
  const path = measured(points);

  return { ...path, rowLengths: starts.map((index) => path.lengths[index]!) };
}

const COASTER_LOOSE = coasterWeft(0);
const firstReturnTime =
  0.08 +
  (0.74 * (COASTER_LOOSE.rowLengths[1]! - COASTER_LOOSE.rowLengths[0]!)) /
    (COASTER_LOOSE.total - COASTER_LOOSE.rowLengths[0]!);

// 教学步骤与路线进度保持对应。
const COASTER_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '在小织框上认经线',
    instruction:
      '框上已预装绿色经线：从正面向上，绕过上框，再从背面向下。只在正面的八道经线间织杯垫主体；背面的回线留在框后，本课不演示整经固定。',
  },
  {
    time: 0.08,
    title: '从下方织第一行',
    instruction:
      '金色纬线从左向右，一上一下穿过正面经线。起头留出线尾，第一行位于框的下部；不要把背面的回线一起织入。',
  },
  {
    time: firstReturnTime,
    title: '绕最外经线回织',
    instruction:
      '到右边后把同一根纬线转回左侧。下一行在每根经线处反转上下关系，边缘留出自然弧度，避免把织面两边拉成窄腰。',
  },
  {
    time: 0.3,
    title: '连续织出方形主体',
    instruction:
      '左右往返，逐行交替上下，织出十二行。画面保留观察间距；真实制作要边织边用梳子轻推新行，使两侧宽度一致。',
  },
  {
    time: 0.82,
    title: '打纬并检查边缘',
    instruction:
      '把纬线向下方已织部分轻推，压密行距。织框和经线位置保持固定，检查方形边缘。本课停在框上的杯垫主体，脱框、锁住经线及藏线收边需另行完成。',
  },
];

/* 同步杯垫纬线进度、打紧程度，以及固定框架的显示状态。 */
function coasterState(progress: number): LessonState {
  const p = clamp(progress),
    packing = ease((p - 0.82) / 0.18);

  const woven = packing ? coasterWeft(packing) : COASTER_LOOSE;
  const amount = mix(COASTER_LOOSE.rowLengths[0]!, COASTER_LOOSE.total, clamp((p - 0.08) / 0.74));
  const points = packing ? woven.points : prefix(COASTER_LOOSE, amount);

  return {
    points,
    tip: copy(points.at(-1)!),
    checkpoint: checkpoint(p, COASTER_STEPS),
    radius: CORD_RADIUS,
    color: GOLD,
    endCaps: { start: '1B', end: '1A' },
    showEndLabels: false,
    hideMainTip: true,
    strands: [
      {
        id: 'coaster-continuous-warp',
        points: FRAME_WARP.map(copy),
        color: GREEN,
        radius: WARP_RADIUS,
        endCaps: { start: '2B', end: '2A' },
      },
    ],
    supports: FRAME.map((item) => ({
      ...item,
      position: copy(item.position),
      axis: copy(item.axis),
    })),
  };
}

// 两根完整绳子在圆环下弧对折，形成四条编织腿，再按 French Sinnet (2) 的上、下、上顺序编织。
// 对折没有凭空增加线端；任何进度都只有 1A/1B/2A/2B 这四个端点。
const RING_CENTER: Vec3 = [0, 2.05, 0];
const RING_RADIUS = 0.68;
const RING_TUBE = 0.045;
const BRAID_TOP = 0.72;
const BRAID_ROWS = 12;
const BRAID_ROW_HEIGHT = 0.23;
// 把编织槽位换成横向坐标。
const slotX = (slot: number) => (slot - 1.5) * 0.32;
/* 一行编织中每股的换位和前后层关系。 */
type BraidRow = { from: number; to: number; over: boolean };

/* 记录四股编每一行的槽位交换和上下穿越关系。 */
function braidRows() {
  const order = [0, 1, 2, 3];
  const rows: BraidRow[][] = [];

  for (let row = 0; row < BRAID_ROWS; row++) {
    const left = row % 3,
      leftId = order[left]!,
      rightId = order[left + 1]!;

    const instructions: BraidRow[] = [];
    order.forEach((id, slot) => {
      const destination = id === leftId ? slot + 1 : id === rightId ? slot - 1 : slot;
      instructions[id] = {
        from: slot,
        to: destination,
        over: id === leftId ? left !== 1 : left === 1,
      };
    });
    rows.push(instructions);
    [order[left], order[left + 1]] = [rightId, leftId];
  }

  return rows;
}

// 四股编各行的换位路线，播放时按进度逐行取用。
const BRAID_ROUTES = braidRows();

/* 让整根绳子绕过圆环下弧，给对折处留下真实弯曲路径。 */
function ringBend(cord: number): Vec3[] {
  const x = cord ? 0.24 : -0.24;
  const y = RING_CENTER[1] - Math.sqrt(RING_RADIUS ** 2 - x ** 2);
  const inward: Vec3 = [-x / RING_RADIUS, (RING_CENTER[1] - y) / RING_RADIUS, 0];
  const clearance = RING_TUBE + CORD_RADIUS + 0.008;

  return Array.from({ length: 49 }, (_, index) => {
    const angle = (Math.PI * index) / 48;

    return [
      x + inward[0] * clearance * Math.sin(angle),
      y + inward[1] * clearance * Math.sin(angle),
      clearance * Math.cos(angle),
    ] as Vec3;
  });
}

// 两根完整绳子在圆环上的对折弯段。
const RING_BENDS = [ringBend(0), ringBend(1)];

/* 从圆环下方接出一条编织腿，依次经过已完成的交叉行。 */
function braidedLeg(id: number, amount: number, packing: number): Vec3[] {
  const bend = RING_BENDS[Math.floor(id / 2)]!,
    anchor = id % 2 ? bend.at(-1)! : bend[0]!;

  const shrink = mix(1, 0.47, packing),
    rowPitch = BRAID_ROW_HEIGHT * mix(1, 0.7, packing);

  const points = Array.from({ length: 41 }, (_, index): Vec3 => {
    const t = index / 40;

    return [
      mix(anchor[0], slotX(id) * shrink, ease(t)),
      mix(anchor[1], BRAID_TOP, t),
      mix(anchor[2], 0, ease(t)),
    ];
  });

  const rowCount = Math.min(BRAID_ROWS, amount);

  for (let row = 0; row < Math.ceil(rowCount); row++) {
    const route = BRAID_ROUTES[row]![id]!,
      limit = Math.min(1, rowCount - row);

    const samples = Math.max(1, Math.ceil(limit * 36));

    for (let sample = 1; sample <= samples; sample++) {
      const t = (limit * sample) / samples;
      const depth =
        route.from === route.to
          ? 0
          : (route.over ? 1 : -1) * mix(0.11, 0.064, packing) * 64 * t ** 3 * (1 - t) ** 3;

      points.push([
        mix(slotX(route.from), slotX(route.to), ease(t)) * shrink,
        BRAID_TOP - (row + t) * rowPitch,
        depth,
      ]);
    }
  }

  const end = points.at(-1)!;
  // 每一行向前编时，四个自由工作端都保持分开，并且能看见。
  const tailLength = 0.42 + packing * 0.14;
  points.push(...line(end, [end[0] * 1.25, end[1] - tailLength, end[2] * 1.2], 18).slice(1));

  return points;
}

// 教学步骤与路线进度保持对应。
const KEYFOB_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '对折挂环，排好四股',
    instruction:
      '把两根绳分别穿过钥匙环并对折，再固定环。画面从已挂环的两个绳弯开始；从左到右为 1B、1A、2B、2A，共四股，仍然只有两根完整绳。',
  },
  {
    time: 0.08,
    title: '左外股一上一下',
    instruction:
      '从当前最左股开始，向右依次压过一股、穿下一股、再压过一股，到达最右侧。这三次交叉组成一轮四股扁辫，手指暂时捏住靠近环的起点。',
  },
  {
    time: 0.265,
    title: '换新的左外股',
    instruction:
      '上一轮完成后，换当前位置最左的一股，继续按上、下、上穿过另外三股。根据端帽识别工作端，不按绳子颜色固定角色。',
  },
  {
    time: 0.45,
    title: '接长钥匙挂绳主体',
    instruction:
      '再按相同顺序编两轮，环始终固定在上方。每轮都从新的左外股出发；已经完成的辫段连续连接到穿环的绳弯。',
  },
  {
    time: 0.82,
    title: '匀拉辫身，保留线尾',
    instruction:
      '均匀牵拉四个线端，把辫身收紧并整理平整，穿环处保持连接。本课只完成挂绳主体；松手使用前还需锁住尾端并处理余线，收尾锁结不在本动画中。',
  },
];

/* 把四条编织腿接回两根完整绳子，并返回钥匙扣这一帧。 */
function keyfobState(progress: number): LessonState {
  const p = clamp(progress),
    packing = ease((p - 0.82) / 0.18);

  const amount = BRAID_ROWS * clamp((p - 0.08) / 0.74);
  const legs = [0, 1, 2, 3].map((id) => braidedLeg(id, amount, packing));
  // 把同一根绳的两条腿通过环上弯段连起来，保留两个真实线端。
  const cord = (index: number): Vec3[] => [
    ...legs[index * 2]!.slice().reverse(),
    ...RING_BENDS[index]!.slice(1).map(copy),
    ...legs[index * 2 + 1]!.slice(1),
  ];

  const points = cord(0);

  return {
    points,
    tip: copy(points.at(-1)!),
    checkpoint: checkpoint(p, KEYFOB_STEPS),
    radius: CORD_RADIUS,
    color: GREEN,
    endCaps: { start: '1B', end: '1A' },
    showEndLabels: false,
    hideMainTip: true,
    strands: [
      {
        id: 'keyfob-second-folded-cord',
        points: cord(1),
        color: GOLD,
        radius: CORD_RADIUS,
        endCaps: { start: '2B', end: '2A' },
      },
    ],
    supports: [
      {
        id: 'keyfob-key-ring',
        kind: 'ring',
        position: copy(RING_CENTER),
        axis: [0, 0, 1],
        radius: RING_RADIUS,
        length: RING_TUBE * 2,
        color: '#a4aaab',
      },
    ],
  };
}

// 这组工艺的课程入口。
export const WEAVING_PROJECT_COURSES: Course[] = [
  {
    id: 'frame-coaster-body',
    category: 'weaving',
    name: '小织框杯垫主体',
    title: '在小织框上织杯垫主体',
    description: '从预装的经线开始，在真实织框上来回穿纬，织出一块方形杯垫主体。',
    material: '小织框 · 棉经线 · 棉纬线 · 钝头织针与梳子',
    materialNote: '图中一根绿色线连续绕框，金色线在正面回织；尺寸为结构示意，实作按杯底大小调整。',
    duration: 54,
    initialProgress: 0.54,
    steps: COASTER_STEPS,
    source: 'https://fibersanddesign.com/diy-woven-coaster-set-tutorial/',
    sourceName: 'Fibers and Design · DIY Woven Coaster Set',
    application: {
      scenarios: ['home', 'table', 'gifts'],
      task: '为杯子制作一块平织杯垫主体。',
      focus: '织框上的杯垫主体',
      boundary: '从预装经线开始；未演示整经固定、脱框和锁边藏线，完成这些步骤后才可使用。',
    },
    getState: coasterState,
  },
  {
    id: 'ring-keyfob-braid',
    category: 'weaving',
    name: '四股钥匙挂绳主体',
    title: '从钥匙环编出四股挂绳',
    description: '两根绳对折挂入钥匙环，沿四个工作端连续编出一段扁辫挂绳。',
    material: '钥匙环 · 两根软绳 · 临时固定夹',
    materialNote:
      '两根完整绳各对折为两股，端帽 1A/1B 属于同一根绳，2A/2B 属于另一根；预留足够收尾长度。',
    duration: 46,
    initialProgress: 0.5,
    steps: KEYFOB_STEPS,
    source: 'https://www.animatedknots.com/french-sinnet-knot-two',
    sourceName: 'Animated Knots · French Sinnet (2) 四股扁辫',
    application: {
      scenarios: ['accessories', 'gifts'],
      task: '为钥匙制作便于辨认和拿取的编绳挂件主体。',
      focus: '带挂环的四股扁辫',
      boundary: '从已对折穿环开始；不含尾端锁结、修剪或热封，不能把未收尾的样片直接作为成品使用。',
    },
    getState: keyfobState,
  },
];
