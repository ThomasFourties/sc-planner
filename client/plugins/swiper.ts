import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

export default defineNuxtPlugin(() => {
  if (process.client) {
    if (typeof Swiper === 'undefined') {
      console.error('Swiper is not defined');
      return;
    }
  }

  return {
    provide: {
      Swiper,
      SwiperSlide,
    },
  };
});
