(function () {
  var STORAGE_KEY = 'wb-theme';
  var root = document.documentElement;

  function systemPrefersLight() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  function applyTheme(theme) {
    // theme is 'light' or 'dark'
    root.setAttribute('data-theme', theme);
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore (private browsing etc.) */
    }
  }

  // 1. On load: use saved choice if present, otherwise follow system.
  var saved = getStoredTheme();
  var initial = saved || (systemPrefersLight() ? 'light' : 'dark');
  applyTheme(initial);

  // 2. If the user hasn't manually chosen yet, keep following the OS live.
  if (!saved && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
      if (!getStoredTheme()) {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  }

  // 3. Wire up the floating toggle button once the DOM is ready.
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      storeTheme(next);
    });
  });
})();
