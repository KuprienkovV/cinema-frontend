Приложение на Nuxt 3 для каталога фильмов, сеансов и бронирований.

## Требования

- Node.js 20 LTS (проверено на 20.11.1)
- npm 10+
- Запущенный backend с API (`http://localhost:3022` по умолчанию если взять .env из .env.example)

## Быстрый старт

```bash
npm install           # установка зависимостей
npm run dev           # запуск dev-сервера http://localhost:3000
```

Основные команды:

```bash
npm run build         # сборка продакшен-версии
npm run preview       # предпросмотр собранного проекта
npm test              # запуск vitest (Nuxt Test Utils + happy-dom)
```

## Тестирование

- Тесты выполнены на Vitest + @nuxt/test-utils.
- Перед запуском убедитесь, что зависимости установлены (`npm install`).
- Для одиночного прогона: `npm test -- --run`.

## Настройки и переменные

- `NUXT_PUBLIC_API_BASE` — базовый URL backend API (по умолчанию `http://localhost:3022`).

