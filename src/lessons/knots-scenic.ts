import type { Course, LessonState, LessonStep, LessonSupport, Vec3 } from './types';

// 教学路线按进度直接生成，收紧时保留交叉顺序和绳子粗细。
// 这里演示的是整理形状，不计算真实受力。
const TAU = Math.PI * 2;
/** 步骤起点，末尾的 1 用于计算最后一步时长。 */
const TIMES = [0, 0.18, 0.4, 0.64, 0.82, 1] as const;
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
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => a.map((v, k) => mix(v, b[k]!, t)) as Vec3;
/** 计算两点距离。 */
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** 查找当前步骤。 */
function atStep(p: number) {
  for (let i = 4; i >= 0; i--) {
    if (p >= TIMES[i]!) {
      return i;
    }
  }

  return 0;
}

/** 记录绳路、弧长和步骤分界，支持平滑与截取。 */
class Route {
  points: Vec3[] = [];
  lengths: number[] = [];
  marks: number[] = [];
  total = 0;
  /** 追加非重复点并累计弧长。 */
  add(p: Vec3) {
    const previous = this.points.at(-1);
    const d = previous ? distance(previous, p) : 0;

    if (previous && d < 1e-9) {
      return;
    }

    this.total += d;
    this.points.push([...p]);
    this.lengths.push(this.total);
  }
  /** 等距采样一段直线。 */
  line(to: Vec3) {
    const from = this.points.at(-1)!;
    const n = Math.max(2, Math.ceil(distance(from, to) / 0.018));

    for (let i = 1; i <= n; i++) {
      this.add(lerp(from, to, i / n));
    }
  }
  /** 从当前末端接一段贝塞尔回弯。 */
  cubic(b: Vec3, c: Vec3, d: Vec3) {
    const a = this.points.at(-1)!;

    for (let i = 1; i <= 80; i++) {
      const t = i / 80,
        s = 1 - t;

      this.add(
        [0, 1, 2].map(
          (k) => a[k]! * s ** 3 + 3 * b[k]! * s ** 2 * t + 3 * c[k]! * s * t * t + d[k]! * t ** 3,
        ) as Vec3,
      );
    }
  }
  /** 记录教学动作的弧长分界。 */
  mark() {
    this.marks.push(this.total);
  }
  /** 平滑绳路，并换算步骤标记的弧长。 */
  smooth() {
    // 先把编排的折线修成 C2 连续曲线，再生成管壁圆环。
    // 后面的间距检查都应基于这条最终曲线，不能拿控制折线代替。
    const oldTotal = this.total,
      sampled = this.prefix(oldTotal);

    const controls = sampled.filter((_, i) => i % 6 === 0);

    if (distance(controls.at(-1)!, sampled.at(-1)!) > 1e-9) {
      controls.push(sampled.at(-1)!);
    }

    const closed = distance(controls[0]!, controls.at(-1)!) < 1e-6;
    const first = controls[0]!,
      last = controls.at(-1)!;

    if (closed) {
      controls.pop();
    }

    const padded = closed
      ? [controls.at(-1)!, ...controls, controls[0]!, controls[1]!]
      : [first, first, ...controls, last, last];

    this.points = [];
    this.lengths = [];
    this.total = 0;

    for (let span = 0; span < padded.length - 3; span++) {
      for (let i = 0; i <= 8; i++) {
        const t = i / 8,
          t2 = t * t,
          t3 = t2 * t;

        const weights = [
          (1 - t) ** 3 / 6,
          (4 - 6 * t2 + 3 * t3) / 6,
          (1 + 3 * t + 3 * t2 - 3 * t3) / 6,
          t3 / 6,
        ];

        this.add(
          [0, 1, 2].map((k) =>
            weights.reduce((sum, w, j) => sum + w * padded[span + j]![k]!, 0),
          ) as Vec3,
        );
      }
    }

    if (closed) {
      this.add([...this.points[0]!]);
    }

    this.marks = this.marks.map((mark) => (mark / oldTotal) * this.total);
  }
  /** 按弧长截取并均匀采样可见绳段。 */
  prefix(amount: number) {
    const length = Math.max(0.25, Math.min(this.total, amount)),
      n = Math.max(24, Math.ceil(length / 0.018));

    let cursor = 1;

    return Array.from({ length: n + 1 }, (_, i) => {
      const x = (length * i) / n;

      while (cursor < this.lengths.length - 1 && this.lengths[cursor]! < x) {
        cursor++;
      }

      return lerp(
        this.points[cursor - 1]!,
        this.points[cursor]!,
        (x - this.lengths[cursor - 1]!) / (this.lengths[cursor]! - this.lengths[cursor - 1]!),
      );
    });
  }
}

