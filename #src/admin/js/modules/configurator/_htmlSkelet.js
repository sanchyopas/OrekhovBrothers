export const tabSkelet = (dataJson) => {
  return `
    <div class="config-tab" data-tab-id="${dataJson.id}">
      <div class="config-tab__header">
        <h3>${dataJson.title}</h3>

        <button
          type="button"
          class="add-field-btn add-tab__button"
          data-tab-id="${dataJson.id}"
        >
          Добавить поле
        </button>
      </div>

      <div class="fields-container"></div>
    </div>`
};

export const fieldSkelet = (dataJson) => {
  return `
    <div
      class="config-field"
      data-field-id="${dataJson.id}"
    >

      <div>${dataJson.title}</div>

      <button
        class="add-option-btn"
        data-field-id="${dataJson.id}"
      >
        Добавить вариант
      </button>
      <div class="options-container"></div>
    </div>`
}


export const fieldOptions = (dataJson) => {
  return `
    <div class="option-item" data-option-id="${dataJson.id}" >
    
      <span>${dataJson.title}</span>
    
      <span>${dataJson.price}</span>
    
    </div>
  `
}