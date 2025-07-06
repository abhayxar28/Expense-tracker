"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticateJWT, async (req, res) => {
    const { title, amount, category, icon, date } = req.body;
    try {
        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const transaction = await prisma_1.prisma.transaction.create({
            data: {
                title,
                amount,
                category,
                icon,
                date,
                userId: req.userId,
            },
        });
        res.status(201).json(transaction);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});
router.get('/', auth_1.authenticateJWT, async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const transactions = await prisma_1.prisma.transaction.findMany({
            orderBy: {
                date: 'desc'
            }
        });
        if (!transactions) {
            res.status(403).json({
                message: 'No transactions'
            });
            return;
        }
        res.status(200).json({ transactions });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});
router.get('/expense', auth_1.authenticateJWT, async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const transactions = await prisma_1.prisma.transaction.findMany({
            where: {
                category: "expense"
            },
            orderBy: {
                date: 'desc'
            }
        });
        if (!transactions) {
            res.status(403).json({
                message: 'No transactions'
            });
            return;
        }
        res.status(200).json({ transactions });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});
router.get('/income', auth_1.authenticateJWT, async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const transactions = await prisma_1.prisma.transaction.findMany({
            where: {
                category: "income"
            },
            orderBy: {
                date: 'desc'
            }
        });
        if (!transactions) {
            res.status(403).json({
                message: 'No transactions'
            });
            return;
        }
        res.status(200).json({ transactions });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});
router.get('/count', auth_1.authenticateJWT, async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const count = await prisma_1.prisma.transaction.count({
            where: {
                userId: req.userId,
            },
        });
        res.status(200).json({ count });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch transaction count" });
    }
});
router.get('/sum', auth_1.authenticateJWT, async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const incomeResult = await prisma_1.prisma.transaction.aggregate({
            where: {
                userId: req.userId,
                category: "income",
            },
            _sum: {
                amount: true,
            },
        });
        const expenseResult = await prisma_1.prisma.transaction.aggregate({
            where: {
                userId: req.userId,
                category: "expense",
            },
            _sum: {
                amount: true,
            },
        });
        const totalIncome = incomeResult._sum.amount || 0;
        const totalExpenses = expenseResult._sum.amount || 0;
        res.status(200).json({
            balance: totalIncome - totalExpenses,
            totalExpenses,
            totalIncome
        });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to calculate total amount" });
    }
});
router.delete('/:todoId', auth_1.authenticateJWT, async (req, res) => {
    const todoId = req.params.todoId;
    try {
        await prisma_1.prisma.transaction.delete({
            where: {
                id: todoId
            }
        });
        res.status(200).json({ message: "Transaction deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete transaction" });
    }
});
exports.default = router;
