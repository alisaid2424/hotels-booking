import {
  Wifi,
  Coffee,
  ConciergeBell,
  Mountain,
  Waves,
  Home,
  ShieldCheck,
  MapPin,
  Heart,
} from "lucide-react";

// Exclusive Offers Dummy Data
export const exclusiveOffers = [
  {
    _id: 1,
    title: "Summer Escape Package",
    description: "Enjoy a complimentary night and daily breakfast",
    priceOff: 25,
    expiryDate: "Aug 31",
    image: "/exclusiveOfferCardImg1.png",
  },
  {
    _id: 2,
    title: "Romantic Getaway",
    description: "Special couples package including spa treatment",
    priceOff: 20,
    expiryDate: "Sep 20",
    image: "/exclusiveOfferCardImg2.png",
  },
  {
    _id: 3,
    title: "Luxury Retreat",
    description:
      "Book 60 days in advance and save on your stay at any of our luxury properties worldwide.",
    priceOff: 30,
    expiryDate: "Sep 25",
    image: "/exclusiveOfferCardImg3.png",
  },
];

// Testimonials Dummy Data
export const testimonials = [
  {
    id: 1,
    name: "Emma Rodriguez",
    address: "Barcelona, Spain",
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    rating: 5,
    review:
      "I've used many booking platforms before, but none compare to the personalized experience and attention to detail that QuickStay provides.",
  },
  {
    id: 2,
    name: "Liam Johnson",
    address: "New York, USA",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    rating: 4,
    review:
      "QuickStay exceeded my expectations. The booking process was seamless, and the hotels were absolutely top-notch. Highly recommended!",
  },
  {
    id: 3,
    name: "Sophia Lee",
    address: "Seoul, South Korea",
    image:
      "https://images.unsplash.com/photo-1701615004837-40d8573b6652?q=80&w=200",
    rating: 5,
    review:
      "Amazing service! I always find the best luxury accommodations through QuickStay. Their recommendations never disappoint!",
  },
];

// Facility Icon
export const facilityIcons = {
  "Free WiFi": Wifi,
  "Free Breakfast": Coffee,
  "Room Service": ConciergeBell,
  "Mountain View": Mountain,
  "Pool Access": Waves,
};

// For Room Details Page
export const roomCommonData = [
  {
    icon: Home,
    title: "Clean & Safe Stay",
    description: "A well-maintained and hygienic space just for you.",
  },
  {
    icon: ShieldCheck,
    title: "Enhanced Cleaning",
    description: "This host follows Staybnb's strict cleaning standards.",
  },
  {
    icon: MapPin,
    title: "Excellent Location",
    description: "90% of guests rated the location 5 stars.",
  },
  {
    icon: Heart,
    title: "Smooth Check-In",
    description: "100% of guests gave check-in a 5-star rating.",
  },
];
