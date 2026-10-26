import { createHash } from 'node:crypto';

/** 固定抽样覆盖动作和收紧；模型或步骤变化后，旧验收不能直接沿用。 */
export function knotReviewFingerprint(course) {
  const hash = createHash('sha256');
  const { getState, ...metadata } = course;
  hash.update(JSON.stringify(metadata));
  for (let frame = 0; frame <= 250; frame++) {
    hash.update(JSON.stringify(getState(frame / 250)));
  }
  return hash.digest('hex');
}