/** 平滑路线后按步骤显露，收紧时显示整绳。 */
function shown(route: Route, p: number) {
  route.smooth();

  if (p >= 0.82) {
    return route.prefix(route.total);
  }

  const i = atStep(p),
    cuts = [0.35, ...route.marks, route.total];

  return route.prefix(
    mix(cuts[i]!, cuts[i + 1]!, ease((p - TIMES[i]!) / (TIMES[i + 1]! - TIMES[i]!))),
  );
}

/** 组装带支撑物的课程画面。 */
function state(
  route: Route,
  p: number,
  radius: number,
  supports: LessonSupport[],
  color: string,
): LessonState {
  const points = shown(route, p);

  return {
    points,
    tip: [...points.at(-1)!],
    radius,
    color,
    supports,
    checkpoint: atStep(p),
    endCaps: { start: '1B', end: '1A' },
  };
}

/** 配好每一步的时间和说明。 */
function steps(titles: string[], instructions: string[]): LessonStep[] {
  return titles.map((title, i) => ({ time: TIMES[i]!, title, instruction: instructions[i]! }));
}

// 先完整绕过横杆，再绕固定段形成双套结构，
// 也就是两个同方向的半结；绕杆和绕主绳要分开看。
function roundTurnRoute(g: number) {
  const path = new Route(),
    r = mix(0.8, 0.43, g),
    barY = 0.9;

  /** 计算横杆周围的绳中心点。 */
  const polePoint = (x: number, a: number): Vec3 => [x, barY + r * Math.sin(a), r * Math.cos(a)];
  path.add([-2.8, -1.35, 0.12]);
  path.line([0.9, -1.35, 0.12]);
  path.mark();
  const entry = polePoint(0.9, -0.38);
  path.cubic([0.9, -0.65, 0.12], [0.9, entry[1] - 0.4, entry[2] - 0.12], entry);

  for (let i = 1; i <= 320; i++) {
    const t = i / 320;
    path.add(polePoint(mix(0.9, 1.45, t), -0.38 + TAU * 1.5 * t));
  }

  // 从横杆背面绕回后，把工作端带向固定段的轴线。
  const end = path.points.at(-1)!;
  path.cubic([1.85, end[1] - 0.35, -r - 0.35], [1.9, -0.8, -r - 0.35], [1.5, -1.35, 0.2]);
  path.cubic([1.2, -1.7, 1.05], [0.65, -1.7, 1.05], [0.35, -1.7, 1.05]);
  path.mark();
  const mainY = -1.35,
    mainZ = 0.12,
    rr = mix(0.46, 0.155, g),
    gate = 0.32;

  /** 把绳圈坐标转到教学平面。 */
  const polar = (x: number, a: number, rad: number): Vec3 => [
    x,
    mainY + rad * Math.sin(a),
    mainZ + rad * Math.cos(a),
  ];

  const a = mix(0.4, 0.24, g),
    pitch = 0.15,
    lift = 0.29;

  const first = polar(0.02, gate, rr);
  path.cubic([0.2, -1.7, 1.05], [0.02, first[1] - 0.23, first[2]], first);

  for (let i = 1; i <= 130; i++) {
    const t = i / 130;
    path.add(
      polar(
        mix(0.02, -0.13, ease(t)),
        gate + (TAU - 2 * gate) * t,
        rr + lift * ease((t - 0.65) / 0.35),
      ),
    );
  }

  const bridgeStart = path.points.at(-1)!,
    bridgeEnd = polar(a + pitch, TAU + gate, rr + lift);

  path.cubic(
    [bridgeStart[0] - 0.12, bridgeStart[1] + 0.1, bridgeStart[2]],
    [bridgeEnd[0] + 0.12, bridgeEnd[1] - 0.1, bridgeEnd[2]],
    bridgeEnd,
  );
  path.mark();

  for (let i = 1; i <= 130; i++) {
    const t = i / 130;
    path.add(
      polar(
        mix(a + pitch, a, ease(t)),
        TAU + gate + (TAU - 2 * gate) * t,
        rr + lift * (1 - ease(t / 0.35)),
      ),
    );
  }

  const tail = path.points.at(-1)!;
  path.cubic([tail[0], tail[1] + 0.3, tail[2] + 0.1], [tail[0], -0.7, 0.9], [tail[0], -0.4, 0.95]);
  path.mark();

  return path;
}

