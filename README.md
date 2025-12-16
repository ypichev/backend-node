# karlyk-node-backend — Expense Tracker API
**Tech stack:** Node.js, Express, TypeScript, PostgreSQL, Prisma, Zod, JWT

Проєкт реалізує REST API для обліку витрат (категорії + записи витрат) та додаткову логіку “облік доходів” через рахунок користувача (Account).  
Починаючи з ЛР4, API захищений JWT-токеном: усі ендпоінти, окрім `healthcheck` та `auth/*`, потребують `Authorization: Bearer <token>`.

---

## Лабораторні роботи

### ЛР1 — Node.js + Express + TypeScript (базовий сервіс)
- Створена структура проєкту
- Підключено TypeScript
- Базовий запуск сервера та роутинг

### ЛР2 — CRUD для Users / Categories / Records + Postman
- Реалізовані ендпоінти:
  - користувачі
  - категорії
  - записи витрат
- Підготовлені Postman environment (local/prod) та collection
- Додано flow-скріншот Postman

### ЛР3 — БД та ORM (PostgreSQL + Prisma), валідація, обробка помилок
- PostgreSQL у Docker Compose
- Prisma ORM + міграції
- Zod-валидація (body/query)
- Централізований error handler
- **Додаткове завдання (група 36): “Облік доходів”**
  - `Account(balance)` для користувача
  - `POST /account/topup` — поповнення балансу
  - `POST /record` — створення витрати + автоматичне списання з балансу
  - Заборонено від’ємний баланс (помилка при нестачі коштів)

### ЛР4 — Авторизація (JWT) та захист API
- `POST /auth/register`
- `POST /auth/login` → повертає `access_token`
- Усі ендпоінти (окрім `GET /healthcheck` та `/auth/*`) захищені middleware `requireAuth`

---

## Вимоги
- Node.js (рекомендовано LTS)
- Docker + Docker Compose
- Postman (для перевірки)

---

## Налаштування та запуск

### 1) Встановити залежності
```bash
npm install
```

### 2) Налаштувати `.env`
```bash
cp .env.example .env
```

Приклад `.env`:
```env
PORT=8080
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app?schema=public"

JWT_SECRET_KEY=super_secret_change_me
JWT_EXPIRES_IN=7d
```

### 3) Запустити PostgreSQL
```bash
docker compose up -d db
```

### 4) Prisma (версія 6.19.1)
```bash
npx prisma generate
npx prisma migrate dev
```

### 5) Запустити сервер
```bash
npm run dev
```

Сервер за замовчуванням: `http://localhost:8080`

---

## Основні скрипти
```bash
npm run dev        # запуск у dev-режимі
npm run build      # збірка
npm run start      # запуск зібраної версії
```

---

## Авторизація (ЛР4)

### Реєстрація
`POST /auth/register`
```json
{
  "username": "testuser",
  "password": "12345678"
}
```

### Логін
`POST /auth/login`
```json
{
  "username": "testuser",
  "password": "12345678"
}
```

Відповідь:
```json
{
  "access_token": "<JWT_TOKEN>"
}
```

### Як викликати захищені ендпоінти
Додай заголовок:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Endpoints

### Public
- `GET /healthcheck`
- `POST /auth/register`
- `POST /auth/login`

### Protected (JWT required)

#### Users
- `POST /user`
- `GET /users`
- `GET /user/:user_id`
- `DELETE /user/:user_id`

#### Categories
- `POST /category`
- `GET /category`
- `DELETE /category?category_id=<uuid>`

#### Records (витрати)
- `POST /record`  
  Створює запис витрати та **списує кошти з Account**.
- `GET /record/:record_id`
- `DELETE /record/:record_id`
- `GET /record?user_id=<uuid>&category_id=<uuid>`  
  Треба передати хоча б один параметр: `user_id` або `category_id`.  
  Якщо без параметрів → 400.

#### Account (облік доходів)
- `GET /account/:user_id` — поточний баланс
- `POST /account/topup`
```json
{
  "user_id": "<uuid>",
  "amount": 1000
}
```

---

## Postman

### Імпорт
- ЛР2:
  - `postman/Lab2.collection.json`
  - `postman/Lab2.local.environment.json`
  - `postman/Lab2.prod.environment.json`
- ЛР4:
  - `postman/Lab4.collection.json`
  - `postman/Lab4.local.environment.json`
  - `postman/Lab4.prod.environment.json`

### Змінні environment
- `{{baseUrl}}`
- `{{username}}`, `{{password}}`
- `{{accessToken}}` (заповнюється після login)
- `{{userId}}`, `{{categoryId}}`, `{{recordId}}`, `{{balance}}`

---

## Структура проєкту (скорочено)
```text
src/
  app.ts
  main.ts
  db/
  middleware/
    auth.ts
    validate.ts
    errorHandler.ts
  routes/
    auth.ts
    users.ts
    categories.ts
    records.ts
    accounts.ts
  validation/
prisma/
  schema.prisma
postman/
assets/
  lab2.png
  lab4.png
```

---

## Postman Flow screenshots

### Lab 2 — Flow
![Postman Flow — Lab 2](assets/lab2.png)

### Lab 4 — Auth Flow
![Postman Flow — Lab 4](assets/lab4.png)
