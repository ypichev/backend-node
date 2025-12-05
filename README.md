# REST API (Node.js + Express + TypeScript)

This lab implements a simple Expense Tracker REST API **without a database** (in-memory storage).

## Requirements
- Implement the required REST endpoints (Users, Categories, Records)
- `GET /record` must support filtering by `user_id` and/or `category_id`
- If `GET /record` is called **without** query parameters, the API must return **400**
- Provide Postman **Collection** and **2 Environments** (local + prod)
- Provide a Postman Flow screenshot in `assets/lab2.png`

## Run locally
```bash
npm install
cp .env.example .env
npm run dev
```

Service default: `http://localhost:8080`

## Endpoints

### Health
- `GET /healthcheck`

### Users
- `GET /user/:user_id`
- `DELETE /user/:user_id`
- `POST /user`
  - body: `{ "name": "Alice" }`
- `GET /users`

### Categories
- `GET /category`
- `POST /category`
  - body: `{ "name": "Food" }`
- `DELETE /category`
  - used in this project as: `DELETE /category?category_id=<id>`

### Records
- `GET /record/:record_id`
- `DELETE /record/:record_id`
- `POST /record`
  - body: `{ "user_id": "u1", "category_id": "c1", "amount": 123 }`
- `GET /record?user_id=<id>&category_id=<id>`
  - at least one of `user_id` or `category_id` is required

## Postman
Import:
- `postman/Lab2.collection.json`
- `postman/Lab2.local.environment.json`
- `postman/Lab2.prod.environment.json`

### Variables used in requests
- `{{baseUrl}}` — API base URL
- `{{userId}}` — created user id
- `{{categoryId}}` — created category id
- `{{recordId}}` — created record id

## Postman Flow screenshot

![Postman Flow](assets/lab2.png)
