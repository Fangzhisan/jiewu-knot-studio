import type { Course, LessonState, Vec3 } from './types';
import { WeavingRoute, clamp, ease, mix } from './weavingGeometry';

const TAU = Math.PI * 2;
const RADIUS = 0.035;
const TIMES = [0, 0.12, 0.28, 0.45, 0.64, 0.82];

/** 上一排网目的练习弯，收结时两条腿一起牵紧，整根长度不变。 */
function previousMesh(tension: number) {
  const b = mix(0.18, 0.075, tension);
  const count = 180;
  const top = (3.2 - count * 2 * b * Math.sin(Math.PI / (2 * count))) / 2;
  const path = new WeavingRoute();
  path.add([-b, top, 0]);
  path.line([-b, 0, 0]);
  for (let i = 1; i <= count; i++) {
    const angle = Math.PI + (Math.PI * i) / count;
    path.add([b * Math.cos(angle), b * Math.sin(angle), 0]);
  }
  path.line([b, top, 0]);
  return path.points;
}

/** 梭线先穿网目，再绕住两腿，最后从自身入口桥下引出。 */
function nettingRoute(tension: number) {
  const b = mix(0.18, 0.075, tension);
  const a = mix(0.22, 0.076, tension);
  const crossingY = mix(-0.06, 0.015, tension);
  const path = new WeavingRoute();
  path.add([-0.7, -0.6, -0.35]);
  path.cubic([-0.5, -0.6, -0.35], [0, crossingY, -0.32], [0, crossingY, -0.16]);
  path.mark();
  path.line([0, crossingY, a]);
  path.cubic([0, crossingY, a + 0.28], [b - 0.15, 0.25, a], [b, 0.25, a]);
  path.mark();
  for (let i = 1; i <= 160; i++) {
    const t = i / 160;
    const angle = Math.PI / 2 - Math.PI * t;
    path.add([b + a * Math.cos(angle), mix(0.25, 0.16, ease(t)), a * Math.sin(angle)]);
  }
  for (let i = 1; i <= 100; i++) {
    const t = i / 100;
    path.add([mix(b, -b, t), mix(0.16, 0.12, ease(t)), -a]);
  }
  path.mark();
  for (let i = 1; i <= 160; i++) {
    const t = i / 160;
    const angle = -Math.PI / 2 - Math.PI * t;
    path.add([-b + a * Math.cos(angle), mix(0.12, 0.09, ease(t)), a * Math.sin(angle)]);
  }
  path.line([0.11, 0.09, a]);
  path.mark();
  path.cubic([0.26, 0.09, a], [0.6, -0.5, a], [0.8, -0.6, a]);
  path.mark();
  return path;
}

/** 备用梭线与工作段始终相连，收紧后的松量退回备用圈。 */
function nettingSupply(worked: Vec3[], length = 7) {
  const anchorX = worked[0]![0] - 0.4;
  const radius = 0.45;
  const pitch = 0.1 / TAU;
  const path = new WeavingRoute();
  path.add([anchorX, -1.1, -0.35]);
  path.cubic(
    [anchorX, -0.87, -0.35 + (0.23 * pitch) / radius],
    [anchorX + 0.2, -0.6, -0.35],
    worked[0]!,
  );
  for (const point of worked.slice(1)) {
    path.add(point);
  }
  const remaining = length - path.total;
  const n = Math.max(24, Math.ceil(remaining / 0.012));
  let angle = remaining / Math.hypot(radius, pitch);
  for (let i = 0; i < 5; i++) {
    const q = angle / n;
    const segment = Math.hypot(2 * radius * Math.sin(q / 2), pitch * q);
    angle -=
      (n * segment - remaining) / ((radius * radius * Math.sin(q) + pitch * pitch * q) / segment);
  }
  const points: Vec3[] = [];
  for (let i = 0; i <= n; i++) {
    const theta = -angle + (angle * i) / n;
    points.push([
      anchorX - radius + radius * Math.cos(theta),
      -1.1 + radius * Math.sin(theta),
      -0.35 + pitch * theta,
    ]);
  }
  points.push(...path.points.slice(1));
  return points;
}

