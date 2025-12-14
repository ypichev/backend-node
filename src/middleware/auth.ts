import type { RequestHandler } from "express";
import jwt, { type Secret } from "jsonwebtoken";
import { HttpError } from "../errors/httpError";

type JwtPayload = { userId: string };

export const requireAuth: RequestHandler = (req, _res, next) => {
  try {
    const header = req.header("authorization") || req.header("Authorization");
    if (!header || !header.startsWith("Bearer ")) {
      throw new HttpError(401, "Request does not contain an access token.", {
        error: "authorization_required",
      });
    }

    const token = header.slice("Bearer ".length).trim();

    const secretEnv = process.env.JWT_SECRET_KEY;
    if (!secretEnv) throw new HttpError(500, "JWT secret is not configured");

    const secret: Secret = secretEnv;

    const decoded = jwt.verify(token, secret) as JwtPayload;
    (req as any).userId = decoded.userId;

    next();
  } catch (e: any) {
    if (e?.name === "TokenExpiredError") {
      return next(new HttpError(401, "The token has expired.", { error: "token_expired" }));
    }
    if (e?.name === "JsonWebTokenError") {
      return next(new HttpError(401, "Signature verification failed.", { error: "invalid_token" }));
    }
    next(e);
  }
};
