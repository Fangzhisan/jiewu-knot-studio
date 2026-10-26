import type { Course, LessonState, LessonStep, LessonStrand, Vec3 } from './types';

/** 原创编织教学几何，不做布料或绳子物理模拟。编织阶段只延长路线，已经完成的路径段保持原样；最后 18% 用来连续收紧编带或打紧纬线。
 * 来源只用来核对工艺规则，没有使用外部照片或网格。
 * 三股编参考 Animated Knots、ABOK 2965，左右外股交替从中股上面跨过。
 * 四股编参考 Animated Knots 的 French Sinnet (2)、ABOK 2979：外股依次按上、下、上跨过其余三股，再换另一侧外股。
 * 这里不是另一种四股编 ABOK 2974。 */

const GREEN = '#326558';
const GOLD = '#c89543';
const TERRA = '#bd6f58';
const BLUE = '#597eaa';
const COLORS = [GREEN, GOLD, TERRA, BLUE];
const NAMES = ['绿', '金', '红', '蓝'];
const RADIUS = 0.055;
// 把进度限制在 0～1。
const clamp = (v: number) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
// 用平滑过渡控制动作，让相邻阶段接得顺。
const smooth = (t: number) => t * t * t * (10 - 15 * t + 6 * t * t);
// 在两值之间插值。
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
// 复制坐标，不改原数组。
const copy = (p: Vec3): Vec3 => [...p];
// 在两点之间插值。
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => a.map((v, i) => mix(v, b[i]!, t)) as Vec3;
// 计算两点间的直线距离。
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

// 找到当前教学步骤。
const checkpoint = (p: number, steps: readonly LessonStep[]) => {
  for (let i = steps.length - 1; i >= 0; i--) {
    if (p >= steps[i]!.time) {
      return i;
    }
  }

  return 0;
};

/* 沿直线补足采样点。 */
function line(a: Vec3, b: Vec3, divisions = 32): Vec3[] {
  return Array.from({ length: divisions + 1 }, (_, i) => lerp(a, b, i / divisions));
}

/* 保留指定高度之前的路线，切到一段中间时补出准确末点。 */
function prefixAtY(points: Vec3[], y: number, exactTip?: (y: number) => Vec3): Vec3[] {
  const result: Vec3[] = [copy(points[0]!)];

  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!,
      b = points[i]!;

    if (b[1] >= y - 1e-12) {
      result.push(copy(b));
    } else {
      if (a[1] > y + 1e-12) {
        result.push(exactTip ? exactTip(y) : lerp(a, b, (a[1] - y) / (a[1] - b[1])));
      }

      break;
    }
  }

  return result;
}

/* 把各股路径整理成主线和附加线股，并标出当前步骤。 */
function stateFromTracks(tracks: Vec3[][], p: number, steps: readonly LessonStep[]): LessonState {
  const points = tracks[0]!;

  return {
    points,
    tip: copy(points[points.length - 1]!),
    checkpoint: checkpoint(p, steps),
    color: GREEN,
    radius: RADIUS,
    showEndLabels: false,
    hideMainTip: true,
    strands: tracks.slice(1).map((path, i) => ({
      id: `strand-${i + 1}`,
      points: path,
      color: COLORS[i + 1]!,
      radius: RADIUS,
      label: p >= 1 ? '' : NAMES[i + 1],
    })),
  };
}

/* 一行交叉的左侧槽位及其上下穿越关系。 */
interface Crossing {
  left: number;
  leftOver: boolean;
}

