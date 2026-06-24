import { describe, expect, it } from "vitest";
import { formatDate } from "./format.ts";

describe("formatDate", () => {
  it("returns a non-empty string", () => {
    expect(formatDate(new Date())).toBeTypeOf("string");
  });

  it("includes the day number", () => {
    const date = new Date(2024, 0, 15);
    expect(formatDate(date)).toContain("15");
  });
});
