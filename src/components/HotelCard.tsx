import { MapPin, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { formatCurrency } from "@/lib/formatters";
import { RoomWithHotel } from "@/types/room";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Motion from "./Motion";

const HotelCard = ({ room, index }: { room: RoomWithHotel; index: number }) => {
  return (
    <Motion index={index}>
      <Card className="group relative sm:w-full mx-auto rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] border-none hover:-translate-y-3 transition-all duration-300">
        <Link href={`/room-details/${room.id}`}>
          <div className="h-60 w-full overflow-hidden">
            <Image
              src={room.images[0] ?? ""}
              alt={`img-room-${room.hotel.name}`}
              width={400}
              height={300}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Best Seller Badge */}
          {room.rate >= 5 && (
            <Badge className="absolute top-3 left-3 bg-white hover:text-white text-gray-800 text-xs px-3 py-1 rounded-full">
              Best Seller
            </Badge>
          )}

          <CardContent className="px-4 py-5">
            <div className="flex items-center justify-between">
              <p className="font-playfair text-xl font-medium text-gray-800">
                {room.hotel.name}
              </p>

              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-primary fill-primary" />
                {room.rate}.5
              </div>
            </div>

            <div className="flex items-center gap-1 mt-2">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="text-[13px]">{room.hotel.address}</span>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p>
                <span className="text-lg font-medium text-gray-800 me-1">
                  {formatCurrency(room.pricePerNight)}
                </span>
                / Night
              </p>

              <Button variant="outline" className="text-sm px-2 font-medium">
                Book Now
              </Button>
            </div>
          </CardContent>
        </Link>
      </Card>
    </Motion>
  );
};

export default HotelCard;
