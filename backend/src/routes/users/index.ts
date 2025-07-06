import { Router, Response } from "express";
import { prisma } from "../../lib/prisma";
import { AuthenticatedRequest } from "../../types";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authenticateJWT } from "../../middleware/auth";
import { signupInput, signinInput } from "@ratatsam22/common";

dotenv.config();

const router = Router();

router.post("/signup", async (req: AuthenticatedRequest, res: Response) => {
  const parsedInput = signupInput.safeParse(req.body);

  if (!parsedInput.success) {
    res.status(400).json({ error: parsedInput.error.flatten() });
    return;
  }

  const { email, password, name, profileImage } = parsedInput.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      res.status(403).json({ message: "User already exists" });
      return;
    }

    await prisma.user.create({
      data: {
        email,
        password,
        name,
        profileImage,
      },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signin", async (req: AuthenticatedRequest, res: Response) => {
  const parsedInput = signinInput.safeParse(req.body);

  if (!parsedInput.success) {
    res.status(400).json({ error: parsedInput.error.flatten() });
    return;
  }

  const { email, password } = parsedInput.data;

  try {
    const user = await prisma.user.findUnique({ where: { email, password }, select:{
      email: true,
      name: true,
      profileImage: true,
      id: true
    } });

    if (!user) {
      res.status(403).json({ message: "Incorrect email or password" });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "5d",
    });

    res.json({
      message: "User signed in successfully",
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/me", authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
