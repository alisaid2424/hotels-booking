"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { Pages, Routes } from "@/constants/enums";
import { HotelRegType, schemaHotelReg } from "@/zod-schemas/hotel";
import { clerkClient } from "@clerk/clerk-sdk-node";

// Register Hotel
export const hotelAction = async (data: HotelRegType, clerkUserId: string) => {
  // Validate with Zod
  const result = schemaHotelReg.safeParse(data);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0]?.toString() || "form";
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });

    return {
      status: 400,
      message: "Validation failed",
      error: fieldErrors,
    };
  }

  const formData = result.data;

  try {
    // get user from DB
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    // Check if user already registered hotel
    const existingHotel = await prisma.hotel.findUnique({
      where: { ownerId: user.id },
    });

    if (existingHotel) {
      return {
        status: 400,
        message: "Hotel already registered",
      };
    }

    // Create Hotel + Update Role
    await prisma.$transaction(async (tx) => {
      const hotel = await tx.hotel.create({
        data: {
          name: formData.name,
          address: formData.address,
          contact: formData.phone,
          city: formData.city.toLowerCase(),
          ownerId: user.id,
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: { role: "HOTELOWNER" },
      });

      return hotel;
    });

    await clerkClient.users.updateUser(clerkUserId, {
      publicMetadata: {
        role: "HOTELOWNER",
      },
    });

    // Revalidate
    revalidatePath(Routes.ROOT);
    revalidatePath(Pages.ROOMS);
    revalidatePath(Routes.OWNER);

    return {
      status: 201,
      message: "Hotel registered successfully",
    };
  } catch (err) {
    return {
      status: 500,
      message: err instanceof Error ? err.message : "Unknown error occurred",
    };
  }
};
