import { describe, expect, it } from "vitest";

describe("Qwen model", () => {
  it("accepts the configured model on chat completions", async () => {
    const apiKey = process.env.QWEN_API_KEY;
    const baseUrl = process.env.QWEN_BASE_URL;
    const model = process.env.QWEN_MODEL;
    expect(apiKey).toBeTruthy();
    expect(baseUrl).toBeTruthy();
    expect(model).toBe("qwen3.7-plus");
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: [{ role: "user", content: "Responda apenas OK." }], temperature: 0 }),
    });
    expect(response.ok).toBe(true);
  }, 20_000);
});
