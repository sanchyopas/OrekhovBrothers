import './creteTab.js';
import './createField.js';
import './createOptions.js';
import './removeItem.js';

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

const csrftoken = getCookie('csrftoken');
export const submitConfigData = async (url, formData) => {
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

