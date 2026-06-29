document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-popup]');

  if (!btn) return;

  const popupID = btn.dataset.popup;
  const popup = document.getElementById(popupID);
  document.documentElement.classList.add('_lock');

  if (popupID && popup) {
    popup.style.display = 'block';
  }
})

export const closePopup = (popupId) => {
  const popup = document.getElementById(popupId);
  if (popup) {
    popup.style.display = 'none';
  }
}



