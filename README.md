# 灵魂拷问 · 微信扫码互动问答

手机扫码打开网页，答"是/否"走不同分支，最终显示一张图片。

## 文件说明

| 文件 | 作用 |
|---|---|
| `index.html` | 页面入口 |
| `style.css` | 样式（卡片 + 大"是"按钮 + 小"否"按钮） |
| `app.js` | 交互逻辑（读取 JSON，按分支跳转） |
| `questions.json` | **问题树数据，改这里即可增删问题** |
| `images/` | 放结尾图片（end1.png、end2.png…） |

## 如何改问题

打开 `questions.json`，每个问题是一个节点：

```json
"q1": {
  "text": "问题文字",
  "yes": "下一个节点ID",
  "no": "下一个节点ID"
}
```

叶子节点（最终结果）长这样，`image` 指向图片文件：

```json
"end1": {
  "type": "end",
  "image": "images/end1.png",
  "text": "结尾显示的文字"
}
```

增删问题：在 `nodes` 里加节点、改 `yes`/`no` 的指向即可。开头节点由 `start` 指定。

## 如何部署（GitHub Pages）

1. 在 GitHub 网页上新建一个 **public** 仓库（如 `quiz-tree`）
2. 把本项目所有文件上传到仓库（网页端 Upload files 即可，不用 git 命令）
3. 进入仓库 Settings → Pages → Source 选 **Deploy from a branch** → Branch 选 `main` → Save
4. 等 1~2 分钟，访问 `https://你的用户名.github.io/quiz-tree/`
5. 用二维码工具把该网址生成二维码，发到微信即可

## 本地预览

双击 `index.html` 无法加载数据（浏览器限制），需起本地服务：

```bash
python -m http.server 8000
```

然后浏览器打开 `http://localhost:8000`