import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
}

export default function StarRating({ rating, size = 16 }: StarRatingProps) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={size}
        className={i <= rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}
      />
    );
  }
  return <div className="flex gap-0.5">{stars}</div>;
}
