import { z } from "zod";
import { invokeQwen } from "./qwen";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createAiRun, createMeetingMinute, createProject, createAdmin, createLocalUser, getAdminByUsername, getAdminSetting, getDb, getUserByLogin, listAllUsers, listMeetingMinutes, listProjects, listPrompts, saveAdminSetting, setUserAiPermission, updateAdminPassword } from "./db";
import { adminCookieOptions, adminSecretForCookie, createAdminToken, createUserToken, encryptSecret, hashPassword, userSecretForCookie, verifyAdminToken, verifyPassword, USER_COOKIE, ADMIN_COOKIE } from "./adminSecurity";
import { TRPCError } from "@trpc/server";

const analystInstruction = `Você é um Analista de Projetos especializado em governança e documentação de reuniões. Seu foco é transformar contexto, campos estruturados e transcrições em prompts claros e atas profissionais. Preserve fatos, decisões, responsáveis e prazos. Nunca invente informação: quando algo estiver ausente, escreva "A definir". Responda em português do Brasil, com linguagem objetiva e pronta para revisão humana.`;
const ataFormat = `Produza uma ata com: título, projeto, cliente, data, responsável, objetivo, participantes, resumo executivo, assuntos abordados, decisões, ações (ação | responsável | prazo), riscos e pendências. Use Markdown limpo e não inclua comentários sobre o processo.`;

