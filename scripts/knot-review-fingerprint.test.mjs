import assert from 'node:assert/strict';
import test from 'node:test';
import { knotReviewFingerprint } from './knot-review-fingerprint.mjs';

/** 用同一条轨迹比较数值噪声、真实动作变化和步骤修改。 */
function course(offset = 0) {
  return {
    id: 'review-fixture',
    steps: [
      { time: 0, title: '开始' },
      { time: 0.8, title: '收紧' },
    ],
    getState: (p) => ({
      points: [
        [0, 0, 0],
        [p + offset, Math.sin(p), 0],
      ],
      radius: 0.01,
    }),
  };
}

test('浮点末位噪声不改变同一模型的验收版本', () => {
  assert.equal(knotReviewFingerprint(course()), knotReviewFingerprint(course(1e-12)));
});

test('字段插入顺序不改变含义，数组动作顺序仍被保留', () => {
  const original = course();
  const reordered = { getState: original.getState, steps: original.steps, id: original.id };
  assert.equal(knotReviewFingerprint(original), knotReviewFingerprint(reordered));
  assert.notEqual(
    knotReviewFingerprint(original),
    knotReviewFingerprint({ ...original, steps: [...original.steps].reverse() }),
  );
});

test('真实布线变化、过程单帧变化和说明变化都会失效', () => {
  const original = course();
  assert.notEqual(knotReviewFingerprint(original), knotReviewFingerprint(course(0.00001)));
  assert.notEqual(
    knotReviewFingerprint(original),
    knotReviewFingerprint({
      ...original,
      getState: (p) => ({ ...original.getState(p), radius: p === 0.5 ? 0.02 : 0.01 }),
    }),
  );
  assert.notEqual(
    knotReviewFingerprint(original),
    knotReviewFingerprint({ ...original, steps: [{ time: 0, title: '改过的步骤' }] }),
  );
});

test('非法数值不能被序列化成null后混入有效验收', () => {
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.throws(() => knotReviewFingerprint(course(value)), /非有限数值/);
  }
});
