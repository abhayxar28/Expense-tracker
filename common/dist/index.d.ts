import { z } from 'zod';
export declare const signupInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
    profileImage: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    profileImage: string;
}, {
    email: string;
    password: string;
    name: string;
    profileImage: string;
}>;
export declare const signinInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const transactionInput: z.ZodObject<{
    title: z.ZodString;
    amount: z.ZodNumber;
    category: z.ZodString;
    icon: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    amount: number;
    category: string;
    icon: string;
}, {
    title: string;
    amount: number;
    category: string;
    icon: string;
}>;
export type SignupParams = z.infer<typeof signupInput>;
export type SigninParams = z.infer<typeof signinInput>;
export type TransactionParams = z.infer<typeof transactionInput>;
