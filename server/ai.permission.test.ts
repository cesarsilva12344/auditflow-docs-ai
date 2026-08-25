import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("AI permission", () => {
  it("rejects prompt optimization for users without permission", async () => {
    const caller = appRouter.createCaller({
      user: { id: 7, openId: "user-without-ai", name: "User", email: "user@example.com", loginMethod: "test", role: "user", canUseAi: 0, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });
    await expect(caller.prompts.optimize({ context: "Contexto de reunião suficiente para teste", fields: {} })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
