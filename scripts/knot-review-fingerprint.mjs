import { createHash } from 'node:crypto';

/** 统一字段顺序和六位小数，避免不同系统的浮点末位差异让同一模型失配。 */
function snapshotJSON(value) {
  return JSON.stringify(value, (_key, item) => {
    if (typeof item === 'number') {
      if (!Number.isFinite(item)) {
        throw new Error('模型指纹不能包含非有限数值');
      }
      return Number(item.toFixed(6));
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
  hash.update('jiewu-review-v2-float6\0');
  hash.update(snapshotJSON(metadata));
  for (let frame = 0; frame <= 250; frame++) {
    hash.update(snapshotJSON(getState(frame / 250)));
  }
  return hash.digest('hex');
}
