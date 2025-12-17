import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "../db/prisma";
import { HttpError } from "../errors/httpError";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";

export const usersRouter = Router();

/**
 * NOTE:
 * In Lab 4 you normally create users via /auth/register.
 * This /user endpoint is kept for backwards compatibility with Lab 2.
 */

const CreateUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});

usersRouter.post(
  "/user",
  validateBody(CreateUserSchema),
  asyncHandler(async (req, res) => {
    const { username, password } = req.body as { username: string; password: string };

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) throw new HttpError(409, "Conflict", { reason: "username_taken" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: { username, passwordHash },
        select: { id: true, username: true, createdAt: true },
      });

      // Optional: if Account model exists in your Prisma schema (Lab 3 group 36),
      // create an initial account. We keep this safe for builds where Account isn't present.
      const anyTx = tx as any;
      if (anyTx.account?.create) {
        await anyTx.account.create({ data: { userId: created.id, balance: 0 } });
      }

      return created;
    });

    return res.status(201).json(user);
  })
);

usersRouter.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    return res.json(users);
  })
);

usersRouter.get(
  "/user/:user_id",
  asyncHandler(async (req, res) => {
    const userId = req.params.user_id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, createdAt: true },
    });

    if (!user) throw new HttpError(404, "User not found");
    return res.json(user);
  })
);

usersRouter.delete(
  "/user/:user_id",
  asyncHandler(async (req, res) => {
    const userId = req.params.user_id;

    await prisma.user.delete({ where: { id: userId } });

    return res.status(204).send();
  })
);