/* 按交叉顺序记录每股换位路线，完成部分保持原样。 */
function braidTracks(count: number, crossings: Crossing[]) {
  const spacing = 0.55,
    height = 0.4,
    preparation = 1,
    tail = 0.4;

  const top = (preparation + height * crossings.length + tail) / 2;
  const start = top - preparation;
  // 把编织槽位换成横向坐标。
  const slotX = (slot: number) => (slot - (count - 1) / 2) * spacing;
  const tracks = Array.from({ length: count }, (_, i) =>
    line([slotX(i), top, 0], [slotX(i), start, 0]),
  );

  const order = Array.from({ length: count }, (_, i) => i);
  const rows: Array<Array<{ from: number; to: number; depth: number }>> = [];
  crossings.forEach(
    /* 逐项应用这一行的换位安排，保留每根绳各自的身份。 */ (crossing, row) => {
      rows.push([]);
      const leftId = order[crossing.left]!,
        rightId = order[crossing.left + 1]!;

      for (let slot = 0; slot < count; slot++) {
        const id = order[slot]!;
        const nextSlot = id === leftId ? slot + 1 : id === rightId ? slot - 1 : slot;
        const over = id === leftId ? crossing.leftOver : !crossing.leftOver;
        rows[row]![id] = {
          from: slotX(slot),
          to: slotX(nextSlot),
          depth: nextSlot === slot ? 0 : (over ? 1 : -1) * 0.12,
        };

        for (let sample = 1; sample <= 40; sample++) {
          const t = sample / 40;
          // 两端的一阶、二阶导数都归零，让相邻交叉段以竖直切线相接，曲率也不中途跳变。
          const bump = 64 * t ** 3 * (1 - t) ** 3;
          tracks[id]!.push([
            mix(slotX(slot), slotX(nextSlot), smooth(t)),
            start - (row + t) * height,
            nextSlot === slot ? 0 : (over ? 1 : -1) * 0.12 * bump,
          ]);
        }
      }

      [order[crossing.left], order[crossing.left + 1]] = [rightId, leftId];
    },
  );

  for (let slot = 0; slot < count; slot++) {
    const id = order[slot]!,
      end = tracks[id]!.at(-1)!;

    tracks[id]!.push(...line(end, [slotX(slot), -top, 0], 24).slice(1));
  }

  const finish = start - height * crossings.length;

  // 按当前交叉段的曲线直接求点，线尖不受采样稀疏影响。
  const exactPoint = (strand: number, y: number): Vec3 => {
    if (y >= start) {
      return [slotX(strand), y, 0];
    }

    if (y <= finish) {
      return [tracks[strand]!.at(-1)![0], y, 0];
    }

    const offset = (start - y) / height;
    const row = Math.min(crossings.length - 1, Math.floor(offset)),
      t = offset - row;

    const route = rows[row]![strand]!;

    return [mix(route.from, route.to, smooth(t)), y, route.depth * 64 * t ** 3 * (1 - t) ** 3];
  };

  return { tracks, top, start, finish, tail, exactPoint };
}

// 教学步骤与路线进度保持对应。
const THREE_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '分开三股',
    instruction: '从左到右放好绿、金、陶红三股，并固定上端。画面按交叉顺序逐段铺线。',
  },
  {
    time: 0.08,
    title: '左股压中股',
    instruction: '把左边绿色股从金色中股的上方移到中间；原中股换到左边。',
  },
  {
    time: 0.165,
    title: '右股压中股',
    instruction: '再把右边陶红股从当前中股的上方移到中间。每次看当前位置，不固定某一种颜色。',
  },
  {
    time: 0.25,
    title: '左右交替',
    instruction: '继续左外股压中股、右外股压中股。上方已经完成的辫段会一直保留。',
  },
  {
    time: 0.82,
    title: '均匀收紧辫身',
    instruction:
      '固定上端，均匀牵住三根尾股，让左右股距和交叉行距一起收密。绳径与上下关系保持不变，尾段随辫身自然移动。',
  },
];

// 教学步骤与路线进度保持对应。
const FOUR_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '排好四股',
    instruction: '从左到右放好绿、金、陶红、蓝四股，固定上端。本课展示四股斜纹扁辫。',
  },
  {
    time: 0.08,
    title: '绿股一上一下',
    instruction: '左外侧绿股向右走：压过金股、穿到陶红股下方，再压过蓝股，到达最右侧。',
  },
  {
    time: 0.08 + 0.68 / 3,
    title: '换新的左外股',
    instruction: '此时金股在最左。让金股按同样的上、下、上顺序穿过其余三股。',
  },
  {
    time: 0.08 + 1.36 / 3,
    title: '重复斜向穿编',
    instruction: '再从新的左外侧陶红股开始，依次上、下、上。每轮使用当前最左的一股，形成连续斜纹。',
  },
  {
    time: 0.82,
    title: '整理并收紧扁辫',
    instruction:
      '沿四根尾股均匀牵拉，把斜向辫段的横向股距与纵向行距一起收密，保持扁平。尾段留出牵引过渡，下一轮轮到左侧蓝股。',
  },
];

