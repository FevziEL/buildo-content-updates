/*
 * "Bizden Gelenler" / "From Us" — original pieces written for Buildo,
 * bundled locally (not fetched from any RSS feed, so none of the
 * automated content-quality gates in app.js apply to these — they're
 * hand-curated, not scraped, so that trust model doesn't apply the same
 * way). Kept in its own file, the same pattern as external_sources.js and
 * i18n/*.js, so adding a new piece later never means touching app.js's
 * core logic — just append another object to ARTICLES below.
 *
 * Shape matches what openArticleObject() expects from any fetched
 * article (id/topic/source/title/link/pubDate/image/bodyParagraphs) —
 * app.js fills in the computed fields (readTime/wordCount/factSheet/etc.)
 * at load time, see materializeCustomArticles() in app.js. That's what
 * lets a piece here go through the exact same reading/build-up/
 * vocabulary/shadowing/comprehension flow as any other article, with no
 * separate code path.
 *
 * Fields:
 *   id         stable, unique string — used as the localStorage key for
 *              progress/saved/vocabulary, so NEVER change an existing
 *              entry's id once it's shipped (would orphan any progress a
 *              reader already made on it).
 *   topic      "bilim" | "cevre" | "saglik" — same three real topics as
 *              the rest of the app, used only for the Browse Science
 *              topic-label styling if ever reused there; these pieces
 *              don't appear in Browse Science's own list.
 *   source     shown as the article's source tag, in place of a
 *              publisher name.
 *   link       real external URL if this piece was also published
 *              somewhere, else "" — openArticleObject hides "Read at
 *              source" entirely when this is empty, never a dead link.
 *   pubDate    ISO date string — real date the piece was added here.
 *   image      optional hero image URL, else "" (falls back to the same
 *              placeholder thumbnail every image-less article already
 *              uses).
 *   bodyParagraphs  array of real paragraph strings, in order. A leading
 *              short "Part N — ..." line is fine as its own array entry
 *              (renders as a short first paragraph, same as any article).
 */
(function (global) {
  "use strict";

  var ARTICLES = [
    {
      id: "custom_microplastics_and_plants_part1",
      topic: "cevre",
      source: "Bizden Gelenler",
      title: "Microplastics and Plants: A New Biological Conversation",
      link: "",
      pubDate: "2026-08-17T00:00:00Z",
      image: "",
      bodyParagraphs: [
        "Part 1 — The Plastic Problem Has Reached the Plant",
        "For years, the scientific discussion surrounding microplastics focused mainly on oceans, sediments, and animal exposure. Plants were often treated as secondary players. That perspective is changing rapidly. Microplastics and, particularly, nanoplastics are now being investigated as biologically active environmental stressors capable of interacting with roots, leaves, cellular structures, and the rhizosphere.",
        "The important question is no longer simply whether plants encounter plastic. They clearly do. The more interesting question is what happens after that encounter.",
        "Agricultural soils can receive plastic particles through contaminated irrigation water, sewage-derived materials, plastic mulching, atmospheric deposition, and the degradation of larger plastic products. Once present in soil, these particles enter a highly dynamic environment dominated by roots, microorganisms, minerals, organic matter, and water.",
        "This means that plastic does not exist around a plant as an inert contaminant. It becomes part of a complex biological system.",
        "And this may be the beginning of a much larger scientific story."
      ]
    }
  ];

  global.CustomArticles = { ARTICLES: ARTICLES };
})(window);
