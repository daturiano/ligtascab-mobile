import { z } from 'zod';

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

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'Only digits are allowed'),
});

export const AccountSetupSchema = z.object({
  fullName: z.string().max(100).min(4),
  email: z.email(),
  phone: z.string().min(12).max(12),
  address: z.string().max(120),
  password: z
    .string()
    .min(6, {
      message: 'password must be at least 6 characters',
    })
    .max(30),
  confirm_password: z
    .string()
    .min(6, {
      message: 'password must be at least 6 characters',
    })
    .max(30),
});

export const CreateAccountSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
  email: z.email(),
  address: z.string(),
});

export const ReportSchema = z.object({
  type: z.string(),
  description: z.string().min(3).max(300),
  ride_id: z.string(),
});

export type CreateAccount = z.infer<typeof CreateAccountSchema>;
