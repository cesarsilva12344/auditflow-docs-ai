import { describe, expect, it } from "vitest";

describe("Qwen secret", () => {
  it("authenticates against the configured models endpoint without exposing the key", async () => {
    const apiKey = process.env.QWEN_API_KEY;
    const baseUrl = process.env.QWEN_BASE_URL;
    expect(apiKey).toBeTruthy();
    expect(baseUrl).toBeTruthy();
    const response = await fetch(`${baseUrl}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    expect(response.ok).toBe(true);
  }, 20_000);
});
