import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

// 从节点与实际课程注册表导出对照清单，避免手工维护第二套数量。
const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({
  root,
  configFile: false,
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});

try {
  const { KNOT_ATLAS } = await server.ssrLoadModule('/src/knotAtlas/index.ts');
  const { SOURCE_TAXONOMY } = await server.ssrLoadModule('/src/knotAtlas/taxonomy.ts');
  const { COURSES } = await server.ssrLoadModule('/src/lessons/catalog.ts');
  const { SOURCE_ACTIVITY_COMPARISON, SOURCE_TYPE_COMPARISON } = await server.ssrLoadModule(
    '/src/knotAtlas/siteTaxonomy.ts',
  );
  const { SCENARIOS } = await server.ssrLoadModule('/src/courseScenarios.ts');
  const names = new Map(SOURCE_TAXONOMY.map((group) => [group.id, group.name]));
  const objectNames = new Map(
    KNOT_ATLAS.flatMap((node) => node.objects.map((o) => [o.id, o.name])),
  );
  const mapped = KNOT_ATLAS.filter((node) => node.localCourse?.match === 'same-method');
  const existing = mapped.filter((node) => node.production.status === 'existing-3d');
  const added = mapped.filter((node) => node.production.status === 'implemented-3d');
  const accepted = KNOT_ATLAS.filter((node) => node.production.review === 'passed');
  const different = KNOT_ATLAS.filter((node) => node.localCourse?.match === 'different-method');
  const objectRelations = KNOT_ATLAS.flatMap((node) => node.objects);
  const confirmedObjects = objectRelations.filter((item) =>
    item.evidence.every((evidence) => evidence.basis === 'source-explicit'),
  ).length;
  const courseReferences = Object.fromEntries(
    mapped.map((node) => [
      node.localCourse.courseId,
      {
        nodeId: node.id,
        name: node.source.name,
        url: node.source.url,
        names: [
          node.source.name,
          ...node.source.aliases,
          node.source.englishName,
          ...(node.source.englishAliases ?? []),
        ],
      },
    ]),
  );
  await writeFile(
    `${root}/src/knotAtlas/courseReferences.ts`,
    '// 由 export-knot-benchmark.mjs 生成；只带已实现课程的名称索引，完整来源数据不进入首屏。\n' +
      'export const COURSE_KNOT_REFERENCES: Readonly<Partial<Record<string, { nodeId: string; name: string; url: string; names: readonly string[] }>>> = ' +
      JSON.stringify(courseReferences, null, 2) +
      ';\n',
  );
  const escape = (text) => String(text).replaceAll('|', '\\|').replaceAll('\n', ' ');
  const lines = [
    '# Knots 3D 绳结对照清单',
    '',
    '核对日期：2026-10-24。来源：[完整结列表](https://knots3d.com/zh-CN/完整结列表)。',
    '',
    `共核实 **${KNOT_ATLAS.length} 个独立条目、17 个活动分类、12 个结构类型**，详情页全部读取。不同打法保留独立节点；同一绳结可出现在多个活动中，所以活动数量不能直接相加。`,
    '',
    `保留原有同法映射 ${existing.length} 项，已新增或重建三维课 ${added.length} 项。全量目标中，${accepted.length} / ${KNOT_ATLAS.length} 项通过整课验收，${KNOT_ATLAS.length - accepted.length} 项仍需制作或复核；其中缺少对应绑法 ${KNOT_ATLAS.length - mapped.length} 项。另有 ${different.length} 项可参考已有课，但打法不同，不计覆盖。本站当前可播放 ${COURSES.length} 节课程（包含编织与珠串），**246 个节点不是 246 节已完成的三维课**。`,
    '',
    '已有三维课的身份映射不等于本次已逐帧验收；重建原课保留原地址，不重复增加课程数量。制作状态记录在 `src/knotAtlas/index.ts`，逐项验收记录在 `productionReviews.ts`。待制作节点未加入课程选择器；接入课程与验收完成分开统计。',
    '',
    '## 一、来源有哪些场景与类型',
    '',
    '| 维度 | 来源分类 | 条目数 |',
    '| --- | --- | ---: |',
    ...SOURCE_TAXONOMY.map(
      (group) =>
        `| ${group.kind === 'activity' ? '活动' : '类型'} | [${group.name}](${group.url}) | ${group.nodeIds.length} |`,
    ),
    '',
    '12 个类型恰好覆盖全部节点。25 个节点没有来源活动标签，保持未标注，不按名称补猜。',
    '',
    '## 二、物品和现有课程怎么对照',
    '',
    '| 来源活动 | 本站相关用途 | 对照说明 |',
    '| --- | --- | --- |',
    ...SOURCE_ACTIVITY_COMPARISON.map(
      (item) =>
        `| ${names.get(item.sourceId)} | ${item.localIds.map((id) => SCENARIOS.find((scene) => scene.id === id)?.name ?? id).join('、') || '无直接对应'} | ${item.note} |`,
    ),
    '',
    '来源的12个结构类型作为绳结节点的二级分类保留，不能拿本站“绳结/编织/珠串”三个顶层工艺分类替代：',
    '',
    '| 结构类型 | 本站学习任务 |',
    '| --- | --- |',
    ...SOURCE_TYPE_COMPARISON.map((item) => `| ${names.get(item.sourceId)} | ${item.task} |`),
    '',
    `物品关联已逐条对照详情页“常见用途”的语义：${confirmedObjects} 条确认关系标为 source-explicit，${objectRelations.length - confirmedObjects} 条待定关系保留 inferred。已剔除鱼钩误归通用挂钩、绳索自身形成的环误归外接环等混淆。节点证据保留用途序号与核对说明；来源提到该物品不表示本站模型已经包含它。未提到具体物品的节点留空。`,
    '',
    '| 物品组 | 关联节点数 |',
    '| --- | ---: |',
    ...[...objectNames].map(
      ([id, name]) =>
        `| ${name} | ${KNOT_ATLAS.filter((node) => node.objects.some((o) => o.id === id)).length} |`,
    ),
    '',
    '以下名称或打法容易混淆，已经单独记录：',
    '',
    '- 本站“双重单结”是双反手止索结；来源“双重单结”是单结绳圈。',
    '- 本站“雀头结”演示 Cow Hitch 绳端绕杆法，对应来源“牛索结”；来源“雀头结”是整段绳穿过绳弯的打法。',
    '- 本站“活结”用短工作端绳弯；来源“滑结”主名称是 Simple Overhand Noose，主绳参与方式不同。',
    '- 本站“三股辫”是三根独立绳；来源“辫子结”是一根绳，不能互相顶替。',
    '- “扁八字连接结”应作不安全结构的辨别课；“悲伤结”是戏法结。不能因为出现在目录里就写成可靠固定方法。',
    '',
    '## 三、全部节点与课程映射',
    '',
    '来源链接、英文别名、ABOK、参考图链接、相关节点和物品证据保存在 `src/knotAtlas/sourceNodes.ts`。参考图链接只用于结构核对，项目没有复制该站的图片、动画或脚本载荷。',
    '',
    '| # | 来源绳结 / 英文主名 | 类型 | 活动场景 | 物品 | 本站课程 |',
    '| ---: | --- | --- | --- | --- | --- |',
  ];
  KNOT_ATLAS.forEach((node, i) => {
    const map = node.localCourse;
    const course = map && COURSES.find((c) => c.id === map.courseId);
    const status =
      map?.match === 'same-method'
        ? `${node.production.status === 'existing-3d' ? '已有' : '新增或重建'}：${course.name}（\`${course.id}\`）；${node.production.review === 'passed' ? '验收通过' : node.production.review === 'changes-required' ? '需修正复检' : '待验收'}`
        : map
          ? `方法不同：${course.name}，待独立制作`
          : '待制作';
    lines.push(
      `| ${i + 1} | [${escape(node.source.name)}](${node.source.url}) / ${escape(node.source.englishName)} | ${names.get(node.source.typeId)} | ${node.source.activityIds.map((id) => names.get(id)).join('、') || '来源未标注'} | ${node.objects.map((o) => o.name).join('、') || '未提取到明确物品'} | ${status} |`,
    );
  });
  lines.push(
    '',
    '## 四、三维课程制作与验收',
    '',
    '每条课程独立核对成品结构、工作端路线、交叉上下关系、依附物和收尾步骤。最终进度必须是整理收紧的成品，结芯与依附物的接触、圈列间距和绳尾出口应合理；过程可以展开帮助观察，但不能把松垮的展开形态当作最终效果。收紧过渡也需检查，不能只靠整体缩放制造贴合而让绳段穿透。',
    '',
    '新增课逐项检查：动作能否按顺序成立、每一段布线与穿压是否正确、转折是否连续顺畅、收尾是否完整、收紧途中是否保持交叉次序、最终贴合效果是否符合成品结构。发现问题须修改后重检；仅数值检查通过不能标记完成。',
    '',
    '数值采样、可逆拖动和缩略图检查不能代替绳结拓扑与成品参考图核对；攀岩、救援等用途还需要专业实操验证。未完成或未确认的模型不使用相近课程冒充。',
    '',
    '可运行 `node scripts/check-knot-atlas.mjs` 检查节点覆盖与映射，运行 `npm run check:courses` 检查实际三维课程。这个清单由 `node scripts/export-knot-benchmark.mjs` 根据当前代码生成。',
    '',
  );
  await writeFile(`${root}/docs/knots3d-benchmark.md`, lines.join('\n'));
  console.log(`已导出 ${KNOT_ATLAS.length} 个节点，${mapped.length} 个同法课程映射。`);
} finally {
  await server.close();
}
