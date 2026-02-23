import * as functions from './modules/baseFunctions.js';

functions.isWebp();


const copyPhoneLink = document.querySelectorAll('.phone-copy');

copyPhoneLink.forEach(link => {
  const tooltip = link.querySelector('.tooltip');
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const phone = link.dataset.phone;
    try {
      await navigator.clipboard.writeText(phone);

      tooltip.classList.add('active');

      setTimeout(() => {
        tooltip.classList.remove('active');
      }, 2000);

    } catch {
      console.log('Не удалось скопировать');
    }
  });
});