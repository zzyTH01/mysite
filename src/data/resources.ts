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
