/*
 * Tap-a-word translation bubble (v0.05).
 *
 * Replaces the old flow, where seeing a word's Turkish meaning meant
 * opening a full-screen modal and then finding a translation card at the
 * BOTTOM of it. Now: tap any word in the article, a small bubble opens
 * right at that word with its Turkish meaning. Instant, because the
 * lookup is the bundled offline dictionary (dict_en_tr.js) — no network,
 * so there is no spinner and no failure state to design around.
 *
 * Two implementation notes worth keeping in a rebuild:
 *
 * 1. EVERY word is tappable, but no word is wrapped in a <span>. Wrapping
 *    each word of a 40-paragraph article would mean thousands of extra DOM
 *    nodes, re-created on every reading-level switch. Instead the tap
 *    position is resolved to a word with caretRangeFromPoint() and the
 *    word's boundaries are found by walking the text node. Zero extra DOM,
 *    and it keeps working no matter how the body is re-rendered.
 *    (The existing dotted-underline `.body-word` glossary spans still
 *    exist and still work — they're just a visual hint about which words
 *    are worth learning, not a precondition for tapping.)
 *
 * 2. All app-specific behavior is injected via init() rather than reached
 *    for directly, so this file has no dependency on app.js's internals
 *    (which live inside an IIFE and aren't reachable anyway).
 */
