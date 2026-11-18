import { describe, expect, it } from "vitest";
import { absoluteUrl, SITE_URL } from "./site";

describe("absoluteUrl", () => {
  it("builds root url", () => {
    expect(absoluteUrl("/")).toBe(`${SITE_URL}/`);
  });
  it("adds trailing slash and leading slash", () => {
    expect(absoluteUrl("jomi-converter")).toBe(`${SITE_URL}/jomi-converter/`);
    expect(absoluteUrl("/about/")).toBe(`${SITE_URL}/about/`);
  });
});
