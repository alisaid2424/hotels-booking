import { z } from "zod";

export const bookingSchema = z
  .object({
    roomId: z.string(),
    checkInDate: z.string().min(1, "Check-in required"),
    checkOutDate: z.string().min(1, "Check-out required"),
    guests: z
      .number()
      .int()
      .min(1, "At least 1 guest")
      .max(10, "Maximum 10 guests"),
  })
  .refine((data) => new Date(data.checkOutDate) > new Date(data.checkInDate), {
    message: "Check-out must be after check-in",
    path: ["checkOutDate"],
  });

export type BookingSchemaType = z.infer<typeof bookingSchema>;
