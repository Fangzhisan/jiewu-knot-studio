import * as THREE from 'three';
import type { LessonSupport } from './lessons/types';
import { carabinerBody, carabinerGate } from './supportGeometry';

/** 实际开合的锁扣，绳圈必须经门口进入，不能穿过闭合金属。 */
export class Carabiner {
  readonly group = new THREE.Group();
  private readonly metal = new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.68 });
  private body: THREE.Mesh | null = null;
  private gate: THREE.Mesh | null = null;
  private caps: THREE.Mesh[] = [];
  private size = '';

  /** 只有尺寸变化才重建金属几何，播放时仅转动门。 */
  update(support: LessonSupport) {
    const size = `${support.width}:${support.length}:${support.radius}`;
    if (this.size !== size) {
      this.clearGeometry();
      const points = carabinerBody(support);
      const path = new THREE.CurvePath<THREE.Vector3>();
      for (let i = 1; i < points.length; i++) {
        path.add(
          new THREE.LineCurve3(
            new THREE.Vector3(...points[i - 1]!),
            new THREE.Vector3(...points[i]!),
          ),
        );
      }
      this.body = new THREE.Mesh(
        new THREE.TubeGeometry(path, 256, support.radius, 16, false),
        this.metal,
      );
      this.gate = new THREE.Mesh(
        new THREE.CylinderGeometry(support.radius, support.radius, support.length / 2, 16),
        this.metal,
      );
      this.caps = [points[0]!, points.at(-1)!].map((point) => {
        const cap = new THREE.Mesh(new THREE.SphereGeometry(support.radius, 16, 12), this.metal);
        cap.position.fromArray(point);
        return cap;
      });
      this.group.add(this.body, this.gate, ...this.caps);
      for (const mesh of [this.body, this.gate, ...this.caps]) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
      this.size = size;
    }
    const [hinge, nose] = carabinerGate(support).map((point) => new THREE.Vector3(...point));
    this.gate!.position.copy(hinge!).add(nose!).multiplyScalar(0.5);
    this.gate!.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      nose!.clone().sub(hinge!).normalize(),
    );
    const axis = new THREE.Vector3(...support.axis);
    if (axis.lengthSq() < 1e-10) {
      axis.set(0, 0, 1);
    }
    this.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), axis.normalize());
    this.group.position.fromArray(support.position);
    this.group.visible = true;
    this.metal.color.set(support.color ?? '#a0a38f');
  }

  /** 几何独立释放，材质由整只锁扣共用。 */
  private clearGeometry() {
    for (const child of this.group.children) {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
      }
    }
    this.group.clear();
  }

  /** 从场景移除后清理共享材质。 */
  dispose() {
    this.clearGeometry();
    this.metal.dispose();
  }
}
