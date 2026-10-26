import type { Course, LessonState, LessonStep, LessonSupport, Vec3 } from './types';

const TAU = 2 * Math.PI;
const ROPE = 0.045;
const clamp = (v: number) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const distance = (a: Vec3, b: Vec3) => Math.hypot(...a.map((v, i) => v - b[i]!));
const lerp = (a: Vec3, b: Vec3, t: number): Vec3 => a.map((v, i) => mix(v, b[i]!, t)) as Vec3;

/** 每次取帧独立计算，拖动时间轴不会改变下一帧的绳路。 */
function phase(p: number, start: number, end: number) {
  const t = clamp((p - start) / (end - start));
  return t * t * (3 - 2 * t);
}

/** 保存连续工作路线，绳端推进和绳弯移动都沿同一条绳子进行。 */
class WholeRope {
  points: Vec3[] = [];
  add(p: Vec3) {
    if (!this.points.length || distance(this.points.at(-1)!, p) > 1e-8) this.points.push(p);
  }
  line(end: Vec3) {
    const start = this.points.at(-1)!;
    const n = Math.max(2, Math.ceil(distance(start, end) / 0.018));
    for (let i = 1; i <= n; i++) this.add(lerp(start, end, i / n));
  }
  cubic(b: Vec3, c: Vec3, d: Vec3) {
    const a = this.points.at(-1)!;
    for (let i = 1; i <= 80; i++) {
      const t = i / 80,
        s = 1 - t;
      this.add(
        [0, 1, 2].map(
          (k) => a[k]! * s ** 3 + 3 * b[k]! * s * s * t + 3 * c[k]! * s * t * t + d[k]! * t ** 3,
        ) as Vec3,
      );
    }
  }
  sampled() {
    const lengths = [0];
    for (let i = 1; i < this.points.length; i++)
      lengths.push(lengths[i - 1]! + distance(this.points[i - 1]!, this.points[i]!));
    const total = lengths.at(-1)!;
    const count = Math.max(24, Math.ceil(total / 0.018));
    let j = 1;
    return Array.from({ length: count + 1 }, (_, i) => {
      const s = (total * i) / count;
      while (j < lengths.length - 1 && lengths[j]! < s) j++;
      return lerp(
        this.points[j - 1]!,
        this.points[j]!,
        (s - lengths[j - 1]!) / (lengths[j]! - lengths[j - 1]!),
      );
    });
  }
}

/** 文字步骤与动作使用同一组时间边界。 */
function makeSteps(
  times: readonly number[],
  descriptions: readonly (readonly [string, string])[],
): LessonStep[] {
  return descriptions.map(([title, instruction], i) => ({ time: times[i]!, title, instruction }));
}

/** 备用余绳放在主绳端的圈外自由段，成圈与收紧都不删减材料长度。 */
function reserveFromStanding(formed: Vec3[], totalLength: number) {
  const anchor = formed[0]!;
  const tangent = formed[1]!.map((v, i) => v - anchor[i]!) as Vec3;
  const tangentLength = Math.hypot(...tangent);
  const v = tangent.map((n) => n / tangentLength) as Vec3;
  const n: Vec3 = [-v[2], 0, v[0]];
  const exit = anchor.map((a, i) => a - 0.85 * v[i]!) as Vec3;
  const connection = new WholeRope();
  connection.add(exit);
  connection.cubic(
    [exit[0] + 0.3 * v[0], exit[1] + (0.3 * 0.16) / (TAU * 0.6), exit[2] + 0.3 * v[2]],
    anchor.map((a, i) => a - 0.3 * v[i]!) as Vec3,
    anchor,
  );
  for (const point of formed.slice(1)) connection.add(point);
  const used = connection.points
    .slice(1)
    .reduce((sum, point, i) => sum + distance(connection.points[i]!, point), 0);
  const remaining = Math.max(0.1, totalLength - used);
  const radius = 0.6,
    pitch = 0.16 / TAU;
  const count = Math.max(24, Math.ceil(remaining / 0.012));
  let angle = remaining / Math.hypot(radius, pitch);
  for (let i = 0; i < 4; i++) {
    const q = angle / count;
    const segment = Math.hypot(2 * radius * Math.sin(q / 2), pitch * q);
    angle -=
      (count * segment - remaining) /
      ((radius * radius * Math.sin(q) + pitch * pitch * q) / segment);
  }
  const rope = new WholeRope();
  for (let i = 0; i <= count; i++) {
    const theta = -angle + (angle * i) / count;
    rope.add([
      exit[0] + radius * n[0] * (Math.cos(theta) - 1) + radius * v[0] * Math.sin(theta),
      exit[1] + pitch * theta,
      exit[2] + radius * n[2] * (Math.cos(theta) - 1) + radius * v[2] * Math.sin(theta),
    ]);
  }
  for (const point of connection.points.slice(1)) rope.add(point);
  return rope.points;
}

