#!/bin/bash
# Description: Проверяет статус Docker контейнеров проекта
# Usage: ./skills/check_docker.sh

echo "🔍 Проверка статуса Docker контейнеров..."
docker compose ps
echo ""
echo "📊 Логи приложения (последние 10 строк):"
docker compose logs --tail=10 app
