import type { Course, LessonState, LessonStep, Vec3 } from './types';

/** 原创四绳编结路线。DMC 图解区分了左右镜像的半结（平整的平结）、同侧重复的半结（螺旋结），以及错开四绳分组的交错平结网。
 * https://www.dmc.com/GR/en-GB/sbs-macrame-stitch-diagrams
 * 路线按工作端的真实走向逐渐显示，最后再收紧。这里是可重复求值的教学几何，不是动态绳索求解器。 */
const SOURCE = 'https://www.dmc.com/GR/en-GB/sbs-macrame-stitch-diagrams';
const COLORS = [
  '#326558',
  '#bd6f58',
  '#597eaa',
  '#c89543',
  '#8a6b9c',
  '#699985',
  '#ca8c6c',
  '#668a9b',
];

const RADIUS = 0.045;
// 把进度限制在 0～1。
const clamp = (v: number) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));

// 让动作起停更平缓。
const ease = (v: number) => {
  const t = clamp(v);

  return t * t * t * (10 - 15 * t + 6 * t * t);
};

// 在两值之间插值。
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
// 在两点之间插值。
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => [
  mix(a[0], b[0], t),
  mix(a[1], b[1], t),
  mix(a[2], b[2], t),
];

// 计算两点间的直线距离。
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/* 一段绳路及它的显示时间、累计长度。 */
interface Part {
  from: number;
  to: number;
  points: Vec3[];
  lengths: number[];
  length: number;
}
/* 可选的编结方式，决定四绳分组与半结朝向。 */
type Mode = 'square' | 'spiral' | 'net';
/* 当前四绳分组的成员及其横向中心。 */
interface Group {
  ids: [number, number, number, number];
  centre: number;
}

/* 按弧长重新分配采样点，保留首尾并控制相邻点的距离。 */
function resample(points: Vec3[], samples: number): Vec3[] {
  const lengths = [0];

  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths[i - 1]! + distance(points[i - 1]!, points[i]!));
  }

  const total = lengths.at(-1)!;
  let segment = 1;
  const result: Vec3[] = [[...points[0]!]];

  for (let i = 1; i < samples; i++) {
    const offset = (total * i) / samples;

    while (segment < points.length - 1 && lengths[segment]! < offset) {
      segment++;
    }

    const span = lengths[segment]! - lengths[segment - 1]!;
    result.push(
      lerp(
        points[segment - 1]!,
        points[segment]!,
        span > 0 ? (offset - lengths[segment - 1]!) / span : 0,
      ),
    );
  }

  result.push([...points.at(-1)!]);

  return result;
}

/** 用二阶连续的 B 样条连接半结，两端都保留竖直直线引出段。 */
function rounded(guides: Vec3[], samples: number): Vec3[] {
  const first = guides[0]!,
    last = guides.at(-1)!;

  const padded = [first, first, ...guides, last, last];
  const points: Vec3[] = [[...first]];

  for (let span = 0; span < padded.length - 3; span++) {
    const a = padded[span]!,
      b = padded[span + 1]!,
      c = padded[span + 2]!,
      d = padded[span + 3]!;

    for (let i = 1; i <= 16; i++) {
      const t = i / 16,
        q = 1 - t;

      const weights = [
        q ** 3 / 6,
        (4 - 6 * t * t + 3 * t ** 3) / 6,
        (1 + 3 * t + 3 * t * t - 3 * t ** 3) / 6,
        t ** 3 / 6,
      ];

      points.push(
        [0, 1, 2].map(
          (axis) =>
            a[axis]! * weights[0]! +
            b[axis]! * weights[1]! +
            c[axis]! * weights[2]! +
            d[axis]! * weights[3]!,
        ) as Vec3,
      );
    }
  }

  return resample(points, samples);
}

/* 在两点间拉出顺滑引线，纵向匀速，横向与深度缓慢过渡。 */
function lead(a: Vec3, b: Vec3, samples = 48): Vec3[] {
  return Array.from({ length: samples + 1 }, (_, i): Vec3 => {
    const t = i / samples,
      u = ease(t);

    return [mix(a[0], b[0], u), mix(a[1], b[1], t), mix(a[2], b[2], u)];
  });
}

