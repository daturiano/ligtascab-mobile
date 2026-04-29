import { z } from 'zod';

export const LoginSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be 10 digits.')
    .max(10, 'Phone number must be 10 digits.')
    .regex(/^[9][0-9]*$/, 'Phone number must start with 9.'),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

export const MobileSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be 10 digits.')
    .max(10, 'Phone number must be 10 digits.')
    .regex(/^[9][0-9]*$/, 'Phone number must start with 9.'),
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'Only digits are allowed'),
});

export const AccountSetupSchema = z.object({
  fullName: z.string().max(100).min(4),
  email: z.email(),
  phone: z.string().min(10).max(15),
  address: z.string().max(120),
  contact_person: z.string().min(2, 'Contact person name is required').max(100),
  contact_person_number: z
    .string()
    .min(10, 'Contact number must be 10 digits')
    .max(10, 'Contact number must be 10 digits')
    .regex(/^[9][0-9]*$/, 'Phone number must start with 9'),
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
  ticket_number: z.string(),
  ride_id: z.string(),
});

export type CreateAccount = z.infer<typeof CreateAccountSchema>;

export const PickupLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(1, 'Address is required'),
  name: z.string().nullish(),
});

export const PickupRequestFormSchema = z
  .object({
    origin: PickupLocationSchema,
    destination: PickupLocationSchema,
  })
  .refine(
    (data) =>
      !(
        data.origin.latitude === data.destination.latitude &&
        data.origin.longitude === data.destination.longitude
      ),
    { message: 'Pickup and destination must be different locations.', path: ['destination'] }
  );

export type PickupRequestForm = z.infer<typeof PickupRequestFormSchema>;
