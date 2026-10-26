import type { Course, LessonBead, LessonState, LessonStep, LessonSupport, Vec3 } from './types';

// 应用课保留一根真实连续的线、明确的穿孔路线，以及正在连接的五金件。
// 最后一帧只是备好的部件；没有演示的压扣或收尾结，不算已经做好。
const THREAD = 0.008;
const GATHER = 0.82;
const TIMES = [0, 0.16, 0.38, 0.62, GATHER, 1] as const;
// 把进度限制在 0～1。
const clamp = (p: number) => Math.max(0, Math.min(1, Number.isFinite(p) ? p : 0));

// 让动作起停更平缓。
const ease = (p: number) => {
  const t = clamp(p);

  return t * t * (3 - 2 * t);
};

// 复制坐标，不改原数组。
const copy = (p: Vec3): Vec3 => [...p];
// 在两值之间插值。
const mix = (a: Vec3, b: Vec3, t: number): Vec3 => a.map((v, i) => v + (b[i]! - v) * t) as Vec3;
// 沿给定方向平移。
const add = (p: Vec3, axis: Vec3, n: number): Vec3 => p.map((v, i) => v + axis[i]! * n) as Vec3;
// 计算两点间的直线距离。
const dist = (a: Vec3, b: Vec3) => Math.hypot(...a.map((v, i) => v - b[i]!));
// 按时间表查当前步骤。
const stepAt = (p: number) => TIMES.slice(0, 5).filter((t) => p >= t).length - 1;

/* 记录连续走线、穿孔和累计长度。 */
class ProjectPath {
  points: Vec3[];
  lengths = [0];
  length = 0;
  passages: { id: string; from: number; to: number }[] = [];
  /* 从起点和初始方向开始记录路线。 */
  constructor(start: Vec3) {
    this.points = [copy(start)];
  }
  /* 取当前路线末点。 */
  get end() {
    return this.points.at(-1)!;
  }
  /* 追加采样点并累计线长。 */
  push(point: Vec3) {
    const distance = dist(this.end, point);

    if (distance < 1e-10) {
      return;
    }

    this.length += distance;
    this.points.push(copy(point));
    this.lengths.push(this.length);
  }
  /* 沿直线补足采样点。 */
  line(end: Vec3) {
    const start = copy(this.end),
      count = Math.max(1, Math.ceil(dist(start, end) / 0.009));

    for (let i = 1; i <= count; i++) {
      this.push(mix(start, end, i / count));
    }
  }
  /* 采样孔外连接曲线。 */
  curve(c1: Vec3, c2: Vec3, end: Vec3) {
    const start = copy(this.end),
      count = Math.max(40, Math.ceil((dist(start, c1) + dist(c1, c2) + dist(c2, end)) / 0.006));

    for (let i = 1; i <= count; i++) {
      const t = i / count,
        u = 1 - t;

      this.push(
        [0, 1, 2].map(
          (k) =>
            u ** 3 * start[k]! + 3 * u * u * t * c1[k]! + 3 * u * t * t * c2[k]! + t ** 3 * end[k]!,
        ) as Vec3,
      );
    }
  }
  /* 穿过珠孔，记下这趟线长。 */
  visit(bead: LessonBead, direction: number, lane: Vec3) {
    const axis = bead.axis.map((v) => v * direction) as Vec3;
    const center = add(bead.position, lane, 1);
    // 沿孔轴的直线先伸出整个外壳，曲线才开始转弯。这样即使工作端和实心端套在移动，也不会切进孔沿。
    const half = bead.radius * (bead.axialScale ?? 1) + 0.025;
    this.line(add(center, axis, -half));
    const from = this.length;
    this.line(add(center, axis, half));
    this.passages.push({ id: bead.id, from, to: this.length });
  }
  /* 按线长截取路线，保留准确线尖。 */
  prefix(length: number): Vec3[] {
    const result: Vec3[] = [copy(this.points[0]!)];

    for (let i = 1; i < this.points.length; i++) {
      const a = this.lengths[i - 1]!,
        b = this.lengths[i]!;

      if (b <= length + 1e-10) {
        result.push(copy(this.points[i]!));
      } else {
        if (length > a + 1e-10) {
          result.push(mix(this.points[i - 1]!, this.points[i]!, (length - a) / (b - a)));
        }

        break;
      }
    }

    return result;
  }
}