/* 给一段路线附上显示时间和累计长度，方便按进度截取。 */
function part(points: Vec3[], from: number, to: number): Part {
  const lengths = [0];

  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths[i - 1]! + distance(points[i - 1]!, points[i]!));
  }

  return { points, from, to, lengths, length: lengths.at(-1)! };
}

/* 按各段的时间窗口放出路径，未开始的段先留着。 */
function visible(parts: Part[], progress: number): Vec3[] {
  const points: Vec3[] = [];

  // 接入新的采样点，并避开与末点重合的零长度段。
  const append = (point: Vec3) => {
    if (!points.length || distance(points.at(-1)!, point) > 1e-8) {
      points.push([...point]);
    }
  };

  for (const section of parts) {
    if (progress < section.from) {
      break;
    }

    const amount =
      section.to <= section.from
        ? 1
        : ease((progress - section.from) / (section.to - section.from));

    const length = section.length * amount;

    for (let i = 0; i < section.points.length; i++) {
      if (section.lengths[i]! <= length + 1e-10) {
        append(section.points[i]!);
      } else {
        if (i > 0) {
          const start = section.lengths[i - 1]!,
            span = section.lengths[i]! - start;

          if (length > start + 1e-10) {
            append(lerp(section.points[i - 1]!, section.points[i]!, (length - start) / span));
          }
        }

        break;
      }
    }

    if (amount < 1) {
      break;
    }
  }

  // 移动线尖可能非常靠近已有采样点。把这条极短末边并入前一条，免得端盖和管面方向冒出人为的曲率尖峰；线尖的位置仍然准确。
  while (
    points.length > 2 &&
    distance(points.at(-1)!, points.at(-2)!) <
      Math.max(0.008, distance(points.at(-2)!, points.at(-3)!) * 0.75)
  ) {
    points.splice(points.length - 2, 1);
  }

  return points;
}

/** 左绳先行的半结：第一根工作绳从两根芯绳前面跨过，在右侧另一根工作绳下方经过；另一根从芯绳后面绕行，再从左侧开环穿到前面，压在第一根上方。
 * 沿 X 镜像可得到相反方向的半结，但两根工作绳各自的身份要单独保留。 */
function halfRoutes(packing: number): [Vec3[], Vec3[]] {
  const front = mix(0.26, 0.096, packing);
  const behind = -front;
  const crossing = mix(0.48, 0.215, packing);
  const a: Vec3[] = [
    [-0.45, 0.42, 0],
    [-0.45, 0.32, 0],
    [-0.5, 0.12, 0.02],
    [-0.5, -0.08, front],
    [-0.28, -0.14, front],
    [0.08, -0.14, front],
    [0.4, -0.14, front],
    [0.45, -0.28, 0.02],
    [0.45, -0.35, 0],
    [0.45, -0.42, 0],
  ];

  const b: Vec3[] = [
    [0.45, 0.42, 0],
    [0.45, 0.32, 0],
    [0.48, 0.22, crossing * 0.24],
    [0.56, 0.1, crossing * 0.74],
    [0.7, 0.04, crossing],
    [0.76, -0.12, crossing * 0.85],
    [0.76, -0.28, crossing * 0.8],
    [0.56, -0.34, crossing * 0.85],
    [0.38, -0.36, crossing * 0.85],
    [0.31, -0.36, crossing * 0.15],
    [0.23, -0.36, behind * 0.9],
    [0.08, -0.36, behind],
    [-0.2, -0.32, behind],
    [-0.32, -0.15, behind],
    [-0.32, 0.1, behind],
    [-0.32, 0.18, behind * 0.4],
    [-0.32, 0.18, crossing * 0.4],
    [-0.5, 0.1, crossing],
    [-0.64, -0.04, crossing],
    [-0.6, -0.13, crossing * 0.64],
    [-0.5, -0.22, crossing * 0.24],
    [-0.45, -0.32, 0],
    [-0.45, -0.42, 0],
  ];

  return [a, b];
}

