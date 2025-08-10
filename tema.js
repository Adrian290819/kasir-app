// tema.js
(function () {
  const username = localStorage.getItem('username') || 'guest';
  const tema = localStorage.getItem(`user_${username}_tema`) || 'default';

  if (tema === 'dark') {
    document.documentElement.classList.add('theme-dark');
  } else if (tema === 'light') {
    document.documentElement.classList.add('theme-light');
  }
})();
// tema.js
(function () {
  const username = localStorage.getItem('username') || 'guest';

  function applyTheme(theme) {
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    if (theme === 'dark') document.documentElement.classList.add('theme-dark');
    else if (theme === 'light') document.documentElement.classList.add('theme-light');
  }

  // Tema awal
  const tema = localStorage.getItem(`user_${username}_tema`) || 'default';
  applyTheme(tema);

  // Expose global untuk pratinjau langsung
  window.previewTheme = function(theme) {
    applyTheme(theme);
  };

  // Toggle cepat
  window.toggleThemeQuick = function () {
    const current = document.documentElement.classList.contains('theme-dark') ? 'dark'
                  : document.documentElement.classList.contains('theme-light') ? 'light'
                  : 'default';
    const next = current === 'dark' ? 'light' : current === 'light' ? 'default' : 'dark';
    localStorage.setItem(`user_${username}_tema`, next);
    applyTheme(next);
    const icon = document.getElementById('theme-toggle-icon');
    if (icon) icon.textContent = next === 'dark' ? '🌙' : next === 'light' ? '🌞' : '⚙️';
  };
})();
