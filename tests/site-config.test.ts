import { describe, expect, it } from "vitest";
import { navItems, siteConfig } from "../src/config/site";

describe("site config", () => {
  it("identifies the site owner and keywords", () => {
    expect(siteConfig.id).toBe("高瞻远瞩");
    expect(siteConfig.role).toBe("学生");
    expect(siteConfig.keywords).toEqual([
      "二次元",
      "赛车",
      "摄影",
      "骑行",
      "音乐",
      "Vibe",
    ]);
  });

  it("links to the owner's GitHub profile", () => {
    const github = siteConfig.social.find((item) => item.label === "GitHub");
    expect(github?.href).toBe("https://github.com/zzyTH01");
  });

  it("exposes one navigation entry for every required section", () => {
    expect(navItems.map((item) => item.href)).toEqual([
      "/",
      "/about/",
      "/blog/",
      "/notes/",
      "/life/",
      "/resources/",
    ]);
  });
});