/* 按平结、螺旋结或交错网的分组规则，接出每根绳的路线。 */
function makeTracks(mode: Mode, packing: number): Part[][] {
  const count = mode === 'net' ? 8 : 4;
  const halves = mode === 'spiral' ? 6 : mode === 'net' ? 6 : 4;
  const unitHeight = mix(0.62, 0.58, packing);
  const scaleX = mix(mode === 'net' ? 1.3 : 1.6, 0.65, packing);
  const worker = 0.45 * scaleX,
    core = mix(0.17, 0.0455, packing);

  const top = mode === 'net' ? 1.95 : mode === 'spiral' ? 1.95 : 1.2;
  const prep = mode === 'square' ? 0.8 : 0.65;
  const groupOffset = mix(0.99, 0.64, packing);
  const rowGap = mix(0.32, 0.28, packing);
  const twist = mode === 'spiral' ? mix(Math.PI / 18, Math.PI / 8, packing ** 3) : 0;

  // 计算螺旋结当前转角，两端渐缓，避免固定段突然扭转。
  const angleAt = (half: number) => {
    const edge = 0.7;

    // 让扭转角在边缘缓缓增加，与中间段顺滑衔接。
    const ramp = (x: number) => {
      const t = clamp(x / edge);

      return edge * (2.5 * t ** 4 - 3 * t ** 5 + t ** 6);
    };

    const offset =
      half < edge
        ? ramp(half)
        : half > halves - edge
          ? halves - edge - ramp(halves - half)
          : half - edge / 2;

    return ((offset * halves) / (halves - edge)) * twist;
  };

  const tracks: Part[][] = Array.from({ length: count }, () => []);
  // 把坐标绕指定轴旋转，保留原来的长度。
  const rotate = (point: Vec3, angle: number): Vec3 => [
    point[0] * Math.cos(angle) + point[2] * Math.sin(angle),
    point[1],
    -point[0] * Math.sin(angle) + point[2] * Math.cos(angle),
  ];

  // 按行选择参与编结的四绳小组，交错网隔行换组。
  const groupsAt = (row: number): Group[] =>
    mode !== 'net'
      ? [{ ids: [0, 1, 2, 3], centre: 0 }]
      : row % 2 === 0
        ? [
            { ids: [0, 1, 2, 3], centre: -groupOffset },
            { ids: [4, 5, 6, 7], centre: groupOffset },
          ]
        : [{ ids: [2, 3, 4, 5], centre: 0 }];

  const initialGroups = groupsAt(0);
  const positions: Vec3[] = Array.from({ length: count }, () => [0, top, 0]);

  for (const group of initialGroups) {
    const offsets = [-worker, -core, core, worker];
    group.ids.forEach((id, index) => {
      positions[id] = [group.centre + offsets[index]!, top, 0];
    });
  }

  positions.forEach(
    /* 逐项应用这一行的换位安排，保留每根绳各自的身份。 */ (position, id) => {
      // 上方固定点不动，只在它们下面收拢实际编结区域。
      const originalWorker = 0.45 * (mode === 'net' ? 1.3 : 1.6);
      const initialOffset =
        id % 4 === 0
          ? -originalWorker
          : id % 4 === 3
            ? originalWorker
            : id % 4 === 1
              ? -0.17
              : 0.17;

      const anchorX = initialOffset + (mode === 'net' ? (id < 4 ? -0.99 : 0.99) : 0);
      tracks[id]!.push(part(lead([anchorX, top + prep, 0], position), 0, 0));
    },
  );
  let y = top;

  for (let half = 0; half < halves; half++) {
    const row = Math.floor(half / 2),
      groups = groupsAt(row);

    const from = 0.08 + (half * 0.68) / halves,
      to = 0.08 + ((half + 1) * 0.68) / halves,
      duration = to - from;

    const direction = mode === 'spiral' || half % 2 === 0 ? 1 : -1;
    const nextTop = y - (mode === 'net' && half > 0 && half % 2 === 0 ? rowGap : 0);
    const starts = positions.map((point): Vec3 => [point[0], nextTop, point[2]]);
    const workers = new Map<number, { role: 0 | 1; centre: number }>();

    for (const group of groups) {
      const frontId = mode === 'spiral' && half % 2 === 1 ? group.ids[3] : group.ids[0];
      const behindId = mode === 'spiral' && half % 2 === 1 ? group.ids[0] : group.ids[3];
      workers.set(frontId, { role: 0, centre: group.centre });
      workers.set(behindId, { role: 1, centre: group.centre });
      starts[frontId] = rotate([group.centre - direction * worker, nextTop, 0], angleAt(half));
      starts[behindId] = rotate([group.centre + direction * worker, nextTop, 0], angleAt(half));
      starts[group.ids[1]] = rotate([group.centre - core, nextTop, 0], angleAt(half));
      starts[group.ids[2]] = rotate([group.centre + core, nextTop, 0], angleAt(half));
    }

    starts.forEach((point, id) => {
      if (distance(positions[id]!, point) > 1e-8) {
        tracks[id]!.push(part(lead(positions[id]!, point), from, from + duration * 0.14));
      }
    });
    const routes = halfRoutes(packing);

    for (let id = 0; id < count; id++) {
      const working = workers.get(id);

      if (working) {
        const transformed = routes[working.role].map((point): Vec3 => {
          const down = (0.42 - point[1]) / 0.84;

          return rotate(
            [working.centre + direction * point[0] * scaleX, nextTop - down * unitHeight, point[2]],
            angleAt(half + down),
          );
        });

        const path = rounded(transformed, working.role === 0 ? 110 : 200);
        tracks[id]!.push(
          part(
            path,
            from + duration * (working.role === 0 ? 0.14 : 0.55),
            from + duration * (working.role === 0 ? 0.55 : 1),
          ),
        );
        positions[id] = [...path.at(-1)!];
      } else {
        const start = starts[id]!;
        const unrotated = rotate(start, -angleAt(half));
        const path = Array.from({ length: 49 }, (_, i): Vec3 =>
          rotate(
            [unrotated[0], nextTop - (unitHeight * i) / 48, unrotated[2]],
            angleAt(half + i / 48),
          ),
        );

        tracks[id]!.push(part(path, from + duration * 0.14, from + duration * 0.28));
        positions[id] = [...path.at(-1)!];
      }
    }

    y = nextTop - unitHeight;
  }

  positions.forEach((point, id) => {
    const outward = mode === 'net' ? 1.1 : id === 0 || id === 3 ? 1.4 : 1;
    tracks[id]!.push(
      part(
        lead(point, [point[0] * outward, y - mix(0.28, 0.48, packing), point[2] * outward]),
        0.76,
        0.82,
      ),
    );
  });

  return tracks;
}

