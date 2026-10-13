export type NavItem = { label: string; href: string };

export const siteConfig = {
  id: "高瞻远瞩",
  role: "学生",
  tagline: "看得更远，活得更有 Vibe。",
  description:
    "高瞻远瞩的个人网站：学生、二次元爱好者、赛车关注者、摄影与骑行爱好者，记录观点、博客和生活。",
  keywords: ["二次元", "赛车", "摄影", "骑行", "音乐", "Vibe"],
  email: "zhanyuan23@mails.tsinghua.edu.cn",
  social: [
    { label: "邮箱", href: "mailto:zhanyuan23@mails.tsinghua.edu.cn", external: false },
    { label: "GitHub", href: "https://github.com/zzyTH01", external: true },
    { label: "Bilibili", href: "https://www.bilibili.com/", external: true },
    { label: "小红书", href: "https://www.xiaohongshu.com/", external: true },
  ],
} as const;

export type ProfileProject = {
  title: string;
  description: string;
  href: string;
  domain: string;
  tags: string[];
};

export const profileConfig = {
  legalName: "张瞻远",
  university: "清华大学",
  college: "能源与动力工程系",
  major: "能源与动力工程",
  period: "2023 - 2027",
  researchStatement:
    "当前关注计算物理与机器学习的交叉方向，特别是降阶代理建模、流场分析与数据驱动方法。",
  projects: [
    {
      title: "Ahmed Body CAE-ROM",
      description:
        "使用卷积自编码器构建二维 Ahmed Body 外流场代理模型，将速度场重构误差控制在低量级，并系统评估涡量与方向一致性指标。",
      href: "https://github.com/zzyTH01/AhmedBodyCaeRom",
      domain: "能源与机器学习",
      tags: ["CFD", "CAE-ROM", "PyTorch"],
    },
    {
      title: "FGL on CSTR",
      description:
        "把 Future-Guided Learning 方法迁移到 CSTR 时间序列数据集，研究其在不同回看窗口与预测长度下的适用条件。",
      href: "https://github.com/zzyTH01/FGL_ON_CSTR",
      domain: "能源与机器学习",
      tags: ["Time Series", "Distillation", "Research"],
    },
    {
      title: "Simplified F1 Heat Transfer",
      description:
        "针对简化 F1 座舱与车体建立稳态热传递模型，耦合辐射、强迫对流与 CFRP 壳体导热过程。",
      href: "https://github.com/zzyTH01/Simplfied-F1-Heat-Transfer-Calculation",
      domain: "能源与机器学习",
      tags: ["Heat Transfer", "Monte Carlo", "F1"],
    },
    {
      title: "AI GALGAME Framework",
      description:
        "构建规则驱动、状态确定、AI 负责叙事表现的叙事沙盒框架，包含 Game State、记忆系统、选项引擎与 SillyTavern Adapter。",
      href: "https://github.com/zzyTH01/AIgal",
      domain: "机器学习与叙事系统",
      tags: ["TypeScript", "LLM", "Game Engine"],
    },
    {
      title: "快乐能源联机游戏",
      description:
        "开发一个多角色能源决策联机游戏，支持房间码加入、二维码连接、多轮规划、服务端结算与数据导出。",
      href: "https://github.com/zzyTH01/smart-energy-game",
      domain: "机器学习与叙事系统",
      tags: ["Node.js", "Socket.IO", "教育游戏"],
    },
    {
      title: "Aero FSI Demo",
      description:
        "实现 NACA 翼型气动载荷与悬臂梁结构挠度的流固耦合迭代原型，并提供 Streamlit 参数交互界面。",
      href: "https://github.com/zzyTH01/aero_FSI_demo1",
      domain: "工程与仿真工具",
      tags: ["FSI", "Python", "Streamlit"],
    },
    {
      title: "Zeta",
      description:
        "一个把日历、待办和日记整合在一起的记录应用，使用 React 与 Vite 构建轻量交互界面。",
      href: "https://github.com/zzyTH01/zeta",
      domain: "工程与仿真工具",
      tags: ["React", "Vite", "Product"],
    },
  ],
  activities: [
    "能动系宣调中心主席",
    "能动系新生小导",
    "自强书院小辅导员",
    "清华大学五星级紫荆志愿者",
  ],
  interests: {
    photography: "城市街拍、光线观察与记录",
    cycling: "城市路线与夜骑",
    music: "节奏歌单与现场",
    anime: "作品清单与叙事分析",
    racing: "赛车热管理与策略观察",
    vibe: "把兴趣整理成可分享的表达",
  },
} as const;

export const navItems: NavItem[] = [
  { label: "首页", href: "/" },
  { label: "关于", href: "/about/" },
  { label: "博客", href: "/blog/" },
  { label: "观点", href: "/notes/" },
  { label: "生活", href: "/life/" },
  { label: "资源", href: "/resources/" },
];
