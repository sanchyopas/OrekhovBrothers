import {fieldOptions} from "./htmlSkelet.js";
import {submitConfigData} from "./index.js";
import {closePopup} from "../popup.js";

let currentID = null;
let currentPopup = null;

const createOptionsForm = document.getElementById("create-option-form")

createOptionsForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  formData.append('id', currentID);

  const data = await submitConfigData('/category/options/create/', formData);

  if (data && data.status) {
    closePopup(currentPopup);
    const field = document.querySelector(`[data-field-id="${currentID}"]`);

    const optionsContainer = field.querySelector('.options-container');

    optionsContainer.insertAdjacentHTML('beforeend', fieldOptions(data));

    form.reset();
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('add-option-btn')) {
    currentID = e.target.dataset.id;
    currentPopup = e.target.dataset.popup;

    const popup = document.getElementById(currentPopup);

    if (currentID && popup) {
      popup.style.display = 'block';
    }
  }


})