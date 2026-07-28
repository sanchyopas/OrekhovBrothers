import {closePopupById} from './popup.js';
import {showNotice} from './notice.js';

function containsEnglishLetters(value) {
  return typeof value === 'string' && /[a-zA-Z]/.test(value);
}

function containsLink(value) {
  return (
    typeof value === 'string' &&
    /(https?:\/\/|www\.)[^\s]+/i.test(value)
  );
}

function validateForm(data) {
  if (containsEnglishLetters(data.name)) {
    return {
      isValid: false,
      message: 'Имя должно быть написано русскими буквами',
    };
  }

  if (containsLink(data.message)) {
    return {
      isValid: false,
      message: 'Сообщение не должно содержать ссылки',
    };
  }

  return {
    isValid: true,
    message: '',
  };
}

async function parseResponse(response) {
  try {
    return await response.json();
  } catch {
    return {
      success: false,
      message: 'Сервер вернул некорректный ответ',
    };
  }
}

async function submitForm(form, popupId = null) {
  const formData = new FormData(form);
  const formDataObject = Object.fromEntries(formData.entries());

  const validation = validateForm(formDataObject);

  if (!validation.isValid) {
    showNotice(validation.message, 'error');
    return;
  }

  const csrfToken = form.querySelector(
    '[name="csrfmiddlewaretoken"]'
  )?.value;

  if (!csrfToken) {
    showNotice('CSRF-токен формы не найден', 'error');
    return;
  }

  const submitButton = form.querySelector(
    '[type="submit"]'
  );

  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add('_loading');
    }

    const response = await fetch(form.action, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'same-origin',
      body: formData,
    });

    const data = await parseResponse(response);

    if (!response.ok || data.success !== true) {
      throw new Error(
        data.debug ||
        data.message ||
        'Не удалось отправить форму'
      );
    }

    form.reset();

    if (popupId) {
      closePopupById(popupId);
    }

    showNotice(
      data.message || 'Форма успешно отправлена',
      'success'
    );
  } catch (error) {
    console.error('Ошибка отправки формы:', error);

    showNotice(
      error instanceof Error
        ? error.message
        : 'Не удалось отправить форму',
      'error'
    );
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.classList.remove('_loading');
    }
  }
}

function connectForm(formId, popupId = null) {
  const form = document.getElementById(formId);

  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    submitForm(form, popupId);
  });
}

function initForms() {
  connectForm('callback-form', 'callback');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initForms);
} else {
  initForms();
}