const threeGeometry = braidTracks(
  3,
  Array.from({ length: 8 }, (_, i) => ({ left: i % 2, leftOver: i % 2 === 0 })),
);

const fourGeometry = braidTracks(
  4,
  Array.from({ length: 9 }, (_, i) => ({ left: i % 3, leftOver: i % 3 !== 1 })),
);

/* 先放出编带路线，最后一章再收拢行距并拉出自由尾段。 */
function braidState(
  geometry: ReturnType<typeof braidTracks>,
  steps: readonly LessonStep[],
  progress: number,
): LessonState {
  const p = clamp(progress);
  const y =
    p <= 0.76
      ? mix(geometry.start, geometry.finish, clamp((p - 0.08) / 0.68))
      : mix(geometry.finish, -geometry.top, smooth(clamp((p - 0.76) / 0.06)));

  const gather = smooth(clamp((p - 0.82) / 0.18));
  const tracks = geometry.tracks.map((points, i) =>
    prefixAtY(points, y, (front) => geometry.exactPoint(i, front)).map(
      /* 在对应位置之间插值，逐项保持两套坐标的一致顺序。 */ (point): Vec3 => {
        // 上方准备段的高度和固定端不动，只缩短织好的行距（0.40 → 0.256）。自由尾段通过平移和延长缓缓拉出，不缩放整个场景。
        const anchorBlend = smooth(
          clamp((geometry.top - point[1]) / (geometry.top - geometry.start)),
        );

        const tailBlend = smooth(clamp((point[1] + geometry.top) / geometry.tail));
        const amount = gather * Math.min(anchorBlend, tailBlend);
        const rowScale = mix(1, 0.64, gather);
        const drawnFinish = geometry.start + (geometry.finish - geometry.start) * rowScale;
        const drawnY =
          point[1] >= geometry.start
            ? point[1]
            : point[1] >= geometry.finish
              ? geometry.start + (point[1] - geometry.start) * rowScale
              : drawnFinish + (point[1] - geometry.finish) * mix(1, 2, gather);

        return [point[0] * mix(1, 0.22, amount), drawnY, point[2] * mix(1, 0.54, amount)];
      },
    ),
  );

  return stateFromTracks(tracks, p, steps);
}

/* 织纹类型，决定经纬交叉处的上下顺序。 */
type FabricPattern = 'plain' | 'twill' | 'basket';
const WARP_COUNT = 8;
const ROW_COUNT = 8;
const GRID_GAP = 0.44;
const FABRIC_FINISHED_PITCH = 0.168;

/* 根据平纹、篮纹或斜纹规则，判断纬线此处该走经线上方还是下方。 */
function weftAbove(pattern: FabricPattern, row: number, col: number): boolean {
  if (pattern === 'plain') {
    return (row + col) % 2 === 0;
  }

  if (pattern === 'basket') {
    return (Math.floor(row / 2) + Math.floor(col / 2)) % 2 === 0;
  }

  return (((col - row) % 4) + 4) % 4 < 2;
}

/* 按五次贝塞尔权重合成这一点的三维坐标。 */
function quintic(controls: Vec3[], t: number): Vec3 {
  const q = 1 - t;
  const w = [
    q ** 5,
    5 * t * q ** 4,
    10 * t ** 2 * q ** 3,
    10 * t ** 3 * q ** 2,
    5 * t ** 4 * q,
    t ** 5,
  ];

  return [0, 1, 2].map((a) => controls.reduce((sum, p, i) => sum + p[a]! * w[i]!, 0)) as Vec3;
}

