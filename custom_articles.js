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
    },
    {
      id: "custom_microplastics_and_plants_part2",
      topic: "cevre",
      source: "Bizden Gelenler",
      title: "Microplastics and Plants: How Do Particles Enter?",
      link: "",
      pubDate: "2026-08-17T06:00:00Z",
      image: "",
      bodyParagraphs: [
        "Part 2 — The Root Is Not the Only Door",
        "Roots were initially considered the primary route through which plants encounter microplastics. Experimental studies now suggest that small plastic particles, particularly nanoplastics, can associate with root surfaces and, under certain conditions, enter internal tissues.",
        "However, the story does not stop underground.",
        "Leaves can also be exposed directly through atmospheric deposition. Recent research has shown that nanoscale plastic particles deposited on foliage can penetrate through stomatal openings and subsequently become associated with internal tissues and vascular structures. This finding is particularly important for agricultural crops because atmospheric contamination may provide an exposure pathway independent of soil contamination.",
        "The plant therefore has two very different interfaces with plastic: the root–soil interface belowground and the leaf–atmosphere interface aboveground.",
        "What makes the situation even more interesting is that these pathways may interact. A particle entering through a leaf does not necessarily remain there. Experiments have demonstrated that some nanoplastics can move between plant organs, although transport efficiency is generally limited and highly dependent on particle and plant characteristics.",
        "The plant is not simply absorbing plastic.",
        "It is selectively interacting with it."
      ]
    }
  ];

  global.CustomArticles = { ARTICLES: ARTICLES };
})(window);
