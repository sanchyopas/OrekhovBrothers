import * as functions from './modules/baseFunctions.js';
import './modules/tabs.js';
import './modules/sliders.js';
import './modules/calculator.js';
import './modules/popup.js';

functions.isWebp();

document.querySelectorAll('.js-copy-phone')?.forEach(link => {
  link.addEventListener('click', async (e) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const phone = link.dataset.phone;

    if(!isMobile) {
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


document.querySelectorAll('.dropdown').forEach(function (dropDownWrapper) {
  const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
  const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
  const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
  const dropDownInput = dropDownWrapper.querySelector('.dropdown__input-hidden');

  // Клик по кнопке. Открыть/Закрыть select
  dropDownBtn.addEventListener('click', function (e) {
    dropDownList.classList.toggle('dropdown__list--visible');
    this.classList.add('dropdown__button--active');
  });

  // Выбор элемента списка. Запомнить выбранное значение. Закрыть дропдаун
  dropDownListItems.forEach(function (listItem) {
    listItem.addEventListener('click', function (e) {
      e.stopPropagation();
      dropDownBtn.innerText = this.innerText;
      dropDownBtn.focus();
      dropDownInput.value = this.dataset.value;
      dropDownList.classList.remove('dropdown__list--visible');
    });
  });

  // Клик снаружи дропдауна. Закрыть дропдаун
  document.addEventListener('click', function (e) {
    if (e.target !== dropDownBtn) {
      dropDownBtn.classList.remove('dropdown__button--active');
      dropDownList.classList.remove('dropdown__list--visible');
    }
  });

  // Нажатие на Tab или Escape. Закрыть дропдаун
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' || e.key === 'Escape') {
      dropDownBtn.classList.remove('dropdown__button--active');
      dropDownList.classList.remove('dropdown__list--visible');
    }
  });
});
