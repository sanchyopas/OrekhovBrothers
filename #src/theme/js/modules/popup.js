import {initSliders} from './sliders.js';
import {bodyLock, bodyUnLock} from "./baseFunctions.js";

const popupGallery = document.querySelector('.popup-gallery');
const popupGalleryContainer = document.getElementById('popup-gallery');

let activePopup = null;

/**
 * Открывает обычный popup по его DOM-элементу.
 */
function showPopup(popup) {

  if (!popup) {
    return;
  }

  // Закрываем ранее открытый popup
  if (activePopup && activePopup !== popup) {
    hidePopup(activePopup);
  }

  activePopup = popup;

  if (popup.classList.contains('popup-gallery')) {
    popup.classList.add('is-open');
  } else {
    popup.classList.add('popup_show');
  }

  popup.setAttribute('aria-hidden', 'false');

  bodyLock();
}

/**
 * Закрывает конкретный popup.
 */
function hidePopup(popup) {
  if (!popup) {
    return;
  }

  popup.classList.remove('popup_show', 'is-open');
  popup.setAttribute('aria-hidden', 'true');

  if (popup === popupGallery) {
    destroyGallerySliders();
    popupGalleryContainer?.replaceChildren();
  }

  if (activePopup === popup) {
    activePopup = null;
  }

  bodyUnLock();
}

/**
 * Закрывает текущий открытый popup.
 */
function closeActivePopup() {
  if (!activePopup) {
    return;
  }

  hidePopup(activePopup);
}

/**
 * Открывает обычный popup через data-popup.
 *
 * Пример:
 * <button data-popup="order-popup" data-name="Товар">Открыть</button>
 */
function openDefaultPopup(trigger) {
  const popupId = trigger.dataset.popup;

  if (!popupId) {
    return;
  }

  const currentPopup = document.getElementById(popupId);

  if (!currentPopup) {
    console.warn(`Popup с id="${popupId}" не найден`);
    return;
  }

  const hiddenField = currentPopup.querySelector('#order-product');

  if (hiddenField && trigger.dataset.name) {
    hiddenField.value = trigger.dataset.name;
  }

  showPopup(currentPopup);
}

/**
 * Клонирует галерею и открывает её в popup.
 */
function openGalleryPopup(trigger) {
  if (!popupGallery || !popupGalleryContainer) {
    console.warn('Popup галереи не найден');
    return;
  }

  const gallery = trigger.closest('.gallery');

  if (!gallery) {
    console.warn('Элемент с data-lightbox должен находиться внутри .gallery');
    return;
  }

  destroyGallerySliders();
  popupGalleryContainer.replaceChildren();

  const galleryClone = gallery.cloneNode(true);

  galleryClone.classList.add('popup--gallery');

  popupGalleryContainer.appendChild(galleryClone);

  showPopup(popupGallery);

  requestAnimationFrame(() => {
    initSliders(popupGalleryContainer);
  });
}

/**
 * Уничтожает экземпляры Swiper внутри popup-галереи.
 *
 * Swiper сохраняет экземпляр в DOM-элементе как element.swiper.
 */
function destroyGallerySliders() {
  if (!popupGalleryContainer) {
    return;
  }

  const swiperElements = popupGalleryContainer.querySelectorAll('.swiper');

  swiperElements.forEach((swiperElement) => {
    swiperElement.swiper?.destroy(true, true);
  });
}

/**
 * Единый обработчик кликов.
 *
 * Event delegation позволяет обрабатывать также динамически
 * добавленные элементы.
 */
document.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  /*
  /*
   * Открытие галереи.
   * Проверяем раньше data-popup, чтобы логика не конфликтовала.
   */
  const lightboxTrigger = target.closest('[data-lightbox]');

  if (lightboxTrigger) {
    event.preventDefault();
    openGalleryPopup(lightboxTrigger);
    return;
  }

  /*
   * Открытие обычного popup.
   */
  const popupTrigger = target.closest('[data-popup]');

  if (popupTrigger) {
    event.preventDefault();
    openDefaultPopup(popupTrigger);
    return;
  }

  /*
   * Закрытие по кнопке data-close.
   */
  const closeButton = target.closest('[data-close]');

  if (closeButton) {
    event.preventDefault();

    const popup = closeButton.closest('.popup, .popup-gallery');

    if (popup) {
      hidePopup(popup);
    } else {
      closeActivePopup();
    }

    return;
  }

  /*
   * Закрытие по клику непосредственно на подложку.
   *
   * Внутри .popup__content и .popup-gallery__content
   * popup закрываться не будет.
   */
  if (
    activePopup &&
    event.target === activePopup
  ) {
    closeActivePopup();
  }
});

/**
 * Закрытие по Escape.
 */
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') {
    return;
  }

  closeActivePopup();
});