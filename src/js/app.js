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

const headerBurgerBtn = document.querySelector('.header__burger');
const navMobile = document.getElementById('mobile-menu');

headerBurgerBtn?.addEventListener('click', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  if(!navMobile.classList.contains('active')) {
    navMobile.style.left = rect.left + 'px';
    navMobile.style.top = rect.bottom + 'px';

    navMobile.classList.add('active');
  }else {
    navMobile.classList.remove('active');
  }
});
