# 视频号半个月复盘 · Remotion 16:9 知识动画工程

## 目录结构
- `00_原始心得与续作上下文.md`：创作背景、原始口述心得、实测数据红线、V1→V2 迭代记录与**换机器一键续作指南 / AI 交接提示词**
- `01_文案定稿_V2.md`：口语化定稿口播脚本（37 句）
- `02_分镜动效脚本.md`：6 个镜头的视觉布局与动效规划
- `docs/previews/`：V2 版本 6 幕核心关键帧预览图（`scene01.png` ~ `scene06.png`）
- `src/data/scriptLines.json`：文案与 `86` 个 `subCues` 驱动配置（修改文字或分段后重新生成音频与时间轴即可自动同步）
- `src/data/timeline.json`：自动生成的时间轴、句级与词级（WordBoundary）帧号索引
- `src/components/`：可复用的暖纸 Bento 风格组件库（暖纸纹理背景、顶部步骤胶囊、Bento 多变体卡片、`StampSlam`/`HighlightSweep` 动效、四态 AI 吉祥物、胶囊字幕）
- `src/scenes/`：6 个独立动画分镜场景
- `public/assets/cards/`：从历史图文项目引入的真实手绘卡片案例
- `public/audio/narration.mp3`：旁白配音音轨（当前为 `edge-tts` 预览版）

## 常用命令
1. **实时预览与逐帧调试**（在浏览器打开 Remotion Studio）：
   ```bash
   npm run dev
   ```
2. **生成本地预览配音（edge-tts）与对齐时间轴**：
   ```bash
   npm run tts:preview
   ```
3. **导出 1080p MP4 成片**：
   ```bash
   npm run build
   ```
   输出路径：`out/视频号半个月复盘_成片.mp4`

## 接入火山引擎（豆包）语音合成
请勿将 API Key 写入任何代码文件。可在项目根目录创建 `.env`（已被 `.gitignore` 忽略），填入：
```env
DOUBAO_TTS_API_KEY=你的语音API_Key
DOUBAO_SPEAKER_ID=你的音色ID
DOUBAO_RESOURCE_ID=seed-tts-2.0
```
再运行 `npm run tts:volc`（或提供最终录音 MP3 同步生成新 `timeline.json`）。
