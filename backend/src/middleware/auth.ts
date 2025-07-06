
import { AuthenticatedRequest } from "../types";
import { NextFunction, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export function authenticateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verify(token, process.env.JWT_SECRET!) as JwtPayload;

    req.userId = decoded.id;

    next();
  } catch (e) {
    console.error("JWT Error:", e);
    res.status(403).json({ message: "Invalid or expired token" });
  }
}
