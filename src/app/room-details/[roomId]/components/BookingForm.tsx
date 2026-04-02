"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { bookingSchema, BookingSchemaType } from "@/zod-schemas/booking";
import { useEffect, useState, useTransition } from "react";
import { checkRoomAvailability } from "@/server/actions/room";
import { createBooking } from "@/server/actions/booking";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";

const BookingForm = ({ roomId }: { roomId: string }) => {
  const router = useRouter();
  const { toast } = useToast();

  const [availability, setAvailability] = useState<"idle" | "available">(
    "idle",
  );

  const [isPending, startTransition] = useTransition();

  const form = useForm<BookingSchemaType>({
    resolver: zodResolver(bookingSchema),
    mode: "onBlur",
    defaultValues: {
      checkInDate: "",
      checkOutDate: "",
      guests: 1,
      roomId,
    },
  });

  const checkIn = form.watch("checkInDate");
  const checkOut = form.watch("checkOutDate");

  useEffect(() => {
    setAvailability("idle");
  }, [checkIn, checkOut]);

  const onSubmit = (data: BookingSchemaType) => {
    startTransition(async () => {
      // check availability first
      if (availability === "idle") {
        const res = await checkRoomAvailability({
          roomId,
          checkInDate: data.checkInDate,
          checkOutDate: data.checkOutDate,
        });

        if (res.success) {
          if (res.isAvailable) {
            setAvailability("available");
            toast({
              title: "Room Available 🎉",
              description:
                "Great! The room is available for your selected dates.",
              className: "bg-green-100 text-green-600",
            });
          } else {
            toast({
              title: "Room not available",
              description: "Please choose different dates",
              className: "bg-red-100 text-red-600",
            });
          }
        }

        return;
      }

      // create booking
      if (availability === "available") {
        const res = await createBooking({
          ...data,
          roomId,
        });

        if (res.success) {
          toast({
            title: "Success! 🎉",
            description: res.message,
            className: "bg-green-100 text-green-600",
          });

          router.push(
            `/checkout?amount=${res.data?.totalPrice}&bookingId=${res.data?.id}`,
          );
        } else {
          toast({
            title: "Error",
            description: res.message,
            className: "bg-red-100 text-red-600",
          });
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl"
      >
        <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
          {/* Check In */}
          <InputWithLabel<BookingSchemaType>
            fieldTitle="Check In"
            nameInSchema="checkInDate"
            type="date"
            min={new Date().toISOString().split("T")[0]}
          />

          <div className="w-px h-16 bg-gray-300/70 max-md:hidden" />

          {/* Check Out */}
          <InputWithLabel<BookingSchemaType>
            fieldTitle="Check Out"
            nameInSchema="checkOutDate"
            type="date"
          />

          <div className="w-px h-16 bg-gray-300/70 max-md:hidden" />

          {/* Guests */}
          <InputWithLabel<BookingSchemaType>
            fieldTitle="Guests"
            nameInSchema="guests"
            type="number"
            min={1}
            className="max-w-[150px]"
          />
        </div>

        <Button
          disabled={isPending}
          type="submit"
          size="lg"
          className="active:scale-95 transition-all max-md:w-full max-md:mt-6 md:px-24 py-3 md:py-6 text-base"
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" />
              Loading...
            </>
          ) : availability === "available" ? (
            "Book Now"
          ) : (
            "Check Availability"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
