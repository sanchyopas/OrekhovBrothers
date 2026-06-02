import {fieldOptions, fieldSkelet, tabSkelet} from "./_htmlSkelet.js";

const addTabButton = document.getElementById("add-tab");
addTabButton?.addEventListener("click", (e) => {
  document.querySelector('.add-config').style.display = 'block';
});

const submitConfigData = async (url, formData) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error(`Ошибка при запросе к ${url}:`, error);
    return null;
  }
}

const createTabForm = document.getElementById("create-tab-form")

createTabForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  const formData = new FormData(form);

  const data = await submitConfigData('/category/tabs/create/', formData);

  if (data && data.status) {
    document.querySelector('.add-config').style.display = 'none';

    const tabsContainer = document.querySelector('.tabs-container');
    tabsContainer.insertAdjacentHTML('beforeend', tabSkelet(data));

    form.reset();
  }

});

const createFieldForm = document.getElementById("create-field-form");

const openFieldModel = (tabId) => {
  const addFieldModal = document.querySelector('.add-field');
  addFieldModal.style.display = 'block';

  createFieldForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    formData.append('tab_id', tabId);

    const data = await submitConfigData('/category/fields/create/', formData);

    if (data && data.status) {
      addFieldModal.style.display = 'none';
      const tab = document.querySelector(`[data-tab-id="${tabId}"]`);

      const fieldsContainer = tab.querySelector('.fields-container');

      fieldsContainer.insertAdjacentHTML('beforeend', fieldSkelet(data));

      form.reset();
    }
  })
}


const createOptionsForm = document.getElementById("create-option-form")
const openOptionsModel = (fieldId) => {
  const addOptionModal = document.querySelector('.add-option');
  addOptionModal.style.display = 'block';

  createOptionsForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    formData.append('field_id', fieldId);

    const data = await submitConfigData('/category/options/create/', formData);

    if (data && data.status) {
      addOptionModal.style.display = 'none';
      const field = document.querySelector(`[data-field-id="${fieldId}"]`);

      const optionsContainer = field.querySelector('.options-container');

      optionsContainer.insertAdjacentHTML('beforeend', fieldOptions(data));

      form.reset();
    }
  })
}

document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('add-field-btn')) {
    return;
  }

  const tabId = e.target.dataset.tabId;

  if (tabId) {
    openFieldModel(tabId);
  }

})

document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('add-option-btn')) {
    return;
  }

  const fieldId = e.target.dataset.fieldId;

  if (fieldId) {
    openOptionsModel(fieldId);
  }

})