// 教学步骤与路线进度保持对应。
const SQUARE_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '分清芯线和工作绳',
    instruction: '固定四根绳的上端：红、蓝两根是芯线；绿、金两根外股负责穿绕。先认清各自的自由端。',
  },
  {
    time: 0.08,
    title: '左起半平结',
    instruction:
      '绿绳从两根芯线前方跨到右侧，压在金绳下面。金绳绕到芯线后方，再从左侧绿绳留下的圈中穿到前面。',
  },
  {
    time: 0.25,
    title: '镜像完成另一半',
    instruction:
      '绿绳现在位于右侧：从右向左跨过芯线。金绳再次从芯线后方绕过，并穿出右侧绳圈；左右相反的两半组成一个平结。',
  },
  {
    time: 0.42,
    title: '重复形成平结柱',
    instruction:
      '继续左起、右起交替。芯线保持在中间；同一根绿工作绳依次在两半的前方形成横杠，结柱保持平整。',
  },
  {
    time: 0.82,
    title: '均匀拉紧两侧',
    instruction:
      '稳住两根芯线，均匀拉住绿、金两根工作绳，把每一半推紧靠拢；检查左右圈口闭合、结柱保持平整。',
  },
];

// 教学步骤与路线进度保持对应。
const SPIRAL_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '准备两芯两工作绳',
    instruction: '红、蓝两根作芯线，绿、金两根作工作绳。外侧工作绳要预留比芯线更多的长度。',
  },
  {
    time: 0.08,
    title: '完成一个左起半结',
    instruction:
      '当前左工作绳先跨过芯线前方，另一根从芯线后方绕回，并穿出左侧圈口，完成一个半平结。',
  },
  {
    time: 0.08 + 0.68 / 6,
    title: '仍从同一侧起手',
    instruction:
      '工作绳交换了左右位置。仍从当前结面的左侧开始同样的半结，不做镜像的另一半。留意起手的颜色随位置更换。',
  },
  {
    time: 0.42,
    title: '顺着结柱自然转动',
    instruction:
      '继续同向重复，让结柱随着穿绕逐渐转动。不要强行把它摊平；这正是半平结螺旋与平结柱的区别。',
  },
  {
    time: 0.82,
    title: '推紧并整理螺旋',
    instruction: '保持芯线张力，逐个推紧半结，再轻拉两根工作绳，使螺旋紧密而均匀。',
  },
];

