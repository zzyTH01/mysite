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
- `/about/`：真实身份、教育方向、公开项目、活动、兴趣、联系方式和简历下载。
- `/blog/`：较长文章。当前保持空态，后续把 Markdown 文件中的 `draft` 改为 `false` 即可发布。
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

`draft: true` 的文章不会出现在生产构建。当前所有博客示例都保持 `draft: true`，因此线上博客列表为空。

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

## 发布到 GitHub Pages

这个项目已经配置为部署到当前仓库：

```text
https://github.com/zzyTH01/mysite
https://zzyth01.github.io/mysite/
```

部署配置位于 `.github/workflows/deploy.yml`。每次把 `main` 分支推送到 GitHub 后，Actions 会自动执行：

```bash
npm ci
npm run verify
```

验证和构建通过后，会把 `dist/` 发布到 GitHub Pages。

首次部署时，GitHub Actions 中的 Configure GitHub Pages 步骤会尝试启用 Pages。如果仓库设置页面显示 Pages source 不是 GitHub Actions，手动打开：

```text
GitHub 仓库 > Settings > Pages > Build and deployment > Source > GitHub Actions
```

然后回到 Actions 页面重新运行 `Deploy to GitHub Pages`。

本地检查远端状态：

```bash
git remote -v
git status
git log --oneline -5
```
