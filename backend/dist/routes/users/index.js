"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../../middleware/auth");
const common_1 = require("@ratatsam22/common");
dotenv_1.default.config();
const router = (0, express_1.Router)();
router.post("/signup", async (req, res) => {
    const parsedInput = common_1.signupInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.status(400).json({ error: parsedInput.error.flatten() });
        return;
    }
    const { email, password, name, profileImage } = parsedInput.data;
    try {
        const existingUser = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(403).json({ message: "User already exists" });
            return;
        }
        await prisma_1.prisma.user.create({
            data: {
                email,
                password,
                name,
                profileImage,
            },
        });
        res.status(201).json({ message: "User created successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/signin", async (req, res) => {
    const parsedInput = common_1.signinInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.status(400).json({ error: parsedInput.error.flatten() });
        return;
    }
    const { email, password } = parsedInput.data;
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { email, password }, select: {
                email: true,
                name: true,
                profileImage: true,
                id: true
            } });
        if (!user) {
            res.status(403).json({ message: "Incorrect email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "5d",
        });
        res.json({
            message: "User signed in successfully",
            token,
            user
        });
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/me", auth_1.authenticateJWT, async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = await prisma_1.prisma.user.findUnique({
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.default = router;
