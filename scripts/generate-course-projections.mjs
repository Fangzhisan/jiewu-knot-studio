import { createServer } from 'vite';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, rename, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const target = resolve(root, 'src/lessons/generated/heavy-projections.ts');
const temporary = `${target}.${process.pid}.tmp`;
const checkOnly = process.argv.includes('--check');
const ids = [
  'macrame-square-column',
  'macrame-half-knot-spiral',
  'macrame-alternating-square-net',
  'kumihimo-eight-strand',
];

const inputPaths = [
  'src/courseProjection.ts',
  'src/lessons/types.ts',
  'src/lessons/macrame.ts',
  'src/lessons/kumihimo.ts',
  'src/lessons/data/macrame-square.ts',
  'src/lessons/data/macrame-spiral.ts',
  'src/lessons/data/macrame-net.ts',
  'src/lessons/data/kumihimo.ts',
];

// 给每份输入留一份内容摘要。
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

// 生成前后各读一次，防止中途改动混进结果。
async function inputHashes() {
  return Object.fromEntries(
    await Promise.all(
      inputPaths.map(async (path) => [path, sha256(await readFile(resolve(root, path)))]),
    ),
  );
}

const dataDeclaration =
  'export const HEAVY_COURSE_PROJECTIONS: Record<string, CourseProjection> = ';

// 借 Vite 加载课程模块，不启动网页。
const server = await createServer({
  root,
  configFile: false,
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  // 不读旧生成文件，缺失或损坏时也能从当前模型重算。
  plugins: [
    {
      name: 'compute-projections-without-generated-data',
      // 几种导入路径都指向同一份虚拟模块。
      resolveId(id) {
        if (
          id === './lessons/generated/heavy-projections' ||
          id === '/src/lessons/generated/heavy-projections.ts' ||
          id === target
        ) {
          return target;
        }
      },
      // 用空表挡住旧缓存，下面只调用实时投影计算。
      load(id) {
        if (id === target) {
          return 'export const HEAVY_COURSE_PROJECTIONS = {}';
        }
      },
    },
  ],
});

try {
  const hashes = await inputHashes();
  const { COURSES } = await server.ssrLoadModule('/src/lessons/catalog.ts');
  const { computeCourseProjection } = await server.ssrLoadModule('/src/courseProjection.ts');
  // 各课程的实际成品投影。
  const projections = {};

  // 完整准备模型后再取成品姿态。
  for (const id of ids) {
    const course = COURSES.find((item) => item.id === id);

    if (!course?.prepare) {
      throw new Error(`Expected a preparable heavy course: ${id}`);
    }

    await course.prepare();
    projections[id] = computeCourseProjection(course);

    if (!projections[id].marks.length) {
      throw new Error(`Empty finished projection: ${id}`);
    }
  }

  if (JSON.stringify(hashes) !== JSON.stringify(await inputHashes())) {
    throw new Error('Projection inputs changed during generation. Retry after the edits finish.');
  }

  const content =
    '// 由 npm run generate:projections 生成，改模型后重新运行即可。\n' +
    '// 摘要用于检查过期数据，投影来自实际成品模型。\n' +
    "import type { CourseProjection } from '../../courseProjection'\n\n" +
    `export const HEAVY_PROJECTION_INPUT_HASHES = ${JSON.stringify(hashes, null, 2)} as const\n\n` +
    '// 预先生成的成品投影。\n' +
    dataDeclaration +
    JSON.stringify(projections, null, 2) +
    '\n';

  if (checkOnly) {
    let actual = '';

    try {
      actual = await readFile(target, 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    let stored;

    try {
      stored = JSON.parse(actual.slice(actual.indexOf(dataDeclaration) + dataDeclaration.length));
    } catch {
      /* 缺失或损坏只报错，检查命令不改文件。 */
    }

    const matching = stored && JSON.stringify(stored) === JSON.stringify(projections);

    if (!matching || actual !== content) {
      const mismatched = ids.filter(
        (id) => JSON.stringify(stored?.[id]) !== JSON.stringify(projections[id]),
      );

      throw new Error(
        `Generated course projections are stale${mismatched.length ? ` or differ from actual models: ${mismatched.join(', ')}` : ' (source hashes or file format changed)'}. Run npm run generate:projections.`,
      );
    }

    console.log(
      `PASS: ${ids.length} generated course projections match prepared production models and source hashes.`,
    );
  } else {
    await mkdir(dirname(target), { recursive: true });
    // 写完整再替换，避免读到半份结果。
    await writeFile(temporary, content);
    await rename(temporary, target);
    console.log(
      `Generated ${ids.length} course projections (${Buffer.byteLength(content)} bytes).`,
    );
  }
} finally {
  await server.close();
  await rm(temporary, { force: true });
}
