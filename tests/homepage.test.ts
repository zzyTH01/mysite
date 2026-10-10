import { describe, expect, it } from "vitest";
import { latest_items } from "../src/lib/homepage";

describe("homepage aggregation", () => {
  it("merges groups and limits output", () => {
    const posts = [{ title: "blog", data: { date: new Date("2026-10-04T00:00:00Z") } }];
    const notes = [{ title: "note", data: { date: new Date("2026-10-06T00:00:00Z") } }];
    const result = latest_items(posts, notes, { limit: 2 });
    expect(result.map((item) => item.title)).toEqual(["note", "blog"]);
  });

  it("returns an empty array when no entries exist", () => {
    expect(latest_items([], [], { limit: 4 })).toEqual([]);
  });
});
