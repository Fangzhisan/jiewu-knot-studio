/**
 * 单结中心线按穿绳顺序预先编排，不运行绳索物理求解。
 * 步骤参考：https://www.animatedknots.com/overhand-knot
 * 工作端先成圈，再穿过圈口，最后把结收拢。
 * XY 是教学平面，Z 为正时位于绳圈前方。
 * 这些点已经足够密，按折线渲染即可，绳半径为 0.06。
 */
export type Vec3 = [number, number, number];
/** 单结当前一帧。 */
export type KnotState = { points: Vec3[]; tip: Vec3; checkpoint: number };

/** 单结的五个教学步骤。 */
export const KNOT_STEPS = [
  {
    time: 0,
    title: '准备绳线',
    instruction: '沿绳子找到标有 1A 的工作端，1B 是另一端。先把绳子展开成一个宽弯。',
  },
  {
    time: 0.14,
    title: '绕出绳圈',
    instruction: '把工作端绕回，让它从固定绳段的后方经过，留下一个清楚的绳圈。',
  },
  {
    time: 0.36,
    title: '绳端穿环',
    instruction: '工作端先从圈的前方移入圈心，再穿到后方，从另一侧引出。观察前后关系。',
  },
  { time: 0.7, title: '拉紧绳结', instruction: '先缩小绳圈，再让交叉处贴合，最后向两侧拉直绳尾。' },
  {
    time: 0.92,
    title: '完成检查',
    instruction: '沿绳子从头看到尾：工作端完整穿过一次绳圈，交叉处保持正确的上下关系。',
  },
] as const;

const ARC_START = -1.3;
const ARC_END = 4.45;
const FRONT = 0.68;
const BACK = -0.68;
const STANDING: Vec3 = [-2.7, -1.45, 0.3];

/** 限制进度范围，无效值回到起点。 */
function clamp(v: number): number {
  return Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));
}

/** 用平滑缓动衔接动作。 */
function ease(v: number): number {
  const x = clamp(v);

  return x * x * (3 - 2 * x);
}

/** 按比例插值。 */
function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 插值三维位置。 */
function lerp(a: Vec3, b: Vec3, t: number): Vec3 {
  return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
}

/** 计算两点距离。 */
function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/** 把绳圈坐标转到教学平面。 */
function polar(radius: number, theta: number, z: number): Vec3 {
  return [radius * Math.cos(theta), 0.35 + radius * Math.sin(theta), z];
}

/**
 * 用间距均衡的结构引导点生成 C2 连续三次 B 样条。
 * 这样切线和曲率在引导点之间都能接得上，免得反复磨圆折线后还留下折痕。
 * 凸包约束也把曲线留在预定范围内，三处交叉和圈口都不会被样条甩出去。
 */
function smoothPolyline(input: Vec3[]): Vec3[] {
  const controls = input.filter((point, i) => i === 0 || distance(point, input[i - 1]) > 0.000001);
  const first = controls[0];
  const last = controls[controls.length - 1];
  const padded: Vec3[] = [first, first, ...controls, last, last];
  const curve: Vec3[] = [first];

  for (let span = 0; span < padded.length - 3; span++) {
    const a = padded[span];
    const b = padded[span + 1];
    const c = padded[span + 2];
    const d = padded[span + 3];
    const guideLength = distance(a, b) + distance(b, c) + distance(c, d);
    const divisions = Math.max(8, Math.ceil(guideLength / 0.035));

    for (let sample = 1; sample <= divisions; sample++) {
      const t = sample / divisions;
      const t2 = t * t;
      const t3 = t2 * t;
      const weights = [
        (1 - 3 * t + 3 * t2 - t3) / 6,
        (4 - 6 * t2 + 3 * t3) / 6,
        (1 + 3 * t + 3 * t2 - 3 * t3) / 6,
        t3 / 6,
      ];

      curve.push([
        a[0] * weights[0] + b[0] * weights[1] + c[0] * weights[2] + d[0] * weights[3],
        a[1] * weights[0] + b[1] * weights[1] + c[1] * weights[2] + d[1] * weights[3],
        a[2] * weights[0] + b[2] * weights[1] + c[2] * weights[2] + d[2] * weights[3],
      ]);
    }
  }

  // 再按弧长等距排点，让管壁各圈的朝向平稳变化，不被采样疏密带偏。
  const lengths: number[] = [0];

  for (let i = 1; i < curve.length; i++) {
    lengths.push(lengths[i - 1] + distance(curve[i - 1], curve[i]));
  }

  const total = lengths[lengths.length - 1];
  const count = Math.max(2, Math.ceil(total / 0.024));
  const dense: Vec3[] = [[...first]];
  let segment = 1;

  for (let i = 1; i < count; i++) {
    const offset = (total * i) / count;

    while (segment < curve.length - 1 && lengths[segment] < offset) {
      segment++;
    }

    const span = lengths[segment] - lengths[segment - 1];
    dense.push(
      lerp(
        curve[segment - 1],
        curve[segment],
        span > 0 ? (offset - lengths[segment - 1]) / span : 0,
      ),
    );
  }

  dense.push([...last]);

  return dense;
}

