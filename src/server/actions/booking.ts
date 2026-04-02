"use server";

import { Pages, Routes } from "@/constants/enums";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { checkRoomAvailability } from "./room";
import { bookingSchema, BookingSchemaType } from "@/zod-schemas/booking";
import { auth } from "@clerk/nextjs/server";

export async function createBooking(data: BookingSchemaType) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return { success: false, message: "Unauthorized user" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return { success: false, message: "User not found in database" };
    }

    // validate schema
    const validated = bookingSchema.parse(data);

    const { roomId, checkInDate, checkOutDate, guests } = validated;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // check availability
    const { isAvailable } = await checkRoomAvailability({
      roomId,
      checkInDate,
      checkOutDate,
    });

    if (!isAvailable) {
      return {
        success: false,
        message: "Room is not available",
      };
    }

    // get room
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return {
        success: false,
        message: "Room not found",
      };
    }

    // calculate nights
    const nights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
    );

    const totalPrice = room.pricePerNight * nights;

    // create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        roomId,
        hotelId: room.hotelId,
        guests,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice,
      },
    });

    revalidatePath(Routes.OWNER);
    revalidatePath(Routes.LISTROOMS);
    revalidatePath(Pages.MYBOOKINGS);
    revalidatePath(`/room-details/${roomId}`);

    return {
      success: true,
      message:
        "Reservation created. Confirm within 24 hours or it will be canceled.",
      data: booking,
    };
  } catch (error: unknown) {
    console.log(error);
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
}

export async function updateBookingPayment(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return {
        success: false,
        message: "Booking not found",
      };
    }

    if (booking.isPaid) {
      return {
        success: false,
        message: "Booking already paid",
      };
    }

    if (booking.status === "CANCELLED") {
      return {
        success: false,
        message: "Cannot pay for cancelled booking",
      };
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        isPaid: true,
        status: "CONFIRMED",
      },
      include: {
        user: true,
        room: {
          include: {
            hotel: true,
          },
        },
      },
    });

    revalidatePath(Routes.OWNER);
    revalidatePath(Routes.LISTROOMS);
    revalidatePath(Pages.MYBOOKINGS);
    revalidatePath(`/room-details/${updatedBooking.roomId}`);

    return {
      success: true,
      message: "Payment updated successfully",
      data: updatedBooking,
    };
  } catch (error) {
    console.error("Update booking payment failed:", error);

    return {
      success: false,
      message: "Update payment failed",
    };
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        room: true,
        hotel: true,
      },
    });

    if (!booking) {
      return {
        success: false,
        message: "Booking not found",
      };
    }

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    revalidatePath(Routes.OWNER);
    revalidatePath(Routes.LISTROOMS);
    revalidatePath(Pages.MYBOOKINGS);
    revalidatePath(`/room-details/${booking.roomId}`);

    return {
      success: true,
      message: "Booking deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    };
  }
}
