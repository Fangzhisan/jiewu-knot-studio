import type { Course, LessonState, LessonStep, LessonStrand, Vec3 } from './types';

const TAU = Math.PI * 2;
const TWINE_RADIUS = 0.024;

/** 这些路线独立编排，只演示穿绕与整理，不求解真实绳索受力。 */
const clamp = (value: number) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (value: number) => {
  const t = clamp(value);

  return t * t * (3 - 2 * t);
};
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => [
  mix(a[0], b[0], t),
  mix(a[1], b[1], t),
  mix(a[2], b[2], t),
];
const distance = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** 按弧长推进工作端，已显露的线段不会随着取样数量跳动。 */
class CordRoute {
  points: Vec3[] = [];
  lengths: number[] = [];
  marks: number[] = [];
  total = 0;

  add(point: Vec3) {
    const last = this.points.at(-1);
    const segment = last ? distance(last, point) : 0;

    if (last && segment < 1e-8) {
      return;
    }

    this.total += segment;
    this.points.push(point);
    this.lengths.push(this.total);
  }

  line(to: Vec3) {
    const from = this.points.at(-1)!;
    const count = Math.max(2, Math.ceil(distance(from, to) / 0.025));

    for (let i = 1; i <= count; i++) {
      this.add(lerp(from, to, i / count));
    }
  }

  curve(b: Vec3, c: Vec3, to: Vec3) {
    const from = this.points.at(-1)!;

    for (let i = 1; i <= 64; i++) {
      const t = i / 64;
      const s = 1 - t;

      this.add(
        [0, 1, 2].map(
          (axis) =>
            s ** 3 * from[axis]! +
            3 * s ** 2 * t * b[axis]! +
            3 * s * t ** 2 * c[axis]! +
            t ** 3 * to[axis]!,
        ) as Vec3,
      );
    }
  }

  mark() {
    this.marks.push(this.total);
  }

  prefix(length: number, resolution = 0.018): Vec3[] {
    const end = Math.max(0.08, Math.min(this.total, length));
    const count = Math.max(12, Math.ceil(end / resolution));
    let cursor = 1;

    return Array.from({ length: count + 1 }, (_, index) => {
      const at = (end * index) / count;

      while (cursor < this.lengths.length - 1 && this.lengths[cursor]! < at) {
        cursor++;
      }

      const a = this.lengths[cursor - 1]!;
      const b = this.lengths[cursor]!;

      return lerp(this.points[cursor - 1]!, this.points[cursor]!, (at - a) / (b - a));
    });
  }
}

/** 余线接在固定端一侧，工作端仍是路线末端；抽送只改变左侧松圈的用量。 */
function withSupplyAtStart(body: Vec3[], totalLength: number): Vec3[] {
  const bodyLength = body.slice(1).reduce((sum, point, i) => sum + distance(body[i]!, point), 0);
  const anchor = body[0]!;
  const build = (sweep: number) => {
    const supply = new CordRoute();
    const count = Math.max(20, Math.ceil(sweep * 45));
    const pitch = 0.072 / TAU;
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const angle = sweep * (t - 1);
      const radius = 0.12 + pitch * sweep * t;
      supply.add([-1.75 + radius * Math.cos(angle), -1.2 + radius * Math.sin(angle), 0.315]);
    }
    const end = supply.points.at(-1)!;
    supply.curve(
      [end[0] + 0.025, end[1] + 0.25, end[2]],
      [anchor[0], anchor[1] - 0.3, anchor[2]],
      anchor,
    );
    return supply;
  };
  let low = 0;
  let high = 100;
  for (let i = 0; i < 30; i++) {
    const middle = (low + high) / 2;
    if (build(middle).total + bodyLength < totalLength) {
      low = middle;
    } else {
      high = middle;
    }
  }
  return build((low + high) / 2).points.concat(body.slice(1));
}

/** 从步骤边界取得当前段及其局部进度。 */
function stage(progress: number, steps: readonly LessonStep[]) {
  let index = 0;

  for (let i = 1; i < steps.length; i++) {
    if (progress >= steps[i]!.time) {
      index = i;
    }
  }
  const start = steps[index]!.time;
  const end = steps[index + 1]?.time ?? 1;

  return { index, amount: ease((progress - start) / (end - start)) };
}

/** 粗绳是封头对象，与细缠绳始终保持两件材料。 */
function coreRope(top: number): LessonStrand {
  return {
    id: 'rope-to-whip',
    points: [
      [0, -2.1, 0],
      [0, top, 0],
    ],
    radius: 0.22,
    color: '#aaa295',
    endCaps: { start: false, end: false },
  };
}

const COMMON_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '把绳弯放在绳端旁',
    instruction:
      '灰色是要防散的粗绳，绿色是另一根细缠绳。把细绳折成狭长绳弯，圈口朝向粗绳末端；左侧是 1A 端的余线，1B 用来缠绕。',
  },
  {
    time: 0.18,
    title: '从下方开始压住绳弯',
    instruction:
      '用 1B 同向绕过粗绳和预放的两条绳弯腿。先看前三圈：它们包围粗绳，并压住沿粗绳纵向摆放的细线。',
  },
  {
    time: 0.34,
    title: '把十圈依次排齐',
    instruction:
      '继续同向绕至十圈，各圈并排向绳端推进，不能互相叠压。上方留出原先的圈口；十圈只是本模型的示范数量，实作宽度需配合绳径。',
  },
  {
    time: 0.64,
    title: '工作端穿过预留圈口',
    instruction:
      '1B 从圈口前方穿到后方。圈口属于最初预放的绳弯，不是临时在外面另外打出的单结；转到侧面核对穿过的是哪一圈。',
  },
  {
    time: 0.8,
    title: '把接合处抽进缠绕层',
    instruction:
      '从 1A 侧抽出余量，使圈口连同穿入的 1B 移入缠绕层内。逐圈推齐，抽出的余线回到左侧松圈；画面不演示剪尾，也不代表已做耐磨检验。',
  },
];

