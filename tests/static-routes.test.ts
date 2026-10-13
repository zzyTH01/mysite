import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const emptyBlogState = readFileSync("src/content/blog/first-race-weekend.md", "utf8").includes("draft: true");

const requiredSources = [
  "src/pages/blog/index.astro",
  "src/pages/blog/[slug].astro",
  "src/pages/notes/index.astro",
  "src/pages/notes/[slug].astro",
  "src/pages/life/index.astro",
  "src/pages/life/[slug].astro",
];

describe("content route sources", () => {
  it("keeps the blog empty until real articles are added", () => {
    expect(emptyBlogState).toBe(true);
  });

  it("declares routes for every required collection", () => {
    for (const file of requiredSources) {
      expect(existsSync(file), `${file} should exist`).toBe(true);
    }
  });
});
