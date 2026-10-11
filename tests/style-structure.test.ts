import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (file: string) => readFileSync(file, "utf8");
const index = read("src/pages/index.astro");
const css = read("src/styles/global.css");
const header = read("src/components/BaseHeader.astro");

describe("persona circuit frontend style", () => {
  it("uses a split oversized hero title and decorative speed frame", () => {
    expect(index).toContain("hero-title-line");
    expect(index).toContain("hero-outline");
    expect(index).toContain("hero-frame");
  });

  it("adds the scrolling keyword marquee", () => {
    expect(read("src/components/Marquee.astro")).toContain("keyword-marquee");
    expect(index).toContain("<Marquee />");
  });

  it("uses numbered command navigation", () => {
    expect(header).toContain("nav-no");
    expect(header).toContain("mobile-nav-no");
  });

  it("keeps sharp cut corners and hard shadows in the visual system", () => {
    expect(css).toContain("--cut:");
    expect(css).toContain("--hard-shadow:");
    expect(css).toContain("clip-path");
  });

  it("respects reduced motion preferences", () => {
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(read("src/layouts/BaseLayout.astro")).toContain("prefers-reduced-motion");
  });

  it("keeps the approved red, black, and white palette", () => {
    expect(css).toContain("#e10600");
    expect(css).toContain("#0a0a0a");
    expect(css).toContain("#ffffff");
    expect(css).not.toMatch(/#(?:7c3aed|06b6d4|3b82f6)/i);
  });
});