(function (global) {
  "use strict";

  var deps = {
    translate: function () { return null; },
    onSave: function () {},
    onDetail: function () {},
    onListen: function () {},
    isSaved: function () { return false; }
  };
  var bubbleEl = null;
  var currentWord = null;

  function injectStyles() {
    if (document.getElementById("word-bubble-styles")) return;
    var css = document.createElement("style");
    css.id = "word-bubble-styles";
    // Zero border-radius everywhere, per the app's design system.
    css.textContent = [
      "#word-bubble{position:fixed;z-index:80;max-width:min(300px,calc(100vw - 24px));",
      "background:var(--color-surface);border:1px solid var(--color-text);",
      "box-shadow:0 2px 0 0 var(--color-text);padding:10px 12px;display:none;}",
      "#word-bubble.on{display:block;}",
      "#word-bubble .wb-head{display:flex;align-items:baseline;gap:8px;margin-bottom:2px;}",
      "#word-bubble .wb-word{font-family:var(--font-heading);font-weight:800;font-size:15px;",
      "overflow-wrap:anywhere;}",
      "#word-bubble .wb-tr{font-size:15px;line-height:1.35;overflow-wrap:anywhere;}",
      "#word-bubble .wb-miss{font-size:12.5px;opacity:.6;font-style:italic;}",
      "#word-bubble .wb-actions{display:flex;gap:6px;margin-top:9px;flex-wrap:wrap;}",
      "#word-bubble .wb-btn{font-size:11.5px;padding:5px 9px;border:1px solid var(--color-divider);",
      "cursor:pointer;user-select:none;white-space:nowrap;}",
      "#word-bubble .wb-btn:active{background:color-mix(in srgb,var(--color-text) 8%,transparent);}",
      "#word-bubble .wb-btn.on{background:var(--color-accent);color:var(--color-bg);border-color:var(--color-accent);}",
      // The little pointer triangle, flipped when the bubble sits below.
      "#word-bubble .wb-arrow{position:absolute;width:9px;height:9px;background:var(--color-surface);",
      "border-left:1px solid var(--color-text);border-top:1px solid var(--color-text);",
      "transform:rotate(45deg);}",
      "#word-bubble.below .wb-arrow{top:-5px;}",
      "#word-bubble.above .wb-arrow{bottom:-5px;transform:rotate(225deg);}"
    ].join("");
    document.head.appendChild(css);
  }

  function ensureBubble() {
    if (bubbleEl) return bubbleEl;
    injectStyles();
    bubbleEl = document.createElement("div");
    bubbleEl.id = "word-bubble";
    document.body.appendChild(bubbleEl);
    // Taps inside the bubble must not bubble up to the document handler
    // that closes it.
    bubbleEl.addEventListener("click", function (e) { e.stopPropagation(); });
    return bubbleEl;
  }

  var WORD_CHAR = /[A-Za-zÀ-ɏ'’-]/;

  // Resolves a screen point to the word under it, plus that word's screen
  // rectangle (used to place the bubble). Returns null when the tap didn't
  // land on real word text.
  function wordAtPoint(x, y) {
    var range = null;
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(x, y);
    } else if (document.caretPositionFromPoint) {
      var pos = document.caretPositionFromPoint(x, y);
      if (pos) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.collapse(true);
      }
    }
    if (!range || !range.startContainer || range.startContainer.nodeType !== 3) return null;

    var node = range.startContainer;
    var text = node.textContent || "";
    var i = Math.min(range.startOffset, text.length);
    // A tap landing just past the end of a word should still select that
    // word, so step back one when sitting on a non-word char.
    if (i > 0 && !WORD_CHAR.test(text.charAt(i))) i--;
    if (!WORD_CHAR.test(text.charAt(i))) return null;

    var start = i, end = i;
    while (start > 0 && WORD_CHAR.test(text.charAt(start - 1))) start--;
    while (end < text.length && WORD_CHAR.test(text.charAt(end))) end++;
    var word = text.slice(start, end).replace(/^['’-]+|['’-]+$/g, "");
    if (!word || !/[A-Za-z]/.test(word)) return null;

    var wordRange = document.createRange();
    wordRange.setStart(node, start);
    wordRange.setEnd(node, end);
    var rect = wordRange.getBoundingClientRect();
    wordRange.detach && wordRange.detach();
    return { word: word, rect: rect };
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function render(word) {
    var el = ensureBubble();
    var tr = deps.translate(word);
    var saved = deps.isSaved(word);
    el.innerHTML =
      '<div class="wb-arrow"></div>' +
      '<div class="wb-head"><span class="wb-word">' + escapeHtml(word) + "</span></div>" +
      (tr
        ? '<div class="wb-tr">' + escapeHtml(tr) + "</div>"
        : '<div class="wb-miss">Bu kelime offline sözlükte yok.</div>') +
      '<div class="wb-actions">' +
        '<span class="wb-btn" data-wb="listen">🔊 Dinle</span>' +
        '<span class="wb-btn' + (saved ? " on" : "") + '" data-wb="save">' + (saved ? "★ Kaydedildi" : "☆ Kaydet") + "</span>" +
        '<span class="wb-btn" data-wb="detail">Detay →</span>' +
      "</div>";
    return el;
  }

  // Places the bubble above the word when there's room, otherwise below,
  // and clamps horizontally so it never runs off screen. The arrow is then
  // positioned to keep pointing at the word even after clamping.
  function position(el, rect) {
    el.classList.add("on");
    el.style.left = "0px";
    el.style.top = "0px";
    var bw = el.offsetWidth, bh = el.offsetHeight;
    var margin = 8, gap = 10;
    var vw = window.innerWidth, vh = window.innerHeight;

    var wordCenter = rect.left + rect.width / 2;
    var left = Math.round(wordCenter - bw / 2);
    left = Math.max(margin, Math.min(left, vw - bw - margin));

    var above = rect.top - gap - bh >= margin;
    var top = above ? Math.round(rect.top - gap - bh) : Math.round(rect.bottom + gap);
    if (!above && top + bh > vh - margin) top = Math.max(margin, vh - bh - margin);

    el.classList.toggle("above", above);
    el.classList.toggle("below", !above);
    el.style.left = left + "px";
    el.style.top = top + "px";

    var arrow = el.querySelector(".wb-arrow");
    if (arrow) {
      var arrowLeft = Math.max(10, Math.min(wordCenter - left - 4.5, bw - 19));
      arrow.style.left = arrowLeft + "px";
    }
  }

  function show(word, rect) {
    currentWord = word;
    var el = render(word);
    position(el, rect);
  }

  function hide() {
    currentWord = null;
    if (bubbleEl) bubbleEl.classList.remove("on");
  }

  // Re-renders in place (same word, same position) so the Save button can
  // flip to its saved state without the bubble jumping or closing.
  function refresh() {
    if (!currentWord || !bubbleEl || !bubbleEl.classList.contains("on")) return;
    var left = bubbleEl.style.left, top = bubbleEl.style.top;
    var wasAbove = bubbleEl.classList.contains("above");
    render(currentWord);
    bubbleEl.classList.add("on");
    bubbleEl.classList.toggle("above", wasAbove);
    bubbleEl.classList.toggle("below", !wasAbove);
    bubbleEl.style.left = left;
    bubbleEl.style.top = top;
  }

  function init(options) {
    Object.keys(options || {}).forEach(function (k) {
      if (typeof options[k] === "function") deps[k] = options[k];
    });
    ensureBubble();

    ensureBubble().addEventListener("click", function (e) {
      var btn = e.target.closest("[data-wb]");
      if (!btn || !currentWord) return;
      var action = btn.getAttribute("data-wb");
      if (action === "listen") deps.onListen(currentWord);
      else if (action === "save") { deps.onSave(currentWord); refresh(); }
      else if (action === "detail") { var w = currentWord; hide(); deps.onDetail(w); }
    });

    // Any tap outside closes it; scrolling closes it too, since the bubble
    // is fixed-position and would otherwise drift away from its word.
    // This listener runs in the CAPTURE phase (so it beats the article
    // body's own handler), which means it also sees clicks on the bubble's
    // own buttons — those must be excluded, or hide() would fire before
    // the button's action and the Save button would just close the bubble.
    document.addEventListener("click", function (e) {
      if (bubbleEl && bubbleEl.contains(e.target)) return;
      hide();
    }, true);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
  }

  // Wires up a container (the article body) so tapping any word in it
  // opens the bubble. Safe to call repeatedly on the same element.
  function attachTo(container) {
    if (!container || container.__wbAttached) return;
    container.__wbAttached = true;
    container.addEventListener("click", function (e) {
      var hit = wordAtPoint(e.clientX, e.clientY);
      if (!hit) { hide(); return; }
      e.stopPropagation(); // don't let the document-level closer fire
      show(hit.word, hit.rect);
    });
  }

  global.WordBubble = {
    init: init, attachTo: attachTo, hide: hide,
    _wordAtPoint: wordAtPoint // exposed for tests
  };
})(window);
