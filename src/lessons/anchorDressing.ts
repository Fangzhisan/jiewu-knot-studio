import { ANCHOR_DRESSING_DATA } from './data/anchor-dressing';
import type { Vec3 } from './types';

let decoded: Vec3[][] | undefined;

/** 按小端还原定点坐标；增量基于整数帧，误差不会逐帧累积。 */
export function getAnchorDressing(): readonly (readonly Vec3[])[] {
  if (decoded) {
    return decoded;
  }
  const bytes = Uint8Array.from(atob(ANCHOR_DRESSING_DATA), (value) => value.charCodeAt(0));
  const view = new DataView(bytes.buffer);
  const frames = view.getUint16(0, true),
    points = view.getUint16(2, true);
  const coordinates = points * 3;
  if (frames < 2 || points < 2 || bytes.length !== 4 + coordinates * (4 + (frames - 1) * 2)) {
    throw new Error('锚结整理轨迹数据长度不符');
  }
  const values = new Int32Array(coordinates);
  const result: Vec3[][] = [];
  let offset = 4;
  for (let frame = 0; frame < frames; frame++) {
    for (let i = 0; i < coordinates; i++) {
      values[i] =
        frame === 0 ? view.getInt32(offset, true) : values[i]! + view.getInt16(offset, true);
      offset += frame === 0 ? 4 : 2;
    }
    result.push(
      Array.from({ length: points }, (_, i): Vec3 => [
        values[i * 3]! / 1000000,
        values[i * 3 + 1]! / 1000000,
        values[i * 3 + 2]! / 1000000,
      ]),
    );
  }
  decoded = result;
  return result;
}