/* 按经纬交叉规则铺出连续纬线，打紧时重新计算间距和起伏。 */
function fabricGeometry(pattern: FabricPattern, packing = 0) {
  const pitch = mix(GRID_GAP, FABRIC_FINISHED_PITCH, packing);
  // 把列号换成当前间距下的横向位置。
  const xAt = (col: number) => (col - 3.5) * pitch;
  // 把行号换成当前间距下的纵向位置。
  const yAt = (row: number) => (3.5 - row) * pitch;
  const edge = xAt(7) + mix(0.44, 0.14, packing);
  const depth = mix(0.145, 0.04, packing);
  const points = line([mix(-2.55, -1.2, packing), yAt(0), 0], [-edge, yAt(0), 0], 28);
  const rowStarts: number[] = [];

  for (let row = 0; row < ROW_COUNT; row++) {
    rowStarts.push(points.length - 1);
    const direction = row % 2 === 0 ? 1 : -1;
    const nodes: Vec3[] = [[-edge, yAt(row), 0]];

    for (let col = 0; col < WARP_COUNT; col++) {
      nodes.push([xAt(col), yAt(row), weftAbove(pattern, row, col) ? depth : -depth]);
    }

    nodes.push([edge, yAt(row), 0]);

    if (direction < 0) {
      nodes.reverse();
    }

    for (let n = 1; n < nodes.length; n++) {
      const a = nodes[n - 1]!,
        b = nodes[n]!;

      for (let sample = 1; sample <= 24; sample++) {
        const t = sample / 24;
        points.push([mix(a[0], b[0], t), a[1], mix(a[2], b[2], smooth(t))]);
      }
    }

    if (row < ROW_COUNT - 1) {
      const x = direction * edge,
        y = yAt(row),
        nextY = yAt(row + 1);

      // 侧面的回头弯始终在所有经线外侧，与两行都以直切线、零端点曲率相接；两梭之间没有偷偷断线。
      const controls: Vec3[] = [
        [x, y, 0],
        [x + direction * 0.22, y, 0],
        [x + direction * 0.44, y, 0],
        [x + direction * 0.44, nextY, 0],
        [x + direction * 0.22, nextY, 0],
        [x, nextY, 0],
      ];

      for (let sample = 1; sample <= 40; sample++) {
        const t = sample / 40,
          angle = Math.PI * (0.5 - t);

        const arc: Vec3 = [
          x + direction * pitch * 0.5 * Math.cos(angle),
          (y + nextY) / 2 + pitch * 0.5 * Math.sin(angle),
          0,
        ];

        points.push(lerp(quintic(controls, t), arc, packing));
      }
    }
  }

  const lengths = [0];

  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths[i - 1]! + distance(points[i - 1]!, points[i]!));
  }

  const preparationLength = lengths[rowStarts[0]!]!;
  const warps = Array.from(
    { length: WARP_COUNT },
    /* 给这一列经线排好全部交叉点，前后层始终与纬线相反。 */ (_, col) => {
      const nodes: Vec3[] = [[xAt(col), mix(2.15, 1.15, packing), 0]];

      for (let row = 0; row < ROW_COUNT; row++) {
        nodes.push([xAt(col), yAt(row), (weftAbove(pattern, row, col) ? -1 : 1) * 0.04 * packing]);
      }

      nodes.push([xAt(col), mix(-2.15, -1.15, packing), 0]);
      const path: Vec3[] = [nodes[0]!];

      for (let n = 1; n < nodes.length; n++) {
        for (let sample = 1; sample <= 24; sample++) {
          const t = sample / 24,
            a = nodes[n - 1]!,
            b = nodes[n]!;

          path.push([a[0], mix(a[1], b[1], t), mix(a[2], b[2], smooth(t))]);
        }
      }

      return path;
    },
  );

  return {
    points,
    lengths,
    warps,
    preparationLength,
    rowLengths: rowStarts.map((i) => lengths[i]!),
    total: lengths.at(-1)!,
  };
}

