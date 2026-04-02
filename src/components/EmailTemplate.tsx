import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Section,
} from "@react-email/components";

type EmailTemplateProps = {
  fullName: string;
  bookingId: string;
  hotelName: string;
  location: string;
  checkIn: Date;
  checkOut: Date;
  amount: number;
};

export const EmailTemplate = ({ body }: { body: EmailTemplateProps }) => {
  return (
    <Html>
      <Head />
      <Preview>Hotel Booking Details</Preview>

      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#fff",
          padding: "20px",
        }}
      >
        <Container style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
            Your Booking Details
          </Text>

          <Text>Dear {body.fullName || "Guest"},</Text>

          <Text>Thank you for your booking! Here are your details:</Text>

          <Section>
            <Text>
              <strong>Booking ID:</strong> {body.bookingId}
            </Text>
            <Text>
              <strong>Hotel Name:</strong> {body.hotelName}
            </Text>
            <Text>
              <strong>Location:</strong> {body.location}
            </Text>
            <Text>
              <strong>Check-in:</strong> {new Date(body.checkIn).toDateString()}
            </Text>
            <Text>
              <strong>Check-out:</strong>{" "}
              {new Date(body.checkOut).toDateString()}
            </Text>
            <Text>
              <strong>Booking Amount:</strong> ${body.amount}
            </Text>
          </Section>

          <Text style={{ marginTop: "20px" }}>
            We look forward to welcoming you
          </Text>

          <Text>If you need to make any changes, feel free to contact us.</Text>
        </Container>
      </Body>
    </Html>
  );
};
