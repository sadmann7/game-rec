import Image from "next/image";
import { Autoplay } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

// external imports
import type { RGameResult } from "@/types/globals";
import { PLATFORM } from "@prisma/client";
import { useEffect, useState } from "react";
import PlatformIcons from "./PlatformIcons";
import Stars from "./Stars";

const Hero = ({ data }: { data: RGameResult[] }) => {
  const [swiperIndex, setSwiperIndex] = useState<number>(0);
  const [platforms, setPlatforms] = useState<PLATFORM[]>([]);

  const demoPlatforms = [
    {
      id: 4,
      name: "PC",
      slug: "pc",
    },
    {
      id: 187,
      name: "PlayStation 5",
      slug: "playstation5",
    },
    {
      id: 1,
      name: "Xbox One",
      slug: "xbox-one",
    },
    {
      id: 18,
      name: "PlayStation 4",
      slug: "playstation4",
    },
  ];

  useEffect(() => {
    if (!data) return;
    if (!data[swiperIndex]?.platforms) return;
    const convertedPlatforms = data[swiperIndex]?.platforms.map((platform) => {
      switch (
        platform.platform.slug.match(/pc|playstation|xbox|nintendo/gi)?.[0]
      ) {
        case "pc":
          return PLATFORM.PC;
        case "playstation":
          return PLATFORM.PLAYSTATION;
        case "xbox":
          return PLATFORM.XBOX;
        case "nintendo":
          return PLATFORM.NINTENDO;
        default:
          return PLATFORM.PC;
      }
    });
    if (!convertedPlatforms) return;
    setPlatforms(convertedPlatforms);
  }, [data, swiperIndex]);

  return (
    <section aria-label="hero carousel" className="mb-10 w-full">
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onSlideChange={(swiper) => setSwiperIndex(swiper.activeIndex)}
        modules={[Autoplay]}
        className="relative mx-auto aspect-video h-96 w-full max-w-screen-2xl"
      >
        {data.map((game) => (
          <SwiperSlide key={game.id}>
            <div className="absolute inset-0 -z-10 h-screen w-full">
              <div className="absolute inset-0 z-10 h-full w-full bg-black/60 bg-gradient-body from-neutral-900/20 to-black/80" />
              <Image
                src={game.background_image}
                alt={game.name}
                width={1920}
                height={1080}
                className="aspect-video h-96 w-full object-cover"
                priority
              />
            </div>
            <div className="mx-auto mt-28 flex max-w-7xl flex-col items-center justify-center gap-4 px-4">
              <PlatformIcons
                className="gap-2.5"
                platforms={platforms}
                size={22}
                sizeAlt={28}
              />
              <h1 className="text-center text-3xl font-bold text-white line-clamp-2 sm:text-5xl">
                {game.name}
              </h1>
              <Stars rating={game.rating} />
              <p className="text-center text-sm text-white sm:text-base">
                {game.released.split("-").reverse().join("/")}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {game.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-gray-500 px-3 py-1 text-xs font-medium text-white shadow-md"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
