import {fieldSkelet} from "./_htmlSkelet.js";
import {submitConfigData} from "./index.js";

let ID = 0;

const createField = (tabId) => {
}


createFieldForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  formData.append('id', tabId);

  const data = await submitConfigData('/category/fields/create/', formData);

  if (data && data.status) {
    const tab = document.querySelector(`[data-tab-id="${tabId}"]`);

    const fieldsContainer = tab.querySelector('.fields-container');

    fieldsContainer.insertAdjacentHTML('beforeend', fieldSkelet(data));

    form.reset();
  }
})


const createFieldForm = document.getElementById("create-field-form");

document.addEventListener('click', (e) => {
  if (!e.target.classList.contains('add-field-btn')) {
    return;
  }

  ID = e.target.dataset.id;

});