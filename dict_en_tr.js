/*
 * Offline English -> Turkish word dictionary + lookup engine.
 *
 * The idea is the same one Google Translate uses for a single word (look
 * the word up, return its most common translation) but with ZERO network
 * calls: everything lives in this file, bundled into the app, so word
 * translation works with the phone in airplane mode.
 *
 * This is NOT a full machine-translation system — it can't translate a
 * whole sentence with correct grammar the way a real translator can. It's
 * a curated word list (2,108 entries as of v0.09, +147 in v0.13, +61 in
 * v0.14 — 2,316 total, all checked against the full existing list first so
 * nothing silently overwrites an existing sense; see the file's own
 * gotchas below —
 * the most common English words plus the science/health/space/environment
 * vocabulary this app's news articles actually use) plus a light
 * lemmatizer, so "running", "ran" and "runs" all resolve to the same "run"
 * entry instead of needing every inflected form listed by hand.
 *
 * Growing this list is intentionally treated as easy, safe, additive work
 * (§9 of the product spec) — per user direction (2026-08-14), a small new
 * batch should be added on every future content update, following the same
 * method as the v0.13 batch: pull real recurring vocabulary from the
 * app's actual current sources, not guessed "useful words".
 *
 * Lookup order for a word:
 *   1. exact match (lowercased)
 *   2. lemmatized forms (strip -s/-es/-ed/-ing/-ly/-er/-est, undo the
 *      common spelling changes those suffixes cause — "tried" -> "try",
 *      "running" -> "run", "bigger" -> "big")
 *   3. not found -> null (the UI shows "çeviri bulunamadı", never a
 *      network error, since there was never a network call to fail)
 *
 * Multi-word phrases (e.g. a two-word glossary pick) are translated word
 * by word and joined — a rough approximation, same limitation any offline
 * word-list approach has, but still useful for a language learner tapping
 * a word to check its meaning.
 */
