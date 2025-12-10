import { Router } from "express";
import { prisma } from "../db/prisma";
import { HttpError } from "../errors/httpError";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody, validateQuery } from "../middleware/validate";
import {
  CategoryDeleteQuerySchema,
  CreateCategorySchema,
} from "../validation/schemas";

export const categoriesRouter = Router();

categoriesRouter.get(
  "/category",
  asyncHandler(async (_req, res) => {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json(categories.map((c: any) => ({ id: c.id, name: c.name })));
  })
);

categoriesRouter.post(
  "/category",
  validateBody(CreateCategorySchema),
  asyncHandler(async (req, res) => {
    const { name } = req.body as { name: string };

    const category = await prisma.category.create({ data: { name } });

    return res.status(201).json({ id: category.id, name: category.name });
  })
);

categoriesRouter.delete(
  "/category",
  validateQuery(CategoryDeleteQuerySchema),
  asyncHandler(async (req, res) => {
    const { category_id } = req.query as { category_id: string };

    const existing = await prisma.category.findUnique({
      where: { id: category_id },
    });
    if (!existing) throw new HttpError(404, "Category not found");

    await prisma.category.delete({ where: { id: category_id } });

    return res.json({ message: "Category deleted" });
  })
);
