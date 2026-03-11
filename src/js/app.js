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


const btn = document.getElementById('show-more-options')
const options = document.querySelector('.options__inner')

btn?.addEventListener('click', () => {

  if (options.classList.contains('active')) {
    options.style.maxHeight = '114px'
    options.classList.remove('active')
    btn.innerText = 'Показать все'

  } else {
    options.style.maxHeight = options.scrollHeight + 'px'
    options.classList.add('active')

    btn.innerText = 'Свернуть'
  }

})

