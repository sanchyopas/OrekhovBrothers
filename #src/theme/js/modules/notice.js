let noticeTimer = null;

export function showNotice(message, type = 'success') {
  const noticeId =
    type === 'error'
      ? 'notice-error'
      : 'notice-success';

  const notice = document.getElementById(noticeId);

  if (!notice) {
    if (type === 'error') {
      alert(message);
    }

    return;
  }

  if (noticeTimer) {
    clearTimeout(noticeTimer);
  }

  notice.textContent = message;
  notice.classList.remove(
    'notice--success',
    'notice--error'
  );
  notice.classList.add(`notice--${type}`, 'active');

  noticeTimer = setTimeout(() => {
    notice.classList.remove('active');
  }, 3000);
}

document.addEventListener('click', (event) => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const notice = target.closest('.notice');

  if (!notice) {
    return;
  }

  notice.classList.remove('active');
});