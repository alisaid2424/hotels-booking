import { z } from "zod";

export const schemaContact = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),

  lastName: z.string().min(2, "Last name must be at least 2 characters"),

  email: z.string().email("Invalid email address"),

  message: z.string().min(10, "Message must be at least 10 characters"),

  agreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy",
  }),
});

export type ContactType = z.infer<typeof schemaContact>;
