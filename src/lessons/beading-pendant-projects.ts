import type { Course, LessonState, Vec3 } from './types';
import { wireProject } from './beading-wire-projects';
import { frameProject, type FrameDesign } from './beading-frame-projects';
import { add, clamp, distance, lerp } from './beadProjectGeometry';

/** 吊坠的固定眼先套在主链中间的裸线段，主链穿过眼心后再完成珠坠。 */
function pendantState(base: Course, pendant: Course, progress: number): LessonState {
  const p = clamp(progress),
    mainP = clamp(p / 0.66),
    pendantP = clamp((p - 0.66) / 0.34);
  const state = base.getState(mainP),
    future = base.getState(Math.max(mainP, 0.78));
  const body = future.beads!.filter((b) => b.id.startsWith('body-'));
  const index = Math.floor(body.length / 2);
  const target = lerp(body[index]!.position, body[index + 1]!.position, 0.5);
  let anchor: Vec3 = [target[0], target[1], 0.009],
    best = Infinity;
  for (let i = 1; i < future.points.length; i++) {
    const a = future.points[i - 1]!,
      b = future.points[i]!;
    if ((a[0] - target[0]) * (b[0] - target[0]) > 0 || Math.abs(a[0] - b[0]) < 1e-10) {
      continue;
    }
    const point = lerp(a, b, (target[0] - a[0]) / (b[0] - a[0]));
    const d = distance(point, target);
    if (d < best) {
      best = d;
      anchor = point;
    }
  }
  const offset: Vec3 = [anchor[0], anchor[1] + 0.2, anchor[2] - 0.08];
  const ornament = pendant.getState(pendantP);
  const wires = [
    {
      id: 'pendant-wire-1',
      points: ornament.points,
      color: ornament.color!,
      radius: ornament.radius!,
      endCaps: { start: '坠1B', end: '坠1A' },
    },
    ...(ornament.strands ?? []).map((s, i) => ({
      ...s,
      id: `pendant-wire-${i + 2}`,
      endCaps: { start: `坠${i + 2}B`, end: `坠${i + 2}A` },
    })),
  ];
  return {
    ...state,
    checkpoint:
      p < 0.06
        ? 0
        : p < 0.2
          ? 1
          : p < 0.42
            ? 2
            : p < 0.55
              ? 3
              : p < 0.66
                ? 4
                : p < 0.78
                  ? 5
                  : p < 0.94
                    ? 6
                    : p < 0.99
                      ? 7
                      : 8,
    beads: [
      ...state.beads!,
      ...ornament.beads!.map((b) => ({
        ...b,
        id: `pendant-${b.id}`,
        position: add(b.position, offset),
      })),
    ],
    strands: wires.map((s) => ({ ...s, points: s.points.map((v) => add(v, offset)) })),
  };
}

/** 组合课完整覆盖主链、扣件、吊坠穿法及所有金属线末端。 */
function pendantNecklace(
  id: string,
  name: string,
  form: FrameDesign['form'],
  instruction: string,
): Course {
  const base = wireProject({
    id: 'component-necklace',
    name: '吊坠主链',
    kind: 'necklace',
    centerGap: form === 'fan' ? 0.16 : 0.06,
    radii: new Array(29).fill(0.12),
    instruction: '对称穿入主链珠身，中央预先套入吊坠固定眼。',
  });
  const pendant = frameProject({
    id: 'component-pendant',
    name: '预成形珠坠',
    kind: 'ornament',
    form,
    instruction,
  });
  const final = pendantState(base, pendant, 1);
  const points = [
    ...final.beads!.map((b) => b.position),
    ...final.points,
    ...final.strands!.flatMap((s) => s.points),
  ];
  const bounds = {
    minX: Math.min(...points.map((p) => p[0])) - 0.4,
    maxX: Math.max(...points.map((p) => p[0])) + 0.4,
    minY: Math.min(...points.map((p) => p[1])) - 0.3,
    maxY: Math.max(...points.map((p) => p[1])) + 0.6,
  };
  return {
    ...base,
    id,
    name,
    title: `${name} · 主链与珠坠完整组合`,
    description: instruction,
    material: '柔性串珠钢丝、29颗主链珠、端部压管、T扣、预成形金属线坠及配套珠',
    materialNote:
      '吊坠固定眼作为已成形部件，先由主链钢丝穿过；主链与金属线坠采用各自适合的收尾方式。',
    duration: 90,
    initialProgress: 0.42,
    tighteningStart: 0.55,
    framingBounds: {
      ...bounds,
      minX: bounds.minX * 1.4,
      maxX: bounds.maxX * 1.4,
      minY: bounds.minY - 0.8,
      minZ: -0.2,
      maxZ: 0.2,
    },
    projectionBounds: bounds,
    steps: [
      { time: 0, title: '预排主链和珠坠材料', instruction },
      {
        time: 0.06,
        title: '回穿左侧扣环',
        instruction: '先绕左侧闭合环并回穿端部压管，保留可调节余量。',
      },
      {
        time: 0.2,
        title: '串主链并穿过吊坠眼',
        instruction: '主链逐颗穿入珠孔，中央从吊坠固定眼的中心穿过，再继续串另一半。',
      },
      {
        time: 0.42,
        title: '安装右端T扣并回穿',
        instruction: '将右端绕过T扣小眼、回穿压管和末端三颗珠。',
      },
      {
        time: 0.55,
        title: '收拢主链并压紧两端',
        instruction: '整理主链活动余量和两侧端圈，压管收拢锁住两股钢丝；吊坠固定眼留在中央珠间。',
      },
      {
        time: 0.66,
        title: '从线坠自由端开始穿珠',
        instruction: '主链已经固定，再从金属线坠的直端逐颗穿入珠子，沿轮廓滑到内侧。',
      },
      {
        time: 0.78,
        title: '穿满整个珠坠',
        instruction: '继续完成所有珠坠分支，预留各自的末端折环长度。',
      },
      {
        time: 0.94,
        title: '折回珠坠末端小眼',
        instruction: '把金属线自由端逐渐折成止珠小眼，防止珠子从线坠上滑落。',
      },
      {
        time: 0.99,
        title: '检查整件项链',
        instruction: '检查主链两端扣件、中央吊坠眼和珠坠所有封口，确认每颗珠都沿真实孔位穿入。',
      },
    ],
    application: {
      scenarios: ['jewelry', 'gifts'],
      task: `完成主链、扣件与${name}的完整珠坠。`,
      focus: instruction,
      boundary: '主链使用柔性串珠钢丝与匹配压管，珠坠使用已成形金属线框；模型展示摊放的完整成品。',
    },
    getState: (p) => pendantState(base, pendant, p),
  };
}

export const BEAD_PENDANT_PROJECT_COURSES: Course[] = [
  pendantNecklace(
    'bead-complete-column-pendant-necklace',
    '直列珍珠吊坠项链',
    'straight',
    '先完成带扣主链，再穿满中央直列珠坠，并分别核对压管与折环收尾。',
  ),
  pendantNecklace(
    'bead-complete-fan-pendant-necklace',
    '三穗珠坠项链',
    'fan',
    '中央三路珠穗分别以固定眼套在主链上，主链、每路穿珠和三个末端都完整完成。',
  ),
  pendantNecklace(
    'bead-complete-wave-pendant-necklace',
    '波纹珠坠项链',
    'wave',
    '把中央波纹金属线坠与整条珠链组合，展示主链回穿和曲线珠坠的逐颗穿入。',
  ),
];
