import * as z from 'zod';

export const LoginSchema = z.object({
  phoneNumber: z
    .string()
    .min(12, 'Phone number must be 12 digits.')
    .max(12, 'Phone number must be 12 digits.')
    .regex(/^[0-9]+$/, 'Phone number must contain only digits.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

export const MobileSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be 10 digits.')
    .max(10, 'Phone number must be 10 digits.')
    .regex(/^[0-9]+$/, 'Phone number must contain only digits.'),
});
