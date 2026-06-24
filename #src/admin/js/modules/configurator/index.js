import './creteTab.js';
import './createField.js';
import './createOptions.js';
import './removeItem.js';

export const submitConfigData = async (url, formData) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
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