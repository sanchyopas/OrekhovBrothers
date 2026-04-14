function createSelect(wrapper) {
  const button = wrapper.querySelector('.dropdown__button');
  const list = wrapper.querySelector('.dropdown__list');
  const items = wrapper.querySelectorAll('.dropdown__list-item');
  const input = wrapper.querySelector('.dropdown__input-hidden');

  const api = {
    toggle() {
      list.classList.toggle('dropdown__list--visible');
      button.classList.toggle('dropdown__button--active');
    },
    open() {
      list.classList.add('dropdown__list--visible');
      button.classList.add('dropdown__button--active');
    },
    close() {
      list.classList.remove('dropdown__list--visible');
      button.classList.remove('dropdown__button--active');
    },
    onKeyDown(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.open();
      }
    }
  }

  button.addEventListener('click', () => api.toggle());

  button.addEventListener('keydown', api.onKeyDown.bind(api));

  items.forEach((item) => {
    item.addEventListener('mousemove', (e) => {
      item.focus()
    })
  })

  items.forEach((listItem) => {
    listItem.addEventListener('click', (e) => {
      e.stopPropagation();

      items.forEach(el => el.classList.remove('dropdown__list-item--active'));
      e.currentTarget.classList.add('dropdown__list-item--active');

      const valueText = button.querySelector('.dropdown__button-text');
      const text = e.currentTarget.querySelector('p');

      valueText.innerText = text.innerText;
      // button.focus();
      input.value = e.currentTarget.dataset.value;

      api.close();

    });
  });

  /* Тут надо как то решить с глобальными обработчиками в функции */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      api.close();
    }
  });
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      api.close();
    }
  });
  /* ----------------------------------------------------------------------------- */

  return api;

}

document.querySelectorAll('.dropdown').forEach(createSelect);


/*
document.querySelectorAll('.dropdown').forEach(dropDownWrapper => {
  const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
  const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
  const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');
  const dropDownInput = dropDownWrapper.querySelector('.dropdown__input-hidden');

  const select = {
    toggle() {
      dropDownList.classList.toggle('dropdown__list--visible');
      dropDownBtn.classList.toggle('dropdown__button--active');
    },
    open() {
      dropDownList.classList.add('dropdown__list--visible');
      dropDownBtn.classList.add('dropdown__button--active');
    },
    close() {
      dropDownList.classList.remove('dropdown__list--visible');
      dropDownBtn.classList.remove('dropdown__button--active');
    }
  }

  dropDownBtn.addEventListener('click', select.toggle);

  dropDownBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select.open();
    }
  });

  dropDownListItems.forEach((listItem) => {
    listItem.addEventListener('click', (e) => {
      e.stopPropagation();

      dropDownListItems.forEach(el => el.classList.remove('dropdown__list-item--active'));
      e.currentTarget.classList.add('dropdown__list-item--active');

      const dropDownText = dropDownBtn.querySelector('.dropdown__button-text');
      const p = e.currentTarget.querySelector('p');

      dropDownText.innerText = p.innerText;
      dropDownBtn.focus();
      dropDownInput.value = e.currentTarget.dataset.value;

      select.close();

    });
  });

  document.addEventListener('click', (e) => {
    if (e.target !== dropDownBtn) {
      select.close();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' || e.key === 'Escape') {
      select.close();
    }
  });
});*/
