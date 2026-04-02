import ExclusiveOffers from "@/components/ExclusiveOffers";
import FeaturedDestination from "@/components/FeaturedDestination";
import Hero from "@/components/Hero";
import NewsLetter from "@/components/NewsLetter";
import RecommendedHotels from "@/components/RecommendedHotels";
import Testimonial from "@/components/Testimonial";

const HomePage = () => {
  return (
    <>
      <Hero />
      <RecommendedHotels />
      <FeaturedDestination />
      <ExclusiveOffers />
      <Testimonial />
      <NewsLetter />
    </>
  );
};

export default HomePage;
