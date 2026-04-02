import { testimonials } from "@/constants/data";
import Title from "./Title";
import StarRating from "./StarRating";
import Image from "next/image";
import Motion from "./Motion";

const Testimonial = () => {
  return (
    <div className="flex flex-col items-center bg-slate-50 padding-x pt-20 pb-28">
      <Title
        title="What Our Guests Say"
        subTitle="Discover why discerning travelers consistently choose QuickStay for their exclusive and luxurious accommodations around the world."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-20">
        {testimonials.map((testimonial, index) => (
          <Motion
            key={testimonial.id}
            index={index}
            className="bg-white p-6 rounded-xl shadow"
          >
            <div className="flex items-center gap-3">
              <Image
                className="w-12 h-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
                width={100}
                height={100}
              />
              <div>
                <p className="font-playfair text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.address}</p>
              </div>
            </div>
            <div className="mt-4">
              <StarRating rating={testimonial.rating} />
            </div>

            <p className="text-gray-500 max-w-90 mt-4">
              &ldquo;{testimonial.review}&rdquo;
            </p>
          </Motion>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
