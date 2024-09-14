import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Keyboard, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import img1 from "../../assets/about1.png";
import img2 from "../../assets/about2.png";
import img3 from "../../assets/about3.png";
import img4 from "../../assets/about4.png";

const travelData = [
  {
    image: img1,
  },
  {
    image: img2,
  },
  {
    image: img3,
  },
  {
    image: img4,
  },
];

const ImageSwiper = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(1, false, false);
    }
  }, []);

  return (
    <div className="bg-white">
      <main className="relative w-[calc(min(70rem,90%))] mx-auto flex items-center min-h-screen py-[min(20vh,3rem)]">
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          keyboard={{ enabled: true }}
          mousewheel={{ thresholdDelta: 70 }}
          spaceBetween={30}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            1024: {
              slidesPerView: 2,
            },
          }}
          modules={[EffectCoverflow, Keyboard, Mousewheel]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="w-full md:w-[85%] py-7.5"
        >
          {travelData.map((item, index) => (
            <SwiperSlide
              key={index}
              className="w-75 h-[35rem] flex flex-col justify-end items-start shadow-md rounded-b-lg"
            >
              <div className="relative w-full h-full overflow-hidden rotate-180 leading-none -bottom-[0.063rem] rounded-b-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full absolute inset-0 object-fit items-center -z-10 transition-transform duration-300 ease-in-out -rotate-180 group-hover:scale-120 group-hover:-rotate-185"
                />
                <svg
                  className="relative block w-[calc(300%+1.3px)] h-20 rotate-y-180"
                  data-name="Layer 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1200 120"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                    opacity=".25"
                    className="fill-white"
                  />
                  <path
                    d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                    opacity=".5"
                    className="fill-white"
                  />
                  <path
                    d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                    className="fill-white"
                  />
                </svg>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </main>
    </div>
  );
};

export default ImageSwiper;
