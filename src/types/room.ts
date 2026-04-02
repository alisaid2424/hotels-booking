import { Booking, Hotel, Room } from "@prisma/client";

export type RoomWithHotel = Room & {
  hotel: Hotel & {
    owner?: { image?: string | null };
  };
};

export type RoomWithHotelBookings = Room & {
  hotel: Hotel & {
    owner?: { image?: string | null };
  };
  bookings: Booking[];
};

export type GetRoomsFiltersType = {
  roomTypes?: string[];
  priceRanges?: string[];
  sort?: string;
  destination?: string;
};

export type CheckRoomAvailabilityProps = {
  roomId: string;
  checkInDate: string | Date;
  checkOutDate: string | Date;
};
