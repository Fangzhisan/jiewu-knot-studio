# 结物 🪢

一个学绳结、编织和串珠的小站。

[在线体验](https://fangzhisan.github.io/jiewu-knot-studio/) · [自动构建与发布](https://github.com/Fangzhisan/jiewu-knot-studio/actions/workflows/pages.yml)

有些结，转到背面看一眼，比对着平面图猜半天省事。这里可以旋转模型、拖动进度，也能把动作放慢，看看那根线到底从哪儿穿过去了。

## 怎么玩

课程分为绳结、编织和珠串，可以按分类、材料和用途查找。原有43节三维基础课继续保留，绳结课程正按 [Knots 3D 对照清单](docs/knots3d-benchmark.md) 逐项补齐；编织扩展到网具、首饰编绳和图案组织，按[编织课程目标](docs/weaving-curriculum.md)继续制作。珠串现有40节三维课，增加整件项链、手链、成对耳饰和珠串挂饰，可按成品类型筛选，详见[珠串课程清单](docs/bead-curriculum.md)。清单分别记录可播放课程、已复核课程和待制作项目。

按课程步骤查看三维演示和文字说明，也可以用课堂侧栏快速换课，或返回目录继续筛选。本站没有收藏和学习记录存储，页面刷新后临时播放状态会重置。

## 本地运行

用 Vue 3、TypeScript、Three.js 和 Vite 写的纯前端项目。建议 Node.js 22.21.1。

```sh
git clone https://github.com/Fangzhisan/jiewu-knot-studio.git
cd jiewu-knot-studio
npm ci
npm run dev
```

打开 [localhost:5187](http://127.0.0.1:5187)。不用账号，也不用配数据库。端口被占用时，先关掉之前的开发进程。

```sh
npm run build    # 打包到 dist/
npm run preview  # 本地预览，先停掉开发服务器
```

`dist/` 可以放到静态网站托管服务上。开发相关的文件和检查命令见 [开发说明](docs/development.md)。

## 使用说明

模型按预设步骤演示穿绕和收紧，没有计算真实绳线的摩擦、张力或承载力。有些课只做到样片或主体，收尾范围会在课内说明。材料用量和制作时间也需要根据实际试做调整。

**不要用这里的演示指导承重、攀岩、登山或救援操作。** 这类内容仅用于理解结构，课程还没有完成手工教师和真实学习者的实物验收。

## 有问题就提

绳路画错了、步骤看不懂，或者手机上哪个按钮跑偏了，都欢迎提 Issue。附上课程名、步骤或进度，以及截图或复现方法就好。工艺上的问题尤其欢迎指正，别让一根画错的线把大家带沟里。

PR 也欢迎。改模型后记得跑相关检查，细节在开发说明里。

## License

[MIT](LICENSE) © 2026 Fangzhisan

课程里的参考链接可以继续往下看。模型和示意图由程序生成；第三方依赖、外部教程中的图片、视频和模型遵循各自的许可。花形串珠的实现另有 [来源与几何说明](src/lessons/sources.md)。
