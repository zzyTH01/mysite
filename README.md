# 高瞻远瞩 · 个人网站

一个使用 Astro、Markdown 和 Tailwind CSS 构建的静态个人网站，主色为红色、白色和黑色。

## 本地命令

```bash
npm install
npm run dev        # 本地开发，默认地址通常是 http://localhost:4321
npm run build      # 生成静态站点到 dist/
npm run preview    # 预览生产构建
npm run check      # Astro 与 TypeScript 检查
npm test           # 运行 Vitest
npm run verify:static # 检查必需页面、草稿过滤、本地链接和下载文件
npm run verify     # 运行测试、检查、构建和静态验收
```

## 网站结构

- 首页：身份、关键词、最新内容和生活记录。
- `/about/`：个人介绍、经历、项目、兴趣、联系方式和简历下载。
- `/blog/`：较长文章。
- `/notes/`：短观点。
- `/life/`：生活记录时间线。
- `/resources/`：简历、模板和其他可分享资源。

## 添加博客

在 `src/content/blog/` 创建 Markdown 文件：

```markdown
---
title: 文章标题
description: 一两句摘要。
date: 2026-10-10
tags:
  - 摄影
draft: false
---

正文从这里开始。
```

`draft: true` 的文章不会出现在生产构建。

## 添加观点

在 `src/content/notes/` 创建：

```markdown
---
title: 观点标题
date: 2026-10-10
tags:
  - Vibe
draft: false
---

写清楚这条观点即可。
```

## 添加生活记录

在 `src/content/life/` 创建：

```markdown
---
title: 一次城市骑行
date: 2026-10-10
summary: 一句话说明这次记录。
location: 城市滨江
tags:
  - 骑行
  - 摄影
photos:
  - /images/life/night-ride.svg
draft: false
---

正文可以补充路线、感受和照片背后的故事。
```

照片放在 `public/images/life/`，frontmatter 中使用以 `/` 开头的公开路径。

## 添加资源

修改 `src/data/resources.ts`。本地文件放在 `public/downloads/`，链接示例：

```ts
{
  title: "示例文件",
  description: "说明这个资源适合谁使用。",
  category: "模板",
  tags: ["清单"],
  date: "2026-10-10",
  type: "file",
  href: "/downloads/example.txt",
}
```

## 替换简历

把正式简历导出为 PDF，替换：

```text
public/downloads/gaozhangyuanzhu-resume.pdf
```

保持文件名不变时，网站中的下载按钮不需要修改。如果改名，同步更新 `src/data/resources.ts` 和 `src/pages/about.astro`。

## 部署到 Vercel

1. 在 GitHub 创建空仓库。
2. 在项目目录执行：

```bash
git remote add origin git@github.com:<your-username>/<your-repo>.git
git push -u origin main
```

3. 打开 Vercel，选择 Add New Project，导入这个 GitHub 仓库。
4. Framework Preset 选择 Astro。
5. Build Command 使用 `npm run build`，Output Directory 使用 `dist`。
6. 部署完成后使用 Vercel 提供的域名访问。
7. 如需使用自己的域名，在 Vercel 的 Domains 设置中绑定。

## 部署到 GitHub Pages

1. 将项目推送到 GitHub 仓库。
2. 在仓库的 Settings > Pages 中选择 GitHub Actions。
3. 添加 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v2

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

4. 如果仓库名不是用户主页仓库，需要修改 `astro.config.mjs`：

```js
export default defineConfig({
  site: "https://<your-username>.github.io",
  base: "/<your-repo>",
});
```

5. 推送后等待 GitHub Actions 完成。
