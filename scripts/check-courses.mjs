import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';

// 这里回归的是课程数据。成品是否打得对、穿线顺序是否合理，仍需要看模型并做工艺核对。
const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({
  root,
  configFile: false,
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});

const failures = [];
const results = [];
// 记下课程和具体问题，最后一起报出来。
const fail = (course, message) => failures.push(`${course}: ${message}`);
// 一个有效坐标必须有三个有限数值。
const validVector = (point) =>
  Array.isArray(point) && point.length === 3 && point.every(Number.isFinite);

// 去重后数量不变，才说明这些标识没有撞车。
const unique = (values) => new Set(values).size === values.length;

try {
  const { COURSES, CATEGORIES } = await server.ssrLoadModule('/src/lessons/catalog.ts');
  const { getCordEnds } = await server.ssrLoadModule('/src/cordEnds.ts');
  const { getCourseProjection, computeCourseProjection } = await server.ssrLoadModule(
    '/src/courseProjection.ts',
  );

  const { SCENARIOS, getApplication, courseSearchText } =
    await server.ssrLoadModule('/src/courseScenarios.ts');

  if (!unique(COURSES.map((course) => course.id))) {
    fail('catalog', 'duplicate course id');
  }

  if (!unique(CATEGORIES.map((category) => category.id))) {
    fail('catalog', 'duplicate category id');
  }

  if (!unique(SCENARIOS.map((scene) => scene.id))) {
    fail('catalog', 'duplicate scenario id');
  }

  for (const course of COURSES) {
    const beforeFailures = failures.length;

    if (!CATEGORIES.some((category) => category.id === course.category)) {
      fail(course.id, 'unknown category');
    }

    const application = getApplication(course);

    if (
      !application.scenarios.length ||
      !unique(application.scenarios) ||
      application.scenarios.some((id) => !SCENARIOS.some((scene) => scene.id === id))
    ) {
      fail(course.id, 'missing or invalid scenarios');
    }

    if (!application.task.trim() || !application.focus.trim()) {
      fail(course.id, 'missing application task/focus');
    }

    for (const id of application.scenarios) {
      const name = SCENARIOS.find((scene) => scene.id === id)?.name;

      if (name && !courseSearchText(course).includes(name.normalize('NFKC').toLocaleLowerCase())) {
        fail(course.id, 'scenario is not searchable');
      }
    }

    if (
      application.scenarios.some((id) => ['climbing', 'mountaineering', 'rescue'].includes(id)) &&
      !application.boundary
    ) {
      fail(course.id, 'missing safety-critical lesson scope');
    }

    for (const key of ['name', 'title', 'description', 'material', 'materialNote', 'sourceName']) {
      if (typeof course[key] !== 'string' || !course[key].trim()) {
        fail(course.id, `missing ${key}`);
      }
    }

    if (!(course.duration > 0) || !(course.initialProgress >= 0 && course.initialProgress <= 1)) {
      fail(course.id, 'invalid timing');
    }

    if (course.projectionBounds) {
      const { minX, maxX, minY, maxY } = course.projectionBounds;

      if (![minX, maxX, minY, maxY].every(Number.isFinite) || minX >= maxX || minY >= maxY) {
        fail(course.id, 'invalid finished projection bounds');
      }
    }

    try {
      if (new URL(course.source).protocol !== 'https:') {
        fail(course.id, 'source must use HTTPS');
      }
    } catch {
      fail(course.id, 'invalid source URL');
    }

    if (course.steps.length < 2 || course.steps[0]?.time !== 0) {
      fail(course.id, 'expected at least two steps starting at zero');
    }

    course.steps.forEach((step, index) => {
      if (!step.title.trim() || !step.instruction.trim()) {
        fail(course.id, `empty step ${index + 1}`);
      }

      if (
        !(step.time >= 0 && step.time < 1) ||
        (index && step.time <= course.steps[index - 1].time)
      ) {
        fail(course.id, 'steps are not strictly ordered');
      }
    });

    if (failures.length > beforeFailures) {
      continue;
    }

    // 重型课程先准备坐标数据，随后所有采样都读取准备好的模型。
    await course.prepare?.();
    let maxPoints = 0,
      maxCords = 0,
      finalCaps = 0;

    // 从起点到成品取 251 帧，途中出现一次无效几何也要记下来。
    for (let frame = 0; frame <= 250; frame++) {
      const progress = frame / 250;
      const state = course.getState(progress);
      const cords = [
        {
          id: 'main',
          points: state.points,
          radius: state.radius ?? (state.beads ? 0.025 : 0.06),
          thicknessScales: state.thicknessScales,
        },
        ...(state.strands ?? []),
      ];

      const beads = state.beads ?? [],
        supports = state.supports ?? [];

      maxPoints = Math.max(
        maxPoints,
        cords.reduce((total, cord) => total + cord.points.length, 0),
      );
      maxCords = Math.max(maxCords, cords.length);

      if (
        !unique(cords.map((cord) => cord.id)) ||
        !unique(beads.map((bead) => bead.id)) ||
        !unique(supports.map((support) => support.id))
      ) {
        fail(course.id, `duplicate geometry id at ${progress}`);
      }

      if (!validVector(state.tip)) {
        fail(course.id, `invalid working tip at ${progress}`);
      }

      for (const cord of cords) {
        if (
          cord.points.length < 2 ||
          !cord.points.every(validVector) ||
          !(cord.radius > 0 && Number.isFinite(cord.radius))
        ) {
          fail(course.id, `invalid cord ${cord.id} at ${progress}`);
        }

        if (
          cord.thicknessScales &&
          (cord.thicknessScales.length !== cord.points.length ||
            cord.thicknessScales.some(
              (value) => !Number.isFinite(value) || value <= 0 || value > 1,
            ))
        ) {
          fail(course.id, `invalid thickness at ${progress}`);
        }
      }

      for (const item of [...beads, ...supports]) {
        if (
          !validVector(item.position) ||
          !validVector(item.axis) ||
          Math.abs(Math.hypot(...item.axis) - 1) > 1e-6 ||
          !(item.radius > 0 && Number.isFinite(item.radius))
        ) {
          fail(course.id, `invalid bead/support at ${progress}`);
        }
      }

      for (const bead of beads) {
        if (
          bead.radialScale !== undefined &&
          !(Number.isFinite(bead.radialScale) && bead.radialScale > 0)
        ) {
          fail(course.id, `invalid bead radial scale at ${progress}`);
        }
        if (
          bead.axialScale !== undefined &&
          !(Number.isFinite(bead.axialScale) && bead.axialScale > 0)
        ) {
          fail(course.id, `invalid bead axial scale at ${progress}`);
        }
      }

      for (const support of supports) {
        if (!['cylinder', 'ring', 'braiding-disk', 'carabiner'].includes(support.kind)) {
          fail(course.id, 'unknown support kind');
        }

        if (!(Number.isFinite(support.length) && support.length > 0)) {
          fail(course.id, `invalid support length at ${progress}`);
        }

        if (support.kind === 'ring' && support.radius <= support.length / 2) {
          fail(course.id, `ring has no open center at ${progress}`);
        }
        if (
          support.kind === 'carabiner' &&
          (!Number.isFinite(support.width ?? (support.length * 6) / 11) ||
            !((support.width ?? (support.length * 6) / 11) > support.radius * 2) ||
            support.length <= support.radius * 2 ||
            !Number.isFinite(support.gateOpen ?? 0) ||
            (support.gateOpen ?? 0) < 0 ||
            (support.gateOpen ?? 0) > 1)
        ) {
          fail(course.id, `invalid carabiner at ${progress}`);
        }

        if (
          support.kind === 'braiding-disk' &&
          (!(support.innerRadius > 0 && support.innerRadius < support.radius) ||
            !Number.isFinite(support.rotation ?? 0) ||
            support.activeSlots?.some((slot) => !Number.isInteger(slot) || slot < 1 || slot > 32))
        ) {
          fail(course.id, `invalid braiding disk at ${progress}`);
        }
      }

      const expected = course.steps.filter((step) => progress >= step.time).length - 1;

      if (state.checkpoint !== expected) {
        fail(course.id, `step mismatch at ${progress}`);
      }

      const caps = getCordEnds(state);

      if (!unique(caps.map((cap) => cap.label)) || !unique(caps.map((cap) => cap.id))) {
        fail(course.id, `duplicate end-cap identity at ${progress}`);
      }

      if (
        caps.some(
          (cap) =>
            !validVector(cap.point) ||
            !validVector(cap.direction) ||
            Math.abs(Math.hypot(...cap.direction) - 1) > 1e-6,
        )
      ) {
        fail(course.id, `invalid end-cap transform at ${progress}`);
      }

      if (frame === 250) {
        finalCaps = caps.length;
      }

      // 插入一次无关跳转再回到原处，确认模型没有依赖播放历史。
      if (frame % 25 === 0) {
        const snapshot = JSON.stringify(state);
        course.getState((progress + 0.51) % 1);

        if (JSON.stringify(course.getState(progress)) !== snapshot) {
          fail(course.id, `history-dependent seeking at ${progress}`);
        }
      }
    }

    const tighteningStart = course.tighteningStart ?? course.steps.at(-1).time;
    if (
      !Number.isFinite(tighteningStart) ||
      tighteningStart < 0 ||
      tighteningStart >= 1 ||
      !course.steps.some((step) => step.time === tighteningStart)
    ) {
      fail(course.id, 'tightening start must identify an actual lesson step');
    }
    const gatherStart = course.getState(tighteningStart),
      finished = course.getState(1);

    // 末尾可以单独观察成品；从实际收紧步骤比较几何变化。
    const positions = (state) =>
      JSON.stringify([
        state.points,
        ...(state.strands ?? []).map((cord) => cord.points),
        ...(state.beads ?? []).map((bead) => bead.position),
      ]);

    if (positions(gatherStart) === positions(finished)) {
      fail(course.id, 'tightening step does not visibly gather the model');
    }

    const projection = getCourseProjection(course);

    if (!projection.marks.length || /NaN|Infinity/.test(JSON.stringify(projection))) {
      fail(course.id, 'invalid finished projection');
    }

    if (getCourseProjection(course) !== projection) {
      fail(course.id, 'finished projection is not cached');
    }

    if (
      course.prepare &&
      JSON.stringify(projection) !== JSON.stringify(computeCourseProjection(course))
    ) {
      fail(course.id, 'generated projection differs from the actual finished model');
    }

    results.push({
      id: course.id,
      name: course.name,
      category: course.category,
      maxPoints,
      maxCords,
      finalCaps,
      passed: failures.length === beforeFailures,
    });
  }

  // 汇总整轮检查，既保存失败原因，也保留各分类的数量。
  const report = {
    time: new Date().toISOString(),
    framesPerCourse: 251,
    counts: CATEGORIES.map((category) => ({
      id: category.id,
      name: category.name,
      count: COURSES.filter((course) => course.category === category.id).length,
    })),
    results,
    failures,
  };

  const reportPath = process.argv
    .find((argument) => argument.startsWith('--report='))
    ?.slice('--report='.length);

  if (reportPath) {
    await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
  }

  console.log(
    `${failures.length ? 'FAIL' : 'PASS'}: ${COURSES.length} courses × 251 frames; geometry data, steps, seeking, end caps, gathering and projections.`,
  );
  console.table(report.counts);

  if (failures.length) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  }
} finally {
  // 成功或失败都关掉模块服务，别留下文件句柄。
  await server.close();
}
