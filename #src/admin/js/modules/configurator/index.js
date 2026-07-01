import './creteTab.js';
import './createField.js';
import './createOptions.js';
import './removeItem.js';
import {parseData} from "./removeItem.js";

// получение csrf из cookie
export function getCookie(name) {
  let cookieValue = null;

  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();

      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(
          cookie.substring(name.length + 1)
        );
        break;
      }
    }
  }

  return cookieValue;
}


export const submitConfigData = async (url, formData) => {
  const csrftoken = getCookie('csrftoken');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrftoken,
      },
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


document.addEventListener('click', (e) => {
  const csrftoken = getCookie('csrftoken');
  const btn = e.target.closest('.config-delete');

  if (!btn) return;

  const dataId = btn.dataset.id;
  const dataItem = btn.dataset.item;

  fetch('/category/item/delete/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({
      id: dataId,
      item: dataItem
    })
  })
    .then(res => res.json())
    .then(data => parseData(data, dataId, dataItem))
    .catch(err => console.error(err));
});


document.addEventListener('click', async (e) => {
  const csrftoken = getCookie('csrftoken');

  // =========================
  // ENTER EDIT MODE
  // =========================
  const editBtn = e.target.closest('.config-edit');

  if (editBtn) {
    const container = editBtn.closest(
      '.configurator__tab, .config-field, .configurator__option'
    );

    const editable = container.querySelector('[data-editable]');

    if (editable.querySelector('.edit-wrap')) return;

    const value = editable.dataset.value;

    editable.innerHTML = `
      <div class="edit-wrap">
        <input class="form__controls edit-input" type="text" value="${value}" />

        <button type="button" class="save-edit">✓</button>
        <button type="button" class="cancel-edit">✕</button>
      </div>
    `;

    return;
  }

  // =========================
  // SAVE
  // =========================
  const saveBtn = e.target.closest('.save-edit');

  if (saveBtn) {
    const wrapper = saveBtn.closest('.edit-wrap');
    const input = wrapper.querySelector('.edit-input');

    const value = input.value.trim();
    if (!value) return;

    const editable = wrapper.closest('[data-editable]');
    const container = wrapper.closest(
      '.configurator__tab, .config-field, .configurator__option'
    );

    const id = container.querySelector('.config-edit').dataset.id;
    const item = container.querySelector('.config-edit').dataset.item;

    try {
      const response = await fetch('/category/item/update/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
          id,
          item,
          title: value
        })
      });
      console.log(response)
      const data = await response.json();

      if (!data.status) {
        console.error(data.error);
        return;
      }

      // update state
      editable.dataset.value = value;

      // back to view mode
      editable.textContent = value;

    } catch (err) {
      console.error(err);
    }

    return;
  }

  // =========================
  // CANCEL
  // =========================
  const cancelBtn = e.target.closest('.cancel-edit');

  if (cancelBtn) {
    const wrapper = cancelBtn.closest('.edit-wrap');
    const editable = wrapper.closest('[data-editable]');

    const original = editable.dataset.value;

    editable.textContent = original;

    return;
  }
});