import { Router, Response } from "express";
import {prisma} from '../../lib/prisma';
import { AuthenticatedRequest } from "../../types";
import { authenticateJWT } from "../../middleware/auth";

const router = Router();

router.post('/', authenticateJWT ,async (req: AuthenticatedRequest, res: Response) => {
  const { title, amount, category, icon,date } = req.body;
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const transaction = await prisma.transaction.create({
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
  } catch (err) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});


router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const transactions = await prisma.transaction.findMany({
      orderBy:{
        date: 'desc'
      }
    });

    if(!transactions){
      res.status(403).json({
        message: 'No transactions'
      })
      return;
    }

    res.status(200).json({ transactions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.get('/expense', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        category:"expense"
      },
      orderBy:{
        date: 'desc'
      }
    });

    if(!transactions){
      res.status(403).json({
        message: 'No transactions'
      })
      return;
    }

    res.status(200).json({ transactions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.get('/income', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        category:"income"
      },
      orderBy:{
        date: 'desc'
      }
    });

    if(!transactions){
      res.status(403).json({
        message: 'No transactions'
      })
      return;
    }

    res.status(200).json({ transactions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.get('/count', authenticateJWT ,async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return 
    }

    const count = await prisma.transaction.count({
      where: {
        userId: req.userId,
      },
    });

    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transaction count" });
  }
});

router.get('/sum', authenticateJWT, async(req: AuthenticatedRequest, res: Response)=>{
  try {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return 
    }

    const incomeResult = await prisma.transaction.aggregate({
      where: {
        userId: req.userId,
        category: "income",
      },
      _sum: {
        amount: true,
      },
    });

      const expenseResult = await prisma.transaction.aggregate({
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

  } catch (err) {
    res.status(500).json({ error: "Failed to calculate total amount" });
  }
})

router.delete('/:todoId', authenticateJWT, async(req: AuthenticatedRequest, res: Response)=>{
  const todoId = req.params.todoId
  try{
    await prisma.transaction.delete({
      where: {
        id: todoId
      }
    })
    res.status(200).json({ message: "Transaction deleted successfully" });
  }catch(err){
    res.status(500).json({error: "Failed to delete transaction"})
  }
})


export default router;
