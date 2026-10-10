# 高瞻远瞩个人网站实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个红白黑主色调、Markdown 驱动、可公开部署的学生个人网站。

**Architecture:** 使用 Astro 生成静态页面；博客、观点和生活记录由 Content Collections 读取 Markdown；样式使用 Tailwind CSS；简历与资源下载由 `public/` 提供。所有列表页读取集合数据，详情页通过 `getStaticPaths()` 生成。

**Tech Stack:** Astro、TypeScript、Tailwind CSS、Markdown、Vitest、Node 静态构建校验脚本。

**Spec:** `docs/superpowers/specs/2026-10-10-gaozhangyuanzhu-personal-website-design.md`

## Global Constraints

- 主红色必须是 `#E10600`；深黑色必须是 `#0A0A0A`；纯白色必须是 `#FFFFFF`。
- 辅助灰只允许 `#6B7280` 与 `#E5E7EB` 用于弱化信息、分隔线和边框。
- 不引入紫色、青色或其他主要装饰色。
- 深色模式：黑色背景 + 白色正文 + 红色强调。
- 浅色模式：白色背景 + 黑色正文 + 红色强调。
- 内容集合为 `blog`、`notes`、`life`。
- 生产构建必须排除 `draft: true` 的集合条目。
- 初始内容至少包含 3 篇博客、3 条观点、3 条生活记录、2 个资源。
- 网站页面至少包含首页、关于、博客、观点、生活、资源下载和 404。
- 所有内部链接必须指向真实构建产物；外部链接必须使用 `target="_blank"` 与 `rel="noopener noreferrer"`。
- `npm run test`、`npm run build`、`npm run verify:static` 必须全部通过。

## Review Focus

- 内部死链：删除页面或改名后，`scripts/verify-dist.mjs` 应读取 `dist/**/*.html` 并检查本地 `href` / `src` 是否存在。
- 草稿泄漏：`draft: true` 文章不应出现在生产构建列表或生成详情页，`tests/content.test.ts` 与 `verify-dist.mjs` 检查该行为。
- 无资源状态：资源集合中没有可用资源时，`/resources/` 必须渲染空状态，`tests/resources.test.ts` 检查该函数结果。
- 移动导航溢出：窄屏下导航折叠，`src/components/MobileNav.astro` 的按钮与 `site-nav` 联动；构建后需检查按钮和菜单存在。
- 对比度：正文必须避免灰色弱化到不可读，`global.css` 定义正文颜色并禁止正文使用辅助灰。

---

### Task 1: 建立项目基础与设计令牌

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/lib/design-tokens.ts`
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`
- Test: `tests/design-tokens.test.ts`

**Interfaces:**
- Produces: `colors` 常量，字段为 `red`、`black`、`white`、`gray`、`lightGray`。
- Produces: npm scripts `test`、`build`、`verify:static`、`check`。

- [ ] **Step 1: 写失败测试**

Create `tests/design-tokens.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { colors } from "../src/lib/design-tokens";

describe("design tokens", () => {
  it("uses the approved red, black, and white palette", () => {
    expect(colors).toEqual({
      red: "#E10600",
      black: "#0A0A0A",
      white: "#FFFFFF",
      gray: "#6B7280",
      lightGray: "#E5E7EB",
    });
  });
});
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm test -- tests/design-tokens.test.ts`  
Expected: FAIL，因为 `src/lib/design-tokens.ts` 不存在。

- [ ] **Step 3: 添加项目文件与实现**

Create `package.json` with scripts and dependencies:

```json
{
  "name": "gaozhangyuanzhu-personal-site",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "verify:static": "node scripts/verify-dist.mjs"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "astro": "^5.0.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.5.0",
    "vitest": "^2.1.0"
  }
}
```

Create `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://gaozhangyuanzhu.vercel.app",
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*", "tests/**/*"],
  "exclude": ["dist"]
}
```

Create `src/lib/design-tokens.ts`:

```ts
export const colors = {
  red: "#E10600",
  black: "#0A0A0A",
  white: "#FFFFFF",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
} as const;
```

