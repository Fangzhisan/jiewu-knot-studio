import { createHash } from 'node:crypto';

/** 统一字段顺序和六位小数，避免不同系统的浮点末位差异让同一模型失配。 */
function snapshotJSON(value) {
  return JSON.stringify(value, (_key, item) => {
    if (typeof item === 'number') {
      if (!Number.isFinite(item)) {
        throw new Error('模型指纹不能包含非有限数值');
      }
      const scaled = item * 1e6;
      const midpoint = Math.floor(scaled) + 0.5;
      // 先吸附舍入中点附近的末位噪声，避免同一坐标在两个系统里分别向上和向下舍入。
      return Math.round(Math.abs(scaled - midpoint) < 1e-5 ? midpoint : scaled) / 1e6;
    }
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      return Object.fromEntries(
        Object.keys(item)
          .sort()
          .map((key) => [key, item[key]]),
      );
    }
    return item;
  });
}

/** 固定抽样覆盖动作和收紧；模型或步骤变化后，旧验收不能直接沿用。 */
export function knotReviewFingerprint(course) {
  const hash = createHash('sha256');
  const { getState, ...metadata } = course;
  hash.update('jiewu-review-v3-float6-stable-midpoint\0');
  hash.update(snapshotJSON(metadata));
  for (let frame = 0; frame <= 250; frame++) {
    hash.update(snapshotJSON(getState(frame / 250)));
  }
  return hash.digest('hex');
}