/* 应用课里的珠子、工作线、五金件与进度记录。 */
interface ProjectModel {
  path: ProjectPath;
  beads: LessonBead[];
  supports: LessonSupport[];
  marks: number[];
}

/* 创建一颗带孔轴的珠子。 */
function bead(
  id: string,
  position: Vec3,
  axis: Vec3,
  color: string,
  radius = 0.13,
  label = '',
): LessonBead {
  return { id, position, axis, color, radius, active: false, label };
}

/* 按收紧进度选择珠阵，并同步可见路线、五金件和高亮。 */
function modelState(
  progress: number,
  build: (tightening: number) => ProjectModel,
  loose: ProjectModel,
): LessonState {
  const p = clamp(progress),
    g = ease((p - GATHER) / (1 - GATHER)),
    model = g ? build(g) : loose;

  const checkpoint = stepAt(p),
    t0 = TIMES[checkpoint]!,
    t1 = TIMES[checkpoint + 1]!;

  const length =
    model.marks[checkpoint]! +
    (model.marks[checkpoint + 1]! - model.marks[checkpoint]!) * ease((p - t0) / (t1 - t0));

  const points = model.path.prefix(length);
  const active =
    p < GATHER ? model.path.passages.find((passage) => length <= passage.to + 1e-9)?.id : undefined;

  return {
    points,
    tip: copy(points.at(-1)!),
    checkpoint,
    radius: THREAD,
    color: '#8a6850',
    hideMainTip: true,
    beads: model.beads.map((item) => ({
      ...item,
      position: copy(item.position),
      axis: copy(item.axis),
      active: item.id === active,
      labelOpacity: 1 - g,
    })),
    supports: model.supports.map((item) => ({
      ...item,
      position: copy(item.position),
      axis: copy(item.axis),
    })),
    endCaps: { start: '1B', end: '1A' },
  };
}

/* 安排回穿压扣和金属线圈的路线，保留尚未压紧的实际部件。 */
function connectorModel(g: number): ProjectModel {
  const shift = 0.4 * g,
    pitch = 0.48 - 0.2 * g,
    crimpX = 0.12 + shift;

  const beads = [
    bead('connector-body-1', [crimpX - 2 * pitch, 0.2, 0], [1, 0, 0], '#8daaa9', 0.13, '1'),
    bead('connector-body-2', [crimpX - pitch, 0.2, 0], [1, 0, 0], '#d3b58c', 0.13, '2'),
    {
      ...bead('connector-crimp', [crimpX, 0.2, 0], [1, 0, 0], '#aa9470', 0.11, '夹珠'),
      axialScale: 0.7,
    },
  ];

  const path = new ProjectPath([beads[0]!.position[0] - 0.7, 0.2, -0.02]);
  path.line([beads[0]!.position[0] - 0.35, 0.2, -0.02]);
  const marks = [path.length];

  for (const item of beads) {
    path.visit(item, 1, [0, 0, -0.02]);
  }

  marks.push(path.length);
  const gap = 0.16 - 0.08 * g,
    tubeX = 0.82,
    farX = tubeX + 0.2 - 0.1 * g;

  // 圆环位于 XY 平面，金属线圈位于 XZ 平面：从左侧环边前方穿进开口，再走到环边后方，两者确实套在一起。
  path.curve([crimpX + 0.2, 0.2, -0.02], [tubeX - 0.16, 0.2, -gap], [tubeX, 0.2, -gap]);
  path.curve([farX + 0.08, 0.2, -gap], [farX + 0.08, 0.2, gap], [tubeX, 0.2, gap]);
  marks.push(path.length);
  path.curve([tubeX - 0.16, 0.2, gap], [crimpX + 0.2, 0.2, 0.02], [crimpX + 0.102, 0.2, 0.02]);
  path.visit(beads[2]!, -1, [0, 0, 0.02]);
  marks.push(path.length);
  path.visit(beads[1]!, -1, [0, 0, 0.02]);
  path.visit(beads[0]!, -1, [0, 0, 0.02]);
  path.line([beads[0]!.position[0] - 0.33, 0.2, 0.02]);
  path.curve(
    [beads[0]!.position[0] - 0.5, 0.2, 0.02],
    [beads[0]!.position[0] - 0.5, 0.42, 0.15],
    [beads[0]!.position[0] - 0.64, 0.5, 0.18],
  );
  marks.push(path.length, path.length);

  return {
    path,
    beads,
    marks,
    supports: [
      {
        id: 'bracelet-connector-ring',
        kind: 'ring',
        position: [1.2, 0.2, 0],
        axis: [0, 0, 1],
        radius: 0.38,
        length: 0.09,
        color: '#b3a17b',
      },
    ],
  };
}

