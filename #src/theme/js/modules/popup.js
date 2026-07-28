import { initSliders } from './sliders.js';
import { bodyLock, bodyUnLock } from './baseFunctions.js';

const popupGallery = document.querySelector('.popup-gallery');
const popupGalleryContainer = document.getElementById('popup-gallery');

let activePopup = null;

/**
 * Открывает popup.
 */
function showPopup(popup) {
  if (!popup) {
    return;
  }

  if (activePopup && activePopup !== popup) {
    hidePopup(activePopup, false);
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
 * Закрывает popup.
 *
 * @param {Element} popup
 * @param {boolean} unlockBody
 */
function hidePopup(popup, unlockBody = true) {
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

  if (unlockBody) {
    bodyUnLock();
  }
}

export function closePopupById(popupId) {
  const popup = document.getElementById(popupId);

  if (!popup) {
    return;
  }

  hidePopup(popup);
}

/**
 * Закрывает активный popup.
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
    console.warn('Родительский элемент .single не найден');
    return null;
  }

  const productImage = productElement.querySelector(
    '.gallery__slider .swiper-slide:first-child img'
  );

  const productName =
    productElement
      .querySelector('.single__parameters > .single__title')
      ?.textContent
      ?.trim() ?? '';

  const totalPrice =
    productElement
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
 * Создаёт строку параметра внутри popup.
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
 * Заполняет popup заявки данными товара.
 */
function fillCallbackPopup(trigger, popup) {
  const productData = collectProductData(trigger);

  if (!productData) {
    console.warn('Не удалось собрать данные товара');
    return;
  }

  const imageElement = popup.querySelector(
    '[data-callback-image]'
  );

  const imageWrapper = imageElement?.closest('.popup__image');

  const parametersElement = popup.querySelector(
    '[data-callback-parameters]'
  );

  const hiddenInput = popup.querySelector(
    '[data-callback-product-data]'
  );

  /*
   * Изображение товара.
   */
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

  /*
   * Параметры товара.
   */
  if (parametersElement) {
    const fragment = document.createDocumentFragment();

    if (productData.product.name) {
      fragment.append(
        createParameterElement(
          'Проект',
          productData.product.name
        )
      );
    }

    productData.configuration.forEach((item) => {
      fragment.append(
        createParameterElement(
          item.field || 'Параметр',
          item.value
        )
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

    if (productData.product.totalPrice) {
      fragment.append(
        createParameterElement(
          'Расчётная стоимость',
          productData.product.totalPrice
        )
      );
    }

    parametersElement.replaceChildren(fragment);
  }

  /*
   * JSON для отправки на Django.
   */
  if (hiddenInput) {
    hiddenInput.value = JSON.stringify(productData);
  } else {
    console.warn(
      'Поле [data-callback-product-data] не найдено'
    );
  }
}

/**
 * Открывает обычный popup через data-popup.
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

  const hiddenField = currentPopup.querySelector(
    '#order-product'
  );

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
    console.warn(
      'Элемент с data-lightbox должен находиться внутри .gallery'
    );
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
 */
function destroyGallerySliders() {
  if (!popupGalleryContainer) {
    return;
  }

  const swiperElements =
    popupGalleryContainer.querySelectorAll('.swiper');

  swiperElements.forEach((swiperElement) => {
    swiperElement.swiper?.destroy(true, true);
  });
}

/**
 * Проверяет, был ли клик вне содержимого popup.
 */
function isClickOutsidePopupContent(target) {
  if (!activePopup || !activePopup.contains(target)) {
    return false;
  }

  const popupContent = activePopup.querySelector(
    '.popup__content, .popup-gallery__content'
  );

  if (!popupContent) {
    return target === activePopup;
  }

  return !popupContent.contains(target);
}

/**
 * Единый обработчик кликов.
 */
document.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  /*
   * Открытие галереи.
   */
  const lightboxTrigger = target.closest('[data-lightbox]');

  if (lightboxTrigger) {
    event.preventDefault();
    openGalleryPopup(lightboxTrigger);
    return;
  }

  /*
   * Закрытие popup.
   *
   * Проверяем перед открытием, чтобы кнопка закрытия
   * случайно не воспринималась как data-popup.
   */
  const closeButton = target.closest('[data-close]');

  if (closeButton) {
    event.preventDefault();

    const popup = closeButton.closest(
      '.popup, .popup-gallery'
    );

    if (popup) {
      hidePopup(popup);
    } else {
      closeActivePopup();
    }

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
   * Закрытие по клику вне содержимого popup.
   */
  if (isClickOutsidePopupContent(target)) {
    closeActivePopup();
  }
});

/**
 * Закрытие по Escape.
 */
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !activePopup) {
    return;
  }

  event.preventDefault();
  closeActivePopup();
});