// 教学步骤与路线进度保持对应。
const NET_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '八根绳分成两组',
    instruction:
      '准备时从左到右按上方端帽编号辨认八根绳。第一行按 1–4、5–8 各四根一组，每组中间两根作芯线、外侧两根作工作绳。',
  },
  {
    time: 0.08,
    title: '先编第一行平结',
    instruction: '两组分别编左起、右起的两个半结。每组都形成完整平结，再开始下一行。',
  },
  {
    time: 0.08 + 0.68 / 3,
    title: '中间四根交替分组',
    instruction:
      '第二行暂时留出最左两根和最右两根，只用中间 3–6 四根编一个平结；原来的芯线、工作绳会改变角色。',
  },
  {
    time: 0.08 + 1.36 / 3,
    title: '回到两组形成网眼',
    instruction:
      '第三行重新按 1–4、5–8 分组各编平结。上下行错开，形成连接两组的菱形网眼；这些网眼是成品结构。',
  },
  {
    time: 0.82,
    title: '收紧结芯并理匀网眼',
    instruction:
      '逐个拉紧平结的两根工作绳，收合结芯中的圈口，再整理各行连接绳的松紧，使菱形网眼均匀。',
  },
];

/* 把编结模式、文字说明和状态计算组合成一门课程。 */
function course(
  mode: Mode,
  metadata: Pick<
    Course,
    'id' | 'name' | 'title' | 'description' | 'material' | 'materialNote' | 'duration'
  >,
  steps: readonly LessonStep[],
): Course {
  let loose: Part[][] | undefined;

  return {
    ...metadata,
    category: 'weaving',
    projectionFocus: 'curves',
    initialProgress: 0.48,
    source: SOURCE,
    sourceName: 'DMC · Macramé Stitch Guide',
    steps,
    /* 计算当前帧的路线和教学状态。 */
    getState(progress): LessonState {
      const p = clamp(progress),
        gathering = ease((p - 0.82) / 0.18);

      const paths = (
        gathering > 0 ? makeTracks(mode, gathering) : (loose ??= makeTracks(mode, 0))
      ).map((track) => visible(track, p));

      let checkpoint = 0;

      for (let i = steps.length - 1; i >= 0; i--) {
        if (p >= steps[i]!.time) {
          checkpoint = i;
          break;
        }
      }

      const points = paths[0]!;

      return {
        points,
        tip: [...points.at(-1)!],
        checkpoint,
        color: COLORS[0],
        radius: RADIUS,
        showEndLabels: false,
        hideMainTip: true,
        strands: paths.slice(1).map((path, i) => ({
          id: `macrame-${i + 1}`,
          points: path,
          color: COLORS[i + 1]!,
          radius: RADIUS,
          label: p < 1 ? `${i + 2}` : '',
        })),
      };
    },
  };
}

