# Lab 1 — Template project (Node.js + Express + TypeScript)

## Requirements
- Deployed service
- Docker + docker-compose
- `GET /healthcheck` returns 200 with JSON containing current date and service status

## Local run
```bash
npm install
cp .env.example .env
npm run dev
```

## Build + run
```bash
npm run build
npm run start
```

## Docker
```bash
docker compose up --build
```

## Endpoints
- `GET /healthcheck`
  - Response example:
    ```json
    { "status": "ok", "date": "2025-12-17T12:34:56.789Z" }
    ```
