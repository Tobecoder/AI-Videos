# 《做了半个月视频号，15.9 万播放只赚 5 块 04》制作思路与上下文归档

这是一份用 Remotion 制作 16:9 横屏知识复盘动画（`1920 × 1080`，`30 fps`，共 `281.55s / 8446 帧`）的完整制作工程、脚本迭代与换机续作记录。项目将作者半个月视频号实战的真实后端数据、运营心得、3 条图文故事案例与多样化信息图表动效结合，用于复盘「AI 图文故事号」的 ROI 并转向知识分享动画赛道。

- [原始心得与换机续作上下文（换机器必看）](./shipinhao-halfmonth-review/00_原始心得与续作上下文.md)
- [口播文案定稿 V2（37 句）](./shipinhao-halfmonth-review/01_文案定稿_V2.md)
- [逐镜分镜与动效规划](./shipinhao-halfmonth-review/02_分镜动效脚本.md)
- [6 幕 V2 关键帧预览图](./shipinhao-halfmonth-review/docs/previews/)
- [项目源码与运行说明](./shipinhao-halfmonth-review/README.md)

## 当前完成情况

- **已完成**：
  - 口语化口播文案定稿（全片按平台规则剔除外部平台名称，统一使用「其他平台」）；
  - 6 幕 Remotion 16:9 完整工程（暖米白宣纸质感 Bento 卡片 + 顶部 5 步导航胶囊 + 底部深炭黑字幕胶囊 + 四态 AI 机器人吉祥物）；
  - 基于 `edge-tts` `WordBoundary` 的词句级时间轴精算脚本，对齐 `86` 个 `subCues`，保证**具体元素只在对应口播词句到达后才触发显现**；
  - 多样化动效体系（6 向 / 3D 翻卡 `BentoCard`、`StampSlam` 盖章冲击波、`HighlightSweep` 荧光笔、SVG 指数曲线+光点轨迹、天平倾斜物理动效）；
  - 引入 3 条真实作品卡片图（`card_changtu.png`、`card_shien.png`、`card_daoqian.png`）并完成编译与关键帧抽帧验证。
- **待继续（换机器后续作）**：
  1. 配置本地 `.env` 后运行 [`generate_volcengine_tts.py`](./shipinhao-halfmonth-review/scripts/generate_volcengine_tts.py) 替换为火山引擎正式配音；
  2. 可选将脱敏后的视频号后台数据与收益截图接入第 1 / 3 / 5 节预留槽位；
  3. 审片微调后运行 `npm run build` 导出 `1080p MP4` 成片。
