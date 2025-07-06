"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const users_1 = __importDefault(require("./routes/users"));
const expenses_1 = __importDefault(require("./routes/expenses"));
const income_1 = __importDefault(require("./routes/income"));
const ai_1 = __importDefault(require("./routes/ai/ai"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use('/api/v1/user', users_1.default);
app.use('/api/v1/transactions', transactions_1.default);
app.use('/api/v1/expenses', expenses_1.default);
app.use('/api/v1/incomes', income_1.default);
app.use('/api/v1/', ai_1.default);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
