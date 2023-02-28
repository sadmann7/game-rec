import { motion } from "framer-motion";
import type {
  ButtonHTMLAttributes,
  ComponentProps,
  DetailedHTMLProps,
} from "react";

// external imports
import { Heart } from "lucide-react";

type LikeButtonProps = {
  isLiked: boolean;
  likeCount: number;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  ComponentProps<typeof motion.button>;

const LikeButton = ({
  isLiked,
  likeCount,
  className,
  disabled,
  ...props
}: LikeButtonProps) => {
  return (
    <div className="flex items-center gap-2 disabled:cursor-not-allowed">
      {likeCount > 0 ? (
        <span className="text-sm font-semibold text-white">{likeCount}</span>
      ) : null}
      <motion.button
        className={`h-5 w-5 ${className ?? ""} ${
          disabled ? "cursor-auto opacity-90" : ""
        }`}
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        {...props}
      >
        <Heart
          aria-hidden="true"
          className={`text-red-600 ${isLiked ? "fill-current" : ""}`}
        />
      </motion.button>
    </div>
  );
};

export default LikeButton;
