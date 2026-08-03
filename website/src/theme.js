(function () {
  const key = "cg_theme_preference_v1";
  const allowed = new Set(["system", "light", "dark"]);

  function readPreference() {
    try {
      const value = localStorage.getItem(key);
      return allowed.has(value) ? value : "system";
    } catch {
      return "system";
    }
  }

  function resolvedTheme(preference) {
    if (preference !== "system") return preference;
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function apply(preference) {
    document.documentElement.dataset.theme = preference;
    document.documentElement.style.colorScheme = resolvedTheme(preference);
    for (const button of document.querySelectorAll("[data-theme-value]")) {
      const active = button.dataset.themeValue === preference;
      button.setAttribute("aria-pressed", String(active));
    }
  }

  const initial = readPreference();
  apply(initial);

  addEventListener("DOMContentLoaded", function () {
    apply(readPreference());
    for (const button of document.querySelectorAll("[data-theme-value]")) {
      button.addEventListener("click", function () {
        const preference = button.dataset.themeValue;
        if (!allowed.has(preference)) return;
        try { localStorage.setItem(key, preference); } catch {}
        apply(preference);
      });
    }
  });

  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (readPreference() === "system") apply("system");
  });
})();
