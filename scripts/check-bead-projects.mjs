import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import { inspectBeadProjectState } from './bead-project-geometry.mjs';

// 可先指定草稿模块检查；正式复核默认从实际课程目录读取。
const args = Object.fromEntries(
  process.argv.slice(2).map((v) => {
    const i = v.indexOf('=');
    return [v.slice(2, i), v.slice(i + 1)];
  }),
);
const frames = Number(args.frames ?? 101);
if (!Number.isInteger(frames) || frames < 2) {
  throw new Error('frames必须是大于等于2的整数');
}
const server = await createServer({
  root: fileURLToPath(new URL('..', import.meta.url)),
  configFile: false,
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});
try {
  const module = await server.ssrLoadModule(args.module ?? '/src/lessons/catalog.ts');
  const courses = module[args.export ?? 'COURSES']
    .filter((c) =>
      args.ids ? args.ids.split(',').includes(c.id) : c.id.startsWith('bead-complete-'),
    )
    .slice(Number(args['start-index'] ?? 0), Number(args['end-index'] ?? Infinity));
  if (!courses.length) {
    throw new Error('没有匹配的珠串成品课，请核对模块、课程ID和范围');
  }
  const { carabinerWorldLines } = await server.ssrLoadModule('/src/supportGeometry.ts');
  const reports = [];
  for (const course of courses) {
    const report = {
      id: course.id,
      frames,
      minBend: Infinity,
      minCordGap: Infinity,
      minBeadGap: Infinity,
      minSupportGap: Infinity,
      visibleLineLengths: {},
      failures: [],
      worst: {},
    };
    for (let i = 0; i < frames; i++) {
      const p = i / (frames - 1),
        state = course.getState(p),
        result = inspectBeadProjectState(state, carabinerWorldLines);
      for (const bend of result.bends) {
        if (bend.minimum / bend.radius < report.minBend) {
          report.minBend = bend.minimum / bend.radius;
          report.worst.bend = { p, ...bend };
        }
      }
      report.minCordGap = Math.min(report.minCordGap, result.contacts.nearestClearance);
      if (result.beadClearance < report.minBeadGap) {
        report.minBeadGap = result.beadClearance;
        report.worst.bead = { p, ...result.beadWorst };
      }
      report.minSupportGap = Math.min(
        report.minSupportGap,
        ...result.supports.map((s) => s.clearance),
      );
      const length = Object.values(result.lengths).reduce((a, b) => a + b, 0);
      report.visibleLineLengths.min = Math.min(report.visibleLineLengths.min ?? Infinity, length);
      report.visibleLineLengths.max = Math.max(report.visibleLineLengths.max ?? 0, length);
      if (
        (result.bends.some((b) => b.minimum < b.radius - 1e-5) ||
          result.contacts.issues.length ||
          result.beadClearance < -1e-4 ||
          result.beadContacts.length ||
          result.supports.some((s) => s.clearance < -1e-5)) &&
        report.failures.length < 12
      ) {
        report.failures.push({
          p,
          bend: Math.min(...result.bends.map((b) => b.minimum / b.radius)),
          contacts: result.contacts.issues.slice(0, 2),
          bead: result.beadWorst,
          beadGap: result.beadClearance,
          beadContacts: result.beadContacts.slice(0, 2),
          supports: result.supports.filter((s) => s.clearance < -1e-5),
        });
      }
      if (i === frames - 1) {
        const missing = state.beads
          .filter((b) => {
            const passage = result.passages[b.id];
            const hole = Math.min(b.radius * 0.8, Math.max(0.055, Math.min(0.12, b.radius * 0.36)));
            const h = Math.sqrt(b.radius ** 2 - hole ** 2) * (b.axialScale ?? 1);
            return !passage || passage.min > -h + 0.006 || passage.max < h - 0.006;
          })
          .map((b) => b.id);
        if (missing.length) {
          report.failures.push({ missingFinishedPassages: missing });
        }
      }
    }
    report.visibleLineLengths.range = report.visibleLineLengths.max - report.visibleLineLengths.min;
    reports.push(report);
    console.log(JSON.stringify(report));
  }
  if (!reports.length) {
    throw new Error('没有选择任何珠串成品课');
  }
  if (args.output) {
    await writeFile(args.output, JSON.stringify(reports, null, 2) + '\n');
  }
  if (reports.some((r) => r.failures.length)) {
    process.exitCode = 1;
  }
} finally {
  await server.close();
}
