import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";

export function validateBody(schema: ZodSchema): RequestHandler {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (e) {
      next(e);
    }
  };
}

export function validateQuery(schema: ZodSchema): RequestHandler {
  return (req, _res, next) => {
    try {
      schema.parse(req.query);
      next();
    } catch (e) {
      next(e);
    }
  };
}

export function isZodError(err: unknown): err is ZodError {
  return err instanceof ZodError;
}