/** 逐段展开成圈和穿环路线。 */
function looseCentreline(progress: number): Vec3[] {
  const preparation = ease(progress / 0.14);
  const formation = ease((progress - 0.14) / 0.22);
  const sweep =
    progress < 0.14
      ? mix(Math.PI - 0.35, Math.PI, preparation)
      : mix(Math.PI, ARC_END - ARC_START, formation);

  const endAngle = ARC_START + sweep;
  // 这里放的是结构引导点；渲染用的密集点稍后再算。
  // 给固定段留出均衡的弯曲距离，接入绳圈时才不会突然拐弯。
  const points: Vec3[] = [STANDING, [-1.65, -1.38, 0.3]];
  const samples = 12;

  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    const angle = ARC_START + u * sweep;
    const z = 0.3 * Math.exp(-u / 0.065) - 0.3 * Math.exp(-(1 - u) / 0.065);
    points.push(polar(1.2, angle, z));
  }

  // 成圈时让自由绳尾沿现有绳圈外侧走。
  // 最后一段先转到前方，再靠近圈口。
  const outer1 = polar(1.65, endAngle + 0.45, -0.32);
  const outer2 = polar(2.15, endAngle + 0.85, -0.08);
  // 绳尾还没绕过左下交叉点时，先留在固定段后面。
  // 越过这里再转到前方，免得途中穿进固定段。
  const tailDepth = mix(BACK, FRONT, ease((formation - 0.65) / 0.35));
  const outer3 = polar(2.25, endAngle + 1.45, tailDepth);
  const openTip = polar(2.3, endAngle + 1.82, tailDepth);
  points.push(outer1, outer2, outer3);

  if (progress <= 0.36) {
    points.push(openTip);

    return points;
  }

  const threading = clamp((progress - 0.36) / 0.34);
  const entry: Vec3 = [0.12, 0.48, FRONT];
  const exit: Vec3 = [0.12, 0.48, BACK];
  const end: Vec3 = [-2.15, 1.7, BACK];

  if (threading < 0.34) {
    // 先从前侧圈沿上方接近。绳段还跨着圈沿时不能切换前后层，
    // 只有进入圈口后才向后穿。
    points.push(lerp(openTip, entry, ease(threading / 0.34)));
  } else if (threading < 0.65) {
    const depth = ease((threading - 0.34) / 0.31);
    // 先送一段圆弯进圈，再改变深度。若绳尖刚露出就把引导点固定在正上方，
    // 穿入起步时的弯曲半径会缩成零，绳子也就折坏了。
    const feed = 0.65 * Math.sin(Math.PI * Math.sqrt(depth));
    const approach = distance(outer3, entry);
    const frontGuide: Vec3 = [
      entry[0] + ((outer3[0] - entry[0]) * feed) / approach,
      entry[1] + ((outer3[1] - entry[1]) * feed) / approach,
      FRONT,
    ];

    points.push(frontGuide, lerp(entry, exit, depth));
  } else {
    const emerge = ease((threading - 0.65) / 0.35);
    const feed = 0.65 * Math.sin(Math.PI * Math.sqrt(emerge));
    const rearGuide: Vec3 = [exit[0], exit[1], BACK + feed];
    points.push(entry, rearGuide, lerp(exit, end, emerge));
  }

  return points;
}

