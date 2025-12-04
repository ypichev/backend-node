import { Router } from "express";
import { createCategory, deleteCategory, listCategories } from "../storage";

export const categoriesRouter = Router();

categoriesRouter.get("/category", (_req, res) => {
  return res.json(listCategories());
});

categoriesRouter.post("/category", (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  if (!name) return res.status(400).json({ message: "name is required" });

  const category = createCategory(name);
  return res.status(201).json(category);
});

categoriesRouter.delete("/category", (req, res) => {
  const idFromQuery = typeof req.query?.category_id === "string" ? req.query.category_id : undefined;
  const idFromBody = typeof req.body?.category_id === "string" ? req.body.category_id : undefined;
  const idFromBodyAlt = typeof req.body?.id === "string" ? req.body.id : undefined;

  const categoryId = (idFromQuery ?? idFromBody ?? idFromBodyAlt ?? "").trim();
  if (!categoryId) {
    return res.status(400).json({ message: "category_id is required (query or body)" });
  }

  const ok = deleteCategory(categoryId);
  if (!ok) return res.status(404).json({ message: "Category not found" });

  return res.json({ message: "Category deleted" });
});
