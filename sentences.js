/*
 * Build-up practice drills — generated per article, about that article's
 * real topic, but in entirely original wording (never the article's own
 * sentences with words swapped — that would be too close to reproducing
 * copyrighted news text). app.js extracts a few real keywords out of the
 * article body (see pickImportantWords) and plugs each into one of these
 * hand-written template sentences.
 *
 * v0.12: template complexity is no longer chosen by the article's
 * "difficulty" — this app doesn't label or compare reading difficulty
 * anywhere anymore (see APP_SPEC_PROMPT.md §18/§33). The three complexity
 * bands below are kept purely as INTERNAL sentence-construction variety —
 * never named, shown, or exposed to the user — and are picked by each
 * build-up sentence's own position (1st/2nd/3rd), the same for every
 * article: the first of the three build-up sentences is always short and
 * simple, the third always longer and more complex. That's a within-
 * article progression, not a cross-article difficulty comparison.
 *
 * Each drill is a list of chunks — the sentence is built by appending one
 * chunk per step, always starting from a short subject+verb fragment
 * (never a bare noun with no verb). The cumulative text at step N is
 * chunks[0..N].join(" "). One chunk contains the literal "{topic}"
 * placeholder, replaced with the real keyword before use.
 */
(function (global) {
  var TEMPLATE_BANDS = [
    [
      ["This", "news", "story", "is", "about", "{topic}", "and", "it", "is", "interesting"],
      ["Many", "people", "are", "talking", "about", "{topic}", "these", "days"],
      ["I", "read", "an", "article", "about", "{topic}", "this", "morning"],
      ["The", "story", "gives", "us", "some", "facts", "about", "{topic}"]
    ],
    [
      ["According to", "this article", "{topic}", "is becoming", "an important", "topic for", "many people", "around the world"],
      ["Recent", "reports", "suggest", "that", "{topic}", "could have", "a big impact", "on everyday life"],
      ["Experts", "have been", "studying", "{topic}", "closely", "because it affects", "so many", "different areas of society"],
      ["This story", "explains", "why", "{topic}", "matters", "to", "so many people", "right now"]
    ],
    [
      ["This article", "highlights", "how", "{topic}", "continues to influence", "public debate", "and policy decisions", "in ways that were", "hard to predict before"],
      ["Analysts argue", "that", "{topic}", "represents", "a turning point", "which could reshape", "how institutions and individuals", "respond to", "similar challenges ahead"],
      ["Although opinions differ widely,", "most commentators agree", "that", "{topic}", "deserves", "far more attention", "than", "it has received so far"],
      ["The report", "makes clear", "that", "{topic}", "will likely remain", "a central issue", "for policymakers and researchers", "in the years ahead"]
    ]
  ];
  var FALLBACK_TOPICS = ["this story", "this topic", "this issue"];

  function topicDrills(keywords) {
    var kws = (keywords && keywords.length) ? keywords.slice(0, 3) : [];
    while (kws.length < 3) kws.push(FALLBACK_TOPICS[kws.length % FALLBACK_TOPICS.length]);
    return kws.map(function (kw, i) {
      var band = TEMPLATE_BANDS[i % TEMPLATE_BANDS.length];
      var template = band[i % band.length];
      return template.map(function (chunk) { return chunk.replace("{topic}", kw); });
    });
  }

  // Turn a drill's chunk list into the same {prevCount,count,words} step
  // shape the renderer expects.
  function buildStepsFromDrill(chunks) {
    var words = [];
    var boundaries = [0];
    chunks.forEach(function (chunk) {
      chunk.split(/\s+/).forEach(function (w) { words.push(w); });
      boundaries.push(words.length);
    });
    var steps = [];
    for (var i = 1; i <= 10; i++) {
      var count = boundaries[Math.min(i, boundaries.length - 1)];
      var prev = boundaries[Math.min(i - 1, boundaries.length - 1)];
      steps.push({ prevCount: prev, count: count, words: words });
    }
    return steps;
  }

  global.SentenceBank = { topicDrills: topicDrills, buildStepsFromDrill: buildStepsFromDrill };
})(window);
