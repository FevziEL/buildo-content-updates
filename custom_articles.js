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
    },
    {
      id: "custom_microplastics_and_plants_part3",
      topic: "cevre",
      source: "Bizden Gelenler",
      title: "Microplastics and Plants: What Happens Inside?",
      link: "",
      pubDate: "2026-08-17T12:00:00Z",
      image: "",
      bodyParagraphs: [
        "Part 3 — When Plastic Meets Plant Physiology",
        "Once plants encounter microplastics or nanoplastics, the biological response can extend far beyond physical particle accumulation.",
        "One of the most frequently observed responses involves oxidative stress. Plastic particles can disturb cellular homeostasis and stimulate the production of reactive oxygen species such as hydrogen peroxide and superoxide. Plants respond by activating antioxidant systems involving enzymes such as superoxide dismutase, catalase, peroxidases, and enzymes of the ascorbate–glutathione cycle.",
        "At first, this response may represent successful adaptation. Under stronger or prolonged exposure, however, antioxidant capacity may become insufficient, resulting in membrane damage, altered metabolism, and growth inhibition.",
        "Photosynthesis is another important target. Studies in crops including lettuce have reported changes in chlorophyll content, chlorophyll fluorescence, electron transport, and photosynthetic performance following exposure to plastic particles.",
        "But perhaps the most interesting aspect is that these responses may not be caused by the particles alone.",
        "Microplastics can also modify nutrient availability, soil properties, and microbial communities surrounding roots. The resulting physiological response may therefore represent a combination of direct particle effects and indirect changes in the plant's environment.",
        "The plastic particle may be small.",
        "The biological response can be systemic."
      ]
    },
    {
      id: "custom_microplastics_and_plants_part4",
      topic: "cevre",
      source: "Bizden Gelenler",
      title: "Microplastics and Plants: The Rhizosphere Connection",
      link: "",
      pubDate: "2026-08-17T18:00:00Z",
      image: "",
      bodyParagraphs: [
        "Part 4 — The Hidden Ecosystem Around the Root",
        "Perhaps the most underestimated component of plant–microplastic research is the rhizosphere.",
        "A root is surrounded by a microbial ecosystem that regulates nutrient cycling, hormone production, organic matter transformation, and plant stress responses. Microplastics can modify this environment by changing soil structure, organic matter interactions, nutrient availability, and microbial community composition.",
        "Recent studies suggest that these changes can extend surprisingly far. Exposure to airborne microplastics, for example, has been associated with changes in leaf physiology, root metabolism, and root exudation, followed by alterations in rhizosphere bacterial communities.",
        "This creates a fascinating biological chain.",
        "A particle may interact with a leaf, alter plant metabolism, modify carbon allocation to the root, change the chemistry of root exudates, and ultimately reshape the microbial community belowground.",
        "In this context, microplastic toxicity cannot be understood simply as a direct interaction between a particle and a plant cell.",
        "It is increasingly becoming a question of plant–soil–microbe interactions.",
        "That shift could fundamentally change how environmental phytotoxicity is studied."
      ]
    },
    {
      id: "custom_microplastics_and_plants_part5",
      topic: "cevre",
      source: "Bizden Gelenler",
      title: "Microplastics and Plants: The Questions That Remain",
      link: "",
      pubDate: "2026-08-18T00:00:00Z",
      image: "",
      bodyParagraphs: [
        "Part 5 — From Plastic Pollution to Food Security",
        "The possibility that microplastics can enter edible plant tissues has naturally attracted enormous attention. Lettuce, wheat, carrot, and other crops have already been investigated for particle uptake and translocation.",
        "Yet one important scientific caution remains.",
        "Detecting plastic-associated signals inside a plant is not the same as demonstrating that intact particles have crossed every biological barrier. Fluorescent labelling, particle aggregation, sample preparation, and imaging artefacts can complicate interpretation. Researchers are therefore increasingly combining microscopy with spectroscopic and chemically specific analytical techniques.",
        "At the same time, laboratory studies often use pristine spherical particles at relatively high concentrations. Environmental plastics are much more complicated. They are weathered, irregularly shaped, chemically heterogeneous, and frequently covered with microorganisms or associated contaminants such as metals and pesticides.",
        "This is why the next generation of research will need to move from simple laboratory exposure experiments toward environmentally realistic systems.",
        "The real question is not whether one particular plastic particle can enter a plant.",
        "The real question is how continuous exposure to a complex mixture of aged microplastics and nanoplastics will influence crop productivity, plant–microbe interactions, contaminant accumulation, and ultimately food quality.",
        "That is where the story becomes much bigger than microplastics.",
        "It becomes a question of the future of agricultural ecosystems."
      ]
    },
    {
      id: "custom_microplastics_and_plants_part6",
      topic: "cevre",
      source: "Bizden Gelenler",
      title: "Microplastics and Plants: When Pollution Becomes a Biological Signal",
      link: "",
      pubDate: "2026-08-18T06:00:00Z",
      image: "",
      bodyParagraphs: [
        "Part 6 — The Plant May Be Responding to More Than Plastic",
        "When a plant encounters microplastics, the most obvious assumption is that the particle itself is responsible for the resulting stress. However, emerging research suggests that this interpretation may be incomplete.",
        "Microplastics can behave as mobile surfaces within the environment. Their physicochemical properties allow them to interact with metals, pesticides, pharmaceuticals, and naturally occurring organic compounds. As a result, a plant exposed to plastic particles may actually experience a combined chemical challenge rather than a purely physical one.",
        "This becomes particularly important in agricultural environments. A weathered plastic particle is very different from a freshly manufactured laboratory particle. Sunlight, oxygen, mechanical abrasion, and microorganisms can alter its surface, producing new functional groups and increasing its capacity to interact with surrounding contaminants.",
        "The plant therefore encounters not simply \"plastic\", but a chemically modified particle carrying an environmental history.",
        "Recent studies have also begun to reveal how strongly plant responses depend on context. Salinity, drought, temperature, nutrient availability, and the composition of the surrounding soil can all modify the biological effects of microplastics. A particle that produces a relatively mild response under optimal conditions may become considerably more disruptive when the plant is already under environmental stress.",
        "This suggests that microplastics may function less like a single conventional toxicant and more like a stress amplifier.",
        "That concept could become one of the most important ideas in the field.",
        "The future of microplastic research may therefore depend on studying plants under realistic combinations of stresses rather than exposing them to isolated particles in simplified laboratory systems.",
        "After all, crops do not grow in laboratory conditions.",
        "They grow in ecosystems.",
        "And that is where the true biological story of microplastics is only beginning."
      ]
    }
  ];

  global.CustomArticles = { ARTICLES: ARTICLES };
})(window);
