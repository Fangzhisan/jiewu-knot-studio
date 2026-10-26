import type { Course, LessonBead, LessonState, LessonStep, Vec3 } from './types';

// 穿针顺序参考 Andrea Morici / Beadaholique，并用下面两份图解交叉核对：
// https://artbeads.com/content/tutorial-pdfs/2015-basic-herringbone-stitch-diagram.pdf
// https://beadworkersguild.com/wp-content/uploads/2021/04/Herringbone_Weave-1.pdf
// 样片保留竖直的加固梯式底行，再加两行就停；这里没有演示藏线和装扣。

const Z: Vec3 = [0, 0, 1];
const GATHER = 0.82;
const RADIUS = 0.18;
// 椭球沿珠孔轴的长度比例，整堂课保持不变。
const AXIAL_SCALE = 1.4;
const LINE_RADIUS = 0.007;
const BORE_RADIUS = Math.max(0.055, Math.min(0.12, RADIUS * 0.36));
const HALF_BORE = Math.sqrt(RADIUS ** 2 - BORE_RADIUS ** 2) * AXIAL_SCALE;
// 把进度限制在 0～1。
const clamp = (n: number) => Math.max(0, Math.min(1, Number.isFinite(n) ? n : 0));

// 让动作起停更平缓。
const ease = (n: number) => {
  const t = clamp(n);

  return t * t * (3 - 2 * t);
};

// 换算最后一章的收紧程度。
const gather = (p: number) => ease((clamp(p) - GATHER) / (1 - GATHER));
// 复制坐标，不改原数组。
const cp = (p: Vec3): Vec3 => [...p];
// 沿给定方向平移。
const add = (a: Vec3, b: Vec3, s = 1): Vec3 => [a[0] + b[0] * s, a[1] + b[1] * s, a[2] + b[2] * s];
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

/* 按回穿次数分配孔内通道，重复穿线也能各走各的。 */
function boreLane(bead: LessonBead, count: number) {
  const lanes =
    bead.id === 'herringbone-0-0' ? [0, 0.05, -0.025, 0.025] : [-0.048, -0.016, 0.046, 0.016];

  return lanes[count]!;
}

/* 把孔内通道换成实际偏移，边缘回穿另外让出深度。 */
function boreOffset(bead: LessonBead, count: number): Vec3 {
  const lane = boreLane(bead, count);
  const edge =
    bead.id === 'herringbone-0-0'
      ? 3
      : bead.id === 'herringbone-1-3' || bead.id === 'herringbone-2-0'
        ? 2
        : -10;

  return [
    bead.axis[1] * lane,
    -bead.axis[0] * lane,
    count === edge ? 0.022 : count === edge - 1 ? -0.022 : 0,
  ];
}

// 求两个方向的叉积，得到与它们垂直的旋转方向。
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

// 把向量归一化为方向。
const unit = (v: Vec3): Vec3 => {
  const n = Math.hypot(...v);

  return v.map((x) => x / n) as Vec3;
};

/* 把坐标绕指定轴旋转，保留原来的长度。 */
function rotate(v: Vec3, axis: Vec3, angle: number): Vec3 {
  return add(
    add(add([0, 0, 0], v, Math.cos(angle)), cross(axis, v), Math.sin(angle)),
    axis,
    dot(axis, v) * (1 - Math.cos(angle)),
  );
}

