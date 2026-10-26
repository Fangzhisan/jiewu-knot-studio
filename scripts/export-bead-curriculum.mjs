import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

// 仅导出实际课程和独立验收状态，不把规划数量写成已完成。
const server = await createServer({
  root: fileURLToPath(new URL('..', import.meta.url)),
  configFile: false,
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
});
try {
  const { BEAD_ATLAS } = await server.ssrLoadModule('/src/beadAtlas/index.ts');
  const { BEAD_FAMILIES } = await server.ssrLoadModule('/src/beadAtlas/families.ts');
  const passed = BEAD_ATLAS.filter((n) => n.review).length;
  const rows = BEAD_FAMILIES.map((f) => {
    const nodes = BEAD_ATLAS.filter((n) => n.family === f.id);
    return `| ${f.name} | ${nodes.length} | ${nodes.filter((n) => n.review).length} |`;
  });
  const sections = BEAD_FAMILIES.map(
    (f) =>
      `## ${f.name}\n\n| 课程 | 状态 |\n| --- | --- |\n` +
      BEAD_ATLAS.filter((n) => n.family === f.id)
        .map(
          (n) =>
            `| ${n.title} | ${n.review ? '三维成品课，八项复核通过' : '原有三维课，未自动沿用本轮验收'} |`,
        )
        .join('\n'),
  );
  const text = `# 珠串课程与完成情况\n\n当前珠串可播放三维课${BEAD_ATLAS.length}节，与当前绳结的40节可播放课程规模一致。本批新增${passed}节整件项目：9节项链、7节手链、6节成对耳饰、5节挂饰与摆件。原有13节针法及部件课保留，没有自动计入本批验收。后续继续向246节的绳结目标规模扩充；当前40节不代表246节已完成。\n\n| 类别 | 可播放三维课 | 本批八项已通过 |\n| --- | ---: | ---: |\n${rows.join('\n')}\n\n新增课逐节检查过程、布线、穿孔、转折、收尾、收紧、成品和浏览器。每课全程采样1001帧，核对线管自身与相互间距、真实珠孔轮廓、压管变形后的孔位、珠体间距、固定环与扣件实体；另检查实际渲染网格端帽及阶段连接。浏览器逐课查看关键进度、正斜视末态、连续收尾播放和390像素页面。全部通过后才记录模型与步骤指纹。\n\n柔性钢丝课逐段显示已穿入的线段，未穿入余线不在画面中，不把显示线长当作整根材料守恒的证明。压管压扁与普通珠体分开，主体珠子不靠缩小来制造收紧效果。扣件以摊放分开的状态展示，便于检查两端回穿与装配。\n\n线框类使用预成形金属线框及预装上端扣件，课程完成其上的全部串珠和自由端折眼封口；每条分支均封口，耳饰左右成对完成。摆件以悬挂展示的珠饰为范围，没有加入底座装配。吊坠项链同时完成主链与珠坠，两者采用对应材料的收尾。珠圈链由一根线逐圈闭合并换位，四珠与六珠结构分别说明。\n\n以上为动画与几何复核，材料规格、成品长度和实际牢固度仍需实物试做确认。课程内保留各自备料范围与工艺参考，模型由本站程序生成。\n\n工艺参考：[PRECIOSA ORNELA 金属线串珠与端部小眼](https://www.preciosa-ornela.com/content/files/downloads/project/1740-circles.pdf)、[Beadaholique 压管与回穿收尾](https://beadaholique.com/products/how-to-use-crimp-beads-and-tubes)、[Artbeads 四珠闭环与换位示意](https://artbeads.com/content/tutorial-pdfs/2014-right-angle-weave-diagram.pdf)。\n\n${sections.join('\n\n')}\n`;
  await writeFile(fileURLToPath(new URL('../docs/bead-curriculum.md', import.meta.url)), text);
  console.log(`Exported ${BEAD_ATLAS.length} playable bead courses, ${passed} reviewed projects.`);
} finally {
  await server.close();
}
