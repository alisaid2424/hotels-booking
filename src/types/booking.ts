import { Prisma } from "@prisma/client";

export type BookingWithUserRoomHotel = Prisma.BookingGetPayload<{
  include: {
    user: true;
    room: {
      include: {
        hotel: true;
      };
    };
  };
}>;
