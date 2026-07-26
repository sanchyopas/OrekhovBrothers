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
 * Преобразует цену из data-price в число.
 */
function parsePrice(value) {
  if (!value) {
    return 0;
  }

  const normalizedValue = String(value)
    .replace(/\s/g, '')
    .replace(',', '.');

  const price = Number(normalizedValue);

  return Number.isFinite(price) ? price : 0;
}

/**
 * Собирает выбранную конфигурацию товара.
 */
function collectProductData(trigger) {
  const productElement = trigger.closest('.single');

  if (!productElement) {
    return null;
  }

  const productImage = productElement.querySelector(
    '.gallery__slider .swiper-slide:first-child img'
  );

  const productName = productElement
    .querySelector('.single__parameters > .single__title')
    ?.textContent
    ?.trim() ?? '';

  const totalPrice = productElement
    .querySelector('#single-price')
    ?.textContent
    ?.trim() ?? '';

  const configuration = Array.from(
    productElement.querySelectorAll(
      '.calc input[type="radio"]:checked'
    )
  ).map((input) => {
    const fieldTitle =
      input.dataset.fieldTitle ??
      input
        .closest('.calc__group')
        ?.querySelector('.calc__title')
        ?.textContent
        ?.trim() ??
      '';

    return {
      field: fieldTitle,
      value: input.value,
      price: parsePrice(input.dataset.price),
    };
  });

  const additionalOptions = Array.from(
    productElement.querySelectorAll(
      '.options input[type="checkbox"]:checked'
    )
  ).map((input) => ({
    name: input.value,
    price: parsePrice(input.dataset.price),
  }));

  return {
    product: {
      name: productName,
      image: productImage?.currentSrc || productImage?.src || '',
      totalPrice,
      pageUrl: window.location.href,
    },
    configuration,
    additionalOptions,
  };
}

/**
 * Создаёт одну строку с параметром.
 */
function createParameterElement(label, value) {
  const element = document.createElement('div');
  element.classList.add('popup__parametr-item');

  const labelElement = document.createElement('span');
  labelElement.classList.add('popup__parametr-label');
  labelElement.textContent = label;

  const valueElement = document.createElement('strong');
  valueElement.classList.add('popup__parametr-value');
  valueElement.textContent = value;

  element.append(labelElement, valueElement);

  return element;
}

/**
 * Заполняет popup данными выбранного товара.
 */
function fillCallbackPopup(trigger, popup) {
  const productData = collectProductData(trigger);

  if (!productData) {
    console.warn('Не удалось собрать данные товара');
    return;
  }

  const imageElement = popup.querySelector('[data-callback-image]');
  const imageWrapper = imageElement?.closest('.popup__image');
  const parametersElement = popup.querySelector(
    '[data-callback-parameters]'
  );
  const hiddenInput = popup.querySelector(
    '[data-callback-product-data]'
  );

  if (imageElement && imageWrapper) {
    if (productData.product.image) {
      imageElement.src = productData.product.image;
      imageElement.alt = productData.product.name;
      imageWrapper.hidden = false;
    } else {
      imageElement.removeAttribute('src');
      imageElement.alt = '';
      imageWrapper.hidden = true;
    }
  }

  if (parametersElement) {
    const fragment = document.createDocumentFragment();

    fragment.append(
      createParameterElement(
        'Проект',
        productData.product.name
      )
    );

    productData.configuration.forEach((item) => {
      fragment.append(
        createParameterElement(item.field, item.value)
      );
    });

    if (productData.additionalOptions.length > 0) {
      const optionsText = productData.additionalOptions
        .map((option) => option.name)
        .join(', ');

      fragment.append(
        createParameterElement(
          'Дополнительные опции',
          optionsText
        )
      );
    }

    fragment.append(
      createParameterElement(
        'Расчётная стоимость',
        productData.product.totalPrice
      )
    );

    parametersElement.replaceChildren(fragment);
  }

  if (hiddenInput) {
    hiddenInput.value = JSON.stringify(productData);
  }
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

  if (popupId === 'callback') {
    fillCallbackPopup(trigger, currentPopup);
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