/** 纵向预埋绳弯、十圈螺旋与穿弯尾段属于同一根连续细绳。 */
function commonWhipping(progress: number): LessonState {
  const p = clamp(progress);
  const active = stage(p, COMMON_STEPS);
  const gather = ease((p - 0.8) / 0.2);
  const bottom = mix(-0.72, -0.37, gather);
  const top = mix(0.5, 0.13, gather);
  const loopY = mix(0.93, 0.02, gather);
  const loopWidth = mix(0.115, 0.065, gather);
  const front = mix(0.315, 0.238, gather);
  const gateDepth = mix(0.315, 0.3, gather);
  const windingRadius = mix(0.49, 0.399, gather);
  const windingPhase = 1.0;
  const gateY = loopY + loopWidth * 0.35;
  const route = new CordRoute();

  route.add([-loopWidth, mix(-1.33, -0.85, gather), front]);
  route.line([-loopWidth, loopY - 0.13, front]);
  route.curve(
    [-loopWidth, loopY - 0.04, front],
    [-loopWidth, loopY - 0.04, gateDepth],
    [-loopWidth, loopY, gateDepth],
  );
  route.curve(
    [-loopWidth, loopY + loopWidth * 1.5, gateDepth],
    [loopWidth, loopY + loopWidth * 1.5, gateDepth],
    [loopWidth, loopY, gateDepth],
  );
  route.curve(
    [loopWidth, loopY - 0.04, gateDepth],
    [loopWidth, loopY - 0.04, front],
    [loopWidth, loopY - 0.13, front],
  );
  route.line([loopWidth, bottom + 0.08, front]);
  route.mark();
  const buried = [...route.points];
  const incoming = gateDepth + 0.052;
  const outgoing = mix(0.26, 0.246, gather);
  const aboveGate = Math.max(top + mix(0.14, 0.02, gather), gateY + 0.075);
  const enterGate = (target: CordRoute) => {
    const start = target.points.at(-1)!;
    const width = mix(0.22, 0.09, gather);
    const lift = mix(0.16, 0.075, gather);
    target.curve(
      [width * 2, top + 0.02, start[2]],
      [width * 2, aboveGate + lift, incoming],
      [width, aboveGate + lift, incoming],
    );
    target.curve(
      [width * 0.45, aboveGate + lift, incoming],
      [0, aboveGate + lift * 0.6, incoming],
      [0, aboveGate, incoming],
    );
  };
  const endRoute = new CordRoute();
  endRoute.add([0, top, windingRadius]);
  enterGate(endRoute);
  const tailStart = endRoute.points.length - 1;
  endRoute.line([0, gateY + 0.075, incoming]);
  endRoute.curve(
    [0, gateY - 0.07, incoming],
    [0, gateY - 0.07, outgoing],
    [0, gateY + 0.075, outgoing],
  );
  endRoute.curve(
    [-0.01, gateY + 0.15, outgoing],
    [-0.03, mix(1.28, 0.48, gather), outgoing],
    [-0.17, mix(1.33, 0.54, gather), mix(front + 0.02, 0.25, gather)],
  );
  const beneath = buried.concat(endRoute.points.slice(tailStart));
  // 以各条埋线的实际位置求外包络，圈列只在接合点多抬一层，不整圈外鼓。
  const windingAt = (angle: number, y: number) => {
    const sine = Math.sin(angle);
    const cosine = Math.cos(angle);
    let contact = 0.246;
    for (const point of beneath) {
      const radial = point[0] * sine + point[2] * cosine;
      const perpendicular = point[0] ** 2 + point[2] ** 2 - radial ** 2 + (y - point[1]) ** 2;
      if (perpendicular < 0.057 ** 2) {
        contact = Math.max(contact, radial + Math.sqrt(0.057 ** 2 - perpendicular));
      }
    }
    const frontAngle = Math.atan2(sine, cosine);
    const expanded = 0.32 + 0.17 * Math.exp(-((frontAngle / 0.7) ** 4));
    return Math.max(contact, mix(expanded, contact, gather));
  };
  const radii = Array.from({ length: 4001 }, (_, i) =>
    windingAt(windingPhase + ((TAU * 10 - windingPhase) * i) / 4000, mix(bottom, top, i / 4000)),
  );
  const envelope = radii.map((_, i) =>
    Math.max(...radii.slice(Math.max(0, i - 28), Math.min(radii.length, i + 29))),
  );
  const smoothRadii = envelope.map((_, i) => {
    const near = envelope.slice(Math.max(0, i - 28), Math.min(envelope.length, i + 29));
    return near.reduce((sum, value) => sum + value, 0) / near.length;
  });
  const entry: Vec3 = [
    smoothRadii[0]! * Math.sin(windingPhase),
    bottom,
    smoothRadii[0]! * Math.cos(windingPhase),
  ];
  route.curve(
    [loopWidth, bottom + 0.02, front],
    [
      entry[0] - 0.1 * Math.cos(windingPhase),
      bottom - 0.005,
      entry[2] + 0.1 * Math.sin(windingPhase),
    ],
    entry,
  );

  for (let i = 1; i <= 4000; i++) {
    const t = i / 4000;
    const angle = windingPhase + (TAU * 10 - windingPhase) * t;
    const radius = smoothRadii[i]!;

    route.add([radius * Math.sin(angle), mix(bottom, top, t), radius * Math.cos(angle)]);

    if (i === 1200) {
      route.mark();
    }
  }

  route.mark();
  // 1B 下行到埋入的绳弯，径向穿过圈口，再由贴绳的内层向上离开。
  enterGate(route);
  for (const point of endRoute.points.slice(tailStart + 1)) {
    route.add(point);
  }
  route.mark();

  const cuts = [0.18, route.marks[0]!, route.marks[1]!, route.marks[2]!, route.total, route.total];
  const body = route
    .prefix(mix(cuts[active.index]!, cuts[active.index + 1]!, active.amount), 0.009)
    .map(([x, y, z]): Vec3 => [x, y + gather * 0.37, z]);
  const points = withSupplyAtStart(body, 34);

  return {
    points,
    tip: [...points.at(-1)!],
    radius: TWINE_RADIUS,
    color: '#438c78',
    checkpoint: active.index,
    strands: [coreRope(0.72)],
    endCaps: { start: '1A', end: '1B' },
  };
}

