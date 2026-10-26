import { getAnchorDressing } from './anchorDressing';
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
  const reserve = reserveConnection();
  for (const point of worked.slice(1)) reserve.add(point);
  const remaining = Math.max(0.1, budget - reserve.total);
  const coil = new HitchPath();
  const radius = 0.6,
    pitch = 0.16 / TAU;
  let angle = remaining / Math.hypot(radius, pitch);
  const center: Vec3 = [-1.5, -2.6, 0.38];
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
      center[1] + radius * Math.sin(theta),
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
function reserveConnection() {
  const path = new HitchPath();
  path.add([-0.9, -2.6, 0.38]);
  path.cubic([-0.9, -2.22, 0.3961], [0, -2.5, 0.38], [0, -2.1, 0.38]);
  return path;
}

const BUNTLINE_TIMES = [0, 0.12, 0.26, 0.43, 0.59, 0.69, 0.84] as const;
const EYE: LessonSupport = {
  id: 'buntline-eye',
  kind: 'ring',
  position: [0, 1.8, 0],
  axis: [0, 0, 1],
  radius: 0.45,
  length: 0.15,
  color: '#aaa38d',
};
/** 独立的内双套绳路：先在主绳较低处绕圈，再朝环眼方向递进第二圈。 */
function buntlinePath(tight: number) {
  const path = new HitchPath(),
    ringR = mix(0.38, 0.122, tight);
  path.add([0, -2.1, 0.38]);
  path.cubic([0, -0.7, 0.38], [0, -0.5, ringR], [0, 0, ringR]);
  path.line([0, 1.35, ringR]);
  path.mark();
  for (let i = 1; i <= 100; i++) {
    const theta = (Math.PI * i) / 100;
    path.add([0, 1.35 + ringR * Math.sin(theta), ringR * Math.cos(theta)]);
  }
  path.mark();
  const r = mix(0.43, 0.092, tight),
    a = mix(0.38, 0.055, tight),
    pitch = mix(0.18, 0.125, tight),
    lift = mix(0.27, 0.098, tight),
    gate = 0.36,
    y = mix(0.05, 0.84, tight);
  const polar = (along: number, angle: number, radius: number): Vec3 => [
    radius * Math.sin(angle),
    y + along - 0.6 * radius * Math.cos(angle),
    ringR + radius * Math.cos(angle),
  ];
  const entry = polar(-a, gate, r),
    leadX = mix(-0.95, -0.31, tight),
    leadY = mix(-0.65, 0.81, tight),
    leadEnd: Vec3 = [leadX, leadY, ringR + mix(0.2, -0.04, tight)],
    leadNext: Vec3 = [leadX, leadY, ringR + r];
  path.cubic(
    [0, mix(-0.75, 0.76, tight), -ringR],
    leadEnd.map((v, i) => v - 0.6 * (leadNext[i]! - v)) as Vec3,
    leadEnd,
  );
  const handle = mix(0.24, 0.08, tight);
  path.cubic(
    leadNext,
    [
      entry[0] - handle * Math.cos(gate),
      entry[1] - handle * 0.6 * Math.sin(gate),
      entry[2] + handle * Math.sin(gate),
    ],
    entry,
  );
  path.mark();
  for (let i = 1; i <= 180; i++) {
    const t = i / 180;
    path.add(
      polar(
        mix(-a, -a - pitch, ease(t)),
        gate + (TAU - 2 * gate) * t,
        r + lift * ease((t - 0.65) / 0.35),
      ),
    );
  }
  path.mark();
  const from = path.points.at(-1)!,
    to = polar(a + pitch, TAU + gate, r + lift),
    h = mix(0.32, 0.2, tight),
    s = h * Math.tan(gate);
  path.cubic(
    [from[0] + h, from[1] - 0.6 * s, from[2] + s],
    [to[0] - h, to[1] - 0.6 * s, to[2] + s],
    to,
  );
  path.mark();
  for (let i = 1; i <= 180; i++) {
    const t = i / 180;
    path.add(
      polar(
        mix(a + pitch, a, ease(t)),
        TAU + gate + (TAU - 2 * gate) * t,
        r + lift * (1 - ease(t / 0.35)),
      ),
    );
  }
  const end = path.points.at(-1)!;
  path.cubic(
    [end[0] + 0.12, end[1] - 0.6 * 0.12 * Math.tan(gate), end[2] + 0.12 * Math.tan(gate)],
    [0.75, end[1] + 0.08, ringR + 0.06],
    [1.2, end[1] + 0.18, ringR + 0.06],
  );
  return path;
}
function buntlineState(progress: number): LessonState {
  const p = clamp(progress),
    tight = ease((p - 0.84) / 0.16);
  return frame(buntlinePath(tight), p, BUNTLINE_TIMES, [EYE], '#b29a52', 19);
}
const BUNTLINE: Course = {
  id: 'reference-buntline-hitch',
  category: 'knots',
  name: '帆脚结',
  title: '帆脚结 · 朝环眼方向打出内双套',
  description: '穿过环眼后，先绕较低的一圈，再朝物体方向完成第二圈。',
  material: '一根软绳 + 固定环眼',
  materialNote: '辨认主绳、工作端与环眼；旁置松圈保留实际绳长。',
  duration: 36,
  initialProgress: 0.7,
  frameWholeProcess: true,
  steps: steps(BUNTLINE_TIMES, [
    ['靠近环眼', '将工作端移向固定环眼，保持主绳顺直。'],
    ['穿环折回', '让工作端穿过环眼，从下缘折回。'],
    ['绕到主绳较低处', '沿主绳外侧把工作端引向下方，为朝上递进的两圈留出位置。'],
    ['完成较低的第一圈', '在主绳上绕出第一圈，工作端朝物体方向继续。'],
    ['斜跨并移向环眼', '让工作绳斜跨在前，第二圈安排在第一圈与环眼之间。'],
    ['完成靠里的第二圈', '同向绕第二圈，让工作端从骑跨段下穿出；第二圈更靠近环眼。'],
    ['整理并收紧', '把两圈逐步拢紧在主绳上，保留短尾，检查内外圈顺序。'],
  ]),
  source: 'https://knots3d.com/zh-CN/%E5%B8%86%E8%84%9A%E7%BB%93',
  sourceName: 'Knots 3D · Buntline Hitch · ABOK #55',
  application: {
    scenarios: ['fixing', 'outdoors'],
    task: '把绳索连接到环眼、小型扣环等物体。',
    focus: '第二圈向物体递进的内双套结构',
    boundary: '受力后可能难以解开；这里只演示桌面结法，不提供承载或人员保护指导。',
  },
  getState: buntlineState,
};
const ANCHOR_TIMES = [0, 0.1, 0.24, 0.38, 0.52, 0.64, 0.75, 0.88, 0.96] as const;
/** 两道环眼绕线以环眼表面的局部法向构造，不把闭合金属当成可穿过的直杆。 */
function anchorPath(tight: number) {
  const path = new HitchPath(),
    R = mix(0.42, 0.124, tight),
    spread = mix(0.2, 0.14, tight),
    xMain = -0.45 * Math.sin(spread),
    phi0 = -spread;
  const torus = (theta: number, phi: number): Vec3 => {
    const rad = R + mix(0.3, 0.098, tight) * Math.max(0, -Math.sin(theta)) ** 2;
    const x = 0.45 * Math.sin(phi);
    return [x, 1.8 - Math.sqrt(0.45 * 0.45 - x * x) + rad * Math.sin(theta), rad * Math.cos(theta)];
  };
  const first = torus(0, phi0),
    entryT: Vec3 = [0, 1, 0];
  path.add([0, -2.1, 0.38]);
  path.cubic([0, -0.7, 0.38], [xMain, -0.3, R], [xMain, 0.35, R]);
  path.cubic([xMain, 0.7, R], first.map((q, i) => q - 0.3 * entryT[i]!) as Vec3, first);
  path.mark();
  for (let i = 1; i <= 180; i++) {
    const theta = (Math.PI * i) / 180,
      phi = mix(-spread, spread, ease((theta - Math.PI) / Math.PI));
    path.add(torus(theta, phi));
  }
  path.mark();
  for (let i = 1; i <= 360; i++) {
    const theta = Math.PI + (TAU * i) / 360,
      phi = mix(-spread, spread, ease((theta - Math.PI) / Math.PI));
    path.add(torus(theta, phi));
  }
  path.mark();
  const firstY = mix(0.3, 1.075, tight),
    firstR = mix(0.4, 0.15, tight),
    firstZ = mix(0.4, 0.095, tight),
    circleStart: Vec3 = [xMain + firstR, firstY, R],
    ringEnd = path.points.at(-1)!;
  path.cubic(
    [ringEnd[0], ringEnd[1] - mix(0.4, 0.22, tight), ringEnd[2]],
    [circleStart[0], circleStart[1], circleStart[2] - mix(0.3, 0.2, tight)],
    circleStart,
  );
  for (let i = 1; i <= 180; i++) {
    const theta = Math.PI / 2 - (Math.PI * i) / 180;
    path.add([xMain + firstR * Math.sin(theta), firstY, R + firstZ * Math.cos(theta)]);
  }
  path.mark();
  const left = path.points.at(-1)!,
    underY = mix(1.0, 1.225, tight),
    underX = mix(0.7, 0.16, tight),
    underStart: Vec3 = [mix(-0.7, xMain - 0.02, tight), underY, 0];
  path.cubic(
    [left[0], left[1], left[2] - mix(0.3, 0.13, tight)],
    [underStart[0] - mix(0.25, 0.12, tight), underStart[1], 0],
    underStart,
  );
  path.line([underX, underY, 0]);
  path.mark();
  const r = mix(0.42, 0.092, tight),
    rise = mix(0.3, 0.13, tight),
    out = mix(0.22, 0.096, tight),
    y = mix(-0.6, 0.82, tight),
    reach = mix(0.38, 0.11, tight),
    entry: Vec3 = [xMain + r, y, R];
  const u = path.points.at(-1)!;
  const outer: Vec3 = [
    xMain + mix(1.18, 0.33, tight),
    mix(0.1, 0.98, tight),
    mix(-0.7, -0.04, tight),
  ];
  const low: Vec3 = [xMain + mix(0.55, 0.18, tight), y - mix(0.4, 0.1, tight), outer[2]];
  path.cubic(
    [u[0] + mix(0.3, 0.18, tight), u[1], 0],
    [outer[0], outer[1] + mix(0.3, 0.15, tight), outer[2]],
    outer,
  );
  path.cubic(
    [outer[0], outer[1] - mix(0.5, 0.15, tight), outer[2]],
    [low[0] + mix(0.3, 0.1, tight), low[1], low[2]],
    low,
  );
  const handle = mix(0.15, 0.07, tight);
  path.cubic(
    [low[0] - mix(0.3, 0.08, tight), low[1], low[2]],
    [entry[0], y - handle * (0.7 + rise / (TAU * r)), R - handle],
    entry,
  );
  path.mark();
  for (let i = 1; i <= 240; i++) {
    const t = i / 240,
      theta = Math.PI / 2 - TAU * t,
      rr = r + out * ease((t - 0.7) / 0.3);
    path.add([
      xMain + rr * Math.sin(theta),
      y + rise * t + 0.7 * rr * Math.cos(theta),
      R + rr * Math.cos(theta),
    ]);
  }
  const end = path.points.at(-1)!,
    tailR = mix(0.22, 0.11, tight),
    slope = 0.7 + rise / (TAU * (r + out));
  for (let i = 1; i <= 80; i++) {
    const q = ((Math.PI / 2) * i) / 80;
    path.add([
      end[0] + tailR * (1 - Math.cos(q)),
      end[1] + slope * tailR * Math.sin(q),
      end[2] + tailR * Math.sin(q),
    ]);
  }
  const tail = path.points.at(-1)!;
  path.line([1.15, tail[1], tail[2]]);
  path.mark();
  return path;
}
/** 先收拢绕环与半扣，再沿既有穿压关系整理结芯。 */
let anchorCompactBase: HitchPath | undefined;
function compactAnchorBase() {
  return (anchorCompactBase ??= anchorPath(1));
}
/** 对齐整理前后的弧长采样，避免换用轨迹时产生跳动。 */
function uniformAnchorPath(source: HitchPath, count = 900) {
  const path = new HitchPath();
  let cursor = 1;
  for (let i = 0; i <= count; i++) {
    const at = (source.total * i) / count;
    while (cursor < source.lengths.length - 1 && source.lengths[cursor]! < at) {
      cursor++;
    }
    path.add(
      lerp(
        source.points[cursor - 1]!,
        source.points[cursor]!,
        (at - source.lengths[cursor - 1]!) /
          (source.lengths[cursor]! - source.lengths[cursor - 1]!),
      ),
    );
  }
  path.marks = source.marks.map((mark, i) =>
    i === source.marks.length - 1 ? path.total : Math.min(mark, path.total),
  );
  return path;
}
function dressedAnchor(amount: number) {
  const dressing = getAnchorDressing();
  const base = compactAnchorBase();
  const coreStart = base.lengths.findIndex((length) => length >= base.marks[2]! - 1e-8);
  const cursor = clamp(amount) * (dressing.length - 1);
  const index = Math.min(dressing.length - 2, Math.floor(cursor));
  const blend = cursor - index;
  const path = new HitchPath();
  for (const point of base.points.slice(0, coreStart)) {
    path.add(point);
  }
  for (let i = 0; i < dressing[index]!.length; i++) {
    path.add(lerp(dressing[index]![i]!, dressing[index + 1]![i]!, blend));
  }
  path.marks = [...base.marks];
  return uniformAnchorPath(path);
}
function anchorState(progress: number) {
  const p = clamp(progress);
  let path: HitchPath;
  if (p < 0.95) {
    path = uniformAnchorPath(anchorPath(ease((p - 0.88) / 0.08)));
  } else if (p < 0.96) {
    const from = uniformAnchorPath(anchorPath(ease((p - 0.88) / 0.08)));
    const target = dressedAnchor(0);
    const blend = ease((p - 0.95) / 0.01);
    path = new HitchPath();
    for (let i = 0; i < from.points.length; i++) {
      path.add(lerp(from.points[i]!, target.points[i]!, blend));
    }
    path.marks = from.marks.map((mark, i) =>
      i === from.marks.length - 1 ? path.total : Math.min(mark, path.total),
    );
  } else {
    path = dressedAnchor(ease((p - 0.96) / 0.04));
  }
  return frame(path, p, ANCHOR_TIMES, [{ ...EYE, id: 'anchor-eye' }], '#62869b', 25);
}
export const ANCHOR_HITCH_COURSE: Course = {
  id: 'reference-anchor-hitch',
  category: 'knots',
  name: '锚结',
  title: '锚结 · 绕环后穿过绕圈，再补半扣',
  description: '在环眼上绕出往返两道绳段，首个半扣从绕圈下通过，再在主绳上补一个半扣。',
  material: '一根软绳 + 固定环眼',
  materialNote: '用柔软练习绳保留穿压空间；旁置松圈保留材料长度。',
  duration: 40,
  initialProgress: 0.68,
  frameWholeProcess: true,
  projectionBounds: { minX: -0.55, maxX: 0.85, minY: 0.55, maxY: 2.32 },
  steps: steps(ANCHOR_TIMES, [
    ['靠近环眼', '将工作端送向环眼。'],
    ['穿环折返', '先穿过环眼，绕下缘折回。'],
    ['继续绕出两道', '保持绕圈方向，完成绕环往返，暂留松量。'],
    ['绕过主绳', '将工作端越过主绳前方，引向绕圈下的开口。'],
    ['穿过绕圈下方', '从预留的圈下空间穿出工作端，形成第一个半扣。'],
    ['引向收尾位置', '在主绳下方为最后的半扣留出空间。'],
    ['补最后一个半扣', '同方向绕主绳一圈，穿过自己的开口并留出短尾。'],
    ['整理收紧', '逐步收紧绕环圈和两个半扣，确认首半扣仍被绕圈压住。'],
    ['贴紧结芯并核对', '继续整理两个半扣之间的松量，让连接段贴回结芯；检查第一半扣仍在绕圈下方。'],
  ]),
  source: 'https://knots3d.com/zh-CN/%E9%94%9A%E7%BB%93',
  sourceName: 'Knots 3D · Anchor Hitch · ABOK #1723',
  application: {
    scenarios: ['fixing', 'outdoors'],
    task: '认识绳索连接环眼的锚结结构。',
    focus: '首半扣穿在绕圈下，再补收尾半扣',
    boundary: '仅作桌面结构练习，不包含船舶系泊、实际抛锚或人员承重指导。',
  },
  getState: anchorState,
};

export const REFERENCE_EYE_HITCH_COURSES: Course[] = [BUNTLINE, ANCHOR_HITCH_COURSE];
