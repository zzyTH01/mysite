import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { publicProfile, siteConfig } from "../src/config/site";

const sensitivePattern = /张瞻远|清华大学|能源与动力工程系|能源与动力工程|2023\s*-\s*2027|zhanyuan23@mails\.tsinghua\.edu\.cn|宣调中心|紫荆志愿者/;

describe("public profile", () => {
  it("uses only the network ID and does not expose real identity details", () => {
    expect(siteConfig.id).toBe("高瞻远瞩");
    const payload = JSON.stringify({ siteConfig, publicProfile });
    expect(payload).not.toMatch(sensitivePattern);
    expect(payload).not.toMatch(/18534900536|\+86\s*185|GPA|绩点|排名|成绩|CET|TOEFL|IELTS/i);
  });

  it("keeps only GitHub as the direct profile link", () => {
    expect(siteConfig.social).toHaveLength(1);
    expect(siteConfig.social[0].label).toBe("GitHub");
    expect(siteConfig.social[0].href).toBe("https://github.com/zzyTH01");
  });

  it("selects a small project set for the simplified about page", () => {
    expect(publicProfile.projects).toHaveLength(3);
  });

  it("keeps real identity and resume sections out of public pages", () => {
    const about = readFileSync("src/pages/about.astro", "utf8");
    const home = readFileSync("src/pages/index.astro", "utf8");
    expect(about).not.toMatch(/Name|University|Department|Major|Period|Activities|GET CV|简历下载|真实姓名/);
    expect(home).not.toContain("最新内容");
    expect(home).not.toContain("简历与资源");
    expect(readFileSync("src/pages/resources.astro", "utf8")).not.toContain("简历");
  });
});