const FLEMISH_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '从绳尾卷出中心',
    instruction:
      '把绳尾放在平整的干燥表面，顺着绳索自然的弯曲方向卷出中心。它是盘绳法，不需要做交叉或打结。',
  },
  {
    time: 0.16,
    title: '贴着中心盘第一圈',
    instruction: '将下一段绳沿中心外侧铺平，保留连续的螺旋走向。每一段都在同一平面上。',
  },
  {
    time: 0.34,
    title: '向外继续盘放',
    instruction:
      '沿相同方向逐圈向外铺开，后铺的绳段落在前一圈外侧。转到侧面看，各圈没有交叉，也不应叠成上下多层。',
  },
  {
    time: 0.66,
    title: '把外侧余绳顺出',
    instruction: '把剩余绳段沿外圈切线方向引出，避免横跨整个绳盘。中心端与外侧端都仍然是自由绳端。',
  },
  {
    time: 0.84,
    title: '合拢圈间空隙',
    instruction:
      '把圈列轻轻推齐，检查整盘只有一层且无压圈。此法适合临时整理；提起后不会像绑扎过的绳束一样保持整盘形状。',
  },
];

/** 阿基米德螺旋保持平面与相邻圈间距，外尾沿终点切线引出。 */
function flemishFlake(progress: number): LessonState {
  const p = clamp(progress);
  const active = stage(p, FLEMISH_STEPS);
  const gather = ease((p - 0.84) / 0.16);
  const pitch = mix(0.222, 0.214, gather);
  const route = new CordRoute();
  const turns = 5.3;
  const startAngle = -Math.PI / 2;

  for (let i = 0; i <= 1590; i++) {
    const t = i / 1590;
    const theta = startAngle + TAU * turns * t;
    const r = 0.14 + pitch * turns * t;

    route.add([r * Math.cos(theta), r * Math.sin(theta), 0]);

    if (i === 90 || i === 300 || i === 1350) {
      route.mark();
    }
  }

  const cuts = [0.15, route.marks[0]!, route.marks[1]!, route.marks[2]!, route.total, route.total];
  const points = route.prefix(mix(cuts[active.index]!, cuts[active.index + 1]!, active.amount));
  const end = points.at(-1)!;
  const theta = Math.atan2(end[1], end[0]);
  const outerRadius = Math.hypot(end[0], end[1]);
  const derivative: Vec3 = [
    (pitch / TAU) * Math.cos(theta) - outerRadius * Math.sin(theta),
    (pitch / TAU) * Math.sin(theta) + outerRadius * Math.cos(theta),
    0,
  ];
  const scale = Math.hypot(...derivative);
  const laidLength = points
    .slice(1)
    .reduce((sum, point, i) => sum + distance(points[i]!, point), 0);
  let remaining = 24.5 - laidLength;
  const tangent: Vec3 = derivative.map((value) => value / scale) as Vec3;
  const outward: Vec3 = [tangent[1], -tangent[0], 0];
  const appendLoose = (u: number, v: number) => {
    if (remaining <= 1e-8) {
      return;
    }
    const next = end.map((value, axis) => value + tangent[axis]! * u + outward[axis]! * v) as Vec3;
    const previous = points.at(-1)!;
    const span = distance(previous, next);
    if (span > remaining) {
      points.push(lerp(previous, next, remaining / span));
      remaining = 0;
    } else if (span > 1e-8) {
      points.push(next);
      remaining -= span;
    }
  };
  // 未铺绳在盘外排成宽松 S 弯；半圆转弯与直段相切，余线始终属于同一条绳。
  const laneWidth = 2.3;
  const turnRadius = 0.14;
  let u = 0;
  let v = 0;
  let direction = 1;
  for (let lane = 0; remaining > 1e-8 && lane < 32; lane++) {
    const fromU = u;
    for (let i = 1; i <= 128; i++) {
      appendLoose(fromU + (direction * laneWidth * i) / 128, v);
    }
    u = fromU + direction * laneWidth;
    for (let i = 1; i <= 80; i++) {
      const angle = (Math.PI * i) / 80;
      appendLoose(
        u + direction * turnRadius * Math.sin(angle),
        v + turnRadius * (1 - Math.cos(angle)),
      );
    }
    v += turnRadius * 2;
    direction *= -1;
  }
  const last = points.length - 1;
  if (
    last > 2 &&
    distance(points[last]!, points[last - 1]!) <
      distance(points[last - 1]!, points[last - 2]!) * 0.75
  ) {
    points.splice(last - 1, 1);
  }

  return {
    points,
    tip: [...points.at(-1)!],
    radius: 0.105,
    color: '#568baf',
    checkpoint: active.index,
  };
}

const WEST_STEPS: readonly LessonStep[] = [
  {
    time: 0,
    title: '把中段贴住粗绳',
    instruction:
      '把细绳中段贴在灰色粗绳背面，辨认同一根绳的 1A、1B 两个自由端。两侧宽松的余绳始终与工作端相连，后面从这些自由段送绳。',
  },
  {
    time: 0.0528,
    title: '先把一端横放在正面',
    instruction:
      '将一端从侧面送到正面，横放成被另一端绕过的绳段。尚未用到的长度保留在这一端与粗绳之间的松弯里。',
  },
  {
    time: 0.0912,
    title: '另一端绕过并穿回',
    instruction:
      '让另一真实端头绕过横放的绳段，再从它下方穿回。沿端头观察上跨与下穿，松弯逐渐送出绳长，形成第一个半结。',
  },
  {
    time: 0.1488,
    title: '抽出双尾并收紧半结',
    instruction:
      '从半结两侧抽出自由端，逐渐消去输入段的松弯，再把半结贴到粗绳上。抽出的余线留在两条自由腿中，不从已完成结内凭空消失。',
  },
  {
    time: 0.24,
    title: '移到背面再打半结',
    instruction:
      '把两个自由端分别沿粗绳两侧送到背面，重复横放、绕过、穿回、抽紧。旋转模型查看背面的动作；每次都先完成一个半结，再转向另一面。',
  },
  {
    time: 0.4,
    title: '正反交替逐个推进',
    instruction:
      '继续在正面与背面交替打半结。模型依次完成六个半结，形成紧靠粗绳的两列封头，所有余线仍属于最近半结以外的两个自由端。',
  },
  {
    time: 0.76,
    title: '同面折回准备收尾',
    instruction:
      '完成第六个半结后留在同一面，把两端沿各自一侧折回。下一次半结要反转穿绕方向，与上一个半结组成平结。',
  },
  {
    time: 0.804,
    title: '反向补一个半结',
    instruction:
      '先横放一端，再让另一端按相反方向绕过并穿回。观察工作端的路径，确认最后两次半结互为反向，而不是重复同向穿绕。',
  },
  {
    time: 0.884,
    title: '抽紧最后的收尾',
    instruction:
      '沿两条自由腿抽出余线，把最后的反向半结逐渐收拢。转弯和交叉保留各自层次，收紧后线尾仍与整个封头连续相连。',
  },
  {
    time: 0.96,
    title: '核对结列与双尾',
    instruction:
      '旋转检查前后两列是否贴住粗绳，最后两个反向半结是否整理成平结，并辨认两条外露线尾。模型保留未剪余线；实际封头还需检查是否会松动或沿粗绳滑移。',
  },
];

