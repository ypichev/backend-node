import express from "express";
import { usersRouter } from "./routes/users";
import { categoriesRouter } from "./routes/categories";
import { recordsRouter } from "./routes/records";
import { accountsRouter } from "./routes/accounts";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/auth";
import { requireAuth } from "./middleware/auth";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/healthcheck", (_req, res) => {
    res.status(200).json({ status: "ok", date: new Date().toISOString() });
  });

  app.use(authRouter);

  app.use(requireAuth);

  app.use(usersRouter);
  app.use(categoriesRouter);
  app.use(recordsRouter);
  app.use(accountsRouter);

  app.use(errorHandler);
  return app;
}
