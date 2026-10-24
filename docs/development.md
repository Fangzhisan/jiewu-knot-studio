# 开发说明

在项目根目录运行 `npm ci` 和 `npm run dev`。建议 Node.js 22.21.1，开发与预览都使用 `127.0.0.1:5187`。

## 文件放在哪儿

- `src/App.vue`：页面导航，以及从技法课返回攻略原步骤。
- `src/Classroom.vue`：课程选择、进度和播放控制。
- `src/scene.ts`、`src/cordEnds.ts`：模型渲染与线端编号。
- `src/lessons/`：三维课程的几何、时间轴、材料和参考来源，入口是 `catalog.ts`。
- `src/guides/`：基础补课和制作攻略。
- `src/library.ts`、`src/courseScenarios.ts`：目录、搜索与用途分类。
- `src/components/`：目录、攻略、缩略图、结构示意和播放控件。
- `src/practice.ts`：学习过程中的页面状态。

攻略通过 ID 关联技法。增加课程时，需要同时检查材料、准备、步骤、完成检查、常见问题和参考来源；检查脚本中的课程数量也要相应更新。

## 检查命令

```sh
npm run build
npm run check:courses
npm run check:end-labels
npm run check:bead-caps
```

`npm run build` 会运行配置中的构建前检查、执行 TypeScript 检查，并输出 `dist/`。具体检查项见 `package.json` 的 `scripts`；运行 `npm run` 可以列出当前可用的命令。只改攻略时，可以先运行 `npm run check:guides`，检查字段、课程关联、场景和搜索。

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

画布支持鼠标和触摸，也支持聚焦后的方向键旋转、加减键缩放和 `0` 复位。调整交互时一起检查键盘操作、页面隐藏后暂停，以及减少动态效果的设置。

线端编号的数字对应绳线，A/B 对应两端。编号可以通过引线分开，但实体端帽必须跟随真实线端。

课程说明应写清演示做到哪一步，尤其是样片、未收尾的主体和结构认知课。涉及承重、攀岩或救援时，要保留相关限制。