/**
 * 让内圈贴住穿过它的绳段来收结，不把整个结简单缩小。
 * 外侧回弯留在内圈后方；深度让两根半径 0.06 的绳表面接近相切，
 * 两边用于牵拉的长尾仍保留原来的位置。
 */
function tightenedGuides(): Vec3[] {
  const guides: Vec3[] = [
    [-2.7, -0.29, 0.1],
    [-0.55, -0.29, 0.1],
  ];

  for (let i = 0; i <= 12; i++) {
    const u = i / 12;
    const angle = mix(ARC_START, ARC_END, u);
    const start = Math.exp(-u / 0.1);
    const end = Math.exp(-(1 - u) / 0.1);
    const tilt = -0.049 * Math.cos(angle) + 0.084 * Math.sin(angle);
    guides.push([
      -0.0168 + 0.1344 * Math.cos(angle),
      0.1334 * Math.sin(angle) + 0.005 * Math.max(0, -Math.sin(angle)),
      0.14 * (start - end) +
        (1 - start - end) * tilt -
        0.06 * Math.exp(-u / 0.15) -
        0.02 * Math.exp(-(1 - u) / 0.15),
    ]);
  }

  guides.push(
    [0.0126, -0.1972, -0.147],
    [0.2266, -0.1276, -0.14],
    [0.2518, 0.0145, 0.182],
    [-0.0334, -0.0047, 0.182],
    [-0.0334, -0.0047, -0.182],
    [0.1008, 0.1566, -0.182],
    [0.55, 0.3, -0.04],
    [2.7, 0.3, 0],
  );

  return guides;
}

/** 穿绕完成后，连续过渡到收紧形状。 */
function centreline(progress: number): Vec3[] {
  if (progress <= 0.7) {
    return smoothPolyline(looseCentreline(progress));
  }

  // 收紧路线一直播放到 100%，最后一个教学步骤也要有完整动作。
  progress = 0.7 + (progress - 0.7) * (0.22 / 0.3);
  const loose = looseCentreline(0.7);
  const end = loose[loose.length - 1];
  // 新增的尾部引导点先叠在旧端点上，再逐渐分开，把工作尾向右拉顺。
  // 这样补点时曲线不会突然跳一下。
  loose.push([...end], [...end]);
  const tight = tightenedGuides();
  const closeLoops = ease((progress - 0.7) / 0.22);
  // 最后一次水平收拢之前，先把前后层次摆稳。
  // 圈口逐渐闭合时，贴近的绳段才不会互相穿过去。
  const seatCrossings = ease((progress - 0.78) / 0.14);
  const controls = loose.map((point, i): Vec3 => {
    const target = tight[i];

    return [
      mix(point[0], target[0], closeLoops),
      mix(point[1], target[1], closeLoops),
      mix(point[2], target[2], seatCrossings),
    ];
  });

  // 两个新增引导点都沿当前牵拉方向展开。
  // 绳尖还在左边时就把它们直接移向右边，会让工作尾短暂折回来。
  const tip = controls[22];
  const root = controls[19];
  const finalRoot = tight[19];
  const finalTip = tight[22];
  const axis = finalTip.map((v, i) => v - finalRoot[i]) as Vec3;
  const axisLength2 = axis.reduce((sum, v) => sum + v * v, 0);

  for (const i of [20, 21]) {
    const fraction =
      tight[i].reduce((sum, v, a) => sum + (v - finalRoot[a]) * axis[a], 0) / axisLength2;

    const along = mix(1, fraction, closeLoops);
    const onLine = lerp(root, tip, along);
    const finalOnLine = lerp(finalRoot, finalTip, fraction);
    controls[i] = onLine.map((v, a) => v + (tight[i][a] - finalOnLine[a]) * closeLoops) as Vec3;
  }

  return smoothPolyline(controls);
}

/** 生成当前进度的单结画面。 */
export function getKnotState(progress: number): KnotState {
  const p = clamp(progress);
  const points = centreline(p);
  const checkpoint = p < 0.14 ? 0 : p < 0.36 ? 1 : p < 0.7 ? 2 : p < 0.92 ? 3 : 4;

  return { points, tip: [...points[points.length - 1]] as Vec3, checkpoint };
}
