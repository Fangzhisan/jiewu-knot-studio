export type Vec3 = [number, number, number];
export type CategoryId = 'knots' | 'weaving' | 'beads';
/** 时间轴上的一步操作。 */
export interface LessonStep {
  /** 整节课程的 0～1 进度。 */
  time: number;
  title: string;
  instruction: string;
}
/** 珠子的摆放和提示状态。 */
export interface LessonBead {
  id: string;
  position: Vec3;
  axis: Vec3;
  radius: number;
  color: string;
  active: boolean;
  label?: string;
  labelOpacity?: number;
  /** 沿穿线孔轴线拉长；1 保持圆珠。 */
  axialScale?: number;
  /** 压管收口时径向压紧；普通珠子保持1，孔与外壳同步缩放。 */
  radialScale?: number;
}
/** 主绳之外的独立线股。 */
export interface LessonStrand {
  id: string;
  points: Vec3[];
  color: string;
  radius: number;
  flatness?: number;
  thicknessScales?: number[];
  label?: string;
  /** 端点标签；false 表示这里不是自由绳头。 */
  endCaps?: {
    start?: string | false;
    end?: string | false;
  };
}
/** 横杆、编织盘、环眼或可开合锁扣。 */
export interface LessonSupport {
  id: string;
  kind: 'cylinder' | 'braiding-disk' | 'ring' | 'carabiner';
  position: Vec3;
  /** 圆柱取轴向，其余取平面法线。 */
  axis: Vec3;
  /** 圆环取环管中心线半径。 */
  radius: number;
  /** 圆环取环管直径，其余取长度或厚度。 */
  length: number;
  /** 锁扣中心线宽度，length 为中心线总高，radius 为金属管半径。 */
  width?: number;
  /** 锁扣门向内开启的比例：0 闭合，1 打开 60°。 */
  gateOpen?: number;
  color?: string;
  /** 盘的中心孔半径；局部 XY 为盘面，+Z 为法线，共 32 个槽。 */
  innerRadius?: number;
  rotation?: number;
  activeSlots?: number[];
}
/** 当前进度下可直接绘制的一帧。 */
export interface LessonState {
  points: Vec3[];
  tip: Vec3;
  checkpoint: number;
  beads?: LessonBead[];
  strands?: LessonStrand[];
  supports?: LessonSupport[];
  color?: string;
  radius?: number;
  flatness?: number;
  thicknessScales?: number[];
  guideOpacity?: number;
  showEndLabels?: boolean;
  hideMainTip?: boolean;
  /** 主绳端点标签；false 隐藏端帽。 */
  endCaps?: {
    start?: string | false;
    end?: string | false;
  };
}
/** 课程介绍、步骤与取帧入口。 */
export interface Course {
  id: string;
  category: CategoryId;
  name: string;
  title: string;
  description: string;
  material: string;
  materialNote: string;
  duration: number;
  initialProgress: number;
  /** 首次取景容纳整个制作过程，避免长余绳移到画布外。 */
  frameWholeProcess?: boolean;
  /** 教学操作区的初始取景；侧方备用线仍可通过适配完整模型查看。 */
  framingBounds?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  };
  /** 实际收紧步骤的起点；末尾另有观察步骤时指定，默认取最后一步。 */
  tighteningStart?: number;
  steps: readonly LessonStep[];
  source: string;
  sourceName: string;
  application?: {
    scenarios: string[];
    task: string;
    focus: string;
    boundary?: string;
  };
  projectionFocus?: 'curves' | 'full';
  /** 成品的 XY 取景边界，不计长工作尾。 */
  projectionBounds?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  /** 先加载一次额外数据，再调用同步 getState。 */
  prepare?: () => Promise<void>;
  /** 按 0～1 进度取出一帧。 */
  getState: (progress: number) => LessonState;
}
