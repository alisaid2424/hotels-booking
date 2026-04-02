import LottieHandler from "@/components/LottieHandler";
import Motion from "@/components/Motion";
import Title from "@/components/Title";
import { getUserBookings } from "@/server/db/user";
import { auth } from "@clerk/nextjs/server";
import { MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MyBookings = async () => {
  const { userId: clerkUserId } = await auth();
  const bookings = clerkUserId ? await getUserBookings(clerkUserId) : [];

  return (
    <div className="py-24 md:py-28 padding-x">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks"
        align="left"
      />

      {bookings.length ? (
        <div className="max-w-7xl mt-8 w-full text-gray-800">
          <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
            <div className="w-1/3">Hotels</div>
            <div className="w-1/3">Date & Timings</div>
            <div className="w-1/3">Payment</div>
          </div>

          {bookings.map((booking, index) => (
            <Motion
              key={booking.id}
              index={index}
              className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6  last:border-0"
            >
              {/* Hotel Details */}
              <div className="flex flex-col md:flex-row">
                <Image
                  src={booking.room.images[0]}
                  alt="hotel-img"
                  width={400}
                  height={400}
                  className="md:w-36 rounded shadow object-cover"
                />
                <div className="flex flex-col gap-1.5 max-md:mt-3 md:ms-4">
                  <p className="font-playfair text-2xl">
                    {booking.hotel.name}
                    <span className="text-sm"> ({booking.room.roomType})</span>
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-4" />
                    <span>{booking.hotel.address}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="w-4" />
                    <span>Guests: {booking.guests}</span>
                  </div>
                  <p className="text-base">Total: ${booking.totalPrice}</p>
                </div>
              </div>

              {/* Date & Timeings */}
              <div className="flex md:items-center gap-8 md:gap-12 mt-3">
                <div>
                  <p>Check-In:</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(booking.checkInDate).toDateString()}
                  </p>
                </div>
                <div>
                  <p>Check-Out:</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(booking.checkOutDate).toDateString()}
                  </p>
                </div>
              </div>

              {/* Payent Status */}
              <div className="flex flex-col items-start justify-center pt-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      booking.isPaid ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <p
                    className={`text-sm ${
                      booking.isPaid ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {booking.isPaid ? "Paid" : "UnPaid"}
                  </p>
                </div>

                {!booking.isPaid && (
                  <Link
                    href={`/checkout?amount=${booking.totalPrice}&bookingId=${booking.id}`}
                    className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  >
                    Pay Now
                  </Link>
                )}
              </div>
            </Motion>
          ))}
        </div>
      ) : (
        <div className="element-center text-center min-h-[calc(100vh-64px)]">
          <LottieHandler type="empty" message="No Bookings Available" />
        </div>
      )}
    </div>
  );
};

export default MyBookings;
