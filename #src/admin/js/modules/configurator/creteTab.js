import {submitConfigData} from "./index.js";
import {tabSkeleton} from "./htmlSkelet.js";

const createTabForm = document.getElementById("create-tab-form");

createTabForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  const formData = new FormData(form);

  const data = await submitConfigData('/category/tabs/create/', formData);

  if (data && data.status) {
    document.querySelector('.add-config').style.display = 'none';
    const tabsContainer = document.querySelector('.tabs-container');
    tabsContainer.insertAdjacentHTML('beforeend', tabSkeleton(data));
    form.reset();
  }
});


