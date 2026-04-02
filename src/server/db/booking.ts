import { BOOKINGS_PER_PAGE } from "@/constants/enums";
import { cache } from "@/lib/cache";
import prisma from "@/lib/db";

export const getBookingsOwner = cache(
  async (clerkUserId: string, pageNumber: number) => {
    if (!clerkUserId) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // get hotel by owner
    const hotelData = await prisma.hotel.findUnique({
      where: { ownerId: user.id },
    });

    if (!hotelData) {
      throw new Error("Hotel not found");
    }

    // get bookings by hotel
    const bookings = await prisma.booking.findMany({
      where: {
        hotelId: hotelData.id,
      },
      skip: BOOKINGS_PER_PAGE * (pageNumber - 1),
      take: BOOKINGS_PER_PAGE,
      include: {
        room: true,
        hotel: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    //total bookings
    const totalBookings = await prisma.booking.count({
      where: {
        hotelId: hotelData.id,
      },
    });

    // total revenue
    const revenueData = await prisma.booking.aggregate({
      where: {
        hotelId: hotelData.id,
      },
      _sum: {
        totalPrice: true,
      },
    });

    const totalRevenue = revenueData._sum.totalPrice || 0;

    return {
      totalBookings,
      totalRevenue,
      bookings,
    };
  },
  ["ownerHotelBookings"],
  { revalidate: 3600 },
);
