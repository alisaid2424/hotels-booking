import Title from "@/components/Title";
import { auth } from "@clerk/nextjs/server";
import { formatCurrency } from "@/lib/formatters";
import { getOwnerRooms } from "@/server/db/room";
import { notFound } from "next/navigation";
import AdminTable from "@/components/AdminTable";
import { RoomWithHotelBookings } from "@/types/room";

interface ListRoomsProps {
  searchParams: Promise<{ pageNumber: string }>;
}

const ListRooms = async ({ searchParams }: ListRoomsProps) => {
  const { pageNumber } = await searchParams;
  const page = Number(pageNumber) || 1;
  const { userId } = await auth();
  if (!userId) notFound();
  const getRooms = await getOwnerRooms(userId, page);

  const columns = [
    { key: "roomType", name: "Name" },
    { key: "amenitiesFormatted", name: "Facility" },
    { key: "images", name: "Images" },
    { key: "priceFormatted", name: "Price / Night" },
  ];

  if (!Array.isArray(getRooms)) notFound();

  const formattedRooms = getRooms.map((item: RoomWithHotelBookings) => ({
    id: item.id,
    roomType: item.roomType,
    amenitiesFormatted: item.amenities.join(", "),
    images: item.images,
    priceFormatted: formatCurrency(item.pricePerNight),
    isAvailable: item.isAvailable,
    bookings: item.bookings,
  }));

  return (
    <>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />
      <p className="text-gray-500 mt-8">All Rooms</p>

      <AdminTable
        data={formattedRooms}
        columns={columns}
        pageNumber={pageNumber}
        totalCount={formattedRooms.length}
        type="list-rooms"
      />
    </>
  );
};

export default ListRooms;
