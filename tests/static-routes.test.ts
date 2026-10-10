import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

const requiredSources = [
  "src/pages/blog/index.astro",
  "src/pages/blog/[slug].astro",
  "src/pages/notes/index.astro",
  "src/pages/notes/[slug].astro",
  "src/pages/life/index.astro",
  "src/pages/life/[slug].astro",
];

describe("content route sources", () => {
  it("declares routes for every required collection", () => {
    for (const file of requiredSources) {
      expect(existsSync(file), `${file} should exist`).toBe(true);
    }
  });
});