const SLIP_TIMES = [0, 0.14, 0.28, 0.42, 0.56, 0.68, 0.84] as const;
const SLIP_BAR: LessonSupport = {
  id: 'slip-bar',
  kind: 'cylinder',
  position: [0, 0, 0],
  axis: [1, 0, 0],
  radius: 0.28,
  length: 2.6,
  color: '#a7a8a3',
};

/** 截取的是实际工作端路线，余绳从另一端的可见松圈送入。 */
function prefixAt(path: WholeRope, amount: number) {
  const lengths = [0];
  for (let i = 1; i < path.points.length; i++)
    lengths.push(lengths[i - 1]! + distance(path.points[i - 1]!, path.points[i]!));
  const end = Math.max(0.3, Math.min(lengths.at(-1)!, amount)),
    points: Vec3[] = [];
  for (let i = 0; i < path.points.length; i++) {
    if (lengths[i]! <= end) points.push(path.points[i]!);
    else {
      points.push(
        lerp(
          path.points[i - 1]!,
          path.points[i]!,
          (end - lengths[i - 1]!) / (lengths[i]! - lengths[i - 1]!),
        ),
      );
      break;
    }
  }
  return points;
}

/** 第二圈先留在骑跨外侧，折好绳弯后才把整个弯头推入压绳下方。 */
function slippedCloveState(progress: number): LessonState {
  const p = clamp(progress),
    tight = phase(p, 0.84, 1),
    insert = phase(p, 0.68, 0.84);
  const r = mix(0.75, 0.327, tight),
    lift = mix(0.35, 0.2, tight),
    a = mix(0.28, 0.1, tight),
    pitch = mix(0.22, 0.145, tight),
    gate = 0.34;
  const polar = (along: number, theta: number, R: number): Vec3 => [
    R * Math.sin(theta),
    along,
    R * Math.cos(theta),
  ];
  const path = new WholeRope();
  const cuts = [0.35];
  const mark = () =>
    cuts.push(path.points.slice(1).reduce((s, v, i) => s + distance(v, path.points[i]!), 0));
  const start = polar(-a, gate, r);
  path.add([start[0] - 1.8 * Math.cos(gate), start[1], start[2] + 1.8 * Math.sin(gate)]);
  path.line(start);
  mark();
  for (let i = 1; i <= 300; i++) {
    const u = i / 300;
    path.add(
      polar(
        -a - pitch * phase(u, 0.65 * tight, 1),
        gate + (TAU - 2 * gate) * u,
        r + lift * phase(u, 0.65, 1),
      ),
    );
  }
  mark();
  const end1 = path.points.at(-1)!,
    start2 = polar(a + pitch, gate, r + lift),
    handle = mix(0.65, 0.22, tight);
  path.cubic(
    [end1[0] + handle * Math.cos(gate), end1[1], end1[2] + handle * Math.sin(gate)],
    [start2[0] - handle * Math.cos(gate), start2[1], start2[2] + handle * Math.sin(gate)],
    start2,
  );
  mark();
  const thetaEnd = 2 * TAU - gate - 0.9 * (1 - insert);
  for (let i = 1; i <= 300; i++) {
    const u = i / 300;
    path.add(
      polar(
        a + pitch * (1 - phase(u, 0, mix(1, 0.35, tight))),
        TAU + gate + (thetaEnd - TAU - gate) * u,
        r + lift * (1 - phase(u, 0, 0.35)),
      ),
    );
  }
  mark();
  const returnAngle = mix(-0.7, Math.PI / 2, insert),
    tailAngle = mix(-0.9, -gate, insert);
  const e = path.points.at(-1)!,
    headX = r * Math.sin(returnAngle) + mix(0.25, 0.8, insert),
    headZ = r + 0.15;
  const flare = mix(0.18, 0.14, tight) * phase(insert, 0.6, 1),
    returnY = 0,
    returnZ = r;
  const head: Vec3 = [headX, a, headZ];
  path.cubic(
    [e[0] + 0.3 * Math.cos(thetaEnd), e[1], e[2] - 0.3 * Math.sin(thetaEnd)],
    [headX - 0.3, a, headZ],
    head,
  );
  const other: Vec3 = [headX, returnY - flare, returnZ];
  const turnHandle = 0.18 + 0.1 * phase(insert, 0.6, 1);
  path.cubic(
    [headX + turnHandle, head[1], head[2]],
    [headX + turnHandle, other[1], other[2]],
    other,
  );
  const neck = polar(returnY, returnAngle, r);
  if (returnAngle <= 0) {
    const h = (headX - neck[0]) / 3;
    path.cubic(
      [headX - h, other[1], other[2]],
      [neck[0] + h * Math.cos(returnAngle), returnY, neck[2] - h * Math.sin(returnAngle)],
      neck,
    );
  } else {
    const bend = 0.2,
      center = polar(returnY, returnAngle, r + bend),
      m: Vec3 = [center[0], returnY, center[2] - bend],
      h = (headX - m[0]) / 3;
    path.cubic([headX - h, other[1], other[2]], [m[0] + h, returnY, m[2]], m);
    for (let i = 1; i <= 100; i++) {
      const theta = (returnAngle * i) / 100;
      path.add([center[0] - bend * Math.sin(theta), returnY, center[2] - bend * Math.cos(theta)]);
    }
  }
  for (let i = 1; i <= 150; i++) path.add(polar(returnY, mix(returnAngle, tailAngle, i / 150), r));
  const tail = path.points.at(-1)!;
  path.line([tail[0] - 1.3 * Math.cos(tailAngle), returnY, tail[2] + 1.3 * Math.sin(tailAngle)]);
  mark();
  cuts.push(cuts.at(-1)!, cuts.at(-1)!);
  let checkpoint = 0;
  for (let i = 0; i < SLIP_TIMES.length; i++) if (p >= SLIP_TIMES[i]!) checkpoint = i;
  const end = SLIP_TIMES[checkpoint + 1] ?? 1;
  const amount = mix(
    cuts[checkpoint]!,
    cuts[checkpoint + 1]!,
    phase(p, SLIP_TIMES[checkpoint]!, end),
  );
  const old = reserveFromStanding(prefixAt(path, amount), 22),
    points = old.map(([x, y, z]) => [y, x, z] as Vec3);
  return {
    points,
    tip: [...points.at(-1)!],
    checkpoint,
    radius: ROPE,
    color: '#b16d45',
    supports: [SLIP_BAR],
    endCaps: { start: '1B', end: '1A' },
  };
}
const SLIP_COURSE: Course = {
  id: 'reference-slipped-clove-hitch',
  category: 'knots',
  name: '双套滑结',
  title: '双套滑结 · 折弯穿入，留出抽解端',
  description: '同向绕过横杆两圈，最后把绳弯推入骑跨段下方，形成可抽解的临时连接。',
  material: '一根软绳 + 固定横杆',
  materialNote: '留出足够长的折回绳弯，并分清绳弯与短抽解端；下方松圈保留整根绳子的备用长度。',
  duration: 38,
  initialProgress: 0.75,
  frameWholeProcess: true,
  steps: makeSteps(SLIP_TIMES, [
    ['准备横杆和绳端', '辨认固定端1B与工作端1A，把工作端靠近横杆。'],
    ['绕过第一圈', '让工作端完整绕过横杆，保留足够的工作绳长。'],
    ['斜跨第一圈', '将工作端斜跨到另一侧，形成之后压住绳弯的骑跨段。'],
    ['同向绕第二圈', '沿原来的方向再绕横杆，先把工作端留在骑跨段外侧。'],
    ['折出工作绳弯', '把工作绳折回，形成弯头与短尾。此时弯头还没有穿过骑跨段。'],
    ['把绳弯推入套口', '推动整个弯头穿入骑跨段下方，回折股从两圈之间返回，短抽解端留在外侧。'],
    [
      '整理收紧并辨认抽端',
      '拉整固定段和绳弯，使两圈贴杆；检查长绳弯和短抽解端分开可辨。此结只用于可随时检查的临时固定。',
    ],
  ]),
  source: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E6%BB%91%E7%BB%93',
  sourceName: 'Knots 3D · Slipped Clove Hitch',
  application: {
    scenarios: ['fixing', 'camping', 'home'],
    task: '将轻型绳索临时系到横杆上，并预留抽解绳端。',
    focus: '骑跨下塞入绳弯，短端留在套口外',
    boundary: '容易因误拉抽端或松弛而解开，仅作非关键临时固定，不用于人员承重。',
  },
  projectionBounds: { minX: -0.7, maxX: 0.7, minY: -0.8, maxY: 1.4 },
  getState: slippedCloveState,
};

