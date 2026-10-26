import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import { inspectRoundCordState } from './knot-geometry.mjs';

// 参数为课程 ID，可用 --frames=1001；只做数值检查，不写入工艺验收状态。
const args = process.argv.slice(2);
const frames = Number(args.find((arg) => arg.startsWith('--frames='))?.slice(9) ?? 1001);
const output = args.find((arg) => arg.startsWith('--output='))?.slice(9);
const ids = args.filter((arg) => !arg.startsWith('--'));
if (!Number.isInteger(frames) || frames < 2) {
  throw new Error('frames 必须是至少 2 的整数');
}
if (!ids.length) {
  throw new Error('请指定需要复核的课程 ID，避免误把抽样数值当作全站验收');
}
const server = await createServer({
  root: fileURLToPath(new URL('..', import.meta.url)),
  configFile: false,
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});
const reports = [];
try {
  const { COURSES } = await server.ssrLoadModule('/src/lessons/catalog.ts');
  const { carabinerWorldLines } = await server.ssrLoadModule('/src/supportGeometry.ts');
  for (const id of ids) {
    const course = COURSES.find((item) => item.id === id);
    if (!course) {
      throw new Error(`没有课程 ${id}`);
    }
    await course.prepare?.();
    const report = {
      id,
      frames,
      lengths: {},
      minimumBendRatio: Infinity,
      minimumContactClearance: Infinity,
      minimumSupportClearance: Infinity,
      issues: [],
    };
    for (let frame = 0; frame < frames; frame++) {
      const progress = frame / (frames - 1);
      const check = inspectRoundCordState(course.getState(progress), carabinerWorldLines);
      const addIssue = (issue) => {
        if (report.issues.length < 20) {
          report.issues.push({ progress, ...issue });
        }
      };
      for (const [cord, length] of Object.entries(check.lengths)) {
        const previous = report.lengths[cord] ?? { min: Infinity, max: -Infinity };
        previous.min = Math.min(previous.min, length);
        previous.max = Math.max(previous.max, length);
        previous.drift = previous.max - previous.min;
        report.lengths[cord] = previous;
      }
      for (const bend of check.bends) {
        if (bend.minimum / bend.radius < report.minimumBendRatio) {
          report.minimumBendAt = { progress, ...bend };
        }
        report.minimumBendRatio = Math.min(report.minimumBendRatio, bend.minimum / bend.radius);
        if (bend.minimum < bend.radius - 1e-5) {
          addIssue({ kind: 'sharp-bend', ...bend });
        }
      }
      for (const support of check.supports) {
        if (support.clearance < report.minimumSupportClearance) {
          report.minimumSupportAt = { progress, ...support };
        }
        report.minimumSupportClearance = Math.min(
          report.minimumSupportClearance,
          support.clearance,
        );
        if (support.clearance < -1e-5) {
          addIssue({ kind: 'support-overlap', ...support });
        }
      }
      if (check.contacts.nearestClearance < report.minimumContactClearance) {
        report.minimumContactAt = { progress, ...check.contacts.closest };
      }
      report.minimumContactClearance = Math.min(
        report.minimumContactClearance,
        check.contacts.nearestClearance,
      );
      for (const issue of check.contacts.issues) {
        addIssue({ kind: 'cord-overlap', ...issue });
      }
    }
    for (const [cord, length] of Object.entries(report.lengths)) {
      if (length.drift > 1e-4 * Math.max(1, length.max)) {
        report.issues.push({ kind: 'length-drift', cord, ...length });
      }
    }
    reports.push(report);
    console.log(JSON.stringify(report));
  }
  if (output) {
    await writeFile(output, JSON.stringify(reports, null, 2) + '\n');
  }
  if (reports.some((report) => report.issues.length)) {
    process.exitCode = 1;
  }
} finally {
  await server.close();
}
