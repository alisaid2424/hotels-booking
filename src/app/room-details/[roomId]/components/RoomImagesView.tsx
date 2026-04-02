"use client";

import { Room } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

const RoomImagesView = ({ room }: { room: Room }) => {
  const images: string[] = room?.images || [];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto Slider
  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-col md:flex-row mt-6 gap-6">
      {/* Main image*/}
      <div className="lg:w-1/2 w-full">
        <Image
          src={images[currentSlide]}
          alt="Room Image"
          width={600}
          height={600}
          className="w-full h-[350px] rounded-xl shadow-lg object-cover transition-all duration-500"
          priority
        />
      </div>

      {/* thumbnails*/}
      <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt="Room Thumbnail"
            width={300}
            height={300}
            priority
            onClick={() => setCurrentSlide(index)}
            className={`w-full h-[167px] rounded-xl shadow-md object-cover cursor-pointer transition
              ${
                currentSlide === index ? "ring-2 ring-primary scale-[1.02]" : ""
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default RoomImagesView;