/** 生成双绕双半结和横杆画面。 */
function getRoundTurnState(progress: number) {
  const p = clamp(progress),
    g = ease((p - 0.82) / 0.18);

  return state(
    roundTurnRoute(g),
    p,
    0.047,
    [
      {
        id: 'round-turn-pole',
        kind: 'cylinder',
        position: [0, 0.9, 0],
        axis: [1, 0, 0],
        radius: 0.35,
        length: 3.8,
        color: '#b2a082',
      },
    ],
    '#b87351',
  );
}

// 束紧结包含两个围绕圈、一段斜跨压绳，最后同时从斜跨段和第一圈下穿出。
// 这个穿压才把结构扣住，不能只画成互不相扣的螺旋。
function constrictorRoute(g: number) {
  const path = new Route(),
    r = mix(0.94, 0.68, g),
    a = mix(0.62, 0.25, g),
    gate = 0.65,
    lift = 0.34;

  /** 把绳圈坐标转到教学平面。 */
  const polar = (x: number, theta: number, rad = r): Vec3 => [
    x,
    rad * Math.sin(theta),
    rad * Math.cos(theta),
  ];

  const entry = polar(0, 0.7);
  path.add([0, entry[1] + 1.8 * Math.cos(0.7), entry[2] - 1.8 * Math.sin(0.7)]);
  path.line(entry);
  path.mark();

  for (let i = 1; i <= 50; i++) {
    path.add(polar(0, mix(0.7, -gate, i / 50)));
  }

  for (let i = 1; i <= 180; i++) {
    const t = i / 180;
    path.add(polar(-a * ease(t), -gate - (TAU - 2 * gate) * t));
  }

  path.mark();

  for (let i = 1; i <= 70; i++) {
    const t = i / 70;
    path.add(
      polar(mix(-a, a, ease(t)), -TAU + gate - 2 * gate * t, r + lift * Math.sin(Math.PI * t)),
    );
  }

  for (let i = 1; i <= 180; i++) {
    const t = i / 180;
    path.add(polar(a, -TAU - gate - (TAU - 2 * gate) * t));
  }

  path.mark();

  // 一次穿压同时经过第一圈固定段和抬高的斜跨绳下方。
  // 穿出后直接向外走，再折返会凭空多出一次交叉。
  for (let i = 1; i <= 70; i++) {
    const t = i / 70;
    path.add(
      polar(
        mix(a, -a - 0.18, ease(t)),
        -2 * TAU + gate - 1.5 * gate * t,
        r - 0.105 * Math.sin(Math.PI * t),
      ),
    );
  }

  const end = path.points.at(-1)!,
    exitAngle = -gate / 2;

  path.line([
    end[0] - 0.55,
    end[1] - 1.2 * Math.cos(exitAngle),
    end[2] + 1.2 * Math.sin(exitAngle),
  ]);
  path.mark();

  return path;
}

