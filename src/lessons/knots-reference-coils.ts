import type { Course, LessonState, LessonStep, Vec3 } from './types';

const TAU = Math.PI * 2;
const RADIUS = 0.038;
const clamp = (v: number) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
const ease = (v: number) => {
  const t = clamp(v);
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => a.map((v, i) => mix(v, b[i]!, t)) as Vec3;
const dist = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** 连续绳路的弧长标记用于逐步展开，几何由进度直接重建。 */
class RopePath {
  points: Vec3[] = [];
  lengths: number[] = [];
  marks: number[] = [];
  total = 0;

  add(p: Vec3) {
    const before = this.points.at(-1);
    const d = before ? dist(before, p) : 0;
    if (before && d < 1e-8) return;
    this.total += d;
    this.points.push(p);
    this.lengths.push(this.total);
  }

  line(to: Vec3) {
    const start = this.points.at(-1)!;
    const count = Math.max(2, Math.ceil(dist(start, to) / 0.02));
    for (let i = 1; i <= count; i++) this.add(lerp(start, to, i / count));
  }

  curve(b: Vec3, c: Vec3, end: Vec3) {
    const a = this.points.at(-1)!;
    for (let i = 1; i <= 80; i++) {
      const t = i / 80;
      const s = 1 - t;
      this.add(
        [0, 1, 2].map(
          (k) => s ** 3 * a[k]! + 3 * s * s * t * b[k]! + 3 * s * t * t * c[k]! + t ** 3 * end[k]!,
        ) as Vec3,
      );
    }
  }

  mark() {
    this.marks.push(this.total);
  }

  prefix(length: number) {
    const end = Math.max(0.12, Math.min(this.total, length));
    const n = Math.max(12, Math.ceil(end / 0.018));
    let cursor = 1;
    return Array.from({ length: n + 1 }, (_, i) => {
      const at = (end * i) / n;
      while (cursor < this.lengths.length - 1 && this.lengths[cursor]! < at) cursor++;
      return lerp(
        this.points[cursor - 1]!,
        this.points[cursor]!,
        (at - this.lengths[cursor - 1]!) / (this.lengths[cursor]! - this.lengths[cursor - 1]!),
      );
    });
  }
}

/** 不同课程保留独立动作分界，只共用逐段显露和取帧规则。 */
function show(
  path: RopePath,
  p: number,
  steps: readonly LessonStep[],
  color: string,
  radius = RADIUS,
): LessonState {
  let checkpoint = 0;
  for (let i = 1; i < steps.length; i++) if (p >= steps[i]!.time) checkpoint = i;
  const start = steps[checkpoint]!.time;
  const end = steps[checkpoint + 1]?.time ?? 1;
  const limits = [0.18, ...path.marks, path.total];
  const points = path.prefix(
    mix(limits[checkpoint]!, limits[checkpoint + 1]!, ease((p - start) / (end - start))),
  );
  return { points, tip: [...points.at(-1)!], checkpoint, radius, color };
}

/** 大圈是一根连续绳的盘放，Z 方向排开各圈以免把重合线当作同一圈。 */
function circleCoil(path: RopePath, turns: number, a: number, b: number, first = -Math.PI * 0.72) {
  const last = Math.PI / 2 + TAU * turns;
  const count = Math.ceil((last - first) * 60);
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const angle = mix(first, last, t);
    const point: Vec3 = [a * Math.cos(angle), b * Math.sin(angle), mix(-0.18, 0.18, t)];
    if (i === 0 && path.points.length)
      path.curve([point[0] - 0.15, point[1] - 0.3, point[2]], point, point);
    else path.add(point);
  }
}

const PERFECT_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '辨认反向的两条线尾',
    instruction:
      '灰色粗绳是封头对象。细绳两尾沿粗绳纵向并排，分别朝向上、下；中间留足够长的绳弯，用来连续套绕。',
  },
  {
    time: 0.18,
    title: '从封头下边缘开始套绕',
    instruction:
      '把长绳弯从粗绳末端套过，形成第一圈；纵向放置的线尾被包在圈内。本课逐段显示最终穿绕路线，不模拟手把整个绳弯翻过绳端。',
  },
  {
    time: 0.36,
    title: '依次排列九圈',
    instruction:
      '每套过粗绳末端一次便增加一圈，圈列由下往上排列。九圈是模型示例；注意圈内两条纵向线段没有折成惯用封头的回抽绳弯。',
  },
  {
    time: 0.68,
    title: '找出从两边直出的线尾',
    instruction:
      '沿完整细绳追踪：一尾从上边缘伸出，另一尾从下边缘伸出。辨认纵向埋线与外围圈列的连接，不要另加一个抽埋圈口。',
  },
  {
    time: 0.84,
    title: '整理圈列与直出线尾',
    instruction: '分别拉两尾，整理圈列。最终保留外露尾段用于观察，未演示剪线；正面放大了埋线通道。',
  },
];

