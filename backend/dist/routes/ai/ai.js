"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../../middleware/auth");
const prisma_1 = require("../../lib/prisma");
dotenv_1.default.config();
const router = express_1.default.Router();
const openai = new openai_1.default({
    baseURL: `${process.env.OPEN_API_KEY}`,
    apiKey: process.env.OPENROUTER_API_KEY,
});
router.get("/ai-summary", auth_1.authenticateJWT, async (req, res) => {
    try {
        const transactions = await prisma_1.prisma.transaction.findMany({
            where: { userId: req.userId },
            orderBy: { date: "desc" },
        });
        if (!transactions.length) {
            res.status(400).json({ error: "No transactions found." });
            return;
        }
        const summary = transactions
            .map((t) => `- ₹${t.amount} for ${t.title}`)
            .join("\n");
        const prompt = `
      Analyze these transactions from the past month (${new Date().toLocaleString('default', { month: 'long' })}):
      ${summary}

      INSTRUCTIONS:
      1. First separate transactions into income and expenses
      2. Calculate totals for each category
      3. Follow this exact analysis format:

      ## Financial Summary (${new Date().toLocaleString('default', { month: 'long' })})

      ### Income & Expenses
      - Total Income: **₹X** (from Y sources)
      - Total Expenses: **₹Y** 
        - Essentials: **₹A** (Rent, Food, Utilities)
        - Discretionary: **₹B** (Entertainment, Dining)
      - Net Savings: **₹Z** (X-Y)

      ### Key Observations
      1. [Most significant spending category]
      2. [Notable pattern or anomaly]

      ### Recommendations
      1. **Immediate Actions**
        - Reduce spending on [specific category] by ₹X/month
        - Consider [specific suggestion] for saving ₹Y

      2. **Investment Options**
        - Based on your ₹Z savings: [specific instruments]

      3. **Long-Term Planning**
        - [Retirement/emergency fund advice]

      RULES:
      - Only use data provided
      - Never invent numbers
      - Mark uncertain estimates with (~)
      - If insufficient data, say "Not enough data to determine [X]"
      - Always use emojis 
      `;
        const completion = await openai.chat.completions.create({
            model: "google/gemma-3n-e2b-it:free",
            messages: [{ role: "user", content: prompt }],
        });
        const reply = completion.choices?.[0]?.message?.content || "No reply from AI";
        res.json({ result: reply });
    }
    catch (e) {
        res.status(500).json({ error: e?.response?.data || e.message || "AI failed" });
    }
});
exports.default = router;
