import Image from "next/image";
import { Autoplay } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

// external imports
import type { RGameResult } from "@/types/globals";

const Carousel = ({ data }: { data: RGameResult[] }) => {
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
        modules={[Autoplay]}
        className="relative aspect-video h-full max-h-80 w-full rounded-lg"
      >
        {data.map((game) => (
          <SwiperSlide key={game.id}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
            {game.background_image ? (
              <Image
                src={game.background_image ?? ""}
                alt={game.name}
                width={1920}
                height={1080}
                className="aspect-video h-full w-full object-cover"
                priority
              />
            ) : null}
            <div className="absolute inset-0 flex flex-col justify-end gap-2.5 p-4">
              <h1 className="text-2xl font-bold text-white line-clamp-1">
                {game.name}
              </h1>
              <p className="text-sm text-white">
                {game.released ? game.released : "TBA"}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Carousel;
