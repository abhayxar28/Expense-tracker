import { Router, Response } from "express";
import { prisma } from "../../lib/prisma";
import { AuthenticatedRequest } from "../../types";
import { authenticateJWT } from "../../middleware/auth";

const router = Router();

router.get('/', authenticateJWT,async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const expenses = await prisma.transaction.findMany({
      where: {
        category: 'expense'
      }, orderBy:{
        date: 'asc'
      }
    });

    res.status(200).json({ expenses });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

router.get('/count', authenticateJWT,async(req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return
    }

    const expenseCount = await prisma.transaction.count({
      where: {
        category: 'expense',
      },
    });

    res.status(200).json({ count: expenseCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expense count" });
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
        category: 'expense',
        
      },orderBy:{
        date: 'asc'
      },
      _sum: {
        amount: true,
      },
    });

    res.status(200).json({
      totalAmount: result._sum.amount || 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate expenses amount" });
  }
})

export default router;