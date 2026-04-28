# 法域之城：雨夜证词 V2

这是一个可直接部署到 GitHub Pages 的静态网页游戏 Demo。无需后端，无需 npm，无需构建。

## V2 新增内容

- 增加律所办公室场景
- 增加证据组合推理系统
- 增加地点解锁条件
- 增加案件笔记
- 增加 12 条证据
- 增加 3 条组合推理
- 优化多结局判定
- 增加继续存档
- 增加更接近“调查游戏大屏 UI”的视觉密度

## 文件结构

- `index.html`：游戏入口
- `style.css`：视觉和响应式布局
- `game.js`：剧情、证据、分支、组合推理、结局逻辑
- `assets/`：SVG 场景和角色素材

## 本地预览

直接双击 `index.html` 即可运行。

也可以用本地服务器：

```bash
python -m http.server 8000
```

打开：

```text
http://localhost:8000
```

## 部署到 GitHub Pages

1. 新建 GitHub 仓库，例如 `law-city-game`
2. 解压本 zip
3. 上传解压后的全部文件到仓库根目录
4. 打开 Settings → Pages
5. Source 选择 `Deploy from a branch`
6. Branch 选择 `main`，目录选择 `/root`
7. 保存后等待 GitHub 生成网址

## 可继续升级方向

你可以继续让我做：

- V3：章节系统和第二个案件
- V4：更像参考图的大地图 UI
- V5：把 SVG 占位图替换为更电影感的 AI 图片素材提示词包
- V6：加入音乐、点击音效、成就、结算评分
- V7：改造成 React / Vite 项目
