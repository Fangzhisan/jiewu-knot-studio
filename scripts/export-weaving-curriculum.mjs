import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

// 从同一份目标、课程和复核记录导出文档，避免把规划条目算成完课。
const server = await createServer({
  root: fileURLToPath(new URL('..', import.meta.url)),
  configFile: false,
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});
try {
  const { WEAVING_ATLAS } = await server.ssrLoadModule('/src/weavingAtlas/index.ts');
  const { WEAVING_FAMILIES } = await server.ssrLoadModule('/src/weavingAtlas/families.ts');
  const playable = WEAVING_ATLAS.filter((n) => n.courseId).length;
  const passed = WEAVING_ATLAS.filter((n) => n.review).length;
  const rows = WEAVING_FAMILIES.map((family) => {
    const nodes = WEAVING_ATLAS.filter((n) => n.family === family.id);
    return `| ${family.name} | ${nodes.length} | ${nodes.filter((n) => n.courseId).length} | ${nodes.filter((n) => n.review).length} |`;
  });
  const sections = WEAVING_FAMILIES.map(
    (family) =>
      `## ${family.name}\n\n| 课程目标 | 状态 |\n| --- | --- |\n` +
      WEAVING_ATLAS.filter((n) => n.family === family.id)
        .map(
          (n) =>
            `| ${n.title} | ${n.review ? '三维动画七项复核通过' : n.courseId ? '原有三维课，待本标准复核' : '待制作三维课'} |`,
        )
        .join('\n'),
  );
  const text = `# 编织课程目标与完成情况\n\n编织以246节为扩展目标，与绳结的目标规模一致。这是本站的课程规划，不是外部网站的246节编织清单。\n\n当前可播放三维课${playable}节，其中本批${passed}节已独立检查过程、布线、转折、收尾、收紧、成品和浏览器。原有${playable - passed}节保留，但没有自动套用本轮验收。按七项复核口径，仍有${246 - passed}项目标需制作或复核。规划条目不进入前台课程数量。\n\n| 工艺类型 | 目标 | 可播放三维课 | 七项已通过 |\n| --- | ---: | ---: | ---: |\n${rows.join('\n')}\n\n新课逐节检查1001帧的整绳互穿、弯曲半径和长度保持，另检查换行、换股与阶段连接。数值检查与浏览器画面检查分别进行；只有全部通过才登记模型指纹。它们是动画复核，不等于实物工艺认证。\n\n网具区分实际网结和装饰结网；首饰编绳段与完整饰品分开；组织小样不冒充已经离机锁边的成品。每课的具体演示范围写在课程说明中。\n\n工艺参考：[Animated Knots 的网结与制网说明](https://www.animatedknots.com/sheet-bend-knot)、[多股对称平编](https://www.animatedknots.com/french-sinnet-knot-one)、[Cotton Incorporated 的织造顺序与基础组织](https://cottonworks.com/wp-content/uploads/2023/03/Weaving-101.pdf)。模型由本站程序生成。\n\n${sections.join('\n\n')}\n`;
  await writeFile(fileURLToPath(new URL('../docs/weaving-curriculum.md', import.meta.url)), text);
  console.log(`Exported 246 goals, ${playable} playable courses, ${passed} reviewed courses.`);
} finally {
  await server.close();
}