/** 每次半结都由两条完整自由腿送绳；已完成结列保留，真实端头依次穿绕。 */
const westCountryWhipping = (() => {
  type WPoint = number[];
  type WPath = WPoint[];
  type WRawState = {
    points: WPath;
    radius: number;
    tip: WPoint;
    strands: { id: string; points: WPath; radius: number }[];
    meta: {
      k: number;
      local: number;
      prep: number;
      lay: number;
      wrap: number;
      pull: number;
      g: number;
      armLength: number;
      finalLengths: number[];
      armCounts: number[];
    };
  };
  const TAU = 2 * Math.PI,
    radius = 0.024;
  const clamp = (v: number) => Math.max(0, Math.min(1, v)),
    mix = (a: number, b: number, t: number) => a + (b - a) * t,
    ease = (t: number) => {
      t = clamp(t);
      return t * t * (3 - 2 * t);
    };
  const lerp = (a: WPoint, b: WPoint, t: number) => a.map((x, i) => mix(x, b[i], t));
  const add = (a: WPoint, b: WPoint, s = 1) => a.map((x, i) => x + s * b[i]);
  const dist = (a: WPoint, b: WPoint) => Math.hypot(...a.map((x, i) => x - b[i]));
  const norm = (a: WPoint) => {
    const l = Math.hypot(...a);
    return a.map((x) => x / l);
  };
  const length = (ps: WPath) => ps.slice(1).reduce((s, p, i) => s + dist(ps[i], p), 0);
  function cubic(a: WPoint, b: WPoint, c: WPoint, d: WPoint, n = 96) {
    const ps = [];
    for (let i = 0; i <= n; i++) {
      let t = i / n,
        s = 1 - t;
      ps.push(
        a.map(
          (x, k) => s * s * s * x + 3 * s * s * t * b[k] + 3 * s * t * t * c[k] + t * t * t * d[k],
        ),
      );
    }
    return ps;
  }
  function join(a: WPath, b: WPath) {
    return a.concat(b.slice(1));
  }
  function prefix(ps: WPath, t: number) {
    if (t <= 0) return [ps[0]];
    const len = length(ps) * clamp(t);
    let done = 0;
    const out = [ps[0]];
    for (let i = 1; i < ps.length; i++) {
      const d = dist(ps[i - 1], ps[i]);
      if (done + d >= len) {
        const end = lerp(ps[i - 1], ps[i], (len - done) / d);
        if (dist(out.at(-1)!, end) > 1e-8) out.push(end);
        return out;
      }
      out.push(ps[i]);
      done += d;
    }
    return out;
  }
  const baseY = 0.25;
  function cylindrical(a: WPoint, b: WPoint, t: number) {
    const ra = Math.hypot(a[0], a[2]),
      rb = Math.hypot(b[0], b[2]),
      aa = Math.atan2(a[0], a[2]);
    let ab = Math.atan2(b[0], b[2]);
    while (ab - aa > Math.PI) ab -= TAU;
    while (ab - aa < -Math.PI) ab += TAU;
    const r = mix(ra, rb, t),
      angle = mix(aa, ab, t);
    return [r * Math.sin(angle), mix(a[1], b[1], t), r * Math.cos(angle)];
  }
  const fixedKnotCache = new Map<string, WPath>(),
    movingKnotCache = new Map<string, { g: number; points: WPath }>(),
    bridgeCache = new Map<string, WPath>(),
    completedCache = new Map<string, WPath>();
  // 开放时一端横放、另一端绕行；抽紧后形成前后层次明确的半结。
  function knotPath(k: number, arm: number, g: number, braid = 1) {
    const cacheKey = `${k}:${arm}:${g}`;
    if ((g === 0 || g === 1) && fixedKnotCache.has(cacheKey)) return fixedKnotCache.get(cacheKey)!;
    const movingKey = `${k}:${arm}`,
      last = movingKnotCache.get(movingKey);
    if (last?.g === g) return last.points;
    const face = k === 6 ? -1 : k % 2 === 0 ? 1 : -1,
      reverse = k === 6 ? -1 : 1,
      side = arm === 0 ? -1 : 1,
      dir = side * reverse,
      sign = arm === 0 ? 1 : -1;
    const y = baseY + 0.06 * k + (k === 6 ? 0.055 : 0),
      ps = [];
    for (let i = 0; i <= 160; i++) {
      const t = i / 160,
        a = TAU * ease(arm === 0 ? t : 1 - t) + Math.PI / 2;
      const ox = face * dir * 0.32 * (1 - 2 * t),
        oa = arm === 0 ? 0.12 : 0,
        oz = Math.sqrt(0.58 ** 2 - 0.32 ** 2);
      const open = [ox, y + 0.25 + sign * oa * Math.cos(a), face * (oz + sign * oa * Math.sin(a))];
      const x = face * dir * 0.16 * (1 - 2 * t),
        az = Math.asin(x / 0.278) + (face < 0 ? Math.PI - 2 * Math.asin(x / 0.278) : 0),
        r = 0.278 + sign * 0.032 * Math.sin(a);
      const close = [r * Math.sin(az), y + sign * 0.032 * Math.cos(a), r * Math.cos(az)];
      ps.push(cylindrical(open, close, g));
    }
    if (g === 0 || g === 1) fixedKnotCache.set(cacheKey, ps);
    else movingKnotCache.set(movingKey, { g, points: ps });
    return ps;
  }
  function closedBridge(from: WPoint, to: WPoint, arm: number, k: number) {
    const cacheKey = `${k}:${arm}`;
    if (bridgeCache.has(cacheKey)) return bridgeCache.get(cacheKey)!;
    const side = Math.sign(to[0]);
    if (k === 6) {
      const prev = knotPath(5, arm, 1),
        sx = Math.sign(prev.at(-1)![0] - prev.at(-2)![0]),
        az = Math.atan2(from[0], from[2]),
        st = [sx * Math.abs(Math.cos(az)), 0, -sx * Math.sign(Math.cos(az)) * Math.sin(az)],
        r = (to[1] - from[1]) / 2;
      const bridge = Array.from({ length: 81 }, (_, i) => {
        const a = (Math.PI * i) / 80;
        return add(add(from, st, r * Math.sin(a)), [0, r * (1 - Math.cos(a)), 0]);
      });
      bridgeCache.set(cacheKey, bridge);
      return bridge;
    }
    const a = Math.atan2(from[0], from[2]);
    let b = Math.atan2(to[0], to[2]);
    while (b - a > Math.PI) b -= TAU;
    while (b - a < -Math.PI) b += TAU;
    const r0 = Math.hypot(from[0], from[2]),
      r1 = Math.hypot(to[0], to[2]);
    const ps = [];
    for (let i = 0; i <= 120; i++) {
      const t = i / 120,
        angle = mix(a, b, t),
        r = mix(r0, r1, ease(t));
      ps.push([r * Math.sin(angle), mix(from[1], to[1], ease(t)), r * Math.cos(angle)]);
    }
    bridgeCache.set(cacheKey, ps);
    return ps;
  }
  function complete(k: number, arm: number) {
    const cacheKey = `${k}:${arm}`;
    if (completedCache.has(cacheKey)) return completedCache.get(cacheKey)!;
    let ps = [[0, baseY - 0.035, -0.246]];
    for (let n = 0; n < k; n++) {
      const kn = knotPath(n, arm, 1, 1);
      ps = join(ps, closedBridge(ps.at(-1)!, kn[0], arm, n));
      ps = join(ps, kn);
    }
    completedCache.set(cacheKey, ps);
    return ps;
  }
  const finalLengths = [0, 1].map((a) => length(complete(7, a)));
  const armLength = Math.max(...finalLengths) + 3.2;
  function resample(ps: WPath, n = 240) {
    ps = ps.filter((v, i) => i === 0 || dist(v, ps[i - 1]) > 1e-8);
    if (ps.length < 2) return Array.from({ length: n + 1 }, () => ps[0]);
    const arc = [0];
    for (let i = 1; i < ps.length; i++) arc.push(arc.at(-1)! + dist(ps[i - 1], ps[i]));
    let j = 1;
    return Array.from({ length: n + 1 }, (_, i) => {
      const at = (arc.at(-1)! * i) / n;
      while (j < arc.length - 1 && arc[j] < at) j++;
      return lerp(ps[j - 1], ps[j], (at - arc[j - 1]) / (arc[j] - arc[j - 1]));
    });
  }
  function line(a: WPoint, b: WPoint, n = 60) {
    return Array.from({ length: n + 1 }, (_, i) => lerp(a, b, i / n));
  }
  const neckR = 0.12,
    tailLead = 0.3;
  function exitLead(start: WPoint, tangent: WPoint, gather = 1, width = 0.75) {
    const side = Math.sign(start[0]) || Math.sign(tangent[0]),
      r = Math.hypot(start[0], start[2]),
      a = Math.atan2(start[0], start[2]),
      rotation = Math.sign(tangent[0] * Math.cos(a) - tangent[2] * Math.sin(a)) || 1,
      b = a + rotation * 0.9,
      end = [r * Math.sin(b), start[1] + 0.12, r * Math.cos(b)],
      et = [rotation * Math.cos(b), 0, -rotation * Math.sin(b)],
      h = ((r * 4) / 3) * Math.tan(0.9 / 4),
      out = [side, 0, 0],
      D = [side * width, end[1] + 0.08, end[2]],
      O = [side * width, start[1] + 0.08, start[2]];
    let closed = cubic(start, add(start, tangent, h), add(end, et, -h), end, 70);
    closed = join(closed, cubic(end, add(end, et, 0.12), add(D, out, -0.15), D, 60));
    const opened = cubic(start, add(start, tangent, 0.15), add(O, out, -0.15), O, 130),
      ca = resample(closed, 130);
    const points = opened.map((v, i) => lerp(v, ca[i], gather));
    return { points, tangent: out };
  }
  function neck(start: WPoint, tangent: WPoint, returning = false, departureGather = 1) {
    const lead = exitLead(
        start,
        returning ? tangent.map((v) => -v) : tangent,
        returning ? 0 : departureGather,
        returning ? 0.75 : mix(0.75, 1.2, departureGather),
      ),
      ps = lead.points.slice(),
      origin = ps.at(-1)!,
      et = lead.tangent;
    for (let i = 1; i <= 40; i++) {
      const a = ((i / 40) * Math.PI) / 2;
      ps.push(add(add(origin, et, neckR * Math.sin(a)), [0, neckR * (1 - Math.cos(a)), 0]));
    }
    return returning ? ps.reverse() : ps;
  }
  function freeTail(
    start: WPoint,
    side: number,
    L: number,
    tangent = [side, 0, 0],
    roll = 1,
    gather = 1,
  ) {
    const up = norm([0, 1, 0].map((v, i) => v - tangent[i] * tangent[1]));
    const opened = [start];
    for (let i = 1; i <= 60; i++) {
      const a = ((i / 60) * Math.PI) / 2;
      opened.push(add(add(start, tangent, neckR * Math.sin(a)), up, neckR * (1 - Math.cos(a))));
    }
    const lead = exitLead(start, tangent, 1, 1.2),
      closed = lead.points.slice(),
      origin = closed.at(-1)!,
      et = lead.tangent;
    for (let i = 1; i <= 60; i++) {
      const a = ((i / 60) * Math.PI) / 2;
      closed.push(add(add(origin, et, neckR * Math.sin(a)), [0, neckR * (1 - Math.cos(a)), 0]));
    }
    const aa = resample(opened, 160),
      bb = resample(closed, 160);
    let ps = aa.map((v, i) => cylindrical(v, bb[i], gather));
    const n = length(ps),
      endT = norm(lerp(up, [0, 1, 0], gather));
    if (L <= n) ps = prefix(ps, L / n);
    else ps = join(ps, line(ps.at(-1)!, add(ps.at(-1)!, endT, L - n)));
    return { points: ps, end: ps.at(-1)!, tangent: endT };
  }
  function smoothArrival(ps: WPath, endT: WPoint, amount = 0.15) {
    const total = length(ps),
      cut = prefix(ps, (total - Math.min(amount, total * 0.3)) / total),
      a = cut.at(-1)!,
      prev = cut.at(-2)!,
      end = ps.at(-1)!,
      st = norm(a.map((v, i) => v - prev[i])),
      h = dist(a, end) / 3;
    return join(cut, cubic(a, add(a, st, h), add(end, endT, -h), end, 40));
  }
  function uParts(
    from: WPoint,
    to: WPoint,
    st: WPoint,
    et: WPoint,
    k: number,
    departureGather = 1,
  ) {
    let dep = neck(from, st, false, departureGather),
      ret = neck(to, et, true),
      A = dep.at(-1)!,
      B = ret[0];
    const dv = [B[0] - A[0], 0, B[2] - A[2]],
      d = Math.hypot(...dv),
      dir = norm(dv),
      r = d / 2;
    let outward = [-dir[2], 0, dir[0]];
    if (Math.sign(outward[0]) !== Math.sign(to[0])) outward = outward.map((v) => -v);
    const cap = (theta: number) =>
      Array.from({ length: 81 }, (_, i) => {
        const a = (theta * i) / 80;
        return [
          r * (-dir[0] * Math.cos(a) + outward[0] * Math.sin(a) ** 2),
          r * Math.sin(a),
          r * (-dir[2] * Math.cos(a) + outward[2] * Math.sin(a) ** 2),
        ];
      });
    return { dep, ret, A, B, dir, r, cap };
  }
  function uPath(
    parts: ReturnType<typeof uParts>,
    H: number,
    theta = Math.PI,
    descent = 1,
    returnAmount = 1,
  ) {
    const { dep, ret, A, B, dir, r, cap } = parts;
    let ps = dep.slice();
    const topA = [A[0], H, A[2]],
      topB = [B[0], H, B[2]],
      center = lerp(topA, topB, 0.5);
    ps = join(ps, line(A, topA));
    ps = join(
      ps,
      cap(theta).map((v) => add(center, v)),
    );
    if (theta >= Math.PI - 1e-10) {
      ps = join(ps, line(topB, lerp(topB, B, descent)));
      if (descent >= 1 - 1e-10) ps = join(ps, prefix(ret, returnAmount));
    }
    return ps;
  }
  function uFull(parts: ReturnType<typeof uParts>, L: number) {
    const { dep, ret, A, B, r } = parts,
      H = (L - length(dep) - length(ret) - length(parts.cap(Math.PI)) + A[1] + B[1]) / 2;
    return uPath(parts, H);
  }
  // 真实端头先绕松弯顶端，再沿回程腿到达新半结入口。
  function uPrepare(parts: ReturnType<typeof uParts>, L: number, t: number) {
    const { dep, ret, A, B, r } = parts,
      depL = length(dep),
      retL = length(ret);
    const capL = length(parts.cap(Math.PI));
    if (t < 0.35) {
      const theta = Math.PI * ease(t / 0.35),
        H = L - depL - length(parts.cap(theta)) + A[1];
      return uPath(parts, H, theta, 0, 0);
    }
    if (t < 0.8) {
      const q = ease((t - 0.35) / 0.45),
        Hend = (L - depL - capL + A[1] + B[1]) / 2,
        dMax = Hend - B[1],
        d = dMax * q,
        H = L - depL - capL - d + A[1];
      return uPath(parts, H, Math.PI, d / Math.max(1e-8, H - B[1]), 0);
    }
    const amount = ease((t - 0.8) / 0.2),
      sub = prefix(ret, amount),
      H = (L - depL - length(sub) - capL + A[1] + B[1]) / 2;
    return uPath(parts, H, Math.PI, 1, amount);
  }
  function openBridge(from: WPoint, entry: WPoint, st: WPoint, et: WPoint, k: number, arm: number) {
    const side = Math.sign(entry[0]),
      face = Math.sign(entry[2]),
      y = entry[1] - 0.18,
      z = entry[2] + face * (arm === 0 ? 0.15 : -0.15),
      P = [side * 0.82, y, from[2]],
      Q = [side * 0.82, y, z],
      R = [side * 0.6, entry[1], z];
    let ps = cubic(from, add(from, st, 0.16), add(P, [0, 0, -face * 0.15]), P);
    ps = join(ps, line(P, Q));
    ps = join(ps, cubic(Q, add(Q, [0, 0, face * 0.12]), add(R, et, -0.14), R));
    ps = join(ps, cubic(R, add(R, et, 0.14), add(entry, et, -0.12), entry));
    return ps;
  }
  function fairRoute(ps: WPath, st: WPoint, et: WPoint) {
    const total = length(ps),
      n = Math.max(30, Math.ceil(total / 0.009)),
      step = total / n,
      raw = resample(ps, n);
    let points = raw;
    const reach = 9,
      sigma = 4;
    for (let pass = 0; pass < 3; pass++) {
      const previous = points;
      points = previous.map((p, i) => {
        let sum = [0, 0, 0],
          weight = 0;
        for (let j = -reach; j <= reach; j++) {
          const at = i + j,
            w = Math.exp((-j * j) / (2 * sigma * sigma)),
            q =
              at < 0
                ? add(previous[0], st, at * step)
                : at > n
                  ? add(previous[n], et, (at - n) * step)
                  : previous[at];
          sum = add(sum, q, w);
          weight += w;
        }
        return sum.map((v) => v / weight);
      });
    }
    const d0 = raw[0].map((v, i) => v - points[0][i]),
      d1 = raw[n].map((v, i) => v - points[n][i]);
    points = points.map((p, i) => {
      const q = add(add(p, d0, 1 - ease((i * step) / 0.2)), d1, 1 - ease(((n - i) * step) / 0.2)),
        r = Math.hypot(q[0], q[2]);
      return r < 0.246 ? [(q[0] * 0.246) / r, q[1], (q[2] * 0.246) / r] : q;
    });
    return points;
  }
  function blendRoutes(
    a: WPath,
    b: WPath,
    t: number,
    st: WPoint | null = null,
    et: WPoint | null = null,
  ) {
    const aa = resample(a),
      bb = resample(b);
    let ps = aa.map((v, i) => cylindrical(v, bb[i], t));
    if (st && et) {
      const smooth = fairRoute(ps, st, et),
        pp = resample(ps, smooth.length - 1),
        w = Math.sin(Math.PI * t);
      ps = pp.map((v, i) => lerp(v, smooth[i], w));
      const span = Math.min(0.15, length(ps) * 0.3);
      let fixed = smoothArrival(ps, et, span);
      fixed = smoothArrival(
        fixed.slice().reverse(),
        st.map((v) => -v),
        span,
      ).reverse();
      const fp = resample(fixed, ps.length - 1);
      ps = ps.map((v, i) => lerp(v, fp[i], w));
    }
    return ps;
  }
  // 绕结区上方的自由段向后方排成宽 C 弯，缩小取景范围而不删去余线。
  const foldBase = 1.4,
    foldSpan = 4.8,
    foldCount = 1200;
  const foldTable = [[0, 0, 0]];
  for (let i = 1; i <= foldCount; i++) {
    const prev = foldTable.at(-1)!,
      t = (i - 0.5) / foldCount,
      a = Math.PI * ease(t),
      ds = foldSpan / foldCount;
    foldTable.push([
      prev[0] + ds * Math.cos(a),
      prev[1] + ds * Math.sin(a),
      Math.PI * ease(i / foldCount),
    ]);
  }
  function foldLoose(v: WPoint) {
    const s = v[1] - foldBase;
    if (s <= 0) return v;
    let y, z, a;
    if (s >= foldSpan) {
      const end = foldTable.at(-1)!;
      y = end[0] - (s - foldSpan);
      z = end[1];
      a = Math.PI;
    } else {
      const ix = (s / foldSpan) * foldCount,
        i = Math.floor(ix),
        q = lerp(foldTable[i], foldTable[i + 1], ix - i);
      [y, z, a] = q;
    }
    return [v[0], foldBase + y - v[2] * Math.sin(a), z + v[2] * Math.cos(a)];
  }
  const bounds = [0, 0.24, 0.4, 0.49, 0.58, 0.67, 0.76, 0.96];
  function west(
    p: number,
    extra = 0,
    iteration = 0,
    previous: { extra: number; length: number } | null = null,
  ): WRawState {
    p = clamp(p);
    let k = 0;
    while (k < 6 && p >= bounds[k + 1]) k++;
    const local = clamp((p - bounds[k]) / (bounds[k + 1] - bounds[k]));
    const prep = clamp(local / 0.22),
      lay = ease((local - 0.22) / 0.16),
      wrap = ease((local - 0.38) / 0.24),
      pull = ease((local - 0.62) / 0.28),
      roll = ease((local - 0.9) / 0.1);
    const g = ease((pull - 0.66) / 0.34),
      braid = g,
      arms: WPath[] = [];
    for (let arm = 0; arm < 2; arm++) {
      let ps = complete(k, arm);
      const previous = ps.at(-1)!,
        oldKnot = k === 0 ? null : knotPath(k - 1, arm, 1),
        oldT = oldKnot
          ? norm(oldKnot.at(-1)!.map((v, i) => v - oldKnot.at(-2)![i]))
          : [arm === 0 ? -1 : 1, 0, 0];
      const around = closedBridge(previous, knotPath(k, arm, 1)[0], arm, k),
        aroundLength = length(around),
        fraction = 0.65 * ease(prep),
        laid = prefix(around, fraction),
        laidLength = length(laid);
      if (fraction > 0) ps = join(ps, laid);
      const last = ps.at(-1)!,
        free = armLength + extra - length(ps),
        full = knotPath(k, arm, g),
        entry = full[0],
        side = Math.sign(entry[0]),
        st = laid.length > 1 ? norm(laid.at(-1)!.map((v, i) => v - laid.at(-2)![i])) : oldT,
        et = norm(full[1].map((v, i) => v - full[0][i]));
      const openKnot = knotPath(k, arm, 0),
        openEntry = openKnot[0],
        openET = norm(openKnot[1].map((v, i) => v - openKnot[0][i]));
      const parts = uParts(last, openEntry, st, openET, k, 1 - ease(prep));
      if (local <= 0.22) {
        ps = join(ps, uPrepare(parts, free, prep));
      } else {
        const path = prefix(full, arm === 1 ? lay : wrap),
          pathL = length(path);
        let bridge;
        const opened = openBridge(last, openEntry, st, openET, k, arm);
        const minH = Math.max(parts.A[1], parts.B[1]) + 0.12,
          loose = uPath(parts, minH);
        if (pull <= 0.33) {
          const available = free - pathL;
          bridge = uFull(
            parts,
            mix(available, Math.min(available, length(loose)), ease(pull / 0.33)),
          );
        } else if (pull <= 0.66) {
          bridge = blendRoutes(loose, opened, ease((pull - 0.33) / 0.33), st, openET);
        } else {
          const rev = prefix(around.slice().reverse(), 1 - 0.65),
            tight = rev.reverse();
          tight[0] = last;
          bridge = blendRoutes(opened, tight, g, st, et);
          const adjusted = smoothArrival(bridge, et);
          const aa = resample(bridge),
            bb = resample(adjusted),
            w = 4 * g * (1 - g);
          bridge = aa.map((v, i) => lerp(v, bb[i], w));
        }
        // 收尾同面折回，保留起止切向，避免短桥在收合中折进自身。
        if (k === 6 && pull > 0.66) {
          const h = dist(last, entry) * 0.35;
          const candidate = cubic(last, add(last, st, h), add(entry, et, -h), entry).map((v, i) => {
            const r = Math.hypot(v[0], v[2]),
              out = arm === 0 ? 0.02 * 4 * g * (1 - g) * Math.sin((Math.PI * i) / 96) ** 2 : 0;
            return [(v[0] * (r + out)) / r, v[1], (v[2] * (r + out)) / r];
          });
          const aa = resample(bridge),
            bb = resample(candidate),
            weight = ease(g / 0.45);
          bridge = aa.map((v, i) => lerp(v, bb[i], weight));
        }
        const used = length(bridge) + pathL;
        ps = join(ps, bridge);
        ps = join(ps, path);
        const outT = norm(full.at(-1)!.map((v, i) => v - full.at(-2)![i])),
          tail = freeTail(
            ps.at(-1)!,
            -side,
            pull > 0 ? Math.max(0, free - used) : 0,
            outT,
            roll,
            g,
          );
        ps = join(ps, tail.points);
      }
      arms.push(ps);
    }
    const rawPoints = arms[0].slice().reverse().concat(arms[1].slice(1));
    let points = resample(rawPoints, Math.ceil(length(rawPoints) / 0.009));
    for (let pass = 0; pass < 4; pass++) {
      const before = points;
      points = before.map((v, i) => {
        if (i === 0 || i === before.length - 1) return v;
        let q = [0, 0, 0];
        for (let j = -2; j <= 2; j++) {
          const at = i + j,
            point =
              at < 0
                ? lerp(before[0], before[1], at)
                : at >= before.length
                  ? lerp(before.at(-1)!, before.at(-2)!, before.length - 1 - at)
                  : before[at];
          q = add(q, point, [1, 4, 6, 4, 1][j + 2] / 16);
        }
        const r = Math.hypot(q[0], q[2]);
        return q[1] >= -2.1 && q[1] <= 1.1 && r < 0.246
          ? [(q[0] * 0.246) / r, q[1], (q[2] * 0.246) / r]
          : q;
      });
    }
    points = points.map(foldLoose);
    // 平滑与余绳弯曲后重新分配自由段长度，补偿量只进入两条真实自由腿。
    const actualLength = length(points),
      lengthError = 2 * armLength - actualLength;
    if (iteration < 7 && Math.abs(lengthError) > 0.00001) {
      const derivative =
        previous && Math.abs(extra - previous.extra) > 1e-8
          ? (actualLength - previous.length) / (extra - previous.extra)
          : 2;
      const next = extra + lengthError / Math.max(0.5, Math.min(4, derivative));
      return west(p, next, iteration + 1, { extra, length: actualLength });
    }
    return {
      points,
      radius,
      tip: points.at(-1)!,
      strands: [
        {
          id: 'core',
          points: [
            [0, -2.1, 0],
            [0, 1.1, 0],
          ],
          radius: 0.22,
        },
      ],
      meta: {
        k,
        local,
        prep,
        lay,
        wrap,
        pull,
        g,
        armLength,
        finalLengths,
        armCounts: arms.map((a) => a.length),
      },
    };
  }

  return (progress: number): LessonState => {
    const state = west(clamp(progress));
    return {
      points: state.points as Vec3[],
      tip: state.tip as Vec3,
      radius: TWINE_RADIUS,
      color: '#578b59',
      checkpoint: stage(clamp(progress), WEST_STEPS).index,
      strands: [coreRope(1.1)],
      hideMainTip: true,
      endCaps: { start: '1A', end: '1B' },
    };
  };
})();

