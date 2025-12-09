import { Router } from "express";
import { prisma } from "../db/prisma";
import { HttpError } from "../errors/httpError";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { TopUpSchema } from "../validation/schemas";

export const accountsRouter = Router();

accountsRouter.get(
  "/account/:user_id",
  asyncHandler(async (req, res) => {
    const userId = req.params.user_id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpError(404, "User not found");

    const account = await prisma.account.findUnique({ where: { userId } });
    if (!account) throw new HttpError(404, "Account not found");

    return res.json({ userId: account.userId, balance: account.balance });
  })
);

accountsRouter.post(
  "/account/topup",
  validateBody(TopUpSchema),
  asyncHandler(async (req, res) => {
    const { user_id, amount } = req.body as { user_id: string; amount: number };

    const updated = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.findUnique({ where: { id: user_id } });
      if (!user) throw new HttpError(404, "User not found");

      const account = await tx.account.findUnique({ where: { userId: user_id } });
      if (!account) throw new HttpError(404, "Account not found");

      return tx.account.update({
        where: { id: account.id },
        data: { balance: account.balance + amount },
      });
    });

    return res.json({ userId: updated.userId, balance: updated.balance });
  })
);
