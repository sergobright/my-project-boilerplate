import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/webhooks/n8n
 * Принимает события от N8N.
 * N8N передаёт секрет в заголовке X-N8N-Secret для верификации.
 */
export async function POST(request: NextRequest) {
  // Верификация секрета
  const secret = request.headers.get("x-n8n-secret");
  if (secret !== process.env.N8N_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = body as {
    event: string;
    data?: unknown;
  };

  const { event, data } = payload;

  // Роутинг событий от N8N
  switch (event) {
    case "message.received":
      // TODO: обработка входящего сообщения, создание/обновление карточки
      console.log("[N8N webhook] message.received", data);
      break;

    case "card.status_changed":
      // TODO: обновление статуса карточки
      console.log("[N8N webhook] card.status_changed", data);
      break;

    case "order.updated":
      // TODO: обновление заказа/доставки из Avito
      console.log("[N8N webhook] order.updated", data);
      break;

    case "listing.synced":
      // TODO: синхронизация объявлений
      console.log("[N8N webhook] listing.synced", data);
      break;

    default:
      console.warn("[N8N webhook] Unknown event:", event);
  }

  return NextResponse.json({ ok: true });
}
