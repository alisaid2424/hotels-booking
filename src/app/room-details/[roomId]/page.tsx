import StarRating from "@/components/StarRating";
import { facilityIcons, roomCommonData } from "@/constants/data";
import { MapPin } from "lucide-react";
import RoomImagesView from "./components/RoomImagesView";
import BookingForm from "./components/BookingForm";
import Image from "next/image";
import Link from "next/link";
import { getRoom } from "@/server/db/room";

type PageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

const RoomDetails = async ({ params }: PageProps) => {
  const { roomId } = await params;
  const room = await getRoom(roomId);

  return (
    <div className="py-24 md:py-28 padding-x">
      {/* Room Details */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h2 className="text-3xl md:text-4xl font-playfair">
          {room?.hotel.name}{" "}
          <span className="font-outfit text-sm">({room?.roomType})</span>
        </h2>
        <p className="text-xs py-1.5 px-3 text-white bg-primary rounded-full">
          20% OFF
        </p>
      </div>

      {/* Room Rating */}
      <div className="flex items-center gap-1 mt-2">
        <StarRating rating={room.rate} size={16} />
        <p className="ms-2">200+ reviews</p>
      </div>

      {/* Room Address */}
      <div className="flex items-center gap-1 text-gray-500 mt-2">
        <MapPin className="w-4" />
        <span>{room?.hotel.address}</span>
      </div>

      {/* Room Images */}
      <RoomImagesView room={room} />

      {/* Room Highlights */}
      <div className="flex flex-col md:flex-row md:justify-between mt-10 w-full">
        <div className="flex flex-col">
          <h2 className="text-3xl md:text-4xl font-playfair">
            Experience Luxury Like Never Before
          </h2>
          <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
            {room?.amenities.map((item, index) => {
              const Icon = facilityIcons[item as keyof typeof facilityIcons];
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
        </div>

        {/* Room Price */}
        <p className="text-2xl font-medium">$ {room?.pricePerNight} / Night</p>
      </div>

      {/* Booking Form */}
      <BookingForm roomId={roomId} />

      {/* Common Specifications */}
      <div className="mt-24 space-y-4">
        {roomCommonData.map((spec, index) => (
          <div key={index} className="flex items-start gap-2">
            <spec.icon className="w-6" />
            <div>
              <p className="text-base">{spec.title}</p>
              <p className="text-gray-500">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl border-y border-gray-300 my-16 py-10 text-gray-500">
        <p>
          Guests will be allocated on the ground floor according to
          availability. You get a comfortable Two bedroom apartment has a true
          city feeling. The price quoted is for two guest, at the guest slot
          please mark the number of guests to get the exact price for groups.
          The Guests will be allocated ground floor according to availability.
          You get the comfortable two bedroom apartment that has a true city
          feeling.
        </p>
      </div>

      {/* Hosted By */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex gap-4">
          <Image
            src={
              room.hotel.owner?.image ??
              "https://res.cloudinary.com/djhoc0ys4/image/upload/v1758875923/profile_images/img-profile-1.jpg.jpg"
            }
            alt="Host"
            width={200}
            height={200}
            className="h-14 w-14 md:w-16 md:h-16 rounded-full"
            priority
          />
          <div>
            <p className="text-lg md:text-xl">Hosted by {room?.hotel.name} </p>
            <div className="flex items-center gap-2 mt-1">
              <StarRating />
              <p>200+ reviews</p>
            </div>
          </div>
        </div>

        <Link
          href="#"
          className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary/90 transition-all"
        >
          Contact Now
        </Link>
      </div>
    </div>
  );
};

export default RoomDetails;
