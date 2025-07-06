"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticateJWT, async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const expenses = await prisma_1.prisma.transaction.findMany({
            where: {
                category: 'expense'
            }, orderBy: {
                date: 'asc'
            }
        });
        res.status(200).json({ expenses });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});
router.get('/count', auth_1.authenticateJWT, async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const expenseCount = await prisma_1.prisma.transaction.count({
            where: {
                category: 'expense',
            },
        });
        res.status(200).json({ count: expenseCount });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch expense count" });
    }
});
router.get('/sum', auth_1.authenticateJWT, async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const result = await prisma_1.prisma.transaction.aggregate({
            where: {
                category: 'expense',
            }, orderBy: {
                date: 'asc'
            },
            _sum: {
                amount: true,
            },
        });
        res.status(200).json({
            totalAmount: result._sum.amount || 0,
        });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to calculate expenses amount" });
    }
});
exports.default = router;
