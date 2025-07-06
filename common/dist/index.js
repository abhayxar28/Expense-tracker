"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = require("zod");
exports.signupInput = zod_1.z.object({
    email: zod_1.z.string().min(1, "Email is required").email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
    name: zod_1.z.string().min(1, "Name is required").max(100),
    profileImage: zod_1.z.string()
});
exports.signinInput = zod_1.z.object({
    email: zod_1.z.string().min(1, "Email is required").email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required")
});
exports.transactionInput = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    amount: zod_1.z.number().min(1, "Amount is required"),
    category: zod_1.z.string(),
    icon: zod_1.z.string()
});
