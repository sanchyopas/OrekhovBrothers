import {initSliders} from "./sliders.js";

const lightBoxSlider = document.querySelectorAll('[data-lightbox]');
const popupGallery = document.querySelector('.popup-gallery');
const popupCloseBtn = document.querySelector('.popup-gallery__close');

lightBoxSlider.forEach(slide => {
  slide.addEventListener('click', (e) => {
    const galleryBlock = e.currentTarget.closest('.gallery');
    renderGalleryInPopup(galleryBlock)
  })
})

function renderGalleryInPopup(nodeElement) {
  const container = document.getElementById('popup-gallery');
  container.replaceChildren();

  const clone = nodeElement.cloneNode(true);
  clone.classList.add('popup--gallery');

  container.appendChild(clone);

  popupOpen()

  requestAnimationFrame(() => {
    initSliders(document.getElementById('popup-gallery'));
  });

}

function popupOpen() {
  popupGallery.classList.add('is-open');
}

popupGallery?.addEventListener('click', (e) => {
  if (e.target === popupGallery ) closePopup()
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup()
})

popupCloseBtn?.addEventListener('click', closePopup);
function closePopup() {
  popupGallery.classList.remove('is-open');
}