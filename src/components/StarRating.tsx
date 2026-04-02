import { Star } from "lucide-react";

interface StarRatingProps {
  rating?: number;
  maxRating?: number;
  size?: number;
}

const StarRating = ({
  rating = 4,
  maxRating = 5,
  size = 18,
}: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const isFilled = index < rating;

        return (
          <Star
            key={index}
            width={size}
            height={size}
            strokeWidth={1.5}
            className={isFilled ? "text-primary fill-primary" : "text-primary"}
            fill={isFilled ? "currentColor" : "none"}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