/* 沿已有线桥平滑挪出一条旁路，头尾仍对准各自的孔口。 */
function offsetTrace(trace: Vec3[], first: Vec3, last: Vec3): Vec3[] {
  const tangents = trace.map((_, i) =>
    i === 0
      ? unit(add(trace[1]!, trace[0]!, -1))
      : i === trace.length - 1
        ? unit(add(trace[i]!, trace[i - 1]!, -1))
        : unit(
            add(unit(add(trace[i + 1]!, trace[i]!, -1)), unit(add(trace[i]!, trace[i - 1]!, -1))),
          ),
  );

  const lengths = [0],
    normals: Vec3[] = [unit(add(first, tangents[0]!, -dot(first, tangents[0]!)))];

  for (let i = 1; i < trace.length; i++) {
    lengths.push(lengths[i - 1]! + distance(trace[i - 1]!, trace[i]!));
    const rotation = cross(tangents[i - 1]!, tangents[i]!),
      sine = Math.hypot(...rotation);

    normals.push(
      sine < 1e-10
        ? cp(normals[i - 1]!)
        : rotate(
            normals[i - 1]!,
            rotation.map((v) => v / sine) as Vec3,
            Math.atan2(sine, dot(tangents[i - 1]!, tangents[i]!)),
          ),
    );
  }

  const endNormal = unit(add(last, tangents.at(-1)!, -dot(last, tangents.at(-1)!)));
  const twist = Math.atan2(
    dot(cross(normals.at(-1)!, endNormal), tangents.at(-1)!),
    dot(normals.at(-1)!, endNormal),
  );

  const total = lengths.at(-1)!,
    ramp = Math.min(0.12, total * 0.4),
    middle = 0.015;

  return trace.map(
    /* 计算这一项对应的累计长度，后面按长度对齐进度。 */ (p, i) => {
      if (i === 0) {
        return add(p, first);
      }

      if (i === trace.length - 1) {
        return add(p, last);
      }

      const l = lengths[i]!,
        magnitude =
          middle +
          (Math.hypot(...first) - middle) * (1 - ease(l / ramp)) +
          (Math.hypot(...last) - middle) * (1 - ease((total - l) / ramp));

      return add(p, rotate(normals[i]!, tangents[i]!, twist * ease(l / total)), magnitude);
    },
  );
}

