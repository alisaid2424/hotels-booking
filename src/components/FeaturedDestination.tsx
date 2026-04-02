import HotelCard from "./HotelCard";
import Title from "./Title";
import Link from "next/link";
import { Pages } from "@/constants/enums";
import { getRooms } from "@/server/db/room";
import LottieHandler from "./LottieHandler";

const FeaturedDestination = async () => {
  const roomsData = await getRooms();
  return (
    <div className="bg-slate-50 py-20 padding-x">
      <Title
        title="Featured Destination"
        subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
      />

      {roomsData.length ? (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6 mt-20">
            {roomsData.slice(0, 4).map((room, idx) => (
              <HotelCard key={room.id} room={room} index={idx} />
            ))}
          </div>

          <Link
            href={Pages.ROOMS}
            className="block text-center w-fit mx-auto my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-100 transition-all duration-300"
          >
            View All Destinations
          </Link>
        </>
      ) : (
        <div className="element-center text-center min-h-[calc(100vh-64px)]">
          <LottieHandler type="empty" message="No Rooms Available" />
        </div>
      )}
    </div>
  );
};

export default FeaturedDestination;
