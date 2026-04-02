import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hotel Booking",
  description:
    "A modern hotel booking platform delivering fast reservations and a seamless experience powered by cutting-edge web technologies.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.variable} ${playfair.variable} antialiased`}>
        <ClerkProvider>
          <Navbar />
          <Toaster />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
