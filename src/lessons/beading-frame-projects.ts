import type { Course, LessonBead, LessonState, LessonSupport, Vec3 } from './types';
import { add, clamp, distance, ease, lerp, mix, unit } from './beadProjectGeometry';

const WIRE = 0.008;
const LOOP_RADIUS = 0.08;
const LOOP_ANGLE = Math.PI * 1.745;

/** 预成形线框可逐颗穿珠，末端另行折环固定，不靠软线维持轮廓。 */
export interface FrameDesign {
  id: string;
  name: string;
  kind: 'earrings' | 'ornament';
  form: 'straight' | 'arc' | 'spiral' | 'wave' | 'long-wave' | 'fan' | 'steps';
  instruction: string;
}

/** 给每一路设计独立轮廓，起点保留向下的平顺固定段。 */
function frameCurve(form: FrameDesign['form'], branch: number, branches: number, t: number): Vec3 {
  const x = (branch - (branches - 1) / 2) * 0.7;
  if (form === 'fan' || form === 'steps') {
    const length =
      form === 'fan'
        ? 2.0 + 0.5 * (1 - Math.abs(branch - (branches - 1) / 2))
        : 1.8 + 0.32 * branch;
    return [x * ease(t), -length * t, 0];
  }
  if (form === 'straight') {
    return [0, -2.4 * t, 0];
  }
  if (form === 'arc') {
    return [1.1 * (1 - Math.cos(t * 2.4)), -1.1 * Math.sin(t * 2.4) - 0.15 * t, 0];
  }
  if (form === 'spiral') {
    const a = t * Math.PI * 3.1;
    const r = 0.65 + 0.14 * a;
    return [r * Math.cos(a) - 0.65, -r * Math.sin(a), 0];
  }
  const length = form === 'long-wave' ? 4.1 : 2.8;
  return [0.5 * (1 - Math.cos(t * Math.PI * (form === 'long-wave' ? 3 : 2))), -length * t, 0];
}

/** 用弧长定位珠子，穿过弯曲线框时孔轴随实际局部切线转动。 */
function preparedCurve(form: FrameDesign['form'], branch: number, branches: number) {
  const raw = Array.from({ length: 801 }, (_, i) => frameCurve(form, branch, branches, i / 800));
  const first = raw[0]!;
  const initial = unit(add(raw[1]!, first, -1));
  const angle = -Math.PI / 2 - Math.atan2(initial[1], initial[0]);
  const points = raw.map((p) => {
    const x = p[0] - first[0],
      y = p[1] - first[1];
    return [
      x * Math.cos(angle) - y * Math.sin(angle) + (branch - (branches - 1) / 2) * 0.04,
      x * Math.sin(angle) + y * Math.cos(angle) - 0.2,
      0,
    ] as Vec3;
  });
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    lengths.push(lengths.at(-1)! + distance(points[i - 1]!, points[i]!));
  }
  const total = lengths.at(-1)!;
  const endAxis = unit(add(points.at(-1)!, points.at(-3)!, -1));
  const at = (length: number) => {
    if (length >= total) {
      return { point: add(points.at(-1)!, endAxis, length - total), axis: endAxis };
    }
    let low = 0,
      high = points.length - 1;
    while (high - low > 1) {
      const middle = Math.floor((low + high) / 2);
      if (lengths[middle]! < length) {
        low = middle;
      } else {
        high = middle;
      }
    }
    const t = (length - lengths[low]!) / (lengths[high]! - lengths[low]!);
    return {
      point: lerp(points[low]!, points[high]!, t),
      axis: unit(
        add(points[Math.min(points.length - 1, high + 2)]!, points[Math.max(0, low - 2)]!, -1),
      ),
    };
  };
  const sites: { at: number; radius: number }[] = [];
  const beginning = form === 'fan' || form === 'steps' ? 0.95 : 0.23;
  for (let i = 0; i < 200; i++) {
    const radius = i % 4 === 2 ? 0.11 : 0.075;
    let length = total - radius - 0.105;
    if (sites.length) {
      const next = sites[0]!;
      const point = at(next.at).point;
      const span = next.radius + radius + 0.014;
      let low = Math.max(0, next.at - span * 1.6),
        high = next.at;
      for (let k = 0; k < 36; k++) {
        const middle = (low + high) / 2;
        if (distance(point, at(middle).point) < span) {
          high = middle;
        } else {
          low = middle;
        }
      }
      length = (low + high) / 2;
    }
    if (length < beginning) {
      break;
    }
    sites.unshift({ at: length, radius });
  }
  return { points, total, endAxis, at, sites };
}