/* 记录连续走线、穿孔和累计长度。 */
class StitchPath {
  points: Vec3[];
  distances = [0];
  passages: { id: string; start: number; end: number }[] = [];
  length = 0;
  tangent: Vec3;
  readonly counts = new Map<string, number>();
  readonly links = new Map<string, Vec3>();
  readonly linkTraces = new Map<string, Vec3[]>();
  readonly bridges = new Map<string, number>();
  previous?: LessonBead;
  /* 从起点和初始方向开始记录路线。 */
  constructor(start: Vec3, tangent: Vec3) {
    this.points = [cp(start)];
    this.tangent = cp(tangent);
  }
  /* 取当前路线末点。 */
  get end() {
    return this.points.at(-1)!;
  }
  /* 追加采样点并累计线长。 */
  push(point: Vec3) {
    const d = distance(this.end, point);

    if (d < 1e-10) {
      return;
    }

    this.length += d;
    this.points.push(cp(point));
    this.distances.push(this.length);
  }
  /* 沿直线补足采样点。 */
  line(end: Vec3) {
    const start = cp(this.end),
      count = Math.max(1, Math.ceil(distance(start, end) / 0.01));

    for (let i = 1; i <= count; i++) {
      this.push(mix(start, end, i / count));
    }
  }
  arc(fn: (angle: number) => Vec3, axis: Vec3, maxAngle = Math.PI / 2) {
    for (let i = 1; i <= 32; i++) {
      this.push(fn((maxAngle * i) / 32));
    }

    this.tangent = cp(axis);
  }
  /* 给相邻孔口搭一段连续线桥，绕开珠体和已有线段。 */
  bridge(end: Vec3, axis: Vec3, layer: number, turn = 0.04, endTurn = turn, planeBend = 0) {
    const chord = add(end, this.end, -1),
      span = Math.hypot(...chord);

    if (
      span < 1e-9 ||
      (dot(this.tangent, axis) > 0.99999 && Math.abs(dot(chord, axis) - span) < 1e-8)
    ) {
      const middle = mix(this.end, end, 0.5);
      this.line(end);
      this.tangent = cp(axis);

      return middle;
    }

    const start = cp(this.end),
      begin = cp(this.tangent),
      side = Math.sign(layer);

    layer =
      side *
      Math.max(
        Math.abs(layer),
        side * start[2] + turn * 2 + 0.001,
        side * end[2] + endTurn * 2 + 0.001,
      );
    this.arc(
      (a) => add(add(start, begin, turn * Math.sin(a)), Z, side * turn * (1 - Math.cos(a))),
      [0, 0, side],
    );
    const first: Vec3 = [this.end[0], this.end[1], layer],
      last: Vec3 = [end[0] - axis[0] * endTurn, end[1] - axis[1] * endTurn, layer];

    const middle = mix(first, last, 0.5);
    middle[1] += planeBend;
    const firstLength = distance(first, middle),
      lastLength = distance(middle, last);

    const direction = unit(add(middle, first, -1)),
      arrival = unit(add(last, middle, -1)),
      corner = Math.min(turn, endTurn, firstLength / 2, lastLength / 2);

    this.line([first[0], first[1], layer - side * corner]);
    const lift = cp(this.end);
    this.arc(
      (a) => add(add(lift, Z, side * corner * Math.sin(a)), direction, corner * (1 - Math.cos(a))),
      direction,
    );
    const from = cp(this.end),
      to = add(last, arrival, -corner);

    if (Math.abs(planeBend) < 1e-9) {
      this.line(middle);
      this.line(to);
    } else {
      for (let i = 1; i <= 64; i++) {
        const t = i / 64;
        this.push(
          add(add(add([0, 0, 0], from, (1 - t) ** 2), middle, 2 * t * (1 - t)), to, t ** 2),
        );
      }
    }

    const sink = cp(this.end);
    this.arc(
      (a) => add(add(sink, arrival, corner * Math.sin(a)), Z, -side * corner * (1 - Math.cos(a))),
      [0, 0, -side],
    );
    this.line([end[0] - axis[0] * endTurn, end[1] - axis[1] * endTurn, end[2] + side * endTurn]);
    this.arc(
      (a) => add(add(end, axis, -endTurn * Math.cos(a)), Z, side * endTurn * (1 - Math.sin(a))),
      axis,
    );

    return middle;
  }
  /* 穿过珠孔，记下这趟线长。 */
  visit(bead: LessonBead, direction: number) {
    const count = this.counts.get(bead.id) ?? 0;
    this.counts.set(bead.id, count + 1);
    const offset = boreOffset(bead, count);
    const axis = add([0, 0, 0], bead.axis, direction),
      entry = add(add(bead.position, offset), axis, -HALF_BORE);

    const key = this.previous ? [this.previous.id, bead.id].sort().join('/') : 'initial';
    const occurrence = this.bridges.get(key) ?? 0;
    this.bridges.set(key, occurrence + 1);
    const previousRow = this.previous ? Number(this.previous.id.split('-')[1]) : 0,
      row = Number(bead.id.split('-')[1]);

    const sameColumn = this.previous?.id.split('-')[2] === bead.id.split('-')[2];
    const foundation = row === 0 && previousRow === 0;
    const samePair =
      this.previous &&
      Math.floor(Number(this.previous.id.split('-')[2]) / 2) ===
        Math.floor(Number(bead.id.split('-')[2]) / 2);

    const atFoundation = row === 0 || previousRow === 0;
    // 梯式回穿分别从两侧绕行。行间连接贴近孔口，只在已有线段旁边略微鼓起，给回程让路。
    const layer = !this.previous
      ? 0.2
      : foundation
        ? (occurrence < 2 ? -1 : 1) * (this.tangent[1] > 0 ? 0.19 : 0.08)
        : sameColumn
          ? atFoundation
            ? 0.15
            : -0.15
          : samePair
            ? 0.075
            : -0.075;

    const bridgeStart = this.points.length - 1;
    const reverse =
      sameColumn && this.previous && this.linkTraces.has(`${bead.id}/${this.previous.id}`);

    const startTurn = foundation
      ? this.tangent[1] > 0
        ? 0.011
        : 0.035
      : sameColumn
        ? previousRow === 0
          ? 0.011
          : row === 0
            ? 0.018
            : 0.04
        : 0.025;

    const endTurn = foundation
      ? this.tangent[1] > 0
        ? 0.011
        : 0.035
      : sameColumn
        ? row === 0
          ? 0.011
          : previousRow === 0
            ? 0.018
            : 0.04
        : 0.025;

    const middle = this.bridge(
      entry,
      axis,
      reverse ? -0.15 : layer,
      startTurn,
      endTurn,
      sameColumn && atFoundation ? 0.04 : 0,
    );

    if (this.previous && !this.links.has(`${this.previous.id}/${bead.id}`)) {
      this.links.set(`${this.previous.id}/${bead.id}`, cp(middle));
      this.linkTraces.set(`${this.previous.id}/${bead.id}`, this.points.slice(bridgeStart).map(cp));
    }

    const start = this.length;
    this.line(add(add(bead.position, offset), axis, HALF_BORE));
    this.tangent = cp(axis);
    this.passages.push({ id: bead.id, start, end: this.length });
    this.previous = bead;
  }
}

