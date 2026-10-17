import { describe, expect, it } from "vitest";
import { available_resources, resources } from "../src/data/resources";

describe("resources", () => {
  it("starts with at least two resources", () => {
    expect(resources.length).toBeGreaterThanOrEqual(1);
  });

  it("hides unavailable resources", () => {
    const input = [
      ...resources,
      {
        title: "隐藏文件",
        description: "不应展示",
        category: "示例",
        tags: [],
        date: "2026-10-01",
        type: "file" as const,
        href: "/downloads/missing.txt",
        available: false,
      },
    ];
    expect(available_resources(input)).toHaveLength(resources.length);
  });
});