/** 两个线端都折回接近闭口，保留真实自由端，不伪造焊接。 */
function loopPoints(stem: Vec3, tangent: Vec3, radius: number, bent = 1, reverse = false) {
  const length = radius * LOOP_ANGLE;
  const n = 100;
  const points = Array.from({ length: n + 1 }, (_, i) => {
    const s = i / n;
    if (bent < 1e-7) {
      return add(stem, tangent, length * s);
    }
    const a = LOOP_ANGLE * bent * s,
      r = radius / bent;
    return add(add(stem, tangent, r * Math.sin(a)), [0, 0, r * (1 - Math.cos(a))]);
  });
  return reverse ? points.reverse() : points;
}

/** 预装扣式耳环或挂环位于线框上端，起始小眼真实套住其下边。 */
function topFinding(kind: FrameDesign['kind']): LessonSupport {
  if (kind === 'earrings') {
    return {
      id: 'earring-clasp',
      kind: 'carabiner',
      position: [0, -0.04, LOOP_RADIUS],
      axis: [0, 0, 1],
      radius: 0.016,
      length: 0.32,
      width: 0.23,
      gateOpen: 0,
      color: '#b29b71',
    };
  }
  return {
    id: 'hanging-ring',
    kind: 'ring',
    position: [0, -0.02, LOOP_RADIUS],
    axis: [0, 0, 1],
    radius: 0.18,
    length: 0.032,
    color: '#b29b71',
  };
}

/** 每颗珠都从直线自由端进入，按先内后外的顺序滑到自己的位置。 */
function frameState(
  design: FrameDesign,
  curves: ReturnType<typeof preparedCurve>[],
  p: number,
): LessonState {
  const branches = curves.length;
  const pairs = design.kind === 'earrings' ? [-1, 1] : [0];
  const bounds = curves.flatMap((c) => c.points);
  const half = Math.max(
    1.5,
    Math.max(...bounds.map((p) => p[0])) - Math.min(...bounds.map((p) => p[0])) + 0.7,
  );
  const bending = ease((p - 0.82) / 0.16);
  const beads: LessonBead[] = [];
  const tracks: {
    id: string;
    points: Vec3[];
    radius: number;
    color: string;
    endCaps: { start: string; end: string };
  }[] = [];
  const supports: LessonSupport[] = [];
  let number = 1;
  for (const pair of pairs) {
    const offset: Vec3 = [pair * half, 0, 0];
    const finding = topFinding(design.kind);
    supports.push({
      ...finding,
      id: `${pair}-${finding.id}`,
      position: add(finding.position, offset),
    });
    for (let branch = 0; branch < branches; branch++) {
      const curve = curves[branch]!;
      const startLoop = loopPoints(curve.points[0]!, [0, 1, 0], LOOP_RADIUS, 1, true);
      const tail = loopPoints(curve.points.at(-1)!, curve.endAxis, 0.09, bending);
      const points = [...startLoop, ...curve.points.slice(1), ...tail.slice(1)].map((v) =>
        add(v, offset),
      );
      tracks.push({
        id: `wire-${pair}-${branch}`,
        points,
        radius: WIRE,
        color: '#a78957',
        endCaps: { start: `${number}B`, end: `${number}A` },
      });
      number++;
      const front = clamp((p - 0.06) / 0.72) * curve.sites.length;
      for (let i = 0; i < curve.sites.length; i++) {
        const target = curve.sites[i]!.at;
        const waiting = curve.total + 0.09 * LOOP_ANGLE + 0.17 + Math.max(0, i - front) * 0.3;
        const length =
          i < Math.floor(front)
            ? target
            : i === Math.floor(front)
              ? mix(curve.total + 0.09 * LOOP_ANGLE + 0.17, target, ease(front - i))
              : waiting;
        const at = curve.at(length);
        beads.push({
          id: `frame-${pair}-${branch}-${i}`,
          position: add(at.point, offset),
          axis: at.axis,
          radius: curve.sites[i]!.radius,
          color: i % 4 === 2 ? '#d5c3d2' : '#91b3c7',
          active: i === Math.floor(front) && p < 0.78,
          label: '',
        });
      }
    }
  }
  const main = tracks[0]!;
  return {
    points: main.points,
    tip: main.points.at(-1)!,
    radius: WIRE,
    color: main.color,
    checkpoint: p < 0.06 ? 0 : p < 0.35 ? 1 : p < 0.65 ? 2 : p < 0.82 ? 3 : p < 0.98 ? 4 : 5,
    beads,
    supports,
    strands: tracks.slice(1),
    showEndLabels: false,
    hideMainTip: true,
    endCaps: main.endCaps,
  };
}