// 这组工艺的课程入口。
export const MACRAME_COURSES: Course[] = [
  course(
    'square',
    {
      id: 'macrame-square-column',
      name: '四线平结编织',
      title: '四线平结 · 两半相反，结柱平整',
      description: '用两根工作绳围绕两根芯线，左右交替编出一段平结柱。',
      material: '四根软棉绳、固定夹或编织板',
      materialNote: '绿、金工作绳；红、蓝芯线。沿工作端路线逐段示意，最后收紧。',
      duration: 44,
    },
    SQUARE_STEPS,
  ),
  course(
    'spiral',
    {
      id: 'macrame-half-knot-spiral',
      name: '半平结螺旋编织',
      title: '半平结螺旋 · 同侧起手，顺势转动',
      description: '连续重复同向半平结，让两根工作绳围绕芯线形成螺旋结柱。',
      material: '四根软棉绳、固定夹或编织板',
      materialNote: '两根芯线、两根较长工作绳；始终从当前结面的同一侧起手。',
      duration: 52,
    },
    SPIRAL_STEPS,
  ),
  course(
    'net',
    {
      id: 'macrame-alternating-square-net',
      name: '交替平结网',
      title: '交替平结网 · 四根一组，隔行错开',
      description: '以八根绳演示两组、一组、两组的错行平结，组成菱形网眼。',
      material: '八根等粗软绳、固定夹或编织板',
      materialNote: '第一行分两组，第二行使用中间四根；网眼是有意保留的结构。',
      duration: 58,
    },
    NET_STEPS,
  ),
];

/** 收紧路线预先围绕同样的芯绳整理。固定绳半径的约束处理收掉松圈和过长的裸露芯绳段，运行时只做可逆插值，不重新求解。
 * 坐标保留精确的 0.0001 整数单位；时间和空间差分按四帧一组做无损 Huffman 编码。 */
interface BakedGather {
  counts: number[];
  times: number[];
  order: number[];
  blockFrames: number;
  sizes: number[];
  orders: number[];
  payload: string;
}

/** 还原原始整数坐标，不用近似几何去猜原来的路线。 */
function decodeGather(data: BakedGather, stride: number): Int16Array {
  const bytes = atob(data.payload);
  const values = new Int16Array(data.times.length * stride);
  let blockOffset = 0;

  /* 每块使用自己的码表，还原其中的姿态帧。 */
  for (let block = 0; block < data.sizes.length; block++) {
    const lengths = Array.from({ length: 32 }, (_, i) => bytes.charCodeAt(blockOffset + i));
    const left = [0],
      right = [0],
      symbols = [-1];

    let code = 0;

    /* 按码长重建规范 Huffman 解码树。 */
    for (let bits = 1; bits <= Math.max(...lengths); bits++) {
      for (let symbol = 0; symbol < 32; symbol++) {
        if (lengths[symbol] === bits) {
          let node = 0;

          for (let bit = bits - 1; bit >= 0; bit--) {
            const children = (code >>> bit) & 1 ? right : left;

            if (!children[node]) {
              children[node] = symbols.length;
              left.push(0);
              right.push(0);
              symbols.push(-1);
            }

            node = children[node]!;
          }

          symbols[node] = symbol;
          code++;
        }
      }

      code <<= 1;
    }

    const lookup = new Int32Array(1024);

    /* 预建 10 位前缀表，短码直接查表。 */
    for (let prefix = 0; prefix < lookup.length; prefix++) {
      let node = 0,
        bits = 0;

      while (symbols[node]! < 0 && bits < 10) {
        node = (prefix >>> bits) & 1 ? right[node]! : left[node]!;
        bits++;
      }

      lookup[prefix] = symbols[node]! >= 0 ? (bits << 16) | (symbols[node]! + 1) : -node - 1;
    }

    let cursor = blockOffset + 32,
      buffer = 0,
      available = 0;

    const order = data.orders[block]!;
    const firstFrame = block * data.blockFrames,
      lastFrame = Math.min(data.times.length, firstFrame + data.blockFrames);

    for (let frame = firstFrame; frame < lastFrame; frame++) {
      let offset = frame * stride;

      for (const count of data.counts) {
        for (let axis = 0; axis < 3; axis++) {
          let previous = 0,
            beforePrevious = 0;

          for (let point = 0; point < count; point++) {
            while (available < 10) {
              buffer |= (bytes.charCodeAt(cursor++) || 0) << available;
              available += 8;
            }

            const entry = lookup[buffer & 1023]!;
            let symbol: number;

            if (entry > 0) {
              const bits = entry >>> 16;
              buffer >>>= bits;
              available -= bits;
              symbol = (entry & 65535) - 1;
            } else {
              buffer >>>= 10;
              available -= 10;
              let node = -entry - 1;

              /* 长码沿解码树读完剩余位。 */
              while (symbols[node]! < 0) {
                if (!available) {
                  buffer = bytes.charCodeAt(cursor++) || 0;
                  available = 8;
                }

                node = buffer & 1 ? right[node]! : left[node]!;
                buffer >>>= 1;
                available--;
              }

              symbol = symbols[node]!;
            }

            /* 符号 31 后跟变长整数，补足超出部分。 */
            if (symbol === 31) {
              let extra = 0,
                shift = 0,
                byte: number;

              /* 扩展整数每字节取 7 位，高位为 1 时继续读。 */
              do {
                while (available < 8) {
                  buffer |= (bytes.charCodeAt(cursor++) || 0) << available;
                  available += 8;
                }

                byte = buffer & 255;
                buffer >>>= 8;
                available -= 8;
                extra |= (byte & 127) << shift;
                shift += 7;
              } while (byte & 128);

              symbol += extra;
            }

            /* 撤销 ZigZag 编码，再还原空间差分。 */
            let value =
              ((symbol >>> 1) ^ -(symbol & 1)) +
              previous +
              (order === 1 ? previous - beforePrevious : 0);

            beforePrevious = previous;
            previous = value;
            const at = offset + point * 3 + axis;

            if (frame > 0) {
              value += values[at - stride]!;
            }

            if (order === 2 && frame > 1) {
              value += values[at - stride]! - values[at - 2 * stride]!;
            }

            values[at] = value;
          }
        }

        offset += count * 3;
      }
    }

    blockOffset += data.sizes[block]!;
  }

  return values;
}

