let activePopup = null;

const openPopup = (popup) => {
  if (!popup) {
    return;
  }

  if (activePopup && activePopup !== popup) {
    closePopup(activePopup);
  }

  activePopup = popup;

  popup.style.display = 'block';
  popup.setAttribute('aria-hidden', 'false');

  document.documentElement.classList.add('_lock');
};

export const closePopup = (popupOrId) => {
  const popup =
    typeof popupOrId === 'string'
      ? document.getElementById(popupOrId)
      : popupOrId;

  if (!popup) {
    return;
  }

  popup.style.display = 'none';
  popup.setAttribute('aria-hidden', 'true');

  if (activePopup === popup) {
    activePopup = null;
  }

  document.documentElement.classList.remove('_lock');
};

document.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  /*
   * Открытие popup.
   */
  const openButton = target.closest('[data-popup]');

  if (openButton) {
    event.preventDefault();

    const popupId = openButton.dataset.popup;
    const popup = document.getElementById(popupId);

    if (!popup) {
      console.warn(`Popup с id="${popupId}" не найден`);
      return;
    }

    openPopup(popup);
    return;
  }

  /*
   * Закрытие по крестику.
   */
  const closeButton = target.closest('[data-popup-close]');

  if (closeButton) {
    event.preventDefault();

    const popup = closeButton.closest('.popup-config');

    closePopup(popup);
    return;
  }

  /*
   * Клик вне popup.
   */
  if (
    activePopup &&
    !activePopup.contains(target)
  ) {
    closePopup(activePopup);
  }
});

/*
 * Закрытие по Escape.
 */
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && activePopup) {
    closePopup(activePopup);
  }
});