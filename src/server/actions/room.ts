"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { getImageUrl } from "./getImageUrl";
import {
  CreateRoomSchema,
  UpdateRoomSchema,
  CreateRoomType,
  UpdateRoomType,
} from "@/zod-schemas/room";
import { Pages, Routes } from "@/constants/enums";
import { CheckRoomAvailabilityProps } from "@/types/room";

export const roomAction = async (
  data: CreateRoomType | UpdateRoomType,
  mode: "create" | "update",
) => {
  const { userId } = await auth();

  if (!userId) {
    return {
      status: 401,
      message: "Unauthorized",
    };
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    return {
      status: 401,
      message: "User not found",
    };
  }

  const result =
    mode === "create"
      ? CreateRoomSchema.safeParse(data)
      : UpdateRoomSchema.safeParse(data);

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
    const hotel = await prisma.hotel.findUnique({
      where: { ownerId: user.id },
    });

    if (!hotel) {
      return {
        status: 404,
        message: "No hotel found",
      };
    }

    const imageUrls: string[] = [];

    await Promise.all(
      formData.images.map(async (image, index) => {
        if (typeof image === "string") {
          imageUrls[index] = image;
        }

        if (image instanceof File && image.size > 0) {
          const res = await getImageUrl({
            imageFile: image,
            publicId: image.name,
            pathName: "hotel_rooms",
          });

          if (res) imageUrls[index] = res;
        }
      }),
    );

    if (mode === "create") {
      await prisma.room.create({
        data: {
          roomType: formData.roomType,
          pricePerNight: formData.pricePerNight,
          rate: formData.rate,
          amenities: Object.keys(formData.amenities).filter(
            (key) => formData.amenities[key as keyof typeof formData.amenities],
          ),
          images: imageUrls,
          hotelId: hotel.id,
        },
      });

      revalidatePath(Routes.ROOT);
      revalidatePath(Routes.LISTROOMS);
      revalidatePath(Pages.ROOMS);

      return {
        status: 201,
        message: "Room created successfully",
      };
    } else {
      const updateData = formData as UpdateRoomType;

      const existingRoom = await prisma.room.findUnique({
        where: { id: updateData.id },
      });

      if (!existingRoom) {
        return {
          status: 404,
          message: "Room not found",
        };
      }

      const finalImages =
        imageUrls.length > 0 ? imageUrls : existingRoom.images;

      const updatedRoom = await prisma.room.update({
        where: { id: updateData.id },
        data: {
          roomType: updateData.roomType,
          pricePerNight: updateData.pricePerNight,
          rate: updateData.rate,
          amenities: Object.keys(updateData.amenities).filter(
            (key) =>
              updateData.amenities[key as keyof typeof updateData.amenities],
          ),
          images: finalImages,
        },
      });

      revalidatePath(Routes.ROOT);
      revalidatePath(Routes.LISTROOMS);
      revalidatePath(`${Routes.LISTROOMS}/edit/${updatedRoom.id}`);
      revalidatePath(Pages.ROOMS);

      return {
        status: 200,
        message: "Room updated successfully",
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        status: 500,
        message: error.message,
      };
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }
};

export const deleteRoom = async (id: string) => {
  try {
    await prisma.room.delete({
      where: {
        id,
      },
    });

    revalidatePath(Routes.LISTROOMS);
    revalidatePath(Pages.ROOMS);
    revalidatePath(Routes.ROOT);

    return {
      success: true,
      message: "Room deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
};

export const toggleRoomAvailabilityAction = async (roomId: string) => {
  if (!roomId) {
    return {
      status: 400,
      message: "Room ID is required",
    };
  }

  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return {
        status: 404,
        message: "Room not found",
      };
    }

    // Toggle availability
    await prisma.room.update({
      where: { id: roomId },
      data: {
        isAvailable: !room.isAvailable,
      },
    });

    // Revalidate
    revalidatePath(Routes.ROOT);
    revalidatePath(Routes.LISTROOMS);
    revalidatePath(Pages.ROOMS);

    return {
      status: 200,
      message: "Room availability updated successfully",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        status: 500,
        message: error.message,
      };
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }
};

export const checkRoomAvailability = async ({
  roomId,
  checkInDate,
  checkOutDate,
}: CheckRoomAvailabilityProps) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        checkInDate: {
          lte: new Date(checkOutDate),
        },
        checkOutDate: {
          gte: new Date(checkInDate),
        },
      },
    });

    const isAvailable = bookings.length === 0;

    return {
      success: true,
      isAvailable,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: false,
      message: "Internal server error",
    };
  }
};