/** 双环课的余绳固定放在世界坐标左前方，不随圈组套门旋转。 */
function clipSideReserve(formed: Vec3[], budget: number) {
  const anchor = formed[0]!,
    v = formed[1]!.map((q, i) => q - anchor[i]!) as Vec3,
    norm = Math.hypot(...v);
  for (let i = 0; i < 3; i++) v[i] = v[i]! / norm;
  const exit: Vec3 = [-1.8, -1.2, 2.8];
  const conn = new WholeRope();
  conn.add(exit);
  conn.cubic(
    [-1.8, -0.3, 2.8 + (0.9 * 0.16) / (TAU * 0.6)],
    anchor.map((q, i) => q - 1.2 * v[i]!) as Vec3,
    anchor,
  );
  for (const q of formed.slice(1)) conn.add(q);
  const used = conn.points.slice(1).reduce((a, q, i) => a + distance(q, conn.points[i]!), 0),
    remaining = Math.max(0.1, budget - used),
    R = 0.6,
    pitch = 0.16 / TAU,
    count = Math.max(24, Math.ceil(remaining / 0.012));
  let angle = remaining / Math.hypot(R, pitch);
  for (let i = 0; i < 4; i++) {
    const q = angle / count,
      len = Math.hypot(2 * R * Math.sin(q / 2), pitch * q);
    angle -= (count * len - remaining) / ((R * R * Math.sin(q) + pitch * pitch * q) / len);
  }
  const rope = new WholeRope();
  for (let i = 0; i <= count; i++) {
    const theta = -angle + (angle * i) / count;
    rope.add([
      exit[0] + R * (Math.cos(theta) - 1),
      exit[1] + R * Math.sin(theta),
      exit[2] + pitch * theta,
    ]);
  }
  for (const q of conn.points.slice(1)) rope.add(q);
  return rope.points;
}

