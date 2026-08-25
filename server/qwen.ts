import { z } from "zod";
import { getAdminSetting } from "./db";
import { decryptSecret } from "./adminSecurity";

const qwenResponseSchema = z.object({ choices: z.array(z.object({ message: z.object({ content: z.string().optional() }) })).min(1) });

export async function invokeQwen(messages: Array<{ role: "system" | "user" | "assistant"; content: string }>) {
  const setting = await getAdminSetting();
  const apiKey = setting?.encryptedApiKey ? decryptSecret(setting.encryptedApiKey) : process.env.QWEN_API_KEY;
  const baseUrl = (setting?.baseUrl || process.env.QWEN_BASE_URL || "").replace(/\/$/, "");
  const model = setting?.model || process.env.QWEN_MODEL || "qwen-plus";
  if (!apiKey || !baseUrl) throw new Error("Qwen não está configurado no ambiente do servidor.");
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, temperature: 0.2 }),
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("[Qwen] request failed", response.status, detail.slice(0, 500));
    throw new Error(`Qwen respondeu com status ${response.status}.`);
  }
  const payload = qwenResponseSchema.parse(await response.json());
  return { content: payload.choices[0]?.message.content || "", model };
}
