# 开发说明

在项目根目录运行 `npm ci` 和 `npm run dev`。建议 Node.js 22.21.1，开发与预览都使用 `127.0.0.1:5187`。

## 文件放在哪儿

- `src/App.vue`：课堂与课程目录之间的页面导航及筛选返回。
- `src/Classroom.vue`：课程选择、进度和播放控制。
- `src/scene.ts`、`src/cordEnds.ts`：模型渲染与线端编号。
- `src/lessons/`：三维课程的几何、时间轴、材料和参考来源，入口是 `catalog.ts`。
- `src/knotAtlas/`：Knots 3D 来源节点、分类、物品证据与实际课程映射。节点清单不等于已完成课程。
- `src/weavingAtlas/`：编织的246项课程目标、工艺类型与独立复核记录；前台只列出真实注册的三维课。
- `src/beadAtlas/`：珠串实际课程节点、成品类型与八项复核记录，原有基础课单独统计。
- `src/library.ts`、`src/courseScenarios.ts`：目录、搜索与用途分类。
- `src/components/`：目录、课堂快捷选择、缩略图和播放控件。
- `src/practice.ts`：当前页面内的临时播放状态，刷新后重置，不使用持久化存储。

原有43节三维基础课继续保留，对照来源逐项补充新的三维课程。当前数量以 `catalog.ts` 为准；[绳结对照清单](knots3d-benchmark.md) 从节点与注册课程共同导出，区分已有课、新增课和待制作项。

## 检查命令

```sh
npm run build
npm run check:courses
npm run check:end-labels
npm run check:bead-caps
npm run check:knot-atlas
npm run check:bead-atlas
```

`npm run build` 会运行配置中的构建前检查、执行 TypeScript 检查，并输出 `dist/`。具体检查项见 `package.json` 的 `scripts`；运行 `npm run` 可以列出当前可用的命令。

`check:courses` 每课采样 251 帧，检查有效数值、步骤边界、反复拖动的一致性、端帽编号、末段变化和投影缓存。

`check:end-labels` 检查不同视口、角度和进度下的标签重叠、越界及末段稳定性。可以指定一课：

```sh
npm run check:end-labels -- --course=plain-weave --report=/tmp/jiewu-end-labels.json
```

`check:bead-caps` 检查珠线端帽与珠体、线管及其他端帽的相交。默认检查步骤边界和末段关键进度；需要更密的采样时：

```sh
npm run check:bead-caps -- --samples=101 --report=/tmp/jiewu-bead-caps.json
```

这些是程序与离散几何检查。画面遮挡、操作是否顺手需要在浏览器里看，实际制作仍需拿材料试做。

每节新增课程都要检查全过程：动作是否成立、布线和穿压顺序是否正确、拐弯是否连续顺畅、收尾是否完整。收紧需单独看过渡及最终形态，不能用整体缩小掩盖穿模，也不能把教学展开状态当作成品。检查未通过的项目修正后重检，再更新验收状态；脚本通过不能代替这些判断。

绳结课在 `productionReviews.ts` 分开记录七项依据，通过后在 `reviewedVersions.ts` 保存已复核版本的指纹。指纹包含课程步骤和全程 251 帧模型数据；模型或说明变更会使 `check:knot-atlas` 拒绝沿用旧验收。更新指纹前必须重新检查实际改变的动作和画面，不能仅为了让脚本通过而重算。 指纹按固定字段顺序与六位小数编码，舍入中点先吸附微小计算噪声，忽略不同系统数学库产生的浮点末位差异；这只作用于验收摘要，不修改渲染或几何检查所用的原始坐标。摘要格式升级时，先验证所有旧指纹仍匹配原模型，再迁移已复核记录；新课仍须独立验收。算法回归运行 `node --test scripts/knot-review-fingerprint.test.mjs`。

等截面圆绳课程可运行 `node scripts/check-knot-geometry.mjs <课程 ID> --frames=1001`，检查完整主绳、独立线股之间的非邻段互穿、弯曲半径、总绳长变化及圆柱、环眼、可开合锁扣的实体碰撞。`--output=<路径>` 可保存逐课报告。该脚本是离散抽样检查，不检查结法含义或成品紧实度；珠孔、扁绳和变径绳会明确拒绝使用此检查器，须采用相应检查。几何算法回归使用 `node --test scripts/check-knot-geometry.test.mjs`。

新增来源映射后运行 `npm run export:knot-benchmark`，同步生成对照清单和课程别名索引，再运行 `npm run check:knot-atlas` 检查覆盖与引用。