/** Perfect Whipping 用反向直出线尾收束；与 Common 的折返绳弯分开建模。 */
function perfectWhipping(progress: number): LessonState {
  const p = clamp(progress),
    g = ease((p - 0.84) / 0.16);
  const path = new RopePath();
  const low = mix(-0.75, -0.52, g),
    high = mix(0.62, 0.38, g);
  const front = 0.285,
    lane = 0.065;
  path.add([-lane, 1.15, front]);
  path.line([-lane, low - 0.13, front]);
  path.mark();
  path.curve([-lane, low - 0.25, front], [0.1, low - 0.25, 0.4], [0, low, 0.4]);
  for (let i = 1; i <= 900; i++) {
    const t = i / 900,
      angle = TAU * 9 * t;
    const relative = Math.atan2(Math.sin(angle), Math.cos(angle));
    const base = mix(0.31, 0.247, g);
    const radius = base + (0.4 - base) * Math.exp(-((relative / 0.7) ** 4));
    path.add([radius * Math.sin(angle), mix(low, high, t), radius * Math.cos(angle)]);
    if (i === 200) path.mark();
  }
  path.mark();
  path.curve([0.15, high + 0.18, 0.43], [lane, high + 0.23, front], [lane, high + 0.06, front]);
  path.line([lane, -1.12, front]);
  path.mark();
  return {
    ...show(path, p, PERFECT_STEPS, '#5b7fba', 0.022),
    strands: [
      {
        id: 'rope-being-whipped',
        points: [
          [0, -2.0, 0],
          [0, 1.42, 0],
        ],
        radius: 0.22,
        color: '#aaa396',
        endCaps: { start: false, end: false },
      },
    ],
  };
}

const GASKET_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '留下外露起始端',
    instruction: '从绳尾开始整理长圈，起始端留在圈列之外。各圈等长，随盘绳方向顺开原有扭转。',
  },
  {
    time: 0.22,
    title: '把长圈归成绳束',
    instruction:
      '将长圈集中握住，保留顶部的开口。画面用五圈展示绳束，后续围住的是左右两侧圈列组成的整个腰部。',
  },
  {
    time: 0.42,
    title: '围着绳束腰部缠绕',
    instruction:
      '用余绳围腰部连续绕六圈，沿绳束向顶部排列。它不同于只绕圆形绳盘上缘一小段的收绳法。',
  },
  {
    time: 0.66,
    title: '绳弯穿过顶部开口',
    instruction:
      '把工作段折成绳弯，从绳束顶部开口穿出；两条腿都要通过开口，不能从某一根盘绳之间穿过。',
  },
  {
    time: 0.8,
    title: '把绳弯翻套在头部外侧',
    instruction:
      '展开穿出的绳弯，翻过绳束头部并放回腰部上缘。沿模型追踪从内部开口到外围套口的连续路线。',
  },
  {
    time: 0.9,
    title: '收拢圈列与套口',
    instruction: '拉工作尾，使翻套的绳弯收住头部。两端保持外露；使用时先松开封束，再逐圈放绳。',
  },
];

