import Image from "next/image";
import FormSearchDestination from "./FormSearchDestination";
import { getUserRecentSearches } from "@/server/db/user";
import { auth } from "@clerk/nextjs/server";
import Motion from "./Motion";

const Hero = async () => {
  const { userId } = await auth();
  const cities = userId ? await getUserRecentSearches(userId) : [];

  return (
    <div className="relative flex items-center h-screen text-white padding-x">
      <Image
        src="/heroImage.jpg"
        alt="Hero background"
        fill
        priority
        quality={90}
        className="object-cover"
      />
      <div className="overlay absolute inset-0 w-full h-full bg-black/70" />

      <div className="relative">
        <Motion className="text-center lg:text-left">
          <p className="bg-[#49B9FF]/50 px-3.5 py-1 rounded-full w-fit">
            The Ultimate Hotel Experience
          </p>
          <h1 className="font-playfair text-2xl md:text-5xl xl:text-[56px] md:leading-[56px] font-bold md:font-extrabold my-4 max-w-xl">
            Discover Your Perfect Gateway Destination
          </h1>
          <p className="text-sm md:text-base max-w-md">
            Unparalleled luxury and comfort await at the world&apos;s most
            exclusive hotels and resorts. Start your journey today.
          </p>
        </Motion>

        <FormSearchDestination cities={cities} />
      </div>
    </div>
  );
};

export default Hero;