/** 两条完整绳路按穿目、绕腿、压回与收紧顺序展开。 */
function nettingState(progress: number): LessonState {
  const p = clamp(progress);
  const tension = ease((p - 0.82) / 0.18);
  const route = nettingRoute(tension);
  let checkpoint = 0;
  for (let i = 1; i < TIMES.length; i++) {
    if (p >= TIMES[i]!) {
      checkpoint = i;
    }
  }
  const cuts = [0.12, ...route.marks];
  const amount =
    p >= 0.82
      ? route.total
      : mix(
          cuts[checkpoint]!,
          cuts[checkpoint + 1]!,
          ease((p - TIMES[checkpoint]!) / (TIMES[checkpoint + 1]! - TIMES[checkpoint]!)),
        );
  const points = nettingSupply(route.prefix(amount));
  return {
    points,
    tip: points.at(-1)!,
    radius: RADIUS,
    color: '#c0924b',
    checkpoint,
    endCaps: { start: '1B', end: '1A' },
    strands: [
      {
        id: 'previous-mesh',
        points: previousMesh(tension),
        color: '#4d8a86',
        radius: RADIUS,
        endCaps: { start: '2B', end: '2A' },
      },
    ],
  };
}

export const NETTING_PRACTICE_COURSE: Course = {
  id: 'netting-sheet-bend-practice',
  category: 'weaving',
  name: '渔网结：单目连接',
  title: '渔网结 · 穿过网目，再绕双腿压回',
  description: '用完整梭线在上一排网目上织一个单编网结，辨认穿目、围腿和自身桥下收尾。',
  material: '一根梭线与一根折成网目的练习绳',
  materialNote: '金色1A是梭线工作端，蓝绿色2A、2B构成上一排网目的双腿；备用梭线在左下方。',
  duration: 40,
  initialProgress: 0.28,
  frameWholeProcess: true,
  framingBounds: { minX: -0.85, maxX: 0.95, minY: -0.65, maxY: 1.6, minZ: -0.4, maxZ: 0.6 },
  projectionBounds: { minX: -0.45, maxX: 0.45, minY: -0.25, maxY: 0.5 },
  steps: [
    ['认清上一排网目', '蓝绿色绳弯作为已经形成的网目，先把金色梭线送到网目背面。'],
    ['梭线从网目中穿出', '让金色1A从网目背面穿到前面，保持两条蓝绿色网目腿分开可见。'],
    ['绕过网目的两条腿', '梭线绕到双腿外侧，再从背后横过；两条腿都要被围住。'],
    ['从自身入口桥下引回', '绕回正面后，让1A从金色入口段的下方通过，不重新穿回蓝绿色网目。'],
    ['保留连续工作尾', '把1A完整引出，准备后续续目；入口与出口保持可追踪。'],
    ['整理并收紧网结', '同时整理网目双腿和梭线围绕段，让结芯收拢，检查自身桥下的穿压关系。'],
  ].map(([title, instruction], i) => ({
    time: TIMES[i]!,
    title: title!,
    instruction: instruction!,
  })),
  source: 'https://www.animatedknots.com/sheet-bend-knot',
  sourceName: 'Animated Knots · Sheet Bend / Net Making',
  application: {
    scenarios: ['netting', 'fishing', 'repair'],
    task: '练习上一排网目与梭线之间的真实网结连接。',
    focus: '单编网结、穿目、绕双腿与桥下引尾',
    boundary: '本课是网结单元，完整网片还需续目、织行和封边。',
  },
  getState: nettingState,
};