Create `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-brand: #e10600;
  --color-ink: #0a0a0a;
  --color-paper: #ffffff;
  --color-muted: #6b7280;
  --color-line: #e5e7eb;
}

:root {
  color-scheme: dark;
}

body {
  background-color: var(--color-ink);
  color: var(--color-paper);
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

html.light {
  color-scheme: light;
}

html.light body {
  background-color: var(--color-paper);
  color: var(--color-ink);
}

a,
button {
  outline-color: var(--color-brand);
}

:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 3px;
}
```

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="高瞻远瞩">
  <rect width="64" height="64" rx="14" fill="#0A0A0A"/>
  <path d="M12 45 34 18h18L30 45Z" fill="#E10600"/>
  <circle cx="22" cy="20" r="5" fill="#FFFFFF"/>
</svg>
```

- [ ] **Step 4: 安装依赖并运行测试**

Run: `npm install && npm test -- tests/design-tokens.test.ts`  
Expected: PASS，并生成 `package-lock.json`。

- [ ] **Step 5: 初始化 Git 并提交**

```bash
git init
git add package.json package-lock.json astro.config.mjs tsconfig.json src/lib/design-tokens.ts src/styles/global.css public/favicon.svg tests/design-tokens.test.ts
git commit -m "feat: set up Astro project and design tokens"
```

---

### Task 2: 站点配置、基础布局与导航

**Files:**
- Create: `src/config/site.ts`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/BaseHeader.astro`
- Create: `src/components/BaseFooter.astro`
- Create: `src/components/ThemeToggle.astro`
- Create: `src/components/SectionTitle.astro`
- Create: `src/pages/index.astro`
- Test: `tests/site-config.test.ts`

**Interfaces:**
- Produces: `siteConfig`，包含 `id`、`role`、`tagline`、`keywords`、`email`、`social`。
- Produces: `navItems`，每项类型为 `{ label: string; href: string }`。
- Consumes: `src/styles/global.css` 中的 Tailwind 主题令牌。

- [ ] **Step 1: 写失败测试**

Create `tests/site-config.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { navItems, siteConfig } from "../src/config/site";

describe("site config", () => {
  it("identifies the site owner and keywords", () => {
    expect(siteConfig.id).toBe("高瞻远瞩");
    expect(siteConfig.role).toBe("学生");
    expect(siteConfig.keywords).toEqual([
      "二次元",
      "赛车",
      "摄影",
      "骑行",
      "音乐",
      "Vibe",
    ]);
  });

  it("exposes one navigation entry for every required section", () => {
    expect(navItems.map((item) => item.href)).toEqual([
      "/",
      "/about/",
      "/blog/",
      "/notes/",
      "/life/",
      "/resources/",
    ]);
  });
});
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm test -- tests/site-config.test.ts`  
Expected: FAIL，因为 `src/config/site.ts` 不存在。

- [ ] **Step 3: 实现配置与布局**

Create `src/config/site.ts`:

```ts
export type NavItem = { label: string; href: string };

export const siteConfig = {
  id: "高瞻远瞩",
  role: "学生",
  tagline: "看得更远，活得更有 Vibe。",
  description:
    "高瞻远瞩的个人网站：学生、二次元爱好者、赛车关注者、摄影与骑行爱好者，记录观点、博客和生活。",
  keywords: ["二次元", "赛车", "摄影", "骑行", "音乐", "Vibe"],
  email: "hello@gaozhangyuanzhu.example",
  social: [
    { label: "邮箱", href: "mailto:hello@gaozhangyuanzhu.example", external: false },
    { label: "GitHub", href: "https://github.com/", external: true },
    { label: "Bilibili", href: "https://www.bilibili.com/", external: true },
    { label: "小红书", href: "https://www.xiaohongshu.com/", external: true },
  ],
} as const;

export const navItems: NavItem[] = [
  { label: "首页", href: "/" },
  { label: "关于", href: "/about/" },
  { label: "博客", href: "/blog/" },
  { label: "观点", href: "/notes/" },
  { label: "生活", href: "/life/" },
  { label: "资源", href: "/resources/" },
];
```

Create `src/layouts/BaseLayout.astro`:

```astro
---
import "../styles/global.css";
import BaseHeader from "../components/BaseHeader.astro";
import BaseFooter from "../components/BaseFooter.astro";

interface Props {
  title: string;
  description?: string;
}

const { title, description = "高瞻远瞩的个人网站。" } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="zh-CN" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="author" content="高瞻远瞩" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={new URL("/og/default.png", Astro.site)} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={canonical} />
  </head>
  <body class="min-h-screen bg-ink text-paper antialiased">
    <a class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-white" href="#main">跳到主要内容</a>
    <BaseHeader />
    <main id="main">
      <slot />
    </main>
    <BaseFooter />
    <script is:inline>
      const root = document.documentElement;
      const saved = localStorage.getItem("theme");
      if (saved === "light") root.classList.replace("dark", "light");
      document.addEventListener("click", (event) => {
        const target = event.target.closest("[data-theme-toggle]");
        if (!target) return;
        root.classList.toggle("dark");
        root.classList.toggle("light");
        localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "light");
      });
    </script>
  </body>
</html>
```

Create `src/components/BaseHeader.astro` with desktop navigation, mobile menu, and a theme toggle. It must render all six `navItems`, use `aria-current` for the active page, and label the mobile button with `aria-expanded` and `aria-controls="site-nav"`.

Create `src/components/BaseFooter.astro` with the ID, role, email, social links, keywords, and copyright. External links must include `target="_blank" rel="noopener noreferrer"`.

Create `src/components/ThemeToggle.astro` as a `button type="button" data-theme-toggle` labeled “切换深浅模式”.

Create `src/components/SectionTitle.astro` with props `title` and optional `subtitle`, using a red accent bar and semantic `h2`.

Create `src/pages/index.astro` as a temporary hero page:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { siteConfig } from "../config/site";
---

<BaseLayout title={`${siteConfig.id} · ${siteConfig.role}`} description={siteConfig.description}>
  <section class="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 py-16">
    <p class="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-brand">{siteConfig.role}</p>
    <h1 class="text-5xl font-black md:text-7xl">{siteConfig.id}</h1>
    <p class="mt-6 max-w-2xl text-lg text-paper/80">{siteConfig.tagline}</p>
  </section>
</BaseLayout>
```

- [ ] **Step 4: 运行测试与构建**

Run: `npm test -- tests/site-config.test.ts && npm run build`  
Expected: 测试 PASS；`dist/index.html` 生成成功。

- [ ] **Step 5: 提交**

```bash
git add src/config/site.ts src/layouts/BaseLayout.astro src/components src/pages/index.astro tests/site-config.test.ts
git commit -m "feat: add base layout and navigation"
```

---

### Task 3: 内容模型与初始内容

**Files:**
- Create: `src/content.config.ts`
- Create: `src/lib/content.ts`
- Create: `src/content/blog/first-race-weekend.md`
- Create: `src/content/blog/photography-light-notes.md`
- Create: `src/content/blog/cycling-city-observation.md`
- Create: `src/content/notes/anime-and-personal-taste.md`
- Create: `src/content/notes/study-with-vibe.md`
- Create: `src/content/notes/slow-down-shoot-more.md`
- Create: `src/content/life/night-ride.md`
- Create: `src/content/life/anime-weekend.md`
- Create: `src/content/life/music-photowalk.md`
- Create: `tests/content.test.ts`

**Interfaces:**
- Produces: `blogSchema`, `noteSchema`, `lifeSchema`。
- Produces: `visibleEntries<T extends { data: { draft?: boolean } }>(entries: T[], production: boolean): T[]`。
- Produces: `sort_by_date_desc<T extends { data: { date: Date } }>(entries: T[]): T[]`。
- Produces: `format_date(date: Date): string`。

- [ ] **Step 1: 写失败测试**

Create `tests/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { blogSchema, format_date, noteSchema, lifeSchema, sort_by_date_desc, visibleEntries } from "../src/lib/content";