const TWO_LOOP_TIMES = [0, 0.12, 0.2, 0.32, 0.44, 0.5, 0.56, 0.64, 0.84, 0.9] as const;
const CLIP_SUPPORT: LessonSupport = {
  id: 'clove-carabiner',
  kind: 'carabiner',
  position: [0, 0, 0],
  axis: [0, 0, 1],
  radius: 0.08,
  width: 1.2,
  length: 2.2,
  gateOpen: 0,
  color: '#aaa38d',
};

/** 沿打开的门进入门铰，再顺右下弯移到直座；门铰处用绳圈自身余量跨过圆角过渡。 */
function clipTravel(value: number): { point: Vec3; axis: Vec3 } {
  const t: Vec3 = [0.5, -Math.sqrt(3) / 2, 0],
    hinge: Vec3 = [0.6, -0.55, 0],
    nose: Vec3 = [hinge[0] - 1.1 * t[0], hinge[1] - 1.1 * t[1], 0];
  const before: Vec3 = [nose[0] - 0.2 * t[0], nose[1] - 0.2 * t[1], 0],
    d = 0.12;
  const p: Vec3 = [hinge[0] - d * t[0], hinge[1] - d * t[1], 0],
    q: Vec3 = [0.6, -0.55 - d, 0];
  const lengths = [1.3 - d, 0.24, 0.25 - d, (0.3 * Math.PI) / 2, 0.3],
    total = lengths.reduce((a, b) => a + b, 0);
  let s = clamp(value) * total;
  if (s <= lengths[0]!) {
    const u = s / lengths[0]!;
    return { point: lerp(before, p, u), axis: [-t[0], -t[1], 0] };
  }
  s -= lengths[0]!;
  if (s <= lengths[1]!) {
    const u = s / lengths[1]!,
      v = 1 - u,
      point = p.map((x, i) => x * v * v + 2 * hinge[i]! * v * u + q[i]! * u * u) as Vec3;
    const tangent = p.map((_, i) => (hinge[i]! - p[i]!) * v + (q[i]! - hinge[i]!) * u) as Vec3;
    const norm = Math.hypot(...tangent);
    return { point, axis: tangent.map((x) => -x / norm) as Vec3 };
  }
  s -= lengths[1]!;
  if (s <= lengths[2]!) {
    return { point: lerp(q, [0.6, -0.8, 0], s / lengths[2]!), axis: [0, 1, 0] };
  }
  s -= lengths[2]!;
  if (s <= lengths[3]!) {
    const theta = (-(Math.PI / 2) * s) / lengths[3]!;
    return {
      point: [0.3 + 0.3 * Math.cos(theta), -0.8 + 0.3 * Math.sin(theta), 0],
      axis: [-Math.sin(theta), Math.cos(theta), 0],
    };
  }
  s -= lengths[3]!;
  return { point: [0.3 * (1 - clamp(s / lengths[4]!)), -1.1, 0], axis: [1, 0, 0] };
}

