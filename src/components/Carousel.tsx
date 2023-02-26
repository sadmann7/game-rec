import Image from "next/image";
import { useRef } from "react";
import type SwiperCore from "swiper";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import type { NavigationOptions } from "swiper/types/modules/navigation";

// external imports
import type { RGameResult } from "@/types/globals";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Carousel = ({ data }: { data: RGameResult[] }) => {
  const leftArrowRef = useRef<HTMLButtonElement>(null);
  const rightArrowRef = useRef<HTMLButtonElement>(null);
  const onBeforeInit = (swiper: SwiperCore) => {
    (swiper.params.navigation as NavigationOptions).prevEl =
      leftArrowRef.current;
    (swiper.params.navigation as NavigationOptions).nextEl =
      rightArrowRef.current;
  };

  return (
    <section
      aria-label="hero carousel"
      className="container relative h-full w-full max-w-7xl overflow-hidden"
    >
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={true}
        onBeforeInit={onBeforeInit}
        modules={[Autoplay, Navigation]}
        className="aspect-video h-full max-h-80 w-full"
      >
        {data.map((game) => (
          <SwiperSlide key={game.id}>
            {game.background_image ? (
              <Image
                src={game.background_image ?? ""}
                alt={game.name}
                width={1920}
                height={1080}
                className="aspect-video object-cover"
                priority
              />
            ) : null}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Carousel;
