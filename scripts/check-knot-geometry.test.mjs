import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  segmentDistance,
  turningRadius,
  cordContacts,
  segmentSupportClearance,
  inspectRoundCordState,
} from './knot-geometry.mjs';

test('线段距离覆盖中段交叉、平行、退化和斜交', () => {
  assert.equal(segmentDistance([-10, 0, 0], [10, 0, 0], [0, -10, 0], [0, 10, 0]), 0);
  assert.equal(segmentDistance([0, 0, 0], [1, 0, 0], [-2, 3, 0], [2, 3, 0]), 3);
  assert.equal(segmentDistance([0, 0, 0], [0, 0, 0], [1, -1, 0], [1, 1, 0]), 1);
  assert.equal(segmentDistance([-1, 0, 0], [1, 0, 0], [0, -1, 2], [0, 1, 2]), 2);
});

test('空间分桶不能漏掉长线段中部互穿，独立线股必须一起查', () => {
  const cords = [
    {
      id: 'a',
      radius: 0.05,
      points: [
        [-2, 0, 0],
        [2, 0, 0],
      ],
    },
    {
      id: 'b',
      radius: 0.05,
      points: [
        [0, -2, 0],
        [0, 2, 0],
      ],
    },
  ];
  assert(cordContacts(cords).issues.length > 0);
  cords[1].points = [
    [0, -2, 0.11],
    [0, 2, 0.11],
  ];
  assert.equal(cordContacts(cords).issues.length, 0);
});

test('正常曲线的邻段不误报，实际折弯半径可量出', () => {
  const points = Array.from({ length: 101 }, (_, i) => [Math.cos(i * 0.02), Math.sin(i * 0.02), 0]);
  assert.equal(cordContacts([{ id: 'arc', points, radius: 0.05 }]).issues.length, 0);
  assert(Math.abs(turningRadius(...points.slice(30, 33)) - 1) < 1e-9);
});

test('有限圆柱两端都在外侧仍能发现连线穿柱', () => {
  const support = {
    kind: 'cylinder',
    position: [0, 0, 0],
    axis: [0, 2, 0],
    radius: 0.4,
    length: 2,
  };
  assert(segmentSupportClearance([-1, 0, 0], [1, 0, 0], 0.05, support) < 0);
  assert(segmentSupportClearance([-1, 1.2, 0], [1, 1.2, 0], 0.05, support) > 0);
});

test('圆环中心通道允许穿过，环管实体不允许', () => {
  const support = { kind: 'ring', position: [0, 0, 0], axis: [0, 0, 1], radius: 1, length: 0.2 };
  assert(segmentSupportClearance([0, 0, -2], [0, 0, 2], 0.05, support) > 0);
  assert(segmentSupportClearance([1, 0, -2], [1, 0, 2], 0.05, support) < 0);
});

test('有孔珠、扁绳不被不适用的检查器自动判为通过', () => {
  const state = {
    points: [
      [0, 0, 0],
      [1, 0, 0],
    ],
    radius: 0.05,
  };
  assert.throws(() => inspectRoundCordState({ ...state, flatness: 0.3 }), /等截面圆绳/);
  assert.throws(() => inspectRoundCordState({ ...state, beads: [{}] }), /珠孔/);
});

test('细缠绳和粗绳芯的混合分桶保留实体碰撞', () => {
  const core = {
    id: 'core',
    radius: 0.22,
    points: [
      [0, -2, 0],
      [0, 2, 0],
    ],
  };
  const thin = {
    id: 'thin',
    radius: 0.024,
    points: [
      [-0.8, 0, 0.2],
      [0.8, 0, 0.2],
    ],
  };
  assert(cordContacts([thin, core]).issues.length > 0);
  thin.points = [
    [-0.8, 0, 0.25],
    [0.8, 0, 0.25],
  ];
  assert.equal(cordContacts([thin, core]).issues.length, 0);
});

test('非有限坐标不能悄悄跳过数值比较', () => {
  assert.throws(
    () =>
      inspectRoundCordState({
        points: [
          [0, 0, 0],
          [NaN, 1, 0],
        ],
        radius: 0.05,
      }),
    /无效/,
  );
});
