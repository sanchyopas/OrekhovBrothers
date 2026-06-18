const items = document.querySelectorAll('.sidebar-menu__item-close');

const openMenu = (e) => {
  e.currentTarget.classList.toggle('_open');
}

items?.forEach((item) => {
  item.addEventListener('click', openMenu)
})