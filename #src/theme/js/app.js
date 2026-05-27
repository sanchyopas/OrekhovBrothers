import * as functions from './modules/baseFunctions.js';
import './modules/tabs.js';
import './modules/sliders.js';
import './modules/calculator.js';
import './modules/popup.js';
import './modules/select.js';

functions.isWebp();

document.querySelectorAll('.js-copy-clipboard')?.forEach(link => {
  link.addEventListener('click', async (e) => {
    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const phone = link.dataset.copy;

    if (!isMobile) {
      e.preventDefault();

      try {
        await navigator.clipboard.writeText(phone);
      } catch {
        console.log('Не удалось скопировать');
      }
    }
  });
});

const btn = document.getElementById('show-more-options')
const options = document.querySelector('.options__inner')

btn?.addEventListener('click', () => {
  if (options.classList.contains('active')) {

    options.style.maxHeight = '114px'
    options.classList.remove('active')

  } else {

    options.style.maxHeight = options.scrollHeight + 'px'
    options.classList.add('active')

  }

})


