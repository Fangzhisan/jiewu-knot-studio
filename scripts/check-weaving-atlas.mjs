import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { knotReviewFingerprint } from './knot-review-fingerprint.mjs';

// 规划数量不代表完课；新注册课程必须有七项复核和当前模型指纹。
const server = await createServer({
  root: fileURLToPath(new URL('..', import.meta.url)),
  configFile: false,
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});
try {
  const { WEAVING_ATLAS, LEGACY_WEAVING_COURSES } = await server.ssrLoadModule(
    '/src/weavingAtlas/index.ts',
  );
  const { WEAVING_FAMILIES } = await server.ssrLoadModule('/src/weavingAtlas/families.ts');
  const { WEAVING_REVIEW_CHECKS, WEAVING_PRODUCTION_REVIEWS } = await server.ssrLoadModule(
    '/src/weavingAtlas/productionReviews.ts',
  );
  const { WEAVING_REVIEWED_VERSIONS } = await server.ssrLoadModule(
    '/src/weavingAtlas/reviewedVersions.ts',
  );
  const { COURSES } = await server.ssrLoadModule('/src/lessons/catalog.ts');
  const { SCENARIOS } = await server.ssrLoadModule('/src/courseScenarios.ts');
  assert.equal(WEAVING_ATLAS.length, 246);
  assert.equal(new Set(WEAVING_ATLAS.map((n) => n.id)).size, 246);
  assert.equal(new Set(WEAVING_ATLAS.map((n) => n.title)).size, 246);
  assert.equal(WEAVING_FAMILIES.length, 13);
  const weaving = COURSES.filter((c) => c.category === 'weaving');
  const mapped = new Set();
  for (const node of WEAVING_ATLAS) {
    const family = WEAVING_FAMILIES.find((f) => f.id === node.family);
    assert(family, `${node.title} 缺少类型`);
    node.scenarios.forEach((s) =>
      assert(
        SCENARIOS.some((scene) => scene.id === s),
        `${node.title} 场景缺失`,
      ),
    );
    if (!node.courseId) {
      continue;
    }
    assert(!mapped.has(node.courseId), `${node.title}重复计算课程`);
    mapped.add(node.courseId);
    const course = weaving.find((c) => c.id === node.courseId);
    assert(course, `${node.title} 没有可播放课程`);
    assert(family.courseIds.includes(course.id), `${course.id} 类型映射不一致`);
    if (node.review) {
      assert.equal(node.review.status, 'passed');
      for (const check of WEAVING_REVIEW_CHECKS) {
        assert(node.review.checks[check]?.length > 8, `${course.id} 缺少${check}依据`);
      }
      assert.equal(
        WEAVING_REVIEWED_VERSIONS[course.id],
        knotReviewFingerprint(course),
        `${course.id} 已改变，需重新复核`,
      );
    } else {
      assert(LEGACY_WEAVING_COURSES.includes(course.id), `${course.id} 新课未验收`);
    }
  }
  for (const course of weaving) {
    assert(mapped.has(course.id), `${course.id} 不在课程目标中`);
  }
  for (const id of Object.keys(WEAVING_PRODUCTION_REVIEWS)) {
    assert(mapped.has(id), `${id} 验收记录悬空`);
  }
  assert.deepEqual(
    Object.keys(WEAVING_REVIEWED_VERSIONS).sort(),
    Object.keys(WEAVING_PRODUCTION_REVIEWS).sort(),
  );
  console.log(
    `PASS: 246 weaving nodes, ${weaving.length} playable 3D courses, ${Object.keys(WEAVING_PRODUCTION_REVIEWS).length} independently reviewed.`,
  );
} finally {
  await server.close();
}
