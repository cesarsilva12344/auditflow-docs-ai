import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("local authentication", () => {
  it("rejects the temporary admin password on the public login route", async () => {
    const caller = appRouter.createCaller({ user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] });
    await expect(caller.auth.login({ username: "admin", password: "123" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
