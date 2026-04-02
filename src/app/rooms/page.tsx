import LottieHandler from "@/components/LottieHandler";
import FillterRooms from "./components/FillterRooms";
import StarRating from "@/components/StarRating";
import Title from "@/components/Title";
import { facilityIcons } from "@/constants/data";
import { formatCurrency } from "@/lib/formatters";
import { GetRoomsFilters } from "@/server/db/room";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Motion from "@/components/Motion";

type SearchParams = {
  destination?: string;
  sort?: string;
  roomType?: string;
  price?: string;
};

const AllRooms = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const { destination, sort, roomType, price } = await searchParams;

  const roomsData = await GetRoomsFilters({
    destination,
    sort,
    roomTypes: roomType?.split(","),
    priceRanges: price?.split(","),
  });

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-7 py-24 md:py-28 padding-x">
      <div className="flex-1">
        <Title
          align="left"
          title="Hotel Rooms"
          subTitle="Take Advantage of our limited-time offers and special packages to
          enhance your stay and create unforgettable memories."
        />

        {roomsData.length ? (
          roomsData.map((room, index) => (
            <Motion
              key={room.id}
              index={index}
              className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-28 last:border-0"
            >
              <Link
                href={`room-details/${room.id}`}
                className="relative w-full md:w-96 h-64 rounded-xl shadow-lg overflow-hidden"
              >
                <Image
                  src={room.images[0]}
                  alt="hotel-img"
                  fill
                  title="View Room Details"
                  className="object-cover"
                  priority
                />
              </Link>

              <div className="flex flex-col gap-2 md:flex-1">
                <p className="text-gray-500 capitalize">{room.hotel.city}</p>
                <Link
                  href={`room-details/${room.id}`}
                  className="text-gray-800 text-3xl font-playfair"
                >
                  {room.hotel.name}
                </Link>

                <div className="flex items-center">
                  <StarRating rating={room.rate} />
                  <p className="ms-2">200+ reviews</p>
                </div>

                <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                  <MapPin className="w-4" />
                  <span>{room.hotel.address}</span>
                </div>

                {/* Room Amenities */}
                <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                  {room.amenities.map((item, index) => {
                    const Icon =
                      facilityIcons[item as keyof typeof facilityIcons];
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                      >
                        {Icon && <Icon className="w-5 h-5" />}
                        <span className="text-xs">{item}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Room Price Per Night */}
                <p className="text-xl font-medium text-gray-700">
                  {formatCurrency(room.pricePerNight)} / Night
                </p>
              </div>
            </Motion>
          ))
        ) : (
          <div className="element-center text-center min-h-[calc(100vh-64px)]">
            <LottieHandler type="empty" message="No Rooms Available" />
          </div>
        )}
      </div>
      {/* Fillter */}
      <div className="items-start">
        <FillterRooms />
      </div>
    </div>
  );
};

export default AllRooms;