/** 生成束紧结与圆束画面。 */
function getConstrictorState(progress: number) {
  const p = clamp(progress),
    g = ease((p - 0.82) / 0.18);

  return state(
    constrictorRoute(g),
    p,
    0.042,
    [
      {
        id: 'binding-bundle',
        kind: 'cylinder',
        position: [0, 0, 0],
        axis: [1, 0, 0],
        radius: 0.52,
        length: 3.2,
        color: '#adad86',
      },
    ],
    '#5e8993',
  );
}

// 环眼位于 YZ 平面，线先沿 X 方向穿过开口，再绕过环边。
// 围主线完整绕五圈以后，才轮到两次位置不同的回穿。
function clinchRoute(g: number) {
  const path = new Route(),
    ringX = -1.6;

  const standZ = -0.16,
    coilR = mix(0.44, 0.19, g),
    x0 = mix(-0.5, -0.85, g),
    x1 = mix(1.2, 0.2, g);

  path.add([2.8, 0.05, standZ]);
  path.line([ringX + 0.25, 0.05, standZ]);
  path.mark();
  path.line([ringX - 0.24, 0.05, standZ]);
  path.cubic([ringX - 0.62, 0.05, standZ], [ringX - 0.62, 0.65, 0.14], [ringX - 0.18, 0.66, 0.14]);
  path.cubic(
    [ringX + 0.32, 0.66, 0.14],
    [x0 - 0.05, -0.15, standZ + coilR],
    [x0, 0.05, standZ + coilR],
  );
  path.mark();

  for (let i = 1; i <= 700; i++) {
    const t = i / 700,
      angle = TAU * 5 * t;

    path.add([mix(x0, x1, t), 0.05 + coilR * Math.sin(angle), standZ + coilR * Math.cos(angle)]);
  }

  path.mark();
  const looseY = mix(-0.8, -0.54, g);
  // 回到环眼旁的小圈，从主线下方、最初的穿眼连接段上方通过，
  // 再穿回这次折返留下的大圈。最后的线尾单独露出来，方便辨认。
  path.cubic([x1 + 0.1, 0.4, standZ + coilR], [x1 + 0.55, 0.4, 0.52], [x1 + 0.55, -0.3, 0.52]);
  path.cubic([x1 + 0.55, looseY, 0.52], [x1, looseY, 0.52], [-0.82, looseY, 0.52]);
  path.cubic([-1.12, looseY, 0.52], [-1.27, -0.2, 0.4], [-1.18, 0.22, -0.05]);
  path.cubic([-1.15, 0.35, -0.3], [-1.1, -0.55, -0.4], [-0.9, -0.35, 0.1]);
  path.cubic([-0.7, -0.15, 0.6], [-0.06, -0.48, 0.8], [0.46, -0.48, 0.8]);
  path.mark();

  return path;
}

/** 生成克林奇结，并转到能看清环眼的角度。 */
function getClinchState(progress: number) {
  const p = clamp(progress),
    g = ease((p - 0.82) / 0.18);

  const result = state(
    clinchRoute(g),
    p,
    0.033,
    [
      {
        id: 'fishing-eye',
        kind: 'ring',
        position: [-1.6, 0, 0],
        axis: [1, 0, 0],
        radius: 0.36,
        length: 0.1,
        color: '#ae9567',
      },
    ],
    '#547b9b',
  );

  // 整体转一个角度，让默认视角能看见环眼的开口。
  // 环的法线原本沿 X 轴，直接看过去会只剩一条侧边。
  const angle = Math.PI / 5;
  /** 同步旋转绳路和支撑物。 */
  const rotate = ([x, y, z]: Vec3): Vec3 => [
    x * Math.cos(angle) + z * Math.sin(angle),
    y,
    -x * Math.sin(angle) + z * Math.cos(angle),
  ];

  return {
    ...result,
    points: result.points.map(rotate),
    tip: rotate(result.tip),
    supports: result.supports!.map((s) => ({
      ...s,
      position: rotate(s.position),
      axis: rotate(s.axis),
    })),
  };
}