/** 同一结构的左右耳同时完成，摆件完整覆盖每条线框和各自的止珠封口。 */
export function frameProject(design: FrameDesign): Course {
  const branches = design.form === 'fan' ? 3 : design.form === 'steps' ? 5 : 1;
  const curves = Array.from({ length: branches }, (_, i) =>
    preparedCurve(design.form, i, branches),
  );
  const final = frameState(design, curves, 1);
  const positions = [
    ...final.points,
    ...(final.strands ?? []).flatMap((s) => s.points),
    ...final.beads!.map((b) => b.position),
  ];
  const bounds = {
    minX: Math.min(...positions.map((p) => p[0])) - 0.3,
    maxX: Math.max(...positions.map((p) => p[0])) + 0.3,
    minY: Math.min(...positions.map((p) => p[1])) - 0.3,
    maxY: Math.max(0.35, Math.max(...positions.map((p) => p[1])) + 0.3),
  };
  return {
    id: design.id,
    category: 'beads',
    name: design.name,
    title: `${design.name} · 穿满线框与折环封口`,
    description: design.instruction,
    material: `${design.kind === 'earrings' ? '一对预装耳扣的成形金属线框' : '带挂环的预成形金属线框'}、配套大孔珠、圆嘴钳`,
    materialNote:
      '线框形状和上端固定眼预先做好。本课逐颗穿入全部珠子，再把直线自由端折成止珠小环；不使用软线代替定形金属线。',
    duration: 55,
    initialProgress: 0.35,
    frameWholeProcess: true,
    tighteningStart: 0.82,
    framingBounds: { ...bounds, minZ: -0.1, maxZ: 0.3 },
    projectionBounds: bounds,
    steps: [
      {
        time: 0,
        title: '检查线框和预装扣件',
        instruction: design.instruction + '确认上端固定眼套在扣件上，另一端保持直线便于穿珠。',
      },
      {
        time: 0.06,
        title: '从自由端逐颗穿入',
        instruction: '珠子从金属线直端进入，沿线框滑到内侧位置；弯曲处让珠孔随局部线向转动。',
      },
      {
        time: 0.35,
        title: '继续完成轮廓排珠',
        instruction:
          '先内后外穿入，不越过已就位的珠子。' +
          (design.kind === 'earrings'
            ? '左右耳采用同样的穿法，保持配对。'
            : '每条线框分别穿满，保持挂饰的完整轮廓。'),
      },
      {
        time: 0.65,
        title: '留足端部折环长度',
        instruction:
          '所有珠子就位后，保留末端金属线的折环余量；各珠之间可轻微活动，不能挤成僵硬一团。',
      },
      {
        time: 0.82,
        title: '折回末端并收拢小眼',
        instruction: '用圆嘴钳将自由端逐渐弯成接近闭口的小眼，小眼阻挡珠子脱出；各条线框分别封口。',
      },
      {
        time: 0.98,
        title: '逐端检查整件成品',
        instruction:
          '检查全部孔位确实套在线框上、末端已折回、上端扣件完整。耳饰须两只同时完成，摆饰须每一路都封口。',
      },
    ],
    source: 'https://www.preciosa-ornela.com/content/files/downloads/project/1740-circles.pdf',
    sourceName: 'PRECIOSA ORNELA · 成形金属线串珠与端部小眼',
    application: {
      scenarios: design.kind === 'earrings' ? ['jewelry', 'gifts'] : ['decor', 'gifts', 'home'],
      task: `完成${design.kind === 'earrings' ? '一对' : '一件'}${design.name}，包括全部串珠与末端止脱小眼。`,
      focus: design.instruction,
      boundary: '预成形金属线框和上端扣件作为备好材料，本课完成其上的全部珠饰与自由端封口。',
    },
    getState: (progress) => frameState(design, curves, clamp(progress)),
  };
}

