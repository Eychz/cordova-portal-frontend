import { z } from 'zod';

// Strong password regex: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const RegisterSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(passwordRegex, 'Password must contain uppercase, lowercase, number and special character (@$!%*?&)'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

export const OnboardingSchema = z.object({
  firstName: z.string().min(2, 'First name is too short').max(50, 'First name is too long'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name is too short').max(50, 'Last name is too long'),
  barangay: z.string().min(1, 'Please select a barangay'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type OnboardingInput = z.infer<typeof OnboardingSchema>;
