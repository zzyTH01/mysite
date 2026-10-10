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
