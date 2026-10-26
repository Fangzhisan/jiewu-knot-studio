import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { knotReviewFingerprint } from './knot-review-fingerprint.mjs';

// 成品课须有逐课八项依据与当前模型指纹，原有课不自动计入本轮验收。
const server = await createServer({
  root: fileURLToPath(new URL('..', import.meta.url)),
  configFile: false,
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});
try {
  const { BEAD_ATLAS, LEGACY_BEAD_COURSES } = await server.ssrLoadModule('/src/beadAtlas/index.ts');
  const { BEAD_FAMILIES } = await server.ssrLoadModule('/src/beadAtlas/families.ts');
  const { BEAD_REVIEW_CHECKS, BEAD_PRODUCTION_REVIEWS } = await server.ssrLoadModule(
    '/src/beadAtlas/productionReviews.ts',
  );
  const { BEAD_REVIEWED_VERSIONS } = await server.ssrLoadModule(
    '/src/beadAtlas/reviewedVersions.ts',
  );
  const { COURSES } = await server.ssrLoadModule('/src/lessons/catalog.ts');
  const { filterLibrary } = await server.ssrLoadModule('/src/library.ts');
  const courses = COURSES.filter((course) => course.category === 'beads');
  assert.equal(courses.length, 40);
  assert.equal(BEAD_FAMILIES.length, 7);
  const mapped = BEAD_FAMILIES.flatMap((f) => [...f.courseIds]);
  assert.equal(new Set(mapped).size, mapped.length);
  assert.deepEqual(mapped.sort(), courses.map((c) => c.id).sort());
  assert.equal(BEAD_REVIEW_CHECKS.length, 8);
  for (const node of BEAD_ATLAS) {
    const family = BEAD_FAMILIES.find((f) => f.id === node.family);
    assert(family, `${node.title} 缺少类型`);
    assert(
      filterLibrary({ category: 'beads', scenario: '', family: family.id, query: '' }).some(
        (e) => e.id === node.id,
      ),
      `${node.id} 类型筛选缺失`,
    );
    if (!node.review) {
      assert(LEGACY_BEAD_COURSES.includes(node.id), `${node.id} 新课未验收`);
      continue;
    }
    assert.equal(node.review.status, 'passed');
    assert(node.project, `${node.id} 成品课映射缺失`);
    for (const check of BEAD_REVIEW_CHECKS) {
      assert(node.review.checks[check]?.length > 8, `${node.id} 缺少${check}依据`);
    }
    const course = courses.find((c) => c.id === node.id);
    assert.equal(
      BEAD_REVIEWED_VERSIONS[node.id],
      knotReviewFingerprint(course),
      `${node.id} 已改变，需重新复核`,
    );
  }
  assert.deepEqual(
    Object.keys(BEAD_REVIEWED_VERSIONS).sort(),
    Object.keys(BEAD_PRODUCTION_REVIEWS).sort(),
  );
  assert.equal(Object.keys(BEAD_PRODUCTION_REVIEWS).length, 27);
  console.log(
    `PASS: ${courses.length} bead courses, 7 families, 27 independently reviewed complete projects; 13 legacy courses not automatically accepted.`,
  );
} finally {
  await server.close();
}