/* 让工作线穿过圆环再接出珠穗，回程只跳过止珠。 */
function fringeModel(g: number): ProjectModel {
  const pitch = 0.38 - 0.136 * g,
    top = 0.38,
    lower = top - 4 * pitch;

  const beads = Array.from({ length: 5 }, (_, i) =>
    bead(
      `ring-fringe-${i}`,
      [0, top - i * pitch, 0],
      [0, 1, 0],
      i % 2 ? '#d8bd95' : '#88a8b2',
      0.12,
      String(i + 1),
    ),
  );

  const stop = bead(
    'ring-fringe-stop',
    [0, lower - 0.34 + 0.04 * g, 0],
    [1, 0, 0],
    '#b99b63',
    0.085,
    '止珠',
  );

  const path = new ProjectPath([0, 1.1, 0.7]);
  path.line([0, 1.1, 0.46]);
  const marks = [path.length];
  // 工作端先穿过圆环的真实开口，再从底部环边后方接近垂线；圆环也参与穿线，不只是背景。
  path.line([0, 1.1, -0.2]);
  path.curve([0, 0.9, -0.2], [-0.018, 0.68, -0.2], [-0.018, 0.625, 0]);
  path.line([-0.018, top + 0.145, 0]);
  marks.push(path.length);

  for (const item of beads) {
    path.visit(item, -1, [-0.018, 0, 0]);
  }

  const stopY = stop.position[1],
    outer = 0.15;

  // 止珠横过来放。回程只跳过这一颗，下面五颗主干珠都要穿两遍。
  path.curve([-0.018, lower - 0.205, 0], [-outer - 0.1, stopY, 0], [-outer, stopY, 0]);
  path.line([-0.11, stopY, 0]);
  path.visit(stop, 1, [0, 0, 0]);
  path.line([outer, stopY, 0]);
  marks.push(path.length);
  path.curve([outer + 0.1, stopY, 0], [0.018, lower - 0.205, 0], [0.018, lower - 0.145, 0]);

  for (const item of [...beads].reverse()) {
    path.visit(item, 1, [0.018, 0, 0]);
  }

  marks.push(path.length);
  path.curve([0.018, 0.65, 0], [0.04, 0.67, 0.2], [0.18, 0.67, 0.2]);
  path.line([0.65, 0.67, 0.2]);
  marks.push(path.length, path.length);

  return {
    path,
    beads: [...beads, stop],
    marks,
    supports: [
      {
        id: 'fringe-jump-ring',
        kind: 'ring',
        position: [0, 1.18, 0],
        axis: [0, 0, 1],
        radius: 0.42,
        length: 0.09,
        color: '#b3a17b',
      },
    ],
  };
}

const connectorLoose = connectorModel(0),
  fringeLoose = fringeModel(0);

// 把每步标题、说明与统一时间表配成教学节点。
const steps = (titles: string[], instructions: string[]): LessonStep[] =>
  titles.map((title, i) => ({ time: TIMES[i]!, title, instruction: instructions[i]! }));

