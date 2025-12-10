# Лабораторна робота №3 — Валідація, обробка помилок, ORM та БД
**Стек:** Node.js + Express + TypeScript + PostgreSQL + Prisma

У цій лабораторній роботі реалізовано REST API (Expense Tracker) з:
- PostgreSQL (через `docker compose`)
- Prisma ORM + міграції
- Валідація вхідних даних (Zod)
- Централізований `errorHandler`
- **Додаткове завдання (група 36): “Облік доходів”** — рахунок (Account), поповнення балансу та автоматичне списання при створенні витрати

---

## Варіант (група 36)
Група: **36** → `36 % 3 = 0` → **“Облік доходів”**.

Реалізація:
- Кожен користувач має `Account(balance)`
- `POST /account/topup` — поповнення балансу (дохід)
- `POST /record` — створення витрати та **автоматичне списання** з балансу
- Від’ємний баланс **заборонений**: якщо коштів недостатньо → **400 Insufficient funds**

---

## Вимоги до оточення
- Node.js
- Docker + Docker Compose

---

## Налаштування
```bash
npm install
cp .env.example .env
```

### Приклад `.env`
```env
PORT=8080
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app?schema=public"
```

---

## Запуск бази даних
```bash
docker compose up -d db
```

---

## Prisma (версія 6.19.1)
```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## Запуск API
```bash
npm run dev
```

База URL за замовчуванням: `http://localhost:8080`

---

## Endpoints

### Health
- `GET /healthcheck`

### Users
- `POST /user` — створити користувача (автоматично створює `Account`)
- `GET /users` — список користувачів
- `GET /user/:user_id` — отримати користувача
- `DELETE /user/:user_id` — видалити користувача

### Categories
- `POST /category` — створити категорію
- `GET /category` — список категорій
- `DELETE /category?category_id=<uuid>` — видалити категорію (сумісно з ЛР2)

### Records (витрати)
- `POST /record` — створити витрату (списує кошти з Account)
- `GET /record/:record_id` — отримати запис
- `DELETE /record/:record_id` — видалити запис
- `GET /record?user_id=<uuid>&category_id=<uuid>`
  - потрібно передати **хоча б один** параметр: `user_id` або `category_id`
  - якщо викликати `GET /record` без параметрів → **400**

### Account (додаткове завдання)
- `GET /account/:user_id` — поточний баланс
- `POST /account/topup` — поповнення
  - body: `{ "user_id": "<uuid>", "amount": 100 }`

---

## Postman
Імпорт:
- `postman/Lab3.collection.json`
- `postman/Lab3.local.environment.json`
- `postman/Lab3.prod.environment.json`

Використані змінні:
- `{{baseUrl}}`
- `{{userId}}`
- `{{categoryId}}`
- `{{recordId}}`

---

## Скріншот Postman Flow
Додай скріншот сюди:

![Postman Flow](assets/lab2.png)
