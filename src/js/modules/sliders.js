import Swiper from 'swiper/bundle';
import {Navigation, Pagination, Scrollbar, Thumbs} from "swiper/modules";

const singleSliderThumb = new Swiper('.single__slider-thumb', {
  direction: 'horizontal',
  loop: true,
  autoHeight: true,
  spaceBetween: 8,
  slidesPerView: 3,

});

const singleSlider = new Swiper('.single__slider', {
  modules: [Scrollbar, Pagination, Thumbs],
  direction: 'horizontal',
  loop: true,
  autoHeight: true,
  spaceBetween: 20,

  navigation: {
    nextEl: '.project__slider-next',
    prevEl: '.project__slider-prev',
  },

  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
  },

  thumbs: {
    swiper: singleSliderThumb,
  },

});