export const appRouter = router({
  system: systemRouter,
  admin: router({
    login: publicProcedure.input(z.object({ username: z.string().min(1), password: z.string().min(1) })).mutation(async ({ ctx, input }) => {
      let admin = await getAdminByUsername(input.username);
      if (!admin && input.username === "admin" && input.password === "123") { await createAdmin("admin", hashPassword("123")); admin = await getAdminByUsername("admin"); }
      if (!admin || !verifyPassword(input.password, admin.passwordHash)) throw new TRPCError({ code: "UNAUTHORIZED", message: "Credenciais administrativas inválidas." });
      const token = await createAdminToken(admin.username);
      ctx.res.cookie(ADMIN_COOKIE, token, adminCookieOptions());
      return { success: true, mustChangePassword: Boolean(admin.mustChangePassword) };
    }),
    logout: publicProcedure.mutation(({ ctx }) => { ctx.res.clearCookie(ADMIN_COOKIE, adminCookieOptions()); return { success: true }; }),
    status: publicProcedure.query(async ({ ctx }) => { const authenticated = await verifyAdminToken(adminSecretForCookie(ctx.req)); const admin = authenticated ? await getAdminByUsername("admin") : undefined; return { authenticated, mustChangePassword: Boolean(admin?.mustChangePassword) }; }),
    changePassword: publicProcedure.input(z.object({ currentPassword: z.string(), newPassword: z.string().min(8) })).mutation(async ({ ctx, input }) => { if (!await verifyAdminToken(adminSecretForCookie(ctx.req))) throw new TRPCError({ code: "UNAUTHORIZED" }); const admin = await getAdminByUsername("admin"); if (!admin || !verifyPassword(input.currentPassword, admin.passwordHash)) throw new TRPCError({ code: "UNAUTHORIZED", message: "Senha atual inválida." }); await updateAdminPassword(admin.id, hashPassword(input.newPassword)); return { success: true }; }),
    getSettings: publicProcedure.query(async ({ ctx }) => { const authenticated = await verifyAdminToken(adminSecretForCookie(ctx.req)); const admin = authenticated ? await getAdminByUsername("admin") : undefined; if (!authenticated || admin?.mustChangePassword) throw new TRPCError({ code: "UNAUTHORIZED", message: "Troque a senha inicial antes de continuar." }); const setting = await getAdminSetting(); return { provider: setting?.provider ?? "qwen", baseUrl: setting?.baseUrl ?? process.env.QWEN_BASE_URL ?? "", model: setting?.model ?? process.env.QWEN_MODEL ?? "qwen-plus", apiKeyConfigured: Boolean(setting?.encryptedApiKey || process.env.QWEN_API_KEY) }; }),
    saveSettings: publicProcedure.input(z.object({ provider: z.string().min(2), baseUrl: z.string().url(), model: z.string().min(2), apiKey: z.string().min(10).optional() })).mutation(async ({ ctx, input }) => { const authenticated = await verifyAdminToken(adminSecretForCookie(ctx.req)); const admin = authenticated ? await getAdminByUsername("admin") : undefined; if (!authenticated || admin?.mustChangePassword) throw new TRPCError({ code: "UNAUTHORIZED", message: "Troque a senha inicial antes de continuar." }); const current = await getAdminSetting(); const encryptedApiKey = input.apiKey ? encryptSecret(input.apiKey) : current?.encryptedApiKey || (process.env.QWEN_API_KEY ? encryptSecret(process.env.QWEN_API_KEY) : ""); if (!encryptedApiKey) throw new TRPCError({ code: "BAD_REQUEST", message: "Informe a chave Qwen." }); await saveAdminSetting({ provider: input.provider, baseUrl: input.baseUrl, model: input.model, encryptedApiKey }); return { success: true, apiKeyConfigured: true }; }),
    users: publicProcedure.query(async ({ ctx }) => { const authenticated = await verifyAdminToken(adminSecretForCookie(ctx.req)); const admin = authenticated ? await getAdminByUsername("admin") : undefined; if (!authenticated || admin?.mustChangePassword) throw new TRPCError({ code: "UNAUTHORIZED" }); return listAllUsers(); }),
    setAiPermission: publicProcedure.input(z.object({ userId: z.number(), canUseAi: z.boolean() })).mutation(async ({ ctx, input }) => { const authenticated = await verifyAdminToken(adminSecretForCookie(ctx.req)); const admin = authenticated ? await getAdminByUsername("admin") : undefined; if (!authenticated || admin?.mustChangePassword) throw new TRPCError({ code: "UNAUTHORIZED" }); await setUserAiPermission(input.userId, input.canUseAi); return { success: true }; }),
  }),
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    login: publicProcedure.input(z.object({ username: z.string().min(3), password: z.string().min(8) })).mutation(async ({ ctx, input }) => { const user = await getUserByLogin(input.username); if (!user?.passwordHash || !verifyPassword(input.password, user.passwordHash)) throw new TRPCError({ code: "UNAUTHORIZED", message: "Utilizador ou senha inválidos." }); const token = await createUserToken(user.id); ctx.res.cookie(USER_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 }); return { success: true }; }),
    register: publicProcedure.input(z.object({ username: z.string().min(3).max(64).regex(/^[a-zA-Z0-9._-]+$/), password: z.string().min(8), name: z.string().min(2), email: z.string().email().optional() })).mutation(async ({ ctx, input }) => { if (await getUserByLogin(input.username)) throw new TRPCError({ code: "CONFLICT", message: "Este utilizador já existe." }); const user = await createLocalUser({ username: input.username, passwordHash: hashPassword(input.password), name: input.name, email: input.email }); if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" }); const token = await createUserToken(user.id); ctx.res.cookie(USER_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 }); return { success: true }; }),
    logout: publicProcedure.mutation(({ ctx }) => { ctx.res.clearCookie(USER_COOKIE, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" }); return { success: true } as const; }),
  }),
  prompts: router({
    list: protectedProcedure.query(() => listPrompts()),
    optimize: protectedProcedure.input(z.object({ promptId: z.number().optional(), context: z.string().min(10), fields: z.record(z.string(), z.string()).default({}) })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && !ctx.user.canUseAi) throw new TRPCError({ code: "FORBIDDEN", message: "Você não tem permissão para usar a IA." });
      const fieldText = Object.entries(input.fields).map(([key, value]) => `${key}: ${value}`).join("\n");
      const response = await invokeQwen([{ role: "system", content: analystInstruction }, { role: "user", content: `Otimize um prompt para criar uma ata.\n\nCampos:\n${fieldText}\n\nContexto bruto:\n${input.context}\n\nEntregue apenas o prompt otimizado, com papel, objetivo, contexto, regras e formato de saída.` }]);
      return { prompt: response.content };
    }),
  }),
  projects: router({
    list: protectedProcedure.query(({ ctx }) => listProjects(ctx.user.id)),
    create: protectedProcedure.input(z.object({ clientName: z.string().min(2), name: z.string().min(2) })).mutation(({ ctx, input }) => createProject({ ...input, userId: ctx.user.id })),
  }),
  minutes: router({
    list: protectedProcedure.query(({ ctx }) => listMeetingMinutes(ctx.user.id)),
    save: protectedProcedure.input(z.object({ projectId: z.number().optional(), promptId: z.number().optional(), mode: z.enum(["manual", "ai"]), title: z.string(), clientName: z.string(), projectName: z.string(), meetingDate: z.string(), ownerName: z.string(), objective: z.string(), transcript: z.string().optional(), guidance: z.string().optional(), content: z.string(), status: z.enum(["draft", "generated", "reviewed"]).default("draft") })).mutation(({ ctx, input }) => createMeetingMinute({ ...input, userId: ctx.user.id })),
  }),
  ai: router({
    generateAta: protectedProcedure.input(z.object({ promptId: z.number().optional(), optimizedPrompt: z.string().min(20), projectName: z.string(), clientName: z.string(), meetingDate: z.string(), ownerName: z.string(), objective: z.string(), transcript: z.string().min(10), guidance: z.string().optional() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && !ctx.user.canUseAi) throw new TRPCError({ code: "FORBIDDEN", message: "Você não tem permissão para usar a IA." });
      const userPrompt = `${input.optimizedPrompt}\n\nDados da ata:\nProjeto: ${input.projectName}\nCliente: ${input.clientName}\nData: ${input.meetingDate}\nResponsável: ${input.ownerName}\nObjetivo: ${input.objective}\nOrientação adicional: ${input.guidance ?? "Nenhuma"}\n\nTranscrição:\n${input.transcript}\n\nFormato obrigatório:\n${ataFormat}`;
      const response = await invokeQwen([{ role: "system", content: analystInstruction }, { role: "user", content: userPrompt }]);
      const content = response.content;
      const minuteId = await createMeetingMinute({ userId: ctx.user.id, promptId: input.promptId, mode: "ai", title: `Ata — ${input.projectName}`, clientName: input.clientName, projectName: input.projectName, meetingDate: input.meetingDate, ownerName: input.ownerName, objective: input.objective, transcript: input.transcript, guidance: input.guidance, content, status: "generated" });
      await createAiRun({ userId: ctx.user.id, meetingMinuteId: Number(minuteId), promptId: input.promptId, inputText: userPrompt, outputText: content, model: response.model });
      return { minuteId: Number(minuteId), content };
    }),
  }),
});

export type AppRouter = typeof appRouter;