export const REFERENCE_CARE_COURSES: Course[] = [
  {
    id: 'common-whipping',
    category: 'knots',
    name: '惯用绳端结',
    title: '惯用绳端结 · 把接合处藏进缠绕层',
    description: '用一根细绳给粗绳封头，辨认预放绳弯、同向圈列与最后的抽埋。',
    material: '一段粗绳 · 一根细缠绳',
    materialNote:
      '粗绳用灰色表示。左侧松圈保存 1A 端余线，1B 是真正的工作端；缠绕时抽取余线，收紧时把余量送回松圈。',
    projectionBounds: { minX: -0.45, maxX: 0.45, minY: -0.05, maxY: 0.72 },
    duration: 42,
    initialProgress: 0.64,
    steps: COMMON_STEPS,
    source: 'https://knots3d.com/zh-CN/%E6%83%AF%E7%94%A8%E7%BB%B3%E7%AB%AF%E7%BB%93',
    sourceName: 'Knots 3D · Common Whipping · ABOK #3442',
    application: {
      scenarios: ['storage', 'home', 'camping'],
      task: '用细缠绳保护粗绳末端，减少绳股散开',
      focus: '预埋绳弯、十圈缠绕与抽埋',
      boundary: '未演示剪尾，不模拟摩擦或耐磨寿命。',
    },
    getState: commonWhipping,
  },
  {
    id: 'flemish-flake',
    frameWholeProcess: true,
    category: 'knots',
    name: '弗拉芒扁螺旋',
    title: '弗拉芒扁螺旋 · 把余绳盘成一层',
    description: '从中心向外铺出连续平面螺旋，整理甲板、地面上的临时余绳。',
    material: '一根柔软练习绳 · 平整表面',
    materialNote: '模型只有一根连续绳索，各圈共面，没有穿插或隐藏接头；末段把圈间空隙推齐。',
    duration: 30,
    initialProgress: 0.66,
    steps: FLEMISH_STEPS,
    source:
      'https://knots3d.com/zh-CN/%E5%BC%97%E6%8B%89%E8%8A%92%E6%89%81%E8%9E%BA%E6%97%8B-%E7%BB%93',
    sourceName: 'Knots 3D · Flemish Flake · ABOK #3102',
    application: {
      scenarios: ['storage', 'home', 'outdoors'],
      task: '把暂时不用的余绳在平面上盘放整齐',
      focus: '单层螺旋与外侧切线出绳',
      boundary: '这是临时盘放方法，不是打结或可提起的捆扎绳束。',
    },
    getState: flemishFlake,
  },
  {
    id: 'west-country-whipping',
    frameWholeProcess: true,
    tighteningStart: 0.884,
    projectionBounds: { minX: -0.42, maxX: 0.42, minY: 0.15, maxY: 0.92 },
    category: 'knots',
    name: '西部绳端结',
    title: '西部绳端结 · 正反交替的封头',
    description: '用同一根细绳的两端，在粗绳前后交替打半结，再用反向半结收尾。',
    material: '一段粗绳 · 一根细缠绳',
    materialNote:
      '绿色的 1A、1B 是同一根细绳的两个工作端。灰色粗绳是被包住的对象，旋转模型可看背面结列。',
    duration: 92,
    initialProgress: 0.17,
    steps: WEST_STEPS,
    source: 'https://knots3d.com/zh-CN/%E8%A5%BF%E9%83%A8%E7%BB%B3%E7%AB%AF%E7%BB%93',
    sourceName: 'Knots 3D · West Country Whipping · ABOK #3458',
    application: {
      scenarios: ['storage', 'home', 'camping'],
      task: '用两条工作端交替半结给绳端做防散封头',
      focus: '前后交替半结与最后的平结收尾',
      boundary: '中间步骤展开供辨认，抽紧后另有观察步骤；未剪线，不模拟实际摩擦或绳股压缩。',
    },
    getState: westCountryWhipping,
  },
];
