import { Star } from "lucide-react";
import clsx from "clsx";

export function StarRating({
  value,
  reviews,
  className,
}: {
  value: number;
  reviews?: number;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < Math.round(value)
                ? "fill-gold text-gold"
                : "fill-none text-green-900/25"
            }
          />
        ))}
      </div>
      <span className="text-xs text-ink/60">
        {value.toFixed(1)}
        {reviews != null && ` (${reviews})`}
      </span>
    </div>
  );
}
