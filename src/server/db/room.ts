import { ROOMS_PER_PAGE } from "@/constants/enums";
import { cache } from "@/lib/cache";
import prisma from "@/lib/db";
import { GetRoomsFiltersType } from "@/types/room";
import { Prisma } from "@prisma/client";

export const getOwnerRooms = cache(
  async (userId: string, pageNumber: number) => {
    if (!userId) {
      throw new Error("Unauthorized");
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

    // get hotel by owner
    const hotelData = await prisma.hotel.findFirst({
      where: { ownerId: user.id },
    });

    if (!hotelData) {
      throw new Error("Hotel not found");
    }

    // get rooms by hotel
    const rooms = await prisma.room.findMany({
      where: {
        hotelId: hotelData.id,
      },
      skip: ROOMS_PER_PAGE * (pageNumber - 1),
      take: ROOMS_PER_PAGE,
      include: {
        hotel: true,
        bookings: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rooms;
  },
  ["ownerRooms"],
  { revalidate: 3600 },
);

export const getRoom = cache(
  async (id: string) => {
    const room = await prisma.room.findUnique({
      where: {
        id,
      },
      include: {
        hotel: {
          include: {
            owner: true,
          },
        },
      },
    });

    if (!room) {
      throw new Error("Room not found");
    }

    return room;
  },
  ["room-by-id"],
  { revalidate: 3600 },
);

export const getRooms = cache(
  async () => {
    const rooms = await prisma.room.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        hotel: {
          include: {
            owner: {
              select: {
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return rooms;
  },
  ["get-rooms-available"],
  { revalidate: 3600 },
);

export const GetRoomsFilters = cache(
  async (filters?: GetRoomsFiltersType) => {
    const where: Prisma.RoomWhereInput = {
      isAvailable: true,
    };

    // filter room type
    if (filters?.roomTypes?.length) {
      where.roomType = {
        in: filters.roomTypes,
      };
    }

    // filter destination
    if (filters?.destination) {
      where.hotel = {
        city: {
          contains: filters.destination,
          mode: "insensitive",
        },
      };
    }

    // filter price ranges
    if (filters?.priceRanges?.length) {
      where.OR = filters.priceRanges.map((range) => {
        const [min, max] = range.split(" to ").map(Number);

        return {
          pricePerNight: {
            gte: min,
            lte: max,
          },
        };
      });
    }

    let orderBy: Prisma.RoomOrderByWithRelationInput = {
      createdAt: "desc",
    };

    if (filters?.sort === "Price Low to High") {
      orderBy = { pricePerNight: "asc" };
    }

    if (filters?.sort === "Price High to Low") {
      orderBy = { pricePerNight: "desc" };
    }

    if (filters?.sort === "Newest First") {
      orderBy = { createdAt: "desc" };
    }

    const rooms = await prisma.room.findMany({
      where,
      include: {
        hotel: {
          include: {
            owner: {
              select: {
                image: true,
              },
            },
          },
        },
      },
      orderBy,
    });

    return rooms;
  },
  ["get-rooms-available-filters"],
  { revalidate: 3600 },
);