/* 把预存收紧姿态接到展开演示后面，保持 82% 处连续。 */
function createGatheredState(
  unfoldedState: Course['getState'],
  data: BakedGather,
): Course['getState'] {
  const initial = unfoldedState(0.82);
  const original = [initial.points, ...(initial.strands ?? []).map((strand) => strand.points)];
  const stride = data.counts.reduce((sum, count) => sum + count * 3, 0);
  const offsets = data.counts.map((_, i) =>
    data.counts.slice(0, i).reduce((sum, count) => sum + count * 3, 0),
  );

  let values: Int16Array | undefined;
  let parameters: number[][] | undefined;
  const cache = new Map<number, Vec3[][]>();

  /* 首次需要收紧数据时才解码，并建立原路径到姿态采样的对应关系。 */
  function decode() {
    if (values) {
      return;
    }

    values = decodeGather(data, stride);

    // 逐段累计路径长度，为两套采样点建立相同的弧长坐标。
    const lengths = (points: Vec3[]) => {
      const arc = [0];

      for (let i = 1; i < points.length; i++) {
        arc.push(arc[i - 1]! + distance(points[i - 1]!, points[i]!));
      }

      return arc;
    };

    parameters = data.counts.map(
      /* 读取这一股在当前姿态中的坐标，再映射回原采样位置。 */ (count, cord) => {
        const coarse = Array.from(
          { length: count },
          (_, i): Vec3 =>
            [0, 1, 2].map((axis) => values![offsets[cord]! + i * 3 + axis]! / 10000) as Vec3,
        );

        const coarseArc = lengths(coarse),
          originalArc = lengths(original[data.order[cord]!]!);

        let segment = 1;

        return originalArc.map((length) => {
          const target = (length / originalArc.at(-1)!) * coarseArc.at(-1)!;

          while (segment < count - 1 && coarseArc[segment]! < target) {
            segment++;
          }

          return (
            segment -
            1 +
            (target - coarseArc[segment - 1]!) / (coarseArc[segment]! - coarseArc[segment - 1]!)
          );
        });
      },
    );
  }

  /* 读取或复用一帧收紧姿态，再按原路线的采样位置取点。 */
  function frame(index: number): Vec3[][] {
    // 第一帧直接使用原始顶点，所以 82% 的衔接位置完全一致。
    if (index === 0) {
      return data.order.map((cord) => original[cord]!);
    }

    const existing = cache.get(index);

    if (existing) {
      return existing;
    }

    const paths = data.counts.map((count, cord) => {
      const offset = index * stride + offsets[cord]!;

      // 读取一个坐标分量，越过端点时沿端部方向外推。
      const coordinate = (point: number, axis: number) => {
        // 把保存的整数坐标还原到场景单位。
        const read = (i: number) => values![offset + i * 3 + axis]! / 10000;

        if (point < 0) {
          return 2 * read(0) - read(1);
        }

        if (point >= count) {
          return 2 * read(count - 1) - read(count - 2);
        }

        return read(point);
      };

      return parameters![cord]!.map((parameter) => {
        const i = Math.floor(parameter),
          t = parameter - i,
          q = 1 - t;

        const weights = [
          q ** 3 / 6,
          (4 - 6 * t * t + 3 * t ** 3) / 6,
          (1 + 3 * t + 3 * t * t - 3 * t ** 3) / 6,
          t ** 3 / 6,
        ];

        return [0, 1, 2].map((axis) =>
          weights.reduce((sum, weight, j) => sum + coordinate(i + j - 1, axis) * weight, 0),
        ) as Vec3;
      });
    });

    cache.set(index, paths);

    return paths;
  }

  return /* 给这一股配好路线和线端编号，最后展示时按需要收起文字。 */ (progress): LessonState => {
    const p = clamp(progress);

    if (p <= 0.82) {
      return unfoldedState(p);
    }

    decode();
    const amount = ease((p - 0.82) / 0.18);
    let next = 1;

    while (next < data.times.length - 1 && data.times[next]! < amount) {
      next++;
    }

    const before = next - 1,
      t = (amount - data.times[before]!) / (data.times[next]! - data.times[before]!);

    const a = frame(before),
      b = frame(next);

    const ordered = a.map((path, cord) => path.map((point, i) => lerp(point, b[cord]![i]!, t)));
    const paths = original.map((_, cord) => ordered[data.order.indexOf(cord)]!);

    /* 只缓存当前插值需要的两帧。 */
    for (const key of cache.keys()) {
      if (key !== before && key !== next) {
        cache.delete(key);
      }
    }

    return {
      ...initial,
      points: paths[0]!,
      tip: [...paths[0]!.at(-1)!],
      checkpoint: 4,
      strands: initial.strands!.map((strand, i) => ({
        ...strand,
        points: paths[i + 1]!,
        label: p < 1 ? strand.label : '',
      })),
    };
  };
}

const gatherLoaders: Record<
  Mode,
  /* 调用方提供的状态计算函数。 */ () => Promise<{ default: BakedGather }>
> = {
  square: () => import('./data/macrame-square'),
  spiral: () => import('./data/macrame-spiral'),
  net: () => import('./data/macrame-net'),
};

for (const [i, mode] of (['square', 'spiral', 'net'] as const).entries()) {
  const entry = MACRAME_COURSES[i]!;
  const unfolded = entry.getState;
  let data: BakedGather | undefined;
  let preparing: Promise<void> | undefined;
  let gathered: Course['getState'] | undefined;
  // 每门课只发起一次加载，并发切换共用同一个请求。失败后清掉缓存，让下一次明确重试还能重新加载。
  entry.prepare = () =>
    (preparing ??= gatherLoaders[mode]()
      .then((module) => {
        data = module.default;
      })
      .catch((error) => {
        preparing = undefined;
        throw error;
      }));

  entry.getState = (progress): LessonState => {
    if (!data) {
      throw new Error('Course "' + entry.id + '" is not prepared; await course.prepare() first.');
    }

    gathered ??= createGatheredState(unfolded, data);

    return gathered(progress);
  };
}