/* 鱼骨针珠阵与连续穿线路线。 */
interface HerringboneModel {
  beads: LessonBead[];
  path: StitchPath;
  marks: number[];
}

/* 保留加固梯式底行，成对加入上层珠子，连出两行鱼骨针。 */
function makeHerringbone(g: number): HerringboneModel {
  const angle = Math.PI / 6,
    s = Math.sin(angle),
    c = Math.cos(angle);

  const finalAngle = Math.PI / 6,
    long = RADIUS * AXIAL_SCALE;

  const tightX =
    2 * Math.sqrt(long ** 2 * Math.sin(finalAngle) ** 2 + RADIUS ** 2 * Math.cos(finalAngle) ** 2) +
    0.001;

  const tightY =
    2 / Math.sqrt(Math.sin(finalAngle) ** 2 / RADIUS ** 2 + Math.cos(finalAngle) ** 2 / long ** 2) +
    0.001;

  const dx = 0.7 + (tightX - 0.7) * g,
    dy = 0.75 + (tightY - 0.75) * g;

  const baseX = 0.7 + (2 * RADIUS + 0.001 - 0.7) * g,
    baseY = 0.75 + (0.489 - 0.75) * g;

  // 上面每对珠子向内倾斜，让上孔之间能接上一小段短桥。
  const rows = Array.from({ length: 3 }, (_, row) =>
    Array.from({ length: 4 }, (_, col): LessonBead => ({
      id: `herringbone-${row}-${col}`,
      position: [(col - 1.5) * (row === 0 ? baseX : dx), row === 0 ? -baseY : (row - 1) * dy, 0],
      axis: row === 0 ? [0, 1, 0] : [col % 2 ? -s : s, c, 0],
      radius: RADIUS,
      axialScale: AXIAL_SCALE,
      color: row === 0 ? '#bbc3c7' : col % 2 ? '#cda76b' : '#8ca9b2',
      label: row === 0 ? String(col + 1) : '',
      active: false,
    })),
  );

  const first = rows[0]![0]!,
    path = new StitchPath(add(first.position, [-0.43, 0.37, 0.12]), [1, 0, 0]);

  // 第零帧已经有四珠梯式底行；底行仍是同一根工作线的一部分，全程只有两个真实的自由端。
  path.visit(rows[0]![0]!, -1);
  path.visit(rows[0]![1]!, 1);
  path.visit(rows[0]![0]!, -1);
  path.visit(rows[0]![1]!, 1);

  for (let col = 2; col < 4; col++) {
    const direction = col % 2 ? 1 : -1;
    path.visit(rows[0]![col]!, direction);
    path.visit(rows[0]![col - 1]!, -direction);
    path.visit(rows[0]![col]!, direction);
  }

  const marks = [path.length];

  // 到行边时沿已有线桥绕回，再向上穿到下一行。
  const turnAtEdge = (row: number, col: number) => {
    const lower = rows[row - 1]![col]!,
      upper = rows[row]![col]!;

    const key =
      row === 1 ? 'herringbone-0-0/herringbone-0-1' : `herringbone-${row - 2}-${col}/${lower.id}`;

    const anchor = path.links.get(key)!;
    const trace = path.linkTraces.get(key)!;
    let middleIndex = 0;

    for (let i = 1; i < trace.length; i++) {
      if (distance(trace[i]!, anchor) < distance(trace[middleIndex]!, anchor)) {
        middleIndex = i;
      }
    }

    const tail = row === 1 ? trace.slice(0, middleIndex + 1).reverse() : trace.slice(middleIndex);
    const axisDelta = add(tail[1]!, tail[0]!, -1),
      norm = Math.hypot(...axisDelta),
      along = axisDelta.map((v) => v / norm) as Vec3;

    const outward: Vec3 = [along[1], -along[0], 0];
    const exitDelta = add(path.end, tail.at(-1)!, -1);
    const outgoing = offsetTrace(tail, [0, 0, -0.021], exitDelta);

    for (const point of outgoing.slice(0, -1).reverse()) {
      path.push(point);
    }

    const count = path.counts.get(lower.id) ?? 0,
      entry = add(add(lower.position, boreOffset(lower, count)), lower.axis, -HALF_BORE);

    const entryDelta = add(entry, tail.at(-1)!, -1);

    // 沿已有线桥的另一条孔内通道走，再用连续的三维转弯绕住线桥，最后向上回穿。
    for (let i = 1; i <= 96; i++) {
      const t = i / 96,
        a = Math.PI * t,
        delta: Vec3 = [0, 0, -0.021 * Math.cos(a)];

      path.push(
        add(
          add(add(anchor, delta), along, -0.025 * Math.sin(a)),
          outward,
          0.023 * Math.sin(a) ** 2,
        ),
      );
    }

    for (const point of offsetTrace(tail, [0, 0, 0.021], entryDelta).slice(1)) {
      path.push(point);
    }

    path.tangent = cp(lower.axis);
    path.visit(lower, 1);
    path.visit(upper, 1);
  };

  for (let row = 1; row < 3; row++) {
    const order = row % 2 ? [3, 2, 1, 0] : [0, 1, 2, 3];

    for (let pair = 0; pair < 2; pair++) {
      const firstCol = order[pair * 2]!,
        secondCol = order[pair * 2 + 1]!;

      path.visit(rows[row]![firstCol]!, 1);
      path.visit(rows[row]![secondCol]!, -1);
      path.visit(rows[row - 1]![secondCol]!, -1);

      if (pair === 0) {
        marks.push(path.length);
        path.visit(rows[row - 1]![order[2]!]!, 1);
      }
    }

    if (row === 1) {
      turnAtEdge(row, order[3]!);
      marks.push(path.length);
    }
  }

  const tailStart = cp(path.end),
    tailAxis = cp(path.tangent);

  path.arc(
    (a) => add(add(tailStart, tailAxis, 0.04 * Math.sin(a)), Z, 0.04 * (1 - Math.cos(a))),
    Z,
  );
  path.line(add(path.end, Z, 0.13));
  marks.push(path.length, path.length);

  return { beads: rows.flat(), path, marks };
}

