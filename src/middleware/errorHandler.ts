import type { ErrorRequestHandler } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { HttpError } from "../errors/httpError";
import { isZodError } from "./validate";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (isZodError(err)) {
    return res.status(400).json({ message: "Validation error", details: err.issues });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Conflict", details: err.meta });
    }
    return res.status(400).json({
      message: "Database error",
      details: { code: err.code, meta: err.meta },
    });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
};
