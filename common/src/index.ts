import {z} from 'zod'

export const signupInput = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
    name: z.string().min(1, "Name is required").max(100),
    profileImage: z.string()
})

export const signinInput = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(1, "Password is required")
})

export const transactionInput = z.object({
    title: z.string().min(1, "Title is required"),
    amount: z.number().min(1, "Amount is required"),
    category: z.string(),
    icon:z.string()
});


export type SignupParams = z.infer<typeof signupInput>

export type SigninParams = z.infer<typeof signinInput>

export type TransactionParams = z.infer<typeof transactionInput>