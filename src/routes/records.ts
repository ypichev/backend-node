import { Router } from "express";
import { prisma } from "../db/prisma";
import { HttpError } from "../errors/httpError";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody, validateQuery } from "../middleware/validate";
import {
  CreateRecordSchema,
  RecordFilterQuerySchema,
} from "../validation/schemas";

export const recordsRouter = Router();

recordsRouter.get(
  "/record/:record_id",
  asyncHandler(async (req, res) => {
    const recordId = req.params.record_id;

    const rec = await prisma.record.findUnique({ where: { id: recordId } });
    if (!rec) throw new HttpError(404, "Record not found");

    return res.json({
      id: rec.id,
      userId: rec.userId,
      categoryId: rec.categoryId,
      createdAt: rec.createdAt.toISOString(),
      amount: rec.amount,
    });
  })
);

recordsRouter.delete(
  "/record/:record_id",
  asyncHandler(async (req, res) => {
    const recordId = req.params.record_id;

    const rec = await prisma.record.findUnique({ where: { id: recordId } });
    if (!rec) throw new HttpError(404, "Record not found");

    await prisma.record.delete({ where: { id: recordId } });

    return res.json({ message: "Record deleted" });
  })
);

recordsRouter.post(
  "/record",
  validateBody(CreateRecordSchema),
  asyncHandler(async (req, res) => {
    const { user_id, category_id, amount } = req.body as {
      user_id: string;
      category_id: string;
      amount: number;
    };

    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.findUnique({ where: { id: user_id } });
      if (!user) throw new HttpError(404, "User not found");

      const category = await tx.category.findUnique({
        where: { id: category_id },
      });
      if (!category) throw new HttpError(404, "Category not found");

      const account = await tx.account.findUnique({ where: { userId: user_id } });
      if (!account) throw new HttpError(404, "Account not found");

      if (account.balance < amount) {
        throw new HttpError(400, "Insufficient funds", {
          balance: account.balance,
          required: amount,
        });
      }

      const newBalance = account.balance - amount;

      await tx.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });

      const rec = await tx.record.create({
        data: { userId: user_id, categoryId: category_id, amount },
      });

      return { rec, newBalance };
    });

    return res.status(201).json({
      id: result.rec.id,
      userId: result.rec.userId,
      categoryId: result.rec.categoryId,
      createdAt: result.rec.createdAt.toISOString(),
      amount: result.rec.amount,
      accountBalance: result.newBalance,
    });
  })
);

recordsRouter.get(
  "/record",
  validateQuery(RecordFilterQuerySchema),
  asyncHandler(async (req, res) => {
    const { user_id, category_id } = req.query as {
      user_id?: string;
      category_id?: string;
    };

    const where: any = {};
    if (user_id) where.userId = user_id;
    if (category_id) where.categoryId = category_id;

    const items = await prisma.record.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.json(
      items.map((r: any) => ({
        id: r.id,
        userId: r.userId,
        categoryId: r.categoryId,
        createdAt: r.createdAt.toISOString(),
        amount: r.amount,
      }))
    );
  })
);
