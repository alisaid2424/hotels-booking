import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { DOMAIN } from "@/constants/enums";
import { useToast } from "@/hooks/use-toast";
import { updateBookingPayment } from "@/server/actions/booking";
import { BookingWithUserRoomHotel } from "@/types/booking";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";

interface CheckoutFormProps {
  amount: number;
  bookingId: string;
}

const CheckoutForm = ({ amount, bookingId }: CheckoutFormProps) => {
  const { toast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    startTransition(async () => {
      try {
        // Validate form
        const { error: submitError } = await elements.submit();
        if (submitError) {
          toast({
            className: "bg-red-100 text-red-600",
            description:
              submitError.message || "Please fill all required card fields",
          });
          return;
        }

        // Create payment intent
        const res = await fetch(`${DOMAIN}/api/create-intent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        });

        const responseData = await res.json();

        let bookingRes: BookingWithUserRoomHotel | null = null;

        if (!res.ok || !responseData.clientSecret) {
          console.error("Failed to create payment intent:", responseData.error);
          toast({
            className: "bg-red-100 text-red-600",
            description: "Payment creation failed. Try again later.",
          });

          return;
        } else {
          // updated Booking
          const result = await updateBookingPayment(bookingId);

          if (!result.success || !result.data) {
            toast({
              className: "bg-red-100 text-red-600",
              description: result.message,
            });
            return;
          }

          bookingRes = result.data;

          //send email
          await sendEmail(bookingRes);
          toast({
            description:
              "Payment successful and Booking created and send email",
            className: "bg-green-100 text-green-600",
          });
        }

        const clientSecret = responseData.clientSecret;

        // Confirm payment
        const result = await stripe.confirmPayment({
          clientSecret,
          elements,
          confirmParams: {
            return_url: `${DOMAIN}/payment-confirm`,
          },
        });

        if (result.error) {
          toast({
            description: result.error.message,
            className: "bg-red-100 text-red-600",
          });

          return;
        }
      } catch (error) {
        toast({
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
          className: "bg-red-100 text-red-600",
        });
      }
    });
  };

  const sendEmail = async (booking: BookingWithUserRoomHotel) => {
    await fetch(`${DOMAIN}/api/send-email`, {
      method: "POST",
      body: JSON.stringify({
        email: booking.user.email,
        fullName: booking.user.name,
        bookingId: booking.id,
        hotelName: booking.room.hotel.name,
        location: booking.room.hotel.address,
        checkIn: booking.checkInDate,
        checkOut: booking.checkOutDate,
        amount: booking.totalPrice,
      }),
    });
  };

  return (
    <div className="element-center flex-col  min-h-[calc(100vh-64px)] my-10 py-12">
      <form
        onSubmit={handleSubmit}
        className="container w-full md:w-2/3 lg:w-2/4"
      >
        <div className="w-full">
          <PaymentElement />
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full mt-5 !py-6 text-lg"
        >
          {isPending ? (
            <LoaderCircle className="animate-spin mx-auto" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>

      <BackButton
        title="Go Back"
        variant="default"
        className="rounded-full mt-10"
      />
    </div>
  );
};

export default CheckoutForm;
