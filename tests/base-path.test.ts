import { describe, expect, it } from "vitest";
import { with_base } from "../src/lib/paths";

describe("base path helper", () => {
  it("prefixes internal routes with the GitHub Pages repository path", () => {
    expect(with_base("/")).toBe("/mysite/");
    expect(with_base("/about/")).toBe("/mysite/about/");
    expect(with_base("/downloads/resume.pdf")).toBe("/mysite/downloads/resume.pdf");
  });

  it("does not prefix external protocols or already-prefixed paths", () => {
    expect(with_base("https://example.com/")).toBe("https://example.com/");
    expect(with_base("mailto:hello@example.com")).toBe("mailto:hello@example.com");
    expect(with_base("/mysite/about/")).toBe("/mysite/about/");
  });

  it("keeps routes unchanged for a root deployment", () => {
    expect(with_base("/about/", "")).toBe("/about/");
  });
});
