/*
 * Very rough English -> Turkish-orthography "approximate pronunciation" transliterator.
 *
 * This is NOT a real phonetic dictionary (no IPA, no stress detection). It's a small
 * exceptions list (common function words + the vocabulary used in sentences.js) plus
 * a letter-pattern fallback, good enough to give a Turkish learner a rough sense of
 * how a sentence sounds — the same spirit as writing "vörk" for "work". A production
 * app should replace this with a real grapheme-to-phoneme resource (e.g. CMUdict)
 * mapped to Turkish orthography, or simply lean on TTS instead of a fake respelling.
 */
(function (global) {
  var EXCEPTIONS = {
    // function words
    "i": "ay", "my": "may", "me": "mi", "you": "yu", "your": "yor",
    "he": "hi", "she": "şi", "we": "vi", "they": "dey", "them": "dem",
    "is": "iz", "are": "ar", "am": "em", "was": "voz", "were": "vör",
    "the": "dı", "a": "e", "an": "en", "this": "dis", "that": "det",
    "these": "diz", "those": "douz", "have": "hev", "has": "hez", "had": "hed",
    "with": "vit", "without": "vitaut", "work": "vörk", "works": "vörks",
    "working": "vörking", "worked": "vörkt", "water": "votır", "world": "vörld",
    "would": "vud", "will": "vil", "want": "vont", "what": "vat", "when": "ven",
    "where": "ver", "why": "vay", "who": "hu", "which": "viç", "while": "vayl",
    "in": "in", "on": "on", "of": "ov", "to": "tu", "for": "for", "from": "from",
    "and": "end", "but": "bat", "or": "or", "as": "ez", "at": "et", "by": "bay",
    "such": "saç", "so": "sou", "not": "nat", "no": "nou", "yes": "yes",
    "new": "nyu", "now": "nau", "more": "mor", "most": "moust", "each": "iç",
    "than": "den", "that": "det", "who": "hu", "whose": "huz",
    // shared vocabulary from the original worked example
    "research": "rısörç", "researcher": "rısörçır", "researchers": "rısörçırz",
    "study": "stadi", "studies": "stadiz", "scientist": "sayıntist",
    "scientists": "sayıntists", "science": "sayıns", "found": "faund",
    "finds": "faynds", "understand": "andırstend", "tolerance": "tolerıns",
    "aquatic": "ekuatik", "plants": "plents", "plant": "plent",
    "phytoremediation": "faytoremidieyşın", "contaminated": "kontamıneytıd",
    "containing": "konteyning", "heavy": "hevi", "metals": "metılz",
    "metal": "metıl", "arsenic": "arsenik", "lead": "led", "warn": "vorn",
    "current": "körınt", "cannot": "kenat", "keep": "kip", "pace": "peys",
    "rate": "reyt", "rates": "reyts", "pollution": "polluşın", "published": "pablişt",
    "week": "vik", "tracked": "trekt", "particles": "partikılz",
    "across": "ıkros", "dozens": "dazınz", "sites": "sayts", "south": "saut",
    "pacific": "pesifik", "percent": "pörsent", "surface": "sörfıs",
    "samples": "sempılz", "worldwide": "vörldvayd",
    "ninety": "naynti", "present": "prezınt", "microplastics": "maykroplestiks",
    "ocean": "ouşın", "oceans": "ouşınz", "levels": "levılz", "reach": "riç", "record": "rekord",
    "high": "hay", "marine": "mırin", "biologists": "bayolocists",
    "discovered": "diskavırd", "discovery": "diskavıri", "change": "çeync",
    "global": "gloubıl", "health": "helt", "food": "fud", "government": "gavırnmınt",
    "people": "pipıl", "country": "kantri", "million": "milyın",
    "billion": "bilyın", "billions": "bilyınz", "years": "yırz", "year": "yır",
    "help": "help", "according": "ıkording", "report": "riport", "says": "sez",
    "said": "sed", "could": "kud", "can": "ken", "may": "mey", "might": "mayt",
    "one": "van", "two": "tu", "three": "tri", "first": "först", "last": "lest",
    "after": "efter", "before": "bifor", "because": "bikoz", "about": "ıbaut",
    "into": "intu", "over": "ouvır", "under": "andır", "between": "bitvin",
    "through": "tru", "treat": "trit", "disease": "dizis",
    // sentences.js — bilim
    "telescope": "teliskoup", "allows": "ılauz", "observe": "ıbzörv",
    "galaxies": "geleksiz", "away": "ıvey", "team": "tim", "deep": "dip",
    "coral": "korıl", "reef": "rif", "contains": "kıntaynz", "species": "spişiz",
    "recorded": "rikordid", "before": "bifor", "experiment": "iksperımınt",
    "produced": "prıdyusd", "results": "rizalts", "surprised": "sırprayzd",
    "entire": "intayır", "climate": "klaymıt", "temperatures": "tempırıçırz",
    "rise": "rayz", "faster": "festır", "earlier": "örliır", "models": "madılz",
    "predicted": "pridiktid", "analyzing": "enılayzing", "ancient": "eynşınt",
    "ice": "ays", "cores": "korz", "reconstruct": "rikınstrakt",
    "patterns": "petırnz", "past": "pest", "hundred": "handrıd",
    "thousand": "tauzınd",
    // sentences.js — çevre
    "plastic": "plestik", "waste": "veyst", "polluting": "pıluting",
    "rivers": "rivırz", "around": "ıraund", "cities": "sitiz",
    "planting": "plenting", "trees": "triz", "reduce": "ridyus", "heat": "hit",
    "improve": "imprurv", "air": "er", "quality": "kvaliti",
    "conservationists": "kınsörveyşınists", "protect": "prıtekt",
    "endangered": "indeyncırd", "habitats": "hebitets", "shrinking": "şrinking",
    "deforestation": "diforısteyşın", "farmers": "farmırz", "adapting": "ıdepting",
    "longer": "longır", "droughts": "drauts", "caused": "kozd",
    "recycling": "risayklıng", "programs": "prougremz", "reduced": "ridyusd",
    "amount": "ımaunt", "sent": "sent", "landfills": "lendfilz",
    "environmental": "invayrınmentıl", "groups": "grups", "calling": "koling",
    "stricter": "striktır", "rules": "rulz", "companies": "kampıniz",
    "release": "rilis", "chemicals": "kemikılz", "local": "loukıl",
    "supplies": "sıplayz",
    // sentences.js — ekonomi
    "central": "sentrıl", "bank": "benk", "decided": "disaydid", "raise": "reyz",
    "interest": "intrist", "month": "mant", "rising": "rayzing",
    "prices": "prayziz", "making": "meyking", "harder": "hardır",
    "families": "femiliz", "afford": "ıford", "basic": "beysik", "goods": "gudz",
    "analysts": "enılists", "expect": "ikspekt", "economy": "ikanımi",
    "slow": "slou", "down": "daun", "consumer": "kınsyumır",
    "spending": "spending", "continues": "kıntinyuz", "weaken": "vikın",
    "company": "kampıni", "reported": "riportid", "strong": "strong",
    "profits": "profits", "despite": "dispayt", "difficult": "difikılt",
    "market": "markıt", "investors": "investırz", "watching": "vaçing",
    "closely": "klousli", "policy": "polısi", "affects": "ıfekts",
    "stock": "stak", "economists": "ikanımists", "prolonged": "prılongd",
    "trade": "treyd", "dispute": "dispyut", "growth": "grout",
    "several": "sevırıl", "major": "meycır", "economies": "ikanımiz",
    // sentences.js — sağlık
    "doctors": "daktırz", "recommend": "rekımend", "least": "list",
    "seven": "sevın", "hours": "aurz", "sleep": "slip", "every": "evri",
    "night": "nayt", "regular": "regyulır", "exercise": "eksırsayz",
    "lower": "louwır", "risk": "risk", "heart": "hart",
    "significantly": "signifikıntli", "balanced": "belınst", "diet": "dayıt",
    "rich": "riç", "vegetables": "vectıbılz", "whole": "houl",
    "grains": "greynz", "supports": "sıports", "term": "törm",
    "energy": "enırci", "getting": "geting", "enough": "inaf", "helps": "helps",
    "brain": "breyn", "recover": "rikavır", "daily": "deyli", "stress": "stres",
    "officials": "ıfişılz", "encouraging": "inkırıcing", "annual": "enyuıl",
    "vaccines": "veksinz", "walk": "vok", "developing": "divelıping",
    "chronic": "kronik", "illness": "ilnıs",
    // longer sentence set — extra vocabulary
    "university": "yunivörsiti", "completely": "kımplitli", "coming": "kaming",
    "space": "speys", "distant": "distınt", "planet": "plenıt",
    "laboratory": "lebırıtôri", "experienced": "ikspiriınst", "members": "membırz",
    "international": "intırneşınıl", "computer": "kımpyutır",
    "originally": "ırıcınıli", "century": "sençıri", "carefully": "kerfıli",
    "taken": "teykın", "detailed": "diteyld", "continues": "kıntinyuz",
    "nearly": "nirli", "every": "evri", "region": "ricın", "today": "tıdey",
    "even": "ivın", "remote": "rimout", "untouched": "antaçt", "areas": "eriız",
    "local": "loukıl", "governments": "gavırnmınts", "streets": "strits",
    "busy": "bizi", "summer": "samır", "clock": "klak", "natural": "neçırıl",
    "steadily": "stedili", "continued": "kıntinyud", "slowly": "slouli",
    "frequent": "frikvınt", "introduced": "intrıdyusd", "household": "haushould",
    "much": "maç", "harmful": "harmfıl", "once": "vans", "again": "ıgen",
    "order": "ordır", "control": "kıntroul", "inflation": "infleyşın",
    "supermarket": "supırmarkıt", "ordinary": "ordıneri", "working": "vörking",
    "everyday": "evridey", "financial": "faynenşıl", "considerably": "kınsidırıbli",
    "technology": "teknolıci", "quarter": "kvortır", "facing": "feysing",
    "uncertain": "ansörtın", "around": "ıraund", "exactly": "igzektli",
    "government": "gavırnmınt", "between": "bitvin", "powers": "pauırz",
    "economic": "ikınamik", "physical": "fizikıl", "serious": "siriıs",
    "fresh": "freş", "quality": "kvaliti", "immune": "imyun", "system": "sistım",
    "properly": "propırli", "human": "hyumın", "life": "layf",
    "actively": "ektivli", "country": "kantri", "winter": "vintır",
    "arrives": "ırayvz", "briskly": "briskli", "noticeably": "noutisıbli",
    "time": "taym",
    // build-up drill vocabulary (sentences.js)
    "wake": "veyk", "family": "femili", "walks": "voks", "best": "best",
    "friend": "frend", "football": "futbol", "catch": "keç", "bus": "bas",
    "evening": "ivning", "finishes": "finişiz", "dinner": "dinır",
    "colleague": "kolig", "quite": "kvayt", "review": "rivyu",
    "notes": "nouts", "spend": "spend", "minutes": "minits",
    "informed": "infôrmd", "events": "ivents", "confidently": "konfidıntli",
    "meetings": "mitingz", "meeting": "miting", "client": "klaynt",
    "began": "bigen", "order": "ordır", "significant": "signifikınt",
    "expresses": "ikspresiz", "fluently": "fluıntli", "considerably": "kınsidırıbli",
    "meticulously": "mitikyulısli", "commenced": "kımenst", "remain": "rimeyn",
    "developments": "divelıpmınts", "remarkable": "rimarkıbıl",
    "fluency": "fluınsi", "confidence": "konfidıns", "negotiations": "nigouşieyşınz",
    "thoroughly": "tarıli", "generally": "ceniralli", "usual": "yujuıl",
    "wanted": "vantıd", "finish": "finiş", "report": "riport",
    "leave": "liv", "started": "startıd", "speaks": "spiks",
    "usually": "yujuıli", "quickly": "kvikli", "reading": "riding",
    "stay": "stey"
  };

  var DIGRAPHS = [
    [/tion\b/g, "şın"], [/sion\b/g, "jın"], [/ture\b/g, "çır"],
    [/ough\b/g, "af"], [/eigh/g, "ey"], [/igh/g, "ay"],
    [/ph/g, "f"], [/qu/g, "kv"], [/ck/g, "k"],
    [/th/g, "t"], [/sh/g, "ş"], [/ch/g, "ç"], [/wh/g, "v"],
    [/ee/g, "i"], [/ea/g, "i"], [/oo/g, "u"], [/ou/g, "au"],
    [/ow/g, "au"], [/oa/g, "o"], [/ai/g, "ey"], [/ay/g, "ey"],
    [/oi/g, "oy"], [/oy/g, "oy"], [/x/g, "ks"], [/j/g, "c"],
    [/w/g, "v"]
  ];

  function heuristic(word) {
    var w = word.toLowerCase();
    // drop a trailing silent 'e'
    w = w.replace(/([^aeiou])e$/, "$1");
    for (var i = 0; i < DIGRAPHS.length; i++) {
      w = w.replace(DIGRAPHS[i][0], DIGRAPHS[i][1]);
    }
    // c -> s before e/i/y, otherwise k
    w = w.replace(/c(?=[eiy])/g, "s").replace(/c/g, "k");
    // g -> c(=/dʒ/) before e/i/y sometimes, otherwise g (rough, imperfect)
    w = w.replace(/g(?=[eiy])/g, "c");
    // y as a vowel mid/end word -> i (keep leading y as consonant)
    w = w.replace(/(.)y/g, "$1i");
    return w;
  }

  function translitWord(raw) {
    var stripped = raw.replace(/[^A-Za-z']/g, "");
    if (!stripped) return "";
    var lower = stripped.toLowerCase();
    var out = EXCEPTIONS.hasOwnProperty(lower) ? EXCEPTIONS[lower] : heuristic(lower);
    if (/^[A-Z]/.test(stripped)) out = out.charAt(0).toUpperCase() + out.slice(1);
    return out;
  }

  function translitSentence(words) {
    return words.map(translitWord).filter(Boolean).join(" ");
  }

  global.Phonetic = { word: translitWord, sentence: translitSentence };
})(window);