// 用预先闭合的绳环展示完整结构：中央套口两侧各绕三圈，两条受拉环腿从套口下引出。
// 绳环没有自由端；路径分段的连接处都在内部，不能加成绳头端帽。
function getPrusikState(progress: number): LessonState {
  const p = clamp(progress),
    g = ease((p - 0.82) / 0.18),
    radius = 0.04;

  const rr = mix(0.5, 0.22, g),
    pitch = mix(0.19, 0.115, g),
    a = mix(0.2, 0.075, g),
    gate = 0.3;

  // 局部 u 轴沿竖直主绳，转换后把教学绳环展开到左侧。
  const world = (u: number, angle: number, r: number): Vec3 => [
    -r * Math.cos(angle),
    u,
    r * Math.sin(angle),
  ];

  const route = new Route();
  const lower = world(-a, gate, rr),
    upper = world(a, gate, rr);

  route.add([-2.15, -0.24, 0.02]);
  route.cubic([-1.2, -0.24, 0.02], [-0.85, lower[1], lower[2]], lower);

  for (let i = 1; i <= 450; i++) {
    const t = i / 450;
    route.add(world(-a - pitch * 3 * t, gate + (3 * TAU - 2 * gate) * t, rr));
  }

  const collarStart = route.points.at(-1)!,
    collarEnd = world(a + pitch * 3, 3 * TAU - gate, rr);

  // 外侧套口从两条引出环腿前方跨过，把它们压在下面。
  route.cubic(
    [collarStart[0] - 0.3, collarStart[1] - 0.1, rr * Math.sin(gate) + 0.23],
    [collarEnd[0] - 0.3, collarEnd[1] + 0.1, rr * Math.sin(gate) + 0.23],
    collarEnd,
  );

  for (let i = 1; i <= 450; i++) {
    const t = i / 450;
    route.add(world(a + pitch * 3 * (1 - t), 3 * TAU - gate - (3 * TAU - 2 * gate) * t, rr));
  }

  route.cubic([-0.85, upper[1], upper[2]], [-1.1, 0.6, 0.02], [-1.7, 0.6, 0.02]);
  route.cubic([-2.4, 0.6, 0.02], [-2.65, -0.24, 0.02], [-2.15, -0.24, 0.02]);
  route.smooth();
  const active = ['#ae8f54', '#b87351', '#b87351', '#ae8f54', '#ae8f54'][atStep(p)]!;

  return {
    points: [
      [0, -1.85, 0],
      [0, 1.85, 0],
    ],
    tip: [...lower],
    radius: 0.15,
    color: '#a76658',
    hideMainTip: true,
    checkpoint: atStep(p),
    endCaps: { start: '1B', end: '1A' },
    strands: [
      {
        id: 'prusik-preclosed-loop',
        points: route.prefix(route.total),
        radius,
        color: active,
        endCaps: { start: false, end: false },
      },
    ],
  };
}

