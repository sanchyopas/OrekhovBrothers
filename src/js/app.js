import * as functions from './modules/baseFunctions.js';
import './modules/tabs.js'
import './modules/sliders.js'
import './modules/calculator.js'

functions.isWebp();

document.querySelectorAll('.js-copy-phone')?.forEach(link => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const phone = link.dataset.phone;

    try {
      await navigator.clipboard.writeText(phone);
    } catch {
      console.log('Не удалось скопировать');
    }
  });
});

