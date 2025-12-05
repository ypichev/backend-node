import { Router } from "express";
import { createRecord, deleteRecord, getCategory, getRecord, getUser, listRecordsFiltered } from "../storage";

export const recordsRouter = Router();

recordsRouter.get("/record/:record_id", (req, res) => {
  const rec = getRecord(req.params.record_id);
  if (!rec) return res.status(404).json({ message: "Record not found" });
  return res.json(rec);
});

recordsRouter.delete("/record/:record_id", (req, res) => {
  const ok = deleteRecord(req.params.record_id);
  if (!ok) return res.status(404).json({ message: "Record not found" });
  return res.json({ message: "Record deleted" });
});

recordsRouter.post("/record", (req, res) => {
  const userId = String(req.body?.user_id ?? "").trim();
  const categoryId = String(req.body?.category_id ?? "").trim();
  const amountRaw = req.body?.amount;

  const amount = typeof amountRaw === "number" ? amountRaw : Number(amountRaw);

  if (!userId) return res.status(400).json({ message: "user_id is required" });
  if (!categoryId) return res.status(400).json({ message: "category_id is required" });
  if (!Number.isFinite(amount)) return res.status(400).json({ message: "amount must be a number" });

  if (!getUser(userId)) return res.status(404).json({ message: "User not found" });
  if (!getCategory(categoryId)) return res.status(404).json({ message: "Category not found" });

  const rec = createRecord(userId, categoryId, amount);
  return res.status(201).json(rec);
});

recordsRouter.get("/record", (req, res) => {
  const userId = typeof req.query.user_id === "string" ? req.query.user_id.trim() : "";
  const categoryId = typeof req.query.category_id === "string" ? req.query.category_id.trim() : "";

  if (!userId && !categoryId) {
    return res.status(400).json({ message: "user_id and/or category_id query params are required" });
  }

  const items = listRecordsFiltered({
    userId: userId || undefined,
    categoryId: categoryId || undefined,
  });

  return res.json(items);
});