export const SCENIC_KNOT_COURSES: Course[] = [
  /** 横杆课程先看围杆部分，再辨认绕在主绳上的两个半结。 */
  {
    id: 'round-turn-two-half-hitches',
    category: 'knots',
    name: '横杆固定：双绕双半结',
    title: '绕住横杆，再在主绳上打两个半结',
    description: '把绳系在晾晒杆或露营支杆上，分清绕杆部分与锁住主绳的两个半结。',
    material: '一根练习绳 · 圆杆',
    materialNote:
      '棕色圆杆代表晾晒杆或支杆。1B 是主绳端，1A 是工作端；逐段显露路径，末段整理收紧。',
    duration: 42,
    initialProgress: 0.64,
    application: {
      scenarios: ['fixing', 'home', 'garden', 'camping'],
      task: '把轻型晾晒绳或露营辅助绳固定在圆杆上',
      focus: '围杆后双半结收尾',
      boundary: '此课演示系杆结构，不计算材料摩擦或承载能力。',
    },
    steps: steps(
      [
        '辨认横杆与主绳',
        '围绕横杆完整绕行',
        '在主绳上做第一半结',
        '同向再做第二半结',
        '整理绕杆与收尾',
      ],
      [
        '棕色物体是圆杆。画面中的 1B 留作主绳端，1A 沿完整路径逐段展开；先确认绳子需要系住的物体。',
        '工作端围着杆连续经过两次，形成圆绕部分；它与后面绕主绳的小圈属于不同位置。',
        '把工作端带回主绳旁，围着主绳做第一个半结，辨认工作端从自己留下的圈下穿出。',
        '沿相同方向继续做第二个半结；两个半结都绕在主绳上，不再绕圆杆。',
        '先让绕杆部分贴近圆杆，再排列两个半结。观察绳径保持不变，工作尾仍在外侧。',
      ],
    ),
    source: 'https://www.animatedknots.com/round-turn-two-half-hitches-knot',
    sourceName: 'Animated Knots · Round Turn & Two Half Hitches',
    getState: getRoundTurnState,
  },
  /** 圆束课程集中看斜跨压绳和最后的下穿，圆柱只表示束物外形。 */
  {
    id: 'constrictor-binding',
    category: 'knots',
    name: '圆束扎紧：束紧结',
    title: '绕住圆束，把工作端藏到压绳下',
    description: '以圆束为对象，辨认两个绕圈、斜跨压绳和最后的穿压结构。',
    material: '一根细练习绳 · 圆形束物',
    materialNote: '灰绿圆柱表示圆束的外轮廓；不是平面箱体。工作端标为 1A，固定尾为 1B。',
    duration: 40,
    initialProgress: 0.64,
    application: {
      scenarios: ['binding', 'home', 'storage', 'garden'],
      task: '学习束口、圆形材料归拢时的扎紧结构',
      focus: '两圈下方穿压扎紧',
      boundary: '曲面束物结构示意；束紧后可能难以解开，课程不展示真实材料压缩。',
    },
    steps: steps(
      [
        '确定要扎紧的圆束',
        '绕过束物第一圈',
        '斜跨后再绕一圈',
        '从压绳与前圈下穿出',
        '整理并收紧束口',
      ],
      [
        '以圆柱代表束物，留住 1B，沿 1A 的路线观察。绳子需要围住物体，不能只在物体前面打一个结。',
        '把工作端从束物背面带回正面，完成第一圈。保留余量，准备下一次斜跨。',
        '斜跨主段后再绕束物，正面形成交叉的压绳。第二圈与第一圈保持不同轴向位置。',
        '工作端从初始绳段与斜跨压绳的下方一次穿出，确认两段都压住工作尾。沿连续路径检查这次穿压，它区别于普通双套结。',
        '牵引两端，把两个绕圈和正面穿压整理靠拢。圆束不变形，绳径不变，收紧可倒拖查看。',
      ],
    ),
    source: 'https://www.animatedknots.com/constrictor-knot-rope-end-method',
    sourceName: 'Animated Knots · Constrictor, Rope End Method',
    getState: getConstrictorState,
  },
  /** 接环课程依次展示穿眼、五绕和两次不同位置的回穿。 */
  {
    id: 'improved-clinch-eye',
    category: 'knots',
    name: '钓线接环：改良克林奇结',
    title: '穿环眼、绕主线，再辨认两次回穿',
    description: '以金属环眼代表钩眼或转环，查看五次绕主线和眼旁小圈、返回大圈的不同位置。',
    material: '一根练习线 · 金属环眼',
    materialNote:
      '环眼独立显示，1B 是主线端，1A 是线尾。使用放大教学间距；不演示剪尾和真实钓线受力变形。',
    duration: 46,
    initialProgress: 0.64,
    projectionFocus: 'full',
    application: {
      scenarios: ['fishing', 'outdoors'],
      task: '认识钓线与钩眼、转环连接时的穿绕路线',
      focus: '穿眼五绕两次回穿',
      boundary: '放大的结构示意；线材适配、润湿和拉力检查须依实际器材说明。',
    },
    steps: steps(
      [
        '辨认环眼与主线',
        '把工作端穿过环眼',
        '围主线连续绕五圈',
        '回到眼旁，再穿返回圈',
        '整理线圈与线尾',
      ],
      [
        '金色环是钩眼或转环的连接部位。1B 留作主线，1A 是要穿过环眼的工作端。',
        '让 1A 穿过金属环的开口，绕过环边后回到主线旁，保留环眼旁的小圈。',
        '工作端围着主线完整绕五圈，各圈依次排开。主线位于五圈的内部，避免把它看成五个独立绳圈。',
        '沿返回线追到环眼旁的小圈，再看线尾穿过返回时留下的大圈。改良结构比基本绕线多一次回穿。',
        '缓慢整理五圈和两次回穿，保留可辨认的外露线尾。画面保留放大间隙，不模拟实际钓线拉紧后的内部扭转。',
      ],
    ),
    source: 'https://www.animatedknots.com/improved-clinch-knot',
    sourceName: 'Animated Knots · Improved Clinch',
    getState: getClinchState,
  },
  /** 普鲁士结课程完整显示闭合绳环，按步骤辨认两侧三绕和中央套口。 */
  {
    id: 'prusik-structure',
    category: 'knots',
    name: '抓绳认知：普鲁士结',
    title: '对照主绳、闭合绳环与对称绕圈',
    description: '观察预先闭合的细绳环如何在粗主绳上形成对称三绕结构，识别绕圈和出环腿。',
    material: '一根粗主绳 · 一只预闭合练习绳环',
    materialNote:
      '红色主绳有 1A、1B 两个真实端点。金色线是已闭合绳环，没有自由端；本课不包含绳环接头制作，逐步辨认完整结构。',
    duration: 40,
    initialProgress: 0.64,
    application: {
      scenarios: ['mountaineering', 'climbing', 'rescue'],
      task: '在登山、攀岩、救援课程前认识抓绳结构',
      focus: '闭合环对称抓绳结构',
      boundary: '仅限结构认知，不是上升、保护、承重或救援操作训练；实际系统需由合格教练指导。',
    },
    steps: steps(
      [
        '辨认粗主绳与闭合环',
        '查看下侧三次绕行',
        '查看上侧对称绕行',
        '找出中央套口与双腿',
        '整理圈列，核对结构',
      ],
      [
        '红色是粗主绳，金色是预先闭合的细绳环。整条绳环始终显示，播放用于辨认结构，不演示接头和实际承重动作。',
        '沿绳环下侧观察三次绕主绳的路线。每圈绕过背面再回到前面，各圈彼此分开。',
        '从中央套口转到上侧，对照另外三圈。上下两侧对称，不是把全部圈数挤在同一侧。',
        '找出跨过前方的中央套口，以及从它下方伸出的两条环腿。两腿在外侧连接成同一个闭合环。',
        '让圈列靠拢，检查主绳保持直线、两侧各三圈、双腿从中央引出。这里只展示整理形态，不测试抓持力。',
      ],
    ),
    source: 'https://www.animatedknots.com/prusik-knot',
    sourceName: 'Animated Knots · Prusik',
    getState: getPrusikState,
  },
];
