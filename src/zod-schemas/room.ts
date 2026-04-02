import { z } from "zod";

const ImageSchema = z.union([z.instanceof(File), z.string(), z.null()]);

export const RoomSchema = z.object({
  images: z
    .array(ImageSchema)
    .length(4)
    .refine((imgs) => imgs.some((img) => img !== null), {
      message: "Please upload at least one image",
    }),

  roomType: z.string().min(1, "Please select a room type"),

  pricePerNight: z
    .number()
    .refine((val) => val !== undefined, {
      message: "Price per night is required",
    })
    .min(1, "Price must be at least 1"),

  rate: z
    .number()
    .int({ message: "Rating must be an integer" })
    .min(1, { message: "Minimum rating is 1" })
    .max(5, { message: "Maximum rating is 5" }),

  amenities: z
    .object({
      "Free WiFi": z.boolean(),
      "Free Breakfast": z.boolean(),
      "Room Service": z.boolean(),
      "Mountain View": z.boolean(),
      "Pool Access": z.boolean(),
    })
    .refine(
      (amenities) => Object.values(amenities).some((val) => val === true),
      { message: "Please select at least one amenity" },
    ),
});

export const CreateRoomSchema = RoomSchema;

export const UpdateRoomSchema = RoomSchema.extend({
  id: z.string(),
  rate: RoomSchema.shape.rate.optional(),
});

export type CreateRoomType = z.infer<typeof CreateRoomSchema>;
export type UpdateRoomType = z.infer<typeof UpdateRoomSchema>;