/** 腰部六绕配合穿头、翻套的绳弯，保留束帆收绳的长束形状。 */
function gasketCoil(progress: number): LessonState {
  const p = clamp(progress),
    g = ease((p - 0.9) / 0.1);
  const path = new RopePath();
  const scale = mix(1, 0.9, g);
  path.add([0, -2.1, -0.28]);
  path.line([0, -1.5, -0.28]);
  path.mark();
  for (let i = 1; i <= 1800; i++) {
    const t = i / 1800,
      theta = Math.PI + TAU * 5 * t;
    path.add([
      scale * Math.sin(theta) * (0.2 + 0.62 * Math.cos(theta) ** 2),
      1.5 * Math.cos(theta),
      mix(-0.28, 0.28, t),
    ]);
  }
  path.mark();
  path.curve([0.85, -1.8, 0.45], [0.85, -0.65, 0.48], [0, -0.48, 0.48]);
  for (let i = 1; i <= 720; i++) {
    const t = i / 720,
      a = TAU * 6 * t;
    path.add([
      mix(0.55, 0.46, g) * Math.sin(a),
      mix(-0.48, 0.44, t),
      mix(0.48, 0.39, g) * Math.cos(a),
    ]);
  }
  path.mark();
  path.curve([0, 0.7, 0.65], [-0.08, 1.0, 0.5], [-0.08, 1.0, -0.5]);
  path.mark();
  path.curve([-0.58, 0.92, -0.55], [-0.62, 0.65, 0.35], [0, 0.58, 0.54]);
  path.curve([0.62, 0.65, 0.35], [0.58, 0.92, -0.36], [0.08, 1.0, -0.36]);
  path.curve([0.08, 1.0, 0.3], [0.72, 0.72, 0.65], [0.86, -1.15, 0.62]);
  path.mark();
  return show(path, p, GASKET_STEPS, '#82918d');
}

const SAILOR_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '把绳盘成圆圈',
    instruction:
      '连续盘出等大的圈，起始尾保持在圈列外侧。留出工作尾，准备在圆盘上缘的同一小段锁住全部圈列。',
  },
  {
    time: 0.3,
    title: '围住上缘做第一套结',
    instruction:
      '工作尾围过上缘的一束绳，回到正面形成第一套结；围住的是所有盘好的圈，不是只绕单根绳。',
  },
  {
    time: 0.5,
    title: '在第一套结左边再做一套',
    instruction: '把工作段跨向左侧，再围过同一束绳。两套在正面交叉斜搭，工作尾稍后从交叉之间穿出。',
  },
  {
    time: 0.7,
    title: '从交搭处引出工作尾',
    instruction: '工作尾越过后侧斜搭，再从前侧斜段下方穿出，保留向上的长尾；这里不留抽解绳弯。',
  },
  {
    time: 0.86,
    title: '整理两套锁束',
    instruction:
      '拉工作尾，让左右两套靠近上缘圈列。悬挂前另行确认线尾固定和绳束重量；本课不演示真实承重。',
  },
];

