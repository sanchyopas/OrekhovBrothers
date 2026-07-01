import {getCookie} from "./index.js";

const configDeleteBtn = document.querySelectorAll('.config-delete');
const csrftoken = getCookie('csrftoken');
configDeleteBtn.forEach((item) => {
  item.addEventListener('click', () => {
    const dataId = item.dataset.id;
    const dataItem = item.dataset.item;

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
});

export function parseData(data, dataId, dataItem) {
  const {status} = data

  if (status === true) {
    const element = document.querySelector(`[data-${dataItem}-id="${dataId}"]`);
    element?.remove();
  }
}