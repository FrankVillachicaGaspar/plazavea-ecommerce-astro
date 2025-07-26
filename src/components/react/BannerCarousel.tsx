import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import type { IBanner } from "../../types/banner.type";

interface Props {
  banners: IBanner[];
}

export default function BannerCarousel({ banners }: Props) {
  return (
    <div>
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        height={388}
        loop={true}
        className="w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide>
            <img
              src={banner.url}
              alt={banner.altText}
              className="w-full h-[450px]"
            />
          </SwiperSlide>
        ))}
        <div className="absolute z-10 top-1/2 left-0 transform -translate-y-1/2">
          <button className="custom-prev p-3 w-14 rounded-r-full bg-black/60 text-white hover:bg-black/90 transition text-2xl cursor-pointer">
            ❮
          </button>
        </div>
        <div className="absolute z-10 top-1/2 right-0 transform -translate-y-1/2">
          <button className="custom-next p-3 w-14 rounded-l-full bg-black/60 text-white hover:bg-black/90 transition text-2xl cursor-pointer">
            ❯
          </button>
        </div>
      </Swiper>
    </div>
  );
}
