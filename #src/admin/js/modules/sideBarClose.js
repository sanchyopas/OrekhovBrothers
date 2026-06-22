const sidebarBtnClose = document.getElementById('sidebar-btn-close');
const parentElement = document.getElementById('common-content');

const savedState = localStorage.getItem('sidebar') === 'true';

if (savedState) {
  parentElement.classList.add('active');
}

const toggleSideBar = (e) => {
  parentElement.classList.toggle('active');

  localStorage.setItem(
    'sidebar',
    `${parentElement.classList.contains('active')}`
  );

}

sidebarBtnClose?.addEventListener('click', toggleSideBar);

