import { EmailTemplate } from "@/components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [body.email],
      subject: "Hotel Booking Details",
      react: EmailTemplate({
        body: {
          fullName: body.fullName,
          bookingId: body.bookingId,
          hotelName: body.hotelName,
          location: body.location,
          checkIn: body.checkIn,
          checkOut: body.checkOut,
          amount: body.amount,
        },
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