/** 已有三目作为练习基础行，一根连续梭线依次连接，目间线段不剪断。 */
function nettingRowState(progress: number): LessonState {
  const p = clamp(progress);
  const tension = ease((p - 0.84) / 0.16);
  const foundation = new WeavingRoute();
  const working = new WeavingRoute();
  const marks = [0.12];
  for (const center of [-2, 0, 2]) {
    const previous = previousMesh(tension).map(([x, y, z]) => [x + center, y, z] as Vec3);
    if (foundation.points.length) {
      const end = foundation.points.at(-1)!;
      const start = previous[0]!;
      foundation.cubic([end[0], end[1] + 0.22, 0], [start[0], start[1] + 0.22, 0], start);
    }
    for (const point of previous) {
      foundation.add(point);
    }
    const next = nettingRoute(tension).points.map(([x, y, z]) => [x + center, y, z] as Vec3);
    if (working.points.length) {
      const end = working.points.at(-1)!;
      const start = next[0]!;
      working.cubic(
        [end[0] + 0.2, end[1] - 0.1, end[2]],
        [start[0] - 0.2, start[1], start[2]],
        start,
      );
    }
    for (const point of next) {
      working.add(point);
    }
    marks.push(working.total);
  }
  const start = foundation.points[0]!;
  const foundationTail = new WeavingRoute();
  foundationTail.add([start[0], start[1] + 16 - foundation.total, start[2]]);
  foundationTail.line(start);
  for (const point of foundation.points.slice(1)) {
    foundationTail.add(point);
  }
  const times = [0, 0.28, 0.56, 0.84];
  const step = p >= 0.84 ? 3 : p >= 0.56 ? 2 : p >= 0.28 ? 1 : 0;
  const amount =
    step === 3
      ? working.total
      : mix(marks[step]!, marks[step + 1]!, ease((p - times[step]!) / 0.28));
  const points = nettingSupply(working.prefix(amount), 21);
  return {
    points,
    tip: points.at(-1)!,
    radius: RADIUS,
    color: '#c0924b',
    checkpoint: step,
    endCaps: { start: '1B', end: '1A' },
    strands: [
      {
        id: 'previous-row',
        points: foundationTail.points,
        radius: RADIUS,
        color: '#4d8a86',
        endCaps: { start: '2B', end: '2A' },
      },
    ],
  };
}

export const NETTING_ROW_COURSE: Course = {
  ...NETTING_PRACTICE_COURSE,
  id: 'netting-sheet-bend-row',
  name: '渔网结：连续连接一排',
  title: '渔网续行 · 同一根梭线连续连接三目',
  description: '在预先排好的三个网目上依次打单编网结，保留相邻网结之间的连续梭线。',
  material: '一根连续梭线与预排三目的基础行',
  materialNote: '蓝绿色基础行已经排好，金色梭线从左至右连接三个网目；两根绳均保留完整线长。',
  duration: 60,
  initialProgress: 0.3,
  tighteningStart: 0.84,
  framingBounds: { minX: -3, maxX: 3, minY: -0.8, maxY: 1.7, minZ: -0.4, maxZ: 0.6 },
  projectionBounds: { minX: -2.5, maxX: 2.5, minY: -0.75, maxY: 0.5 },
  steps: [
    {
      time: 0,
      title: '连接第一个网目',
      instruction: '基础行已预排三目。金色梭线穿过左目，围绕双腿，再从自身入口桥下引回。',
    },
    {
      time: 0.28,
      title: '保留目间线段并续第二目',
      instruction: '第一结后不剪线，留出通向下一目的连续连接段，再重复穿目、绕双腿和桥下引尾。',
    },
    {
      time: 0.56,
      title: '完成第三个网目',
      instruction: '沿同一方向连接最右侧网目，保持前两个网结和目间连接线连续。',
    },
    {
      time: 0.84,
      title: '逐结整理并收紧',
      instruction:
        '把三个网结分别收向基础目双腿，保持相同穿压方向；后续还需用网尺定距、续织下一排。',
    },
  ],
  application: {
    scenarios: ['netting', 'fishing', 'repair'],
    task: '把单个网结延伸为同一根梭线连续连接的三目练习行。',
    focus: '连续梭线、续目、同向网结与逐结收紧',
    boundary: '基础行预先排好；本课不包含首排起头、网尺定距、完整网片及边绳安装。',
  },
  getState: nettingRowState,
};
