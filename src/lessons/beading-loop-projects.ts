import type { Course, LessonBead, Vec3 } from './types';
import { wireProject } from './beading-wire-projects';
import { mix } from './beadProjectGeometry';

/** 共用珠连接相邻珠圈；回到旧珠闭环，再沿刚完成的侧边换位。 */
function loopPlan(units: number, six: boolean, necklace: boolean, g: number) {
  const pitch = six ? 0.6 : necklace ? 0.45 : 0.4;
  const height = six ? 0.17 : necklace ? 0.225 : 0.2;
  const factor = mix(1.6, 1, g);
  const beads: LessonBead[] = [];
  const visits: { bead: LessonBead; direction: number }[] = [];
  const scales = Array.from({ length: units }, (_, i) =>
    necklace ? 1 + 0.5 * Math.sin((Math.PI * (i + 0.5)) / units) ** 2 : 1,
  );
  const ends = [0];
  for (const scale of scales) {
    ends.push(ends.at(-1)! + pitch * scale);
  }
  const place = (
    id: string,
    x: number,
    y: number,
    vertical: boolean,
    radius: number,
  ): LessonBead => {
    const cell = Math.min(units - 1, Math.floor(x / pitch));
    const fraction = (x - cell * pitch) / pitch;
    const scale = necklace ? 1 + 0.5 * Math.sin((Math.PI * x) / (units * pitch)) ** 2 : 1;
    const position: Vec3 = [
      (mix(ends[cell]!, ends[cell + 1]!, fraction) - ends.at(-1)! / 2) * factor,
      y * scale * factor,
      0,
    ];
    const axis: Vec3 = vertical ? [0, 1, 0] : [1, 0, 0];
    const bead: LessonBead = {
      id,
      position,
      axis,
      radius: radius * scale,
      color: vertical ? '#b8a8c0' : six ? '#d6c8aa' : '#bed1d5',
      active: false,
      label: '',
    };
    beads.push(bead);
    return bead;
  };
  const shared = Array.from({ length: units + 1 }, (_, i) =>
    place(`join-${i}`, i * pitch, 0, true, 0.13),
  );
  const top = Array.from({ length: units }, (_, i) =>
    six
      ? [
          place(`top-${i}-0`, i * pitch + 0.195, height, false, 0.1),
          place(`top-${i}-1`, i * pitch + 0.405, height, false, 0.1),
        ]
      : [place(`top-${i}`, (i + 0.5) * pitch, height, false, 0.13)],
  );
  const bottom = Array.from({ length: units }, (_, i) =>
    six
      ? [
          place(`bottom-${i}-0`, i * pitch + 0.195, -height, false, 0.1),
          place(`bottom-${i}-1`, i * pitch + 0.405, -height, false, 0.1),
        ]
      : [place(`bottom-${i}`, (i + 0.5) * pitch, -height, false, 0.13)],
  );
  const visit = (bead: LessonBead, direction: number) => visits.push({ bead, direction });
  visit(shared[0]!, 1);
  for (let i = 0; i < units; i++) {
    const upper = i % 2 === 0;
    const outgoing = upper ? top[i]! : bottom[i]!;
    const returning = upper ? bottom[i]! : top[i]!;
    for (const bead of outgoing) {
      visit(bead, 1);
    }
    visit(shared[i + 1]!, upper ? -1 : 1);
    for (const bead of [...returning].reverse()) {
      visit(bead, -1);
    }
    visit(shared[i]!, upper ? 1 : -1);
    for (const bead of outgoing) {
      visit(bead, 1);
    }
    visit(shared[i + 1]!, upper ? -1 : 1);
  }
  return { beads, visits };
}

/** 圈链完成全长后仍接上真实扣件，回穿不是仅显示一个基础单元。 */
function loopProject(
  id: string,
  name: string,
  units: number,
  six: boolean,
  necklace: boolean,
): Course {
  const base = wireProject({
    id,
    name,
    kind: necklace ? 'necklace' : 'bracelet',
    radii: new Array(units * (six ? 5 : 3) + 1).fill(0.13),
    bodyFactory: (g) => loopPlan(units, six, necklace, g),
    instruction: `${necklace ? '主珠和珠圈从两端向中央逐渐变大，整链平铺制作。' : ''}每圈${six ? '六' : '四'}颗珠，回到共用珠形成闭环，再沿侧珠换位，连续完成${units}组珠圈和两端扣件。`,
  });
  return {
    ...base,
    materialNote:
      '使用适合多次回穿的柔性细串珠钢丝与大孔珠，孔内各趟线分道；端部压管规格须与两股钢丝匹配。画面逐段显示已穿入的线段。',
    source: 'https://artbeads.com/content/tutorial-pdfs/2014-right-angle-weave-diagram.pdf',
    sourceName: six
      ? 'Artbeads · 珠圈闭合及换位续编，扩展为六珠环链'
      : 'Artbeads · Right Angle Weave · 珠圈与换位',
    steps: base.steps.map((step, i) =>
      i === 2
        ? {
            ...step,
            title: '绕回共用珠闭合珠圈',
            instruction: '沿侧珠穿过新珠，再回到旧共用珠，确保每个珠圈都真正闭合。',
          }
        : i === 3
          ? {
              ...step,
              title: '换位续编整条圈链',
              instruction: '沿已编好的侧珠换到下一共用珠，交替向上和向下成圈，逐组完成全长。',
            }
          : step,
    ),
  };
}

export const BEAD_LOOP_PROJECT_COURSES: Course[] = [
  loopProject('bead-complete-four-loop-bracelet', '四珠圈链手链', 7, false, false),
  loopProject('bead-complete-six-loop-bracelet', '六珠环链手链', 6, true, false),
  loopProject('bead-complete-loop-necklace', '渐变珠圈花边项链', 12, false, true),
];
