/** 节点标识取来源中文网址的解码末段，变体各自保留。 */
export type KnotNodeId = string;

/** 保留来源分类与别名，不用本站的用途分类覆盖它们。 */
export interface KnotSource {
  name: string;
  url: string;
  englishName: string;
  englishAliases?: readonly string[];
  englishUrl?: string;
  englishSlug?: string;
  aliases: readonly string[];
  abok: readonly string[];
  activityIds: readonly string[];
  typeId: string;
  imageUrl: string;
  relatedIds: readonly KnotNodeId[];
}

/** 区分页面明示的物品与根据结构推定的物品。 */
export interface KnotObjectEvidence {
  basis: 'source-explicit' | 'inferred';
  sourceUrl: string;
  field: 'name' | 'aliases' | 'description' | 'common-uses';
  /** 常见用途原文的零起始序号，用于追溯逐条核对结果。 */
  useIndex?: number;
  note: string;
}

/** 物品与活动、结型分别记录，避免把名称相近当成同一场景。 */
export interface KnotObjectRelation {
  id: string;
  name: string;
  role?: 'material' | 'anchor' | 'target' | 'finished-item' | 'tool';
  evidence: readonly KnotObjectEvidence[];
}

/** 相同成品可能有不同打法，只有方法相同才计入现有课程覆盖。 */
export interface KnotCourseMapping {
  courseId: string;
  match: 'same-method' | 'different-method';
  note: string;
}

/** 已有三维课的身份映射与本次动画验收是两回事。 */
export interface KnotProduction {
  status: 'not-started' | 'in-progress' | 'existing-3d' | 'implemented-3d';
  /** 本次逐帧、穿绕关系和步骤一致性的核对状态。 */
  review: 'not-reviewed' | 'in-review' | 'changes-required' | 'passed';
  note?: string;
  checks?: Readonly<Partial<Record<KnotReviewCheck, KnotReviewResult>>>;
}

/** 分开记录过程与成品，防止一张末帧截图替代整课检查。 */
export type KnotReviewCheck =
  'actions' | 'routing' | 'turns' | 'finishing' | 'tightening' | 'finished-shape' | 'browser';

export interface KnotReviewResult {
  status: 'not-reviewed' | 'changes-required' | 'passed';
  note: string;
}

/** 来源节点是内容清单；只有真正实现的课程才进入三维课程目录。 */
export interface KnotAtlasNode {
  id: KnotNodeId;
  source: KnotSource;
  objects: readonly KnotObjectRelation[];
  localCourse?: KnotCourseMapping;
  production: KnotProduction;
}
