import Swiper from 'swiper/bundle';
import {Navigation, Pagination, Scrollbar, Thumbs} from "swiper/modules";

const original = document.querySelector('.gallery');
const popupContainer = document.querySelector('.popup .gallery');

const clone = original.cloneNode(true);
popupContainer.replaceWith(clone);

// потом инициализация
initGallery(clone);

function initGallery(gallery) {
  const thumbEl = gallery.querySelector('.gallery__slider-thumb');
  const mainEl = gallery.querySelector('.gallery__slider');
  const nextBtn = document.querySelector('.popup-slider-next-btn');
  const prevBtn = document.querySelector('.popup-slider-prev-btn');

  const thumbsSwiper = new Swiper(thumbEl, {
    slidesPerView: 3,
    spaceBetween: 8,
    watchSlidesProgress: true,
  });

  new Swiper(mainEl, {
    modules: [Navigation, Scrollbar, Thumbs],
    spaceBetween: 20,

    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
    },

    thumbs: {
      swiper: thumbsSwiper,
    },
  });
}