/** 圆盘上缘的两套依次跨压，末尾越过后一套再从前一套下穿出。 */
function sailorRoute(tension: number) {
  const path = new RopePath();
  const coilRadius = 1.15;
  const first = -2.25;
  const last = Math.PI / 2 + 0.6 - TAU * 4;
  const start: Vec3 = [-0.92, -1.7, -0.12];
  const coilPoint = (t: number): Vec3 => {
    const angle = mix(first, last, t);
    return [coilRadius * Math.cos(angle), coilRadius * Math.sin(angle), mix(-0.12, 0.145, t)];
  };
  const entry = coilPoint(0);
  const direction: Vec3 = [Math.sin(first), -Math.cos(first), 0.265 / (first - last) / coilRadius];
  path.add(start);
  path.curve([-0.92, -1.38, -0.12], entry.map((v, i) => v - direction[i]! * 0.24) as Vec3, entry);
  for (let i = 1; i <= 1600; i++) {
    path.add(coilPoint(i / 1600));
  }
  path.mark();
  const width = mix(0.34, 0.18, tension);
  const ry = mix(0.3, 0.105, tension);
  const rz = mix(0.4, 0.18, tension);
  const top = (x: number) => Math.sqrt(coilRadius ** 2 - x ** 2);
  const point = (x: number, angle: number, lift = 0): Vec3 => [
    x,
    top(x) + ry * Math.sin(angle),
    (rz + lift) * Math.cos(angle),
  ];
  const firstAngle = 1.25;
  const endAngle = -firstAngle;
  const firstPoint = point(width, firstAngle);
  const previous = path.points.at(-1)!;
  const lead: Vec3 = [0, 1.15, mix(0.62, 0.42, tension)];
  path.curve(
    [previous[0] + Math.sin(last) * 0.3, previous[1] - Math.cos(last) * 0.3, previous[2]],
    [lead[0] - 0.2, lead[1] - 0.14, lead[2]],
    lead,
  );
  const entryHandle = mix(0.2, 0.12, tension);
  path.curve(
    [lead[0] + 0.12, lead[1] + 0.084, lead[2]],
    [
      firstPoint[0],
      firstPoint[1] - entryHandle * Math.cos(firstAngle),
      firstPoint[2] + ((entryHandle * rz) / ry) * Math.sin(firstAngle),
    ],
    firstPoint,
  );
  for (let i = 1; i <= 400; i++) {
    path.add(point(width, firstAngle + (TAU - 2 * firstAngle) * (i / 400)));
  }
  path.mark();
  const bridgeHandle = mix(0.26, 0.18, tension);
  const middle = path.points.at(-1)!;
  const secondStart = point(-width, firstAngle);
  path.curve(
    [
      middle[0],
      middle[1] + bridgeHandle * Math.cos(endAngle),
      middle[2] - ((bridgeHandle * rz) / ry) * Math.sin(endAngle),
    ],
    [
      secondStart[0],
      secondStart[1] - bridgeHandle * Math.cos(firstAngle),
      secondStart[2] + ((bridgeHandle * rz) / ry) * Math.sin(firstAngle),
    ],
    secondStart,
  );
  for (let i = 1; i <= 400; i++) {
    path.add(point(-width, firstAngle + (TAU - 2 * firstAngle) * (i / 400)));
  }
  path.mark();
  const tail = path.points.at(-1)!;
  const lower: Vec3 = [-width * 0.8, mix(1.02, 1.1, tension), mix(0.26, 0.27, tension)];
  const upper: Vec3 = [-width * 0.5, mix(1.25, 1.24, tension), mix(0.49, 0.38, tension)];
  const tailHandle = 0.06;
  path.curve(
    [
      tail[0],
      tail[1] + tailHandle * Math.cos(endAngle),
      tail[2] - ((tailHandle * rz) / ry) * Math.sin(endAngle),
    ],
    [lower[0] - 0.02, lower[1] - 0.07, lower[2] - 0.07],
    lower,
  );
  path.curve(
    [lower[0] + 0.02, lower[1] + 0.07, lower[2] + 0.07],
    [upper[0] - 0.01, upper[1] - 0.09, upper[2]],
    upper,
  );
  path.curve(
    [upper[0] + 0.04, upper[1] + 0.36, upper[2]],
    [0.02, 1.8, upper[2]],
    [0.02, 2.05, upper[2]],
  );
  path.mark();
  return path;
}

/** 主端旁置余绳圈为工作端供绳，成结段收紧时仍保持整绳长度。 */
function sailorReserve(start: Vec3) {
  const path = new RopePath();
  path.add([-1.65, -2.1, start[2]]);
  path.curve([-1.65, -1.75, start[2] + 0.016], [start[0], -2.05, start[2]], start);
  return path;
}

/** 反算余绳角度，离散点也与固定预算等长。 */
function sailorWholeCord(worked: Vec3[], budget: number) {
  const connection = sailorReserve(worked[0]!);
  for (const point of worked.slice(1)) {
    connection.add(point);
  }
  const remaining = budget - connection.total;
  const radius = 0.65;
  const pitch = 0.12 / TAU;
  const count = Math.max(24, Math.ceil(remaining / 0.014));
  let angle = remaining / Math.hypot(radius, pitch);
  for (let i = 0; i < 4; i++) {
    const q = angle / count;
    const segment = Math.hypot(2 * radius * Math.sin(q / 2), pitch * q);
    const derivative = (radius ** 2 * Math.sin(q) + pitch ** 2 * q) / segment;
    angle -= (count * segment - remaining) / derivative;
  }
  const path = new RopePath();
  for (let i = 0; i <= count; i++) {
    const theta = -angle + (angle * i) / count;
    path.add([
      -2.3 + radius * Math.cos(theta),
      -2.1 + radius * Math.sin(theta),
      worked[0]![2] + pitch * theta,
    ]);
  }
  for (const point of connection.points.slice(1)) {
    path.add(point);
  }
  return path.points;
}

const SAILOR_LOOSE = sailorRoute(0);
const SAILOR_BUDGET = SAILOR_LOOSE.total + sailorReserve(SAILOR_LOOSE.points[0]!).total + 0.6;

