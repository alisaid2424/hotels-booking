import { z } from "zod";

export const schemaHotelReg = z.object({
  name: z
    .string()
    .min(3, "Hotel name must be at least 3 characters")
    .max(100, "Hotel name is too long"),

  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(/^[0-9+()-\s]+$/, "Invalid phone number format"),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address is too long"),

  city: z.string().min(1, "City is required"),
});

export type HotelRegType = z.infer<typeof schemaHotelReg>;