// 教学步骤与路线进度保持对应。
const STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '从四珠梯式底行起步',
    instruction:
      '底行四颗灰珠已用梯式针连好，工作线从右侧珠上孔穿出。一次加入两颗新珠，再向下穿回底行的下一列。',
  },
  {
    time: 0.2,
    title: '完成第一行，并在边缘换向',
    instruction:
      '向上穿过再下一列，继续加两颗珠并回穿底行。到左边缘后，绕住已有线桥，再向上穿过边缘的两颗珠。',
  },
  {
    time: 0.4,
    title: '反向织第二行',
    instruction:
      '从左向右重复：加两颗新珠、向下穿过上一行的下一颗珠、向上穿过再下一颗。只在边缘换行时向上穿两颗。',
  },
  {
    time: 0.61,
    title: '织完第二行的另一对珠',
    instruction:
      '继续加入第二对珠，向下穿回上一行的边缘珠。两行成对倾斜的珠子连成鱼骨纹；转动视角可查看第一行边缘钩住的线桥。',
  },
  {
    time: GATHER,
    title: '收紧并整理鱼骨纹',
    instruction:
      '逐对整理并轻轻收线，让长圆米珠贴合为清楚的鱼骨纹，保持均匀张力。这是一块基础样片，保留线头，未演示藏线或装扣。',
  },
];