(function (global) {
  "use strict";

  var DICT = {};
  function add(obj) { for (var k in obj) if (obj.hasOwnProperty(k)) DICT[k] = obj[k]; }

  // ---- Pronouns & determiners ----
  add({
    "i":"ben","you":"sen","he":"o","she":"o","it":"o","we":"biz","they":"onlar",
    "me":"beni","him":"onu","her":"onu","us":"bizi","them":"onları",
    "my":"benim","your":"senin","his":"onun","its":"onun","our":"bizim","their":"onların",
    "mine":"benimki","yours":"seninki","hers":"onunki","ours":"bizimki","theirs":"onlarınki",
    "myself":"kendim","yourself":"kendin","himself":"kendisi","herself":"kendisi",
    "itself":"kendisi","ourselves":"kendimiz","yourselves":"kendiniz","themselves":"kendileri",
    "who":"kim","whom":"kime","what":"ne","which":"hangi","whose":"kimin",
    "this":"bu","that":"şu","these":"bunlar","those":"şunlar",
    "someone":"biri","somebody":"biri","something":"bir şey","anyone":"herhangi biri",
    "anybody":"herhangi biri","anything":"herhangi bir şey","everyone":"herkes",
    "everybody":"herkes","everything":"her şey","nobody":"hiç kimse","nothing":"hiçbir şey",
    "a":"bir","an":"bir","the":"—","some":"biraz","any":"herhangi","all":"hepsi",
    "each":"her biri","every":"her","other":"diğer","another":"başka bir","such":"böyle",
    "own":"kendi","same":"aynı","no":"hayır","yes":"evet"
  });

  // ---- Prepositions, conjunctions, common adverbs ----
  add({
    "and":"ve","or":"veya","but":"ama","if":"eğer","because":"çünkü","so":"bu yüzden",
    "although":"her ne kadar","though":"yine de","while":"iken","when":"ne zaman",
    "where":"nerede","than":"-den","then":"sonra","now":"şimdi","always":"her zaman",
    "never":"asla","often":"sık sık","sometimes":"bazen","usually":"genellikle",
    "again":"tekrar","also":"ayrıca","too":"de/da","only":"sadece","just":"sadece",
    "even":"hatta","still":"hâlâ","yet":"henüz","already":"zaten","soon":"yakında",
    "later":"daha sonra","before":"önce","after":"sonra","during":"sırasında",
    "since":"-den beri","until":"-e kadar","through":"boyunca","throughout":"boyunca",
    "within":"içinde","without":"olmadan","between":"arasında","among":"arasında",
    "around":"etrafında","about":"hakkında","above":"üstünde","below":"altında",
    "under":"altında","over":"üzerinde","into":"içine","onto":"üzerine","from":"-den",
    "to":"-e","at":"-de","in":"içinde","on":"üzerinde","by":"tarafından","for":"için",
    "with":"ile","of":"-in","off":"kapalı","up":"yukarı","down":"aşağı","near":"yakın",
    "far":"uzak","here":"burada","there":"orada","everywhere":"her yerde",
    "somewhere":"bir yerde","nowhere":"hiçbir yerde","anywhere":"herhangi bir yerde",
    "very":"çok","more":"daha fazla","most":"en fazla","less":"daha az","least":"en az",
    "much":"çok","many":"çok sayıda","few":"az","little":"az","however":"ancak",
    "therefore":"bu nedenle","furthermore":"ayrıca","meanwhile":"bu arada",
    "otherwise":"aksi takdirde","instead":"bunun yerine","despite":"rağmen",
    "regarding":"ile ilgili","according":"göre","across":"karşısında","against":"karşı",
    "along":"boyunca","behind":"arkasında","beside":"yanında","beyond":"ötesinde",
    "toward":"doğru","towards":"doğru","upon":"üzerine","yes":"evet"
  });

  // ---- Numbers & time words ----
  add({
    "one":"bir","two":"iki","three":"üç","four":"dört","five":"beş","six":"altı",
    "seven":"yedi","eight":"sekiz","nine":"dokuz","ten":"on","eleven":"on bir",
    "twelve":"on iki","twenty":"yirmi","thirty":"otuz","forty":"kırk","fifty":"elli",
    "hundred":"yüz","thousand":"bin","million":"milyon","billion":"milyar",
    "first":"ilk","second":"ikinci","third":"üçüncü","last":"son","next":"sonraki",
    "time":"zaman","year":"yıl","day":"gün","week":"hafta","month":"ay","hour":"saat",
    "minute":"dakika","second":"saniye","morning":"sabah","afternoon":"öğleden sonra",
    "evening":"akşam","night":"gece","today":"bugün","yesterday":"dün","tomorrow":"yarın",
    "decade":"on yıl","century":"yüzyıl","moment":"an","period":"dönem","season":"mevsim"
  });

  // ---- Common verbs (base + key inflected forms) ----
  add({
    "be":"olmak","is":"-dir","am":"-im","are":"-sin","was":"idi","were":"idiler",
    "been":"olmuş","being":"olma","have":"sahip olmak","has":"var","had":"vardı",
    "having":"sahip olarak","do":"yapmak","does":"yapar","did":"yaptı","doing":"yapıyor",
    "done":"yapıldı","will":"-ecek","would":"-erdi","can":"yapabilir","could":"yapabilirdi",
    "shall":"-ecek","should":"-meli","may":"-ebilir","might":"-ebilir","must":"-meli",
    "go":"gitmek","goes":"gider","went":"gitti","gone":"gitmiş","going":"gidiyor",
    "come":"gelmek","comes":"gelir","came":"geldi","coming":"geliyor",
    "get":"almak","gets":"alır","got":"aldı","gotten":"almış","getting":"alıyor",
    "make":"yapmak","makes":"yapar","made":"yaptı","making":"yapıyor",
    "take":"almak","takes":"alır","took":"aldı","taken":"alınmış","taking":"alıyor",
    "see":"görmek","sees":"görür","saw":"gördü","seen":"görülmüş","seeing":"görüyor",
    "know":"bilmek","knows":"bilir","knew":"biliyordu","known":"bilinen","knowing":"biliyor",
    "think":"düşünmek","thinks":"düşünür","thought":"düşündü","thinking":"düşünüyor",
    "say":"söylemek","says":"söyler","said":"söyledi","saying":"söylüyor",
    "tell":"anlatmak","tells":"anlatır","told":"anlattı","telling":"anlatıyor",
    "ask":"sormak","asks":"sorar","asked":"sordu","asking":"soruyor",
    "give":"vermek","gives":"verir","gave":"verdi","given":"verilen","giving":"veriyor",
    "find":"bulmak","finds":"bulur","found":"buldu","finding":"buluyor",
    "use":"kullanmak","uses":"kullanır","used":"kullandı","using":"kullanıyor",
    "work":"çalışmak","works":"çalışır","worked":"çalıştı","working":"çalışıyor",
    "call":"aramak","calls":"arar","called":"aradı","calling":"arıyor",
    "try":"denemek","tries":"dener","tried":"denedi","trying":"deniyor",
    "need":"ihtiyaç duymak","needs":"ihtiyaç duyar","needed":"ihtiyaç duydu","needing":"ihtiyaç duyuyor",
    "feel":"hissetmek","feels":"hisseder","felt":"hissetti","feeling":"hissediyor",
    "become":"olmak","becomes":"olur","became":"oldu","becoming":"oluyor",
    "leave":"ayrılmak","leaves":"ayrılır","left":"ayrıldı","leaving":"ayrılıyor",
    "put":"koymak","puts":"koyar","putting":"koyuyor",
    "mean":"anlamına gelmek","means":"anlamına gelir","meant":"anlamına geldi","meaning":"anlam",
    "keep":"tutmak","keeps":"tutar","kept":"tuttu","keeping":"tutuyor",
    "let":"izin vermek","lets":"izin verir","letting":"izin veriyor",
    "begin":"başlamak","begins":"başlar","began":"başladı","begun":"başlamış","beginning":"başlangıç",
    "seem":"görünmek","seems":"görünür","seemed":"göründü","seeming":"görünen",
    "help":"yardım etmek","helps":"yardım eder","helped":"yardım etti","helping":"yardım ediyor",
    "talk":"konuşmak","talks":"konuşur","talked":"konuştu","talking":"konuşuyor",
    "turn":"dönmek","turns":"döner","turned":"döndü","turning":"dönüyor",
    "start":"başlamak","starts":"başlar","started":"başladı","starting":"başlıyor",
    "show":"göstermek","shows":"gösterir","showed":"gösterdi","shown":"gösterilmiş","showing":"gösteriyor",
    "hear":"duymak","hears":"duyar","heard":"duydu","hearing":"duyuyor",
    "play":"oynamak","plays":"oynar","played":"oynadı","playing":"oynuyor",
    "run":"koşmak","runs":"koşar","ran":"koştu","running":"koşuyor",
    "move":"hareket etmek","moves":"hareket eder","moved":"hareket etti","moving":"hareket ediyor",
    "live":"yaşamak","lives":"yaşar","lived":"yaşadı","living":"yaşıyor",
    "believe":"inanmak","believes":"inanır","believed":"inandı","believing":"inanıyor",
    "bring":"getirmek","brings":"getirir","brought":"getirdi","bringing":"getiriyor",
    "happen":"olmak","happens":"olur","happened":"oldu","happening":"oluyor",
    "write":"yazmak","writes":"yazar","wrote":"yazdı","written":"yazılmış","writing":"yazıyor",
    "provide":"sağlamak","provides":"sağlar","provided":"sağladı","providing":"sağlıyor",
    "sit":"oturmak","sits":"oturur","sat":"oturdu","sitting":"oturuyor",
    "stand":"ayakta durmak","stands":"ayakta durur","stood":"ayakta durdu","standing":"ayakta duruyor",
    "lose":"kaybetmek","loses":"kaybeder","lost":"kaybetti","losing":"kaybediyor",
    "pay":"ödemek","pays":"öder","paid":"ödedi","paying":"ödüyor",
    "meet":"buluşmak","meets":"buluşur","met":"buluştu","meeting":"buluşma",
    "include":"içermek","includes":"içerir","included":"içerdi","including":"dahil",
    "continue":"devam etmek","continues":"devam eder","continued":"devam etti","continuing":"devam ediyor",
    "set":"koymak","sets":"koyar","setting":"ortam",
    "learn":"öğrenmek","learns":"öğrenir","learned":"öğrendi","learning":"öğreniyor",
    "change":"değiştirmek","changes":"değiştirir","changed":"değişti","changing":"değişiyor",
    "lead":"yönetmek","leads":"yönetir","led":"yönetti","leading":"öncü",
    "understand":"anlamak","understands":"anlar","understood":"anladı","understanding":"anlayış",
    "watch":"izlemek","watches":"izler","watched":"izledi","watching":"izliyor",
    "follow":"takip etmek","follows":"takip eder","followed":"takip etti","following":"aşağıdaki",
    "stop":"durmak","stops":"durur","stopped":"durdu","stopping":"duruyor",
    "create":"yaratmak","creates":"yaratır","created":"yarattı","creating":"yaratıyor",
    "speak":"konuşmak","speaks":"konuşur","spoke":"konuştu","spoken":"konuşulan","speaking":"konuşuyor",
    "read":"okumak","reads":"okur","reading":"okuyor",
    "allow":"izin vermek","allows":"izin verir","allowed":"izin verdi","allowing":"izin veriyor",
    "add":"eklemek","adds":"ekler","added":"ekledi","adding":"ekliyor",
    "spend":"harcamak","spends":"harcar","spent":"harcadı","spending":"harcıyor",
    "grow":"büyümek","grows":"büyür","grew":"büyüdü","grown":"büyümüş","growing":"büyüyor",
    "open":"açmak","opens":"açar","opened":"açtı","opening":"açılış",
    "walk":"yürümek","walks":"yürür","walked":"yürüdü","walking":"yürüyor",
    "win":"kazanmak","wins":"kazanır","won":"kazandı","winning":"kazanıyor",
    "offer":"sunmak","offers":"sunar","offered":"sundu","offering":"sunuyor",
    "remember":"hatırlamak","remembers":"hatırlar","remembered":"hatırladı","remembering":"hatırlıyor",
    "love":"sevmek","loves":"sever","loved":"sevdi","loving":"seviyor",
    "consider":"düşünmek","considers":"düşünür","considered":"düşündü","considering":"düşünülürse",
    "appear":"görünmek","appears":"görünür","appeared":"göründü","appearing":"görünüyor",
    "buy":"satın almak","buys":"satın alır","bought":"satın aldı","buying":"satın alıyor",
    "wait":"beklemek","waits":"bekler","waited":"bekledi","waiting":"bekliyor",
    "serve":"hizmet etmek","serves":"hizmet eder","served":"hizmet etti","serving":"hizmet ediyor",
    "die":"ölmek","dies":"ölür","died":"öldü","dying":"ölüyor",
    "send":"göndermek","sends":"gönderir","sent":"gönderdi","sending":"gönderiyor",
    "expect":"beklemek","expects":"bekler","expected":"bekledi","expecting":"bekliyor",
    "build":"inşa etmek","builds":"inşa eder","built":"inşa etti","building":"bina",
    "stay":"kalmak","stays":"kalır","stayed":"kaldı","staying":"kalıyor",
    "fall":"düşmek","falls":"düşer","fell":"düştü","fallen":"düşmüş","falling":"düşüyor",
    "cut":"kesmek","cuts":"keser","cutting":"kesiyor",
    "reach":"ulaşmak","reaches":"ulaşır","reached":"ulaştı","reaching":"ulaşıyor",
    "kill":"öldürmek","kills":"öldürür","killed":"öldürdü","killing":"öldürüyor",
    "remain":"kalmak","remains":"kalır","remained":"kaldı","remaining":"kalan",
    "raise":"yükseltmek","raises":"yükseltir","raised":"yükseltti","raising":"yükseltiyor",
    "pass":"geçmek","passes":"geçer","passed":"geçti","passing":"geçiyor",
    "sell":"satmak","sells":"satar","sold":"sattı","selling":"satıyor",
    "increase":"artmak","increases":"artar","increased":"arttı","increasing":"artıyor",
    "decrease":"azalmak","decreases":"azalır","decreased":"azaldı","decreasing":"azalıyor",
    "improve":"geliştirmek","improves":"geliştirir","improved":"geliştirdi","improving":"geliştiriyor",
    "reduce":"azaltmak","reduces":"azaltır","reduced":"azalttı","reducing":"azaltıyor",
    "affect":"etkilemek","affects":"etkiler","affected":"etkiledi","affecting":"etkiliyor",
    "develop":"geliştirmek","develops":"geliştirir","developed":"geliştirdi","developing":"geliştiriyor",
    "explain":"açıklamak","explains":"açıklar","explained":"açıkladı","explaining":"açıklıyor",
    "discover":"keşfetmek","discovers":"keşfeder","discovered":"keşfetti","discovering":"keşfediyor",
    "produce":"üretmek","produces":"üretir","produced":"üretti","producing":"üretiyor",
    "protect":"korumak","protects":"korur","protected":"korudu","protecting":"koruyor",
    "support":"desteklemek","supports":"destekler","supported":"destekledi","supporting":"destekliyor",
    "report":"rapor etmek","reports":"rapor eder","reported":"rapor etti","reporting":"rapor ediyor",
    "announce":"duyurmak","announces":"duyurur","announced":"duyurdu","announcing":"duyuruyor",
    "warn":"uyarmak","warns":"uyarır","warned":"uyardı","warning":"uyarı",
    "suggest":"önermek","suggests":"önerir","suggested":"önerdi","suggesting":"öneriyor",
    "argue":"tartışmak","argues":"tartışır","argued":"tartıştı","arguing":"tartışıyor",
    "agree":"aynı fikirde olmak","agrees":"aynı fikirde","agreed":"kabul etti","agreeing":"kabul ediyor",
    "decide":"karar vermek","decides":"karar verir","decided":"karar verdi","deciding":"karar veriyor",
    "join":"katılmak","joins":"katılır","joined":"katıldı","joining":"katılıyor",
    "release":"yayınlamak","releases":"yayınlar","released":"yayınladı","releasing":"yayınlıyor",
    "avoid":"kaçınmak","avoids":"kaçınır","avoided":"kaçındı","avoiding":"kaçınıyor",
    "cause":"neden olmak","causes":"neden olur","caused":"neden oldu","causing":"neden oluyor",
    "focus":"odaklanmak","focuses":"odaklanır","focused":"odaklandı","focusing":"odaklanıyor",
    "identify":"tanımlamak","identifies":"tanımlar","identified":"tanımladı","identifying":"tanımlıyor",
    "require":"gerektirmek","requires":"gerektirir","required":"gerektirdi","requiring":"gerektiriyor",
    "receive":"almak","receives":"alır","received":"aldı","receiving":"alıyor",
    "remove":"kaldırmak","removes":"kaldırır","removed":"kaldırdı","removing":"kaldırıyor",
    "prevent":"önlemek","prevents":"önler","prevented":"önledi","preventing":"önlüyor",
    "achieve":"başarmak","achieves":"başarır","achieved":"başardı","achieving":"başarıyor",
    "fail":"başarısız olmak","fails":"başarısız olur","failed":"başarısız oldu","failing":"başarısız oluyor",
    "encourage":"teşvik etmek","fund":"finanse etmek","invest":"yatırım yapmak","launch":"başlatmak",
    "measure":"ölçmek","predict":"tahmin etmek","recover":"iyileşmek","respond":"yanıt vermek",
    "reveal":"ortaya çıkarmak","survive":"hayatta kalmak","threaten":"tehdit etmek","treat":"tedavi etmek"
  });

  // ---- Common adjectives ----
  add({
    "good":"iyi","bad":"kötü","big":"büyük","small":"küçük","large":"büyük","little":"küçük",
    "high":"yüksek","low":"düşük","long":"uzun","short":"kısa","old":"eski","new":"yeni",
    "young":"genç","great":"harika","right":"doğru","wrong":"yanlış","different":"farklı",
    "same":"aynı","important":"önemli","easy":"kolay","hard":"zor","difficult":"zor",
    "simple":"basit","hot":"sıcak","cold":"soğuk","warm":"ılık","cool":"serin","fast":"hızlı",
    "slow":"yavaş","early":"erken","late":"geç","strong":"güçlü","weak":"zayıf","rich":"zengin",
    "poor":"fakir","happy":"mutlu","sad":"üzgün","beautiful":"güzel","ugly":"çirkin",
    "clean":"temiz","dirty":"kirli","safe":"güvenli","dangerous":"tehlikeli","healthy":"sağlıklı",
    "sick":"hasta","sure":"emin","certain":"kesin","possible":"mümkün","impossible":"imkânsız",
    "true":"doğru","false":"yanlış","real":"gerçek","fake":"sahte","free":"özgür/ücretsiz",
    "busy":"meşgul","empty":"boş","full":"dolu","heavy":"ağır","light":"hafif","dark":"karanlık",
    "bright":"parlak","quiet":"sessiz","loud":"gürültülü","near":"yakın","far":"uzak",
    "deep":"derin","shallow":"sığ","wide":"geniş","narrow":"dar","thick":"kalın","thin":"ince",
    "sharp":"keskin","dull":"kör","smooth":"pürüzsüz","rough":"pürüzlü","soft":"yumuşak",
    "dry":"kuru","wet":"ıslak","clear":"net","cheap":"ucuz","expensive":"pahalı","modern":"modern",
    "ancient":"antik","public":"kamusal","private":"özel","local":"yerel","national":"ulusal",
    "international":"uluslararası","global":"küresel","social":"sosyal","political":"siyasi",
    "economic":"ekonomik","financial":"finansal","legal":"yasal","illegal":"yasa dışı",
    "medical":"tıbbi","physical":"fiziksel","mental":"zihinsel","natural":"doğal",
    "artificial":"yapay","common":"yaygın","rare":"nadir","normal":"normal","strange":"garip",
    "unusual":"alışılmadık","special":"özel","general":"genel","specific":"özel/belirli",
    "particular":"belirli","whole":"bütün","entire":"tüm","several":"birkaç","various":"çeşitli",
    "similar":"benzer","main":"ana","major":"büyük/önemli","minor":"küçük/önemsiz",
    "central":"merkezi","final":"son","initial":"başlangıç","current":"mevcut","recent":"son",
    "previous":"önceki","future":"gelecek","present":"mevcut/şimdiki","past":"geçmiş",
    "positive":"olumlu","negative":"olumsuz","active":"aktif","passive":"pasif","direct":"doğrudan",
    "indirect":"dolaylı","formal":"resmi","informal":"gayri resmi","serious":"ciddi",
    "funny":"komik","interesting":"ilginç","boring":"sıkıcı","exciting":"heyecan verici",
    "successful":"başarılı","effective":"etkili","efficient":"verimli","significant":"önemli",
    "available":"mevcut","likely":"muhtemel","unlikely":"olası değil","complex":"karmaşık",
    "critical":"kritik","essential":"gerekli","necessary":"gerekli","various":"çeşitli",
    "traditional":"geleneksel","typical":"tipik","huge":"devasa","tiny":"minik","massive":"kocaman",
    "severe":"şiddetli","mild":"hafif","stable":"kararlı","unstable":"kararsız","urgent":"acil",
    "vital":"hayati","valuable":"değerli","reliable":"güvenilir","independent":"bağımsız",
    "aware":"farkında","concerned":"endişeli","confident":"kendinden emin","confused":"kafası karışık"
  });

  // ---- Everyday nouns (people, places, objects) ----
  add({
    "people":"insanlar","person":"kişi","man":"adam","woman":"kadın","child":"çocuk",
    "children":"çocuklar","family":"aile","friend":"arkadaş","home":"ev","house":"ev",
    "room":"oda","city":"şehir","town":"kasaba","country":"ülke","world":"dünya",
    "place":"yer","area":"bölge","way":"yol/yöntem","thing":"şey","part":"parça","case":"durum",
    "point":"nokta","fact":"gerçek","number":"sayı","group":"grup","problem":"sorun",
    "question":"soru","answer":"cevap","word":"kelime","idea":"fikir","story":"hikaye",
    "information":"bilgi","government":"hükümet","company":"şirket","business":"iş",
    "money":"para","job":"iş","life":"hayat","hand":"el","eye":"göz","head":"baş",
    "face":"yüz","body":"vücut","water":"su","food":"yiyecek","air":"hava","fire":"ateş",
    "earth":"dünya/toprak","sun":"güneş","moon":"ay","star":"yıldız","sky":"gökyüzü",
    "tree":"ağaç","animal":"hayvan","dog":"köpek","cat":"kedi","bird":"kuş","fish":"balık",
    "school":"okul","student":"öğrenci","teacher":"öğretmen","book":"kitap","page":"sayfa",
    "name":"isim","door":"kapı","window":"pencere","table":"masa","chair":"sandalye",
    "car":"araba","road":"yol","street":"sokak","bridge":"köprü","river":"nehir",
    "mountain":"dağ","sea":"deniz","ocean":"okyanus","island":"ada","forest":"orman",
    "field":"tarla/alan","garden":"bahçe","park":"park","market":"pazar","shop":"dükkan",
    "store":"mağaza","hospital":"hastane","doctor":"doktor","nurse":"hemşire",
    "patient":"hasta","medicine":"ilaç","disease":"hastalık","health":"sağlık",
    "science":"bilim","scientist":"bilim insanı","research":"araştırma","study":"çalışma",
    "university":"üniversite","president":"başkan","minister":"bakan","law":"kanun",
    "court":"mahkeme","war":"savaş","peace":"barış","army":"ordu","police":"polis",
    "crime":"suç","prison":"hapishane","election":"seçim","vote":"oy","party":"parti",
    "church":"kilise","religion":"din","god":"tanrı","art":"sanat","music":"müzik",
    "film":"film","movie":"film","television":"televizyon","radio":"radyo",
    "newspaper":"gazete","internet":"internet","computer":"bilgisayar","phone":"telefon",
    "technology":"teknoloji","energy":"enerji","power":"güç","light":"ışık","heat":"ısı",
    "weather":"hava durumu","climate":"iklim","environment":"çevre","nature":"doğa",
    "plant":"bitki","seed":"tohum","flower":"çiçek","leaf":"yaprak","root":"kök",
    "wood":"odun","stone":"taş","metal":"metal","gold":"altın","silver":"gümüş",
    "iron":"demir","oil":"petrol","gas":"gaz","coal":"kömür","electricity":"elektrik",
    "machine":"makine","tool":"alet","factory":"fabrika","industry":"sanayi",
    "trade":"ticaret","price":"fiyat","cost":"maliyet","value":"değer","tax":"vergi",
    "bank":"banka","debt":"borç","loan":"kredi","profit":"kâr","loss":"zarar",
    "growth":"büyüme","development":"gelişme","project":"proje","plan":"plan",
    "program":"program","system":"sistem","process":"süreç","method":"yöntem",
    "result":"sonuç","effect":"etki","cause":"neden","reason":"sebep","purpose":"amaç",
    "goal":"hedef","level":"seviye","rate":"oran","size":"boyut","amount":"miktar",
    "percent":"yüzde","half":"yarım","quarter":"çeyrek","piece":"parça","section":"bölüm",
    "chapter":"bölüm","list":"liste","image":"görüntü","picture":"resim","photo":"fotoğraf",
    "video":"video","sound":"ses","voice":"ses","language":"dil","sentence":"cümle",
    "letter":"mektup/harf","message":"mesaj","news":"haber","report":"rapor",
    "article":"makale","magazine":"dergi","author":"yazar","writer":"yazar","reader":"okuyucu",
    "leader":"lider","member":"üye","citizen":"vatandaş","officer":"memur","official":"yetkili",
    "expert":"uzman","professor":"profesör","engineer":"mühendis","worker":"işçi",
    "customer":"müşteri","staff":"personel","team":"takım","community":"topluluk",
    "society":"toplum","culture":"kültür","tradition":"gelenek","history":"tarih",
    "future":"gelecek","century":"yüzyıl","event":"olay","situation":"durum",
    "condition":"koşul","opportunity":"fırsat","challenge":"zorluk","risk":"risk",
    "solution":"çözüm","decision":"karar","choice":"seçim","option":"seçenek"
  });

  // ---- Science, health, environment (news-article vocabulary) ----
  add({
    "climate change":"iklim değişikliği","global warming":"küresel ısınma",
    "greenhouse gas":"sera gazı","emission":"emisyon","emissions":"emisyonlar",
    "carbon":"karbon","pollution":"kirlilik","ecosystem":"ekosistem",
    "biodiversity":"biyoçeşitlilik","species":"tür","extinction":"yok olma",
    "conservation":"koruma","sustainable":"sürdürülebilir","renewable":"yenilenebilir",
    "fossil fuel":"fosil yakıt","wildlife":"vahşi yaşam","habitat":"habitat",
    "drought":"kuraklık","flood":"sel","wildfire":"orman yangını","hurricane":"kasırga",
    "earthquake":"deprem","volcano":"yanardağ","temperature":"sıcaklık",
    "atmosphere":"atmosfer","ozone":"ozon","recycling":"geri dönüşüm",
    "deforestation":"ormansızlaşma","agriculture":"tarım","farming":"çiftçilik",
    "crop":"ürün","harvest":"hasat","vaccine":"aşı","virus":"virüs","bacteria":"bakteri",
    "infection":"enfeksiyon","epidemic":"salgın","pandemic":"pandemi",
    "treatment":"tedavi","therapy":"terapi","surgery":"ameliyat","diagnosis":"teşhis",
    "symptom":"belirti","clinic":"klinik","drug":"ilaç","dose":"doz","cancer":"kanser",
    "diabetes":"şeker hastalığı","obesity":"obezite","nutrition":"beslenme","diet":"diyet",
    "exercise":"egzersiz","stress":"stres","anxiety":"kaygı","depression":"depresyon",
    "sleep":"uyku","brain":"beyin","heart":"kalp","lung":"akciğer","blood":"kan",
    "cell":"hücre","gene":"gen","protein":"protein","immune system":"bağışıklık sistemi",
    "vaccination":"aşılama","outbreak":"salgın","mutation":"mutasyon","genome":"genom",
    "molecule":"molekül","atom":"atom","chemical":"kimyasal","laboratory":"laboratuvar",
    "experiment":"deney","evidence":"kanıt","theory":"teori","discovery":"keşif",
    "innovation":"yenilik","astronomy":"astronomi","planet":"gezegen","galaxy":"galaksi",
    "universe":"evren","telescope":"teleskop","satellite":"uydu","spacecraft":"uzay aracı",
    "gravity":"yerçekimi","radiation":"radyasyon","fossil":"fosil","dinosaur":"dinozor"
  });

  // ---- Economy, business, politics (news-article vocabulary) ----
  add({
    "inflation":"enflasyon","recession":"durgunluk","unemployment":"işsizlik",
    "interest rate":"faiz oranı","stock market":"borsa","investment":"yatırım",
    "currency":"para birimi","export":"ihracat","import":"ithalat","tariff":"gümrük vergisi",
    "budget":"bütçe","deficit":"açık","gdp":"gsyh","economy":"ekonomi",
    "economic growth":"ekonomik büyüme","wage":"ücret","salary":"maaş","income":"gelir",
    "poverty":"yoksulluk","wealth":"zenginlik","corporation":"şirket","startup":"girişim",
    "entrepreneur":"girişimci","shareholder":"hissedar","revenue":"gelir","expense":"gider",
    "merger":"birleşme","bankruptcy":"iflas","subsidy":"sübvansiyon","consumer":"tüketici",
    "supply":"arz","demand":"talep","contract":"sözleşme","negotiation":"müzakere",
    "artificial intelligence":"yapay zeka","robot":"robot","algorithm":"algoritma",
    "data":"veri","cybersecurity":"siber güvenlik","software":"yazılım","hardware":"donanım",
    "democracy":"demokrasi","parliament":"parlamento","congress":"kongre","senate":"senato",
    "prime minister":"başbakan","policy":"politika","regulation":"düzenleme",
    "legislation":"mevzuat","immigration":"göç","refugee":"mülteci",
    "human rights":"insan hakları","protest":"protesto","activist":"aktivist",
    "terrorism":"terörizm","conflict":"çatışma","ceasefire":"ateşkes","treaty":"antlaşma",
    "sanctions":"yaptırımlar","diplomacy":"diplomasi","military":"askeri","weapon":"silah",
    "nuclear":"nükleer","summit":"zirve","alliance":"ittifak","constitution":"anayasa",
    "amendment":"değişiklik","campaign":"kampanya","candidate":"aday","ballot":"oy pusulası"
  });

  // ---- Calendar, directions, places ----------------------------------
  // Added in v0.05: every word in an article became tappable, so coverage
  // stopped being about "the glossary picks" and started being about the
  // actual running text. Measured against a live article, days/months/
  // place names were among the most-tapped misses.
  add({
    "monday":"pazartesi","tuesday":"salı","wednesday":"çarşamba","thursday":"perşembe",
    "friday":"cuma","saturday":"cumartesi","sunday":"pazar",
    "january":"ocak","february":"şubat","march":"mart","april":"nisan",
    "june":"haziran","july":"temmuz","august":"ağustos","september":"eylül",
    "october":"ekim","november":"kasım","december":"aralık",
    "spring":"ilkbahar","summer":"yaz","autumn":"sonbahar","winter":"kış",
    "weekend":"hafta sonu","daily":"günlük","weekly":"haftalık","monthly":"aylık","yearly":"yıllık",
    "north":"kuzey","south":"güney","east":"doğu","west":"batı",
    "northern":"kuzey","southern":"güney","eastern":"doğu","western":"batı",
    "england":"İngiltere","britain":"Britanya","uk":"Birleşik Krallık",
    "scotland":"İskoçya","wales":"Galler","ireland":"İrlanda",
    "europe":"Avrupa","european":"Avrupalı","america":"Amerika","american":"Amerikalı",
    "british":"İngiliz","china":"Çin","chinese":"Çinli","russia":"Rusya","russian":"Rus",
    "india":"Hindistan","japan":"Japonya","germany":"Almanya","german":"Alman",
    "france":"Fransa","french":"Fransız","italy":"İtalya","spain":"İspanya",
    "turkey":"Türkiye","africa":"Afrika","asia":"Asya","australia":"Avustralya",
    "canada":"Kanada","london":"Londra","paris":"Paris","moscow":"Moskova",
    "washington":"Washington","brussels":"Brüksel"
  });

  // ---- High-frequency news nouns ---------------------------------------
  add({
    "record":"rekor","office":"ofis","service":"hizmet","services":"hizmetler",
    "firefighter":"itfaiyeci","heatwave":"sıcak hava dalgası","alert":"uyarı",
    "reservoir":"baraj gölü","blaze":"yangın","average":"ortalama","security":"güvenlik",
    "farmer":"çiftçi","crisis":"kriz","media":"medya","update":"güncelleme",
    "rescue":"kurtarma","crew":"ekip","care":"bakım","agency":"kurum",
    "highway":"otoyol","rain":"yağmur","snow":"kar","storm":"fırtına","wind":"rüzgar",
    "scene":"olay yeri","council":"konsey","pressure":"basınç","impact":"etki",
    "drought":"kuraklık","wildfire":"orman yangını","forecast":"tahmin",
    "warning":"uyarı","emergency":"acil durum","authority":"yetkili makam",
    "authorities":"yetkililer","measure":"önlem","measures":"önlemler",
    "restriction":"kısıtlama","ban":"yasak","target":"hedef","source":"kaynak",
    "spokesman":"sözcü","spokesperson":"sözcü","statement":"açıklama",
    "response":"yanıt","effort":"çaba","damage":"hasar","safety":"güvenlik",
    "threat":"tehdit","issue":"sorun","matter":"konu","subject":"konu",
    "detail":"ayrıntı","example":"örnek","benefit":"fayda","advantage":"avantaj",
    "disadvantage":"dezavantaj","difference":"fark","similarity":"benzerlik",
    "decrease":"azalma","decline":"düşüş","rise":"yükseliş","drop":"düşüş",
    "increase":"artış","change":"değişim","meeting":"toplantı","conference":"konferans",
    "interview":"röportaj","survey":"anket","poll":"anket","record high":"rekor seviye",
    "figure":"rakam","total":"toplam","cost":"maliyet","budget cut":"bütçe kesintisi",
    "deal":"anlaşma","agreement":"anlaşma","approach":"yaklaşım","attempt":"girişim",
    "success":"başarı","failure":"başarısızlık","progress":"ilerleme","delay":"gecikme",
    "accident":"kaza","injury":"yaralanma","victim":"kurban","survivor":"hayatta kalan",
    "witness":"tanık","suspect":"şüpheli","arrest":"tutuklama","trial":"duruşma",
    "evidence":"kanıt","claim":"iddia","charge":"suçlama",
    "border":"sınır","coast":"kıyı","valley":"vadi","desert":"çöl","lake":"göl",
    "village":"köy","neighbourhood":"mahalle","neighborhood":"mahalle",
    "building":"bina","tunnel":"tünel","railway":"demiryolu",
    "airport":"havalimanı","flight":"uçuş","train":"tren","bus":"otobüs",
    "passenger":"yolcu","driver":"sürücü","traffic":"trafik","journey":"yolculuk"
  });

  // ---- High-frequency verbs & adjectives --------------------------------
  add({
    "contain":"içermek","spread":"yayılmak","warn":"uyarmak","declare":"ilan etmek",
    "respond":"yanıt vermek","continue":"devam etmek","remain":"kalmak",
    "involve":"içermek","affect":"etkilemek","climb":"tırmanmak","tackle":"ele almak",
    "face":"yüzleşmek","save":"kurtarmak","manage":"yönetmek","handle":"ele almak",
    "confirm":"doğrulamak","refuse":"reddetmek",
    "prepare":"hazırlamak","arrive":"varmak","enter":"girmek","escape":"kaçmak",
    "return":"dönmek","travel":"seyahat etmek","visit":"ziyaret etmek",
    "check":"kontrol etmek","count":"saymak","fill":"doldurmak","burn":"yanmak",
    "melt":"erimek","freeze":"donmak","shrink":"küçülmek","recover":"iyileşmek",
    "hurt":"incitmek","suffer":"acı çekmek","struggle":"mücadele etmek",
    "survive":"hayatta kalmak","evacuate":"tahliye etmek",
    "extreme":"aşırı","severe":"şiddetli","further":"daha fazla","related":"ilgili",
    "windy":"rüzgarlı","sunny":"güneşli","cloudy":"bulutlu","rainy":"yağmurlu",
    "hottest":"en sıcak","coldest":"en soğuk","warmest":"en sıcak","largest":"en büyük",
    "biggest":"en büyük","smallest":"en küçük","highest":"en yüksek","lowest":"en düşük",
    "worst":"en kötü","best":"en iyi","better":"daha iyi","worse":"daha kötü",
    "tireless":"yorulmak bilmez","ongoing":"süregelen","upcoming":"yaklaşan",
    "unable":"yapamaz","aware":"farkında","alive":"hayatta","asleep":"uykuda",
    "afraid":"korkmuş","angry":"kızgın","tired":"yorgun","hungry":"aç","thirsty":"susamış",
    "ready":"hazır","famous":"ünlü","popular":"popüler","perfect":"mükemmel",
    "terrible":"korkunç","wonderful":"harika","awful":"berbat"
  });

  // ---- Remaining high-frequency function words --------------------------
  add({
    "like":"gibi","both":"her ikisi","most":"çoğu","several":"birkaç","enough":"yeterli",
    "almost":"neredeyse","nearly":"neredeyse","quite":"oldukça","rather":"oldukça",
    "perhaps":"belki","maybe":"belki","probably":"muhtemelen","certainly":"kesinlikle",
    "indeed":"gerçekten","actually":"aslında","really":"gerçekten","truly":"gerçekten",
    "together":"birlikte","alone":"yalnız","apart":"ayrı","instead of":"yerine",
    "because of":"yüzünden","rather than":"yerine","as well":"ayrıca",
    "at least":"en azından","at most":"en fazla","so far":"şimdiye kadar",
    "of course":"tabii ki","in fact":"aslında","for example":"örneğin",
    "such as":"gibi","according to":"göre","as if":"sanki","even if":"olsa bile",
    "unless":"olmadıkça","whether":"olup olmadığı",
    "besides":"ayrıca","meanwhile":"bu arada","otherwise":"aksi halde",
    "anyway":"her neyse","somehow":"bir şekilde","together with":"ile birlikte"
  });

  // ---- Core basics -----------------------------------------------------
  // Gaps found by measuring live-article coverage in v0.05: words this
  // basic ("not", "out", "how", "once", "end") were missing simply because
  // the original list was built around the glossary's academic picks, not
  // around ordinary running text.
  add({
    "not":"değil","out":"dışarı","how":"nasıl","why":"neden","once":"bir kez",
    "twice":"iki kez","end":"son","start":"başlangıç","due":"dolayı","site":"alan",
    "region":"bölge","potential":"olası","alongside":"yanında","rainfall":"yağış",
    "flash":"ani","engine":"motor","vehicle":"araç","landscape":"manzara",
    "experience":"deneyim","ago":"önce","back":"geri","front":"ön","top":"üst",
    "bottom":"alt","side":"yan","middle":"orta","edge":"kenar","corner":"köşe",
    "able":"yapabilen","close":"kapatmak","break":"kırmak","broken":"kırık",
    "chosen":"seçilmiş","driven":"sürülmüş","forgotten":"unutulmuş","hidden":"gizli",
    "eaten":"yenmiş","risen":"yükselmiş","held":"tutuldu","led":"yönetti",
    "thirteen":"on üç","fourteen":"on dört","fifteen":"on beş","sixteen":"on altı",
    "seventeen":"on yedi","eighteen":"on sekiz","nineteen":"on dokuz",
    "sixty":"altmış","seventy":"yetmiş","eighty":"seksen","ninety":"doksan",
    "fifth":"beşinci","sixth":"altıncı","seventh":"yedinci","eighth":"sekizinci",
    "ninth":"dokuzuncu","tenth":"onuncu",
    "north-east":"kuzeydoğu","north-west":"kuzeybatı","south-east":"güneydoğu",
    "south-west":"güneybatı","mile":"mil","kilometre":"kilometre","kilometer":"kilometre",
    "metre":"metre","meter":"metre","degree":"derece","celsius":"santigrat",
    "tonne":"ton","ton":"ton","litre":"litre","liter":"litre","kilogram":"kilogram",
    "fuel":"yakıt","smoke":"duman","flame":"alev","ash":"kül","spark":"kıvılcım",
    "chief":"şef","breakdown":"çöküş","course":"seyir","midnight":"gece yarısı",
    "midday":"öğlen","noon":"öğlen","dawn":"şafak","dusk":"alacakaranlık",
    "sunrise":"gün doğumu","sunset":"gün batımı","heathland":"fundalık",
    "moorland":"kırlık","woodland":"ormanlık","farmland":"tarım arazisi",
    "coastline":"kıyı şeridi","hillside":"yamaç","riverbank":"nehir kıyısı"
  });

  // ════════════════════════════════════════════════════════════════════
  // v0.07 expansion — driven by measurement, not guesswork.
  //
  // Coverage was measured over a 12-article, ~12,500-token corpus pulled
  // from the app's own live feeds, and the misses were ranked by how often
  // they actually appeared. Everything below comes from the top of that
  // list, plus the general vocabulary around it. Proper nouns and
  // abbreviations (BST, PM, IG, Heathrow, Hormuz) dominate the long tail
  // and are deliberately left out — a bilingual word list is the wrong
  // tool for those.
  // ════════════════════════════════════════════════════════════════════

  // ---- Irregular forms the lemmatizer can't derive -----------------------
  // The lemmatizer strips regular endings (-s/-ed/-ing/-ly), so a singular
  // or base verb covers most inflections automatically. These don't follow
  // those rules, so they have to be listed outright.
  add({
    "women":"kadınlar","men":"erkekler","children":"çocuklar",
    "feet":"ayaklar","teeth":"dişler","mice":"fareler",
    "rose":"yükseldi","risen":"yükselmiş","fell":"düştü",
    "sold":"sattı","held":"tuttu","kept":"tuttu","left":"ayrıldı","lost":"kaybetti",
    "meant":"demek istedi","sent":"gönderdi","spent":"harcadı","built":"inşa etti",
    "caught":"yakaladı","taught":"öğretti","brought":"getirdi","bought":"satın aldı",
    "sought":"aradı","fought":"savaştı","chose":"seçti","drove":"sürdü",
    "wrote":"yazdı","spoke":"konuştu","broke":"kırdı","stole":"çaldı",
    "flew":"uçtu","drew":"çizdi","threw":"attı","blew":"esti","grew":"büyüdü"
  });

  // ---- Business, finance, work ------------------------------------------
  add({
    "investor":"yatırımcı","share":"hisse","treasury":"hazine","cash":"nakit",
    "cashflow":"nakit akışı","fund":"fon","firm":"firma","executive":"yönetici",
    "analyst":"analist","sale":"satış","property":"mülk","asset":"varlık",
    "mortgage":"ipotek","pension":"emeklilik maaşı","insurance":"sigorta",
    "bill":"fatura","fee":"ücret","discount":"indirim","refund":"geri ödeme",
    "interest":"faiz","dividend":"temettü","turnover":"ciro","output":"üretim",
    "expansion":"genişleme","acquisition":"satın alma","lobbying":"lobicilik",
    "financing":"finansman","funding":"finansman","platform":"platform",
    "brand":"marka","retail":"perakende","wholesale":"toptan","supplier":"tedarikçi",
    "client":"müşteri","partnership":"ortaklık","employer":"işveren",
    "employee":"çalışan","colleague":"meslektaş","bonus":"prim","strike":"grev",
    "union":"sendika","vacancy":"açık pozisyon","career":"kariyer",
    "barrel":"varil","crude":"ham petrol","commodity":"emtia"
  });

  // ---- Health, body, life events ----------------------------------------
  add({
    "birth":"doğum","death":"ölüm","maternity":"doğum (izni)","pregnant":"hamile",
    "pregnancy":"hamilelik","midwife":"ebe","surgeon":"cerrah","injection":"iğne",
    "scan":"tarama","wound":"yara","bone":"kemik","muscle":"kas","skin":"cilt",
    "liver":"karaciğer","kidney":"böbrek","stomach":"mide","nerve":"sinir",
    "tissue":"doku","recovery":"iyileşme","pain":"ağrı","fever":"ateş",
    "cough":"öksürük","illness":"hastalık","injury":"yaralanma",
    "disability":"engellilik","lifespan":"yaşam süresi","ageing":"yaşlanma",
    "mummy":"mumya","mummified":"mumyalanmış","skeleton":"iskelet"
  });

  // ---- Everyday high-frequency nouns ------------------------------------
  add({
    "human":"insan","hotel":"otel","holiday":"tatil","tourist":"turist",
    "trip":"gezi","guest":"misafir","host":"ev sahibi","seat":"koltuk",
    "airline":"havayolu","luggage":"bagaj","ticket":"bilet","scale":"ölçek",
    "range":"aralık","limit":"sınır","key":"anahtar","view":"görüş",
    "action":"eylem","concern":"endişe","confidence":"güven","trust":"güven",
    "ability":"yetenek","skill":"beceri","chance":"şans","choice":"seçim",
    "habit":"alışkanlık","pump":"pompa","device":"cihaz","screen":"ekran",
    "battery":"pil","cable":"kablo","network":"ağ","signal":"sinyal",
    "spot":"yer","wall":"duvar","roof":"çatı","floor":"zemin","gate":"kapı",
    "fence":"çit","path":"patika","track":"iz","route":"güzergah",
    "academic":"akademisyen","lecture":"ders","campus":"kampüs",
    "eclipse":"tutulma","orbit":"yörünge","comet":"kuyruklu yıldız",
    "solar":"güneş","lunar":"ay","cup":"kupa","match":"maç","tournament":"turnuva"
  });

  // ---- Common verbs still missing ---------------------------------------
  add({
    "look":"bakmak","hit":"vurmak","deliver":"teslim etmek","lift":"kaldırmak",
    "jump":"atlamak","compare":"karşılaştırmak","describe":"tanımlamak",
    "estimate":"tahmin etmek","publish":"yayımlamak","control":"kontrol etmek",
    "worry":"endişelenmek","hope":"ummak","wish":"dilemek","thank":"teşekkür etmek",
    "agree":"katılmak","refuse":"reddetmek","accept":"kabul etmek",
    "admit":"itiraf etmek","argue":"tartışmak","insist":"ısrar etmek",
    "suggest":"önermek","promise":"söz vermek","prepare":"hazırlamak",
    "arrange":"düzenlemek","organise":"düzenlemek","organize":"düzenlemek",
    "celebrate":"kutlamak","attend":"katılmak","invite":"davet etmek",
    "push":"itmek","pull":"çekmek","throw":"atmak","catch":"yakalamak",
    "touch":"dokunmak","wear":"giymek","cook":"pişirmek","clean":"temizlemek",
    "wash":"yıkamak","repair":"tamir etmek","replace":"değiştirmek",
    "install":"kurmak","measure":"ölçmek","count":"saymak","weigh":"tartmak",
    "cover":"kaplamak","search":"aramak","choose":"seçmek","decide":"karar vermek",
    "aim":"hedeflemek","secure":"güvence altına almak"
  });

  // ---- Adjectives & adverbs ---------------------------------------------
  add({
    "green":"yeşil","blue":"mavi","red":"kırmızı","black":"siyah","white":"beyaz",
    "grey":"gri","gray":"gri","brown":"kahverengi","yellow":"sarı",
    "extra":"ekstra","temporary":"geçici","permanent":"kalıcı","powerful":"güçlü",
    "intense":"yoğun","vast":"engin","calm":"sakin","fair":"adil",
    "unfair":"adaletsiz","costly":"pahalı","valuable":"değerli",
    "useless":"işe yaramaz","useful":"faydalı","harmful":"zararlı",
    "harmless":"zararsız","resilient":"dayanıklı","fragile":"kırılgan",
    "urgent":"acil","ever":"hiç","especially":"özellikle","mainly":"esasen",
    "mostly":"çoğunlukla","partly":"kısmen","entirely":"tamamen","fully":"tamamen",
    "hardly":"neredeyse hiç","barely":"zar zor","clearly":"açıkça",
    "widely":"geniş çapta","ahead":"önde","behind":"geride","abroad":"yurt dışında",
    "inside":"içeride","outside":"dışarıda","elsewhere":"başka yerde",
    "forward":"ileri","backward":"geri"
  });

  // ---- Countries & nationalities still missing ---------------------------
  add({
    "iran":"İran","iranian":"İranlı","iraq":"Irak","israel":"İsrail",
    "ukraine":"Ukrayna","poland":"Polonya","greece":"Yunanistan",
    "netherlands":"Hollanda","dutch":"Hollandalı","sweden":"İsveç",
    "norway":"Norveç","denmark":"Danimarka","finland":"Finlandiya",
    "switzerland":"İsviçre","austria":"Avusturya","belgium":"Belçika",
    "portugal":"Portekiz","brazil":"Brezilya","mexico":"Meksika",
    "argentina":"Arjantin","egypt":"Mısır","nigeria":"Nijerya",
    "pakistan":"Pakistan","indonesia":"Endonezya","korea":"Kore",
    "vietnam":"Vietnam","thailand":"Tayland","canadian":"Kanadalı",
    "australian":"Avustralyalı","indian":"Hintli","japanese":"Japon",
    "spanish":"İspanyol","italian":"İtalyan","scottish":"İskoç",
    "welsh":"Galli","irish":"İrlandalı","artificial intelligence":"yapay zeka"
  });

  // ---- Final gap-fill from the second measurement pass -------------------
  // Comparative/superlative forms of words ending in -y are the notable
  // one here: the lemmatizer turns "earlier" into "earli"/"earlie", never
  // "early", so these need listing even though their base form is present.
  add({
    "earlier":"daha erken","earliest":"en erken","busiest":"en yoğun",
    "easier":"daha kolay","easiest":"en kolay","heavier":"daha ağır",
    "happier":"daha mutlu","healthier":"daha sağlıklı","wealthier":"daha zengin",
    "drier":"daha kuru","angrier":"daha kızgın",
    "transport":"ulaşım","reserve":"rezerv","online":"çevrimiçi",
    "offline":"çevrimdışı","infrastructure":"altyapı","electric":"elektrikli",
    "electricity":"elektrik","resilience":"dayanıklılık","labour":"emek",
    "labor":"emek","amber":"kehribar","strait":"boğaz","per":"başına",
    "mid":"orta","peak":"zirve","rate":"oran","level":"seviye",
    "wave":"dalga","tide":"gelgit","stream":"akıntı","current":"akım"
  });

  // Abbreviations that are real vocabulary a learner needs, as opposed to
  // the ones deliberately left out (BST, IG, PA — publication furniture and
  // wire-service tags, not words).
  add({
    // NOT "am": the dictionary already has it as the verb ("I am"), and a
    // later key silently overwrites an earlier one — adding the clock sense
    // would break every "I am" lookup. Same reason "us" isn't mapped to USA.
    "ai":"yapay zeka","ceo":"genel müdür","eu":"Avrupa Birliği",
    "un":"Birleşmiş Milletler","nhs":"İngiltere sağlık servisi",
    "bn":"milyar","pm":"öğleden sonra","vs":"karşı"
  });

  // ════════════════════════════════════════════════════════════════════
  // v0.09 expansion — same measure-don't-guess methodology as v0.07.
  //
  // The app's source mix changed in v0.09 (more science feeds: MIT News,
  // NASA, New Scientist, extra ScienceDaily categories — see app.js), so
  // coverage was re-measured against a fresh ~140,000-token corpus pulled
  // from every one of the app's current live feeds, and misses were
  // ranked by real frequency the same way as before. 1,937 -> 2,108
  // entries. Only BASE forms are added below wherever the app's own
  // lemmatizer (see lookupWord/lemmaCandidates further down this file)
  // already derives the inflected form for free — e.g. adding "researcher"
  // also covers "researchers", adding "detect" also covers "detected" and
  // "detecting", adding "exist" also covers "existing". Adjectives ending
  // in -al/-ic/-ive (environmental, atmospheric, genetic…) aren't
  // derivable by the lemmatizer from their noun, so those are listed
  // explicitly. As before, proper nouns and publication artifacts (paper
  // author surnames, institution abbreviations, HTML/RSS markup leftovers)
  // dominated the long tail of misses and were left out on purpose.
  // ════════════════════════════════════════════════════════════════════

  // ---- Research & institutions ----
  add({
    "researcher":"araştırmacı","institute":"enstitü","department":"bölüm",
    "foundation":"vakıf","framework":"çerçeve","collaboration":"işbirliği",
    "journal":"bilimsel dergi","review":"inceleme","access":"erişim",
    "content":"içerik","monitor":"izlemek","apply":"uygulamak","exist":"var olmak",
    "solve":"çözmek","explore":"keşfetmek","explanation":"açıklama",
    "accuracy":"doğruluk","sensitive":"hassas","detect":"tespit etmek",
    "breakthrough":"çığır açan buluş","mission":"görev","observatory":"gözlemevi",
    "astronomer":"gökbilimci","astronaut":"astronot","element":"element",
    "component":"bileşen","structure":"yapı","surface":"yüzey","sample":"örnek",
    "feature":"özellik","resource":"kaynak","quality":"kalite","boundary":"sınır",
    "sensor":"sensör","production":"üretim","industrial":"endüstriyel",
    "function":"işlev","communication":"iletişim","consequence":"sonuç",
    "height":"yükseklik","application":"uygulama","design":"tasarım",
    "experimental":"deneysel","optimization":"optimizasyon","technique":"teknik",
    "demonstrate":"göstermek","generate":"üretmek","factor":"faktör",
    "rapid":"hızlı","personal":"kişisel","simulate":"simüle etmek",
    "perform":"gerçekleştirmek","rely":"güvenmek","easily":"kolayca",
    "direction":"yön","emerge":"ortaya çıkmak","advance":"ilerlemek",
    "contact":"temas","interact":"etkileşime girmek","concrete":"somut",
    "vertical":"dikey","physicist":"fizikçi","proton":"proton","addition":"ekleme",
    "ion":"iyon","dna":"dna","assistant":"asistan","tech":"teknoloji",
    "specifically":"özellikle","vein":"damar","egg":"yumurta","fly":"uçmak",
    "clock":"saat"
  });

  // ---- Physical & natural sciences ----
  add({
    "material":"malzeme","model":"model","quantum":"kuantum","physics":"fizik",
    "electron":"elektron","magnetic":"manyetik","generation":"nesil",
    "chemistry":"kimya","density":"yoğunluk","force":"kuvvet","mass":"kütle",
    "core":"çekirdek","atomic":"atomik","laser":"lazer","molecular":"moleküler",
    "environmental":"çevresel","infrared":"kızılötesi","manufacturing":"imalat",
    "measurement":"ölçüm","cm":"santimetre","mm":"milimetre","oxygen":"oksijen",
    "nitrogen":"azot","hydrogen":"hidrojen","plasma":"plazma","crystal":"kristal",
    "liquid":"sıvı","print":"yazdırmak","giant":"dev","location":"konum",
    "stage":"aşama","reactor":"reaktör","atmospheric":"atmosferik",
    "digital":"dijital","lithium":"lityum","particle":"parçacık",
    "frequency":"frekans","resistance":"direnç","interface":"arayüz","mind":"zihin",
    "computation":"hesaplama","computational":"hesaplamalı","circuit":"devre",
    "semiconductor":"yarı iletken","dimensional":"boyutlu"
  });

  // ---- Health & body ----
  add({
    "tumor":"tümör","tumour":"tümör","dementia":"demans","immune":"bağışık",
    "visible":"görünür"
  });

  // ---- Everyday & general vocabulary ----
  add({
    "role":"rol","ground":"zemin","self":"kendi","line":"çizgi","post":"gönderi",
    "class":"sınıf","age":"yaş","term":"terim","kind":"tür","carry":"taşımak",
    "step":"adım","hold":"tutmak","zero":"sıfır","plastic":"plastik",
    "color":"renk","colour":"renk","united":"birleşik","farm":"çiftlik",
    "cannot":"yapamaz","either":"ikisinden biri","internal":"iç","task":"görev",
    "vision":"görüş","precise":"kesin","resolution":"çözünürlük",
    "individual":"birey","technical":"teknik","education":"eğitim",
    "specialized":"uzmanlaşmış","practical":"pratik","ordinary":"sıradan",
    "everyday":"günlük","enormous":"muazzam","mysterious":"gizemli",
    "mystery":"gizem","clue":"ipucu","broad":"geniş","separate":"ayrı",
    "relatively":"nispeten","instance":"örnek","genetic":"genetik",
    "urban":"kentsel","dynamic":"dinamik","dense":"yoğun","motion":"hareket",
    "movement":"hareket","simply":"basitçe","phd":"doktora"
  });

  // ---- v0.13 additions (change list follow-up: "expand the dictionary a
  // bit with every update from now on") — measured against real, current
  // NASA / Science News Explores articles (the two sources kept in the
  // v0.13 source-pipeline overhaul), the same way every prior expansion in
  // this file's history was: pull real running text, find the misses, add
  // the ones that actually recur. Every key below was checked against the
  // full existing DICT first (see the file-header note on silent
  // overwrites) — none of these collide with an existing entry. ----
  // Space, earth science & geology
  add({
    "exoplanet":"öte gezegen","asteroid":"asteroit","nebula":"bulutsu",
    "supernova":"süpernova","habitable":"yaşanabilir","rover":"gezici araç",
    "booster":"güçlendirici","crater":"krater","eruption":"patlama",
    "seismic":"sismik","glacier":"buzul","sea level":"deniz seviyesi",
    "ice sheet":"buz tabakası","permafrost":"permafrost",
    "stratosphere":"stratosfer","troposphere":"troposfer","tsunami":"tsunami",
    "tectonic":"tektonik","mantle":"manto","magma":"magma","mineral":"mineral",
    "excavation":"kazı","artifact":"eser","civilization":"medeniyet",
    "prehistoric":"tarih öncesi","extinct":"soyu tükenmiş"
  });
  // Environment, climate & ecology
  add({
    "predator":"yırtıcı","prey":"av","migration":"göç","coral":"mercan",
    "reef":"resif","bleaching":"ağarma","sediment":"tortu","erosion":"erozyon",
    "sustainability":"sürdürülebilirlik","greenhouse":"sera",
    "pollutant":"kirletici","contamination":"kirlenme",
    "renewable energy":"yenilenebilir enerji","carbon dioxide":"karbondioksit",
    "evolve":"evrim geçirmek","evolution":"evrim","adaptation":"uyum",
    "survival":"hayatta kalma","vulnerability":"kırılganlık",
    "exposure":"maruz kalma","hazard":"tehlike","disaster":"felaket"
  });
  // Biology, medicine & the mind
  add({
    "biologist":"biyolog","geneticist":"genetikçi",
    "neuroscientist":"nörobilimci","epidemiologist":"epidemiyolog",
    "psychiatrist":"psikiyatrist","psychologist":"psikolog",
    "therapist":"terapist","clinician":"klinisyen","prescription":"reçete",
    "disorder":"bozukluk","neurotype":"nörotip","concentration":"konsantrasyon",
    "attention":"dikkat","hyperactivity":"aşırı hareketlilik",
    "inherited":"kalıtsal","inheritance":"kalıtım","chromosome":"kromozom",
    "enzyme":"enzim","antibody":"antikor","immunity":"bağışıklık",
    "pathogen":"patojen","bacterium":"bakteri","microbe":"mikrop",
    "organ":"organ","neuron":"nöron","cognitive":"bilişsel",
    "behavior":"davranış","behaviour":"davranış","trait":"özellik",
    "questionnaire":"anket","accommodation":"uyarlama",
    "evaluate":"değerlendirmek","assess":"değerlendirmek",
    "assessment":"değerlendirme","diagnose":"teşhis koymak",
    "medication":"ilaç","clinical":"klinik","rehabilitation":"rehabilitasyon"
  });
  // Research, method & academia
  add({
    "hypothesis":"hipotez","grant":"hibe","peer-reviewed":"hakemli",
    "citation":"atıf","methodology":"yöntembilim","statistic":"istatistik",
    "percentage":"yüzde oranı","correlation":"korelasyon",
    "causation":"nedensellik","variable":"değişken","outcome":"sonuç",
    "influence":"etki","strategy":"strateji","mechanism":"mekanizma",
    "composition":"bileşim","compound":"bileşik","reaction":"reaksiyon",
    "catalyst":"katalizör","substance":"madde","wavelength":"dalga boyu",
    "instrument":"alet","equipment":"ekipman","prototype":"prototip",
    "prototype testing":"prototip testi","simulation":"simülasyon",
    "prediction":"tahmin","proportion":"oran","threshold":"eşik",
    "capacity":"kapasite","shortage":"kıtlık","surplus":"fazlalık",
    "efficiency":"verimlilik","volunteer":"gönüllü","initiative":"girişim",
    "funding agency":"fon kuruluşu","nonprofit":"kâr amacı gütmeyen",
    "organization":"organizasyon","committee":"komite","panel":"panel",
    "board":"kurul","guideline":"kılavuz","standard":"standart",
    "protocol":"protokol","compliance":"uyumluluk",
    "certification":"sertifikasyon","license":"lisans","patent":"patent",
    "copyright":"telif hakkı","intellectual property":"fikri mülkiyet",
    "paleontologist":"paleontolog","archaeologist":"arkeolog",
    "field trip":"saha gezisi","classroom":"sınıf","curriculum":"müfredat",
    "elementary":"ilkokul","middle school":"ortaokul","high school":"lise",
    "graduate":"mezun","undergraduate":"lisans öğrencisi",
    "scholarship":"burs","tuition":"öğrenim ücreti"
  });

  // v0.14 additions — same method as v0.13's batch: real recurring
  // vocabulary from the app's current live sources, this time weighted
  // toward the two new v0.14 sources' actual beats (Grist = environment/
  // climate-policy journalism, KFF Health News = health-policy/healthcare-
  // system journalism), checked against the full existing list first (61
  // new entries, 6 candidates dropped as already-present: budget,
  // disability, income, insurance, legislation, subsidy).
  add({
    "insurer":"sigortacı","premium":"prim","coverage":"kapsam","uninsured":"sigortasız",
    "copay":"hasta katkı payı","deductible":"muafiyet tutarı","reimbursement":"geri ödeme",
    "hospice":"bakımevi","caregiver":"bakıcı","nursing home":"huzurevi","wristband":"bileklik",
    "childbirth":"doğum","maternal":"anneyle ilgili","pediatric":"çocuk hastalıklarıyla ilgili",
    "opioid":"opioid","addiction":"bağımlılık","overdose":"aşırı doz","screening":"tarama",
    "lung cancer":"akciğer kanseri","smoking":"sigara içme","policy maker":"politika yapıcı",
    "lawmaker":"yasa koyucu","advocate":"savunucu","advocacy":"savunuculuk",
    "nonpartisan":"tarafsız","watchdog":"gözetim kuruluşu","regulator":"düzenleyici kurum",
    "loophole":"yasal boşluk","tax credit":"vergi indirimi","solar panel":"güneş paneli",
    "wind turbine":"rüzgar türbini","electric vehicle":"elektrikli araç",
    "grid":"elektrik şebekesi","utility":"kamu hizmeti şirketi","pipeline":"boru hattı",
    "drilling":"sondaj","offshore":"kıyı ötesi","refinery":"rafineri","methane":"metan",
    "wetland":"sulak alan","floodplain":"taşkın ovası","watershed":"su havzası",
    "groundwater":"yeraltı suyu","runoff":"yüzey akışı","landfill":"çöp sahası",
    "composting":"kompostlama","biodegradable":"biyolojik olarak parçalanabilir",
    "overfishing":"aşırı avlanma","poaching":"yasadışı avlanma","indigenous":"yerli",
    "tribal":"kabile ile ilgili","displacement":"yerinden edilme",
    "resettlement":"yeniden yerleşim","frontline community":"ön saf topluluğu",
    "environmental justice":"çevresel adalet","heat wave":"sıcak hava dalgası",
    "wildfire smoke":"orman yangını dumanı","air quality":"hava kalitesi",
    "particulate":"partikül madde","asthma":"astım","allergen":"alerjen"
  });

  // Multi-word phrase keys above (e.g. "climate change") are matched first,
  // before falling back to single-word lookup.
  var PHRASES = Object.keys(DICT).filter(function (k) { return k.indexOf(" ") !== -1; })
    .sort(function (a, b) { return b.length - a.length; });

  // ---- Light lemmatizer: turn an inflected form into candidate stems ----
  function lemmaCandidates(w) {
    var out = [w];
    if (/ies$/.test(w)) out.push(w.slice(0, -3) + "y");
    if (/([^aeiou])es$/.test(w)) out.push(w.slice(0, -2));
    if (/s$/.test(w) && !/ss$/.test(w)) out.push(w.slice(0, -1));
    if (/ing$/.test(w)) {
      var stem = w.slice(0, -3);
      out.push(stem, stem + "e");
      if (/([b-df-hj-np-tv-z])\1$/.test(stem)) out.push(stem.slice(0, -1)); // running -> run
    }
    if (/ed$/.test(w)) {
      var stem2 = w.slice(0, -2);
      out.push(stem2, stem2 + "e");
      if (/([b-df-hj-np-tv-z])\1$/.test(stem2)) out.push(stem2.slice(0, -1)); // stopped -> stop
    }
    if (/ied$/.test(w)) out.push(w.slice(0, -3) + "y"); // tried -> try
    if (/ly$/.test(w)) out.push(w.slice(0, -2));
    if (/est$/.test(w)) {
      var stem3 = w.slice(0, -3); // biggest -> "bigg"
      out.push(stem3, w.slice(0, -2));
      if (/([b-df-hj-np-tv-z])\1$/.test(stem3)) out.push(stem3.slice(0, -1)); // "bigg" -> "big"
    }
    if (/er$/.test(w)) {
      var stem4 = w.slice(0, -2); // bigger -> "bigg"
      out.push(stem4, w.slice(0, -1));
      if (/([b-df-hj-np-tv-z])\1$/.test(stem4)) out.push(stem4.slice(0, -1)); // "bigg" -> "big"
    }
    return out;
  }

  function lookupWord(rawWord) {
    var w = String(rawWord || "").toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, "");
    if (!w) return null;
    if (DICT.hasOwnProperty(w)) return DICT[w];
    var candidates = lemmaCandidates(w);
    for (var i = 0; i < candidates.length; i++) {
      if (DICT.hasOwnProperty(candidates[i])) return DICT[candidates[i]];
    }
    return null;
  }

  // Translates a word OR a short phrase. Phrases first try a whole-phrase
  // dictionary hit (e.g. "climate change"), then fall back to translating
  // word-by-word and joining — a rough approximation, not real grammar.
  function translate(text) {
    var raw = String(text || "").trim();
    if (!raw) return null;
    var lower = raw.toLowerCase();
    for (var i = 0; i < PHRASES.length; i++) {
      if (lower === PHRASES[i]) return DICT[PHRASES[i]];
    }
    var words = raw.split(/\s+/);
    if (words.length === 1) return lookupWord(words[0]);
    var parts = words.map(lookupWord);
    if (parts.every(function (p) { return !p; })) return null; // nothing recognized at all
    return parts.map(function (p, i) { return p || words[i]; }).join(" ");
  }

  global.OfflineTranslate = { translate: translate, wordCount: Object.keys(DICT).length };
})(window);
