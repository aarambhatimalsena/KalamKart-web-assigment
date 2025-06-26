import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";

import hero1 from '../../assets/banner1.png';
import hero2 from '../../assets/banner2.png';

const HeroSlider = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        loop
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        className="h-[550px]"
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="relative w-full h-full">
            <img src={hero1} alt="Hero 1" className="w-full h-full object-cover" />
            <div className="absolute top-1/2 left-16 transform -translate-y-1/2">
              <button
                onClick={() => navigate("/products")}
                className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-black hover:text-white transition"
              >
                Shop Now →
              </button>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="relative w-full h-full">
            <img src={hero2} alt="Hero 2" className="w-full h-full object-cover" />
            <div className="absolute top-1/2 left-16 transform -translate-y-1/2">
              <button
                onClick={() => navigate("/products")}
                className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-white hover:text-black transition"
              >
                Explore Now
              </button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HeroSlider;