/** 这是柔软纱线的连续接触包络，不是保持体积的刚性椭圆。交叉点保留可见宽度和完整厚度，附近的肩部适当压扁，让宽纱换层时不互相穿透；自由尾段再恢复完整截面。 */
function fabricThicknessScales(points: Vec3[], axis: 0 | 1, packing: number): number[] | undefined {
  if (packing <= 0) {
    return undefined;
  }

  const pitch = mix(GRID_GAP, FABRIC_FINISHED_PITCH, packing);
  const outerCrossing = 3.5 * pitch;
  const minimumScale = 0.36;

  return points.map(
    /* 按到最近交叉点的距离压薄肩部，交叉中心和自由尾段保留原厚度。 */ (point) => {
      const coordinate = point[axis];
      const nearestIndex = Math.max(0, Math.min(7, Math.round(coordinate / pitch + 3.5)));
      const nearestCrossing = (nearestIndex - 3.5) * pitch;
      const distanceToCrossing = Math.abs(coordinate - nearestCrossing);
      const shoulder = smooth(clamp(distanceToCrossing / (pitch * 0.22)));
      const contactRegion =
        1 - smooth(clamp((Math.abs(coordinate) - outerCrossing - pitch * 0.5) / (pitch * 0.28)));

      return 1 - (1 - minimumScale) * packing * shoulder * contactRegion;
    },
  );
}

/* 按累计长度截出已经织好的部分，并插值保留当前线尖。 */
function prefixAtLength(points: Vec3[], lengths: number[], amount: number): Vec3[] {
  const result: Vec3[] = [copy(points[0]!)];

  for (let i = 1; i < points.length; i++) {
    if (lengths[i]! <= amount + 1e-12) {
      result.push(copy(points[i]!));
    } else {
      if (amount > lengths[i - 1]! + 1e-12) {
        result.push(
          lerp(
            points[i - 1]!,
            points[i]!,
            (amount - lengths[i - 1]!) / (lengths[i]! - lengths[i - 1]!),
          ),
        );
      }

      break;
    }
  }

  return result;
}

/* 把一种织纹的步骤、说明和状态计算组装成课程。 */
function fabricCourse(
  pattern: FabricPattern,
  metadata: Pick<Course, 'id' | 'name' | 'title' | 'description' | 'source' | 'sourceName'>,
  instructions: [string, string, string],
): Course {
  const geometry = fabricGeometry(pattern);
  // 用这一行的累计线长分配时间，避免每行速度忽快忽慢。
  const rowTime = (row: number) =>
    0.08 +
    (0.74 * (geometry.rowLengths[row]! - geometry.preparationLength)) /
      (geometry.total - geometry.preparationLength);

  const steps: readonly LessonStep[] = [
    {
      time: 0,
      title: '分清经线与纬线',
      instruction: '八根绿色经线纵向固定，金色纬线横向穿行。画面保留间距，逐行展示组织原理。',
    },
    { time: 0.08, title: '穿入第一行', instruction: instructions[0] },
    { time: rowTime(1), title: '从边缘回织', instruction: instructions[1] },
    { time: rowTime(2), title: '重复组织规律', instruction: instructions[2] },
    {
      time: 0.82,
      title: '打纬，收拢织面',
      instruction:
        '均匀整理经纬，把织面压紧。观察经纬线贴合、纱线在接触处压扁，形成连续紧密的织面；上下组织保持不变。',
    },
  ];

  return {
    ...metadata,
    category: 'weaving',
    material: '经线、纬线与编织框',
    materialNote: '绿色经线 · 金色纬线；先展开观察，最后收拢成紧密织面。',
    duration: 48,
    initialProgress: 0.48,
    steps,
    /* 计算当前帧的路线和教学状态。 */
    getState(progress) {
      const p = clamp(progress);
      const amount = mix(geometry.preparationLength, geometry.total, clamp((p - 0.08) / 0.74));
      const beating = smooth(clamp((p - 0.82) / 0.18));
      const packed = beating > 0 ? fabricGeometry(pattern, beating) : geometry;
      const points =
        beating > 0 ? packed.points : prefixAtLength(geometry.points, geometry.lengths, amount);

      const flatness = mix(1, 0.45, beating);
      const strands: LessonStrand[] = Array.from({ length: WARP_COUNT }, (_, col) => ({
        id: `warp-${col}`,
        points: packed.warps[col]!,
        color: GREEN,
        radius: RADIUS,
        flatness,
        thicknessScales: fabricThicknessScales(packed.warps[col]!, 1, beating),
        label: p >= 1 ? '' : `${col + 1}`,
      }));

      return {
        points,
        tip: copy(points.at(-1)!),
        checkpoint: checkpoint(p, steps),
        strands,
        color: GOLD,
        radius: RADIUS,
        flatness,
        thicknessScales: fabricThicknessScales(points, 0, beating),
        showEndLabels: false,
        hideMainTip: true,
      };
    },
  };
}

