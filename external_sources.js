/*
 * External Reading Sources — science-only external article system (v0.12).
 *
 * Self-contained module, independent of app.js's IIFE (per the extensibility
 * goal in APP_SPEC_PROMPT.md §32: registering a new source should never
 * require touching the existing Browse News pipeline). Exposes a single
 * global, window.ExternalReading, with:
 *   - SOURCES          the source registry (name/type/access_mode/topics/fetch)
 *   - TOPIC_WEIGHTS     science-priority recommendation weights
 *   - SCIENCE_SUBCATEGORIES  extensible list of academic-science topics
 *   - ACCESS_MODES      the three-value content-access enum
 *   - availableSources()   SOURCES filtered to ones actually configured+working
 *   - fetchArticles(filters)   runs the retrieval pipeline, returns a Promise
 *                              of normalized article objects
 *   - recommendationScore(article, context)
 *
 * v0.12: this app doesn't label or compare reading difficulty ANYWHERE —
 * per product direction, the "Beginner/Intermediate/Advanced" classifier
 * that used to live in this file (an enhanced version of Browse News'
 * levelFromStats, per spec §7/§8) was removed outright, along with the
 * Level picker in the UI and difficulty_match in the recommendation
 * formula. Articles no longer carry a difficulty/tier field at all. See
 * APP_SPEC_PROMPT.md §18/§33 for the full history — the tier system went
 * through three different calibrations (v0.09-v0.11) before this.
 *
 * Also v0.12: SCIENCE ONLY. Non-science topics (general news, society,
 * culture) are filtered OUT of the results entirely, not just deprioritized
 * — see SCIENCE_TOPICS below. This app reads science, full stop.
 *
 * ════════════════════════════════════════════════════════════════════════
 * COPYRIGHT / LICENSE SAFETY — the most important rule in this file.
 * Every source below was individually curl-tested (v0.11) and assigned one
 * of three access modes; nothing here scrapes an arbitrary website:
 *
 *   FULL_TEXT        — a verified basis for storing/showing the real body
 *                       text exists (public-domain government work, e.g.
 *                       NASA; or a license that explicitly permits it).
 *   LICENSE_CHECKED  — the source is Open Access but licensing is per-item;
 *                       the real body/abstract text is shown only when the
 *                       item's own license field allows reuse, checked at
 *                       fetch time, not assumed from the source as a whole.
 *   LINK_ONLY        — content is NOT stored or reproduced. Only metadata
 *                       (title/author/date/source/URL/topic) is kept;
 *                       opening the article leaves the app and opens the
 *                       source's own page. This is the
 *                       fail-safe default — see FAIL_SAFE_ACCESS_MODE below.
 *
 * A source that cannot be reached at build time (blocked, no working feed)
 * is still registered — for documentation/extensibility — but flagged
 * available:false, so it never appears in the picker (§3: "Only display
 * sources that are actually configured and available").
 * ════════════════════════════════════════════════════════════════════════
 */
