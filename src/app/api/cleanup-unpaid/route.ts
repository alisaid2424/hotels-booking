import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Pages, Routes } from "@/constants/enums";

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization");

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - 24);

  const unpaidBookings = await prisma.booking.findMany({
    where: {
      isPaid: false,
      createdAt: {
        lt: cutoffDate,
      },
    },
    include: {
      room: true,
    },
  });

  for (const booking of unpaidBookings) {
    await prisma.booking.delete({
      where: { id: booking.id },
    });

    revalidatePath(Routes.LISTROOMS);
    revalidatePath(Routes.OWNER);
    revalidatePath(Pages.MYBOOKINGS);
    revalidatePath(`/room-details/${booking.roomId}`);
  }

  return NextResponse.json({
    status: 200,
    message: `Deleted ${unpaidBookings.length} unpaid bookings`,
  });
}
