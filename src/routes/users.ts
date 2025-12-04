import { Router } from "express";
import { createUser, deleteUser, getUser, listUsers } from "../storage";

export const usersRouter = Router();

usersRouter.get("/user/:user_id", (req, res) => {
  const user = getUser(req.params.user_id);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user);
});

usersRouter.delete("/user/:user_id", (req, res) => {
  const ok = deleteUser(req.params.user_id);
  if (!ok) return res.status(404).json({ message: "User not found" });
  return res.json({ message: "User deleted" });
});

usersRouter.post("/user", (req, res) => {
  const name = String(req.body?.name ?? "").trim();
  if (!name) return res.status(400).json({ message: "name is required" });

  const user = createUser(name);
  return res.status(201).json(user);
});

usersRouter.get("/users", (_req, res) => {
  return res.json(listUsers());
});
