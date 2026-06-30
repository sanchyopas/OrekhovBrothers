export const tabSkeleton = (dataJson) => {
  return `
    <div class="configurator__tab" data-tab-id="${dataJson.id}">
      <div class="configurator__tab-header">
        <div>
          <h3>${dataJson.title}</h3>
        </div>
        <div class="configurator__btns">
          <button
            type="button"
            class="btn"
            data-id="${dataJson.id}"
            data-popup="add-field"
          >
            Добавить поле
          </button>
          <button type="button"><i class="fa-solid fa-pen"></i></button>
          <button type="button" class="config-delete"
                  data-item="tab" data-id="${dataJson.id}"
          >
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>

      <div class="fields-container"></div>
    </div>`
};

export const fieldSkeleton = (dataJson) => {
  return `
    <div
      class="config-field configurator__field"
      data-field-id="${dataJson.id}"
    >
      <div class="configurator__tab-header">
        <div>${dataJson.title}</div>
        <div class="configurator__btns">
          <button
            class="btn btn--outline add-option-btn"
            data-id="${dataJson.id}"
            data-popup="add-option"
          >
            Добавить вариант
          </button>
          <button type="button"><i class="fa-solid fa-pen"></i></button>
          <button type="button" class="config-delete" data-item="field" data-id="${dataJson.id}">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
      
      <div class="options-container"></div>
    </div>`
}


export const fieldOptions = (dataJson) => {
  return `
    <div class="configurator__option" data-option-id="${dataJson.id}" >
    
      <p>${dataJson.title}</p>
    
      <div class="configurator__btns">
        <button type="button"><i class="fa-solid fa-pen"></i></button>
        <button type="button" class="config-delete" data-item="option" data-id="${dataJson.id}">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    
    </div>
  `
}