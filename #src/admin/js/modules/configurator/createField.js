import {fieldSkeleton} from "./_htmlSkelet.js";
import {submitConfigData} from "./index.js";
import {closePopup} from "../_popup.js";

const createFieldForm = document.getElementById("create-field-form");

let currentID = null;
let currentPopup = null;

createFieldForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  formData.append('id', currentID);

  const data = await submitConfigData('/category/fields/create/', formData);

  if (data && data.status) {
    closePopup(currentPopup);
    const tab = document.querySelector(`[data-tab-id="${currentID}"]`);

    const fieldsContainer = tab.querySelector('.fields-container');

    fieldsContainer.insertAdjacentHTML('beforeend', fieldSkeleton(data));

    form.reset();
  }
})


document.addEventListener('click', (e) => {
  if (e.target.classList.contains('add-field-btn')) {
    currentID = e.target.dataset.id;
    currentPopup = e.target.dataset.popup;

    const popup = document.getElementById(currentPopup);

    if (currentID && popup) {
      popup.style.display = 'block';
    }
  }
});