/** 工作尾沿实际套结路线运动，最后整理左右两套。 */
function sailorsCoil(progress: number): LessonState {
  const p = clamp(progress);
  const tension = ease((p - 0.86) / 0.14);
  const path = tension > 0 ? sailorRoute(tension) : SAILOR_LOOSE;
  let checkpoint = 0;
  for (let i = 1; i < SAILOR_STEPS.length; i++) {
    if (p >= SAILOR_STEPS[i]!.time) {
      checkpoint = i;
    }
  }
  const cuts = [0.2, ...SAILOR_LOOSE.marks];
  const start = SAILOR_STEPS[checkpoint]!.time;
  const end = SAILOR_STEPS[checkpoint + 1]?.time ?? 1;
  const amount =
    p >= 0.86
      ? path.total
      : mix(cuts[checkpoint]!, cuts[checkpoint + 1]!, ease((p - start) / (end - start)));
  const points = sailorWholeCord(path.prefix(amount), SAILOR_BUDGET);
  return {
    points,
    tip: [...points.at(-1)!],
    checkpoint,
    radius: RADIUS,
    color: '#b8984d',
    endCaps: { start: '1B', end: '1A' },
  };
}

const FIREMAN_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '先盘出整齐圆圈',
    instruction: '把绳盘成等大的圆圈，保留工作尾。后面的锁束动作在圆盘上缘完成，圆盘中央仍然敞开。',
  },
  {
    time: 0.28,
    title: '在上缘形成第一个小圈',
    instruction: '用工作段在盘绳上方形成小圈，交叉处保留余量。先辨认这一圈，它会收住后穿入的绳弯。',
  },
  {
    time: 0.47,
    title: '折成绳弯绕到绳束后方',
    instruction:
      '把工作段折成绳弯，经过上缘绳束后侧，再从下方带回第一个小圈的位置。这个回绕将全部圈列包括在内。',
  },
  {
    time: 0.66,
    title: '绳弯穿圈，留下悬挂环',
    instruction:
      '让折起的绳弯穿过第一个圈，完整的弯顶留在上方形成悬挂环；工作尾仍在下方，可用于抽解。',
  },
  {
    time: 0.86,
    title: '收住挂环的根部',
    instruction:
      '整理第一个小圈，使其收住穿入的绳弯。挂环用于收纳这束绳，不能据此承担人员重量；模型没有模拟抽解后的散绳。',
  },
];

/** 先做锁圈，再将绕束绳弯从下方穿入，保留独立可辨认的悬挂环。 */
function firemansCoil(progress: number): LessonState {
  const p = clamp(progress),
    g = ease((p - 0.86) / 0.14);
  const path = new RopePath();
  path.add([-0.9, -1.75, -0.25]);
  circleCoil(path, 2, 1.1, 1.15);
  path.mark();
  const ringX = mix(0.32, 0.23, g),
    ringZ = mix(0.25, 0.19, g);
  path.curve([0.4, 1.65, 0.55], [-0.4, 1.65, 0.55], [-ringX, 1.42, 0.32]);
  for (let i = 1; i <= 240; i++) {
    const t = i / 240,
      a = Math.PI + TAU * t;
    path.add([ringX * Math.cos(a), mix(1.42, 1.6, t), 0.32 + ringZ * Math.sin(a)]);
  }
  path.mark();
  path.curve([-0.58, 1.45, 0.05], [-0.4, 0.85, -0.4], [0.15, 0.92, -0.4]);
  path.curve([0.58, 0.9, -0.4], [0.6, 1.05, 0.42], [-0.085, 1.15, 0.32]);
  path.mark();
  path.line([-0.085, 1.72, 0.32]);
  path.curve([-0.4, 2.35, 0.32], [0.4, 2.35, 0.32], [0.085, 1.72, 0.32]);
  path.line([0.085, 0.55, 0.32]);
  path.mark();
  return show(path, p, FIREMAN_STEPS, '#bd7655');
}

const ALPINE_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '预留起始尾并盘圈',
    instruction: '保留起始尾，连续盘出等长大圈。模型只演示绳索收纳结构，不涉及与人体或安全带连接。',
  },
  {
    time: 0.28,
    title: '在起始尾折出绳弯',
    instruction: '把起始尾折成绳弯，沿圆盘上缘放置；圈口朝向接下来绕圈推进的一侧，原尾仍可拉动。',
  },
  {
    time: 0.45,
    title: '另一尾围住上缘与绳弯',
    instruction:
      '工作尾穿过圆盘中心，围住上缘所有圈列和预放绳弯，连续绕四圈。圆盘下半部保持敞开，不缠整个腰部。',
  },
  {
    time: 0.7,
    title: '尾端穿入预留绳弯',
    instruction:
      '把工作尾穿入预留圈口；沿三维路线确认尾端穿的是起始尾形成的绳弯，而不是盘绳的大圈。',
  },
  {
    time: 0.86,
    title: '回拉起始尾并整理',
    instruction:
      '回拉起始尾，使绳弯收住工作尾。使用时先逐一解开这些绕圈，防止将线尾从绳盘中随意抽出造成缠绕。',
  },
];

