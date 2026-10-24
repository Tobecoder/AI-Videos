# 924 行情：从赚 1 万到亏 5 万

Remotion 竖屏短片项目，使用逐句配音驱动时间轴，并用台词 ID 触发画面与音效。

- [制作思路与完整流程](../stock-924-video.md)
- [开场 MP4](./out/preview-hook.mp4)
- [开场关键帧](./out/)

## 当前状态

已完成开场画面、9 幕 39 句配音、音乐音效库、字幕和全片串联框架。其余 8 幕仍为“制作中”占位。`Preview` 约 14.83 秒；`Stock924` 按当前时间轴约 2 分 54 秒，尚不是完整成片。

画幅 1080×1920，30 FPS。当前附带源码、锁文件、全部配音、3 首 BGM、12 个音效和开场预览产物。

## 安装

在本目录运行。Node.js 版本要求见 `package.json`；Python 脚本依赖见 `requirements.txt`。

```sh
npm ci
python -m pip install -r requirements.txt
```

已有音频和时间轴可直接用于预览，无需先重新合成。重新生成语音需要联网访问 edge-tts 服务。

## 预览

```sh
npm run dev -- --no-open
```

打开终端显示的 Studio 地址，选择 `Preview` 查看开场。`Stock924` 包含全部场景及未完成的占位画面。

## 修改与生成

```sh
# 修改 src/data/narration.json 后，增量更新配音和时间轴
npm run tts

# 需要时重新生成音乐和音效
npm run audio

# TypeScript 检查
npm run lint

# 导出开场
npx remotion render src/index.ts Preview out/preview-hook.mp4

# 导出全片入口；目前会包含未完成的占位场景
npm run render
```

文案使用 `text` 显示字幕，使用可选 `say` 修正配音读法。动画在 `src/scenes/` 编写，通过 `cues(sceneId).at(lineId)` 等方法对齐台词。新增场景后，还需在 `src/Video.tsx` 的 `SCENES` 中登记画面组件。

## 文件说明

| 路径 | 内容 |
| --- | --- |
| `src/data/narration.json` | 文案、台词 ID、音色和语速。 |
| `scripts/tts.py` | 增量合成配音，测量音频长度，生成时间轴。 |
| `src/data/timeline.json` | 已生成的逐句时间轴。 |
| `scripts/gen_audio.py` | 程序合成音乐与音效。 |
| `src/lib/timeline.ts` | 台词锚点、帧率和场景长度。 |
| `src/scenes/HookScene.tsx` | 已完成的开场动画。 |
| `src/components/` | 字幕、曲线、背景、行情条与音效组件。 |
| `src/Video.tsx` | 场景、配音、音乐与字幕总装。 |
| `public/vo/`、`public/audio/` | 配音、音乐和音效文件。 |
| `out/` | 已有开场视频与关键帧截图。 |

原项目代码与音视频文件按原样归档；新增运行说明、Python 依赖清单和忽略规则，未重新制作或渲染视频。