// 这组工艺的课程入口。
export const WEAVING_COURSES: Course[] = [
  {
    id: 'three-strand-braid',
    category: 'weaving',
    name: '三股辫',
    title: '三股辫 · 左右交替进入中间',
    description: '跟随三种颜色，看懂外股轮流压过中股的基本辫法。',
    material: '三根不同颜色的软绳',
    materialNote: '绿、金、陶红三股；逐段铺线原理示意，实作需固定起点与末端。',
    duration: 36,
    initialProgress: 0.46,
    steps: THREE_STEPS,
    source: 'https://www.animatedknots.com/three-strand-braid-knot',
    sourceName: 'Animated Knots · Three Strand Braid',
    getState: (p) => braidState(threeGeometry, THREE_STEPS, p),
  },
  {
    id: 'four-strand-flat-braid',
    category: 'weaving',
    name: '四股扁辫',
    title: '四股扁辫 · 一上一下斜向穿编',
    description: '用四种颜色追踪外股依次跨过三根邻股的斜纹扁辫。',
    material: '四根不同颜色的软绳',
    materialNote: '绿、金、陶红、蓝四股；采用 French Sinnet (2) 的交替穿插规则。',
    duration: 42,
    initialProgress: 0.5,
    steps: FOUR_STEPS,
    source: 'https://www.animatedknots.com/french-sinnet-knot-two',
    sourceName: 'Animated Knots · French Sinnet (2)',
    getState: (p) => braidState(fourGeometry, FOUR_STEPS, p),
  },
  fabricCourse(
    'plain',
    {
      id: 'plain-weave',
      name: '平纹编织',
      title: '平纹编织 · 一上一下相互交错',
      description: '金色纬线逐根交替越过、穿下绿色经线，下一行反过来。',
      source: 'https://schachtspindle.com/blogs/faqs/weaving-terms',
      sourceName: 'Schacht · Weaving Terms',
    },
    [
      '金色纬线从左向右，每次压过一根绿经线，再穿下一根；重复一上一下。',
      '到右边后转向回织。每根经线在上一行若被压过，这一行就从它下方通过。',
      '继续逐行反转：一上一下、一下上一。相邻行与相邻列都交替，形成棋盘式交错。',
    ],
  ),
  fabricCourse(
    'twill',
    {
      id: 'twill-weave-2-2',
      name: '2/2 斜纹编织',
      title: '2/2 斜纹 · 每行错开一根',
      description: '每次越过两根、穿下两根，经纬交点逐行错位形成斜纹。',
      source:
        'https://schachtspindle.com/blogs/archives/progressing-from-a-rigid-heddle-loom-to-a-shaft-loom',
      sourceName: 'Schacht · 2/2 Straight Twill',
    },
    [
      '金色纬线连续压过两根绿经线，再连续穿下两根；沿整行重复二上二下。',
      '下一行把这组二上二下向右错开一根经线。观察相同高度的交点开始沿斜线排列。',
      '每一行继续错开一根，四行完成一个循环。它与平纹的逐根上下交替不同。',
    ],
  ),
  fabricCourse(
    'basket',
    {
      id: 'basket-weave-2-2',
      name: '2×2 篮纹编织',
      title: '2×2 篮纹 · 两根一组交替',
      description: '两根经线与两行纬线分别成组，交织出更大的方格。',
      source: 'https://schachtspindle.com/blogs/archives/summer-curtains-in-hemp',
      sourceName: 'Schacht · Summer Curtains in Hemp',
    },
    [
      '把绿经线每两根看成一组。金色纬线依次压过一组，再穿下一组。',
      '第二行保持与第一行相同的上下顺序；这两行一起构成一组纬线。',
      '第三、四行整组反转上下关系。每两行换一次，每两根经线成一组，得到 2×2 方格。',
    ],
  ),
];
