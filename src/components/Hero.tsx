import Image from "next/image";
import { Autoplay } from "swiper";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

// external imports
import type { RGameResult } from "@/types/globals";
import { GrWindows } from "react-icons/gr";
import { IoLogoPlaystation, IoLogoXbox } from "react-icons/io5";
import {
  SiActivision,
  SiEpicgames,
  SiGogdotcom,
  SiNintendoswitch,
  SiRiotgames,
  SiSteam,
} from "react-icons/si";
import Stars from "./Stars";

const Hero = ({ data }: { data: RGameResult[] }) => {
  return (
    <section aria-label="hero carousel" className="mb-14 w-full">
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
        className="relative aspect-video h-full max-h-96 w-full"
      >
        {data.map((game) => (
          <SwiperSlide key={game.id}>
            <div className="absolute top-0 left-0 -z-10 w-full">
              <div className="absolute inset-0 z-10 h-full w-full bg-black/50 bg-gradient-body from-gray-900/10 to-[#010511]" />
              {game.background_image ? (
                <Image
                  src={game.background_image}
                  alt={game.name}
                  width={1920}
                  height={1080}
                  className="object-cover"
                  priority
                />
              ) : null}
            </div>
            <div className="absolute inset-0 flex flex-col justify-end gap-2.5 p-4">
              <h1 className="text-2xl font-bold text-white line-clamp-1">
                {game.name}
              </h1>
              <p className="text-sm text-white">
                {game.released ? game.released : "TBA"}
              </p>
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
                    size={20}
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
              <div className="flex items-center gap-2">
                {game.stores?.map((store) => {
                  switch (
                    store.store.slug.match(
                      /steam|epic|gog|riot|gog|activision|playstation|xbox|switch/
                    )?.[0]
                  ) {
                    case "steam":
                      return (
                        <SiSteam
                          key={store.store.id}
                          className="text-white"
                          size={20}
                        />
                      );
                    case "epic":
                      return (
                        <SiEpicgames
                          key={store.store.id}
                          className="text-white"
                          size={20}
                        />
                      );
                    case "gog":
                      return (
                        <SiGogdotcom
                          key={store.store.id}
                          className="text-white"
                          size={20}
                        />
                      );
                    case "riot":
                      return (
                        <SiRiotgames
                          key={store.store.id}
                          className="text-white"
                          size={20}
                        />
                      );
                    case "activision":
                      return (
                        <SiActivision
                          key={store.store.id}
                          className="text-white"
                          size={20}
                        />
                      );
                    case "playstation":
                      return (
                        <IoLogoPlaystation
                          key={store.store.id}
                          className="text-white"
                          size={20}
                        />
                      );
                    case "xbox":
                      return (
                        <IoLogoXbox
                          key={store.store.id}
                          className="text-white"
                          size={20}
                        />
                      );
                    case "switch":
                      return (
                        <SiNintendoswitch
                          key={store.store.id}
                          className="text-white"
                          size={20}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </div>
              <Stars rating={game.rating} />
              <div className="flex items-center gap-2">
                {game.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-gray-600 px-2 py-1 text-xs text-white"
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
