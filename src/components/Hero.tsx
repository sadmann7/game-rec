import Image from "next/image";
import { Autoplay } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

// external imports
import type { RGameResult } from "@/types/globals";
import { GrWindows } from "react-icons/gr";
import { IoLogoPlaystation, IoLogoXbox } from "react-icons/io5";
import { SiNintendoswitch } from "react-icons/si";
import Stars from "./Stars";

const Hero = ({ data }: { data: RGameResult[] }) => {
  return (
    <section
      aria-label="hero carousel"
      className="mb-14 w-full max-w-screen-2xl"
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
        className="relative aspect-video h-80 w-full sm:h-96"
      >
        {data.map((game) => (
          <SwiperSlide key={game.id}>
            <div className="absolute inset-0 -z-10 h-screen w-full">
              <div className="absolute inset-0 z-10 h-full w-full bg-black/60 bg-gradient-body from-black/10 to-transparent" />
              <Image
                src={game.background_image}
                alt={game.name}
                width={1920}
                height={1080}
                className="aspect-video h-80 w-full object-cover sm:h-96"
                priority
              />
            </div>
            <div className="mx-auto mt-20 flex max-w-7xl flex-col items-center justify-center gap-4 px-4">
              <div className="flex items-center gap-2">
                {game.platforms.find((platform) =>
                  platform.platform.slug.includes("pc")
                ) ? (
                  <GrWindows
                    key={crypto.randomUUID()}
                    className="text-white"
                    size={20}
                  />
                ) : null}
                {game.platforms.find((platform) =>
                  platform.platform.slug.includes("playstation")
                ) ? (
                  <IoLogoPlaystation
                    key={crypto.randomUUID()}
                    className="text-white"
                    size={22}
                  />
                ) : null}
                {game.platforms.find((platform) =>
                  platform.platform.slug.includes("xbox")
                ) ? (
                  <IoLogoXbox
                    key={crypto.randomUUID()}
                    className="text-white"
                    size={20}
                  />
                ) : null}
                {game.platforms.find((platform) =>
                  platform.platform.slug.includes("switch")
                ) ? (
                  <SiNintendoswitch
                    key={crypto.randomUUID()}
                    className="text-white"
                    size={20}
                  />
                ) : null}
              </div>
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
