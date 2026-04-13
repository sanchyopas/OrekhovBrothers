import Swiper from 'swiper/bundle';
import {Navigation, Pagination, Scrollbar, Thumbs} from "swiper/modules";

export function initSliders(root = document) {
  const gallery = root.querySelectorAll('.gallery');
  const popup = document.querySelector('.popup');

  gallery.forEach((el) => {
    const sliderGallery = el.querySelector('.gallery__slider');
    const sliderGalleryThumb = el.querySelector('.gallery__slider-thumb');

    if (!sliderGallery || !sliderGalleryThumb) return;

    const thumbs = new Swiper(sliderGalleryThumb, {
      slidesPerView: 'auto',
      spaceBetween: 8,
      freeMode: true,
      watchSlidesProgress: true,

      centeredSlides: true,
      centeredSlidesBounds: true,

    });

    new Swiper(sliderGallery, {
      modules: [Pagination, Thumbs],
      spaceBetween: 20,

      navigation: {
        nextEl: popup?.querySelector('.popup-slider-next-btn'),
        prevEl: popup?.querySelector('.popup-slider-prev-btn'),
      },

      thumbs: {
        swiper: thumbs,
      },
    });
  });
}

initSliders()

const heroSlider = new Swiper('.hero__slider', {
  modules: [Pagination],
  direction: 'horizontal',
  loop: true,
  slidesPerView: 1,
  spaceBetween: 20,
  grabCursor: true,

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },

});