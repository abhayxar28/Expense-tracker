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
        const incomes = await prisma_1.prisma.transaction.findMany({
            where: {
                category: 'income'
            }, orderBy: {
                date: 'asc'
            }
        });
        res.status(200).json({ incomes });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch incomes' });
    }
});
router.get('/count', auth_1.authenticateJWT, async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const incomeCount = await prisma_1.prisma.transaction.count({
            where: {
                category: 'income',
            },
        });
        res.status(200).json({ count: incomeCount });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch income count" });
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
                category: 'income'
            },
            _sum: {
                amount: true,
            },
        });
        const totalAmount = result._sum.amount;
        res.status(200).json({
            totalAmount
        });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to calculate total income amount" });
    }
});
exports.default = router;
