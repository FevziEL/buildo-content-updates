/*
 * i18n runtime (v0.13) — a small, dependency-free translation layer.
 *
 * Scope: this ONLY translates the application's own chrome (buttons, menus,
 * labels, empty/error states, onboarding, Settings, About/Changelog,
 * Progress/Vocabulary UI). It never touches article body text — article
 * paragraphs are always rendered from the source's own real English, in
 * app.js, completely independent of window.I18N. See i18n/en.js / tr.js for
 * the two string tables this reads from.
 *
 * Usage:
 *   window.I18N.t("home.todaysScience")           -> translated string
 *   window.I18N.t("vocab.words", {count: 5})       -> "{{count}} words" -> "5 words"
 *   window.I18N.setLang("en" | "tr")               -> persists + re-applies
 *   window.I18N.getLang()                          -> "en" | "tr"
 *   window.I18N.apply(root)                        -> re-applies data-i18n* attributes under root (default: whole document)
 *
 * Static markup opts in via attributes, so index.html never hard-codes a
 * language:
 *   data-i18n="home.todaysScience"           -> element.textContent
 *   data-i18n-html="about.description"       -> element.innerHTML (only for entries with no user data inside)
 *   data-i18n-placeholder="home.search.placeholder" -> input placeholder
 *   data-i18n-aria="nav.settings"            -> aria-label
 *
 * JS-generated strings (home cards, settings, dynamic lists, …) call
 * I18N.t(key) directly wherever app.js builds HTML/text at runtime.
 * app.js listens for the "buildo:langchange" event this module dispatches
 * on window and re-renders whichever screen is currently visible.
 */
(function (global) {
  "use strict";
  var LANG_KEY = "shadow_lang";
  var DEFAULT_LANG = "tr";
  var currentLang = null;

  function availableLangs() {
    return Object.keys(global.I18N_STRINGS || {});
  }

  function getLang() {
    if (currentLang) return currentLang;
    var stored = null;
    try { stored = localStorage.getItem(LANG_KEY); } catch (e) { /* unavailable */ }
    var langs = availableLangs();
    currentLang = (stored && langs.indexOf(stored) !== -1) ? stored : DEFAULT_LANG;
    return currentLang;
  }

  function interpolate(str, vars) {
    if (!vars) return str;
    return str.replace(/\{\{(\w+)\}\}/g, function (m, key) {
      return Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : m;
    });
  }

  function t(key, vars) {
    var lang = getLang();
    var table = (global.I18N_STRINGS && global.I18N_STRINGS[lang]) || {};
    var fallbackTable = (global.I18N_STRINGS && global.I18N_STRINGS[DEFAULT_LANG]) || {};
    var str = table[key];
    if (str == null) str = fallbackTable[key];
    if (str == null) return key; // never blank UI over a missing key
    return interpolate(str, vars);
  }

  function apply(root) {
    root = root || document;
    Array.prototype.forEach.call(root.querySelectorAll("[data-i18n]"), function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    Array.prototype.forEach.call(root.querySelectorAll("[data-i18n-html]"), function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    Array.prototype.forEach.call(root.querySelectorAll("[data-i18n-placeholder]"), function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    Array.prototype.forEach.call(root.querySelectorAll("[data-i18n-aria]"), function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.documentElement.setAttribute("lang", getLang());
  }

  function setLang(lang) {
    if (availableLangs().indexOf(lang) === -1) return;
    currentLang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* unavailable */ }
    apply(document);
    global.dispatchEvent(new CustomEvent("buildo:langchange", { detail: { lang: lang } }));
  }

  global.I18N = { t: t, getLang: getLang, setLang: setLang, apply: apply, availableLangs: availableLangs };

  // Apply as soon as the DOM is interactive so static markup never flashes
  // in the wrong language before app.js finishes booting.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { apply(document); });
  } else {
    apply(document);
  }
})(window);
