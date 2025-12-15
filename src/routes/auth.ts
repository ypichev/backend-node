import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { z } from "zod";

import { prisma } from "../db/prisma";
import { HttpError } from "../errors/httpError";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";

export const authRouter = Router();

const RegisterSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});

const LoginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});

authRouter.post(
  "/auth/register",
  validateBody(RegisterSchema),
  asyncHandler(async (req, res) => {
    const { username, password } = req.body as { username: string; password: string };

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) throw new HttpError(409, "User already exists");

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx: any) => {
      const created = await tx.user.create({
        data: {
          username,
          passwordHash,
        },
      });


      if (tx.account?.create) {
        await tx.account.create({ data: { userId: created.id, balance: 0 } });
      }

      return created;
    });

    return res.status(201).json({ id: user.id, username: user.username });
  })
);

authRouter.post(
  "/auth/login",
  validateBody(LoginSchema),
  asyncHandler(async (req, res) => {
    const { username, password } = req.body as { username: string; password: string };

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !user.passwordHash) throw new HttpError(401, "Invalid credentials");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new HttpError(401, "Invalid credentials");

    const secretEnv = process.env.JWT_SECRET_KEY;
    if (!secretEnv) throw new HttpError(500, "JWT secret is not configured");

    const secret: Secret = secretEnv;
    const expiresIn = process.env.JWT_EXPIRES_IN ?? "7d";

    const options: SignOptions = { expiresIn };

    const access_token = jwt.sign({ userId: user.id }, secret, options);
    return res.json({ access_token });
  })
);
