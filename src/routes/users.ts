import { Router } from "express";
import { prisma } from "../db/prisma";
import { HttpError } from "../errors/httpError";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { CreateUserSchema } from "../validation/schemas";

export const usersRouter = Router();

usersRouter.post(
  "/user",
  validateBody(CreateUserSchema),
  asyncHandler(async (req, res) => {
    const { name } = req.body as { name: string };

    const user = await prisma.$transaction(async (tx: any) => {
      const created = await tx.user.create({ data: { name } });
      await tx.account.create({ data: { userId: created.id, balance: 0 } });
      return created;
    });

    return res.status(201).json({ id: user.id, name: user.name });
  })
);

usersRouter.get(
  "/users",
  asyncHandler(async (_req, res) => {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    return res.json(users.map((u: any) => ({ id: u.id, name: u.name })));
  })
);

usersRouter.get(
  "/user/:user_id",
  asyncHandler(async (req, res) => {
    const userId = req.params.user_id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpError(404, "User not found");

    return res.json({ id: user.id, name: user.name });
  })
);

usersRouter.delete(
  "/user/:user_id",
  asyncHandler(async (req, res) => {
    const userId = req.params.user_id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpError(404, "User not found");

    await prisma.user.delete({ where: { id: userId } });

    return res.json({ message: "User deleted" });
  })
);
