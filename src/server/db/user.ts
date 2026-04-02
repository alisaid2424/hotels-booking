import { cache } from "@/lib/cache";
import prisma from "@/lib/db";

export const getUser = cache(
  async ({ id, clerkUserId }: { id?: string; clerkUserId?: string }) => {
    if (!id && !clerkUserId) throw new Error("id or clerkUserId is required");
    const query = id ? { id } : { clerkUserId };
    return await prisma.user.findUnique({ where: query });
  },
  [`user-${crypto.randomUUID()}`],
  { revalidate: 3600 },
);

export const getUserRecentSearches = cache(
  async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { recentSearchedCities: true },
    });

    return user?.recentSearchedCities ?? [];
  },
  ["user-recent-searches"],
  { revalidate: 3600 },
);

export const getUserBookings = cache(
  async (clerkUserId: string) => {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
      },
      include: {
        room: true,
        hotel: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bookings;
  },
  ["get-user-bookings"],
  { revalidate: 3600 },
);