/** 自由腿先绕开骑跨段的横向包络，再以圆弯转为下垂；不在结芯补绕圈。 */
function cloveFreeLeg(
  start: Vec3,
  side: number,
  length: number,
  r: number,
  lift: number,
  gate: number,
  amount: number,
) {
  const p = new WholeRope();
  p.add(start);
  const bend = (r * Math.sin(gate) + (r + lift) * Math.sin(gate) + 0.04) / (1 - Math.sin(gate)),
    turn = (Math.PI / 2 - gate) * amount;
  if (turn > 1e-8)
    for (let i = 1; i <= 100; i++) {
      const angle = gate + (turn * i) / 100;
      p.add([
        start[0] + side * bend * (Math.sin(angle) - Math.sin(gate)),
        start[1],
        start[2] + bend * (Math.cos(gate) - Math.cos(angle)),
      ]);
    }
  const end = p.points.at(-1)!,
    left = Math.max(0.05, length - bend * turn),
    angle = gate + turn;
  p.line([end[0] + side * left * Math.cos(angle), end[1], end[2] + left * Math.sin(angle)]);
  return p.points;
}

/** 两圈先在锁扣外形成；随后一起穿过开门端，不用绳端绕锁扣。 */
function cloveTwoLoopState(progress: number): LessonState {
  const p = clamp(progress),
    compact = phase(p, 0.44, 0.5),
    tight = phase(p, 0.9, 1);
  const r = mix(mix(0.76, 0.19, compact), 0.127, tight),
    lift = mix(0.3, 0.14, compact),
    a = mix(0.2, 0.047, compact),
    pitch = mix(0.16, 0.095, compact),
    gate = 0.34;
  const firstForm = mix(0.5, 1, phase(p, 0, 0.12)),
    secondForm = mix(0.16, 1, phase(p, 0.2, 0.32)),
    x2 = mix(1.8, 0, phase(p, 0.32, 0.44));
  const polar = (x: number, y: number, theta: number, R: number): Vec3 => [
    x + R * Math.sin(theta),
    y,
    R * Math.cos(theta),
  ];
  const path = new WholeRope(),
    start = polar(0, -a, gate, r);
  const hanging = phase(p, 0.9, 0.97);
  const standing = cloveFreeLeg(start, -1, 1.8, r, lift, gate, hanging);
  for (const point of standing.reverse()) path.add(point);
  for (let i = 1; i <= 240; i++) {
    const u = i / 240;
    path.add(
      polar(
        0,
        -a - pitch * phase(u, 0.5 * compact, 1),
        gate + (TAU - 2 * gate) * firstForm * u,
        r + lift * phase(u, 0.5, 1),
      ),
    );
  }
  const end1 = path.points.at(-1)!,
    angle1 = gate + (TAU - 2 * gate) * firstForm,
    start2 = polar(x2, a + pitch, gate, r + lift),
    h = mix(0.65, 0.16, compact);
  const b: Vec3 = [end1[0] + h * Math.cos(angle1), end1[1], end1[2] - h * Math.sin(angle1)],
    c: Vec3 = [start2[0] - h * Math.cos(gate), start2[1], start2[2] + h * Math.sin(gate)];
  const ab = lerp(end1, b, 0.5),
    bc = lerp(b, c, 0.5),
    cd = lerp(c, start2, 0.5),
    abc = lerp(ab, bc, 0.5),
    bcd = lerp(bc, cd, 0.5),
    middle = lerp(abc, bcd, 0.5),
    detour = 1 - phase(p, 0.12, 0.2),
    side: Vec3 = [1.2, -a - 0.65, 1.2];
  const spread = phase(p, 0.16, 0.2) * (1 - phase(p, 0.32, 0.44)),
    raised: Vec3 = [x2 - 0.2, a + 0.12, 3.2];
  const firstControl: Vec3 = [
    end1[0] + 0.5 * Math.cos(angle1),
    end1[1],
    end1[2] - 0.5 * Math.sin(angle1),
  ];
  path.cubic(
    lerp(lerp(ab, firstControl, detour), firstControl, spread),
    lerp(
      lerp(abc, [side[0] - 0.35, side[1], side[2]], detour),
      [raised[0] - 0.5, raised[1], raised[2]],
      spread,
    ),
    lerp(lerp(middle, side, detour), raised, spread),
  );
  path.cubic(
    lerp(
      lerp(bcd, [side[0] + 0.35, side[1], side[2]], detour),
      [raised[0] + 0.5, raised[1], raised[2]],
      spread,
    ),
    lerp(
      lerp(cd, c, detour),
      [start2[0] - 0.35 * Math.cos(gate), start2[1], start2[2] + 0.35 * Math.sin(gate)],
      spread,
    ),
    start2,
  );
  for (let i = 1; i <= 240; i++) {
    const u = i / 240;
    path.add(
      polar(
        x2,
        a + pitch * (1 - phase(u, 0, mix(1, 0.5, compact))),
        gate + (TAU - 2 * gate) * secondForm * u,
        r + lift * (1 - phase(u, 0, 0.5)),
      ),
    );
  }
  const end = path.points.at(-1)!,
    angle2 = gate + (TAU - 2 * gate) * secondForm;
  const tailLength = mix(1.8, 0.45, compact) + 1.35 * phase(p, 0.84, 0.9);
  if (hanging > 0) {
    for (const point of cloveFreeLeg(end, 1, tailLength, r, lift, gate, hanging).slice(1))
      path.add(point);
  } else
    path.line([
      end[0] + tailLength * Math.cos(angle2),
      end[1],
      end[2] - tailLength * Math.sin(angle2),
    ]);
  const old = path.sampled(),
    travel = clipTravel(phase(p, 0.64, 0.84)),
    center: Vec3 = [...travel.point];
  center[2] = 1.8 * (1 - phase(p, 0.56, 0.64));
  const turn = (Math.PI / 2) * compact,
    axis = travel.axis,
    n: Vec3 = [axis[1], -axis[0], 0];
  const eX: Vec3 = [axis[0] * Math.cos(turn), axis[1] * Math.cos(turn), -Math.sin(turn)],
    eY: Vec3 = [axis[0] * Math.sin(turn), axis[1] * Math.sin(turn), Math.cos(turn)];
  const formed = old.map(
    ([x, y, z]) => center.map((v, i) => v + eX[i]! * x + eY[i]! * y + n[i]! * z) as Vec3,
  );
  const points = clipSideReserve(formed, 26);
  let checkpoint = 0;
  for (let i = 0; i < TWO_LOOP_TIMES.length; i++) if (p >= TWO_LOOP_TIMES[i]!) checkpoint = i;
  const gateOpen = 0.5 * phase(p, 0.5, 0.56) * (1 - phase(p, 0.84, 0.9));
  return {
    points,
    tip: [...points.at(-1)!],
    checkpoint,
    radius: ROPE,
    color: '#b89a51',
    supports: [{ ...CLIP_SUPPORT, gateOpen }],
    endCaps: { start: '1A', end: '1B' },
  };
}
const TWO_LOOP_COURSE: Course = {
  id: 'reference-clove-hitch-two-loop',
  category: 'knots',
  name: '双套结（双环）',
  title: '双套结（双环） · 叠好双圈，再扣入锁扣',
  description: '在绳中同时形成两个同向绳圈，叠合后从打开的锁扣门套入，移到下弯处再关门整理。',
  material: '一根软绳 + 可开门锁扣',
  materialNote: '两个自由端都留在圈外。演示先叠双环，再从开门端套入；旁置圈保留余绳。',
  duration: 44,
  initialProgress: 0.36,
  frameWholeProcess: true,
  steps: makeSteps(TWO_LOOP_TIMES, [
    ['形成第一圈', '取绳中松弯形成第一圈，两个绳端都留在圈外。'],
    ['理顺连接段', '把两圈之间的连接段提到外侧，避开第二圈和自由尾将要经过的空间。'],
    ['并排形成第二圈', '沿同一方向再形成第二圈，先保持两圈分开。'],
    ['叠合双圈', '将第二圈移到第一圈上方，同时放回连接段；保持相同的圈向和前后交叉顺序。'],
    [
      '收拢并转向门口',
      '收拢已叠好的圈组，把多余绳长送回旁置松圈，再转向锁扣门口；两圈作为一组移动。',
    ],
    ['打开锁扣门', '打开锁扣门，确认通向下弯的路径畅通。'],
    ['把双圈对准开门端', '让两圈对准打开的门端，保留圈口空间。'],
    ['整体套入并移到下弯', '把叠好的圈组套过开门端，沿门轴和下弯移动到锁扣底座。两端始终不穿圈。'],
    ['关闭锁扣门', '圈组到达下弯后关闭门，放出短端的整理余量，检查绳子没有夹在门缝。'],
    ['整理两股并收紧', '让两圈贴住下弯，整理前方骑跨，把两股自由绳朝下引出。'],
  ]),
  source: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E5%8F%8C%E7%8E%AF',
  sourceName: 'Knots 3D · Clove Hitch (Two Loop) · ABOK #1245',
  application: {
    scenarios: ['fixing', 'outdoors', 'climbing'],
    task: '在绳中叠好双环，连接到可打开的锁扣。',
    focus: '双环叠合、开门套入与下弯整理',
    boundary: '仅作桌面结法演示，不构成人员承重、攀登保护或锚点设置指导。',
  },
  projectionBounds: { minX: -0.8, maxX: 0.8, minY: -1.8, maxY: 1.25 },
  getState: cloveTwoLoopState,
};

export const REFERENCE_CLOVE_VARIANT_COURSES: Course[] = [SLIP_COURSE, TWO_LOOP_COURSE];
