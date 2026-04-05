const galleryPopupContent = document.getElementById('gallery-popup');
const galleryBlock = document.getElementById('gallery');

galleryBlock?.addEventListener('click', (e) => {
  const element = e.targer.closest('.gallery');

  galleryPopupContent.innerHTML = element;
});