const loose = makeHerringbone(0);

/* 计算当前帧的路线和教学状态。 */
function getState(progress: number): LessonState {
  const p = clamp(progress),
    g = gather(p),
    model = g > 0 ? makeHerringbone(g) : loose;

  let checkpoint = 0;

  while (checkpoint + 1 < STEPS.length && p >= STEPS[checkpoint + 1]!.time) {
    checkpoint++;
  }

  const t0 = STEPS[checkpoint]!.time,
    t1 = STEPS[checkpoint + 1]?.time ?? 1;

  const length =
    model.marks[checkpoint]! +
    (model.marks[checkpoint + 1]! - model.marks[checkpoint]!) * ease((p - t0) / (t1 - t0));

  const points = [cp(model.path.points[0]!)];

  for (let i = 1; i < model.path.points.length; i++) {
    const start = model.path.distances[i - 1]!,
      end = model.path.distances[i]!;

    if (end <= length + 1e-10) {
      points.push(cp(model.path.points[i]!));
    } else {
      if (length > start + 1e-10) {
        points.push(
          mix(model.path.points[i - 1]!, model.path.points[i]!, (length - start) / (end - start)),
        );
      }

      break;
    }
  }

  // 保留准确、连续的线尖，同时避开极短的末段；几乎重合的末端采样环会让管面翻到里面去。
  while (
    points.length > 2 &&
    distance(points.at(-1)!, points.at(-2)!) < 0.5 * distance(points.at(-2)!, points.at(-3)!)
  ) {
    points.splice(points.length - 2, 1);
  }

  const active =
    p < GATHER ? model.path.passages.find((v) => length <= v.end + 1e-9)?.id : undefined;

  return {
    points,
    tip: cp(points.at(-1)!),
    checkpoint,
    color: '#976546',
    radius: LINE_RADIUS,
    hideMainTip: true,
    showEndLabels: false,
    beads: model.beads.map((b) => ({
      ...b,
      position: cp(b.position),
      axis: cp(b.axis),
      active: b.id === active,
      labelOpacity: 1 - g,
    })),
  };
}

// 这组工艺的课程入口。
export const HERRINGBONE_COURSES: Course[] = [
  {
    id: 'flat-herringbone',
    category: 'beads',
    name: '平面双珠鱼骨针',
    title: '成对加珠，织出鱼骨纹',
    description: '从梯式底行开始，成对加珠、回穿下一列，再在边缘换行。',
    material: '12 颗同尺寸长圆米珠 · 细珠线 · 珠针',
    materialNote:
      '四珠梯式底行已预先完成。选择形状与孔径一致的长圆米珠，每次加入一对，保持均匀张力。',
    duration: 62,
    initialProgress: 0,
    steps: STEPS,
    source: 'https://beadaholique.com/products/how-to-do-herringbone-stitch',
    sourceName: 'Beadaholique · Andrea Morici · How to Do Herringbone Stitch',
    getState,
  },
];
