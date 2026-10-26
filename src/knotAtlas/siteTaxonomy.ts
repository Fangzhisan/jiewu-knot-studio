/** 来源活动与本站用途只做语义对照；关联项不自动加入课程的适用场景。 */
export const SOURCE_ACTIVITY_COMPARISON = [
  {
    sourceId: 'essentials',
    localIds: [],
    relation: 'selection',
    note: '必备是精选集合，不是生活场景。',
  },
  {
    sourceId: 'pioneering',
    localIds: ['camping'],
    relation: 'related',
    note: '营地搭建部分重叠，先锋搭建保留独立标签。',
  },
  { sourceId: 'military', localIds: [], relation: 'missing', note: '现有目录没有军事场景。' },
  {
    sourceId: 'theater-film',
    localIds: [],
    relation: 'missing',
    note: '现有目录没有舞台与影视场景。',
  },
  { sourceId: 'caving', localIds: [], relation: 'missing', note: '探洞与一般户外活动分开记录。' },
  {
    sourceId: 'climbing',
    localIds: ['climbing', 'mountaineering'],
    relation: 'related',
    note: '来源将部分登山绳技也归入攀岩，按每课实际用途再映射。',
  },
  {
    sourceId: 'mathematics',
    localIds: [],
    relation: 'missing',
    note: '数学结构独立于实物绑扎用途。',
  },
  {
    sourceId: 'arborist',
    localIds: ['garden'],
    relation: 'related',
    note: '树上绳索作业不等同于日常园艺支撑。',
  },
  {
    sourceId: 'fire-rescue',
    localIds: ['rescue'],
    relation: 'related',
    note: '现有课只做救援结构认知，不能视为专业操作覆盖。',
  },
  { sourceId: 'diving', localIds: [], relation: 'missing', note: '现有目录没有潜水场景。' },
  {
    sourceId: 'scouting',
    localIds: ['camping', 'outdoors'],
    relation: 'related',
    note: '童军是活动集合，不能直接等同于露营。',
  },
  {
    sourceId: 'rope-care',
    localIds: ['storage', 'repair'],
    relation: 'related',
    note: '分别检查盘绳、防散封头与绳股修整。',
  },
  { sourceId: 'boating', localIds: [], relation: 'missing', note: '现有目录没有单列船艇场景。' },
  {
    sourceId: 'decorative',
    localIds: ['decor', 'jewelry', 'accessories'],
    relation: 'related',
    note: '装饰用途按实际成品再分配。',
  },
  {
    sourceId: 'fishing',
    localIds: ['fishing'],
    relation: 'equivalent',
    note: '按钩、线、环、饵和线轮继续细分。',
  },
  {
    sourceId: 'camping',
    localIds: ['camping'],
    relation: 'equivalent',
    note: '按天幕、营绳、木杆、吊床与物资继续细分。',
  },
  {
    sourceId: 'neckties',
    localIds: ['clothing'],
    relation: 'related',
    note: '领带只是服装配饰的一部分。',
  },
] as const;

/** 十二个结型全部保留为绳结节点的二级结构类型，不拿顶层三类工艺替代。 */
export const SOURCE_TYPE_COMPARISON = [
  {
    sourceId: 'mats',
    localCategory: 'knots',
    task: '装饰垫的交织路线',
    relatedCategory: 'weaving',
  },
  { sourceId: 'multi-loop', localCategory: 'knots', task: '多圈与复杂环路结构' },
  { sourceId: 'hitches', localCategory: 'knots', task: '将绳系到物体或另一条绳上' },
  { sourceId: 'binding', localCategory: 'knots', task: '环抱物品并捆束' },
  { sourceId: 'special', localCategory: 'knots', task: '特殊用途、组合方法或辨别练习' },
  { sourceId: 'loops', localCategory: 'knots', task: '构造固定或可调绳圈' },
  { sourceId: 'coiling', localCategory: 'knots', task: '盘放与整理绳索' },
  { sourceId: 'splices', localCategory: 'knots', task: '绳股拆分与穿编绞接' },
  { sourceId: 'stoppers', localCategory: 'knots', task: '在绳端构造止索结构' },
  { sourceId: 'whipping', localCategory: 'knots', task: '给绳端做防散封头' },
  { sourceId: 'lashings', localCategory: 'knots', task: '把杆件绑成结构，和装饰编织分开' },
  { sourceId: 'bends', localCategory: 'knots', task: '连接两根或多根绳线' },
] as const;
