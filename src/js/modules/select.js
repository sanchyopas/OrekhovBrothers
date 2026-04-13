document.querySelectorAll('.dropdown').forEach(function (dropDownWrapper) {
  const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
  const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
  const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
  const dropDownInput = dropDownWrapper.querySelector('.dropdown__input-hidden');

  dropDownBtn.addEventListener('click', function (e) {
    dropDownList.classList.toggle('dropdown__list--visible');
    this.classList.add('dropdown__button--active');
  });

  dropDownBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dropDownList.classList.toggle('dropdown__list--visible');
      dropDownBtn.classList.toggle('dropdown__button--active');
    }
  })

  dropDownListItems.forEach(function (listItem) {
    listItem.addEventListener('click', function (e) {
      e.stopPropagation();

      dropDownListItems.forEach(el => el.classList.remove('dropdown__list-item--active'));
      e.currentTarget.classList.add('dropdown__list-item--active');

      const dropDownText = dropDownBtn.querySelector('.dropdown__button-text');
      const p = this.querySelector('p');

      dropDownText.innerText = p.innerText;
      dropDownBtn.focus();
      dropDownInput.value = this.dataset.value;

      dropDownList.classList.remove('dropdown__list--visible');
    });
  });

  document.addEventListener('click', function (e) {
    if (e.target !== dropDownBtn) {
      dropDownBtn.classList.remove('dropdown__button--active');
      dropDownList.classList.remove('dropdown__list--visible');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' || e.key === 'Escape') {
      dropDownBtn.classList.remove('dropdown__button--active');
      dropDownList.classList.remove('dropdown__list--visible');
    }
  });
});