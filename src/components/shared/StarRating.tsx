import { Star } from 'lucide-react';

interface Props {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({ rating, size = 16, interactive = false, onChange }: Props) {
  return (
    <div className="flex items-center gap-0.5" style={{ direction: 'ltr' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating);
        const partial = !filled && star === Math.ceil(rating);
        const partialPercent = partial ? (rating - Math.floor(rating)) * 100 : 0;

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            className={`relative ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <Star
              size={size}
              className="text-[#2a2a2a]"
              fill="#2a2a2a"
            />
            {(filled || partial) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : `${partialPercent}%` }}
              >
                <Star
                  size={size}
                  className="text-[#c8a45c]"
                  fill="#c8a45c"
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
