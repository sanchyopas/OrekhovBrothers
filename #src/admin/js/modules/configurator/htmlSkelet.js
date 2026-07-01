export const tabSkeleton = (dataJson) => {
  return `
    <div class="configurator__tab" data-tab-id="${dataJson.id}">
      <div class="configurator__tab-header">
        <div>
          <h3 data-editable data-value="${dataJson.title}">
            ${dataJson.title}
          </h3>
        </div>

        <div class="configurator__btns">
          <button
            type="button"
            class="btn add-field-btn"
            data-id="${dataJson.id}"
            data-popup="add-field"
          >
            Добавить поле
          </button>

          <button
            type="button"
            class="config-edit"
            data-item="tab"
            data-id="${dataJson.id}"
          >
            <i class="fa-solid fa-pen"></i>
          </button>

          <button
            type="button"
            class="config-delete"
            data-item="tab"
            data-id="${dataJson.id}"
          >
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>

      <div class="fields-container configurator__fields"></div>
    </div>
  `;
};

export const fieldSkeleton = (dataJson) => {
  return `
    <div
      class="config-field configurator__field"
      data-field-id="${dataJson.id}"
    >
      <div class="configurator__tab-header">
        <div>
          <div data-editable data-value="${dataJson.title}">
            ${dataJson.title}
          </div>
        </div>

        <div class="configurator__btns">
          <button
            class="btn btn--outline add-option-btn"
            data-id="${dataJson.id}"
            data-popup="add-option"
          >
            Добавить вариант
          </button>

          <button
            type="button"
            class="config-edit"
            data-item="field"
            data-id="${dataJson.id}"
          >
            <i class="fa-solid fa-pen"></i>
          </button>

          <button
            type="button"
            class="config-delete"
            data-item="field"
            data-id="${dataJson.id}"
          >
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>

      <div class="options-container configurator__options"></div>
    </div>
  `;
};

export const fieldOptions = (dataJson) => {
  return `
    <div class="configurator__option" data-option-id="${dataJson.id}">
      <div>
        <p data-editable data-value="${dataJson.title}">
          ${dataJson.title}
        </p>
      </div>

      <div class="configurator__btns">
        <button
          type="button"
          class="config-edit"
          data-item="option"
          data-id="${dataJson.id}"
        >
          <i class="fa-solid fa-pen"></i>
        </button>

        <button
          type="button"
          class="config-delete"
          data-item="option"
          data-id="${dataJson.id}"
        >
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>
    </div>
  `;
};