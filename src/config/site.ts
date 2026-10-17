export type NavItem = { label: string; href: string };

export const siteConfig = {
  id: "高瞻远瞩",
  role: "学生",
  tagline: "看得更远，活得更有 Vibe。",
  description:
    "高瞻远瞩的个人网站：学生、二次元爱好者、赛车关注者、摄影与骑行爱好者，记录观点、博客和生活。",
  keywords: ["二次元", "赛车", "摄影", "骑行", "音乐", "Vibe"],
    social: [
    { label: "GitHub", href: "https://github.com/zzyTH01", external: true },
  ],
} as const;

export const publicProfile = {
  focus: "计算科学、交互叙事与数据驱动方法。",
  projects: [
    {
      title: "Ahmed Body CAE-ROM",
      description: "用卷积自编码器构建二维外流场代理模型，并评估流场重构质量。",
      href: "https://github.com/zzyTH01/AhmedBodyCaeRom",
      tags: ["CFD", "ROM", "PyTorch"],
    },
    {
      title: "AI GALGAME Framework",
      description: "规则驱动的 AI 叙事沙盒框架，包含状态引擎、记忆系统与叙事接口。",
      href: "https://github.com/zzyTH01/AIgal",
      tags: ["TypeScript", "LLM", "Game"],
    },
    {
      title: "快乐能源联机游戏",
      description: "多角色能源决策游戏，支持房间连接、多轮规划与服务端结算。",
      href: "https://github.com/zzyTH01/smart-energy-game",
      tags: ["Node.js", "Socket.IO", "Game"],
    },
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
