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

/** 保存整条绳子；绳中绑法不使用工作端逐段显露。 */
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

/** 输出完整绳路和真实的两端标签。 */
function state(
  path: WholeRope,
  p: number,
  times: readonly number[],
  supports: LessonSupport[],
  color: string,
  totalLength?: number,
  direct = false,
): LessonState {
  const points = totalLength
    ? reserveForMiddle(path.sampled(), totalLength)
    : direct
      ? path.points
      : path.sampled();
  let checkpoint = 0;
  for (let i = 0; i < times.length; i++) if (p >= times[i]!) checkpoint = i;
  return {
    points,
    tip: [...points.at(-1)!],
    radius: ROPE,
    color,
    supports,
    checkpoint,
    endCaps: { start: '1A', end: '1B' },
  };
}

/** 绳中绑法的余量放在圈外自由段，成圈与收紧都不删减材料长度。 */
function reserveForMiddle(formed: Vec3[], totalLength: number) {
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

const POST: LessonSupport = {
  id: 'open-post',
  kind: 'cylinder',
  position: [0, 0, 0],
  axis: [0, 1, 0],
  radius: 0.28,
  length: 3,
  color: '#aaa9a3',
};
const CLOVE_TIMES = [0, 0.16, 0.32, 0.48, 0.64, 0.82] as const;

/** 先后将两个同向绳圈从柱端套入，两端始终在圈外而不用穿绕。 */
function cloveBightState(progress: number) {
  const p = clamp(progress);
  const tight = phase(p, 0.82, 1);
  const r = mix(0.76, 0.327, tight),
    lift = mix(0.3, 0.14, tight);
  const pitch = mix(0.16, 0.095, tight),
    a = mix(0.12, 0.047, tight);
  const gate = 0.34;
  const firstForm = mix(0.5, 1, phase(p, 0, 0.16));
  const secondForm = mix(0.16, 1, phase(p, 0.32, 0.48));
  const y1 = mix(2.2, -a, phase(p, 0.16, 0.32));
  const x2 = mix(2.05, 0, phase(p, 0.48, 0.64));
  const y2 = mix(2.2, a, phase(p, 0.64, 0.82));
  const polar = (x: number, y: number, theta: number, radius: number): Vec3 => [
    x + radius * Math.sin(theta),
    y,
    radius * Math.cos(theta),
  ];
  const path = new WholeRope();
  const start = polar(0, y1, gate, r);
  const leadDip = 0;
  path.add([start[0] - 1.8 * Math.cos(gate), start[1] - leadDip, start[2] + 1.8 * Math.sin(gate)]);
  path.cubic(
    [start[0] - 1.3 * Math.cos(gate), start[1] - leadDip, start[2] + 1.3 * Math.sin(gate)],
    [start[0] - 0.22 * Math.cos(gate), start[1] - 0.7 * leadDip, start[2] + 0.22 * Math.sin(gate)],
    start,
  );
  for (let i = 1; i <= 240; i++) {
    const t = i / 240;
    path.add(
      polar(
        0,
        y1 - pitch * phase(t, 0.65 * tight, 1),
        gate + (TAU - 2 * gate) * firstForm * t,
        r + lift * phase(t, 0.65, 1),
      ),
    );
  }
  const end1 = path.points.at(-1)!;
  const endAngle1 = gate + (TAU - 2 * gate) * firstForm;
  const start2 = polar(x2, y2 + pitch, gate, r + lift);
  const handle = mix(0.65, 0.16, tight);
  const b: Vec3 = [
    end1[0] + handle * Math.cos(endAngle1),
    end1[1],
    end1[2] - handle * Math.sin(endAngle1),
  ];
  const c: Vec3 = [
    start2[0] - handle * Math.cos(gate),
    start2[1],
    start2[2] + handle * Math.sin(gate),
  ];
  const ab = lerp(end1, b, 0.5),
    bc = lerp(b, c, 0.5),
    cd = lerp(c, start2, 0.5);
  const abc = lerp(ab, bc, 0.5),
    bcd = lerp(bc, cd, 0.5),
    middle = lerp(abc, bcd, 0.5);
  const detour = 1 - phase(p, 0.16, 0.32);
  const side: Vec3 = [1.35, y1 - 0.65, 1.3];
  // 第二圈成形时把连接段托到外侧，平面内的自由尾始终从其内侧通过。
  const spread = phase(p, 0.28, 0.32) * (1 - phase(p, 0.48, 0.64));
  const raised: Vec3 = [x2 - 0.2, y2 + 0.4, 3.2];
  const firstControl: Vec3 = [
    end1[0] + 0.5 * Math.cos(endAngle1),
    end1[1],
    end1[2] - 0.5 * Math.sin(endAngle1),
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
    const t = i / 240;
    path.add(
      polar(
        x2,
        y2 + pitch * (1 - phase(t, 0, mix(1, 0.35, tight))),
        gate + (TAU - 2 * gate) * secondForm * t,
        r + lift * (1 - phase(t, 0, 0.35)),
      ),
    );
  }
  const end = path.points.at(-1)!;
  const endAngle = gate + (TAU - 2 * gate) * secondForm;
  path.line([end[0] + 1.8 * Math.cos(endAngle), end[1], end[2] - 1.8 * Math.sin(endAngle)]);
  return state(path, p, CLOVE_TIMES, [POST], '#b89a51', 22);
}

const LANYARD_TIMES = [0, 0.18, 0.36, 0.54, 0.72, 0.86] as const;
const LANYARD_BAR: LessonSupport = {
  id: 'lanyard-bar',
  kind: 'cylinder',
  position: [0, 0, 0],
  axis: [1, 0, 0],
  radius: 0.14,
  length: 1.4,
  color: '#aaa9a3',
};

/** 绳弯先绕过横杆，再从两根真实绳尾外面套回；全过程不把绳端替换为内部控制点。 */
function lanyardCore(progress: number) {
  const p = clamp(progress),
    tight = phase(p, 0.86, 1);
  const r = mix(0.4, 0.187, tight);
  const a = mix(0.22, 0.047, tight),
    pitch = mix(0.14, 0.095, tight),
    gate = 0.34;
  const behind = phase(p, 0, 0.36),
    aroundEnds = phase(p, 0.54, 0.72);
  const lift = mix(0.2, 0.13, tight) * phase(behind, 0, 0.5);
  const theta = mix(mix(gate + 0.5, 1.5 * Math.PI, behind), TAU - gate, aroundEnds);
  const expansion =
    (0.65 * phase(p, 0.18, 0.36) + 0.2 * phase(p, 0.36, 0.54)) * (1 - phase(p, 0.72, 0.86));
  const polar = (x: number, angle: number, radius: number): Vec3 => [
    x,
    radius * Math.sin(angle),
    radius * Math.cos(angle),
  ];
  const path = new WholeRope();
  path.add(polar(-a, gate, r));
  for (let i = 1; i <= 300; i++) {
    const u = i / 300;
    path.add(
      polar(
        -a - pitch * phase(u, 0, 1),
        mix(gate, theta, u),
        r + expansion * phase(u, 0.25, 1) + lift * phase(u, 0.7, 1),
      ),
    );
  }
  const outer = r + expansion + lift,
    width = a + pitch;
  for (let i = 1; i <= 160; i++) {
    const u = i / 160;
    path.add(
      polar(-width * Math.cos(Math.PI * u), theta + (width / outer) * Math.sin(Math.PI * u), outer),
    );
  }
  for (let i = 1; i <= 300; i++) {
    const u = i / 300,
      v = 1 - u;
    path.add(
      polar(
        a + pitch * phase(v, 0, 1),
        mix(gate, theta, v),
        r + expansion * phase(v, 0.25, 1) + lift * phase(v, 0.7, 1),
      ),
    );
  }
  return path;
}

/** 两条直绳腿吸收余量，整个短绳保持恒长；套过端头后两腿才逐渐拉长。 */
function lanyardState(progress: number) {
  const p = clamp(progress),
    core = lanyardCore(p);
  const length = core.points
    .slice(1)
    .reduce((sum, point, i) => sum + distance(core.points[i]!, point), 0);
  const tail = (LANYARD_LENGTH - length) / 2;
  const first = core.points[0]!,
    last = core.points.at(-1)!,
    gate = 0.34;
  const path = new WholeRope();
  path.add([first[0], first[1] - tail * Math.cos(gate), first[2] + tail * Math.sin(gate)]);
  path.line(first);
  for (const point of core.points.slice(1)) path.add(point);
  path.line([last[0], last[1] - tail * Math.cos(gate), last[2] + tail * Math.sin(gate)]);
  return state(path, p, LANYARD_TIMES, [LANYARD_BAR], '#a95b59', undefined, true);
}

const LANYARD_LENGTH = (() => {
  const core = lanyardCore(0.72);
  return (
    core.points.slice(1).reduce((sum, point, i) => sum + distance(core.points[i]!, point), 0) + 0.9
  );
})();

const CONSTRICTOR_TIMES = [0, 0.14, 0.28, 0.4, 0.6, 0.72, 0.86] as const;

/** 先在绳中做两处绳弯，将第二圈翻折到第一圈上方，最后整组套过柱端。 */
function constrictorBightState(progress: number) {
  const p = clamp(progress),
    tight = phase(p, 0.86, 1);
  const r = mix(0.8, 0.327, tight),
    under = mix(0.2, 0.098, tight);
  const a = mix(0.3, 0.12, tight),
    gate = 0.65;
  const firstSpread = mix(0.65, 1, phase(p, 0, 0.14));
  const secondSpread = mix(0.45, 1, phase(p, 0.14, 0.28));
  const fold = phase(p, 0.28, 0.6),
    angle = Math.PI * (1 - fold);
  const baseY = mix(3.2, 0, phase(p, 0.72, 0.86));
  const polar = (along: number, theta: number, radius: number): Vec3 => [
    -radius * Math.sin(theta),
    along,
    radius * Math.cos(theta),
  ];
  const first = ([x, y, z]: Vec3): Vec3 => [x, y + baseY, z];
  const hingeZ = (r + under) * Math.cos(gate);
  // 圈肩保持连接方向，中部翻折；前方回穿段不随整圈跨过骑跨段。
  const second = ([x, y, z]: Vec3, u: number): Vec3 => {
    const window = phase(u, 0, 0.32) * (1 - phase(u, 0.68, 1));
    const turn = angle * window;
    const dz = (z - hingeZ) * (1 - (1 - secondSpread) * window);
    return [
      x,
      baseY + a + (y - a) * Math.cos(turn) - dz * Math.sin(turn),
      hingeZ + (y - a) * Math.sin(turn) + dz * Math.cos(turn),
    ];
  };
  const aroundRadius = (u: number) => r + under * (1 - phase(u, 0, 0.2) + phase(u, 0.8, 1));
  const path = new WholeRope();
  const entry = first(polar(0, 0.7, r + under));
  path.add([entry[0] - 1.8 * Math.cos(0.7), entry[1], entry[2] - 1.8 * Math.sin(0.7)]);
  path.line(entry);
  for (let i = 1; i <= 100; i++) path.add(first(polar(0, mix(0.7, -gate, i / 100), r + under)));
  for (let i = 1; i <= 300; i++) {
    const u = i / 300;
    const pt = polar(-a * phase(u, 0, 1), -gate - (TAU - 2 * gate) * u, aroundRadius(u));
    const w = phase(u, 0, 0.3) * (1 - phase(u, 0.7, 1));
    pt[2] = hingeZ + (pt[2] - hingeZ) * (1 - (1 - firstSpread) * w);
    path.add(first(pt));
  }
  const end1 = path.points.at(-1)!,
    theta1 = -gate - (TAU - 2 * gate);
  const theta2 = -TAU - gate;
  const start2 = first(polar(a, theta2, r + under));
  const approach2: Vec3 = [Math.cos(theta2), 0, Math.sin(theta2)];
  const handle = mix(1.2, 0.43, tight);
  const b: Vec3 = [
    end1[0] + handle * Math.cos(theta1),
    end1[1],
    end1[2] + handle * Math.sin(theta1),
  ];
  const c = start2.map((v, i) => v - handle * approach2[i]!) as Vec3;
  path.cubic(b, c, start2);
  for (let i = 1; i <= 300; i++) {
    const u = i / 300;
    path.add(second(polar(a, theta2 - (TAU - 2 * gate) * u, aroundRadius(u)), u));
  }
  const thetaEnd = theta2 - (TAU - 2 * gate);
  for (let i = 1; i <= 150; i++) {
    const u = i / 150;
    path.add(
      first(
        polar(
          mix(a, -a, phase(u, 0, 1)),
          thetaEnd - 1.5 * gate * u,
          r + under * (1 - Math.sin(Math.PI * u) ** 2),
        ),
      ),
    );
  }
  const end = path.points.at(-1)!,
    exitAngle = thetaEnd - 1.5 * gate;
  const direction: Vec3 = [Math.cos(exitAngle), 0, Math.sin(exitAngle)];
  path.line(end.map((v, i) => v + 1.8 * direction[i]!) as Vec3);
  return state(path, p, CONSTRICTOR_TIMES, [POST], '#a77545', 25);
}

const CONSTRICTOR_COURSE: Course = {
  id: 'reference-constrictor-bight',
  frameWholeProcess: true,
  category: 'knots',
  name: '收缩结（绳中）',
  title: '收缩结（绳中） · 翻折双圈再套入柱端',
  description: '用绳中段形成两个绳圈，翻折叠合后整组套入开放柱端，整理出骑跨段下的锁紧结构。',
  material: '一根软绳 + 顶端开放的圆柱',
  materialNote: '柱端必须能让整个绳圈套过。旁置圈保留备用余绳；从绳中操作，两端不作反复穿绕。',
  duration: 38,
  initialProgress: 0.63,
  steps: makeSteps(CONSTRICTOR_TIMES, [
    ['展开第一处绳弯', '取绳中段，将第一处松弯展开成圈。两端保持在圈外，先把圈放在柱端上方。'],
    ['展开相邻绳圈', '展开相邻的第二处松弯，让它暂时与第一圈分开，观察圈口的朝向。'],
    [
      '托起第二圈',
      '托起第二圈的中部，让圈肩自然弯曲。前方连接段与回穿段留在原处，两个端头都在圈外。',
    ],
    ['翻折并叠合', '把第二圈翻到第一圈上方，让连接段形成骑跨，另一条回穿段位于它的下方。'],
    ['检查叠合顺序', '把两个圈靠拢，核对下层回穿段、第一圈固定段与上层骑跨段的前后顺序。'],
    ['整组套过柱端', '保持两圈的叠合关系，把整个圈组从开放柱端套下；两端无需绕柱穿行。'],
    ['贴柱整理收紧', '向两侧拉绳，让两圈贴柱并让骑跨段压住下面的交叉。此结勒紧后可能难以解开。'],
  ]),
  source: 'https://knots3d.com/zh-CN/%E6%94%B6%E7%BC%A9%E7%BB%93-%E7%BB%B3%E4%B8%AD',
  sourceName: 'Knots 3D · Constrictor in the Bight · ABOK #1251',
  application: {
    scenarios: ['binding', 'fixing', 'home'],
    task: '从开放端给圆杆或杆束加上绳中收缩结。',
    focus: '两个绳圈翻折叠合与骑跨下的回穿',
    boundary: '仅作桌面结构练习，不用于人员承重；勒紧后可能需要割绳解除。',
  },
  projectionBounds: { minX: -1.8, maxX: 1.8, minY: -0.8, maxY: 0.8 },
  getState: constrictorBightState,
};

/** 绳中方法有自己的关键帧，不复用绳端课程的显露动画。 */
export const REFERENCE_BIGHT_COURSES: Course[] = [
  CONSTRICTOR_COURSE,
  {
    id: 'reference-lanyard-hitch',
    category: 'knots',
    name: '雀头结（绳中套端）',
    title: '雀头结 · 绳弯套过两端，一起拉紧',
    description: '把短绳对折，用中间绳弯绕过横杆，再让整个绳弯套过两端，均匀拉紧。',
    material: '一根短软绳 + 光滑横杆',
    materialNote:
      '使用两端均可接近的短绳。让两端穿过绳弯，或把绳弯套过整个短绳，都是本课的对折绑法。',
    duration: 34,
    initialProgress: 0.64,
    steps: makeSteps(LANYARD_TIMES, [
      ['对折，送入中间绳弯', '先理出 U 形绳弯，两个端头留在前方。用绳子的中间弯部绕向横杆后方。'],
      ['从杆后拉出绳弯', '把中间绳弯继续带到杆后下方，拉出足够大的开口，两条绳腿保持并排。'],
      ['绳弯低于两个端头', '将绳弯放到两个实际绳头的下方，确认两端都能完整进入开口。'],
      ['整段套过两端', '把绳弯从两端外侧带回前方，让两端及短绳通过绳弯；不要只穿过其中一端。'],
      ['把套口拉回横杆', '沿两条绳腿把套口向横杆收回，套口在两腿前方，余量送到两条自由绳腿。'],
      ['两端均匀收紧', '一起拉两端，让两侧绕圈贴住横杆，检查横向套口包住两条绳腿。'],
    ]),
    source: 'https://knots3d.com/zh-CN/%E9%9B%80%E5%A4%B4%E7%BB%93',
    sourceName: 'Knots 3D · Lanyard Hitch · ABOK #1673',
    application: {
      scenarios: ['accessories', 'decor', 'home'],
      task: '把一段短绳连接到支架、环眼或编织挂杆。',
      focus: '对折绳弯、两端全部入圈与均匀收紧',
      boundary: '两条绳腿需均匀受拉；本课不用于人员承重。',
    },
    projectionBounds: { minX: -0.8, maxX: 0.8, minY: -1.2, maxY: 0.8 },
    getState: lanyardState,
  },

  {
    id: 'reference-clove-hitch-bight',
    category: 'knots',
    name: '双套结（绳中）',
    title: '双套结（绳中） · 两个绳圈依次套柱',
    description: '利用绳子的中段成圈，从可接近的柱端先后套入，收紧为双套结。',
    material: '一根软绳 + 顶端开放的圆柱',
    materialNote: '柱顶必须能让完整绳圈越过。左侧松绳圈是备用余绳，两个端头始终留在圈外。',
    duration: 32,
    initialProgress: 0.67,
    frameWholeProcess: true,
    steps: makeSteps(CLOVE_TIMES, [
      [
        '绕出第一个绳圈',
        '先取出一段松开的 U 形绳弯，把它整理为第一个绳圈。绳圈留在柱顶上方，两个端头都不穿过圈口。',
      ],
      [
        '第一圈套入柱端',
        '保持第一圈的方向，让整个圈从开放的柱顶降下；同时托开连接段，为第二圈留出空间。',
      ],
      [
        '同向形成第二圈',
        '在相邻的绳中段做第二圈，方向与第一圈一致。连接段保持在外侧，圈外绳尾从其内侧通过。',
      ],
      [
        '把第二圈移到柱顶',
        '提起整个第二圈，移到柱顶上方，对准圈口；同时将托开的连接段整理回前方。',
      ],
      ['第二圈套入', '让第二圈越过柱顶降下，连接段斜跨两圈前方，两个绳尾从其下方分开。'],
      [
        '两圈贴柱收紧',
        '向两侧拉绳并排好相邻两圈，检查前方斜跨段的压绳次序。两圈贴柱才是本课成品。',
      ],
    ]),
    source: 'https://knots3d.com/zh-CN/%E5%8F%8C%E5%A5%97%E7%BB%93-%E7%BB%B3%E4%B8%AD',
    sourceName: 'Knots 3D · Clove Hitch on a Bight · ABOK #1245',
    application: {
      scenarios: ['fixing', 'camping', 'garden'],
      task: '利用开放柱端，把绳中段快速系到圆柱上。',
      focus: '同向成圈、整圈套柱与斜跨压绳',
      boundary: '仅作无载荷桌面练习；不作为人员承重或长期固定的完整方案。',
    },
    projectionBounds: { minX: -1.8, maxX: 1.8, minY: -0.7, maxY: 0.7 },
    getState: cloveBightState,
  },
];
