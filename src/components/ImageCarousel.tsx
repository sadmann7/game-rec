import Image from "next/image";
import { Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";

const ImageCarousel = ({ data }: { data: string[] }) => {
  return (
    <Swiper
      loop={true}
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      navigation={true}
      modules={[Autoplay, Navigation]}
      className="relative aspect-video"
    >
      {data.map((item) => (
        <SwiperSlide key={item}>
          <div className="absolute inset-0 bg-black/25" />
          <Image
            src={item}
            alt={item}
            width={1920}
            height={1080}
            className="aspect-video object-contain"
            loading="lazy"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;
