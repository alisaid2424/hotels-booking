import React from "react";
import Title from "./Title";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { exclusiveOffers } from "@/constants/data";
import Motion from "./Motion";

const ExclusiveOffers = () => {
  return (
    <div className="flex flex-col items-center padding-x pt-20 pb-28">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <Title
          align="left"
          title="Exclusive Offers"
          subTitle="Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories"
        />

        <Link
          href=""
          className="group flex items-center gap-2 font-medium max-md:mt-12"
        >
          View All Offers
          <ArrowRight className="group-hover:translate-x-1 w-4 h-4 transition" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {exclusiveOffers.map((item, index) => (
          <Motion
            key={item._id}
            index={index}
            className="group relative flex flex-col items-start justify-between gap-1 pt-12 md:pt-16 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center"
          >
            <div
              style={{ backgroundImage: `url(${item.image})` }}
              className="absolute inset-0 -z-10 bg-cover bg-center rounded-xl"
            />

            <p className="px-3 py-1 absolute top-4 start-4 text-xs bg-white text-gray-800 font-medium rounded-full">
              {item.priceOff}% OFF
            </p>

            <div>
              <p className="text-2xl font-medium font-playfair">{item.title}</p>
              <p>{item.description}</p>
              <p className="text-xs text-white/70 mt-3">
                Expires {item.expiryDate}
              </p>
            </div>

            <Link
              href=""
              className="group flex items-center gap-2 font-medium mt-4 mb-5"
            >
              View Offers
              <ArrowRight className="group-hover:translate-x-1 w-4 h-4 transition" />
            </Link>
          </Motion>
        ))}
      </div>
    </div>
  );
};

export default ExclusiveOffers;
