import { desc, eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, adminCredentials, adminSettings, aiRuns, meetingMinutes, projects, prompts, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = values[field]; } }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

const DEFAULT_PROMPTS = [
  ["Criar ata de reunião", "Transforme uma transcrição em ata clara, objetiva e revisável.", "Atas", "Você é um analista de projetos. Crie uma ata profissional a partir do contexto recebido, mantendo fatos, decisões, responsáveis, prazos, riscos e pendências. Não invente informações; sinalize campos ausentes como A definir."],
  ["Extrair decisões e responsáveis", "Isole decisões, responsáveis e prazos citados na conversa.", "Atas", "Extraia somente decisões, responsáveis, prazos e pendências. Preserve a linguagem objetiva e marque como A definir o que não estiver explícito."],
  ["Organizar próximos passos", "Converta uma conversa em plano de ações acompanhável.", "Atas", "Organize próximos passos em tabela com ação, responsável, prazo e dependências. Não atribua responsáveis sem evidência."],
  ["Resumo executivo da reunião", "Gere um resumo para stakeholders que não participaram.", "Atas", "Escreva um resumo executivo curto, factual e orientado a decisão, com contexto, decisões e alertas."],
  ["Mapear riscos da reunião", "Identifique riscos, bloqueios e pontos que exigem decisão.", "Governança", "Analise o texto e liste riscos, impacto, probabilidade, responsável por tratar e próximo passo. Não crie riscos não suportados pelo texto."],
  ["Revisar clareza da ata", "Aprimore uma ata mantendo o conteúdo original.", "Qualidade", "Revise gramática, clareza, consistência e ordem das informações sem alterar decisões ou inventar detalhes."],
  ["Gerar pauta de acompanhamento", "Crie a pauta da próxima reunião a partir das pendências.", "Ritual", "Converta pendências em uma pauta priorizada, com objetivo de cada item e resultado esperado."],
  ["Comunicar mudança de projeto", "Estruture uma comunicação sobre mudança aprovada.", "Comunicação", "Produza comunicação objetiva sobre mudança, motivo, impacto, data, responsáveis e próximos passos, usando apenas dados fornecidos."],
  ["Formalizar critérios de aceite", "Transforme alinhamentos em critérios verificáveis.", "Entrega", "Converta os alinhamentos em critérios de aceite testáveis, com evidência esperada e responsável pela validação."],
  ["Preparar status report", "Estruture uma atualização de projeto para o comité.", "Governança", "Crie status report com progresso, entregas, riscos, decisões necessárias e próximos passos, sem preencher lacunas com suposições."],
] as const;

export async function ensureDefaultPrompts() {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select({ id: prompts.id }).from(prompts).where(isNull(prompts.userId)).limit(1);
  if (existing.length > 0) return;
  await db.insert(prompts).values(DEFAULT_PROMPTS.map(([title, description, category, systemInstruction]) => ({ title, description, category, systemInstruction, userId: null })));
}

export async function listPrompts() { const db = await getDb(); if (!db) return []; await ensureDefaultPrompts(); return db.select().from(prompts).orderBy(prompts.category, prompts.id); }
export async function listProjects(userId: number) { const db = await getDb(); if (!db) return []; return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.updatedAt)); }
export async function createProject(input: { userId: number; clientName: string; name: string }) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const result = await db.insert(projects).values(input); return result[0]?.insertId ?? 0; }
export async function listMeetingMinutes(userId: number) { const db = await getDb(); if (!db) return []; return db.select().from(meetingMinutes).where(eq(meetingMinutes.userId, userId)).orderBy(desc(meetingMinutes.updatedAt)).limit(30); }
export async function createMeetingMinute(input: typeof meetingMinutes.$inferInsert) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const result = await db.insert(meetingMinutes).values(input); return result[0]?.insertId ?? 0; }
export async function createAiRun(input: typeof aiRuns.$inferInsert) { const db = await getDb(); if (!db) return; await db.insert(aiRuns).values(input); }

export async function getAdminByUsername(username: string) { const db = await getDb(); if (!db) return undefined; const rows = await db.select().from(adminCredentials).where(eq(adminCredentials.username, username)).limit(1); return rows[0]; }
export async function createAdmin(username: string, passwordHash: string) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.insert(adminCredentials).values({ username, passwordHash, mustChangePassword: 1 }); }
export async function updateAdminPassword(id: number, passwordHash: string) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.update(adminCredentials).set({ passwordHash, mustChangePassword: 0 }).where(eq(adminCredentials.id, id)); }
export async function getAdminSetting() { const db = await getDb(); if (!db) return undefined; const rows = await db.select().from(adminSettings).limit(1); return rows[0]; }
export async function saveAdminSetting(input: { provider: string; baseUrl: string; model: string; encryptedApiKey: string }) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); const current = await getAdminSetting(); if (current) { await db.update(adminSettings).set(input).where(eq(adminSettings.id, current.id)); return current.id; } const result = await db.insert(adminSettings).values(input); return result[0]?.insertId ?? 0; }

export async function listAllUsers() { const db = await getDb(); if (!db) return []; return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, canUseAi: users.canUseAi }).from(users).orderBy(users.name); }
export async function setUserAiPermission(userId: number, canUseAi: boolean) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.update(users).set({ canUseAi: canUseAi ? 1 : 0 }).where(eq(users.id, userId)); }

export async function getUserById(id: number) { const db = await getDb(); if (!db) return undefined; const rows = await db.select().from(users).where(eq(users.id, id)).limit(1); return rows[0]; }
export async function getUserByLogin(username: string) { const db = await getDb(); if (!db) return undefined; const rows = await db.select().from(users).where(eq(users.openId, username)).limit(1); return rows[0]; }
export async function createLocalUser(input: { username: string; passwordHash: string; name: string; email?: string; role?: "user" | "admin"; canUseAi?: number }) { const db = await getDb(); if (!db) throw new Error("Database unavailable"); await db.insert(users).values({ openId: input.username, passwordHash: input.passwordHash, name: input.name, email: input.email, role: input.role ?? "user", canUseAi: input.canUseAi ?? 0, loginMethod: "local" }); return getUserByLogin(input.username); }
