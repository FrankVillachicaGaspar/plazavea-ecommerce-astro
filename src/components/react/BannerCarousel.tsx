import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import type { Banner } from "../../db/schema";

interface Props {
    banners: Banner[];
}

export default function BannerCarousel({ banners }: Props) {
    return (
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
                        className="w-full h-[388px]"
                    />
                </SwiperSlide>
            ))}
            <div className="absolute z-10 top-1/2 left-4 transform -translate-y-1/2">
                <button className="custom-prev btn btn-circle bg-primary text-white shadow-md hover:bg-red-800 transition">
                    ❮
                </button>
            </div>
            <div className="absolute z-10 top-1/2 right-4 transform -translate-y-1/2">
                <button className="custom-next btn btn-circle bg-primary text-white shadow-md hover:bg-red-800 transition">
                    ❯
                </button>
            </div>
        </Swiper>
    );
}
