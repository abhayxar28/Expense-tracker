
import express from 'express';
import cors from 'cors';
import transactionRouter from './routes/transactions'
import userRouter from './routes/users';
import expenseRouter from './routes/expenses'
import incomeRouter from './routes/income'
import aiRouter from './routes/ai/ai'

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use('/api/v1/user', userRouter)
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/expenses', expenseRouter)
app.use('/api/v1/incomes', incomeRouter)
app.use('/api/v1/', aiRouter);

app.listen(PORT, () => {
  console.log(`Server is running `);
});