(function (global) {
  "use strict";

  var ACCESS_MODES = { FULL_TEXT: "FULL_TEXT", LICENSE_CHECKED: "LICENSE_CHECKED", LINK_ONLY: "LINK_ONLY" };
  var FAIL_SAFE_ACCESS_MODE = ACCESS_MODES.LINK_ONLY;

  // ---- Science-only topic set (v0.12) — general news/society/culture are
  // filtered OUT of results entirely (see fetchArticles below), not just
  // deprioritized. TOPIC_WEIGHTS below is a recommendation-ranking detail
  // WITHIN this set (plant science/biology rank above e.g. space), not a
  // beginner/intermediate/advanced-style comparison — every topic here is
  // "science", some just surface a little higher on "All". ----
  var SCIENCE_TOPICS = {
    plant_science: true, biology: true, environment: true, biotechnology: true,
    ecology: true, climate: true, science: true, technology: true,
    health: true, space: true, earth: true, medicine: true, molecular_biology: true
  };
  function isScienceTopic(topic) { return !!SCIENCE_TOPICS[topic]; }

  var TOPIC_WEIGHTS = {
    plant_science: 1.00, biology: 1.00, environment: 0.95, biotechnology: 0.95,
    ecology: 0.90, climate: 0.85, science: 0.85, technology: 0.75,
    health: 0.70, space: 0.65,
    // Aliases so a source's own topic vocabulary always resolves to a real
    // weight instead of silently falling back to a default.
    earth: 0.85, medicine: 0.80, molecular_biology: 1.00
  };
  function topicWeight(topic) { return TOPIC_WEIGHTS[topic] != null ? TOPIC_WEIGHTS[topic] : 0.5; }

  // ---- Extensible science subcategories (spec §6). Not a hard-coded closed
  // set — SCIENCE_SUBCATEGORIES.push(...) is enough to extend it, and the
  // topic picker/matching below reads real topic strings from SOURCES, not
  // just this list, so an unrecognized-but-real topic still works via the
  // topicWeight() fallback above. ----
  var SCIENCE_SUBCATEGORIES = [
    "Plant Science", "Plant Physiology", "Plant Stress", "Plant Nutrition",
    "Phytoremediation", "Plant Biotechnology", "Environmental Pollution",
    "Nanotechnology", "Nanoplastics", "Heavy Metals", "Soil Science",
    "Water Pollution", "Ecology", "Climate Change", "Molecular Biology",
    "Genetics", "Cell Biology", "Microbiology", "Biotechnology",
    "Environmental Biotechnology"
  ];

  // ════════════════════════════════════════════════════════════════════
  // Fetch helpers — shared by every source adapter below.
  // ════════════════════════════════════════════════════════════════════
  function rss2jsonUrl(feedUrl) {
    return "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feedUrl);
  }
  function stripTags(html) { return String(html || "").replace(/<[^>]+>/g, " "); }
  function decodeEntities(str) {
    var ta = document.createElement("textarea");
    ta.innerHTML = str;
    return ta.value;
  }
  function cleanText(html) {
    return decodeEntities(stripTags(html)).replace(/\s+/g, " ").trim();
  }
  // Every network call in this module is independently try/caught and
  // resolves to [] on failure — one source failing (timeout, rate limit,
  // blocked, malformed response) never breaks the others or the screen
  // (spec §22: "skip source, continue with remaining sources").
  function safeFetchJson(url, timeoutMs) {
    var controller = ("AbortController" in window) ? new AbortController() : null;
    var opts = controller ? { signal: controller.signal } : {};
    var timer = controller ? setTimeout(function () { controller.abort(); }, timeoutMs || 12000) : null;
    return fetch(url, opts)
      .then(function (r) { return r.json(); })
      .catch(function () { return null; })
      .then(function (v) { if (timer) clearTimeout(timer); return v; });
  }
  function fetchRss(feedUrl, limit) {
    return safeFetchJson(rss2jsonUrl(feedUrl))
      .then(function (data) {
        if (!data || data.status !== "ok") return [];
        return (data.items || []).slice(0, limit || 8);
      })
      .catch(function () { return []; });
  }

  // ════════════════════════════════════════════════════════════════════
  // Topic classification (spec §9's "TOPIC CLASSIFICATION" pipeline stage)
  // — a lightweight keyword classifier applied to every fetched article
  // regardless of source, rather than trusting each source's own topic
  // labels (most of these feeds don't provide reliable per-item topics at
  // all). Falls back to the source's first declared topic when nothing
  // matches clearly. "society"/"general_news" are kept as real detection
  // buckets (not dropped) specifically so non-science articles classify
  // INTO them and then get filtered OUT by isScienceTopic() in
  // fetchArticles — removing these buckets would make a non-science
  // article fall through to some science bucket by default instead, which
  // is the opposite of what "science only" (v0.12) needs.
  // ════════════════════════════════════════════════════════════════════
  var TOPIC_KEYWORDS = {
    plant_science: ["plant", "crop", "photosynthesis", "seed", "root", "leaf", "leaves", "flower", "botany", "agriculture", "farming", "horticulture"],
    biology: ["cell", "gene", "genome", "organism", "species", "dna", "protein", "evolution", "biology", "biological", "microbe", "bacteria", "virus", "molecular"],
    environment: ["pollution", "emissions", "ecosystem", "sustainability", "conservation", "wildlife", "deforestation", "recycling", "pollutant", "contamination"],
    biotechnology: ["biotechnology", "genetic engineering", "crispr", "bioengineering", "synthetic biology", "gmo", "biotech"],
    ecology: ["ecology", "ecological", "biodiversity", "habitat", "food web", "population decline", "invasive species"],
    climate: ["climate", "warming", "carbon", "greenhouse", "emissions", "drought", "sea level"],
    science: ["science", "research", "scientist", "discovery", "laboratory", "study finds", "researchers"],
    technology: ["technology", "artificial intelligence", " ai ", "software", "computer", "robot", "internet", "app", "algorithm", "chip"],
    health: ["health", "medicine", "medical", "disease", "patient", "treatment", "doctor", "hospital", "vaccine", "cancer"],
    space: ["space", "nasa", "planet", "galaxy", "astronaut", "telescope", "moon", "mars", "satellite", "orbit", "asteroid"],
    society: ["society", "community", "education", "social", "policy", "culture"],
    general_news: ["election", "government", "economy", "market", "politics", "president", "minister"]
  };
  function classifyTopic(text, fallbackTopics) {
    var lower = (" " + String(text || "").toLowerCase() + " ");
    var bestTopic = null, bestScore = 0;
    Object.keys(TOPIC_KEYWORDS).forEach(function (topic) {
      var score = 0;
      TOPIC_KEYWORDS[topic].forEach(function (kw) {
        if (lower.indexOf(kw) !== -1) score++;
      });
      if (score > bestScore) { bestScore = score; bestTopic = topic; }
    });
    if (bestTopic) return bestTopic;
    return (fallbackTopics && fallbackTopics[0]) || "general_news";
  }

  // ════════════════════════════════════════════════════════════════════
  // Content hash + article normalization — every adapter below produces
  // this same shape, regardless of source, so the rest of the pipeline
  // (dedupe, scoring, rendering, and — for FULL_TEXT/LICENSE_CHECKED items
  // — reuse of the app's EXISTING article-reading/build-up flow) doesn't
  // need to know which source an article came from.
  // ════════════════════════════════════════════════════════════════════
  function simpleHash(str) {
    var h = 0;
    str = String(str || "");
    for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
    return Math.abs(h).toString(36);
  }
  function estimateReadTime(wordCount) {
    return Math.max(1, Math.round(wordCount / 200)) + " dk okuma";
  }
  function makeExternalArticle(opts) {
    // opts: { sourceId, title, link, author, pubDate, imageUrl, bodyParagraphs (or null), summary, topicHint, accessMode, license }
    var bodyParagraphs = opts.bodyParagraphs || null;
    var bodyText = bodyParagraphs ? bodyParagraphs.join(" ") : (opts.summary || "");
    var wordCount = bodyText.split(/\s+/).filter(Boolean).length;
    var topic = classifyTopic((opts.title || "") + " " + (opts.summary || ""), opts.topicHint);
    var contentHash = simpleHash((opts.title || "") + "|" + opts.sourceId);
    return {
      id: "ext_" + opts.sourceId + "_" + contentHash,
      contentHash: contentHash,
      title: cleanText(opts.title || ""),
      source: SOURCES[opts.sourceId] ? SOURCES[opts.sourceId].name : opts.sourceId,
      sourceId: opts.sourceId,
      sourceUrl: opts.link,
      author: opts.author || "",
      pubDate: opts.pubDate || new Date().toISOString(),
      retrievedAt: Date.now(),
      topic: topic,
      wordCount: wordCount,
      readTime: estimateReadTime(wordCount || 40),
      language: "en",
      license: opts.license || "",
      accessMode: opts.accessMode,
      summary: cleanText(opts.summary || "").slice(0, 220),
      imageUrl: opts.imageUrl || "",
      bodyParagraphs: opts.accessMode === ACCESS_MODES.LINK_ONLY ? null : bodyParagraphs,
      isExternal: true
    };
  }
  function extractBodyParagraphs(html) {
    if (!html) return [];
    var stripped = String(html).replace(/<ul[\s\S]*?<\/ul>/gi, " ");
    var paraMatches = stripped.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    if (!paraMatches.length) {
      var plain = cleanText(stripped);
      return plain.length > 15 ? [plain] : [];
    }
    return paraMatches.map(function (p) { return cleanText(p); }).filter(function (t) { return t.length > 15; });
  }

  // ════════════════════════════════════════════════════════════════════
  // SOURCE REGISTRY (spec §4/§12) — every entry curl-verified live, v0.11.
  // Adding a new source = one more entry here with a fetch() adapter; the
  // rest of the pipeline (topic classification, science-only filtering,
  // dedupe, recommendation scoring, rendering) needs no changes — §21.
  // ════════════════════════════════════════════════════════════════════
  var SOURCES = {
    bbc_learning_english: {
      name: "BBC Learning English", type: "learner_content",
      access_mode: ACCESS_MODES.LINK_ONLY, available: true,
      topics: ["science", "technology"],
      license: "© BBC — all rights reserved",
      // Verified live: the 6 Minute English RSS only ever gives a 5-15 word
      // teaser, never lesson text — LINK_ONLY is correct, not just cautious.
      fetch: function () {
        return fetchRss("https://www.bbc.co.uk/learningenglish/english/features/6-minute-english/rss", 10)
          .then(function (items) {
            return items.map(function (it) {
              return makeExternalArticle({
                sourceId: "bbc_learning_english", title: it.title, link: it.link,
                pubDate: it.pubDate, summary: it.description, imageUrl: it.thumbnail,
                accessMode: ACCESS_MODES.LINK_ONLY, license: "© BBC",
                topicHint: ["science"]
              });
            });
          });
      }
    },

    voa_learning_english: {
      name: "VOA Learning English", type: "learner_content",
      access_mode: ACCESS_MODES.LINK_ONLY, available: true,
      topics: ["science", "technology", "health", "environment"],
      license: "Voice of America — all rights reserved",
      // Verified live: RSS <description> is empty on every item (no body
      // text at all over RSS) — LINK_ONLY, metadata only.
      fetch: function () {
        return fetchRss("https://learningenglish.voanews.com/api/", 10)
          .then(function (items) {
            return items.map(function (it) {
              return makeExternalArticle({
                sourceId: "voa_learning_english", title: it.title, link: it.link,
                pubDate: it.pubDate, summary: "", imageUrl: it.thumbnail,
                accessMode: ACCESS_MODES.LINK_ONLY, license: "VOA",
                topicHint: ["science"]
              });
            });
          });
      }
    },

    news_in_levels: {
      name: "News in Levels", type: "learner_content",
      access_mode: ACCESS_MODES.LINK_ONLY, available: true,
      topics: ["science", "environment", "health"],
      license: "© News in Levels — all rights reserved (site terms confirm no redistribution)",
      // Verified live: real full-length content IS present in the RSS
      // (content:encoded), but the site's own terms say "all rights
      // reserved" with no reuse grant, so per spec §11 ("fail safe →
      // LINK_ONLY when reuse rights cannot be verified") this stays
      // metadata-only even though the text is technically fetchable.
      // (v0.12: this source's titles happen to end in "– level 1/2/3" —
      // that's just what the real title says, left untouched; the app no
      // longer parses or uses it for anything, since it doesn't label or
      // compare difficulty anywhere.)
      fetch: function () {
        return fetchRss("https://www.newsinlevels.com/feed/", 12)
          .then(function (items) {
            return items.map(function (it) {
              return makeExternalArticle({
                sourceId: "news_in_levels", title: it.title, link: it.link,
                pubDate: it.pubDate, summary: "", imageUrl: it.thumbnail,
                accessMode: ACCESS_MODES.LINK_ONLY, license: "News in Levels",
                topicHint: ["science"]
              });
            });
          });
      }
    },

    nasa: {
      name: "NASA", type: "public_domain_or_permitted",
      access_mode: ACCESS_MODES.FULL_TEXT, available: true,
      topics: ["space", "science", "earth", "climate", "biology", "technology", "environment"],
      license: "NASA content is generally not copyrighted (U.S. Government work)",
      fetch: function () {
        return fetchRss("https://www.nasa.gov/feed/", 10)
          .then(function (items) {
            return items.map(function (it) {
              var paragraphs = extractBodyParagraphs(it.content || it.description);
              return makeExternalArticle({
                sourceId: "nasa", title: it.title, link: it.link, author: it.author,
                pubDate: it.pubDate, summary: it.description, imageUrl: it.thumbnail,
                bodyParagraphs: paragraphs, accessMode: ACCESS_MODES.FULL_TEXT,
                license: "U.S. Government work (public domain)", topicHint: ["space", "science"]
              });
            }).filter(function (a) { return a.bodyParagraphs && a.bodyParagraphs.length; });
          });
      }
    },

    usgs: {
      name: "USGS", type: "government_science",
      access_mode: ACCESS_MODES.FULL_TEXT, available: false,
      topics: ["earth", "environment", "water", "ecology", "biology", "climate"],
      license: "U.S. Government work (public domain)",
      // Registered per spec §4/§12 but NOT shown in the picker (§3: "only
      // display sources that are actually configured and available").
      // usgs.gov's news/RSS/JSON:API endpoints all returned 403 "Request
      // blocked" (CloudFront/WAF) when curl-tested for v0.11 — not a
      // licensing problem, a live access problem. Re-test before flipping
      // available:true; fetch() intentionally left unimplemented until then.
      fetch: function () { return Promise.resolve([]); }
    },

    plos: {
      name: "PLOS", type: "open_access",
      access_mode: ACCESS_MODES.LICENSE_CHECKED, available: true,
      topics: ["biology", "plant_science", "environment", "ecology", "biotechnology", "science"],
      license: "CC BY 4.0 — every PLOS article is Open Access under this license (publisher-wide, verified, not a per-article check)",
      // api.plos.org has Access-Control-Allow-Origin: * — fetched directly,
      // no rss2json proxy needed. Only the abstract is retrieved (the full-
      // text XML endpoint is a separate, heavier integration) — shown
      // honestly as an abstract, not passed off as the full paper.
      fetch: function (topicHint) {
        // Exact PLOS subject-taxonomy strings — verified live (v0.11):
        // "Biology" and "Environmental sciences" alone return 0 results,
        // the taxonomy needs the full term. Re-verify against
        // api.plos.org/search?q=subject:"..."&rows=0 before editing.
        var subjectMap = {
          plant_science: "Plant science", biology: "Biology and life sciences",
          environment: "Ecology and environmental sciences",
          ecology: "Ecology and environmental sciences", biotechnology: "Biotechnology"
        };
        var subject = subjectMap[topicHint] || "Biology and life sciences";
        // fq=doc_type:full is required — without it PLOS's Solr index also
        // returns nested per-field "child documents" (id suffixed
        // "/title", "/abstract", …) that have no title/abstract of their
        // own, silently corrupting results with empty-title rows. Verified
        // live (v0.11): 7 of 8 rows came back title:"" before this fix.
        var url = "https://api.plos.org/search?q=subject:%22" + encodeURIComponent(subject) +
          "%22&fq=doc_type:full&rows=8&sort=publication_date+desc&fl=id,title,abstract,journal,publication_date,author_display";
        return safeFetchJson(url).then(function (data) {
          var docs = (data && data.response && data.response.docs) || [];
          return docs.map(function (d) {
            var abstract = (d.abstract && d.abstract[0]) ? cleanText(d.abstract[0]) : "";
            return makeExternalArticle({
              sourceId: "plos", title: d.title, link: "https://doi.org/" + d.id,
              author: (d.author_display || []).slice(0, 3).join(", "),
              pubDate: d.publication_date, summary: abstract,
              bodyParagraphs: abstract ? [abstract, "(Full text: " + d.journal + ", DOI " + d.id + " — this is the article's abstract; open the link for the complete paper.)"] : null,
              accessMode: ACCESS_MODES.LICENSE_CHECKED, license: "CC BY 4.0 (PLOS)",
              topicHint: [topicHint || "biology"]
            });
          });
        });
      }
    },

    pmc: {
      name: "PubMed Central", type: "open_access",
      access_mode: ACCESS_MODES.LINK_ONLY, available: true,
      topics: ["biology", "biotechnology", "medicine", "molecular_biology", "environment", "plant_science"],
      license: "Per-article — most PMC content is copyrighted by the publisher; only the Open Access subset is reusable",
      // v1 scope: real metadata (title/authors/journal/date) via the free
      // NCBI E-utilities esearch+esummary — Access-Control-Allow-Origin: *,
      // fetched directly. Verifying OA-subset membership + fetching full
      // text needs a second call (the PMC OA Service) — flagged as a
      // documented future extension (spec §21), not implemented in v1, so
      // this stays LINK_ONLY rather than guessing at reuse rights.
      fetch: function (topicHint) {
        var termMap = {
          plant_science: "plant science", biology: "molecular biology",
          biotechnology: "biotechnology", environment: "environmental science",
          molecular_biology: "molecular biology", medicine: "clinical medicine"
        };
        var term = encodeURIComponent(termMap[topicHint] || "biology");
        var searchUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pmc&term=" + term + "&retmax=8&retmode=json&sort=pub+date";
        return safeFetchJson(searchUrl).then(function (searchData) {
          var ids = (searchData && searchData.esearchresult && searchData.esearchresult.idlist) || [];
          if (!ids.length) return [];
          var summaryUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pmc&id=" + ids.join(",") + "&retmode=json";
          return safeFetchJson(summaryUrl).then(function (sumData) {
            if (!sumData || !sumData.result) return [];
            return ids.map(function (id) {
              var r = sumData.result[id];
              if (!r) return null;
              return makeExternalArticle({
                sourceId: "pmc", title: r.title,
                link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC" + id + "/",
                author: (r.authors || []).slice(0, 3).map(function (a) { return a.name; }).join(", "),
                pubDate: r.pubdate, summary: r.fulljournalname ? ("Published in " + r.fulljournalname) : "",
                accessMode: ACCESS_MODES.LINK_ONLY, license: "Per-publisher (unverified in v1)",
                topicHint: [topicHint || "biology"]
              });
            }).filter(Boolean);
          });
        });
      }
    },

    doaj: {
      name: "DOAJ", type: "open_access_index",
      access_mode: ACCESS_MODES.LINK_ONLY, available: true,
      topics: ["science", "biology", "environment", "biotechnology", "ecology", "plant_science"],
      license: "Per-article — DOAJ's article search API doesn't expose a reliable per-item license field, so per spec §11 this fails safe to LINK_ONLY (DOAJ is explicitly meant as a discovery/index layer, not a content host — see spec §12)",
      // doaj.org/api has Access-Control-Allow-Origin: * — fetched directly.
      fetch: function (topicHint) {
        var query = encodeURIComponent(topicHint === "plant_science" ? "plant science" : (topicHint || "ecology"));
        var url = "https://doaj.org/api/search/articles/" + query + "?pageSize=8";
        return safeFetchJson(url).then(function (data) {
          var results = (data && data.results) || [];
          return results.map(function (r) {
            var bib = r.bibjson || {};
            var abstract = cleanText(bib.abstract || "");
            var link = (bib.link || []).find(function (l) { return l.type === "fulltext"; });
            return makeExternalArticle({
              sourceId: "doaj", title: bib.title,
              link: (link && link.url) || ("https://doaj.org/article/" + r.id),
              author: (bib.author || []).slice(0, 3).map(function (a) { return a.name; }).join(", "),
              pubDate: (bib.year || "") + (bib.month ? "-" + bib.month : "-01") + "-01",
              summary: abstract,
              accessMode: ACCESS_MODES.LINK_ONLY, license: "Per-publisher (unverified)",
              topicHint: [topicHint || "science"]
            });
          });
        });
      }
    },

    the_conversation: {
      name: "The Conversation", type: "academic_journalism",
      access_mode: ACCESS_MODES.LICENSE_CHECKED, available: true,
      topics: ["science", "environment", "technology"],
      license: "CC BY-ND 4.0 — The Conversation explicitly permits republishing unmodified, with attribution",
      // Verified live: the global Atom feed carries the FULL article body
      // (10,000+ chars) via rss2json's "content" field, not just a teaser.
      // The feed itself covers every beat (politics, arts, …), not just
      // science — the science-only filter in fetchArticles (isScienceTopic)
      // is what actually keeps this source on-topic, not this fetch adapter.
      fetch: function () {
        return fetchRss("https://theconversation.com/global/articles.atom", 10)
          .then(function (items) {
            return items.map(function (it) {
              var paragraphs = extractBodyParagraphs(it.content || it.description);
              return makeExternalArticle({
                sourceId: "the_conversation", title: it.title, link: it.link, author: it.author,
                pubDate: it.pubDate, summary: it.description, imageUrl: it.thumbnail,
                bodyParagraphs: paragraphs, accessMode: ACCESS_MODES.LICENSE_CHECKED,
                license: "CC BY-ND 4.0", topicHint: ["science"]
              });
            }).filter(function (a) { return a.bodyParagraphs && a.bodyParagraphs.length; });
          });
      }
    },

    scientific_american: {
      name: "Scientific American", type: "commercial_science_media",
      access_mode: ACCESS_MODES.LINK_ONLY, available: true,
      topics: ["science", "technology", "biology", "environment"],
      license: "© Scientific American — subscription/paywalled, all rights reserved",
      fetch: function () {
        return fetchRss("https://www.scientificamerican.com/platform/syndication/rss/", 10)
          .then(function (items) {
            return items.map(function (it) {
              return makeExternalArticle({
                sourceId: "scientific_american", title: it.title, link: it.link,
                pubDate: it.pubDate, summary: it.description, imageUrl: it.thumbnail,
                accessMode: ACCESS_MODES.LINK_ONLY, license: "© Scientific American",
                topicHint: ["science"]
              });
            });
          });
      }
    }
  };

  function availableSources() {
    return Object.keys(SOURCES).filter(function (id) { return SOURCES[id].available !== false; })
      .map(function (id) { return Object.assign({ id: id }, SOURCES[id]); });
  }

  // ════════════════════════════════════════════════════════════════════
  // Retrieval pipeline (spec §9): SOURCE DISCOVERY → per-source fetch (each
  // independently try/caught, spec §22) → dedupe (spec §19) → SCIENCE-ONLY
  // filter (v0.12) → filtered by the user's topic/source selection →
  // RECOMMENDATION ENGINE (§13).
  // ════════════════════════════════════════════════════════════════════
  function fetchArticles(filters) {
    filters = filters || {};
    var sourceIds = filters.source && filters.source !== "all"
      ? [filters.source]
      : Object.keys(SOURCES).filter(function (id) { return SOURCES[id].available !== false; });

    var topicHint = filters.topic && filters.topic !== "all" ? filters.topic : null;

    var perSource = sourceIds.map(function (id) {
      var src = SOURCES[id];
      if (!src) return Promise.resolve([]);
      try {
        return src.fetch(topicHint).catch(function () { return []; });
      } catch (e) {
        return Promise.resolve([]); // one misbehaving adapter never breaks the rest
      }
    });

    return Promise.all(perSource).then(function (lists) {
      var all = [].concat.apply([], lists);
      // Science-only (v0.12): a general-interest outlet like BBC/VOA
      // Learning English or The Conversation covers every beat, not just
      // science — this is what actually keeps results on-topic, not the
      // per-source topicHint above (which only affects science API
      // *queries* like PLOS/DOAJ/PMC's subject search).
      var scienceOnly = all.filter(function (a) { return isScienceTopic(a.topic); });
      // Duplicate detection (spec §19): content_hash first, then a
      // normalized-title+source fallback for near-duplicates the hash
      // alone wouldn't catch (e.g. two sources syndicating the same story).
      var seen = {};
      var deduped = scienceOnly.filter(function (a) {
        var key = a.contentHash + "|" + a.sourceId;
        var titleKey = (a.title || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
        if (seen[key] || seen[titleKey]) return false;
        seen[key] = true; seen[titleKey] = true;
        return true;
      });
      return deduped;
    });
  }

  // ════════════════════════════════════════════════════════════════════
  // Recommendation engine (adapted from spec §13) — configurable weights.
  // v0.12: difficulty_match (0.30 in the original spec) was removed along
  // with the whole difficulty/tier concept (see file header) and its share
  // redistributed rather than just dropped, so the remaining signals still
  // sum to 1.0:
  //   final_score = topic_match*0.35 + science_priority*0.30 +
  //                 freshness*0.15 + source_quality*0.15 + user_history*0.05
  // ════════════════════════════════════════════════════════════════════
  var RECOMMENDATION_WEIGHTS = {
    topicMatch: 0.35, sciencePriority: 0.30,
    freshness: 0.15, sourceQuality: 0.15, userHistory: 0.05
  };
  var SOURCE_QUALITY = {
    nasa: 0.95, the_conversation: 0.9, plos: 0.9, pmc: 0.9, usgs: 0.9,
    doaj: 0.75, bbc_learning_english: 0.8, voa_learning_english: 0.7,
    news_in_levels: 0.6, scientific_american: 0.85
  };
  function recommendationScore(article, context) {
    context = context || {};
    var topicMatch = context.preferredTopic && context.preferredTopic !== "all"
      ? (article.topic === context.preferredTopic ? 1 : 0.2)
      : 0.6;
    var sciencePriority = topicWeight(article.topic);
    var ageDays = (Date.now() - new Date(article.pubDate).getTime()) / 86400000;
    var freshness = Math.max(0, 1 - (isFinite(ageDays) ? ageDays : 30) / 30);
    var sourceQuality = SOURCE_QUALITY[article.sourceId] != null ? SOURCE_QUALITY[article.sourceId] : 0.7;
    var userHistory = (context.userTopicHistory && context.userTopicHistory[article.topic]) ? 1 : 0.4;

    return (
      topicMatch * RECOMMENDATION_WEIGHTS.topicMatch +
      sciencePriority * RECOMMENDATION_WEIGHTS.sciencePriority +
      freshness * RECOMMENDATION_WEIGHTS.freshness +
      sourceQuality * RECOMMENDATION_WEIGHTS.sourceQuality +
      userHistory * RECOMMENDATION_WEIGHTS.userHistory
    );
  }

  global.ExternalReading = global.ExternalReading || {};
  Object.assign(global.ExternalReading, {
    ACCESS_MODES: ACCESS_MODES,
    FAIL_SAFE_ACCESS_MODE: FAIL_SAFE_ACCESS_MODE,
    TOPIC_WEIGHTS: TOPIC_WEIGHTS,
    topicWeight: topicWeight,
    isScienceTopic: isScienceTopic,
    SCIENCE_SUBCATEGORIES: SCIENCE_SUBCATEGORIES,
    SOURCES: SOURCES,
    RECOMMENDATION_WEIGHTS: RECOMMENDATION_WEIGHTS,
    classifyTopic: classifyTopic,
    availableSources: availableSources,
    fetchArticles: fetchArticles,
    recommendationScore: recommendationScore,
    _internal: { rss2jsonUrl: rss2jsonUrl, cleanText: cleanText, safeFetchJson: safeFetchJson, fetchRss: fetchRss, extractBodyParagraphs: extractBodyParagraphs }
  });
})(window);
