import { describe, expect, it } from "vitest";
import { profileConfig } from "../src/config/site";

describe("public profile", () => {
  it("uses verified identity and education facts without grades", () => {
    expect(profileConfig.legalName).toBe("张瞻远");
    expect(profileConfig.university).toBe("清华大学");
    expect(profileConfig.college).toBe("能源与动力工程系");
    expect(profileConfig.major).toBe("能源与动力工程");
    expect(JSON.stringify(profileConfig)).not.toMatch(/GPA|绩点|排名|成绩|CET|TOEFL|IELTS/i);
  });

  it("groups public GitHub projects by domain", () => {
    expect(profileConfig.projects).toHaveLength(7);
    const domains = new Set(profileConfig.projects.map((project) => project.domain));
    expect([...domains]).toEqual(["能源与机器学习", "机器学习与叙事系统", "工程与仿真工具"]);
  });

  it("never exposes phone numbers or private repository details", () => {
    const payload = JSON.stringify(profileConfig);
    expect(payload).not.toMatch(/18534900536|\+86\s*185/);
    expect(payload).not.toContain("RL-on-ROM-by-Fluid-Control");
  });
});
