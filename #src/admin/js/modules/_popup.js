(() => {
  const popups = document.querySelectorAll('[data-popup]');

  popups?.forEach(popup => {
    popup.addEventListener('click', (e) => {
      popup.style.display = 'block';
    })
  })

})()