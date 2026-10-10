import { describe, expect, it } from "vitest";
import { colors } from "../src/lib/design-tokens";

describe("design tokens", () => {
  it("uses the approved red, black, and white palette", () => {
    expect(colors).toEqual({
      red: "#E10600",
      black: "#0A0A0A",
      white: "#FFFFFF",
      gray: "#6B7280",
      lightGray: "#E5E7EB",
    });
  });
});
