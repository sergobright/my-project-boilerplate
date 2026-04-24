import { PrismaClient, TransitionSource } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding card statuses and transitions...");

  // ───────────────────────────────────────────
  // Статусы воронки (из projectbrief.md)
  // ───────────────────────────────────────────
  const statuses = [
    { slug: "incoming",   label: "Входящие",          isClosed: false, sortOrder: 0,  color: "#6366f1" },
    { slug: "follow_up",  label: "Дожим",              isClosed: false, sortOrder: 1,  color: "#8b5cf6" },
    { slug: "human",      label: "Человек",            isClosed: false, sortOrder: 2,  color: "#f59e0b" },
    { slug: "deal",       label: "Сделка оформлена",   isClosed: false, sortOrder: 3,  color: "#10b981" },
    { slug: "to_ship",    label: "К отправке",         isClosed: false, sortOrder: 4,  color: "#06b6d4" },
    { slug: "in_transit", label: "В пути",             isClosed: false, sortOrder: 5,  color: "#3b82f6" },
    { slug: "delivered",  label: "Получено клиентом",  isClosed: false, sortOrder: 6,  color: "#84cc16" },
    { slug: "done",       label: "Исполнено",          isClosed: true,  sortOrder: 7,  color: "#22c55e" },
    { slug: "lost",       label: "Потеряно",           isClosed: true,  sortOrder: 8,  color: "#94a3b8" },
    { slug: "declined",   label: "Отказ",              isClosed: true,  sortOrder: 9,  color: "#ef4444" },
  ];

  const created: Record<string, string> = {};

  for (const s of statuses) {
    const status = await prisma.cardStatus.upsert({
      where: { slug: s.slug },
      update: { label: s.label, isClosed: s.isClosed, sortOrder: s.sortOrder, color: s.color },
      create: s,
    });
    created[s.slug] = status.id;
    console.log(`  ✓ Status: ${s.label} (${s.slug})`);
  }

  // ───────────────────────────────────────────
  // Разрешённые переходы
  // ───────────────────────────────────────────
  const all = [TransitionSource.ai, TransitionSource.user, TransitionSource.avito, TransitionSource.n8n, TransitionSource.system];
  const aiN8n = [TransitionSource.ai, TransitionSource.n8n];
  const avitoN8n = [TransitionSource.avito, TransitionSource.n8n];
  const userOnly = [TransitionSource.user];

  const transitions: { from: string; to: string; sources: TransitionSource[] }[] = [
    // AI-движение по воронке
    { from: "incoming",   to: "follow_up",  sources: aiN8n },
    { from: "incoming",   to: "human",      sources: aiN8n },
    { from: "incoming",   to: "declined",   sources: aiN8n },
    { from: "follow_up",  to: "human",      sources: aiN8n },
    { from: "follow_up",  to: "declined",   sources: aiN8n },

    // Пользователь включает/выключает AI
    { from: "incoming",   to: "human",      sources: userOnly },
    { from: "follow_up",  to: "human",      sources: userOnly },
    { from: "human",      to: "follow_up",  sources: userOnly }, // включить AI обратно

    // Переход в сделку — только из Avito
    { from: "follow_up",  to: "deal",       sources: avitoN8n },
    { from: "human",      to: "deal",       sources: avitoN8n },

    // Исполнение — только Avito/N8N
    { from: "deal",       to: "to_ship",    sources: avitoN8n },
    { from: "to_ship",    to: "in_transit", sources: avitoN8n },
    { from: "in_transit", to: "delivered",  sources: avitoN8n },
    { from: "delivered",  to: "done",       sources: avitoN8n },

    // Потеряно — по таймауту (system/n8n)
    { from: "incoming",   to: "lost",       sources: [TransitionSource.system, TransitionSource.n8n] },
    { from: "follow_up",  to: "lost",       sources: [TransitionSource.system, TransitionSource.n8n] },
    { from: "human",      to: "lost",       sources: [TransitionSource.system, TransitionSource.n8n] },

    // Возврат из закрытых при новом сообщении
    { from: "lost",       to: "incoming",   sources: [TransitionSource.n8n, TransitionSource.system] },
    { from: "declined",   to: "incoming",   sources: [TransitionSource.n8n, TransitionSource.system] },
  ];

  for (const t of transitions) {
    await prisma.statusTransition.upsert({
      where: {
        fromStatusId_toStatusId: {
          fromStatusId: created[t.from],
          toStatusId: created[t.to],
        },
      },
      update: { allowedSources: t.sources },
      create: {
        fromStatusId: created[t.from],
        toStatusId: created[t.to],
        allowedSources: t.sources,
      },
    });
    console.log(`  ✓ Transition: ${t.from} → ${t.to}`);
  }

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
