import HotelCard from "./HotelCard";
import Title from "./Title";
import { getRooms } from "@/server/db/room";
import { auth } from "@clerk/nextjs/server";
import { getUserRecentSearches } from "@/server/db/user";

const RecommendedHotels = async () => {
  const { userId } = await auth();
  const recentSearchedCity = userId ? await getUserRecentSearches(userId) : [];
  const rooms = await getRooms();

  const recommended = rooms.filter((room) =>
    recentSearchedCity.includes(room.hotel.city),
  );

  return recommended.length ? (
    <div className="bg-slate-50 py-20 padding-x">
      <Title
        title="Recommended Hotels"
        subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences."
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6 mt-20">
        {recommended.slice(0, 4).map((room, idx) => (
          <HotelCard key={room.id} room={room} index={idx} />
        ))}
      </div>
    </div>
  ) : null;
};

export default RecommendedHotels;
