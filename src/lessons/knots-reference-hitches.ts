import type { Course, LessonState, LessonStep, LessonSupport, Vec3 } from './types';

// 展开阶段留出观察间距；末态按绳径整理接触关系，不求解摩擦或承载能力。
const TAU = Math.PI * 2;
const ROPE_RADIUS = 0.045;
const clamp = (value: number) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => a.map((v, i) => mix(v, b[i]!, t)) as Vec3;

/** 让每个动作在步骤边界缓入缓出。 */
function ease(value: number) {
  const t = clamp(value);

  return t * t * (3 - 2 * t);
}

/** 按真实转数定位动作边界，缓入缓出后仍在完成一整圈时换步骤。 */
function inverseEase(value: number) {
  let low = 0,
    high = 1;
  for (let i = 0; i < 40; i++) {
    const middle = (low + high) / 2;
    if (ease(middle) < value) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}

/** 保存连续绳路和动作边界；工作端沿弧长前进。 */
class HitchPath {
  points: Vec3[] = [];
  lengths: number[] = [];
  marks: number[] = [];
  total = 0;

  /** 不重复相邻端点，避免管壁出现零长切线。 */
  add(point: Vec3) {
    const previous = this.points.at(-1);
    const length = previous ? distance(previous, point) : 0;

    if (previous && length < 1e-8) {
      return;
    }

    this.total += length;
    this.points.push(point);
    this.lengths.push(this.total);
  }

  /** 直线部分也保留足够密的采样。 */
  line(point: Vec3) {
    const from = this.points.at(-1)!;
    const count = Math.max(2, Math.ceil(distance(from, point) / 0.02));

    for (let i = 1; i <= count; i++) {
      this.add(lerp(from, point, i / count));
    }
  }

  /** 用可控的圆弯连接绕圈，控制点不会改变前后穿压顺序。 */
  cubic(b: Vec3, c: Vec3, d: Vec3) {
    const a = this.points.at(-1)!;

    for (let i = 1; i <= 72; i++) {
      const t = i / 72;
      const s = 1 - t;
      this.add(
        [0, 1, 2].map(
          (axis) =>
            a[axis]! * s ** 3 +
            3 * b[axis]! * s * s * t +
            3 * c[axis]! * s * t * t +
            d[axis]! * t ** 3,
        ) as Vec3,
      );
    }
  }

  /** 标记已经完成的一段穿绕动作。 */
  mark() {
    this.marks.push(this.total);
  }

  /** 以均匀弧长截出正在编排的绳段，最后一个点始终是真实工作端。 */
  prefix(amount: number) {
    const length = Math.max(0.25, Math.min(this.total, amount));
    const count = Math.max(24, Math.ceil(length / 0.02));
    let cursor = 1;

    return Array.from({ length: count + 1 }, (_, i) => {
      const offset = (length * i) / count;

      while (cursor < this.lengths.length - 1 && this.lengths[cursor]! < offset) {
        cursor++;
      }

      return lerp(
        this.points[cursor - 1]!,
        this.points[cursor]!,
        (offset - this.lengths[cursor - 1]!) / (this.lengths[cursor]! - this.lengths[cursor - 1]!),
      );
    });
  }
}

/** 当前步骤由课程自己的时间表决定。 */
function stepAt(progress: number, times: readonly number[]) {
  for (let index = times.length - 1; index >= 0; index--) {
    if (progress >= times[index]!) {
      return index;
    }
  }

  return 0;
}

/** 把动作边界与文字说明连在同一时间表上。 */
function steps(
  times: readonly number[],
  content: readonly (readonly [string, string])[],
): LessonStep[] {
  return content.map(([title, instruction], index) => ({
    time: times[index]!,
    title,
    instruction,
  }));
}

/** 最后一步才收拢全绳，其余步骤沿实际工作端路线逐段展开。 */
function frame(
  path: HitchPath,
  progress: number,
  times: readonly number[],
  supports: LessonSupport[],
  color: string,
  budget: number,
  reserveKind: 'eye' | 'timber',
): LessonState {
  const checkpoint = stepAt(progress, times);
  const cuts = [0.35, ...path.marks, path.total, path.total];
  const end = times[checkpoint + 1] ?? 1;
  const amount = mix(
    cuts[checkpoint]!,
    cuts[checkpoint + 1]!,
    ease((progress - times[checkpoint]!) / (end - times[checkpoint]!)),
  );
  const worked = path.prefix(amount);
  const reserve = reserveConnection(reserveKind);
  for (const point of worked.slice(1)) reserve.add(point);
  const remaining = Math.max(0.1, budget - reserve.total);
  const coil = new HitchPath();
  const eye = reserveKind === 'eye';
  const radius = 0.6,
    pitch = 0.16 / TAU;
  let angle = remaining / Math.hypot(radius, pitch);
  const center: Vec3 = eye ? [-1.5, -2.6, 0.38] : [-2.1, 3.2, 0];
  const direction = eye ? 1 : -1;
  const count = Math.max(24, Math.ceil(remaining / 0.012));
  // 离散圆弧比解析弧略短，按最终采样段长校正，避免时间轴上产生绳长漂移。
  for (let i = 0; i < 4; i++) {
    const q = angle / count;
    const segment = Math.hypot(2 * radius * Math.sin(q / 2), pitch * q);
    const derivative = (radius * radius * Math.sin(q) + pitch * pitch * q) / segment;
    angle -= (count * segment - remaining) / derivative;
  }
  for (let i = 0; i <= count; i++) {
    const theta = -angle + (angle * i) / count;
    coil.add([
      center[0] + radius * Math.cos(theta),
      center[1] + direction * radius * Math.sin(theta),
      center[2] + pitch * theta,
    ]);
  }
  for (const point of reserve.points.slice(1)) coil.add(point);
  const points = coil.points;

  return {
    points,
    tip: [...points.at(-1)!],
    checkpoint,
    radius: ROPE_RADIUS,
    color,
    supports,
    endCaps: { start: '1B', end: '1A' },
  };
}

/** 主绳端的旁置松绳圈供绳，工作端仍是真正穿环、穿圈的最末点。 */
function reserveConnection(kind: 'eye' | 'timber') {
  const path = new HitchPath();
  if (kind === 'eye') {
    path.add([-0.9, -2.6, 0.38]);
    path.cubic([-0.9, -2.22, 0.3961], [0, -2.5, 0.38], [0, -2.1, 0.38]);
  } else {
    path.add([-1.5, 3.2, 0]);
    path.cubic([-1.5, 2.85, 0.01485], [-0.65, 3.05, 0], [-0.65, 2.7, 0]);
  }
  return path;
}

const RING: LessonSupport = {
  id: 'fixed-eye',
  kind: 'ring',
  position: [0, 1.8, 0],
  axis: [0, 0, 1],
  radius: 0.45,
  length: 0.15,
  color: '#a9a6a0',
};

/** 两门环眼课先穿过同一个固定环，绕的是环的下缘，不穿入金属。 */
function throughEye(tension: number) {
  const path = new HitchPath();
  const turnRadius = mix(0.38, 0.122, tension);
  path.add([0, -2.1, 0.38]);
  path.cubic([0, -0.7, 0.38], [0, -0.5, turnRadius], [0, 0, turnRadius]);
  path.line([0, 1.35, turnRadius]);
  path.mark();

  for (let i = 1; i <= 100; i++) {
    const angle = (Math.PI * i) / 100;
    path.add([0, 1.35 + turnRadius * Math.sin(angle), turnRadius * Math.cos(angle)]);
  }

  path.mark();

  return { path, standingZ: turnRadius };
}

const HALF_TIMES = [0, 0.15, 0.34, 0.62, 0.84] as const;

/** 单个半扣的回穿口在来绳外侧，工作端从来绳后方穿出。 */
function halfHitchPath(tension: number) {
  const { path, standingZ } = throughEye(tension);
  const radius = mix(0.45, 0.092, tension);
  const rise = mix(0.4, 0.105, tension);
  const outward = mix(0.18, 0.096, tension);
  const entryY = mix(0.1, 0.96, tension);
  const reach = mix(0.38, 0.11, tension);
  const lastControl: Vec3 = [
    radius + reach + mix(0.08, 0.06, tension),
    entryY - mix(0.4, 0.24, tension),
    -standingZ - mix(0.4, 0.03, tension),
  ];
  const bend: Vec3 = [radius + reach, entryY - mix(0.38, 0.22, tension), standingZ - 0.12];
  path.cubic([0, mix(0.93, 1.18, tension), -standingZ], lastControl, bend);
  const entryHandle = mix(0.15, 0.08, tension);
  path.cubic(
    bend.map((v, i) => v + mix(0.55, 0.8, tension) * (v - lastControl[i]!)) as Vec3,
    [radius, entryY - entryHandle * (0.7 + rise / (TAU * radius)), standingZ - entryHandle],
    [radius, entryY, standingZ],
  );

  for (let i = 1; i <= 200; i++) {
    const t = i / 200;
    const angle = Math.PI / 2 - TAU * t;
    const r = radius + outward * ease((t - 0.7) / 0.3);
    path.add([
      r * Math.sin(angle),
      entryY + rise * t + 0.7 * r * Math.cos(angle),
      standingZ + r * Math.cos(angle),
    ]);

    if (i === 150) {
      path.mark();
    }
  }

  const end = path.points.at(-1)!;
  const tailLift = mix(0.3, 0.2, tension);
  path.cubic(
    [end[0], end[1] + tailLift * (0.7 + rise / (TAU * (radius + outward))), end[2] + tailLift],
    [0.9, mix(0.34, 0.94, tension), standingZ + mix(0.25, 0.11, tension)],
    [1.23, mix(0.12, 0.77, tension), standingZ + mix(0.17, 0.09, tension)],
  );

  return path;
}

/** 半扣始终保持一圈绕主绳和一次回穿，不增加第二个扣结。 */
function halfHitchState(progress: number) {
  const p = clamp(progress);
  const tension = ease((p - HALF_TIMES.at(-1)!) / (1 - HALF_TIMES.at(-1)!));

  return frame(
    halfHitchPath(tension),
    p,
    HALF_TIMES,
    [RING],
    '#b97b52',
    LENGTH_BUDGETS.half,
    'eye',
  );
}

const DOUBLE_TIMES = [0, 0.14, 0.3, 0.5, 0.66, 0.84] as const;

/** 双半结是工作端在主绳上组成的双套结构，固定环只绕半转。 */
function twoHalfHitchesPath(tension: number) {
  const { path, standingZ } = throughEye(tension);
  const r = mix(0.42, 0.092, tension);
  const halfSeparation = mix(0.42, 0.055, tension);
  const pitch = mix(0.18, 0.125, tension);
  const lift = mix(0.27, 0.098, tension);
  const gate = 0.36;
  const polar = (along: number, angle: number, radius: number): Vec3 => [
    radius * Math.sin(angle),
    mix(0.15, 0.94, tension) - along + 0.6 * radius * Math.cos(angle),
    standingZ + radius * Math.cos(angle),
  ];
  const entry = polar(-halfSeparation, gate, r);
  const leadX = mix(-0.95, -0.31, tension);
  const leadEnd: Vec3 = [leadX, mix(0.85, 0.97, tension), standingZ + mix(0.2, -0.04, tension)];
  const leadNext: Vec3 = [leadX, leadEnd[1], standingZ + r];
  path.cubic(
    [0, mix(0.95, 1.02, tension), -standingZ],
    leadEnd.map((v, i) => v - 0.6 * (leadNext[i]! - v)) as Vec3,
    leadEnd,
  );
  path.cubic(
    leadNext,
    [
      entry[0] - mix(0.24, 0.08, tension),
      entry[1] + mix(0.054, 0.018, tension),
      entry[2] + mix(0.09, 0.03, tension),
    ],
    entry,
  );

  for (let i = 1; i <= 160; i++) {
    const t = i / 160;
    path.add(
      polar(
        mix(-halfSeparation, -halfSeparation - pitch, ease(t)),
        gate + (TAU - 2 * gate) * t,
        r + lift * ease((t - 0.65) / 0.35),
      ),
    );
  }

  path.mark();

  // 斜跨段在两圈前面；第二圈的绳尾从它后面穿出，形成双套的压绳关系。
  const bridgeStart = path.points.at(-1)!;
  const bridgeEnd = polar(halfSeparation + pitch, TAU + gate, r + lift);
  const bridgeHandle = mix(0.32, 0.16, tension);
  const bridgeSide = bridgeHandle * Math.tan(gate);
  path.cubic(
    [bridgeStart[0] + bridgeHandle, bridgeStart[1] + 0.6 * bridgeSide, bridgeStart[2] + bridgeSide],
    [bridgeEnd[0] - bridgeHandle, bridgeEnd[1] + 0.6 * bridgeSide, bridgeEnd[2] + bridgeSide],
    bridgeEnd,
  );

  path.mark();

  for (let i = 1; i <= 160; i++) {
    const t = i / 160;
    path.add(
      polar(
        mix(halfSeparation + pitch, halfSeparation, ease(t)),
        TAU + gate + (TAU - 2 * gate) * t,
        r + lift * (1 - ease(t / 0.35)),
      ),
    );
  }

  const end = path.points.at(-1)!;
  path.cubic(
    [end[0] + 0.12, end[1] + 0.03, end[2] + 0.035],
    [0.75, end[1] - 0.08, standingZ + 0.06],
    [1.2, end[1] - 0.18, standingZ + 0.06],
  );

  return path;
}

/** 整理两圈间距，最后仍保留自由绳尾和可辨认的交叉。 */
function twoHalfHitchesState(progress: number) {
  const p = clamp(progress);
  const tension = ease((p - DOUBLE_TIMES.at(-1)!) / (1 - DOUBLE_TIMES.at(-1)!));

  return frame(
    twoHalfHitchesPath(tension),
    p,
    DOUBLE_TIMES,
    [RING],
    '#668b63',
    LENGTH_BUDGETS.double,
    'eye',
  );
}

const TIMBER_TIMES = [0, 0.12, 0.28, 0.44, 0.56, 0.68, 0.84] as const;
const TIMBER: LessonSupport = {
  id: 'practice-log',
  kind: 'cylinder',
  position: [0, 0, 0],
  axis: [0, 0, 1],
  radius: 1,
  length: 1.3,
  color: '#b5a082',
};

/** 系木结的三次反绕围住的是自身回绳，不是上方受拉主绳。 */
function timberHitchPath(tension: number) {
  const path = new HitchPath();
  const radius = mix(1.52, 1.047, tension);
  const twistRadius = mix(0.23, 0.112, tension);
  const throatRadius = mix(0.3, 0.093, tension);
  const standingX = mix(-0.65, -0.45, tension);
  const throatY = mix(1.65, 1.22, tension);
  const startAngle = 2.2;
  const endAngle = 0.78;
  const twistEndAngle = -0.57;
  // 反绕从木料与主圈之间通过时，主圈局部让出一个绳径；其余段贴住木料。
  const bedRadius = (angle: number) => {
    const a = angle > Math.PI ? angle - TAU : angle;
    const raw = (endAngle - a) / (endAngle - twistEndAngle);
    const t = Math.abs(raw) < 1e-9 ? 0 : Math.abs(raw - 1) < 1e-9 ? 1 : raw;
    const lift =
      t >= 0 && t <= 1
        ? (1 - Math.cos(Math.PI / 2 + 3 * TAU * ease(t))) / 2
        : t > 1 && t < 1.16
          ? 0.5 * (1 - ease((t - 1) / 0.16))
          : 0;

    return radius + tension * twistRadius * lift;
  };
  const circle = (angle: number): Vec3 => [
    bedRadius(angle) * Math.cos(angle),
    bedRadius(angle) * Math.sin(angle),
    0,
  ];
  const start = circle(startAngle);
  path.add([-0.65, 2.7, 0]);
  path.cubic(
    [-0.65, 2.4, 0],
    [standingX, mix(2.05, 1.7, tension), 0],
    [standingX, mix(1.85, 1.42, tension), 0],
  );
  path.cubic(
    [standingX, mix(1.55, 1.17, tension), 0],
    [start[0] + 0.25 * Math.sin(startAngle), start[1] - 0.25 * Math.cos(startAngle), 0],
    start,
  );
  path.mark();

  for (let i = 1; i <= 300; i++) {
    path.add(circle(mix(startAngle, TAU + endAngle, i / 300)));
  }

  path.mark();
  const returnStart = path.points.at(-1)!;
  path.cubic(
    [returnStart[0] - 0.2 * Math.sin(endAngle), returnStart[1] + 0.2 * Math.cos(endAngle), 0],
    [standingX + mix(0.3, 0.16, tension), throatY, -throatRadius],
    [standingX, throatY, -throatRadius],
  );

  // 从主绳后方绕到前方，再折回刚才的绕木绳段。
  for (let i = 1; i <= 100; i++) {
    const angle = Math.PI + (Math.PI * i) / 100;
    path.add([standingX + throatRadius * Math.sin(angle), throatY, throatRadius * Math.cos(angle)]);
  }

  path.mark();
  const twistPoint = (t: number): Vec3 => {
    const angle = mix(endAngle, twistEndAngle, t);
    const turn = Math.PI / 2 + 3 * TAU * ease(t);
    const radial = bedRadius(angle) + twistRadius * Math.cos(turn);

    return [radial * Math.cos(angle), radial * Math.sin(angle), twistRadius * Math.sin(turn)];
  };
  const twistStart = twistPoint(0);
  path.cubic(
    [standingX + mix(0.35, 0.55, tension), throatY, throatRadius],
    [
      twistStart[0] - 0.16 * Math.sin(endAngle),
      twistStart[1] + 0.16 * Math.cos(endAngle),
      twistRadius,
    ],
    twistStart,
  );

  const turnMarks = [inverseEase(1 / 3), inverseEase(2 / 3)];
  for (let i = 1; i <= 360; i++) {
    for (const boundary of turnMarks) {
      if (boundary > (i - 1) / 360 && boundary <= i / 360) {
        path.add(twistPoint(boundary));
        path.mark();
      }
    }
    path.add(twistPoint(i / 360));
  }

  const last = path.points.at(-1)!;
  const tailAngle = twistEndAngle - 0.45;
  const tailRadius = radius + mix(0.18, 0.16, tension);
  path.cubic(
    [
      last[0] + 0.18 * Math.sin(twistEndAngle),
      last[1] - 0.18 * Math.cos(twistEndAngle),
      twistRadius,
    ],
    [tailRadius * Math.cos(tailAngle), tailRadius * Math.sin(tailAngle) + 0.15, twistRadius],
    [tailRadius * Math.cos(tailAngle), tailRadius * Math.sin(tailAngle) - 0.4, twistRadius],
  );

  return path;
}

/** 收拢后反绕段仍留在木料外侧，三圈次序和工作端连续性不变。 */
function timberHitchState(progress: number) {
  const p = clamp(progress);
  const tension = ease((p - TIMBER_TIMES.at(-1)!) / (1 - TIMBER_TIMES.at(-1)!));

  return frame(
    timberHitchPath(tension),
    p,
    TIMBER_TIMES,
    [TIMBER],
    '#738b9a',
    LENGTH_BUDGETS.timber,
    'timber',
  );
}

/** 总绳长固定；展开所需长度从主端松绳圈取用，收紧的松量仍在自由绳上。 */
const LENGTH_BUDGETS = {
  half: halfHitchPath(0).total + reserveConnection('eye').total + 0.9,
  double: twoHalfHitchesPath(0).total + reserveConnection('eye').total + 0.9,
  timber: timberHitchPath(0).total + reserveConnection('timber').total + 0.9,
};

/** 参照公开结型、独立编写路线和说明的三门固定结课程。 */
export const REFERENCE_HITCH_COURSES: Course[] = [
  {
    id: 'reference-half-hitch',
    category: 'knots',
    name: '半扣结',
    title: '半扣结 · 看懂绕主绳与回穿',
    description: '先穿过固定环，再绕主绳、穿回圈口，辨认一个半扣的构成。',
    material: '一根软绳 + 固定环',
    materialNote:
      '使用便于辨认绳头的软绳和光滑固定环。左下松绳圈是备用余绳，1A 始终是穿绕的工作端。',
    duration: 22,
    initialProgress: 0.68,
    steps: steps(HALF_TIMES, [
      [
        '分清两端',
        '1B 一侧是主绳与备用松绳，1A 是工作端；从松绳圈取用绳长，把工作端带向固定环的下缘。',
      ],
      ['穿过固定环', '让工作端从环孔通过，绕过环的下缘，回到主绳旁。'],
      ['绕过主绳', '工作端绕主绳转一圈，留出松开的圈口，观察它从前方绕到后方。'],
      ['从圈口穿回', '把工作端从刚形成的圈口穿出，使回穿段经过来绳后方，再向右引出绳尾。'],
      ['收拢并辨认', '轻拉主绳和绳尾整理交叉：只有一个半扣。它是组合结的基础，单独使用并不可靠。'],
    ]),
    source: 'https://knots3d.com/zh-CN/%E5%8D%8A%E6%89%A3%E7%BB%93',
    sourceName: 'Knots 3D · Half Hitch · ABOK #50',
    application: {
      scenarios: ['home', 'fixing'],
      task: '认识组合固定结中最基本的半扣动作。',
      focus: '穿环、绕主绳与一次回穿',
      boundary: '单个半扣不应独立承担固定任务；本课不用于吊装、攀登或救援。',
    },
    projectionBounds: { minX: -0.7, maxX: 1.25, minY: -0.4, maxY: 2.35 },
    getState: halfHitchState,
  },
  {
    id: 'reference-two-half-hitches',
    category: 'knots',
    name: '双半结',
    title: '双半结 · 在主绳上连做两个半扣',
    description: '工作端穿过固定环后，在主绳上形成两个同向半扣，观察两圈与压绳段。',
    material: '一根软绳 + 固定环',
    materialNote:
      '环固定在稳定位置，使用一根软绳并留够工作尾；左下松绳圈是备用余绳，先松着排清穿绕。',
    duration: 30,
    initialProgress: 0.7,
    steps: steps(DOUBLE_TIMES, [
      ['辨认主绳', '1B 所在的长绳段是主绳，工作端 1A 向固定环移动。'],
      ['穿环折回', '将工作端穿过固定环，绕过环下缘后折回。这一步只有半转，没有额外的完整绕环。'],
      ['绕出第一圈', '工作端从主绳一侧绕到另一侧，形成第一圈，暂时保持松开以看清绳路。'],
      ['交叉并续绳', '让回绕段跨过前面的绳段，将工作端送向下一圈；保留交叉处的前后次序。'],
      [
        '同向再绕并穿出',
        '沿同一方向完成第二圈，并从斜跨段后方穿出绳尾。两个同向半扣组成主绳上的双套结构。',
      ],
      [
        '整理两圈',
        '拉主绳并整理工作端，使两圈并排贴合。逐一核对两圈方向与绳尾穿出位置，保留足够绳尾。',
      ],
    ]),
    source: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%8D%8A%E7%BB%93',
    sourceName: 'Knots 3D · Two Half Hitches · ABOK #1710',
    application: {
      scenarios: ['fixing', 'camping', 'garden'],
      task: '练习把轻型营地绳系到固定环上。',
      focus: '环眼连接与两个同向半扣',
      boundary: '本课是无载荷练习，不模拟湿绳、光滑绳或反复松紧下的滑移，不用于人员承重。',
    },
    projectionBounds: { minX: -0.8, maxX: 1.25, minY: -0.6, maxY: 2.35 },
    getState: twoHalfHitchesState,
  },
  {
    id: 'reference-timber-hitch',
    category: 'knots',
    name: '系木结',
    title: '系木结 · 围住木料再反绕自身',
    description: '围绕圆木、绕回主绳，再沿自身绳段反绕三圈，完成可辨认的系木结构。',
    material: '一根软绳 + 圆木练习件',
    materialNote:
      '选择无尖刺的小圆木与足够长的软绳。左上松绳圈是备用余绳；正对木料截面观察结体，旋转视角可看反绕关系。',
    duration: 36,
    initialProgress: 0.72,
    steps: steps(TIMBER_TIMES, [
      ['布置绳线', '1B 是受拉主绳方向，将工作端 1A 带到圆木的一侧，并预留回绕长度。'],
      ['围绕圆木', '让工作端围绕圆木经过下方，再回到上方另一侧，形成包住木料的大绳圈。'],
      ['绕回主绳', '工作端从主绳后方绕到前方，再折向刚才围木的那一段绳。'],
      ['反绕第一圈', '沿围木绳段向回绕一整圈。这里绕的是自身回绳，不是继续缠绕受拉主绳。'],
      ['反绕第二圈', '继续沿同一方向向下反绕，第二圈与第一圈分开排列。'],
      ['反绕第三圈', '完成第三圈并留下自由绳尾，沿路径检查三圈都包住同一段围木绳。'],
      [
        '整理贴合',
        '保持反绕圈的顺序，轻拉主绳让围木绳圈收拢。三圈只是本课演示值，实际缠绕量需按绳材、木料与用途判断。',
      ],
    ]),
    source: 'https://knots3d.com/zh-CN/%E7%B3%BB%E6%9C%A8%E7%BB%93',
    sourceName: 'Knots 3D · Timber Hitch · ABOK #1665',
    application: {
      scenarios: ['fixing', 'binding', 'camping'],
      task: '用小圆木练习围木与沿自身反绕的系木结。',
      focus: '围木大圈、绕主绳与三次反绕',
      boundary:
        '仅作桌面结构练习；松载时会松脱，不是起重吊具或人员承重方案，也不包含实际拖运操作。',
    },
    projectionBounds: { minX: -1.75, maxX: 1.75, minY: -1.65, maxY: 1.95 },
    getState: timberHitchState,
  },
];
