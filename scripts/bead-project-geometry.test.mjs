import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectBeadProjectState } from './bead-project-geometry.mjs';

/** 用明确的孔内、实体与支撑物反例验证检查器，避免错误路径被误判通过。 */
function state(x = 0, bead = { id: 'bead', radius: 0.18, axis: [0, 1, 0], position: [0, 0, 0] }) {
  const points = Array.from({ length: 61 }, (_, i) => [x, -0.3 + (0.6 * i) / 60, 0]);
  return { points, tip: points.at(-1), radius: 0.005, checkpoint: 0, beads: [bead] };
}

test('孔轴内完整穿过不会被当作穿珠体', () => {
  const result = inspectBeadProjectState(state());
  assert(result.beadClearance > 0.05);
  assert(result.passages.bead.min < -0.16 && result.passages.bead.max > 0.16);
});

test('偏离珠孔的直线穿过外壳会被拒绝', () => {
  assert(inspectBeadProjectState(state(0.1)).beadClearance < -0.005);
});

test('压管的孔和外壳随径向缩放，不能沿用未压管的孔径', () => {
  const bead = {
    id: 'crimp',
    radius: 0.08,
    axis: [0, 1, 0],
    position: [0, 0, 0],
    axialScale: 0.55,
    radialScale: 0.3,
  };
  assert(inspectBeadProjectState(state(0.009, bead)).beadClearance > 0.002);
  assert(inspectBeadProjectState(state(0.02, bead)).beadClearance < 0);
  assert(inspectBeadProjectState(state(0.02, { ...bead, radialScale: 1 })).beadClearance > 0.02);
});

test('不同线股的交叉不能因为珠子存在而漏掉', () => {
  const s = state();
  s.beads = [];
  s.strands = [
    {
      id: 'other',
      radius: 0.005,
      points: [
        [-0.2, 0, 0],
        [0.2, 0, 0],
      ],
    },
  ];
  assert(inspectBeadProjectState(s).contacts.issues.length > 0);
});

test('支撑物宽相筛选保留穿过实体的长线段', () => {
  const s = state();
  s.beads = [];
  s.points = [
    [-1, 0, 0],
    [1, 0, 0],
  ];
  s.supports = [
    {
      id: 'rod',
      kind: 'cylinder',
      position: [0, 0, 0],
      axis: [0, 0, 1],
      length: 0.2,
      radius: 0.05,
    },
  ];
  assert(inspectBeadProjectState(s).supports.some((v) => v.clearance < 0));
});
