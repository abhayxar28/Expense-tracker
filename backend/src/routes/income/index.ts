import { Router, Response } from "express";
import { prisma } from "../../lib/prisma";
import { AuthenticatedRequest } from "../../types";
import { authenticateJWT } from "../../middleware/auth";

const router = Router();

router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const incomes = await prisma.transaction.findMany({
      where: {
        category: 'income'
      },orderBy:{
        date: 'asc'
      }
    });

    res.status(200).json({ incomes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch incomes' });
  }
});

router.get('/count', authenticateJWT,async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return 
    }

    const incomeCount = await prisma.transaction.count({
      where: {
        category: 'income',
      },
    });

    res.status(200).json({ count: incomeCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch income count" });
  }
});

router.get('/sum', authenticateJWT, async(req: AuthenticatedRequest, res: Response)=>{
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return 
    }

    const result = await prisma.transaction.aggregate({
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
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate total income amount" });
  }
})

export default router;