describe("content helpers", () => {
  it("accepts required blog frontmatter", () => {
    const result = blogSchema.safeParse({
      title: "第一场赛车周末",
      description: "记录一次比赛观察。",
      date: new Date("2026-10-04T00:00:00Z"),
      tags: ["赛车"],
      draft: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects blog posts without description", () => {
    const result = blogSchema.safeParse({ title: "缺摘要", date: new Date() });
    expect(result.success).toBe(false);
  });

  it("accepts life entries with photos", () => {
    const result = lifeSchema.safeParse({
      title: "夜骑",
      date: new Date("2026-10-08T00:00:00Z"),
      summary: "沿江夜骑。",
      photos: ["/images/life/night-ride.svg"],
    });
    expect(result.success).toBe(true);
  });

  it("filters drafts only in production", () => {
    const entries = [{ data: { draft: true } }, { data: { draft: false } }];
    expect(visibleEntries(entries, false)).toHaveLength(2);
    expect(visibleEntries(entries, true)).toHaveLength(1);
  });

  it("sorts by descending date", () => {
    const entries = [
      { data: { date: new Date("2026-01-01T00:00:00Z") } },
      { data: { date: new Date("2026-10-01T00:00:00Z") } },
    ];
    expect(sort_by_date_desc(entries as any)[0].data.date.getUTCFullYear()).toBe(2026);
  });

  it("formats dates in Chinese", () => {
    expect(format_date(new Date("2026-10-04T00:00:00Z"))).toBe("2026年10月4日");
  });
});
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm test -- tests/content.test.ts`  
Expected: FAIL，因为内容模型和工具函数不存在。

- [ ] **Step 3: 实现 Content Collections**

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const life = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/life" }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    summary: z.string().min(1),
    location: z.string().optional(),
    tags: z.array(z.string()).default([]),
    photos: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, notes, life };
```

Create `src/lib/content.ts` with the schema exports, filters, sorting, and formatting:

```ts
import { z } from "astro:content";

export const blogSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  draft: z.boolean().default(false),
});

export const noteSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export const lifeSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  summary: z.string().min(1),
  location: z.string().optional(),
  tags: z.array(z.string()).default([]),
  photos: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

type Dated = { data: { date: Date } };
type Draftable = { data: { draft?: boolean } };

export function visible_entries<T extends Draftable>(entries: T[], production: boolean): T[] {
  return production ? entries.filter(({ data }) => !data.draft) : entries;
}

export const visibleEntries = visible_entries;

export function sort_by_date_desc<T extends Dated>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function format_date(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
```

- [ ] **Step 4: 添加至少三条初始内容**

博客必须包含：

1. `first-race-weekend.md`：标签 `赛车`、`观察`，日期 `2026-10-04`。
2. `photography-light-notes.md`：标签 `摄影`、`光线`，日期 `2026-09-20`。
3. `cycling-city-observation.md`：标签 `骑行`、`城市`，日期 `2026-09-08`。

观点必须包含：

1. `anime-and-personal-taste.md`：标签 `二次元`，日期 `2026-10-06`。
2. `study-with-vibe.md`：标签 `学习`、`Vibe`，日期 `2026-09-25`。
3. `slow-down-shoot-more.md`：标签 `摄影`，日期 `2026-09-12`。

生活记录必须包含：

1. `night-ride.md`：地点 `城市滨江`，标签 `骑行`、`夜晚`，日期 `2026-10-08`。
2. `anime-weekend.md`：地点 `家`，标签 `二次元`、`周末`，日期 `2026-09-28`。
3. `music-photowalk.md`：地点 `老城区`，标签 `音乐`、`摄影`，日期 `2026-09-15`。

每个文件都要有符合对应 schema 的 frontmatter 和至少两段真实可读的中文正文，不用 lorem ipsum。`photography-light-notes.md` 设置 `draft: true`，用于验证生产构建过滤。

- [ ] **Step 5: 运行测试和构建**

Run: `npm test -- tests/content.test.ts && npm run build`  
Expected: PASS；Astro 构建成功；生产构建不会为 `photography-light-notes` 输出详情页。

- [ ] **Step 6: 提交**

```bash
git add src/content.config.ts src/lib/content.ts src/content tests/content.test.ts
git commit -m "feat: add content collections and starter writing"
```

---

### Task 4: 博客、观点与生活页面

**Files:**
- Create: `src/components/PostCard.astro`
- Create: `src/components/LifeCard.astro`
- Create: `src/components/TagList.astro`
- Create: `src/layouts/PostLayout.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`
- Create: `src/pages/notes/index.astro`
- Create: `src/pages/notes/[slug].astro`
- Create: `src/pages/life/index.astro`
- Create: `src/pages/life/[slug].astro`

**Interfaces:**
- Consumes: `getCollection`、`render`、`visibleEntries`、`sort_by_date_desc`、`format_date`。
- Produces: `/blog/`、`/blog/first-race-weekend/`、`/blog/cycling-city-observation/`、`/notes/`、`/notes/anime-and-personal-taste/`、`/notes/study-with-vibe/`、`/notes/slow-down-shoot-more/`、`/life/`、`/life/night-ride/`、`/life/anime-weekend/`、`/life/music-photowalk/`。

- [ ] **Step 1: 实现共享卡片**

`TagList.astro` 接收 `tags: string[]`，以红色描边胶囊展示；空数组时渲染空 fragment。

`PostCard.astro` 接收 `title`、`href`、`date`、`summary`、`tags`，hover 时轻微上移并显示红色边框。

`LifeCard.astro` 接收 `title`、`href`、`date`、`summary`、`location`、`tags`、`photos`，使用左侧红色时间线圆点；有照片时展示最多三张，图片必须有 `alt`。

- [ ] **Step 2: 实现 PostLayout 与详情路由**

`PostLayout.astro` 接收 `title`、`description`、`date`、`tags`，输出返回链接、语义日期时间、标签和 `<slot />`。

`blog/[slug].astro` 使用：

```astro
---
import { getCollection, render } from "astro:content";
import PostLayout from "../../layouts/PostLayout.astro";
import { visibleEntries } from "../../lib/content";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return visibleEntries(posts, import.meta.env.PROD).map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<PostLayout title={entry.data.title} description={entry.data.description} date={entry.data.date} tags={entry.data.tags}>
  <article class="prose prose-invert max-w-none">
    <Content />
  </article>
</PostLayout>
```

`notes/[slug].astro` 与 `life/[slug].astro` 使用相同路由模式，但分别读取 `notes` 和 `life` 集合；观点详情没有 `description`，布局描述使用 `siteConfig.description`；生活详情必须渲染 `summary`、可选地点、照片和正文。

- [ ] **Step 3: 实现列表页**

`/blog/`、`/notes/`、`/life/` 都读取对应集合，先过滤草稿，再按日期倒序渲染卡片。每个列表页都要有页面标题、说明文字和空状态文案。

- [ ] **Step 4: 构建并检查产物**

Run: `npm run build`  
Expected: EXIT 0；上述 Interfaces 中列出的路径在 `dist/` 中都有对应 `index.html`。

- [ ] **Step 5: 提交**

```bash
git add src/components src/layouts/PostLayout.astro src/pages/blog src/pages/notes src/pages/life
git commit -m "feat: add blog, notes, and life routes"
```

---

### Task 5: 关于页、简历与资源下载

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/resources.astro`
- Create: `src/data/resources.ts`
- Create: `src/components/ResourceCard.astro`
- Create: `public/downloads/gaozhangyuanzhu-resume.pdf`
- Create: `public/downloads/personal-site-starter-checklist.txt`
- Create: `public/images/life/night-ride.svg`
- Create: `public/images/life/anime-weekend.svg`
- Create: `public/images/life/music-photowalk.svg`
- Test: `tests/resources.test.ts`

**Interfaces:**
- Produces: `resources`，字段为 `title`、`description`、`category`、`tags`、`date`、`type`、`href`。
- Produces: `available_resources(items = resources): typeof resources`，过滤 `href` 为空或 `available: false` 的资源。
- Consumes: `public/downloads/gaozhangyuanzhu-resume.pdf`、`public/downloads/personal-site-starter-checklist.txt`。

- [ ] **Step 1: 写失败测试**

Create `tests/resources.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { available_resources, resources } from "../src/data/resources";

describe("resources", () => {
  it("starts with at least two resources", () => {
    expect(resources.length).toBeGreaterThanOrEqual(2);
  });

  it("hides unavailable resources", () => {
    const input = [
      ...resources,
      { title: "隐藏文件", description: "不应展示", category: "示例", tags: [], date: "2026-10-01", type: "file", href: "/downloads/missing.txt", available: false },
    ] as const;
    expect(available_resources(input as any)).toHaveLength(resources.length);
  });
});
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm test -- tests/resources.test.ts`  
Expected: FAIL，因为 `src/data/resources.ts` 不存在。

- [ ] **Step 3: 实现资源数据和组件**

Create `src/data/resources.ts` with at least:

```ts
export type Resource = {
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  type: "file" | "link";
  href: string;
  available?: boolean;
};

export const resources: Resource[] = [
  {
    title: "个人简历 PDF",
    description: "当前版本为结构化占位简历，后续替换为正式简历即可。",
    category: "简历",
    tags: ["学生", "简历"],
    date: "2026-10-10",
    type: "file",
    href: "/downloads/gaozhangyuanzhu-resume.pdf",
  },
  {
    title: "个人网站内容清单",
    description: "用于整理博客、观点、生活记录和资源的可复用清单。",
    category: "模板",
    tags: ["写作", "整理"],
    date: "2026-10-10",
    type: "file",
    href: "/downloads/personal-site-starter-checklist.txt",
  },
];

export function available_resources<T extends { available?: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.available !== false && "href" in item && Boolean(item.href));
}
```

`ResourceCard.astro` renders category, title, description, date, tags, and a download/open button. For local files use the `download` attribute; for external links use `target="_blank" rel="noopener noreferrer"`.

- [ ] **Step 4: 创建下载文件与图片**

`public/downloads/personal-site-starter-checklist.txt` must contain Chinese sections for weekly blog ideas, short notes, life records, and resource preparation.

`public/downloads/gaozhangyuanzhu-resume.pdf` must be a valid PDF placeholder with the name, role, and a line saying it is a placeholder.

Each `public/images/life/*.svg` must use only black, white, red, and gray, include a readable background shape, and be at least 800x500 pixels.

- [ ] **Step 5: 实现关于页和资源页**

`/about/` must include: identity introduction, six keywords, education section, projects and works, interests, skills, contact methods, and the resume download button.

`/resources/` must call `available_resources(resources)`, render cards, and show “资源正在整理中” when the array is empty.

- [ ] **Step 6: 运行验证**

Run: `npm test -- tests/resources.test.ts && npm run build`  
Expected: PASS；PDF、清单文件和三张 SVG 都复制到 `dist/`。

- [ ] **Step 7: 提交**

```bash
git add src/pages/about.astro src/pages/resources.astro src/data/resources.ts src/components/ResourceCard.astro public/downloads public/images/life tests/resources.test.ts
git commit -m "feat: add about page, resume, and downloads"
```

---

### Task 6: 聚合首页与最终视觉

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/lib/homepage.ts`
- Create: `public/og/default.png`
- Test: `tests/homepage.test.ts`

**Interfaces:**
- Consumes: `getCollection`、`visibleEntries`、`sort_by_date_desc`、`siteConfig`、卡片组件。
- Produces: `latest_items<T extends Dated>(...groups: T[][]): T[]`，按日期倒序合并并最多返回 `limit`。

- [ ] **Step 1: 写失败测试**

Create `tests/homepage.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { latest_items } from "../src/lib/homepage";

describe("homepage aggregation", () => {
  it("merges groups and limits output", () => {
    const posts = [{ title: "blog", data: { date: new Date("2026-10-04T00:00:00Z") } }];
    const notes = [{ title: "note", data: { date: new Date("2026-10-06T00:00:00Z") } }];
    const result = latest_items(posts, notes, { limit: 2 });
    expect(result.map((item) => item.title)).toEqual(["note", "blog"]);
  });
});
```

- [ ] **Step 2: 运行并确认失败**

Run: `npm test -- tests/homepage.test.ts`  
Expected: FAIL，因为 `src/lib/homepage.ts` 不存在。

- [ ] **Step 3: 实现聚合函数和首页**

Create `src/lib/homepage.ts`:

```ts
type Dated = { data: { date: Date } };

export function latest_items<T extends Dated>(...input: Array<T[] | { limit?: number }>): T[] {
  const last = input[input.length - 1];
  const groups = (typeof last === "object" && last !== null && "limit" in last ? input.slice(0, -1) : input) as T[][];
  const limit = typeof last === "object" && last !== null && "limit" in last ? Number((last as { limit: number }).limit) : 5;
  return groups.flat().sort((a, b) => b.data.date.getTime() - a.data.date.getTime()).slice(0, limit);
}
```

`src/pages/index.astro` must include:

1. 红黑渐变主视觉，展示「高瞻远瞩」「学生」和个性签名。
2. 六个关键词标签。
3. 最新内容区块，合并博客与观点，最多展示四条。
4. 最近生活记录区块，最多展示三条。
5. 关于页和资源页入口按钮。
6. 移动端单列、平板两列、桌面三列的卡片布局。

- [ ] **Step 4: 创建 Open Graph 图片**

Create `public/og/default.png` as a 1200x630 image using only approved red, black, white, and gray. It must include “高瞻远瞩” and “学生 · Vibe”. Generate it with a local image tool or deterministic Python script; do not hotlink a remote image.

- [ ] **Step 5: 运行验证**

Run: `npm test -- tests/homepage.test.ts && npm run build`  
Expected: PASS；首页 HTML 包含 ID、角色、六个关键词、最新内容和最近生活记录。

- [ ] **Step 6: 提交**

```bash
git add src/pages/index.astro src/lib/homepage.ts public/og/default.png tests/homepage.test.ts
git commit -m "feat: build personalized homepage"
```

---

### Task 7: 构建质量、404、部署说明与最终验收

**Files:**
- Create: `scripts/verify-dist.mjs`
- Create: `src/pages/404.astro`
- Create: `public/robots.txt`
- Create: `.gitignore`
- Create: `README.md`
- Modify: `package.json`

**Interfaces:**
- Consumes: `dist/**/*.html`。
- Produces: `npm run verify:static`，校验必需页面、关键文案、内部链接和本地资源。

- [ ] **Step 1: 实现构建校验脚本**

Create `scripts/verify-dist.mjs` with these exact checks:

1. Required HTML routes exist: `/index.html`, `/about/index.html`, `/blog/index.html`, `/notes/index.html`, `/life/index.html`, `/resources/index.html`, `/404.html`.
2. Published details exist: `/blog/first-race-weekend/index.html`, `/blog/cycling-city-observation/index.html`, `/notes/anime-and-personal-taste/index.html`, `/notes/study-with-vibe/index.html`, `/notes/slow-down-shoot-more/index.html`, `/life/night-ride/index.html`, `/life/anime-weekend/index.html`, `/life/music-photowalk/index.html`.
3. `dist/blog/photography-light-notes/index.html` does not exist.
4. Homepage HTML contains `高瞻远瞩`, `学生`, and all six keywords.
5. Parse every HTML file and resolve local `href` / `src` values to `dist`; ignore `mailto:`, `tel:`, `http:`, `https:`, `data:`, anchors, and source maps.
6. Download files `/downloads/gaozhangyuanzhu-resume.pdf` and `/downloads/personal-site-starter-checklist.txt` exist.
7. Print `Static verification passed.` and exit 0 only when every check passes.

Use Node `node:path`, `node:fs/promises`, and `node:url`; avoid adding a runtime dependency.

- [ ] **Step 2: 实现 404、robots、README 和忽略文件**

`/404.astro` must show a red “404”, Chinese explanation, and links home and to resources.  
`public/robots.txt` must allow all user agents and reference the sitemap URL `https://gaozhangyuanzhu.vercel.app/sitemap-index.xml` only if sitemap is enabled; otherwise omit the sitemap line.  
`.gitignore` must ignore `node_modules/`, `dist/`, `.astro/`, `.DS_Store`, and `*.log`.  
`README.md` must document local commands, content frontmatter examples, how to replace the resume, and Vercel plus GitHub Pages deployment steps.

- [ ] **Step 3: 添加构建链**

Ensure `package.json` has:

```json
{
  "scripts": {
    "verify": "npm run test && npm run check && npm run build && npm run verify:static"
  }
}
```

- [ ] **Step 4: 最终验证**

Run: `npm run verify`  
Expected: Vitest PASS；`astro check` PASS；Astro build EXIT 0；`Static verification passed.`。

- [ ] **Step 5: 最终提交**

```bash
git add scripts/verify-dist.mjs src/pages/404.astro public/robots.txt .gitignore README.md package.json package-lock.json
git commit -m "feat: add final QA and deployment documentation"
```

- [ ] **Step 6: 检查工作树**

Run: `git status --short`  
Expected: 无未提交变更。