编织新增课沿用上述七项动画复核，在 `src/weavingAtlas/productionReviews.ts` 记录依据，在 `reviewedVersions.ts` 保存当前课程步骤和251帧模型的指纹。运行 `npm run check:weaving-atlas` 检查类型、场景、目标与注册课程的一致性；模型改变后必须重新复核。用 `npm run export:weaving-curriculum` 更新目标与进度文档。原有编织课不会自动获得新一轮的验收状态。

带长备用线的课程可用 `framingBounds` 指定初始教学操作区，备用线仍保留在完整模型中；课堂的“适合画面”可以重新查看完整模型。`projectionBounds` 仅控制目录缩略图，两者独立。

珠串成品课在 `src/beadAtlas/productionReviews.ts` 逐课记录八项依据：过程、布线、穿孔、转折、收尾、收紧、成品和浏览器；`reviewedVersions.ts` 保存当前步骤和251帧模型指纹。`npm run check:bead-atlas` 检查实际目录、类型、原有课与新增课的验收状态，`npm run export:bead-curriculum` 导出课程清单。

`npm run check:bead-projects -- --frames=1001 --output=/tmp/bead-projects.json` 检查新增成品课的线管互穿、弯曲半径、真实珠孔与孔口、压管径向变形、珠体间距及扣环实体，并验证终点每颗珠均有完整穿孔。可用 `--ids=课程ID,课程ID` 检查指定课程。算法回归运行 `node --test scripts/bead-project-geometry.test.mjs`。实际端帽网格仍单独运行 `check:bead-caps`，离散抽样和脚本通过均不能替代逐课画面复核。

柔性钢丝课只逐段显示已穿入的线段，未显示的余线不计入模型；显示长度变化不是整根材料守恒的证明。线框课显示完整预成形金属线，珠子从自由端进入，最后折眼止脱。`LessonBead.radialScale` 用于压管的径向压缩，普通主体珠保持原尺寸，渲染、投影与穿孔检查须使用同一缩放。

## 更新模型数据

三门平结编织课和八股圆形组纽使用预生成的成品投影。改动模型、数据或投影算法后运行：

```sh
npm run generate:projections
npm run check:projections
```

第一条生成数据，第二条只检查与来源是否一致。`src/lessons/` 中其他基础技法课的成品投影按需计算并缓存。

这四门课的动作数据在打开课程时加载。三门平结编织课的收紧坐标使用无损压缩，首次加载时解码，拖动时插值。重新编码后可检查坐标是否一致：

```sh
node scripts/macrame-codec.mjs --input src/lessons/data --verify
```

把输入换成 `src/lessons/data/macrame-square.ts` 可以只查一课。原始坐标格式和替换命令在脚本文件头，替换数据后还需重新生成投影。

## 改动时留意

同一进度应得到相同的模型状态，不能依赖上一帧。收紧动画使用预设变化，没有求解真实张力、摩擦或线长守恒。

画布支持拖动旋转、右键平移和指向位置的滚轮缩放；双指可平移与缩放。聚焦后也可用方向键旋转、加减键缩放和 `0` 复位。调整交互时一起检查键盘操作、页面隐藏后暂停，以及减少动态效果的设置。

线端编号的数字对应绳线，A/B 对应两端。编号可以通过引线分开，但实体端帽必须跟随真实线端。

课程说明应写清演示做到哪一步，尤其是样片、未收尾的主体和结构认知课。涉及承重、攀岩或救援时，要保留相关限制。

## 自动发布

网站托管在 [GitHub Pages](https://fangzhisan.github.io/jiewu-knot-studio/)。推送 `main` 或在 Actions 中手动运行“检查并发布网站”，会安装锁定依赖，检查格式、几何算法、课程目录、模型指纹、课程数据、端号与珠线端帽，再构建和发布。检查失败时不进入部署。

工作流使用 Node.js 22.21.1，发布目录是 `dist/`，从 Pages 读取站点子路径并传给 Vite 的 `--base`；本地开发仍使用根路径。课程地址采用哈希路由，可以直接打开或刷新课程链接。构建产物由 Actions 上传，不提交进源码仓库。发布使用 GitHub 提供的短期令牌，不需要在仓库中保存个人访问令牌。

本地检查 Pages 子路径构建：

```sh
npm run build -- --base=/jiewu-knot-studio/
npx vite preview --base=/jiewu-knot-studio/ --host 127.0.0.1 --port 5188 --strictPort
```

打开 `http://127.0.0.1:5188/jiewu-knot-studio/`，核对目录、三维课和重型课程的按需数据加载。之后可用普通 `npm run build` 恢复根路径构建。
