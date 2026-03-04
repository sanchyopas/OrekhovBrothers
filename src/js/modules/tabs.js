document.querySelectorAll('[data-tabs]').forEach(initTabs);

function initTabs(tabsEl) {
  const tabs = tabsEl.querySelectorAll('[role="tab"]');
  const panels = tabsEl.querySelectorAll('[role="tabpanel"]');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', e => handleKey(e, tab));
  });

  function activateTab(activeTab) {
    tabs.forEach(tab => {
      const isActive = tab === activeTab;

      tab.setAttribute('aria-selected', isActive);
      tab.tabIndex = isActive ? 0 : -1;

      const panel = tabsEl.querySelector(
        `#${tab.getAttribute('aria-controls')}`
      );
      panel.hidden = !isActive;
    });

    activeTab.focus();
  }

  function handleKey(e, currentTab) {
    const index = [...tabs].indexOf(currentTab);

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      activateTab(tabs[(index + 1) % tabs.length]);
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      activateTab(tabs[(index - 1 + tabs.length) % tabs.length]);
    }
  }
}