/** 上缘四绕加独立预留绳弯，保留阿尔卑斯盘绳的圆形开口。 */
function alpineCoil(progress: number): LessonState {
  const p = clamp(progress),
    g = ease((p - 0.86) / 0.14);
  const path = new RopePath();
  const a = 1.1,
    b = 1.15;
  const top = (x: number) => b * Math.sqrt(Math.max(0, 1 - (x / a) ** 2));
  const gateX = mix(0.64, 0.5, g);
  path.add([-0.78, 1.7, 0.32]);
  path.curve([-0.7, 1.45, 0.32], [-0.55, 1.25, 0.32], [-0.46, top(-0.46) + 0.07, 0.32]);
  for (let i = 1; i <= 100; i++) {
    const x = mix(-0.46, gateX, i / 100);
    path.add([x, top(x) + 0.07, 0.32]);
  }
  path.curve(
    [gateX + 0.22, top(gateX) + 0.07, 0.32],
    [gateX + 0.22, top(gateX) - 0.07, 0.32],
    [gateX, top(gateX) - 0.07, 0.32],
  );
  for (let i = 1; i <= 100; i++) {
    const x = mix(gateX, -0.46, i / 100);
    path.add([x, top(x) - 0.07, 0.32]);
  }
  // 绳弯是同一根绳的起始部分，后续圈列从它的另一侧继续。
  path.curve([-0.7, 1.3, 0.32], [-0.7, 1.4, -0.18], [-0.6, top(-0.6), -0.18]);
  const first = Math.acos(-0.6 / a);
  circleCoil(path, 3, a, b, first);
  path.mark();
  path.mark();
  path.curve([0.35, 1.7, 0.65], [-0.72, 1.7, 0.65], [-0.46, top(-0.46) + 0.19, 0]);
  const ry = mix(0.24, 0.19, g),
    rz = mix(0.52, 0.45, g);
  for (let i = 1; i <= 480; i++) {
    const t = i / 480,
      x = mix(-0.46, 0.4, t),
      angle = TAU * 4 * t;
    path.add([x, top(x) + ry * Math.cos(angle), rz * Math.sin(angle)]);
  }
  path.mark();
  path.curve([0.55, 1.5, 0.2], [gateX + 0.08, top(gateX), 0.48], [gateX + 0.07, top(gateX), 0.42]);
  path.line([gateX + 0.07, top(gateX), 0.23]);
  path.curve([0.75, 0.7, 0.23], [0.85, 0.6, 0.23], [0.86, 0.4, 0.23]);
  path.mark();
  return show(path, p, ALPINE_STEPS, '#637fb5');
}

