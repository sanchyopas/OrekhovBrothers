import {fieldOptions} from "./_htmlSkelet.js";
import {submitConfigData} from "./index.js";

const createOptionsForm = document.getElementById("create-option-form")
const openOptionsModel = (fieldId) => {
  createOptionsForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    formData.append('id', fieldId);

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
  if (!e.target.classList.contains('add-option-btn')) {
    return;
  }

  const fieldId = e.target.dataset.fieldId;

  if (fieldId) {
    openOptionsModel(fieldId);
  }

})