// 这组工艺的课程入口。
export const BEADING_PROJECT_COURSES: Course[] = [
  {
    id: 'bracelet-clasp-return',
    category: 'beads',
    name: '手链扣环回穿',
    title: '手链修补 · 先把扣环接回珠串',
    description: '从珠串末端穿过夹珠与扣环，再回穿夹珠和两颗珠，练习压接之前的线端整理。',
    material: '2 颗珠 · 1 颗夹珠 · 闭合扣环 · 饰品钢丝',
    materialNote:
      '实物须选择相互匹配的饰品钢丝、夹珠和压线钳。本课仅放大珠串末端；夹珠用金色扁珠示意，未演示压接或剪线。',
    duration: 34,
    initialProgress: 0,
    application: {
      scenarios: ['repair', 'jewelry', 'gifts'],
      task: '手链扣头脱落后，重新整理钢丝与扣环的回穿连接。',
      focus: '扣环回穿部件',
      boundary: '演示止于压接前的准备状态。夹珠尚未压紧，不能直接佩戴；不是弹力线打结法。',
    },
    steps: steps(
      [
        '选好末端材料',
        '先穿夹珠，再穿扣环',
        '从背面返回夹珠',
        '回穿两颗珠并留尾',
        '收小余圈，准备压接',
      ],
      [
        '先检查原珠孔和钢丝是否损坏，选与线径匹配的新夹珠。1B 是珠串方向，1A 是接扣环的工作端；图中只显示末端两颗珠。',
        '把 1A 沿珠孔穿过两颗珠和金色夹珠，再穿进闭合扣环的中间。不要从金属环实体中穿过。',
        '把工作端绕回，从夹珠另一侧穿入。去程和回程在同一珠孔里并排，不能相互交叉拧成一股。旋转视角查看环的前后两面。',
        '孔径允许时，再向珠串方向回穿两颗珠，保留可操作的线尾。不要剪去仍需调整的工作端。',
        '轻拉尾线，使扣环旁的余圈缩小，保留扣环活动空间。动画到这里仍未压接；实物接着按所用夹珠和压线钳说明完成压接、检查和修剪后才能使用。',
      ],
    ),
    source: 'https://beadaholique.com/products/how-to-use-crimp-beads-and-tubes',
    sourceName: 'Beadaholique · How to Use Crimp Beads and Tubes',
    projectionBounds: { minX: -0.25, maxX: 1.65, minY: -0.25, maxY: 0.65 },
    getState: (p) => modelState(p, connectorModel, connectorLoose),
  },
  {
    id: 'ring-bead-fringe',
    category: 'beads',
    name: '挂环珠流苏部件',
    title: '包饰与耳饰 · 从挂环垂下一条珠流苏',
    description: '线先穿入挂环，再串主珠、绕过止珠回穿，做一条可用于包饰或耳饰的流苏部件。',
    material: '5 颗主珠 · 1 颗止珠 · 闭合挂环 · 柔软珠线与针',
    materialNote:
      '主珠孔应容纳两次穿线。图中止珠横放以看清回头路径；挂环的扣合、最终锁结藏线和耳钩组装不在本课内。',
    duration: 38,
    initialProgress: 0,
    application: {
      scenarios: ['accessories', 'jewelry', 'decor', 'gifts'],
      task: '为包挂、耳饰或小挂件制作一条有挂环的珠流苏部件。',
      focus: '挂环珠流苏部件',
      boundary: '本课展示回穿部件，保留两个真实线端。尚未锁结藏线，也没有组装完整耳钩或包挂扣。',
    },
    steps: steps(
      [
        '留出线尾，穿进挂环',
        '顺次串主珠和止珠',
        '跳过止珠，向上回穿',
        '在挂环下留出工作尾',
        '收掉余线，整理垂感',
      ],
      [
        '准备闭合挂环，给 1B 留出后续收尾所需的线长。让 1A 从环孔中穿过，再从挂环背面向下引出，开始流苏。',
        '按配色串五颗主珠，最后加一颗止珠。图中让止珠横向放置，方便看清线如何在底端转向。',
        '回程跳过最末端止珠，从第五颗主珠开始依次向上回穿，直到第一颗主珠。五颗主珠各有两次穿线，止珠只有一次。',
        '把回穿后的工作端引到挂环下方，保留两端供后续锁结、藏线使用。此时只是完成挂环与流苏的走线关系，还没有完成防脱收尾。',
        '轻拉工作端收短珠间余线，让主珠自然排列；避免过紧导致流苏僵硬。图中保留两端，实物须继续完成适合所用线材的锁结藏线，再安装包挂扣或耳钩。',
      ],
    ),
    source: 'https://beadaholique.com/products/how-to-make-beaded-fringe',
    sourceName: 'Beadaholique · How to Make Beaded Fringe',
    projectionBounds: { minX: -0.5, maxX: 0.7, minY: -1.0, maxY: 1.65 },
    getState: (p) => modelState(p, fringeModel, fringeLoose),
  },
];
