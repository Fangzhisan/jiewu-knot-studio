import * as THREE from 'three';
import type { LessonSupport } from './lessons/types';

const SLOT_COUNT = 32;
const TAU = Math.PI * 2;
const SLOT_DEPTH = 0.14;
const SLOT_HALF_WIDTH = 0.028;
const ATLAS_SIZE = 2048;
const FRONT = new THREE.Vector3(0, 0, 1);
// 把顺时针槽号换成盘面角度。
const angleOf = (slot: number) => Math.PI / 2 - (TAU * (slot - 0.5)) / SLOT_COUNT;

// 生成带中心孔和 32 个等宽槽口的盘体。
function diskGeometry(innerRatio: number): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const mouth = Math.sqrt(1 - SLOT_HALF_WIDTH ** 2);
  const halfAngle = Math.asin(SLOT_HALF_WIDTH);
  const first = angleOf(1);
  // 把径向、切向距离转成盘面坐标。
  const local = (angle: number, radial: number, tangent: number): [number, number] => [
    Math.cos(angle) * radial - Math.sin(angle) * tangent,
    Math.sin(angle) * radial + Math.cos(angle) * tangent,
  ];

  shape.moveTo(...local(first, mouth, -SLOT_HALF_WIDTH));

  // 轮廓逆时针绘制，实际槽号仍按顺时针编号。
  for (let i = 0; i < SLOT_COUNT; i++) {
    const angle = first + (TAU * i) / SLOT_COUNT;
    shape.lineTo(...local(angle, 1 - SLOT_DEPTH, -SLOT_HALF_WIDTH));
    shape.lineTo(...local(angle, 1 - SLOT_DEPTH, SLOT_HALF_WIDTH));
    shape.lineTo(...local(angle, mouth, SLOT_HALF_WIDTH));
    const end = angle + TAU / SLOT_COUNT - halfAngle;

    for (let j = 1; j <= 8; j++) {
      const a = angle + halfAngle + ((end - angle - halfAngle) * j) / 8;
      shape.lineTo(Math.cos(a), Math.sin(a));
    }
  }

  shape.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRatio, 0, TAU, true);
  shape.holes.push(hole);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 1,
    steps: 1,
    bevelEnabled: false,
    curveSegments: 64,
  });

  geometry.translate(0, 0, -0.5);
  const positions = geometry.getAttribute('position');
  const normals = geometry.getAttribute('normal');
  const uv = geometry.getAttribute('uv');

  // 默认 UV 未归一化，先映射到整张正面贴图。
  // 背面、槽壁和孔壁使用无印刷材质。
  for (let i = 0; i < positions.count; i++) {
    uv.setXY(i, (positions.getX(i) + 1) / 2, (positions.getY(i) + 1) / 2);
  }

  geometry.clearGroups();
  let start = 0,
    material = normals.getZ(0) > 0.5 ? 0 : 1;

  for (let i = 3; i < positions.count; i += 3) {
    const next = normals.getZ(i) > 0.5 ? 0 : 1;

    if (next !== material) {
      geometry.addGroup(start, i - start, material);
      start = i;
      material = next;
    }
  }

  geometry.addGroup(start, positions.count - start, material);
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  return geometry;
}

// 正面朝局部 +Z，盘面旋转按局部逆时针计算。
export class BraidingDisk {
  readonly group = new THREE.Group();
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly texture: THREE.CanvasTexture;
  private readonly face: THREE.MeshStandardMaterial;
  private readonly edge: THREE.MeshStandardMaterial;
  private readonly mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial[]>;
  private readonly axis = new THREE.Vector3();
  private readonly spin = new THREE.Quaternion();
  private innerRatio = 0.28;
  // 孔径和槽位没变就复用印刷贴图。
  private atlasKey = '';
  private disposed = false;

  // 创建盘体和印刷贴图，使用时再显示。
  constructor() {
    this.group.name = 'BraidingDisk';
    this.group.visible = false;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = ATLAS_SIZE;
    const context = this.canvas.getContext('2d');

    if (!context) {
      throw new Error('BraidingDisk requires a 2D canvas context');
    }

    this.context = context;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 4;
    this.face = new THREE.MeshStandardMaterial({
      map: this.texture,
      color: '#f7f7f2',
      roughness: 0.88,
    });
    this.edge = new THREE.MeshStandardMaterial({ color: '#e6e7e1', roughness: 0.94 });
    this.mesh = new THREE.Mesh(diskGeometry(this.innerRatio), [this.face, this.edge]);
    this.mesh.name = '32-slot disk with open centre';
    this.mesh.castShadow = this.mesh.receiveShadow = true;
    this.group.add(this.mesh);
  }

