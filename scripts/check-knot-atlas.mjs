import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { knotReviewFingerprint } from './knot-review-fingerprint.mjs';

// 检查来源清单、类型归属与真实课程映射；不把通过数据检查当作动画工艺验收。
const server = await createServer({
  root: fileURLToPath(new URL('..', import.meta.url)),
  configFile: false,
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});

try {
  const { KNOT_ATLAS } = await server.ssrLoadModule('/src/knotAtlas/index.ts');
  const { SOURCE_TAXONOMY } = await server.ssrLoadModule('/src/knotAtlas/taxonomy.ts');
  const { COURSES } = await server.ssrLoadModule('/src/lessons/catalog.ts');
  const { KNOT_REVIEW_CHECKS } = await server.ssrLoadModule('/src/knotAtlas/productionReviews.ts');
  const { KNOT_REVIEWED_VERSIONS } = await server.ssrLoadModule(
    '/src/knotAtlas/reviewedVersions.ts',
  );
  const { SOURCE_ACTIVITY_COMPARISON, SOURCE_TYPE_COMPARISON } = await server.ssrLoadModule(
    '/src/knotAtlas/siteTaxonomy.ts',
  );
  const { SCENARIOS } = await server.ssrLoadModule('/src/courseScenarios.ts');
  const ids = new Set(KNOT_ATLAS.map((node) => node.id));
  const urls = new Set(KNOT_ATLAS.map((node) => node.source.url));
  const types = SOURCE_TAXONOMY.filter((group) => group.kind === 'type');
  const activities = SOURCE_TAXONOMY.filter((group) => group.kind === 'activity');
  assert.equal(ids.size, 246, '来源快照应有246个唯一节点');
  assert.equal(KNOT_ATLAS.length, ids.size);
  assert.equal(urls.size, ids.size);
  assert.equal(types.length, 12);
  assert.equal(activities.length, 17);
  assert.deepEqual(
    SOURCE_ACTIVITY_COMPARISON.map((item) => item.sourceId),
    activities.map((item) => item.id),
  );
  assert.deepEqual(
    SOURCE_TYPE_COMPARISON.map((item) => item.sourceId),
    types.map((item) => item.id),
  );
  SOURCE_ACTIVITY_COMPARISON.forEach((item) =>
    item.localIds.forEach((id) => assert(SCENARIOS.some((scene) => scene.id === id))),
  );

  for (const group of SOURCE_TAXONOMY) {
    assert.equal(new Set(group.nodeIds).size, group.nodeIds.length, `${group.name}重复条目`);
    group.nodeIds.forEach((id) => assert(ids.has(id), `${group.name}有目录外成员${id}`));
  }

  for (const node of KNOT_ATLAS) {
    assert(node.source.name && node.source.englishName && node.source.imageUrl);
    assert.equal(new URL(node.source.url).hostname, 'knots3d.com');
    assert.equal(decodeURIComponent(new URL(node.source.url).pathname.split('/').at(-1)), node.id);
    const belongsTo = types.filter((group) => group.nodeIds.includes(node.id));
    assert.equal(belongsTo.length, 1, `${node.id}结构类型不是唯一`);
    assert.equal(belongsTo[0].id, node.source.typeId);
    assert.deepEqual(
      node.source.activityIds,
      activities.filter((group) => group.nodeIds.includes(node.id)).map((group) => group.id),
    );
    node.source.relatedIds.forEach((id) => assert(ids.has(id), `${node.id}关联了缺失节点${id}`));
    assert.equal(new Set(node.objects.map((item) => item.id)).size, node.objects.length);
    node.objects.forEach((item) => {
      assert(item.evidence.length && item.evidence.every((e) => e.sourceUrl === node.source.url));
    });
    if (node.localCourse) {
      assert(COURSES.some((course) => course.id === node.localCourse.courseId));
      if (node.localCourse.match === 'different-method') {
        assert.equal(node.production.status, 'not-started', `${node.id}不能用其他绑法冒充覆盖`);
      }
    }
    if (['existing-3d', 'implemented-3d'].includes(node.production.status)) {
      assert.equal(node.localCourse?.match, 'same-method');
    }
    if (node.production.review === 'passed') {
      const course = COURSES.find((item) => item.id === node.localCourse?.courseId);
      assert(course, `${node.id}缺少已验收课程`);
      assert.equal(
        KNOT_REVIEWED_VERSIONS[node.id],
        knotReviewFingerprint(course),
        `${node.id}的模型或步骤已变化，需要重新验收并更新版本指纹`,
      );
      for (const check of KNOT_REVIEW_CHECKS) {
        assert.equal(
          node.production.checks?.[check]?.status,
          'passed',
          `${node.id}缺少${check}验收`,
        );
        assert(node.production.checks[check].note.trim(), `${node.id}缺少${check}验收依据`);
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        nodes: KNOT_ATLAS.length,
        types: types.length,
        activities: activities.length,
        sameMethod: KNOT_ATLAS.filter((node) => node.localCourse?.match === 'same-method').length,
        differentMethod: KNOT_ATLAS.filter((node) => node.localCourse?.match === 'different-method')
          .length,
        withoutSourceActivity: KNOT_ATLAS.filter((node) => !node.source.activityIds.length).length,
        playableCourses: COURSES.length,
        acceptedReviewedKnots: KNOT_ATLAS.filter((node) => node.production.review === 'passed')
          .length,
        remainingKnots: KNOT_ATLAS.filter((node) => node.production.review !== 'passed').length,
      },
      null,
      2,
    ),
  );
} finally {
  await server.close();
}