export const REFERENCE_COIL_COURSES: Course[] = [
  {
    id: 'perfect-whipping',
    category: 'knots',
    name: '完美绳端结',
    title: '完美绳端结 · 两尾反向直出',
    description: '辨认长绳弯套绕后，两条纵向线尾从相反边缘伸出的封头结构。',
    material: '一段粗绳 · 一根细缠绳',
    materialNote: '模型逐段显示套绕路线；正面展开内部通道，不模拟手翻绳弯或剪尾。',
    duration: 40,
    initialProgress: 0.68,
    steps: PERFECT_STEPS,
    source: 'https://knots3d.com/zh-CN/%E5%AE%8C%E7%BE%8E%E7%BB%B3%E7%AB%AF%E7%BB%93',
    sourceName: 'Knots 3D · Perfect Whipping',
    application: {
      scenarios: ['storage', 'home', 'camping'],
      task: '用细绳封住粗绳末端',
      focus: '反向直出线尾与九圈套绕',
      boundary: '结构示意，保留教学间距，不模拟材料摩擦与剪尾。',
    },
    getState: perfectWhipping,
  },
  {
    id: 'gasket-coil',
    category: 'knots',
    name: '束帆收绳结',
    title: '束帆收绳结 · 绕腰后翻套绳头',
    description: '长圈束成一把，余绳围绕腰部，再用翻套绳弯锁住头部。',
    material: '一根柔软练习绳',
    materialNote: '一根连续绳展示五个长圈、腰部六绕和翻套路线。',
    duration: 48,
    initialProgress: 0.66,
    steps: GASKET_STEPS,
    source: 'https://knots3d.com/zh-CN/%E6%9D%9F%E5%B8%86%E6%94%B6%E7%BB%B3%E7%BB%93',
    sourceName: 'Knots 3D · Gasket Coil · ABOK #3089',
    application: {
      scenarios: ['storage', 'home', 'outdoors'],
      task: '把长绳束好以便携带和收纳',
      focus: '中部缠腰与穿头翻套',
      boundary: '仅演示绳束收纳，不是吊人或吊物系统。',
    },
    getState: gasketCoil,
  },
  {
    id: 'sailors-coil',
    category: 'knots',
    name: '水手收绳结',
    title: '水手收绳结 · 上缘的左右双套',
    description: '保留圆形绳盘，在上缘用左右两套收住圈列。',
    material: '一根柔软练习绳',
    materialNote: '左下圈是主端备用余绳；圆盘上缘为锁束位置，工作尾从双套中引出。',
    duration: 40,
    frameWholeProcess: true,
    projectionBounds: { minX: -1.25, maxX: 1.25, minY: -1.3, maxY: 1.5 },
    initialProgress: 0.7,
    steps: SAILOR_STEPS,
    source: 'https://knots3d.com/zh-CN/%E6%B0%B4%E6%89%8B%E6%94%B6%E7%BB%B3%E7%BB%93',
    sourceName: "Knots 3D · Sailor's Coil · ABOK #3098",
    application: {
      scenarios: ['storage', 'home', 'outdoors'],
      task: '用上缘锁束整理圆盘绳',
      focus: '左右套结与长尾引出',
      boundary: '只演示收纳锁束，未模拟承重或松脱。',
    },
    getState: sailorsCoil,
  },
  {
    id: 'firemans-coil',
    category: 'knots',
    name: '消防员收绳结',
    title: '消防员收绳结 · 留出快解挂环',
    description: '上缘先成圈，再让绕束绳弯穿入，留下用于收纳的悬挂环。',
    material: '一根柔软练习绳',
    materialNote: '上方为折起绳弯，下面的短段是抽解工作尾；不是另接一只绳环。',
    duration: 42,
    initialProgress: 0.66,
    steps: FIREMAN_STEPS,
    source: 'https://knots3d.com/zh-CN/%E6%B6%88%E9%98%B2%E5%91%98%E6%94%B6%E7%BB%B3%E7%BB%93',
    sourceName: "Knots 3D · Fireman's Coil · ABOK #3094",
    application: {
      scenarios: ['storage', 'home', 'outdoors'],
      task: '给盘绳留下可挂放和抽解的绳弯',
      focus: '套住绳弯的锁圈与悬挂环',
      boundary: '挂环用于收纳绳束，不能据课程用于人员承重。',
    },
    getState: firemansCoil,
  },
  {
    id: 'alpine-coil',
    category: 'knots',
    name: '阿尔卑斯收绳结',
    title: '阿尔卑斯收绳结 · 上缘缠绕与回拉',
    description: '保留圆盘大圈，以起始尾的绳弯和另一尾的四圈绕束完成收束。',
    material: '一根柔软练习绳',
    materialNote: '起始尾与工作尾属于同一根绳，模型未包含背负、人体或安全带。',
    duration: 46,
    initialProgress: 0.7,
    steps: ALPINE_STEPS,
    source:
      'https://knots3d.com/zh-CN/%E9%98%BF%E5%B0%94%E5%8D%91%E6%96%AF%E6%94%B6%E7%BB%B3%E7%BB%93',
    sourceName: 'Knots 3D · Alpine Coil',
    application: {
      scenarios: ['storage', 'outdoors', 'mountaineering'],
      task: '认识登山绳的传统圆盘收纳结构',
      focus: '上缘四绕、穿预留绳弯与回拉',
      boundary: '仅绳索收纳结构，不是结组行进或安全带连接教程。',
    },
    getState: alpineCoil,
  },
];

/** 已完成整绳建模的单课，其他收绳草稿仍独立保留。 */
export const SAILORS_COIL_COURSE = REFERENCE_COIL_COURSES.find(
  (course) => course.id === 'sailors-coil',
)!;