  // 重画槽号与活动槽位。
  private paint(slots: number[]) {
    const ctx = this.context,
      centre = ATLAS_SIZE / 2,
      scale = centre;

    // 盘面纵轴转为画布坐标时需要翻转。
    const point = (r: number, a: number): [number, number] => [
      centre + r * Math.cos(a) * scale,
      centre - r * Math.sin(a) * scale,
    ];

    ctx.clearRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);
    const textRadius = Math.max(0.775, (this.innerRatio + 1 - SLOT_DEPTH) / 2);
    const textSize = Math.min(0.055, (1 - SLOT_DEPTH - this.innerRatio) * 0.48) * scale;
    const highlightInner = Math.max(this.innerRatio + 0.012, textRadius - 0.065);

    for (const slot of slots) {
      const angle = angleOf(slot),
        half = (TAU / SLOT_COUNT) * 0.4;

      ctx.beginPath();
      ctx.moveTo(...point(highlightInner, angle - half));
      ctx.lineTo(...point(0.995, angle - half));
      ctx.arc(centre, centre, 0.995 * scale, -angle + half, -angle - half, true);
      ctx.lineTo(...point(highlightInner, angle + half));
      ctx.arc(centre, centre, highlightInner * scale, -angle - half, -angle + half);
      ctx.closePath();
      ctx.fillStyle = '#d6e7da';
      ctx.fill();
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#272c2a';
    ctx.font = `600 ${textSize}px system-ui, sans-serif`;

    for (let slot = 1; slot <= SLOT_COUNT; slot++) {
      ctx.fillText(String(slot), ...point(textRadius, angleOf(slot)));
    }

    // 四分点标记帮助辨认盘面旋转位置。
    if (this.innerRatio < 0.58) {
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(...point(0.63, Math.PI / 2 - (i * Math.PI) / 2), 0.009 * scale, 0, TAU);
        ctx.fill();
      }
    }

    ctx.beginPath();
    ctx.arc(centre, centre, (this.innerRatio + 0.009) * scale, 0, TAU);
    ctx.strokeStyle = '#c8cbc4';
    ctx.lineWidth = 2;
    ctx.stroke();
    this.texture.needsUpdate = true;
  }

  // 按支架数据更新盘径、朝向和活动槽位。
  update(support: LessonSupport) {
    if (this.disposed) {
      return;
    }

    this.group.visible = support.kind === 'braiding-disk';

    if (!this.group.visible) {
      return;
    }

    const radius = Number.isFinite(support.radius) && support.radius > 0 ? support.radius : 1;
    const thickness = Number.isFinite(support.length) && support.length > 0 ? support.length : 0.08;
    const requestedInner = support.innerRadius ?? radius * 0.28;
    // 限制内孔大小，槽底下方必须留住连续盘体。
    const ratio = Math.max(
      0.03,
      Math.min(0.8, Number.isFinite(requestedInner) ? requestedInner / radius : 0.28),
    );

    // 孔径变化才重建盘体，并释放旧几何。
    if (Math.abs(ratio - this.innerRatio) > 1e-9) {
      const previous = this.mesh.geometry;
      this.mesh.geometry = diskGeometry(ratio);
      previous.dispose();
      this.innerRatio = ratio;
    }

    this.group.position.set(
      ...(support.position.map((value) => (Number.isFinite(value) ? value : 0)) as [
        number,
        number,
        number,
      ]),
    );
    this.group.scale.set(radius, radius, thickness);

    this.axis.fromArray(support.axis);

    if (
      ![this.axis.x, this.axis.y, this.axis.z].every(Number.isFinite) ||
      this.axis.lengthSq() < 1e-12
    ) {
      this.axis.copy(FRONT);
    }

    this.axis.normalize();
    this.group.quaternion.setFromUnitVectors(FRONT, this.axis);
    this.spin.setFromAxisAngle(FRONT, Number.isFinite(support.rotation) ? support.rotation! : 0);
    this.group.quaternion.multiply(this.spin);
    this.face.color.set(support.color ?? '#f7f7f2');
    this.edge.color.copy(this.face.color).multiplyScalar(0.92);
    const slots = [
      ...new Set(
        support.activeSlots?.filter(
          (slot) => Number.isInteger(slot) && slot >= 1 && slot <= SLOT_COUNT,
        ) ?? [],
      ),
    ].sort((a, b) => a - b);

    const key = `${this.innerRatio}:${slots.join(',')}`;

    if (key !== this.atlasKey) {
      this.paint(slots);
      this.atlasKey = key;
    }
  }

  // 释放盘体及贴图，允许重复调用。
  dispose() {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.group.visible = false;
    this.mesh.geometry.dispose();
    this.face.dispose();
    this.edge.dispose();
    this.texture.dispose();
    this.group.clear();
    this.canvas.width = this.canvas.height = 1;
  }
}
