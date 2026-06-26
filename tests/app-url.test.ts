import { describe, expect, it } from "vitest";
import { resolveAppBaseUrl } from "../src/lib/app-url";

describe("app base URL resolution", () => {
  it("uses a configured app base URL after trimming whitespace and trailing slashes", () => {
    expect(resolveAppBaseUrl(" https://tempahan.pkgpr.edu.my/ ", new Headers())).toBe(
      "https://tempahan.pkgpr.edu.my"
    );
  });

  it("adds https to configured production domains that omit a protocol", () => {
    expect(resolveAppBaseUrl("pkgpantairemis.vercel.app", new Headers())).toBe(
      "https://pkgpantairemis.vercel.app"
    );
  });

  it("replaces the old temporary Vercel domain in generated links", () => {
    expect(resolveAppBaseUrl(" https://izrulmansion.vercel.app/ ", new Headers())).toBe(
      "https://pkgpantairemis.vercel.app"
    );
  });

  it("uses forwarded production headers when APP_BASE_URL is not configured", () => {
    const headers = new Headers({
      "x-forwarded-host": "tempahan.pkgpr.edu.my",
      "x-forwarded-proto": "https"
    });

    expect(resolveAppBaseUrl(undefined, headers)).toBe("https://tempahan.pkgpr.edu.my");
  });
});
