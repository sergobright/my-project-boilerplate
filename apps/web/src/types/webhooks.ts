/**
 * Базовые типы данных для интеграции с внешними оркестраторами (например, N8N).
 * Полезная нагрузка (payload), которая приходит на эндпоинт /api/webhooks/n8n/route.ts
 */

export interface N8nWebhookPayload {
  event: 'message.received' | 'card.status_changed' | 'order.updated' | 'listing.synced' | string;
  data: unknown;
}

/**
 * Входящее сообщение из внешнего канала (например, Avito)
 */
export interface N8nMessageReceivedEvent {
  companyId: string;
  contact: {
    externalUserId: string;
    name?: string;
    avatarUrl?: string;
    phone?: string;
  };
  listing: {
    externalListingId: string;
    title?: string;
    price?: number;
  };
  message: {
    externalMessageId: string;
    content: string;
    attachments?: Array<{
      url: string;
      type: string;
      name?: string;
    }>;
  };
}

/**
 * Искусственный интеллект или системный процесс изменил статус карточки
 */
export interface N8nStatusChangedEvent {
  cardId: string;
  newStatusSlug: string;
  source: 'ai' | 'avito' | 'n8n' | 'system';
  reason?: string;
  aiSummaryUpdate?: string;
}

/**
 * Внешний статус заказа обновился (например, Avito Доставка: В пути -> Получено)
 */
export interface N8nOrderUpdatedEvent {
  cardId: string;
  externalOrderId: string;
  newExternalStatus: string;
  trackingCode?: string;
  estimatedDate?: string;
}
