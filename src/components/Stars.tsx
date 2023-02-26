// external imports
import { Star } from "lucide-react";

const Stars = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(
        <Star className="fill-orange-400 text-orange-400" size={16} />
      );
    } else {
      stars.push(<Star className="text-gray-300" size={16} />);
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>;
};

export default Stars;
