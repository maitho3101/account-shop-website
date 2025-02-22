import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, Pagination, A11y, Autoplay } from "swiper";
import { useRouter } from "next/router";
import Image from "next/image";

const slideData = [
  { key: 0, redirectURL: "", imageURL: "/img/banner.png" },
  { key: 1, redirectURL: "", imageURL: "/img/banner-2.jpg" },
  { key: 2, redirectURL: "", imageURL: "/img/banner.png" },
  { key: 3, redirectURL: "", imageURL: "/img/banner-2.jpg" },
  { key: 4, redirectURL: "", imageURL: "/img/banner.png" },
];
export default function SlideBanner() {
  const route = useRouter();

  return (
    <Swiper
      className=""
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      navigation
      pagination={{ clickable: true, type: "bullets" }}
    >
      {slideData?.map((e) => (
        <SwiperSlide onClick={() => route.push(e.redirectURL)} key={e.key}>
          <Image
            src={e.imageURL}
            alt="banner-home"
            width={1000}
            height={430}
            className="w-full h-full"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