export const BEAD_FRAME_PROJECT_COURSES: Course[] = [
  frameProject({
    id: 'bead-complete-column-earrings',
    name: '直列珍珠耳坠',
    kind: 'earrings',
    form: 'straight',
    instruction: '在一对耳扣线框上从内侧向自由端串出完整直列珠坠。',
  }),
  frameProject({
    id: 'bead-complete-crescent-earrings',
    name: '弯月串珠耳饰',
    kind: 'earrings',
    form: 'arc',
    instruction: '沿月牙形金属线框串珠，保留弧形轮廓并封住自由端。',
  }),
  frameProject({
    id: 'bead-complete-spiral-earrings',
    name: '螺旋串珠耳饰',
    kind: 'earrings',
    form: 'spiral',
    instruction: '逐颗穿过螺旋线框，内圈先就位，最后封住外圈线尾。',
  }),
  frameProject({
    id: 'bead-complete-wave-earrings',
    name: '波浪珠线耳坠',
    kind: 'earrings',
    form: 'wave',
    instruction: '让珠子沿双弧线框逐颗到位，完成一对波浪轮廓耳坠。',
  }),
  frameProject({
    id: 'bead-complete-fan-earrings',
    name: '三路扇穗耳饰',
    kind: 'earrings',
    form: 'fan',
    instruction: '一对耳扣各带三条金属线穗，逐路串珠并把六个末端分别折环。',
  }),
  frameProject({
    id: 'bead-complete-tier-earrings',
    name: '阶梯珠帘耳饰',
    kind: 'earrings',
    form: 'steps',
    instruction: '每只耳饰由五路错落珠线组成，逐路串满，再核对全部止珠小眼。',
  }),
  frameProject({
    id: 'bead-complete-spiral-ornament',
    name: '螺旋珠串摆饰',
    kind: 'ornament',
    form: 'spiral',
    instruction: '在带挂环的螺旋金属线框上串出完整珠饰，最后折环封口。',
  }),
  frameProject({
    id: 'bead-complete-crescent-ornament',
    name: '月牙珠串挂饰',
    kind: 'ornament',
    form: 'arc',
    instruction: '以预成形月牙线框完成整件珠串挂饰，检查弧面穿孔与末端封口。',
  }),
  frameProject({
    id: 'bead-complete-wave-ornament',
    name: '长波纹珠串摆饰',
    kind: 'ornament',
    form: 'long-wave',
    instruction: '连续穿完长波纹线框，保持每次转弯的孔位顺畅，并收住自由端。',
  }),
  frameProject({
    id: 'bead-complete-fan-ornament',
    name: '三路扇形珠帘挂饰',
    kind: 'ornament',
    form: 'fan',
    instruction: '三路不同长度的珠帘共用上端挂环，逐路穿珠和封口。',
  }),
  frameProject({
    id: 'bead-complete-step-ornament',
    name: '五级阶梯珠帘摆饰',
    kind: 'ornament',
    form: 'steps',
    instruction: '五路错落珠线组成完整挂饰，每条珠线都完成穿入和末端止脱。',
  }),
];
