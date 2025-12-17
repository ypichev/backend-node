import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        account: { create: { balance: 0 } },
      },
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

    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) throw new HttpError(500, "JWT secret is not configured");

    const expiresIn = (process.env.JWT_EXPIRES_IN ?? "7d") as any;
    const access_token = jwt.sign({ userId: user.id }, secret, { expiresIn });
    return res.json({ access_token });
  })
);
