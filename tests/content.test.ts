import { describe, expect, it } from "vitest";
import { blogSchema, format_date, lifeSchema, noteSchema, sort_by_date_desc, visibleEntries } from "../src/lib/content";

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

  it("accepts a short note", () => {
    const result = noteSchema.safeParse({
      title: "保持自己的审美",
      date: new Date("2026-10-06T00:00:00Z"),
      tags: ["二次元"],
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
    expect(sort_by_date_desc(entries as any).map(({ data }) => data.date.getUTCMonth())).toEqual([9, 0]);
  });

  it("formats dates in Chinese", () => {
    expect(format_date(new Date("2026-10-04T00:00:00Z"))).toBe("2026年10月4日");
  });
});
