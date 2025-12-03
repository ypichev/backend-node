import express from "express";
import { usersRouter } from "./routes/users";
import { categoriesRouter } from "./routes/categories";
import { recordsRouter } from "./routes/records";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/", (_req, res) => res.json({ message: "Hello!" }));

  app.get("/healthcheck", (_req, res) => {
    res.status(200).json({ status: "ok", date: new Date().toISOString() });
  });

  app.use(usersRouter);
  app.use(categoriesRouter);
  app.use(recordsRouter);

  return app;
}
