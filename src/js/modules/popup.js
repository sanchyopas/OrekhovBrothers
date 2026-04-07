const lightBoxSlider = document.querySelectorAll('[data-lightbox]');
const popup = document.querySelector('.popup');
const popupCloseBtn = document.querySelector('.popup__close');

lightBoxSlider.forEach(slide => {
  slide.addEventListener('click', (e) => {
    const galleryBlock = e.currentTarget.closest('.gallery');
    renderGalleryInPopup(galleryBlock)
  })
})

function renderGalleryInPopup(nodeElement) {
  const container = document.getElementById('gallery-popup');
  container.replaceChildren();

  const clone = nodeElement.cloneNode(true);
  clone.classList.add('gallery--popup');

  container.appendChild(clone);

  popupOpen()

}

function popupOpen() {
  popup.classList.add('is-open');
}

popup?.addEventListener('click', (e) => {
  if (e.target === popup ) closePopup()
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup()
})

popupCloseBtn?.addEventListener('click', closePopup);
function closePopup() {
  popup.classList.remove('is-open');
}