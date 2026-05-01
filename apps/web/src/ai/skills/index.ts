import { z } from "zod";

/**
 * Universal AI Skills Registry
 * 
 * Эти инструменты (Tools) могут быть экспортированы как OpenAPI спецификация 
 * или MCP (Model Context Protocol) инструменты для использования в оркестраторах 
 * (N8N, LangChain, Dify, или встроенных IDE агентах).
 */

export const EscalateToHumanSkill = {
  name: "escalateToHuman",
  description: "Отключает AI-агента и переводит карточку в статус 'Ожидание человека'. Вызывается, когда агент не может обработать запрос или клиент требует оператора.",
  schema: z.object({
    cardId: z.string().describe("ID карточки/сделки в системе"),
    reason: z.string().describe("Причина, по которой потребовался человек (summary)"),
  }),
  // handler: async (args) => { ... }
};

export const ChangeStatusSkill = {
  name: "changeStatus",
  description: "Изменяет статус карточки в воронке продаж.",
  schema: z.object({
    cardId: z.string().describe("ID карточки/сделки"),
    newStatusSlug: z.enum(["inbox", "nurturing", "lost", "declined"]).describe("Новый статус"),
    reason: z.string().optional().describe("Причина изменения статуса (обязательно для отказов)"),
  }),
};

export const UpdateSummarySkill = {
  name: "updateSummary",
  description: "Обновляет краткую выжимку (AI Summary) по клиенту или сделке.",
  schema: z.object({
    cardId: z.string().describe("ID карточки/сделки"),
    summary: z.string().describe("Новый текст выжимки (до 500 символов)"),
  }),
};

// Экспортируем все скиллы как единый массив для удобной генерации MCP / OpenAPI
export const aiSkills = [
  EscalateToHumanSkill,
  ChangeStatusSkill,
  UpdateSummarySkill
];
