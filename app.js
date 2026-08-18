(function () {
  "use strict";

  // App version — bump by 0.01 on every release (0.01 -> 0.02 -> ...).
  // Shown in the bottom-right corner badge (all screens) and, together
  // with CHANGELOG below, in Settings → Hakkında. Add a new entry here
  // (newest first) every time APP_VERSION changes — this is the single
  // source both the badge and the About screen's changelog read from.
  var APP_VERSION = "0.14.13";
  // Local data-format version — bumped whenever the *shape* of what's
  // stored in localStorage changes in a way a future migration might need
  // to know about (change list §18). Reads are always safe-fallback
  // regardless (see Store/K below), so this is informational/forward-
  // looking only — nothing here performs a destructive migration.
  var DATA_SCHEMA_VERSION = 1;
  var CHANGELOG = [
    {
      version: "0.14.13", notes: [
        "İçerik güncellemeleri artık otomatik: uygulama her açılışta arka planda kendiliğinden kontrol edip uyguluyor, \"Güncellemeleri Kontrol Et\"e basmaya gerek yok (buton yine de Ayarlar'da duruyor, isteyen anlık sonuç görebilir). Ana ekranın sağ üstüne bir bildirim zili eklendi — \"Bizden Gelenler\"e yeni gelen yazılar orada rozetle gösteriliyor, dokunulunca liste açılıyor ve bir yazıya dokunmak onu doğrudan açıyor. Ayrıca ilk açılışı yavaşlatabilen Safe Browsing kontrolü bu WebView için kapatıldı."
      ]
    },
    {
      version: "0.14.12", notes: [
        "\"Bizden Gelenler\"e altıncı yazı eklendi: \"Microplastics and Plants: When Pollution Becomes a Biological Signal\" (Part 6). Bu sürüm YENİ BİR APK OLMADAN, doğrudan İçerik Güncellemeleri üzerinden geldi — v0.14.11'deki WebViewAssetLoader düzeltmesinden sonraki ilk gerçek test."
      ]
    },
    {
      version: "0.14.11", notes: [
        "İçerik Güncellemeleri'nin GERÇEK kök nedeni bulundu ve düzeltildi: uygulama şimdiye kadar dosyaları file:///android_asset/ üzerinden yüklüyordu; bu, Android WebView'ın kendi dahili varlık yükleyicisinden geçen özel bir adres ve hiçbir zaman güncelleme mekanizmasının müdahale noktasına (shouldInterceptRequest) hiç uğramıyordu — v0.14.6 ve v0.14.9'daki düzeltmeler doğru ama hiç çalıştırılmayan koda yapılmıştı. Uygulama artık dosyaları WebViewAssetLoader üzerinden, gerçekten müdahale edilebilen bir adresten yüklüyor. Bu sürüm bu yüzden YENİ BİR APK gerektiriyor (native değişiklik) — ama bundan sonraki tüm içerik güncellemeleri artık gerçekten çalışacak."
      ]
    },
    {
      version: "0.14.10", notes: [
        "\"Bizden Gelenler\"e beşinci yazı eklendi: \"Microplastics and Plants: The Questions That Remain\" (Part 5). Bu sürüm de YENİ BİR APK OLMADAN, doğrudan İçerik Güncellemeleri üzerinden geldi — v0.14.9'daki önbellek düzeltmelerinden sonraki ilk gerçek test."
      ]
    },
    {
      version: "0.14.9", notes: [
        "İçerik Güncellemeleri: v0.14.6'daki düzeltmeden sonra bile sürüm 8 (Part 4) güncellemesi indirilip doğrulanmasına rağmen ekrana yansımadı. Olası nedenler tek tek kapatıldı: WebView'ın kendi önbelleği artık file:///android_asset/ istekleri için tamamen devre dışı (LOAD_NO_CACHE + clearCache), sunulan her güncellenmiş dosyaya no-cache başlıkları eklendi, ve Ayarlar ekranına gerçek zamanlı bir teşhis satırı eklendi (hangi dosyanın nereden sunulduğunu ve şu an çalışan gerçek sürümü gösteriyor) — böylece bir dahaki denemede tahmin değil, gerçek kanıt görülecek."
      ]
    },
    {
      version: "0.14.8", notes: [
        "\"Bizden Gelenler\"e dördüncü yazı eklendi: \"Microplastics and Plants: The Rhizosphere Connection\" (Part 4). Bu sürüm de YENİ BİR APK OLMADAN, doğrudan İçerik Güncellemeleri üzerinden geldi — v0.14.6'daki düzeltmeden sonraki ikinci gerçek uçtan uca doğrulama."
      ]
    },
    {
      version: "0.14.7", notes: [
        "\"Bizden Gelenler\"e üçüncü yazı eklendi: \"Microplastics and Plants: What Happens Inside?\" (Part 3). Bu sürüm de v0.14.5'te olduğu gibi YENİ BİR APK OLMADAN, doğrudan İçerik Güncellemeleri üzerinden geldi — bu sefer v0.14.6'daki gerçek düzeltmeden sonra, mekanizmanın gerçekten uçtan uca çalıştığının doğrulanması."
      ]
    },
    {
      version: "0.14.6", notes: [
        "İçerik Güncellemeleri mekanizmasında, v0.10'dan beri var olan gerçek ve önemli bir hata bulundu ve düzeltildi: uygulama bir güncellemeyi indirip doğruladıktan ve \"başarılı\" dedikten SONRA bile, WebView aslında hiçbir zaman güncellenmiş dosyayı göstermiyordu — her zaman APK içindeki orijinal, paket dosyasını yüklemeye devam ediyordu (native/Kotlin tarafındaki bir adres ayrıştırma hatası yüzünden). Bu, özelliğin ilk gerçek uçtan uca kullanımıydı ve tam da bu yüzden şimdiye kadar fark edilmemişti. Artık gerçekten düzeldi ve doğrulandı."
      ]
    },
    {
      version: "0.14.5", notes: [
        "\"Bizden Gelenler\"e ikinci yazı eklendi: \"Microplastics and Plants: How Do Particles Enter?\" (Part 2). Bu sürüm YENİ BİR APK OLMADAN, doğrudan Ayarlar → İçerik Güncellemeleri üzerinden geldi — custom_articles.js dosyasının da bu mekanizmayla güncellenebildiğinin canlı kanıtı."
      ]
    },
    {
      version: "0.14.4", notes: [
        "Yeni: Ana Sayfa'da \"Bilim Haberleri\"nin yanına \"Bizden Gelenler\" eklendi — Buildo için özel olarak yazılmış, dışarıdan çekilmeyen, doğrudan uygulamaya gömülü yazılar. Açıldığında tıpkı normal bir bilim makalesi gibi aynı okuma/build-up/kelime/shadowing/comprehension akışından geçiyor. İlk yazı: \"Microplastics and Plants: A New Biological Conversation\" (Part 1)."
      ]
    },
    {
      version: "0.14.3", notes: [
        "İçerik Güncellemeleri mekanizmasında gerçek bir hata bulundu ve düzeltildi: alt klasördeki dosyalar (i18n/en.js, i18n/tr.js, i18n/core.js) indirilirken \"klasör bulunamadı\" (ENOENT) hatası veriyordu — geçici klasör, alt dizinleri otomatik oluşturmuyordu. Bu, mekanizmanın ilk gerçek canlı denemesinde ortaya çıktı; native/Kotlin tarafı bir düzeltme olduğu için bu sürüm için yeni bir APK kurulumu gerekti (İçerik Güncellemeleri ile gönderilemezdi)."
      ]
    },
    {
      version: "0.14.2", notes: [
        "Bu sürüm hiçbir yeni APK kurulumu OLMADAN, doğrudan Ayarlar → İçerik Güncellemeleri üzerinden geldi — sistemin gerçekten uçtan uca çalıştığının canlı doğrulaması. Sözlüğe küçük bir test partisi eklendi (dwarf planet, asteroid belt, remnant, hotspot, contagious, quarantine, antiviral, biosphere — 8 kelime)."
      ]
    },
    {
      version: "0.14.1", notes: [
        "İçerik Güncellemeleri modülü artık gerçekten çalışıyor: Ayarlar → İçerik Güncellemeleri'ndeki manifest adresi, önceden bir yer tutucuydu (hiçbir yere bağlı değildi) — artık gerçek, herkese açık bir GitHub deposuna (github.com/FevziEL/buildo-content-updates) bağlı. Bundan sonra app.js/dict_en_tr.js/vb. gibi sadece web katmanını ilgilendiren küçük güncellemeler, yeni bir APK kurmadan, bu ekrandaki \"Güncellemeleri Kontrol Et\" düğmesiyle uygulanabilir.",
        "Not: Bu mekanizma sadece web katmanını (app.js, dict_en_tr.js, index.html, CSS, i18n dosyaları) güncelleyebilir — uygulama simgesi, splash ekranı, izinler gibi native/Android tarafı değişiklikler için hâlâ yeni bir APK kurulumu gerekiyor."
      ]
    },
    {
      version: "0.14", notes: [
        "Makale uzunluğu eşiği tekrar yükseltildi: 300 kelimeden 700 kelimeye (bkz. MIN_BODY_WORDS), 900+ kelimelik makaleler artık \"derinlemesine\" olarak işaretleniyor, ve her makale en az 5 gerçek paragraf içermek zorunda. Kısa/teaser içerikler artık tekrarlanan paragraf ve çerez/gizlilik/abone-ol gibi kalıp metinler ayıklandıktan SONRA ölçülüyor — bir kaynak, kalıp metinle kelime sayısını şişiremiyor.",
        "Tüm kaynaklar yeniden, canlı olarak doğrulandı: MIT News (ort. 1191 kelime, 8/8 makale eşiği geçti) güçlü kaynak olarak öne çıktı; Medical Xpress (ort. 37 kelime, 0/8 geçti) TEYİT edilerek ana akıştan kaldırıldı — v0.13'teki geçici tutma kararı doğrulanamadı. NASA (ort. 499 kelime, sadece 2/8 geçti) kaynak olarak kalmaya devam ediyor ama artık makale makale filtreleniyor, kaynağın tamamı kaldırılmadı.",
        "Medical Xpress'in yerini almak üzere iki yeni, canlı doğrulanmış kaynak eklendi: Grist (çevre, ort. 2548 kelime) ve KFF Health News (sağlık, ort. 1177 kelime). Environment konusu artık kendi özel kaynağına sahip (v0.13'te yoktu).",
        "Kaynak sağlığı takibi genişletildi: artık her kaynak için kontrol edilen/uygun bulunan makale sayısı, uygunluk oranı ve medyan kelime sayısı da saklanıyor — bir kaynağın \"zayıf\" sayılması artık gerçek uygun-makale oranına dayanıyor, sadece RSS'in açılıp açılmadığına değil.",
        "Öneri puanlaması genişletildi: bilimsel-terim yoğunluğu (scientific_relevance) ve bilgi-zenginliği (information_richness — gerçek isim/sayı/paragraf çeşitliliğine dayalı, deterministik bir sezgisel yöntem) artık kaynak kalitesi ve kullanıcı geçmişiyle birlikte puanlamaya katkıda bulunuyor. Hâlâ hiçbir İngilizce seviyesi/zorluk puanı yok.",
        "Comprehension Check artık kanıta dayalı: her soru, cevaplandıktan sonra makaledeki gerçek destekleyici cümleyi (\"Makaleden kanıt\") gösteriyor. Asla uydurulmuş bir kanıt değil — bulunamazsa hiçbir şey gösterilmiyor.",
        "İlerleme ekranına iki yeni, gerçek sayaç eklendi: Dinleme Oturumu (makalenin tamamını dinlet düğmesiyle kaç kez dinlendiği) ve Tekrar Edilen Kelime (kelime hazinesi tekrar kartlarında kaç kez bir dereceleme yapıldığı).",
        "Türkçe/İngilizce çevirisi tamamlandı: Shadowing, Delayed Recall, Comprehension, Guided Speaking, Free Response ve tamamlama ekranındaki tüm buton/başlık/ipucu/soru metinleri artık dil ayarına göre değişiyor. Makale metni yine asla çevrilmiyor.",
        "Verilerimi İçe Aktar artık gerçekten hepsi-ya-da-hiçbiri: içe aktarılan JSON önce tamamen doğrulanıyor (şema sürümü + her alanın beklenen türü), herhangi bir sorun varsa HİÇBİR ŞEY yazılmadan reddediliyor — kısmen bozuk bir içe aktarma artık mevcut verinin bir kısmını silemez.",
        "Haber çekme güvenilirliği artırıldı: rss2json başarısız olursa önce kısa bir gecikmeyle tekrar deneniyor, o da başarısız olursa ikinci, bağımsız bir yol (allorigins.win + yerleşik XML ayrıştırıcı) deneniyor. Tüm kaynaklar aynı anda başarısız olursa, uygulama çökmüyor — cihazda daha önce başarıyla getirilmiş gerçek makaleler (kendi orijinal yayın tarihleriyle, asla \"yeni\" gibi gösterilmeden) gösteriliyor ve durum açıkça belirtiliyor.",
        "Yeni: uygulama açılışında ~1,5 saniyelik gerçek bir native splash ekranı — uygulama simgesi + \"Gerçek bilim makaleleri oku, İngilizceni geliştir.\" cümlesi. Cihazın sistem diline göre Türkçe/İngilizce gösteriliyor.",
        "Sözlüğe küçük bir yeni parti eklendi (standart hale gelen uygulama: bkz. dict_en_tr.js üst bilgisi)."
      ]
    },
    {
      version: "0.13", notes: [
        "Ürün yönü değişti: uygulama artık İngilizce seviyesine göre sınıflandırma yapmıyor; amaç gerçek bilim içeriği okuyup bundan İngilizce öğrenmek. Kalan tüm seviye/zorluk kavramları (zaten v0.12'de kaldırılmıştı) tekrar tarandı ve doğrulandı — hiçbiri kalmadı.",
        "Ana Sayfa baştan tasarlandı: artık tek bir \"Bugünün Bilimi\" bölümü (1-3 makale kartı: görsel, başlık, kaynak, kısa özet, okuma süresi, kaydet) + küçük ikincil erişim butonları (Bilim Haberleri, Kaydedilenler, Kelime Hazinem, İlerleme, Dış Kaynak Okuma). Eski çok bölümlü pano (İlerleme çubuğu, Önerilenler, Son Okunanlar, filtre satırları hepsi Ana Sayfa'daydı) kaldırıldı; tam liste artık kendi \"Bilim Haberleri\" ekranında.",
        "Ayarlar → Hakkında artık ayrı bir alt ekran, değişiklik geçmişi de Hakkında içinde kendi ekranında (Hakkında → Değişiklik Geçmişi). Ayarlar ekranı artık değişiklik geçmişiyle birlikte uzamıyor.",
        "Yeni: Ayarlar → Dil — Türkçe/İngilizce arayüz dili seçimi (i18n/ klasörü). Sadece uygulamanın kendi arayüzünü çevirir (buton, menü, etiket, boş/hata durumları, onboarding, Ayarlar, İlerleme, Kelime Hazinem) — makale metni her zaman kendi orijinal İngilizcesiyle kalır, asla çevrilmez veya değiştirilmez.",
        "Logo yenilendi: eski \"iki kare\" (shadowing/echo) simgesi yerine katlanmış köşeli bir sayfa + küçük bir kıvılcım işareti (\"oku · keşfet · öğren\") — uygulama simgesi, Ana Sayfa başlığı ve Hakkında ekranında kullanılıyor.",
        "Ana haber kaynağı doğrulama eşiği yükseltildi: makale gövdesi için asgari kelime sayısı 40'tan çok daha yükseğe çekildi (bkz. MIN_BODY_WORDS) ve her kaynak canlı olarak yeniden ölçüldü (bugünkü tarih: gerçek RSS içerikleri çekilip kelime sayıldı, itibara değil ölçüme göre karar verildi). Sadece gerçekten anlamlı bir okuma deneyimi sunan (teaser değil) kaynaklar ana akışta kaldı; sadece kısa özet/teaser döndüren kaynaklar ana akıştan çıkarıldı.",
        "Kelime hazinesine bir kelime kaydedilirken artık makalenin kendi metninden, o kelimenin geçtiği gerçek cümle de (varsa) saklanıyor — \"Bu kelimeyi bu makalede okudun\" bağlamı.",
        "Yeni: Ayarlar → Veri — Verilerimi Dışa Aktar / İçe Aktar (cihazın Paylaş menüsü üzerinden, hiçbir sunucuya yükleme yapılmadan) ve Öğrenme Verilerini Sıfırla. Ayrıca bir veri format sürümü ve kullanılan yaklaşık depolama miktarı gösteriliyor.",
        "Kaydedilmiş makaleler ve tamamlanmamış dersler hiçbir zaman otomatik silinmiyor (mevcut davranış — bu sürümde açıkça belgelendi ve doğrulandı)."
      ]
    },
    {
      version: "0.12", notes: [
        "Guardian kaynak olarak tamamen kaldırıldı.",
        "Uygulama artık SADECE bilim odaklı: \"Ekonomi\" konusu (ve tek beslediği kaynak olan MarketWatch) kaldırıldı; Browse News artık yalnızca Science/Environment/Health konularını gösteriyor. External Reading'de de bilim dışı içerik (genel haber, toplum, kültür) sonuçlardan TAMAMEN filtreleniyor — sadece azaltılmış öncelik değil.",
        "Beginner/Intermediate/Advanced seviye sistemi UYGULAMANIN HER YERİNDEN kaldırıldı: makale kartlarındaki rozet, Ana Sayfa'daki (v0.09'da eklenmiş) filtre, External Reading'in Level seçici, kelime bilgisi sınıflandırıcısı (CEFR hesaplama), Comprehension Check'teki \"bu makale ne kadar zor?\" sorusu, ve dış kaynak makalelerinin B/I/A etiketi tamamen kaldırıldı. Uygulama artık hiçbir yerde okuma zorluğunu etiketlemiyor veya karşılaştırmıyor.",
        "Bu kaldırmalar sırasında seviyeye göre çeşitlilik sağlayan üç yer (Build-up cümle şablonları, Shadowing Mode'un 3 pratik biçimi, Guided Speaking'in soru uzunluğu) BOZULMADI — artık makalenin \"zorluğuna\" göre değil, cümlenin sırasına (build-up/shadowing) veya makale kimliğine göre deterministik (guided speaking) seçiliyor. Aynı çeşitlilik, karşılaştırma çerçevesi olmadan korundu.",
        "External Reading'in öneri motoru yeniden ağırlıklandırıldı (difficulty_match kaldırıldığı için): topic_match 0.35, science_priority 0.30, freshness 0.15, source_quality 0.15, user_history 0.05."
      ]
    },
    {
      version: "0.11", notes: [
        "Yeni: External Reading — Ana Sayfa'ya eklenen ayrı bir bölüm (Browse News'in yerini almıyor). Bilim öncelikli, 9 gerçek dış kaynaktan (BBC Learning English, VOA Learning English, News in Levels, NASA, PLOS, PubMed Central, DOAJ, The Conversation, Scientific American) makale getiriyor; her kaynak canlı test edilip FULL_TEXT / LICENSE_CHECKED / LINK_ONLY olarak sınıflandırıldı — telif hakkı belirsizse (ör. News in Levels: \"tüm hakları saklıdır\") içerik uygulama içinde ASLA gösterilmiyor, sadece dış bağlantı açılıyor.",
        "Ana Sayfa'daki v0.09 Seviye filtre satırı kaldırıldı — Beginner/Intermediate/Advanced seçimi artık External Reading ekranının kendi Level/Topic/Source seçicisinde yapılıyor. Makale kartlarındaki mevcut B/I/A rozeti ve hesaplama yöntemi HİÇ değişmedi.",
        "Dış kaynaklardan gelen ve tam metni gösterilebilen makaleler (FULL_TEXT/LICENSE_CHECKED), uygulamanın MEVCUT okuma/build-up/pratik akışına aynen giriyor — ayrı bir okuma deneyimi inşa edilmedi.",
        "Bilim öncelik sistemi eklendi: konu ağırlıkları (bitki bilimi, biyoloji, çevre, biyoteknoloji önce) + öneri motoru (zorluk uyumu, konu uyumu, bilim önceliği, tazelik, kaynak kalitesi).",
        "Hata düzeltmesi: dış bağlantılar artık gerçekten sistem tarayıcısında açılıyor (ACTION_VIEW intent) — önceden bir target=\"_blank\" linki WebView'i uygulamadan koparıp geri dönüşü olmayan bir sayfaya götürebiliyordu; bu, mevcut \"Kaynağında oku\" linkini de düzeltiyor."
      ]
    },
    {
      version: "0.10", notes: [
        "Yeni: İçerik Güncellemeleri modülü (Ayarlar → İçerik Güncellemeleri). Artık app.js, sözlük ve diğer web dosyaları, Play Store'a yeni bir sürüm yüklemeden, uygulamanın dışından güncellenebiliyor — bir sunucuda barındırılan küçük bir manifest dosyası kontrol edilip, her dosyanın bütünlüğü (SHA-256) doğrulandıktan sonra, HEPSİ birden veya HİÇBİRİ uygulanıyor.",
        "Güvenlik: sadece https://, sadece paketin zaten içerdiği dosya adları güncellenebiliyor (yeni/rastgele dosya yolu eklenemiyor), ve her zaman \"pakete dön\" seçeneği mevcut. Hiçbir kontrol veya güncelleme sessizce/görünmez şekilde olmuyor — sonuç her zaman Ayarlar ekranında gösteriliyor.",
        "Üçüncü native köprü eklendi: window.AndroidUpdate (ContentUpdateManager.kt) — mevcut window.AndroidTTS ve window.AndroidReminder köprülerinin yanına."
      ]
    },
    {
      version: "0.09", notes: [
        "Easy/Standard/Advanced/Original okuma seviyesi motoru (leveler.js) tamamen kaldırıldı — sürekli yeni hatalar çıkarıyordu. Her makale artık kendi gerçek, orijinal metniyle okunuyor.",
        "Bunun yerine Beginner/Intermediate/Advanced artık uygulamanın TEK seviye sistemi: her makalenin gerçek metninden bir kez ölçülüyor (yeniden yazılmıyor). Ana sayfaya gerçek bir Seviye filtresi eklendi — artık makaleyi açmadan önce seviyeye göre süzebilirsin. Seviye eşikleri, uygulamanın kullandığı tüm gerçek kaynaklardan canlı ölçüm yapılarak yeniden ayarlandı; eski eşiklerle neredeyse her makale \"Advanced\" olarak işaretleniyordu.",
        "BBC News, CNN, Al Jazeera ve NPR (\"Breaking News\" kategorisi) kaldırıldı — bu kaynaklar RSS üzerinden sadece 15-30 kelimelik başlık+tek cümle veriyor, tam makale metni hiç vermiyor (canlı test edildi). Kısa gelecekse o kaynaktan almamak, göstermelik bir \"makale\" sunmaktan daha iyi.",
        "Bilim kaynakları genişletildi: MIT News (tam uzunlukta araştırma yazıları), NASA, New Scientist ve ScienceDaily'nin psikoloji/uzay/malzeme-enerji kategorileri eklendi. Her yeni kaynak eklenmeden önce canlı içerik uzunluğu test edildi.",
        "Çeviri balonunun sözlüğü 1937 → 2108 kelimeye çıkarıldı. Yöntem yine ölçüm: uygulamanın güncel tüm kaynaklarından ~140.000 kelimelik taze bir metin toplandı, eksik kelimeler gerçek sıklığına göre sıralandı ve en çok geçenler eklendi (researcher, material, model, quantum, structure, surface, sample, technique, breakthrough, genetic, urban ve ~150 kelime daha).",
        "Artık gereksiz olan dev-only leveler test paketi (tests/ klasörü, leveler.js'i doğruluyordu) kaldırıldı."
      ]
    },
    {
      version: "0.08", notes: [
        "Reading level baştan sona gerçek makaleler üzerinde denetlendi: 14 canlı makaleden 193 paragraf tek tek incelendi. Artık hiçbir paragraf dokunulmadan kalmıyor (193/193 işleniyor) — eski/yeni tüm yazılarda algoritma çalışıyor.",
        "Easy artık daha az kısaltıyor, daha çok kolaylaştırıyor: cümlelerin yarısı yerine ~%70'i korunuyor. Eskiden bir paragrafın güncel £4.4bn rakamını atıp eski £2.36bn'i tuttuğu görüldü; kısaltma artık gerçekten \"biraz\" kısaltma.",
        "Kolay kelime dağarcığı büyütüldü — gerçek makale çıktısında hâlâ zor kalan kelimeler tek tek bulundu ve eklendi: debilitating→exhausting, unseasonally→unusually, distrust→lack of trust, unwillingness→refusal, concessions→give-aways, hostilities→fighting, scenario→situation, thinktank→research group, soar→rise sharply, gradually→slowly ve ~150 kelime daha.",
        "Dilbilgisi hatası düzeltildi: cümle bölme artık özneiz parça üretmiyor (\"And set to worsen in future years.\" gibi). Riskli \"and/but/so\" bölmeleri tamamen kaldırıldı.",
        "Özel isimler artık küçük harfe düşmüyor (\"But europe\" → \"But Europe\").",
        "Tırnak içindeki alıntılar artık bölünmüyor ve yarım kalmıyor — 193 paragrafta 29 bozuk tırnak vardı, şimdi 0.",
        "Anlamı bozan kelime çevirileri temizlendi: \"stem cells\" artık \"stop cells\" olmuyor, \"oil price forecasts\" artık \"oil price predicts\" olmuyor, \"school project\", \"hosepipe ban\", \"email address\" bozulmuyor.",
        "Dilbilgisi düzeltmeleri: \"increasing the urgency\" artık \"rising the urgency\" olmuyor (geçişli/geçişsiz fiil hatası), \"return to surplus\" bozulmuyor, ve düzensiz fiil çekimleri düzeldi (\"succeeded\" artık \"doed well\" değil \"did well\")."
      ]
    },
    {
      version: "0.07", notes: [
        "Kelimeye tıklayınca açılan çeviri balonunun sözlüğü genişletildi: 1638 → 1937 kelime.",
        "Hangi kelimelerin ekleneceği tahminle değil ölçümle belirlendi — uygulamanın kendi haber kaynaklarından 12 makalelik (~12.500 kelimelik) gerçek bir metin toplandı ve eksik kelimeler sıklığına göre sıralandı.",
        "Eklenenler: iş/finans (yatırımcı, hisse, faiz, ciro), sağlık (doğum, hamile, yaralanma), günlük yaşam (otel, tatil, koltuk, anahtar), sık fiiller (bakmak, teslim etmek, karşılaştırmak), renkler ve sıfatlar, ülke/milliyet adları, ve düzensiz çekimler (women, rose, bought, earlier gibi programın kendiliğinden çözemediği biçimler).",
        "Gerçek makale metninde kelime kapsamı %79'dan %85'e çıktı. Kalan eksikler neredeyse tamamen özel isim (Heathrow, Devon) ve kısaltma (BST, IG) — bunlar bir kelime sözlüğünün doğal sınırı."
      ]
    },
    {
      version: "0.06", notes: [
        "Reading level artık kademeli olarak uzuyor: Easy en kısa, sonra Standard, sonra Advanced, en sonda değiştirilmemiş Original. Gerçek bir makalede ölçüm: Easy orijinalin yaklaşık %60'ı uzunluğunda.",
        "Easy kısaltılırken konu kaybolmuyor. Cümleler rastgele veya sırayla değil, ÖNEMİNE göre seçiliyor: paragrafın açılış cümlesi, içinde sayı/isim geçen cümleler ve makalenin ana konusuyla en çok örtüşen cümleler tutuluyor. Ayrıca bir cümle, kendisinden önceki cümleye bağlıysa (\"Bu...\", \"O da...\") öncesi de tutuluyor — böylece metin havada kalmıyor.",
        "Hiçbir paragraf yok olmuyor: en kısa seviyede bile her paragraftan en az bir cümle kalıyor, yani hikâyenin tamamı orada.",
        "Easy'de en kolay kelimeler kullanılıyor; kelime zorluğu da Standard ve Advanced'a doğru kademeli artıyor.",
        "Kelime değiştirme hataları düzeltildi: fiil kuralının isim üzerinde çalışması engellendi (\"the process\" artık \"the handle\" olmuyor). Ayrıca anlamı bozan 12 kelime tamamen çıkarıldı (\"exposed to sunlight\" → \"showed to sunlight\", \"Witnesses said\" → \"Sees said\", \"public transport\" → \"public carry\" gibi).",
        "Doğrulama katmanı yeni kurala göre yenilendi: kısaltılmış seviyeler bilgi eksiltebilir ama ASLA uyduramaz — metinde geçen her sayının kaynakta da bulunması zorunlu."
      ]
    },
    {
      version: "0.05", notes: [
        "Kelimeye tıklayınca artık kelimenin tam üstünde küçük bir balon açılıyor ve Türkçe karşılığı anında görünüyor. Sadece altı çizili kelimeler değil, metindeki HER kelime tıklanabilir. Balondan kelimeyi dinleyebilir, kaydedebilir veya detayına gidebilirsin.",
        "Çeviri artık kelime penceresinin en altında değil, en üstünde — başlığın hemen altında ve butona basmadan görünüyor.",
        "Sadeleştirme sözlüğü yaklaşık 3 katına çıkarıldı (fiiller için otomatik çekim motoruyla). Ölçüm: Easy metninde değişen kelime oranı %3–26'dan %6–61'e yükseldi; artık Easy gerçekten daha kolay kelimelerle yazılıyor, sadece kısaltılmıyor.",
        "Offline Türkçe sözlük 1271'den ~1700 kelimeye çıkarıldı (gün/ay adları, yön ve ülke adları, yaygın haber kelimeleri ve eksik temel kelimeler eklendi). Gerçek bir makalede kapsam %69'dan %84'e yükseldi.",
        "Hata düzeltmesi: \"Devam Et\" ile derse dönünce build-up ilerlemesi 1. adıma sıfırlanıyordu; artık ilerleme sadece ileri gidiyor.",
        "Hata düzeltmesi: makaleyi her açışta günlük \"cümle pratiği\" sayacı ve pratik süresi şişiyordu; artık sadece gerçekten yeni bir adıma ulaşınca sayılıyor.",
        "İşlevi kalmayan \"kelime çevirilerini otomatik göster\" ayarı kaldırıldı (çeviri zaten her zaman anında gösteriliyor)."
      ]
    },
    {
      version: "0.04", notes: [
        "Reading level motoru baştan yazıldı: artık Easy/Standard/Advanced hiçbir cümleyi veya bilgiyi (isim, sayı, yüzde, sebep-sonuç, karşıtlık) silmiyor — sadece kelimeyi ve cümle yapısını sadeleştiriyor. Önceki sürümde Easy/Standard, paragrafları birleştirip sadece ilk cümleyi tutuyordu; bu, önemli bilgilerin kaybolmasına yol açıyordu ve kaldırıldı.",
        "Her seviye için otomatik bir doğrulama katmanı eklendi (leveler_validate.js): sadeleştirilmiş metin sayı/isim kaybı ya da anlam bozulması içeriyorsa, o paragraf için daha güvenli bir sürüme (ya da gerekirse orijinal metne) otomatik geri dönülüyor.",
        "Kapsamlı bir içerik-koruma test seti eklendi (tests/ klasörü, uygulamaya dahil değil) — sayı, olumsuzluk, sebep-sonuç, karşıtlık ve çok-bilgili paragraf senaryolarını doğruluyor.",
        "Comprehension Check'e üç yeni, gerçek makale metnine dayalı soru türü eklendi: boşluk doldurma (gerçek bir sayı/yüzde), sebep-sonuç sorusu, ve ana fikir sorusu — artık en fazla 3 değil, en fazla 5 soru.",
        "Ana sayfadaki \"Seviye\" (Beginner/Intermediate/Advanced) filtresi kaldırıldı — okuma seviyesi artık makalenin kimliği değil, makale içindeki okuma deneyiminin bir parçası."
      ]
    },
    {
      version: "0.03", notes: [
        "Kelimeye tıklayınca artık tamamen offline (internet gerektirmeyen) bir İngilizce-Türkçe çeviri gösteriliyor — eskiden bu, Google Translate'e bağlanan bir ağ isteğiydi.",
        "News in Levels kaynak olarak kaldırıldı.",
        "Öncelikli yeni kaynaklar eklendi: Science News Explores (öğrenciler için yazılmış bilim haberleri), SciTechDaily, Medical Xpress.",
        "Yeni bir \"Breaking News\" kategorisi eklendi — BBC, CNN, Al Jazeera ve NPR gibi uluslararası yayın kuruluşlarından güncel haberler.",
        "Browse News bölümündeki kategori/seviye etiketleri ve durum mesajları İngilizceye çevrildi (bu bir İngilizce çalışma programı olduğu için)."
      ]
    },
    {
      version: "0.02", notes: [
        "Reading level: artık kelime zorluğuna ek olarak paragraf sayısı da seviyeye göre azalıyor — Easy en kısa/özet, Standard orta, Advanced ve Original tam metin.",
        "APK dosya adı uygulama adıyla (Buildo) eşleşecek şekilde değiştirildi.",
        "Haber kaynağı karışımı güncellendi: Guardian payı azaltıldı, ScienceDaily ve Phys.org gibi kaynaklardan daha fazla makale alınıyor.",
        "Ayarlar > Hakkında bölümüne bu değişiklik geçmişi eklendi."
      ]
    },
    {
      version: "0.01", notes: [
        "Reading level (Easy/Standard/Advanced/Original) motoru tamamen yenilendi — her seviye artık gerçekten farklı bir metin gösteriyor.",
        "Daha önce okunmuş/kaydedilmiş makalelerde eski, bozuk metinlerin kalması hatası düzeltildi.",
        "Ondalıklı sayıların (ör. \"12.1%\") yanlışlıkla ikiye bölünmesi hatası düzeltildi.",
        "Sağ alt köşede ve Ayarlar > Hakkında bölümünde sürüm numarası gösterimi eklendi."
      ]
    }
  ];
  function renderVersionAndChangelog() {
    var badge = document.getElementById("app-version-badge");
    if (badge) badge.textContent = "v" + APP_VERSION;
    var aboutVersion = document.getElementById("about-app-version");
    if (aboutVersion) aboutVersion.textContent = APP_VERSION;
    var schemaVersionEl = document.getElementById("settings-schema-version");
    if (schemaVersionEl) schemaVersionEl.textContent = String(DATA_SCHEMA_VERSION);
    var changelogEl = document.getElementById("settings-changelog");
    if (changelogEl) {
      var versionLabel = (window.I18N && window.I18N.t) ? window.I18N.t("changelog.version") : "Version";
      changelogEl.innerHTML = CHANGELOG.map(function (entry) {
        return '<div style="margin-bottom:14px;">' +
          '<div style="font-family:var(--font-heading); font-weight:800; font-size:12.5px; margin-bottom:4px;">' + versionLabel + ' ' + entry.version + '</div>' +
          '<ul style="margin:0; padding-left:18px; font-size:12.5px; opacity:0.75; line-height:1.5;">' +
          entry.notes.map(function (n) { return "<li>" + n + "</li>"; }).join("") +
          "</ul></div>";
      }).join("");
    }
  }
  renderVersionAndChangelog();

  // ════════════════════════════════════════════════════════════════════════
  // Persistence layer — everything below is real localStorage-backed state,
  // not in-memory-only. Articles are refetched fresh every launch (no
  // backend), so anything that needs to survive a re-fetch (saved articles,
  // progress, recently-read, vocabulary) stores a full snapshot of the
  // article, not just an index into the current ARTICLES array.
  // ════════════════════════════════════════════════════════════════════════
  var Store = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) { return fallback; }
    },
    set: function (key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage full/unavailable */ }
    }
  };
  var K = {
    progress: "shadow_progress",     // { [id]: {sentence1Step,sentence2Step,sentence3Step,completed,shadowingCompleted,lastOpened,snapshot} }
    saved: "shadow_saved",           // { [id]: {savedAt, snapshot} }
    vocab: "shadow_vocab",           // { [word]: {word,pos,definition,exampleSentence,articleId,articleTitle,savedAt,known,reviewDate,interval} }
    daily: "shadow_daily",           // { date, articles:[ids], sentences, minutes }
    history: "shadow_history",       // { [date]: {articles, sentences, minutes} } — archived past days, today excluded
    speaking: "shadow_speaking",      // [{id,articleId,articleTitle,type,prompt,answer,createdAt,wordCount}]
    streak: "shadow_streak",         // { lastActiveDate, count }
    dailyGoal: "shadow_daily_goal",  // number of articles/day, default 2
    turkish: "shadow_turkish",       // "1"/"0"
    reminder: "shadow_reminder",     // "1"/"0" — see MainActivity's AndroidReminder bridge
    readingWidth: "shadow_reading_width", // "narrow" | "normal" | "wide"
    listeningSessions: "shadow_listening_sessions", // number — count of whole-article Listen plays (change list §11)
    wordsReviewed: "shadow_words_reviewed"          // number — count of vocabulary review-card grades submitted
    // shadow_reading_level_<id> keys from the removed v0.04-v0.08 in-
    // article Easy/Standard/Advanced/Original selector may still linger in
    // old installs' localStorage — harmless, unread dead keys now that
    // there's nothing left to look them up for (see levelFromStats above).
  };
  // Migration safety: nothing here renames or clears existing keys. New
  // fields on existing records (exampleSentence, shadowingCompleted, etc.)
  // are always read with a safe fallback rather than assumed present, so
  // data saved by earlier app versions keeps working untouched.
  function todayStr() { return new Date().toISOString().slice(0, 10); }

  function articleSnapshot(a) {
    return {
      id: a.id, topic: a.topic, source: a.source, title: a.title, link: a.link,
      pubDate: a.pubDate, image: a.image,
      readTime: a.readTime, bodyParagraphs: a.bodyParagraphs,
      factSheet: a.factSheet || {}
    };
  }

  // ---- Progress ----
  function getProgressMap() { return Store.get(K.progress, {}); }
  function getProgress(id) { return getProgressMap()[id] || null; }
  function saveProgress(article, patch) {
    var map = getProgressMap();
    var existing = map[article.id] || { sentence1Step: 0, sentence2Step: 0, sentence3Step: 0, completed: false };
    map[article.id] = Object.assign({}, existing, patch, {
      lastOpened: Date.now(), snapshot: articleSnapshot(article)
    });
    Store.set(K.progress, map);
    return map[article.id];
  }
  function isArticleCompleted(id) {
    var p = getProgressMap()[id];
    return !!(p && p.completed);
  }

  // ---- Saved / bookmarks ----
  function getSavedMap() { return Store.get(K.saved, {}); }
  function isSaved(id) { return !!getSavedMap()[id]; }
  function toggleSaved(article) {
    var map = getSavedMap();
    if (map[article.id]) { delete map[article.id]; } else {
      map[article.id] = { savedAt: Date.now(), snapshot: articleSnapshot(article) };
    }
    Store.set(K.saved, map);
    return !!map[article.id];
  }

  // ---- Daily progress + streak ----
  // When the stored "today" record turns out to be from an earlier date, it
  // gets archived into shadow_history before a fresh record starts — this is
  // what powers the Learning History list on the Progress screen and the
  // lifetime "practice time" total, without needing a real backend.
  function getDaily() {
    var d = Store.get(K.daily, null);
    if (!d || d.date !== todayStr()) {
      if (d && (d.articles.length || d.sentences || d.minutes)) {
        var hist = Store.get(K.history, {});
        hist[d.date] = { articles: d.articles.length, sentences: d.sentences, minutes: d.minutes };
        Store.set(K.history, hist);
      }
      d = { date: todayStr(), articles: [], sentences: 0, minutes: 0 };
    }
    return d;
  }
  function saveDaily(d) { Store.set(K.daily, d); }
  function getHistory() { return Store.get(K.history, {}); }
  function lifetimeMinutes() {
    var hist = getHistory();
    var total = getDaily().minutes;
    Object.keys(hist).forEach(function (d) { total += hist[d].minutes || 0; });
    return total;
  }
  function bumpStreak() {
    var s = Store.get(K.streak, { lastActiveDate: null, count: 0 });
    var today = todayStr();
    if (s.lastActiveDate === today) return s; // already counted today
    var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    s.count = (s.lastActiveDate === yesterday) ? s.count + 1 : 1;
    s.lastActiveDate = today;
    Store.set(K.streak, s);
    return s;
  }
  function recordSentencePractice() {
    var d = getDaily();
    d.sentences += 1;
    d.minutes = d.minutes + 0.5; // rough estimate: ~30s per sentence step burst
    saveDaily(d);
    bumpStreak();
  }
  function recordArticleCompleted(id) {
    var d = getDaily();
    if (d.articles.indexOf(id) === -1) d.articles.push(id);
    saveDaily(d);
    bumpStreak();
  }
  function recordArticleOpened() { bumpStreak(); }

  // ---- Vocabulary example sentences ----
  // Original, hand-authored sentence frames (never derived from the article
  // or from a dictionary's own example) picked deterministically by a
  // simple hash of the word so the same word always gets the same example.
  // Best-effort — the dictionary API's part-of-speech string isn't always
  // clean, and a base-form verb plugged into a template won't always be
  // perfectly conjugated. That's an accepted limitation, same spirit as the
  // approximate pronunciation guide.
  var EXAMPLE_TEMPLATES = {
    noun: [
      "The article talked about {word} and why it matters right now.",
      "Many people don't fully understand {word} until they read about it.",
      "This report focuses on {word} and its effect on daily life.",
      "Researchers say {word} has become a bigger issue in recent years."
    ],
    verb: [
      "Experts believe this could {word} the final result.",
      "The new plan is expected to {word} how people respond.",
      "Officials hope to {word} the situation before it gets worse.",
      "Analysts say the decision will {word} the market this year."
    ],
    adjective: [
      "The situation became increasingly {word} over the past month.",
      "Many readers found the news quite {word}.",
      "It was a {word} moment for everyone involved in the story.",
      "The report describes the outcome as genuinely {word}."
    ],
    adverb: [
      "The team responded {word} once the news broke.",
      "She explained the changes {word} during the interview.",
      "Officials reacted {word} to the new report."
    ],
    "default": [
      "This word appears often in news articles about current events.",
      "You'll likely see this word again in similar news stories.",
      "It's a useful word to know when reading the news in English."
    ]
  };
  function posCategory(pos) {
    var p = (pos || "").toLowerCase();
    if (p.indexOf("noun") !== -1) return "noun";
    if (p.indexOf("verb") !== -1) return "verb";
    if (p.indexOf("adjective") !== -1) return "adjective";
    if (p.indexOf("adverb") !== -1) return "adverb";
    return "default";
  }
  function simpleHash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = (h * 31 + str.charCodeAt(i)) | 0; }
    return Math.abs(h);
  }
  function generateExampleSentence(word, pos) {
    var templates = EXAMPLE_TEMPLATES[posCategory(pos)];
    var t = templates[simpleHash(word) % templates.length];
    return t.replace("{word}", word);
  }

  // Finds the first real sentence in the currently-open article that
  // actually contains `word` (whole-word, case-insensitive) — change list
  // §12: "retain the original article sentence/context where available".
  // Never fabricated: returns "" when no open article or no match.
  function findContextSentence(word) {
    if (!state.article || !state.article.bodyParagraphs) return "";
    var re;
    try { re = new RegExp("\\b" + String(word).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i"); }
    catch (e) { return ""; }
    for (var i = 0; i < state.article.bodyParagraphs.length; i++) {
      var sentences = splitSentences(state.article.bodyParagraphs[i]);
      for (var j = 0; j < sentences.length; j++) {
        if (re.test(sentences[j])) return sentences[j].trim();
      }
    }
    return "";
  }

  // ---- Vocabulary ----
  function getVocabMap() { return Store.get(K.vocab, {}); }
  function saveVocabWord(entry) {
    var map = getVocabMap();
    var key = entry.word.toLowerCase();
    var existing = map[key];
    if (existing) return existing; // already saved — don't overwrite user's known/review state
    map[key] = {
      word: entry.word, pos: entry.pos || "", definition: entry.definition,
      exampleSentence: entry.exampleSentence || generateExampleSentence(entry.word, entry.pos),
      articleId: entry.articleId || "", articleTitle: entry.articleTitle || "",
      // Real sentence from the article's own text where this word actually
      // appeared (change list §12) — distinct from exampleSentence above,
      // which is always an original hand-authored template. Empty when the
      // word wasn't tapped from an open article (e.g. no context available).
      contextSentence: entry.contextSentence || "",
      savedAt: Date.now(), known: false, reviewDate: todayStr(), interval: 1
    };
    Store.set(K.vocab, map);
    return map[key];
  }
  // Old records saved before example sentences existed won't have one —
  // this fills it in (and persists it) the first time it's needed, rather
  // than requiring a bulk migration pass.
  function ensureExample(entry) {
    if (entry.exampleSentence) return entry.exampleSentence;
    var ex = generateExampleSentence(entry.word, entry.pos);
    var map = getVocabMap();
    var key = entry.word.toLowerCase();
    if (map[key]) { map[key].exampleSentence = ex; Store.set(K.vocab, map); }
    return ex;
  }
  function isWordSaved(word) { return !!getVocabMap()[word.toLowerCase()]; }
  function setWordKnown(word, known) {
    var map = getVocabMap();
    var key = word.toLowerCase();
    if (!map[key]) return;
    map[key].known = known;
    Store.set(K.vocab, map);
  }
  function reviewWord(word, grade) { // grade: 'hard' | 'good' | 'easy'
    var map = getVocabMap();
    var key = word.toLowerCase();
    var entry = map[key];
    if (!entry) return;
    var days = grade === "hard" ? 1 : grade === "good" ? 3 : 7;
    entry.interval = days;
    entry.reviewDate = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
    Store.set(K.vocab, map);
    Store.set(K.wordsReviewed, (Store.get(K.wordsReviewed, 0) || 0) + 1); // Progress §11
  }
  // ---- Speaking responses (Guided Speaking / Free Response) ----
  // User-generated personal content — kept local only, never transmitted,
  // capped so storage can't grow unbounded.
  function saveSpeakingResponse(type, prompt, answer) {
    var list = Store.get(K.speaking, []);
    list.push({
      id: Date.now() + "_" + type, articleId: state.article.id, articleTitle: state.article.title,
      type: type, prompt: prompt, answer: answer, createdAt: Date.now(),
      wordCount: answer.split(/\s+/).filter(Boolean).length
    });
    if (list.length > 200) list = list.slice(list.length - 200); // reasonable local cap
    Store.set(K.speaking, list);
  }
  function getSpeakingResponses() { return Store.get(K.speaking, []); }

  function wordsDueForReview() {
    var map = getVocabMap();
    var today = todayStr();
    return Object.keys(map).map(function (k) { return map[k]; })
      .filter(function (w) { return !w.known && w.reviewDate <= today; });
  }

  // ════════════════════════════════════════════════════════════════════════
  // Data sources: real, live articles, all reachable without an account/API
  // key. English-learning app, so every outlet here publishes in English —
  // no Turkish-language sources.
  //
  // v0.14 — RAISED FLOOR + RE-VERIFICATION (change list §1-§5). v0.13 had
  // already raised the floor from 40 to 300 words and removed four
  // teaser-only sources (ScienceDaily/Phys.org/SciTechDaily/New Scientist —
  // see the v0.13 CHANGELOG entry above for those numbers). v0.14 raised it
  // again, to a genuine "2 pages" floor, and finished re-verifying the two
  // sources v0.13 couldn't reach (rate-limited mid-check at the time).
  // Live-measured again on 2026-08-14 via the same rss2json proxy, 8-10
  // fresh items per feed:
  //   MIT News: 1020-1456 words/item, avg 1191, 8/8 cleared 700 — the
  //     strongest source measured yet. Kept, promoted to primary.
  //   Medical Xpress: 26-60 words/item, avg 37, 0/8 cleared 700 —
  //     CONFIRMED teaser-only (the v0.13 provisional keep did not hold up).
  //     Removed from the main pipeline per §4/§8.
  //   NASA: 70-1321 words/item, avg 499, only 2/8 cleared 700 — highly
  //     variable, exactly the "don't remove the whole source, filter each
  //     article" case §5 describes. Kept; short NASA items are individually
  //     rejected by the per-article floor below (makeArticle), same
  //     mechanism as always, nothing source-specific needed.
  //   Science News Explores: 361-1951 words/item, avg 968, 5/8 cleared 700
  //     — still strong, kept.
  // Medical Xpress's removal left "saglik" (Health) with no dedicated
  // source, so two new candidates were tested and verified the same way
  // before being added:
  //   Grist (environment journalism, grist.org): 819-4000+ words/item, avg
  //     2548, 8/8 cleared 700 — added as the first dedicated "cevre" feed
  //     (v0.13 had none; Environment relied entirely on classification of
  //     NASA/other items).
  //   KFF Health News (kffhealthnews.org): 214-1636 words/item, avg 1177,
  //     9/10 cleared 700 — added as the "saglik" replacement for Medical
  //     Xpress. (Inside Climate News and STAT News were also tried as
  //     candidates and rejected: 25-47 and 88-179 words/item respectively,
  //     teaser-only.)
  //
  // v0.12's science-only change (Guardian + the Economy/MarketWatch topic
  // removed) is unaffected and still in force — only Science, Environment
  // (environmental science) and Health (health/medical science) exist.
  //
  // Per-item TOPIC is assigned by real keyword classification of the
  // fetched title+body (classifyAppTopic below), not by which bucket a feed
  // was manually filed under — a single science newsroom (NASA, MIT, SNE)
  // covers space/materials/health/climate all at once, and forcing every
  // one of its items into whichever topic the feed happened to be listed
  // under was a labeling accuracy bug, not just a cosmetic one. Each feed's
  // defaultTopic below is only the fallback used when nothing in the text
  // matches a more specific topic's keywords.
  // ════════════════════════════════════════════════════════════════════════
  var SOURCE_FEEDS = [
    { id: "mit_news", name: "MIT News", url: "https://news.mit.edu/rss/research", defaultTopic: "bilim" },
    { id: "science_news_explores", name: "Science News Explores", url: "https://www.snexplores.org/feed", defaultTopic: "bilim" },
    { id: "nasa", name: "NASA", url: "https://www.nasa.gov/feed/", defaultTopic: "bilim" },
    { id: "grist", name: "Grist", url: "https://grist.org/feed/", defaultTopic: "cevre" },
    { id: "kff_health_news", name: "KFF Health News", url: "https://kffhealthnews.org/feed/", defaultTopic: "saglik" }
  ];
  var SECONDARY_LIMIT = 8;
  // Hard floor (change list §1): reject anything that isn't a genuinely
  // substantial reading session — roughly "2 pages". 700 is well clear of
  // every teaser-only source measured above (max 60) and comfortably
  // inside what the five kept sources actually deliver on average.
  var MIN_BODY_WORDS = 700;
  // Soft target used for content-length *quality* scoring (§6/§7) and to
  // mark a card as "preferred" quality — never used for rejection: a
  // 1600-word KFF piece should outrank a 720-word one in "Recommended", not
  // be treated identically just because both cleared MIN_BODY_WORDS.
  var PREFERRED_BODY_WORDS = 900;
  // A real long article still reads as multiple real paragraphs, not one
  // giant HTML blob or a handful of one-line fragments — this catches
  // malformed/boilerplate-heavy markup that happens to have enough raw
  // words but isn't an actual multi-paragraph article (change list §1/§8).
  var MIN_PARAGRAPHS = 5;

  function topicLabel(topic) {
    var key = topic === "cevre" ? "browse.topic.environment" : topic === "saglik" ? "browse.topic.health" : "browse.topic.science";
    return (window.I18N && window.I18N.t) ? window.I18N.t(key) : (TOPIC_LABEL_FALLBACK[topic] || "Science");
  }
  var TOPIC_LABEL_FALLBACK = { bilim: "Science", cevre: "Environment", saglik: "Health" };

  // Lightweight per-item topic classifier (mirrors external_sources.js'
  // classifyTopic — same idea, trimmed to this app's 3 real topics) so a
  // multi-beat science newsroom's items land in the topic they're actually
  // about, not the topic its feed happened to be registered under.
  var APP_TOPIC_KEYWORDS = {
    cevre: ["climate", "environment", "pollution", "emissions", "wildlife", "ecosystem", "biodiversity", "conservation", "deforestation", "recycling", "sustainability", "carbon", "ocean acidification", "warming", "drought", "renewable energy", "endangered"],
    saglik: ["health", "medicine", "medical", "disease", "patient", "treatment", "doctor", "hospital", "vaccine", "cancer", "virus", "drug", "clinical trial", "therapy", "diagnosis", "surgery", "infection"]
  };
  function classifyAppTopic(text, fallbackTopic) {
    var lower = " " + String(text || "").toLowerCase() + " ";
    var bestTopic = null, bestScore = 0;
    Object.keys(APP_TOPIC_KEYWORDS).forEach(function (topic) {
      var score = 0;
      APP_TOPIC_KEYWORDS[topic].forEach(function (kw) { if (lower.indexOf(kw) !== -1) score++; });
      if (score > bestScore) { bestScore = score; bestTopic = topic; }
    });
    return bestTopic || fallbackTopic || "bilim";
  }

  // ---- Article-quality validation (change list §8) — deterministic checks
  // only, never text generation/repair. Two things a raw RSS <content>
  // blob can smuggle past a simple word-count check: (a) the same
  // paragraph appearing twice (some feeds echo a summary inside the full
  // body), and (b) short boilerplate lines (cookie notices, "subscribe",
  // "read more", nav fragments) that inflate the word/paragraph count
  // without being real article content. Both are stripped before the
  // real MIN_BODY_WORDS/MIN_PARAGRAPHS floors are checked, so a feed can't
  // pad its way past the floor with junk.
  var BOILERPLATE_PATTERNS = [
    /cookies?/i, /privacy policy/i, /subscribe to (our|the)/i, /sign up for/i,
    /newsletter/i, /all rights reserved/i, /follow us on/i, /related articles?:?$/i,
    /^read more:?/i, /click here/i, /^advertisement$/i, /^share this/i,
    /manage (your )?preferences/i, /accept (all )?cookies/i, /^tags?:/i
  ];
  function isBoilerplateParagraph(p) {
    var trimmed = String(p || "").trim();
    if (trimmed.length < 25) return true; // real article paragraphs aren't this short
    return BOILERPLATE_PATTERNS.some(function (re) { return re.test(trimmed); });
  }
  function cleanArticleParagraphs(paragraphs) {
    var seen = {};
    var cleaned = [];
    (paragraphs || []).forEach(function (p) {
      var norm = String(p || "").trim().toLowerCase().replace(/\s+/g, " ");
      if (!norm || seen[norm]) return; // drop exact-duplicate paragraphs
      if (isBoilerplateParagraph(p)) return;
      seen[norm] = true;
      cleaned.push(String(p).trim());
    });
    return cleaned;
  }

  // ---- Source health tracking (change list §3) ----
  // Real, persisted per-source verification metadata — not just an internal
  // implementation detail, this is the mechanism that actually enforces §4
  // ("if a source repeatedly cannot provide sufficient text, remove it")
  // at runtime instead of only at review time. accessMode/licenseStatus are
  // fixed facts about how the source is reached (documented once, matching
  // the same three-value model external_sources.js already uses); every
  // other field is updated on every real fetch, from real per-fetch data —
  // see the qualification pipeline in fetchOneSecondaryFeed below.
  var SOURCE_HEALTH_KEY = "shadow_source_health";
  var SOURCE_DISABLE_AFTER_EMPTY = 3; // consecutive zero-qualifying-article fetches
  function getSourceHealth() { return Store.get(SOURCE_HEALTH_KEY, {}); }
  function recordSourceHealth(id, patch) {
    var all = getSourceHealth();
    var existing = all[id] || {
      accessMode: "RSS_PROXY", licenseStatus: "publisher RSS, attribution + source link shown, unmodified excerpt",
      consecutiveEmpty: 0, available: true
    };
    all[id] = Object.assign({}, existing, patch, { lastVerifiedAt: Date.now() });
    Store.set(SOURCE_HEALTH_KEY, all);
    return all[id];
  }
  function isSourceHealthy(id) {
    var h = getSourceHealth()[id];
    return !h || h.available !== false;
  }
  function median(nums) {
    if (!nums.length) return 0;
    var sorted = nums.slice().sort(function (a, b) { return a - b; });
    var mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  }

  // The qualification pipeline (change list §3): every fetched item runs
  // through this exact sequence before it's allowed into the reading feed.
  // Each step is a real, checkable condition — nothing here is a fabricated
  // "quality score".
  function makeArticle(topic, sourceId, source, title, link, pubDate, image, rawParagraphs) {
    if (!link || !title) return null;                    // valid URL / has a title
    var cleaned = cleanArticleParagraphs(rawParagraphs);  // strip duplicates + boilerplate
    if (cleaned.length < MIN_PARAGRAPHS) return null;     // not just a teaser/fragment
    var bodyText = cleaned.join(" ");
    var wordCount = bodyText.split(/\s+/).filter(Boolean).length;
    if (wordCount < MIN_BODY_WORDS) return null;          // substantial-length floor
    return {
      id: link, topic: topic, source: source, sourceId: sourceId, title: decodeEntities(title || ""),
      link: link, pubDate: pubDate, image: image || "",
      readTime: estimateReadTime(bodyText), wordCount: wordCount,
      paragraphCount: cleaned.length,
      preferred: wordCount >= PREFERRED_BODY_WORDS,        // "preferred/high-quality" band, §1
      bodyParagraphs: cleaned,
      factSheet: buildFactSheet(title || "", cleaned)
    };
  }

  // Every registered feed is fetched once (source health permitting) and
  // its items are classified into a topic by their own real content — see
  // APP_TOPIC_KEYWORDS above. A feed that's down, rate-limited, or auto-
  // disabled by its own health record just contributes 0, fail-soft, same
  // as before. Article-level filtering (change list §2): qualification is
  // decided per item via makeArticle above, never assumed for the whole
  // source — a source stays registered as long as it keeps producing SOME
  // qualifying articles, even if most of its items don't clear the floor
  // (NASA is exactly this case, see the header comment above).
  function fetchOneSecondaryFeed(src) {
    if (!isSourceHealthy(src.id)) return Promise.resolve([]);
    return fetchRssWithFallback(src.url).then(function (data) {
        if (!data || data.status !== "ok") {
          recordSourceHealth(src.id, {
            failureReason: "feed unreachable or malformed (status: " + (data && data.status) + ")",
            articlesChecked: 0, articlesQualified: 0, qualificationRate: 0
          });
          return [];
        }
        var items = (data.items || []).slice(0, SECONDARY_LIMIT);
        var wordCounts = [];
        var made = items.map(function (item) {
          var paragraphs = extractBodyParagraphs(item.content || item.description);
          var img = item.thumbnail || (item.enclosure && item.enclosure.link) || "";
          var topic = classifyAppTopic((item.title || "") + " " + (item.description || ""), src.defaultTopic);
          var a = makeArticle(topic, src.id, src.name, item.title, item.link, item.pubDate, img, paragraphs);
          if (a) wordCounts.push(a.wordCount);
          return a;
        }).filter(Boolean);
        var consecutiveEmpty = made.length ? 0 : (getSourceHealth()[src.id] || {}).consecutiveEmpty + 1 || 1;
        recordSourceHealth(src.id, {
          articlesChecked: items.length,
          articlesQualified: made.length,
          qualificationRate: items.length ? Math.round((made.length / items.length) * 100) / 100 : 0,
          minimumVerifiedWords: wordCounts.length ? Math.min.apply(null, wordCounts) : 0,
          averageVerifiedWords: wordCounts.length ? Math.round(wordCounts.reduce(function (a, b) { return a + b; }, 0) / wordCounts.length) : 0,
          medianVerifiedWords: median(wordCounts),
          failureReason: made.length ? "" : "fetched OK but no item cleared the " + MIN_BODY_WORDS + "-word / " + MIN_PARAGRAPHS + "-paragraph floor",
          consecutiveEmpty: consecutiveEmpty,
          available: consecutiveEmpty < SOURCE_DISABLE_AFTER_EMPTY
        });
        if (made.length) cacheQualifyingArticles(src.id, made);
        return made;
      })
      .catch(function (err) {
        console.error("feed fetch failed for " + src.name, err);
        recordSourceHealth(src.id, { failureReason: "network error: " + (err && err.message) });
        return [];
      });
  }
  function fetchAllSources() {
    return Promise.all(SOURCE_FEEDS.map(fetchOneSecondaryFeed))
      .then(function (lists) {
        var fresh = [].concat.apply([], lists);
        if (fresh.length) { Store.set(FEED_ALL_FAILED_AT_KEY, 0); return fresh; }
        // Every single source failed this fetch (change list §14) — rather
        // than showing an empty feed indistinguishable from "no science
        // news exists today", fall back to the most recent real, qualifying
        // articles this device already fetched successfully (§15), each
        // still showing its own real original publish date so it's never
        // presented as freshly published.
        var cached = getCachedQualifyingArticles();
        if (cached.length) { Store.set(FEED_ALL_FAILED_AT_KEY, Date.now()); }
        return cached;
      });
  }

  function rss2jsonUrl(feedUrl) {
    return "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feedUrl);
  }

  // ════════════════════════════════════════════════════════════════════════
  // Feed-fetch reliability (change list §14/§15). The whole Browse Science
  // pipeline depends on rss2json.com's free tier as a CORS proxy for RSS —
  // a real, documented, pre-existing dependency risk (already called out in
  // this file's own comments before v0.14), not something a bigger word-
  // count floor changes on its own. Two real mitigations, in the order
  // §14 asks for:
  //   1. One short-delay retry against rss2json itself first — most
  //      failures against a shared free-tier proxy are a transient burst
  //      limit, not a real outage, and a second attempt a moment later
  //      often just succeeds.
  //   2. If that still fails, fall back to fetching the feed's raw XML
  //      directly through a second, independent CORS passthrough
  //      (allorigins.win) and parsing it in-page with DOMParser — a real
  //      second path, not just a second URL for the same dependency.
  // If BOTH fail, the source contributes 0 articles, fail-soft, same as
  // every other failure mode in this file — never a crash, never a stuck
  // loading state (see fetchAllSources' all-sources-failed fallback below).
  // ════════════════════════════════════════════════════════════════════════
  function delay(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
  function fetchJsonWithTimeout(url, timeoutMs) {
    var controller = ("AbortController" in window) ? new AbortController() : null;
    var opts = controller ? { signal: controller.signal } : {};
    var timer = controller ? setTimeout(function () { controller.abort(); }, timeoutMs || 12000) : null;
    return fetch(url, opts).then(function (r) {
      if (timer) clearTimeout(timer);
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }, function (e) { if (timer) clearTimeout(timer); throw e; });
  }
  // Minimal, dependency-free RSS/Atom parser for the fallback path only —
  // rss2json normally does this server-side; this is deliberately scoped to
  // the handful of fields the app actually reads (title/link/pubDate/
  // content/thumbnail), not a general-purpose feed parser.
  function parseRawFeedXml(xmlText) {
    var doc = new DOMParser().parseFromString(xmlText, "text/xml");
    if (doc.querySelector("parsererror")) return [];
    var isAtom = doc.querySelector("feed > entry") != null;
    var nodes = isAtom ? doc.querySelectorAll("entry") : doc.querySelectorAll("item");
    return Array.prototype.slice.call(nodes, 0, SECONDARY_LIMIT).map(function (node) {
      var text = function (sel) { var el = node.querySelector(sel); return el ? el.textContent : ""; };
      var link = isAtom ? ((node.querySelector("link") || {}).getAttribute && node.querySelector("link").getAttribute("href")) : text("link");
      var content = text("content\\:encoded") || text("content") || text("description") || text("summary");
      var thumb = node.querySelector("enclosure");
      return {
        title: text("title"), link: link || "", pubDate: text("pubDate") || text("published") || text("updated"),
        content: content, description: text("description") || text("summary"),
        thumbnail: thumb ? thumb.getAttribute("url") : ""
      };
    }).filter(function (it) { return it.title && it.link; });
  }
  function fetchRssFallbackDirect(feedUrl) {
    var url = "https://api.allorigins.win/raw?url=" + encodeURIComponent(feedUrl);
    return fetchJsonWithTimeout(url, 15000).catch(function () {
      // allorigins' /raw endpoint returns the feed's actual content-type
      // (XML, not JSON) — fetchJsonWithTimeout's r.json() above will
      // reject on that, which is expected; re-fetch as text for the real
      // XML parse path.
      var controller = ("AbortController" in window) ? new AbortController() : null;
      var opts = controller ? { signal: controller.signal } : {};
      var timer = controller ? setTimeout(function () { controller.abort(); }, 15000) : null;
      return fetch(url, opts).then(function (r) { if (timer) clearTimeout(timer); return r.text(); });
    }).then(function (result) {
      var items = typeof result === "string" ? parseRawFeedXml(result) : [];
      return { status: items.length ? "ok" : "error", items: items };
    }).catch(function () { return null; });
  }
  function fetchRssWithFallback(feedUrl) {
    return fetchJsonWithTimeout(rss2jsonUrl(feedUrl))
      .then(function (data) {
        if (data && data.status === "ok") return data;
        throw new Error("rss2json returned " + (data && data.status));
      })
      .catch(function () {
        return delay(1500).then(function () { return fetchJsonWithTimeout(rss2jsonUrl(feedUrl)); })
          .then(function (data) {
            if (data && data.status === "ok") return data;
            throw new Error("retry also failed");
          })
          .catch(function () { return fetchRssFallbackDirect(feedUrl); });
      });
  }

  // ---- Recent-qualifying-article cache (change list §15) ----
  // When every live source fails in the same fetch (proxy outage, device
  // briefly offline mid-session, …), fall back to the most recent real
  // articles this device already fetched and qualified, rather than an
  // empty feed that looks identical to "no science news exists today".
  // Each cached article keeps its own real original pubDate — never
  // re-stamped with "now" — so it's never presented as freshly published.
  var FEED_CACHE_KEY = "shadow_feed_cache";
  var FEED_ALL_FAILED_AT_KEY = "shadow_feed_all_failed_at";
  var FEED_CACHE_MAX_AGE_MS = 4 * 24 * 60 * 60 * 1000; // 4 days — "reasonable period", §15
  var FEED_CACHE_MAX_ITEMS = 30;
  function cacheQualifyingArticles(sourceId, articles) {
    var cache = Store.get(FEED_CACHE_KEY, {});
    articles.forEach(function (a) { cache[a.id] = { article: a, cachedAt: Date.now() }; });
    var entries = Object.keys(cache).map(function (k) { return cache[k]; })
      .filter(function (e) { return Date.now() - e.cachedAt < FEED_CACHE_MAX_AGE_MS; })
      .sort(function (x, y) { return y.cachedAt - x.cachedAt; })
      .slice(0, FEED_CACHE_MAX_ITEMS);
    var trimmed = {};
    entries.forEach(function (e) { trimmed[e.article.id] = e; });
    Store.set(FEED_CACHE_KEY, trimmed);
  }
  function getCachedQualifyingArticles() {
    var cache = Store.get(FEED_CACHE_KEY, {});
    return Object.keys(cache).map(function (k) { return cache[k]; })
      .filter(function (e) { return Date.now() - e.cachedAt < FEED_CACHE_MAX_AGE_MS; })
      .map(function (e) { return e.article; });
  }

  function stripTags(html) { return html.replace(/<[^>]+>/g, " "); }

  function decodeEntities(str) {
    var ta = document.createElement("textarea");
    ta.innerHTML = str;
    return ta.value;
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function extractBodyParagraphs(contentHtml) {
    if (!contentHtml) return [];
    var html = contentHtml.replace(/<ul[\s\S]*?<\/ul>/gi, " ");
    var paraMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    if (!paraMatches.length) {
      var plain = decodeEntities(stripTags(html)).replace(/\s+/g, " ").trim();
      return plain.length > 15 ? [plain] : [];
    }
    return paraMatches.map(function (p) {
      var inner = p.replace(/^<p[^>]*>/i, "").replace(/<\/p>$/i, "");
      return decodeEntities(stripTags(inner)).replace(/\s+/g, " ").trim();
    }).filter(function (t) { return t.length > 15; });
  }

  // REMOVED in v0.12: the CEFR/tier heuristic (textStats/levelFromStats/
  // LEVEL_TO_TIER) that used to assign every article a Beginner/
  // Intermediate/Advanced tier. Per product direction the app no longer
  // labels or compares reading difficulty anywhere — see APP_SPEC_PROMPT.md
  // §18 for the full history (this heuristic went through three different
  // calibrations across v0.09-v0.11 before being removed outright) and §33
  // for why. Articles no longer carry a tier/levelCode field at all.
  // Returns a plain number of minutes now (not a pre-formatted string) —
  // formatting happens at render time via formatReadTime() below, so the
  // "min read" label actually follows the Settings → Language toggle
  // instead of being permanently baked in at fetch time (found via testing
  // this session: it wasn't, even though everything else on the same card
  // already was).
  function estimateReadTime(text) {
    var words = (text || "").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }
  // Accepts either the new numeric form or an old saved snapshot's
  // pre-formatted string (safe-fallback migration, same philosophy as the
  // rest of this file's Store reads) — never breaks on old data.
  function formatReadTime(mins) {
    if (typeof mins !== "number") return mins || "";
    return window.I18N.t("common.minRead", { n: mins });
  }

  // Local-first adaptive reading fallback. These are original pedagogical
  // adaptations built from permitted feed text, while source attribution and
  // the original link remain visible to the learner.
  // ---- "Bizden Gelenler" / "From Us" (2026-08-17) ----
  // Original, locally-bundled pieces (assets/custom_articles.js) — never
  // fetched, so none of the RSS-pipeline quality gates (MIN_BODY_WORDS,
  // MIN_PARAGRAPHS, cleanArticleParagraphs' boilerplate stripping) apply;
  // those exist to distrust *scraped* content, not hand-written pieces.
  // Turns the raw {id,topic,source,title,link,pubDate,image,bodyParagraphs}
  // entries into the exact same shape a fetched article has (readTime/
  // wordCount/factSheet computed the same way real articles get them), so
  // openArticleObject and the whole reading/build-up/vocabulary/shadowing/
  // comprehension flow work on a custom piece with no separate code path.
  function materializeCustomArticles() {
    var raw = (window.CustomArticles && window.CustomArticles.ARTICLES) || [];
    return raw.map(function (a) {
      var paragraphs = a.bodyParagraphs || [];
      var bodyText = paragraphs.join(" ");
      return Object.assign({}, a, {
        readTime: estimateReadTime(bodyText),
        wordCount: bodyText.split(/\s+/).filter(Boolean).length,
        paragraphCount: paragraphs.length,
        preferred: false,
        isCustom: true,
        factSheet: buildFactSheet(a.title || "", paragraphs)
      });
    });
  }

  var CUSTOM_ARTICLES = materializeCustomArticles();
  var CUSTOM_ARTICLES_BY_ID = {};
  CUSTOM_ARTICLES.forEach(function (a) { CUSTOM_ARTICLES_BY_ID[a.id] = a; });

  // ════════════════════════════════════════════════════════════════════════
  // Notifications bell (2026-08-18) — surfaces newly arrived "Bizden
  // Gelenler" pieces without the reader needing to remember to open that
  // list themselves. "New" is deliberately not a separate tracked flag: a
  // piece counts as new for as long as it has no K.progress entry, and
  // opening it (openArticleObject -> saveProgress touches lastOpened even
  // before any real progress is made) is what naturally clears it — the
  // exact same "opened" signal every other read/unread indicator in the
  // app already relies on (see the done-check mark in articleRowHtml).
  // ════════════════════════════════════════════════════════════════════════
  function getNewCustomArticles() {
    var progressMap = Store.get(K.progress, {});
    return CUSTOM_ARTICLES.filter(function (a) { return !progressMap[a.id]; });
  }
  function renderNotifications() {
    var items = getNewCustomArticles();
    var badge = document.getElementById("notif-badge");
    if (badge) {
      badge.hidden = items.length === 0;
      badge.textContent = items.length > 9 ? "9+" : String(items.length);
    }
    var listEl = document.getElementById("notifications-list");
    var emptyEl = document.getElementById("notifications-empty");
    if (!listEl) return;
    listEl.innerHTML = "";
    if (items.length === 0) {
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    items.forEach(function (a) {
      var row = document.createElement("div");
      row.className = "article-row";
      row.innerHTML = articleRowHtml(a);
      bindArticleRow(row, a); // real click behavior: opens the article via openArticleObject
      row.addEventListener("click", function (e) {
        if (e.target.closest(".save-star")) return;
        document.getElementById("notifications-overlay").hidden = true;
      });
      listEl.appendChild(row);
    });
  }
  document.getElementById("btn-notifications").addEventListener("click", function () {
    renderNotifications();
    document.getElementById("notifications-overlay").hidden = false;
  });
  document.getElementById("btn-notifications-close").addEventListener("click", function () {
    document.getElementById("notifications-overlay").hidden = true;
  });
  document.getElementById("notifications-overlay").addEventListener("click", function (e) {
    if (e.target.id === "notifications-overlay") document.getElementById("notifications-overlay").hidden = true;
  });

  function buildFactSheet(title, paragraphs) {
    var text = (title + " " + paragraphs.join(" ")).trim();
    return {
      people: (text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}\b/g) || []).slice(0, 12),
      numbers: (text.match(/\b\d+(?:\.\d+)?%?|\b\d{4}\b/g) || []).slice(0, 12),
      scientificTerms: (text.match(/\b(?:AI|DNA|RNA|CRISPR|climate|carbon|gene|research|study|species|virus|vaccine|energy|emissions|planet|space)\w*\b/gi) || []).slice(0, 20),
      mainFindings: paragraphs.slice(0, 2), claims: paragraphs.slice(0, 4)
    };
  }
  // A naive "split on . ! ?" butchers "12.1%" into "12." + "1%..." and
  // "Dr. Smith" into "Dr." + "Smith..." — visible in the rendered article
  // body (and its TTS sentence spans) at every reading level, since this
  // is the final split applied at render time regardless of which level's
  // text is being shown. Decimal-number periods and common title
  // abbreviations are protected with a text marker before splitting, then
  // restored in each resulting piece.
  var SENT_DOT_MARK = "DOT";
  var SENT_TITLE_ABBR = /\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St)\.(?=\s)/g;
  function splitSentences(text) {
    var protectedText = String(text || "")
      .replace(/(\d)\.(\d)/g, "$1" + SENT_DOT_MARK + "$2")
      .replace(SENT_TITLE_ABBR, function (m, word) { return word + SENT_DOT_MARK; });
    var parts = protectedText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
    return parts.map(function (p) { return p.split(SENT_DOT_MARK).join("."); });
  }
  // REMOVED in v0.09: createAdaptiveVersions() used to call out to
  // ReadingLeveler.createVersions() (leveler.js) to build four rewritten
  // texts (easy/standard/advanced/original) per article. That whole
  // engine — leveler.js + leveler_validate.js, ~1,250 lines — is gone.
  // It kept surfacing grammar/meaning-corrupting bugs on real live
  // articles (see the v0.05-v0.08 changelog entries above for the history
  // of fixes that kept being needed), and per-user direction it has been
  // replaced outright rather than patched again: every article is now
  // read at its one real, original body text, and Beginner/Intermediate/
  // Advanced (see levelFromStats above) is the only leveling concept left,
  // assigned once from real source text instead of computed by rewriting.
  // (Same i18n gap as estimateReadTime, found the same way — see
  // formatReadTime above — fixed the same session, same fix shape.)
  function timeAgo(pubDateStr) {
    var t = window.I18N.t;
    var iso = pubDateStr.indexOf("T") !== -1 ? pubDateStr : pubDateStr.replace(" ", "T") + "Z";
    var then = new Date(iso).getTime();
    var diffMin = Math.round((Date.now() - then) / 60000);
    if (diffMin < 60) return t("common.minutesAgo", { n: diffMin });
    var diffH = Math.round(diffMin / 60);
    if (diffH < 24) return t("common.hoursAgo", { n: diffH });
    return t("common.daysAgo", { n: Math.round(diffH / 24) });
  }

  // NOTE (v0.13): makeArticle/fetchOneSecondaryFeed/fetchAllSources now live
  // earlier in this file, next to SOURCE_FEEDS/MIN_BODY_WORDS — this used to
  // be a second, topic-keyed implementation (makeArticle/fetchOneSecondaryFeed(topic,src)/
  // fetchCategory) that duplicated them under the old per-topic SECONDARY_FEEDS
  // registry. Removed outright rather than left as dead code: a duplicate
  // `function fetchOneSecondaryFeed` declaration here would have silently
  // won over the real one (later declaration wins on a same-scope redeclare),
  // breaking the whole fetch pipeline in a way that's easy to miss in review.

  // ════════════════════════════════════════════════════════════════════════
  // Article registry + list rendering
  // ════════════════════════════════════════════════════════════════════════
  var ARTICLES = [];
  var ARTICLES_BY_ID = {};
  // No activeTier here (v0.11): the v0.09 Home-screen Level filter row was
  // removed per product direction — Beginner/Intermediate/Advanced stays
  // exactly as the existing per-article tier badge (untouched, still
  // computed the same way, see levelFromStats), but selecting BY level now
  // happens in the new External Reading screen instead (§32), not as a
  // Browse News filter. Topic/Status remain real Home filters.
  var activeTopic = "all", activeStatus = "all", searchQuery = "";

  // Offline: don't attempt a fetch that's certain to fail. Saved articles
  // (full snapshots, already on-device) still work fully — reading,
  // build-up, vocabulary, TTS — since none of that needs the network.
  function updateOfflineBanner() {
    document.getElementById("offline-banner").hidden = navigator.onLine;
  }
  window.addEventListener("online", function () { updateOfflineBanner(); loadArticles(); });
  window.addEventListener("offline", updateOfflineBanner);

  function loadArticles() {
    var statusRow = document.getElementById("status-row");
    var listEl = document.getElementById("article-list");
    var t = (window.I18N && window.I18N.t) || function (k) { return k; };
    updateOfflineBanner();
    if (!navigator.onLine) {
      ARTICLES = [];
      ARTICLES_BY_ID = {};
      statusRow.hidden = false;
      statusRow.innerHTML = "<strong>" + t("browse.offline") + "</strong><br>" + t("browse.offline.sub");
      listEl.innerHTML = "";
      renderList(); // still shows nothing in Browse, but…
      renderHomeSections(); // …Today's Science still works from saved/progress data
      return;
    }
    statusRow.hidden = false;
    statusRow.innerHTML = t("browse.fetching");
    listEl.innerHTML = "";

    fetchAllSources().then(function (all) {
      all.sort(function (a, b) { return new Date(b.pubDate) - new Date(a.pubDate); });
      ARTICLES = all;
      ARTICLES_BY_ID = {};
      ARTICLES.forEach(function (a) { ARTICLES_BY_ID[a.id] = a; });
      if (!ARTICLES.length) {
        statusRow.hidden = false;
        statusRow.innerHTML = t("browse.error") + "<br>" +
          '<span class="btn btn-secondary" id="btn-retry">' + t("common.tryAgain") + "</span>";
        document.getElementById("btn-retry").addEventListener("click", loadArticles);
        renderHomeSections(); // still show saved/vocab-derived sections offline
        return;
      }
      // change list §14/§15: every live source failed this round, but a
      // cached batch of previously-qualified real articles was available —
      // show what's there, plus an honest "temporarily unavailable" banner
      // (never silently pretend this is a fresh fetch).
      if (Store.get(FEED_ALL_FAILED_AT_KEY, 0)) {
        statusRow.hidden = false;
        statusRow.innerHTML = "<strong>" + t("browse.unavailable") + "</strong><br>" + t("browse.unavailable.sub");
      } else {
        statusRow.hidden = true;
      }
      renderList();
      renderHomeSections();
    });
  }

  function rowMatchesFilters(a) {
    var topicOk = activeTopic === "all" || a.topic === activeTopic;
    var statusOk = activeStatus === "all" ||
      (activeStatus === "saved" && isSaved(a.id)) ||
      (activeStatus === "completed" && isArticleCompleted(a.id));
    var searchOk = !searchQuery || (
      a.title.toLowerCase().indexOf(searchQuery) !== -1 ||
      a.source.toLowerCase().indexOf(searchQuery) !== -1 ||
      topicLabel(a.topic).toLowerCase().indexOf(searchQuery) !== -1
    );
    return topicOk && statusOk && searchOk;
  }

  function articleRowHtml(a, compact) {
    var doneAll = isArticleCompleted(a.id);
    var saved = isSaved(a.id);
    var thumbHtml = a.image
      ? '<img class="real-thumb grayscale" src="' + a.image + '" alt="">'
      : "FOTO";
    return (
      '<div class="thumb stripe-ph' + (a.image ? "" : " grayscale") + '">' + thumbHtml + "</div>" +
      '<div style="flex:1; min-width:0;">' +
        '<div class="meta-row">' +
          '<span class="tag tag-outline">' + escapeHtml(a.source) + "</span>" +
          '<span class="read-time">' + formatReadTime(a.readTime) + " · " + timeAgo(a.pubDate) + "</span>" +
          (saved ? '<span class="save-star on" data-save-id="' + escapeHtml(a.id) + '">★</span>' : '<span class="save-star" data-save-id="' + escapeHtml(a.id) + '">☆</span>') +
        "</div>" +
        '<div class="card-title title">' + escapeHtml(a.title) + (doneAll ? ' <span class="done-check">✓</span>' : "") + "</div>" +
      "</div>"
    );
  }

  function bindArticleRow(row, a) {
    row.addEventListener("click", function (e) {
      if (e.target.closest(".save-star")) return; // handled separately
      openArticleObject(a);
    });
    var star = row.querySelector(".save-star");
    if (star) {
      star.addEventListener("click", function (e) {
        e.stopPropagation();
        var nowSaved = toggleSaved(a);
        star.classList.toggle("on", nowSaved);
        star.textContent = nowSaved ? "★" : "☆";
        if (activeStatus === "saved" && !nowSaved) { row.hidden = true; }
        renderHomeSections();
      });
    }
  }

  function renderList() {
    var listEl = document.getElementById("article-list");
    listEl.innerHTML = "";
    var visibleCount = 0;
    ARTICLES.forEach(function (a) {
      if (!rowMatchesFilters(a)) return;
      visibleCount++;
      var row = document.createElement("div");
      row.className = "article-row";
      row.innerHTML = articleRowHtml(a);
      bindArticleRow(row, a);
      listEl.appendChild(row);
    });
    var emptyEl = document.getElementById("list-empty-state");
    emptyEl.hidden = visibleCount > 0;
  }

  function applyFilters() { renderList(); }

  document.getElementById("filter-row").addEventListener("click", function (e) {
    var chip = e.target.closest(".tag");
    if (!chip) return;
    document.querySelectorAll("#filter-row .tag").forEach(function (t) {
      t.classList.remove("tag-accent"); t.classList.add("tag-outline");
    });
    chip.classList.remove("tag-outline"); chip.classList.add("tag-accent");
    activeTopic = chip.dataset.topic;
    applyFilters();
  });
  document.getElementById("status-row-filter").addEventListener("click", function (e) {
    var chip = e.target.closest(".tag");
    if (!chip) return;
    document.querySelectorAll("#status-row-filter .tag").forEach(function (t) {
      t.classList.remove("tag-accent"); t.classList.add("tag-outline");
    });
    chip.classList.remove("tag-outline"); chip.classList.add("tag-accent");
    activeStatus = chip.dataset.status;
    applyFilters();
  });
  document.getElementById("btn-refresh").addEventListener("click", loadArticles);

  // ════════════════════════════════════════════════════════════════════════
  // External Reading (v0.11, §32) — a separate section and pipeline from
  // Browse News above, backed by external_sources.js's window.ExternalReading.
  // Does not touch ARTICLES/activeTopic/rowMatchesFilters — its own state,
  // its own list, its own screen. See external_sources.js's top comment for
  // the copyright-safety model (FULL_TEXT/LICENSE_CHECKED/LINK_ONLY).
  // ════════════════════════════════════════════════════════════════════════
  var erState = { topic: "all", source: "all", articles: [] };

  // Only used to feed the EXISTING reading/build-up pipeline's `topic` field
  // (which a few UI spots, e.g. the comprehension topic question, render via
  // TOPIC_LABELS) — the article's real, richer topic (e.g. "plant_science")
  // stays on a.topic for External Reading's own display/filtering.
  var ER_TOPIC_TO_APP_TOPIC = {
    science: "bilim", biology: "bilim", plant_science: "bilim", biotechnology: "bilim",
    ecology: "bilim", technology: "bilim", space: "bilim", molecular_biology: "bilim",
    environment: "cevre", climate: "cevre", earth: "cevre",
    health: "saglik", medicine: "saglik",
    general_news: "bilim", society: "bilim", culture: "bilim", general: "bilim", news: "bilim"
  };
  function mapExternalTopicToAppTopic(topic) { return ER_TOPIC_TO_APP_TOPIC[topic] || "bilim"; }

  var ER_TOPIC_LABELS = {
    science: "Science", biology: "Biology", plant_science: "Plant Science",
    environment: "Environmental Science", biotechnology: "Biotechnology", ecology: "Ecology",
    climate: "Climate", technology: "Technology", health: "Health", space: "Space",
    general_news: "General News", society: "Culture", medicine: "Medicine", earth: "Earth Science"
  };

  function renderErSourceChips() {
    var row = document.getElementById("er-source-row");
    row.querySelectorAll("[data-er-source]:not([data-er-source='all'])").forEach(function (el) { el.remove(); });
    if (!window.ExternalReading) return;
    window.ExternalReading.availableSources().forEach(function (src) {
      var span = document.createElement("span");
      span.className = "tag tag-outline";
      span.setAttribute("data-er-source", src.id);
      span.textContent = src.name;
      row.appendChild(span);
    });
  }

  function erAccessBadge(a) {
    var MODES = window.ExternalReading.ACCESS_MODES;
    if (a.accessMode === MODES.LINK_ONLY) return "Link only";
    if (a.accessMode === MODES.LICENSE_CHECKED) return "Open access";
    return "";
  }
  function erCardHtml(a) {
    var badge = erAccessBadge(a);
    return (
      '<div class="er-card" data-er-id="' + escapeHtml(a.id) + '">' +
        '<div class="er-card-meta">' +
          '<span class="tag tag-outline">' + escapeHtml(a.source) + '</span>' +
          (badge ? '<span class="er-link-badge">' + badge + '</span>' : '') +
        '</div>' +
        '<div class="er-card-title">' + escapeHtml(a.title) + '</div>' +
        '<div class="er-card-sub">' + escapeHtml(ER_TOPIC_LABELS[a.topic] || a.topic) + ' · ' + a.readTime + (a.pubDate ? ' · ' + timeAgo(a.pubDate) : '') + '</div>' +
        (a.summary ? '<div class="er-card-summary">' + escapeHtml(a.summary) + '</div>' : '') +
      '</div>'
    );
  }
  function bindErCard(cardEl, a) {
    cardEl.addEventListener("click", function () {
      var isLinkOnly = a.accessMode === window.ExternalReading.ACCESS_MODES.LINK_ONLY;
      if (isLinkOnly || !a.bodyParagraphs || !a.bodyParagraphs.length) {
        // Copyright-safety rule, not just a fallback: LINK_ONLY content is
        // never rendered inside the app (spec §11/§16) — always leaves the
        // app via a real link (MainActivity's shouldOverrideUrlLoading
        // routes this to the system browser, see MainActivity.kt v0.11).
        var a2 = document.createElement("a");
        a2.href = a.sourceUrl; a2.target = "_blank"; a2.rel = "noopener";
        document.body.appendChild(a2); a2.click(); a2.remove();
        return;
      }
      openArticleObject({
        id: a.id, topic: mapExternalTopicToAppTopic(a.topic), source: a.source,
        title: a.title, link: a.sourceUrl, pubDate: a.pubDate, image: a.imageUrl,
        readTime: a.readTime, bodyParagraphs: a.bodyParagraphs, factSheet: null
      });
    });
  }
  function renderErList() {
    var listEl = document.getElementById("er-article-list");
    var emptyEl = document.getElementById("er-empty-state");
    listEl.innerHTML = "";
    var ctx = { preferredTopic: erState.topic };
    var scored = erState.articles.map(function (a) {
      return { a: a, score: window.ExternalReading.recommendationScore(a, ctx) };
    }).sort(function (x, y) { return y.score - x.score; });
    scored.forEach(function (s) {
      var wrap = document.createElement("div");
      wrap.innerHTML = erCardHtml(s.a);
      var card = wrap.firstChild;
      bindErCard(card, s.a);
      listEl.appendChild(card);
    });
    emptyEl.hidden = scored.length > 0;
  }
  function loadExternalReading() {
    var statusRow = document.getElementById("er-status-row");
    var listEl = document.getElementById("er-article-list");
    document.getElementById("er-empty-state").hidden = true;
    if (!navigator.onLine) {
      statusRow.hidden = false;
      statusRow.innerHTML = "You're offline.<br>External Reading needs a connection.";
      listEl.innerHTML = "";
      return;
    }
    if (!window.ExternalReading) {
      statusRow.hidden = false;
      statusRow.textContent = "External Reading module didn't load.";
      return;
    }
    statusRow.hidden = false;
    statusRow.textContent = "Fetching articles…";
    listEl.innerHTML = "";
    window.ExternalReading.fetchArticles({ topic: erState.topic, source: erState.source })
      .then(function (articles) {
        erState.articles = articles;
        statusRow.hidden = true;
        renderErList();
      })
      .catch(function () {
        statusRow.hidden = false;
        statusRow.innerHTML = "Couldn't fetch articles right now.<br>" +
          '<span class="btn btn-secondary" id="btn-er-retry">Try again</span>';
        var retry = document.getElementById("btn-er-retry");
        if (retry) retry.addEventListener("click", loadExternalReading);
      });
  }
  document.getElementById("btn-open-external-reading").addEventListener("click", function () {
    document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
    document.getElementById("screen-external-reading").classList.add("active");
    renderErSourceChips();
    loadExternalReading();
  });
  document.getElementById("btn-er-back").addEventListener("click", function () {
    document.getElementById("screen-external-reading").classList.remove("active");
    document.getElementById("screen-home").classList.add("active");
  });

  // ---- "Bizden Gelenler" / "From Us" screen ----
  // Reuses articleRowHtml/bindArticleRow — the exact same row markup and
  // click/save behavior as Browse Science's list — so a custom piece looks
  // and behaves identically once you're looking at it, per the same
  // "reuse the existing flow" rule as openArticleObject itself.
  function renderCustomArticleList() {
    var listEl = document.getElementById("custom-article-list");
    var emptyEl = document.getElementById("custom-empty");
    listEl.innerHTML = "";
    if (!CUSTOM_ARTICLES.length) { emptyEl.hidden = false; return; }
    emptyEl.hidden = true;
    CUSTOM_ARTICLES.forEach(function (a) {
      var row = document.createElement("div");
      row.className = "article-row";
      row.innerHTML = articleRowHtml(a);
      bindArticleRow(row, a);
      listEl.appendChild(row);
    });
  }
  document.getElementById("btn-home-custom").addEventListener("click", function () {
    document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
    document.getElementById("screen-custom-articles").classList.add("active");
    renderCustomArticleList();
  });
  document.getElementById("btn-custom-back").addEventListener("click", function () {
    document.getElementById("screen-custom-articles").classList.remove("active");
    document.getElementById("screen-home").classList.add("active");
  });
  function bindErFilterRow(rowId, datasetKey, stateKey) {
    document.getElementById(rowId).addEventListener("click", function (e) {
      var chip = e.target.closest(".tag");
      if (!chip) return;
      document.querySelectorAll("#" + rowId + " .tag").forEach(function (t) {
        t.classList.remove("tag-accent"); t.classList.add("tag-outline");
      });
      chip.classList.remove("tag-outline"); chip.classList.add("tag-accent");
      erState[stateKey] = chip.dataset[datasetKey];
      loadExternalReading();
    });
  }
  bindErFilterRow("er-topic-row", "erTopic", "topic");
  bindErFilterRow("er-source-row", "erSource", "source");

  // ---- Search ----
  var btnSearchToggle = document.getElementById("btn-search-toggle");
  var searchRow = document.getElementById("search-row");
  var searchInput = document.getElementById("search-input");
  btnSearchToggle.addEventListener("click", function () {
    var opening = searchRow.hidden;
    searchRow.hidden = !opening;
    if (opening) searchInput.focus();
    else { searchInput.value = ""; searchQuery = ""; applyFilters(); }
  });
  searchInput.addEventListener("input", function () {
    searchQuery = searchInput.value.trim().toLowerCase();
    applyFilters();
  });
  document.getElementById("btn-search-clear").addEventListener("click", function () {
    searchInput.value = ""; searchQuery = ""; applyFilters(); searchInput.focus();
  });

  // ════════════════════════════════════════════════════════════════════════
  // Home — v0.13 redesign (change list §2): a single "Today's Science"
  // block (1-3 cards) answers "what can I read today?" directly, instead of
  // the old multi-section dashboard (separate Continue/Progress-bar/
  // Recommended/Recently-Read blocks). The in-progress lesson (if any)
  // still always comes first — never restarts a learner from scratch — the
  // rest of the slots fill with fresh recommendations. Daily-goal/streak
  // tracking (getDaily/bumpStreak) is unchanged and still feeds the
  // Progress screen; it's just no longer rendered as a dashboard on Home.
  // ════════════════════════════════════════════════════════════════════════
  function greetingText() {
    var h = new Date().getHours();
    var name = localStorage.getItem("shadow_user") || "";
    var t = (window.I18N && window.I18N.t) || function (k) { return k; };
    var part = h < 12 ? t("home.greeting.morning") : h < 18 ? t("home.greeting.afternoon") : t("home.greeting.evening");
    return part + (name ? ", " + escapeHtml(name) + "." : ".");
  }

  function computeContinueLearning() {
    var map = getProgressMap();
    var candidates = Object.keys(map).map(function (id) { return map[id]; })
      .filter(function (p) { return !p.completed && (p.sentence1Step || p.sentence2Step || p.sentence3Step); })
      .sort(function (a, b) { return b.lastOpened - a.lastOpened; });
    return candidates[0] || null;
  }

  function currentSentenceStepFor(p) {
    if (p.sentence1Step < 10) return { idx: 0, step: Math.max(1, p.sentence1Step) };
    if (p.sentence2Step < 10) return { idx: 1, step: Math.max(1, p.sentence2Step) };
    return { idx: 2, step: Math.max(1, p.sentence3Step) };
  }

  // Canonical title — strips common live-blog/update suffixes so near-
  // duplicate stories (the same live story re-published/updated) don't both
  // show up as separate recommendations.
  function canonicalTitle(title) {
    return title.toLowerCase().replace(/\s*[-–—]\s*(live|update[sd]?|as it happened).*$/i, "").trim();
  }
  // ---- Recommendation scoring (change list §6/§7) ----
  // Every listed factor from the change list, each a real, deterministic,
  // checkable signal — never a fabricated "quality score" and never
  // anything about English level/difficulty:
  //   scientific_relevance   — density of real science-topic vocabulary
  //   information_richness   — named entities + numbers/stats + paragraph
  //                             diversity (a deterministic heuristic, §7 —
  //                             explicitly not claimed to be a validated
  //                             information-theoretic measure)
  //   topic_match             — does this article match the topic the
  //                             learner reads most
  //   freshness               — mild recency bonus
  //   source_quality          — fixed per-source weight, set from this
  //                             file's own live word-count verification
  //                             (see the SOURCE_FEEDS header comment above)
  //   content_length_quality  — reward fuller articles, never penalize ones
  //                             that only just cleared the floor
  //   user_history            — has the learner completed articles from
  //                             this exact source before
  var SOURCE_QUALITY_WEIGHT = {
    mit_news: 0.95, science_news_explores: 0.9, grist: 0.9,
    kff_health_news: 0.85, nasa: 0.75
  };
  var SCIENCE_RELEVANCE_TERMS = [
    "research", "researcher", "scientist", "study", "studies", "data",
    "experiment", "hypothesis", "discover", "evidence", "analysis",
    "finding", "climate", "species", "genetic", "cell", "protein",
    "energy", "planet", "space", "ocean", "virus", "vaccine", "disease",
    "treatment", "patient", "technology", "material", "particle",
    "telescope", "satellite", "ecosystem", "environment", "laboratory"
  ];
  function scientificRelevanceScore(a) {
    var text = (a.bodyParagraphs || []).join(" ").toLowerCase();
    var words = text.split(/\s+/).filter(Boolean);
    if (!words.length) return 0;
    var hits = 0;
    SCIENCE_RELEVANCE_TERMS.forEach(function (term) {
      var re = new RegExp("\\b" + term + "\\w*\\b", "g");
      hits += (text.match(re) || []).length;
    });
    return Math.min(1, (hits / words.length) * 25); // density per ~word count, capped
  }
  function informationRichnessScore(a) {
    var text = (a.bodyParagraphs || []).join(" ");
    var namedEntities = (text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}\b/g) || []).length;
    var numbers = (text.match(/\b\d+(?:[.,]\d+)?%?\b/g) || []).length;
    var paragraphDiversity = (a.bodyParagraphs || []).length;
    return Math.min(1, namedEntities / 12) * 0.4 +
      Math.min(1, numbers / 8) * 0.35 +
      Math.min(1, paragraphDiversity / 10) * 0.25;
  }
  function computeRecommended(limit) {
    limit = limit || 3;
    var map = getProgressMap();
    var topicCounts = {}, completedSources = {};
    Object.keys(map).map(function (id) { return map[id]; })
      .sort(function (a, b) { return b.lastOpened - a.lastOpened; })
      .forEach(function (p) {
        var s = p.snapshot;
        if (!s) return;
        topicCounts[s.topic] = (topicCounts[s.topic] || 0) + 1;
        if (p.completed) completedSources[s.source] = true;
      });
    var topTopic = Object.keys(topicCounts).sort(function (a, b) { return topicCounts[b] - topicCounts[a]; })[0];
    var todaysPracticeId = computeContinueLearning();
    var seenTitles = {};
    var pool = ARTICLES.filter(function (a) {
      if (isArticleCompleted(a.id)) return false;
      if (todaysPracticeId && a.id === todaysPracticeId.snapshot.id) return false;
      var ct = canonicalTitle(a.title);
      if (seenTitles[ct]) return false;
      seenTitles[ct] = true;
      return true;
    });
    var newestMs = pool.length ? new Date(pool[0].pubDate).getTime() : Date.now();
    var scored = pool.map(function (a) {
      var topicMatch = topTopic ? (a.topic === topTopic ? 1 : 0.2) : 0.6;
      var freshness = Math.max(0, 1 - (newestMs - new Date(a.pubDate).getTime()) / (1000 * 60 * 60 * 24 * 14));
      var sourceQuality = SOURCE_QUALITY_WEIGHT[a.sourceId] != null ? SOURCE_QUALITY_WEIGHT[a.sourceId] : 0.8;
      var contentLengthQuality = Math.min(1, (a.wordCount || MIN_BODY_WORDS) / PREFERRED_BODY_WORDS);
      var userHistory = completedSources[a.source] ? 1 : 0.4;
      var score =
        scientificRelevanceScore(a) * 0.20 +
        informationRichnessScore(a) * 0.15 +
        topicMatch * 0.20 +
        freshness * 0.10 +
        sourceQuality * 0.15 +
        contentLengthQuality * 0.15 +
        userHistory * 0.05;
      return { a: a, score: score };
    }).sort(function (x, y) { return y.score - x.score; });
    return scored.slice(0, limit).map(function (s) { return s.a; });
  }

  // First 1-2 real sentences of the article's own first paragraph — never
  // a fabricated summary, just an honest excerpt of the real text (change
  // list §2: "Short 1-2 sentence summary").
  function summarizeArticle(a) {
    var first = (a.bodyParagraphs && a.bodyParagraphs[0]) || "";
    return splitSentences(first).slice(0, 2).join(" ").trim();
  }

  function todayScienceCardHtml(a, isContinuing) {
    var t = (window.I18N && window.I18N.t) || function (k) { return k; };
    var saved = isSaved(a.id);
    var thumb = a.image ? '<img class="real-thumb grayscale" src="' + a.image + '" alt="">' : "FOTO";
    return (
      '<div class="ts-thumb stripe-ph' + (a.image ? "" : " grayscale") + '">' + thumb + "</div>" +
      '<div class="ts-body">' +
        '<div class="ts-eyebrow">' + (isContinuing ? escapeHtml(t("home.todaysScience.continuing")) : escapeHtml(t("home.todaysScience.recommended"))) + "</div>" +
        '<div class="ts-title">' + escapeHtml(a.title) + "</div>" +
        '<div class="ts-meta"><span>' + escapeHtml(a.source) + "</span><span>·</span><span>" + formatReadTime(a.readTime) +
          (a.preferred ? '</span><span>·</span><span>' + escapeHtml(t("browse.preferred")) : "") + "</span></div>" +
        (summarizeArticle(a) ? '<div class="ts-summary">' + escapeHtml(summarizeArticle(a)) + "</div>" : "") +
        '<div class="ts-foot"><span></span><span class="ts-save' + (saved ? " on" : "") + '" data-save-id="' + escapeHtml(a.id) + '">' + (saved ? "★" : "☆") + "</span></div>" +
      "</div>"
    );
  }

  // Today's Science (change list §2) — up to 3 cards: the in-progress
  // lesson first (if any, never restarted from scratch), then fresh
  // recommendations filling the rest. This is the single primary content
  // block on Home.
  function renderTodayScience() {
    var listEl = document.getElementById("today-science-list");
    var emptyEl = document.getElementById("today-science-empty");
    listEl.innerHTML = "";
    var cards = []; // [{article, isContinuing, onOpen}]
    var p = computeContinueLearning();
    if (p && p.snapshot) {
      cards.push({
        article: p.snapshot, isContinuing: true,
        onOpen: function () {
          var stage = nextIncompleteStage(p);
          if (stage === "buildup") {
            var pos = currentSentenceStepFor(p);
            openArticleObject(p.snapshot, { sentenceIdx: pos.idx, step: pos.step });
          } else {
            openArticleObject(p.snapshot);
            advanceFlow();
          }
        }
      });
    }
    var fill = computeRecommended(3 - cards.length);
    fill.forEach(function (a) {
      cards.push({ article: a, isContinuing: false, onOpen: function () { openArticleObject(a); } });
    });

    if (!cards.length) {
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;
    cards.forEach(function (c) {
      var card = document.createElement("div");
      card.className = "today-science-card";
      card.innerHTML = todayScienceCardHtml(c.article, c.isContinuing);
      card.addEventListener("click", function (e) {
        if (e.target.closest(".ts-save")) return;
        c.onOpen();
      });
      var star = card.querySelector(".ts-save");
      if (star) {
        star.addEventListener("click", function (e) {
          e.stopPropagation();
          var nowSaved = toggleSaved(c.article);
          star.classList.toggle("on", nowSaved);
          star.textContent = nowSaved ? "★" : "☆";
        });
      }
      listEl.appendChild(card);
    });
  }

  function renderHomeSections() {
    document.getElementById("greeting-text").innerHTML = greetingText();
    renderTodayScience();
    renderNotifications();
  }

  // ════════════════════════════════════════════════════════════════════════
  // Detail screen state + build-up rendering
  // ════════════════════════════════════════════════════════════════════════
  var state = { article: null, sentenceIdx: 0, step: 1, drills: [], drillKeywords: [], sessionStartTime: null };

  // Practice flow order after build-up: Shadowing -> Recall -> Comprehension
  // -> Guided Speaking -> Free Response -> Completion. Comprehension/Guided/
  // Free are dismissible (partial progress just isn't marked complete);
  // Shadowing and Recall are short, bounded, and stay non-dismissible like
  // the original Shadowing Mode.
  function nextIncompleteStage(p) {
    if (!p) return "buildup";
    if (p.sentence1Step < 10 || p.sentence2Step < 10 || p.sentence3Step < 10) return "buildup";
    if (!p.shadowingCompleted) return "shadowing";
    if (!p.recallCompleted) return "recall";
    if (!p.comprehensionCompleted) return "comprehension";
    if (!p.guidedSpeakingCompleted) return "guided";
    if (!p.freeResponseCompleted) return "free";
    return "done";
  }
  function stageLabel(stage) {
    var t = window.I18N.t;
    var map = {
      shadowing: "stage.shadowing.full", recall: "stage.recall.full",
      comprehension: "stage.comprehension.full", guided: "stage.guided", free: "stage.free"
    };
    return map[stage] ? t(map[stage]) : "";
  }
  function launchStage(stage) {
    if (stage === "shadowing") startShadowingMode();
    else if (stage === "recall") startRecallMode();
    else if (stage === "comprehension") startComprehensionMode();
    else if (stage === "guided") startGuidedSpeaking();
    else if (stage === "free") startFreeResponse();
    else if (stage === "done") finishLesson();
  }
  function advanceFlow() {
    launchStage(nextIncompleteStage(getProgress(state.article.id)));
  }
  function finishLesson() {
    var p = getProgress(state.article.id);
    if (p && !p.completed) {
      saveProgress(state.article, { completed: true });
      recordArticleCompleted(state.article.id);
    }
    showCompletionScreen();
  }

  // Compact "LESSON PROGRESS" checklist shown in Article Detail.
  function renderLessonChecklist() {
    var t = window.I18N.t;
    var p = getProgress(state.article.id) || {};
    var buildupDone = p.sentence1Step >= 10 && p.sentence2Step >= 10 && p.sentence3Step >= 10;
    var items = [
      [t("stage.read"), true], [t("stage.listen"), true], [t("stage.vocabulary"), true],
      [t("stage.buildup"), buildupDone], [t("stage.shadowing"), !!p.shadowingCompleted],
      [t("stage.recall"), !!p.recallCompleted], [t("stage.comprehension"), !!p.comprehensionCompleted],
      [t("stage.guided"), !!p.guidedSpeakingCompleted], [t("stage.free"), !!p.freeResponseCompleted]
    ];
    document.getElementById("lesson-checklist").innerHTML = items.map(function (it) {
      return '<span class="checklist-item' + (it[1] ? " done" : "") + '">' + (it[1] ? "✓" : "○") + " " + it[0] + "</span>";
    }).join("");
  }

  function stepHtml(stepInfo) {
    var words = stepInfo.words;
    var before = words.slice(0, stepInfo.prevCount).join(" ");
    var added = words.slice(stepInfo.prevCount, stepInfo.count).join(" ");
    if (!before) return "<strong>" + escapeHtml(added) + "</strong>";
    if (!added) return escapeHtml(before);
    return escapeHtml(before) + " <strong>" + escapeHtml(added) + "</strong>";
  }

  function renderChips() {
    var wrap = document.getElementById("step-chips");
    wrap.innerHTML = "";
    for (var i = 1; i <= 10; i++) {
      var c = document.createElement("div");
      c.className = "chip " + (i < state.step ? "done" : i === state.step ? "current" : "upcoming");
      c.textContent = i;
      c.dataset.step = i;
      c.addEventListener("click", function () {
        state.step = parseInt(this.dataset.step, 10);
        renderBuildCard();
      });
      wrap.appendChild(c);
    }
  }

  // Build-up progress only ever moves FORWARD (v0.05 bug fix). Opening an
  // article always renders the build-up card, which used to write step 1
  // straight over a sentence that was already finished — so resuming a
  // lesson from Home at a later stage (Shadowing/Recall/...) silently
  // reset build-up back to sentence 1, step 1, and threw the learner back
  // into a section they'd completed. Re-reading a step is fine; recording
  // a lower step than the one already reached is not.
  // Returns true when this call actually advanced the learner to a step
  // they hadn't reached before — the caller uses that to decide whether
  // it's genuinely new practice worth counting.
  function persistBuildProgress() {
    var key = "sentence" + (state.sentenceIdx + 1) + "Step";
    var existing = getProgress(state.article.id);
    var reached = (existing && existing[key]) || 0;
    if (state.step <= reached) return false;
    var patch = {};
    patch[key] = state.step;
    saveProgress(state.article, patch);
    return true;
  }

  function renderBuildCard() {
    var steps = SentenceBank.buildStepsFromDrill(state.drills[state.sentenceIdx]);
    var info = steps[state.step - 1];
    document.getElementById("step-kicker").textContent = "ADIM " + state.step + " / 10";
    document.getElementById("step-sentence").innerHTML = stepHtml(info);
    var spokenWords = info.words.slice(0, info.count);
    document.getElementById("step-phonetic").textContent = "🔊 Okunuşu: " + Phonetic.sentence(spokenWords);
    document.getElementById("progress-fill").style.width = (state.step * 10) + "%";
    renderChips();
    // Only count practice the first time a step is actually reached
    // (v0.05 bug fix). This used to fire on every render — reopening an
    // article, tapping back to an earlier chip, or switching sentences all
    // added to the daily "sentences practiced" count and to practice
    // minutes, inflating stats the app promises are real.
    if (persistBuildProgress()) recordSentencePractice();

    var hint = document.getElementById("next-hint");
    if (state.step === 10) {
      if (state.sentenceIdx < 2) {
        hint.innerHTML = 'Bu cümleyi tamamladın. <span class="btn-ghost" id="btn-next-sentence" style="cursor:pointer; text-decoration:underline;">Sonraki cümleye geç →</span>';
        document.getElementById("btn-next-sentence").addEventListener("click", function () {
          state.sentenceIdx += 1; state.step = 1;
          updateSegSwitch(); renderBuildCard();
        });
      } else {
        var p = getProgress(state.article.id);
        var buildupDone = p && p.sentence1Step >= 10 && p.sentence2Step >= 10 && p.sentence3Step >= 10;
        if (buildupDone && !p.shadowingCompleted) {
          renderLessonChecklist();
          advanceFlow();
          return;
        }
        hint.textContent = "Bu cümleyi tamamladın.";
      }
    } else {
      hint.textContent = "";
    }
  }

  // Real, locally-computed stats only — never a fabricated number. Words
  // saved for THIS article are looked up by articleId so the list reflects
  // exactly what the user saved during this reading session.
  function showCompletionScreen() {
    var t = window.I18N.t;
    var wrap = document.getElementById("completion-overlay");
    var vocabMap = getVocabMap();
    var newWords = Object.keys(vocabMap)
      .map(function (k) { return vocabMap[k]; })
      .filter(function (w) { return w.articleId === state.article.id; });
    var speakingCount = getSpeakingResponses().filter(function (r) { return r.articleId === state.article.id; }).length;
    var minutes = Math.max(1, Math.round((Date.now() - (state.sessionStartTime || Date.now())) / 60000));

    document.getElementById("completion-stats").innerHTML =
      "<div style=\"display:flex; gap:18px; flex-wrap:wrap; margin:10px 0;\">" +
        completionStatBlock(3, t("completion.sentencesPracticed")) +
        completionStatBlock(minutes, t("completion.minutes")) +
        completionStatBlock(speakingCount, t("completion.speakingResponses")) +
        completionStatBlock(newWords.length, t("completion.wordsSaved")) +
      "</div>";
    renderLessonChecklist();
    document.getElementById("completion-checklist").innerHTML = document.getElementById("lesson-checklist").innerHTML;
    var wordsBlock = document.getElementById("completion-words");
    if (newWords.length) {
      wordsBlock.hidden = false;
      wordsBlock.innerHTML = "<div style=\"font-size:11px; letter-spacing:0.08em; text-transform:uppercase; opacity:0.5; margin-bottom:6px;\">" + escapeHtml(t("completion.newWords")) + "</div>" +
        newWords.map(function (w) { return '<span class="tag tag-neutral" style="margin:0 4px 4px 0;">' + escapeHtml(w.word) + "</span>"; }).join("");
    } else {
      wordsBlock.hidden = true;
    }
    wrap.hidden = false;
  }
  function completionStatBlock(value, label) {
    return "<div><div style=\"font-family:var(--font-heading); font-weight:800; font-size:20px;\">" + value +
      "</div><div style=\"font-size:11px; opacity:0.6;\">" + label + "</div></div>";
  }

  // ── Shadowing Mode — 3 practice styles ───────────────────────────────────
  // Listen → Repeat → Confirm. Deliberately manual — no microphone, no
  // speech recognition, no pronunciation score. The user just tells us they
  // repeated the sentence out loud. Runs once, right after the 3 build-up
  // sentences are finished.
  //
  // v0.12: the 3 styles (full sentence / blanked keyword / hidden-until-
  // revealed) are no longer picked from the article's "difficulty" — this
  // app doesn't label or compare reading difficulty anywhere anymore (see
  // APP_SPEC_PROMPT.md §18/§33). Instead each of the 3 build-up sentences
  // always gets the same style regardless of article: sentence 1 = full
  // sentence, sentence 2 = keyword blanked out, sentence 3 = hidden by
  // default. Same pedagogical variety within an article, no comparison
  // across articles. The blanked word is always exactly the keyword that
  // was substituted into that drill, never a random guess.
  var shadowState = { idx: 0 };
  function startShadowingMode() {
    shadowState.idx = 0;
    document.getElementById("shadowing-overlay").hidden = false;
    renderShadowingCard();
  }
  function renderShadowingCard() {
    var t = window.I18N.t;
    var i = shadowState.idx;
    var fullText = state.drills[i].join(" ");
    var keyword = state.drillKeywords[i % state.drillKeywords.length] || "";
    document.getElementById("shadowing-counter").textContent = t("shadowing.counter", { n: i + 1 });
    var sentenceEl = document.getElementById("shadowing-sentence");
    var hintEl = document.getElementById("shadowing-hint");
    var levelLabel = document.getElementById("shadowing-level-label");
    var btnShow = document.getElementById("btn-shadowing-show");
    hintEl.hidden = true;
    btnShow.hidden = true;
    btnShow.textContent = t("shadowing.showSentence");
    sentenceEl.hidden = false;

    if (i === 0) {
      levelLabel.textContent = t("shadowing.level.guided");
      sentenceEl.textContent = fullText;
    } else if (i === 1) {
      levelLabel.textContent = t("shadowing.level.partial");
      var re = new RegExp("\\b" + keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
      sentenceEl.textContent = keyword ? fullText.replace(re, "______") : fullText;
      if (keyword) { hintEl.hidden = false; hintEl.textContent = t("common.hint") + ": " + keyword; }
    } else {
      levelLabel.textContent = t("shadowing.level.blind");
      sentenceEl.hidden = true;
      btnShow.hidden = false;
      btnShow.dataset.text = fullText;
    }
  }
  document.getElementById("btn-shadowing-listen").addEventListener("click", function () {
    speakQueue([state.drills[shadowState.idx].join(" ")]);
  });
  document.getElementById("btn-shadowing-show").addEventListener("click", function (e) {
    var t = window.I18N.t;
    var sentenceEl = document.getElementById("shadowing-sentence");
    var revealed = !sentenceEl.hidden;
    if (revealed) {
      sentenceEl.hidden = true;
      e.target.textContent = t("shadowing.showSentence");
    } else {
      sentenceEl.textContent = e.target.dataset.text || state.drills[shadowState.idx].join(" ");
      sentenceEl.hidden = false;
      e.target.textContent = t("shadowing.hideSentence");
    }
  });
  document.getElementById("btn-shadowing-next").addEventListener("click", function () {
    shadowState.idx += 1;
    if (shadowState.idx >= 3) {
      saveProgress(state.article, { shadowingCompleted: true });
      document.getElementById("shadowing-overlay").hidden = true;
      renderLessonChecklist();
      advanceFlow();
      return;
    }
    renderShadowingCard();
  });

  // ── Delayed Recall ───────────────────────────────────────────────────────
  // "Can you remember?" — listen once, try to say it from memory, then
  // either confirm or reveal. Not penalizing: no grading, no "wrong" state.
  var recallState = { idx: 0 };
  function startRecallMode() {
    recallState.idx = 0;
    document.getElementById("recall-overlay").hidden = false;
    renderRecallCard();
  }
  function renderRecallCard() {
    var i = recallState.idx;
    document.getElementById("recall-counter").textContent = window.I18N.t("recall.counter", { n: i + 1 });
    document.getElementById("recall-sentence").hidden = true;
    document.getElementById("recall-sentence").textContent = state.drills[i].join(" ");
    document.getElementById("recall-prompts").hidden = false;
    document.getElementById("recall-next-row").hidden = true;
  }
  document.getElementById("btn-recall-listen").addEventListener("click", function () {
    speakQueue([state.drills[recallState.idx].join(" ")]);
  });
  document.getElementById("btn-recall-show").addEventListener("click", function () {
    document.getElementById("recall-sentence").hidden = false;
    document.getElementById("recall-prompts").hidden = true;
    document.getElementById("recall-next-row").hidden = false;
  });
  function recallAdvance() {
    recallState.idx += 1;
    if (recallState.idx >= 3) {
      saveProgress(state.article, { recallCompleted: true });
      document.getElementById("recall-overlay").hidden = true;
      renderLessonChecklist();
      advanceFlow();
      return;
    }
    renderRecallCard();
  }
  document.getElementById("btn-recall-remembered").addEventListener("click", recallAdvance);
  document.getElementById("btn-recall-next").addEventListener("click", recallAdvance);

  // ── Comprehension Check — up to 5 questions, real-data based, never
  // fabricated. Options come from the article's actual topic/vocabulary —
  // not invented facts — so a wrong answer is always genuinely wrong and a
  // right answer is always genuinely right. ─────────────────────────────────
  // (Topic labels for the comprehension "what topic" question now reuse
  // topicLabel() — the same i18n-aware Browse Science labels — instead of
  // a separate hardcoded English-only map, so this question localizes too.)
  var ABSENT_WORD_POOL = ["telescope", "umbrella", "bicycle", "mountain", "festival", "keyboard", "sandwich", "elephant", "holiday", "library", "volcano", "orchestra"];
  function seededShuffle(arr, seedStr) {
    var seed = simpleHash(seedStr) || 1;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      var j = Math.floor((seed / 233280) * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  // ── v0.04: substantially better paragraph-based comprehension ──────────
  // The two checks above (topic / word-presence) are real but shallow —
  // neither requires the learner to have understood what the article
  // actually SAID. These three generators add that, still strictly from
  // real, verifiable article text — never a fabricated fact. Each is
  // conditional: it's only added when the article's own text actually
  // contains the pattern it needs (a number, a "because"-style clause,
  // three other real article titles to use as distractors), so a thin
  // article still gets the basic 2 questions rather than a forced,
  // low-quality 3rd/4th/5th one. (v0.12: the difficulty-guessing question
  // was removed — this app no longer labels or compares reading difficulty
  // anywhere, see APP_SPEC_PROMPT.md §18/§33.)
  var REASON_DISTRACTOR_POOL = [
    "a sudden change in the weather", "new government regulations",
    "a rise in international demand", "advances in unrelated technology",
    "a shortage of skilled workers", "changes in consumer preferences",
    "an increase in competition", "improvements in transportation"
  ];

  // "Which of these is the main idea of this article?" — the correct
  // answer is the article's own real headline; distractors are OTHER
  // real, currently-loaded articles' real headlines. Needs at least 3
  // other articles in the current session's list to build 3 distractors.
  function generateMainIdeaQuestion(article) {
    var others = Object.keys(ARTICLES_BY_ID).map(function (id) { return ARTICLES_BY_ID[id]; })
      .filter(function (a) { return a.id !== article.id && a.title !== article.title; });
    if (others.length < 3) return null;
    var distractorTitles = seededShuffle(others, article.id + "m").slice(0, 3).map(function (a) { return a.title; });
    var options = seededShuffle([article.title].concat(distractorTitles), article.id + "m2");
    return {
      question: window.I18N.t("comprehension.q.mainIdea"),
      options: options,
      correctIndex: options.indexOf(article.title),
      // The correct answer already IS the article's own real headline —
      // the evidence here is the article's own opening sentence, showing
      // the headline is actually what the piece is about.
      evidenceSentence: (splitSentences((article.bodyParagraphs || [])[0] || "")[0] || "").trim()
    };
  }

  // "Fill in the blank" using a real number/percentage from the article's
  // own text — a genuine detail-recall check, not just "which topic".
  // Distractors are the real number scaled up/down/offset, never a fact.
  function perturbNumber(numStr) {
    var hasPercent = /%$/.test(numStr);
    var numeric = parseFloat(numStr.replace(/[^0-9.]/g, ""));
    if (isNaN(numeric) || numeric === 0) return null;
    var candidates = [numeric * 2, numeric / 2, numeric + Math.max(5, Math.round(numeric * 0.4))];
    var seen = {}; seen[numStr] = true;
    var out = [];
    candidates.forEach(function (n) {
      var rounded = (numeric % 1 === 0) ? Math.round(n) : Math.round(n * 10) / 10;
      var text = rounded + (hasPercent ? "%" : "");
      if (!seen[text]) { seen[text] = true; out.push(text); }
    });
    return out.length === 3 ? out : null;
  }
  function generateDetailQuestion(article) {
    var sentences = article.bodyParagraphs.join(" ").match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
    var found = null;
    for (var i = 0; i < sentences.length && !found; i++) {
      var m = sentences[i].match(/\b\d[\d,]*(?:\.\d+)?%\b/) || sentences[i].match(/\b\d[\d,]*(?:\.\d+)?\b/);
      if (m && sentences[i].trim().split(/\s+/).length >= 6) found = { sentence: sentences[i].trim(), number: m[0] };
    }
    if (!found) return null;
    var distractors = perturbNumber(found.number);
    if (!distractors) return null;
    var blanked = found.sentence.replace(found.number, "___");
    var options = seededShuffle([found.number].concat(distractors), article.id + "d");
    return {
      question: window.I18N.t("comprehension.q.fillBlank", { sentence: blanked }),
      options: options,
      correctIndex: options.indexOf(found.number),
      evidenceSentence: found.sentence
    };
  }

  // "Why did X happen, according to the article?" — only generated when
  // the article's own text contains a clean "<effect> because <cause>"
  // (or due to/since/as a result of) sentence to extract from verbatim.
  var CAUSE_SPLIT_RE = /^(.*?)\s+(?:because|due to|since|as a result of)\s+(.*)$/i;
  function generateCauseEffectQuestion(article) {
    var sentences = article.bodyParagraphs.join(" ").match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];
    for (var i = 0; i < sentences.length; i++) {
      var m = CAUSE_SPLIT_RE.exec(sentences[i].trim());
      if (!m) continue;
      var effect = m[1].trim().replace(/[,;:]+$/, "");
      var cause = m[2].trim().replace(/[.!?]+$/, "");
      var effectWords = effect.split(/\s+/).length, causeWords = cause.split(/\s+/).length;
      // Skip matches that would make an unwieldy multiple-choice option —
      // keep looking for a cleaner "because/since/..." in a later sentence
      // rather than accepting the first, possibly very long, match.
      if (effectWords < 4 || effectWords > 18 || causeWords < 3 || causeWords > 15) continue;
      var distractors = seededShuffle(REASON_DISTRACTOR_POOL, article.id + "c" + i).slice(0, 3);
      var options = seededShuffle([cause].concat(distractors), article.id + "c2" + i);
      return {
        question: window.I18N.t("comprehension.q.causeEffect", { effect: effect }),
        options: options,
        correctIndex: options.indexOf(cause),
        evidenceSentence: sentences[i].trim()
      };
    }
    return null;
  }

  function generateComprehensionQuestions(article) {
    var qs = [];
    var allTopics = ["bilim", "cevre", "saglik"];
    var distractorTopics = allTopics.filter(function (t) { return t !== article.topic; });
    var topicOptions = seededShuffle([article.topic].concat(seededShuffle(distractorTopics, article.id).slice(0, 3)), article.id + "t");
    qs.push({
      question: window.I18N.t("comprehension.q.topic"),
      options: topicOptions.map(function (t) { return topicLabel(t); }),
      correctIndex: topicOptions.indexOf(article.topic)
    });
    var bodyLower = article.bodyParagraphs.join(" ").toLowerCase();
    var present = pickImportantWords(article.bodyParagraphs.join(" "));
    if (present.length) {
      var presentWord = present[0];
      var absent = ABSENT_WORD_POOL.filter(function (w) { return bodyLower.indexOf(w) === -1; }).slice(0, 3);
      if (absent.length === 3) {
        var wordOptions = seededShuffle([presentWord].concat(absent), article.id + "w");
        var wordEvidence = "";
        var wordRe = new RegExp("\\b" + presentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
        for (var pi = 0; pi < article.bodyParagraphs.length && !wordEvidence; pi++) {
          var wSentences = splitSentences(article.bodyParagraphs[pi]);
          for (var si = 0; si < wSentences.length; si++) {
            if (wordRe.test(wSentences[si])) { wordEvidence = wSentences[si].trim(); break; }
          }
        }
        qs.push({
          question: window.I18N.t("comprehension.q.wordPresent"),
          options: wordOptions,
          correctIndex: wordOptions.indexOf(presentWord),
          evidenceSentence: wordEvidence
        });
      }
    }
    // Deeper, paragraph-based checks — each only added when the article's
    // real text actually supports it (see comments above); capped so a
    // rich article doesn't turn into a 6-question exam.
    [generateDetailQuestion(article), generateCauseEffectQuestion(article), generateMainIdeaQuestion(article)]
      .forEach(function (q) { if (q && qs.length < 5) qs.push(q); });
    return qs;
  }
  var comprehensionState = { idx: 0, questions: [], correct: 0 };
  function startComprehensionMode() {
    comprehensionState.questions = generateComprehensionQuestions(state.article);
    comprehensionState.idx = 0;
    comprehensionState.correct = 0;
    if (!comprehensionState.questions.length) { // graceful fallback — never block the lesson
      saveProgress(state.article, { comprehensionCompleted: true, comprehensionAttempted: 0, comprehensionCorrect: 0 });
      renderLessonChecklist();
      advanceFlow();
      return;
    }
    document.getElementById("comprehension-overlay").hidden = false;
    renderComprehensionCard();
  }
  function renderComprehensionCard() {
    var q = comprehensionState.questions[comprehensionState.idx];
    document.getElementById("comprehension-counter").textContent = window.I18N.t("comprehension.counter", {
      n: comprehensionState.idx + 1, total: comprehensionState.questions.length
    });
    document.getElementById("comprehension-question").textContent = q.question;
    document.getElementById("comprehension-feedback").hidden = true;
    document.getElementById("btn-comprehension-next").hidden = true;
    document.getElementById("comprehension-options").innerHTML = q.options.map(function (opt, i) {
      return '<div class="comp-option" data-idx="' + i + '">' + escapeHtml(opt) + "</div>";
    }).join("");
  }
  document.getElementById("comprehension-options").addEventListener("click", function (e) {
    var opt = e.target.closest(".comp-option");
    if (!opt || document.getElementById("comprehension-options").classList.contains("answered")) return;
    document.getElementById("comprehension-options").classList.add("answered");
    var idx = parseInt(opt.dataset.idx, 10);
    var q = comprehensionState.questions[comprehensionState.idx];
    var correct = idx === q.correctIndex;
    if (correct) comprehensionState.correct++;
    opt.classList.add(correct ? "correct" : "wrong");
    if (!correct) document.querySelectorAll(".comp-option")[q.correctIndex].classList.add("correct");
    var t = window.I18N.t;
    var fb = document.getElementById("comprehension-feedback");
    fb.hidden = false;
    fb.innerHTML = correct
      ? "✓ " + escapeHtml(t("comprehension.correct"))
      : escapeHtml(t("comprehension.notQuite")) + " \"" + escapeHtml(q.options[q.correctIndex]) + "\".";
    // Evidence-linked comprehension (change list §10) — an actual sentence
    // from the article, never a fabricated justification, shown regardless
    // of whether the answer was right or wrong (never punitive).
    if (q.evidenceSentence) {
      fb.innerHTML += '<div class="comp-evidence"><div class="comp-evidence-label">' +
        escapeHtml(t("comprehension.evidence")) + '</div><div class="comp-evidence-text">“' +
        escapeHtml(q.evidenceSentence) + '”</div></div>';
    }
    document.getElementById("btn-comprehension-next").hidden = false;
  });
  document.getElementById("btn-comprehension-next").addEventListener("click", function () {
    document.getElementById("comprehension-options").classList.remove("answered");
    comprehensionState.idx += 1;
    if (comprehensionState.idx >= comprehensionState.questions.length) {
      saveProgress(state.article, {
        comprehensionCompleted: true,
        comprehensionAttempted: comprehensionState.questions.length,
        comprehensionCorrect: comprehensionState.correct
      });
      document.getElementById("comprehension-overlay").hidden = true;
      renderLessonChecklist();
      advanceFlow();
      return;
    }
    renderComprehensionCard();
  });
  document.getElementById("btn-comprehension-close").addEventListener("click", function () {
    document.getElementById("comprehension-overlay").hidden = true; // dismissible, resumes later
  });

  // ── Guided Speaking + Free Response — written English production, no mic.
  // Own answer -> native TTS reads it back -> user repeats aloud -> confirm.
  // Deterministic, rule-based feedback only; never a fabricated "AI" opinion.
  // ─────────────────────────────────────────────────────────────────────────
  // v0.12: picked deterministically per article (same idea as Free
  // Response's keyword-hash pick below), not by article "difficulty" — this
  // app no longer labels or compares reading difficulty anywhere, see
  // APP_SPEC_PROMPT.md §18/§33. Same article always gets the same prompt
  // length; different articles vary, with no judgment attached to which one
  // a given article lands on.
  // Template text now comes from i18n (guided.q1/q2/q3 + …starter/…guide)
  // so Guided Speaking localizes with the rest of the UI — same 3 original,
  // hand-authored templates as before (change list §9), same deterministic
  // per-article pick, just no longer hardcoded to English only.
  function guidedTemplates(topic) {
    var t = window.I18N.t;
    return [
      { q: t("guided.q1", { topic: topic }), starter: t("guided.q1.starter", { topic: topic }), guide: t("guided.q1.guide") },
      { q: t("guided.q2", { topic: topic }), starter: t("guided.q2.starter", { topic: topic }), guide: t("guided.q2.guide") },
      { q: t("guided.q3", { topic: topic }), starter: t("guided.q3.starter", { topic: topic }), guide: t("guided.q3.guide") }
    ];
  }

  function ruleBasedFeedback(text) {
    var t = window.I18N.t;
    var tips = [];
    var trimmed = text.trim();
    if (!trimmed) return tips;
    if (!/^[A-Za-z]/.test(trimmed)) return tips;
    if (!/^[A-Z]/.test(trimmed)) tips.push(t("guided.tip.capital"));
    if (!/[.!?]$/.test(trimmed)) tips.push(t("guided.tip.period"));
    var words = trimmed.split(/\s+/);
    for (var i = 1; i < words.length; i++) {
      if (words[i].toLowerCase() === words[i - 1].toLowerCase() && /^[a-z']+$/i.test(words[i])) {
        tips.push(t("guided.tip.repeatedWord", { word: words[i] }));
        break;
      }
    }
    if (words.length < 4) tips.push(t("guided.tip.tooShort"));
    return tips.slice(0, 3);
  }
  function renderFeedback(containerId, text) {
    var t = window.I18N.t;
    var tips = ruleBasedFeedback(text);
    var el = document.getElementById(containerId);
    if (!tips.length) {
      el.innerHTML = '<div style="opacity:0.7; font-size:12.5px;">' + escapeHtml(t("guided.clearAnswer")) + "</div>";
      return;
    }
    el.innerHTML = '<div style="font-size:11px; letter-spacing:0.06em; text-transform:uppercase; opacity:0.5; margin-bottom:6px;">' + escapeHtml(t("guided.tryThis")) + "</div>" +
      tips.map(function (tip) { return '<div style="font-size:12.5px; opacity:0.75; margin-bottom:4px;">• ' + escapeHtml(tip) + "</div>"; }).join("");
  }

  function startGuidedSpeaking() {
    var p = getProgress(state.article.id) || {};
    var keyword = state.drillKeywords[0] || "this topic";
    var templates = guidedTemplates(keyword);
    var template = templates[simpleHash(state.article.id) % templates.length];
    document.getElementById("guided-question").textContent = template.q;
    document.getElementById("guided-guidance").textContent = template.guide;
    document.getElementById("guided-starter").textContent = template.starter;
    document.getElementById("guided-words").innerHTML = state.drillKeywords.map(function (w) {
      return '<span class="tag tag-neutral guided-word-chip" data-word="' + escapeHtml(w) + '">' + escapeHtml(w) + "</span>";
    }).join("");
    document.getElementById("guided-answer").value = p.guidedSpeakingAnswer || "";
    document.getElementById("guided-result").hidden = true;
    document.getElementById("guided-form").hidden = false;
    document.getElementById("guided-overlay").hidden = false;
  }
  document.getElementById("guided-words").addEventListener("click", function (e) {
    var chip = e.target.closest(".guided-word-chip");
    if (!chip) return;
    var ta = document.getElementById("guided-answer");
    ta.value = (ta.value ? ta.value + " " : "") + chip.dataset.word;
    ta.focus();
  });
  document.getElementById("guided-answer").addEventListener("blur", function () {
    if (state.article) saveProgress(state.article, { guidedSpeakingAnswer: this.value });
  });
  document.getElementById("btn-guided-submit").addEventListener("click", function () {
    var text = document.getElementById("guided-answer").value.trim();
    if (!text) return;
    saveSpeakingResponse("guided", document.getElementById("guided-question").textContent, text);
    document.getElementById("guided-form").hidden = true;
    document.getElementById("guided-result").hidden = false;
    document.getElementById("guided-result-text").textContent = text;
    renderFeedback("guided-feedback", text);
  });
  document.getElementById("btn-guided-listen").addEventListener("click", function () {
    speakQueue([document.getElementById("guided-result-text").textContent]);
  });
  document.getElementById("btn-guided-edit").addEventListener("click", function () {
    document.getElementById("guided-form").hidden = false;
    document.getElementById("guided-result").hidden = true;
  });
  function guidedAdvance() {
    saveProgress(state.article, { guidedSpeakingCompleted: true });
    document.getElementById("guided-overlay").hidden = true;
    renderLessonChecklist();
    advanceFlow();
  }
  document.getElementById("btn-guided-repeated").addEventListener("click", guidedAdvance);
  document.getElementById("btn-guided-skip").addEventListener("click", guidedAdvance);
  document.getElementById("btn-guided-close").addEventListener("click", function () {
    document.getElementById("guided-overlay").hidden = true; // dismissible, draft already saved
  });

  // Same 6-question original bank as before (change list §9) — text now
  // sourced from i18n (free.q1..free.q6) instead of hardcoded English.
  var FREE_RESPONSE_KEYS = ["free.q1", "free.q2", "free.q3", "free.q4", "free.q5", "free.q6"];
  function startFreeResponse() {
    var p = getProgress(state.article.id) || {};
    var keyword = state.drillKeywords[1] || state.drillKeywords[0] || "this issue";
    var idx = simpleHash(keyword) % FREE_RESPONSE_KEYS.length;
    document.getElementById("free-question").textContent = window.I18N.t(FREE_RESPONSE_KEYS[idx], { topic: keyword });
    document.getElementById("free-guidance").textContent = window.I18N.t("free.guidance");
    document.getElementById("free-answer").value = p.freeResponseAnswer || "";
    document.getElementById("free-result").hidden = true;
    document.getElementById("free-form").hidden = false;
    document.getElementById("free-overlay").hidden = false;
  }
  document.getElementById("free-answer").addEventListener("blur", function () {
    if (state.article) saveProgress(state.article, { freeResponseAnswer: this.value });
  });
  document.getElementById("btn-free-submit").addEventListener("click", function () {
    var text = document.getElementById("free-answer").value.trim();
    if (!text) return;
    saveSpeakingResponse("free", document.getElementById("free-question").textContent, text);
    document.getElementById("free-form").hidden = true;
    document.getElementById("free-result").hidden = false;
    document.getElementById("free-result-text").textContent = text;
    renderFeedback("free-feedback", text);
  });
  document.getElementById("btn-free-listen").addEventListener("click", function () {
    speakQueue([document.getElementById("free-result-text").textContent]);
  });
  document.getElementById("btn-free-edit").addEventListener("click", function () {
    document.getElementById("free-form").hidden = false;
    document.getElementById("free-result").hidden = true;
  });
  function freeAdvance() {
    saveProgress(state.article, { freeResponseCompleted: true });
    document.getElementById("free-overlay").hidden = true;
    renderLessonChecklist();
    advanceFlow();
  }
  document.getElementById("btn-free-repeated").addEventListener("click", freeAdvance);
  document.getElementById("btn-free-skip").addEventListener("click", freeAdvance);
  document.getElementById("btn-free-close").addEventListener("click", function () {
    document.getElementById("free-overlay").hidden = true; // dismissible, draft already saved
  });

  document.getElementById("btn-completion-vocab").addEventListener("click", function () {
    document.getElementById("completion-overlay").hidden = true;
    goToVocabScreen();
  });
  document.getElementById("btn-completion-home").addEventListener("click", function () {
    document.getElementById("completion-overlay").hidden = true;
    document.getElementById("btn-back").click();
  });

  function updateSegSwitch() {
    document.querySelectorAll("#seg-switch .seg-item").forEach(function (el) {
      var idx = parseInt(el.dataset.idx, 10);
      el.classList.toggle("active", idx === state.sentenceIdx);
    });
  }

  document.getElementById("seg-switch").addEventListener("click", function (e) {
    var item = e.target.closest(".seg-item");
    if (!item) return;
    state.sentenceIdx = parseInt(item.dataset.idx, 10);
    state.step = 1;
    updateSegSwitch();
    renderBuildCard();
  });

  document.getElementById("build-up-tip").textContent =
    "Önce dinle, sonra devam etmeden önce cümleyi sesli tekrar et.";

  // ════════════════════════════════════════════════════════════════════════
  // Listening — native Android TextToSpeech bridge (window.AndroidTTS) with
  // a browser speechSynthesis fallback for non-Android preview.
  // ════════════════════════════════════════════════════════════════════════
  var hasNativeTts = !!(window.AndroidTTS && window.AndroidTTS.speakAll);
  var browserTtsSupported = "speechSynthesis" in window;

  // window._shadowOnUttStart(idx), when set, is called as each queued
  // utterance begins — used only by the article-listen flow to highlight
  // the sentence currently being spoken (see renderBodyWithSentenceSpans).
  function speakQueue(texts, onDone) {
    if (hasNativeTts) {
      window._shadowTtsDone = onDone || null;
      window.AndroidTTS.speakAll(JSON.stringify(texts));
      return;
    }
    if (!browserTtsSupported) {
      alert("Bu cihazda bir TTS motoru bulunamadı.");
      return;
    }
    window.speechSynthesis.cancel();
    texts.forEach(function (t, idx) {
      var u = new SpeechSynthesisUtterance(t);
      u.lang = "en-US";
      u.rate = speechRate;
      if (window._shadowOnUttStart) u.onstart = (function (i) { return function () { window._shadowOnUttStart(i); }; })(idx);
      if (idx === texts.length - 1 && onDone) u.onend = onDone;
      window.speechSynthesis.speak(u);
    });
  }
  function stopSpeaking() {
    if (hasNativeTts) { window.AndroidTTS.stop(); return; }
    if (browserTtsSupported) window.speechSynthesis.cancel();
  }
  function isSpeaking() {
    if (hasNativeTts) return !!window.AndroidTTS.isSpeaking && window.AndroidTTS.isSpeaking();
    return browserTtsSupported && window.speechSynthesis.speaking;
  }
  window.onNativeTtsStart = function (uttId) {
    var m = /^shadow_utt_(\d+)$/.exec(uttId || "");
    if (m && window._shadowOnUttStart) window._shadowOnUttStart(parseInt(m[1], 10));
  };
  window.onNativeTtsDone = function () {
    setListenState(btnListen, false);
    setArticleListenState(false);
    window._shadowOnUttStart = null;
    clearArticleHighlight();
    if (window._shadowTtsDone) { window._shadowTtsDone(); window._shadowTtsDone = null; }
  };

  var btnListen = document.getElementById("btn-listen");
  btnListen.addEventListener("click", function () {
    if (isSpeaking()) { stopSpeaking(); setListenState(btnListen, false); setArticleListenState(false); return; }
    setArticleListenState(false);
    var steps = SentenceBank.buildStepsFromDrill(state.drills[state.sentenceIdx]);
    var info = steps[state.step - 1];
    var text = info.words.slice(0, info.count).join(" ");
    setListenState(btnListen, true);
    speakQueue([text], function () { setListenState(btnListen, false); });
  });

  // Quick speech-rate presets on the build card — mirror/override the
  // Settings master rate for this session's playback.
  document.querySelectorAll(".rate-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      document.querySelectorAll(".rate-chip").forEach(function (c) { c.classList.remove("tag-accent"); c.classList.add("tag-outline"); });
      chip.classList.remove("tag-outline"); chip.classList.add("tag-accent");
      var rate = parseFloat(chip.dataset.rate);
      speechRate = rate;
      if (window.AndroidTTS && window.AndroidTTS.setRate) window.AndroidTTS.setRate(rate);
    });
  });

  // ── Article listen: seek bar ─────────────────────────────────────────────
  // Synthesized TTS has no fixed audio track to scrub through by time (no
  // native "seek within an utterance" API), so seeking works at sentence
  // granularity instead — genuinely implementable and still gives real
  // forward/back control, rather than faking a time-based scrubber that
  // couldn't actually work. Index 0 = title, 1..N = body sentences (matches
  // the data-utt-idx already used for highlighting).
  var btnListenArticle = document.getElementById("btn-listen-article");
  var articleListen = { offset: 0, currentIdx: 0 };

  function updateArticleSeekUI(absIdx) {
    articleListen.currentIdx = absIdx;
    highlightArticleSentence(absIdx);
    var bar = document.getElementById("article-seek-bar");
    bar.max = articleTtsSentences.length;
    bar.value = absIdx;
    document.getElementById("article-seek-label").textContent = absIdx + " / " + articleTtsSentences.length;
  }
  function seekArticleTo(absIdx) {
    absIdx = Math.max(0, Math.min(articleTtsSentences.length, absIdx));
    var texts, offset;
    if (absIdx <= 0) { texts = [state.article.title].concat(articleTtsSentences); offset = 0; }
    else { texts = articleTtsSentences.slice(absIdx - 1); offset = absIdx; }
    articleListen.offset = offset;
    window._shadowOnUttStart = function (localId) { updateArticleSeekUI(offset + localId); };
    setListenState(btnListen, false);
    setArticleListenState(true);
    document.getElementById("article-seek-row").hidden = false;
    updateArticleSeekUI(absIdx);
    speakQueue(texts, function () {
      setArticleListenState(false);
      clearArticleHighlight();
      window._shadowOnUttStart = null;
      document.getElementById("article-seek-row").hidden = true;
    });
  }
  btnListenArticle.addEventListener("click", function () {
    if (isSpeaking()) {
      stopSpeaking(); setListenState(btnListen, false); setArticleListenState(false);
      clearArticleHighlight(); window._shadowOnUttStart = null;
      document.getElementById("article-seek-row").hidden = true;
      return;
    }
    Store.set(K.listeningSessions, (Store.get(K.listeningSessions, 0) || 0) + 1); // Progress §11
    seekArticleTo(0);
  });
  document.getElementById("btn-article-skip-back").addEventListener("click", function () {
    seekArticleTo(articleListen.currentIdx - 1);
  });
  document.getElementById("btn-article-skip-fwd").addEventListener("click", function () {
    seekArticleTo(articleListen.currentIdx + 1);
  });
  // Seeks on release (change), not every drag tick — each seek restarts
  // synthesis from that sentence, so continuous mid-drag seeking would just
  // sound broken rather than like real scrubbing.
  document.getElementById("article-seek-bar").addEventListener("change", function (e) {
    seekArticleTo(parseInt(e.target.value, 10));
  });

  function setListenState(btn, speaking) {
    btn.classList.toggle("speaking", speaking);
    btn.lastChild.textContent = speaking ? " Durdur" : " Dinle";
  }
  function setArticleListenState(speaking) {
    btnListenArticle.innerHTML = speaking
      ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="6" width="12" height="12"></rect></svg> Durdur'
      : '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="7,5 20,12 7,19"></polygon></svg> Makaleyi Dinle';
  }

  // ════════════════════════════════════════════════════════════════════════
  // Article Detail — opens from a live ARTICLES entry OR a stored snapshot
  // (Continue Learning / Saved / Recently Read), optionally resuming
  // straight into a specific sentence/step instead of starting at Step 1.
  // ════════════════════════════════════════════════════════════════════════
  function openArticleObject(a, resume) {
    state.article = a;
    a.factSheet = a.factSheet || buildFactSheet(a.title || "", a.bodyParagraphs || []);
    document.getElementById("completion-overlay").hidden = true;

    document.getElementById("detail-source").textContent = a.source;
    document.getElementById("detail-readtime").textContent = formatReadTime(a.readTime);
    document.getElementById("detail-title").textContent = a.title;
    // Custom "Bizden Gelenler" pieces (2026-08-17) may have no real external
    // URL (a.link === "") — hide the "Read at source" link entirely rather
    // than pointing it at an empty/self href, same "never a dead control"
    // rule as everywhere else in this file.
    var detailLinkEl = document.getElementById("detail-link");
    if (a.link) { detailLinkEl.href = a.link; detailLinkEl.style.display = ""; }
    else { detailLinkEl.style.display = "none"; }
    renderBodyWithSentenceSpans(a.bodyParagraphs || []);
    applyReadingWidth();
    state.sessionStartTime = Date.now();
    var hero = document.getElementById("detail-hero");
    if (a.image) {
      hero.classList.remove("stripe-ph");
      hero.innerHTML = '<img class="real-thumb grayscale" src="' + a.image + '" alt="">';
    } else {
      hero.classList.add("stripe-ph");
      hero.textContent = "FOTOĞRAF — GRAYSCALE";
    }
    updateSaveButton();

    var fullText = (a.bodyParagraphs || []).join(" ");
    state.sentenceIdx = resume ? resume.sentenceIdx : 0;
    state.step = resume ? resume.step : 1;
    state.drillKeywords = pickTopicKeywords(fullText, 3);
    state.drills = SentenceBank.topicDrills(state.drillKeywords);
    updateSegSwitch();
    renderBuildCard();
    renderGlossary(fullText);
    renderLessonChecklist();
    recordArticleOpened();
    saveProgress(a, {}); // touch lastOpened / snapshot even before any step is taken

    document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
    document.getElementById("screen-detail").classList.add("active");
    window.scrollTo(0, 0);
  }
  function openArticle(id) { if (ARTICLES_BY_ID[id]) openArticleObject(ARTICLES_BY_ID[id]); }

  // Splits each paragraph into sentences and wraps each in a span carrying
  // a stable utterance index (1-based; 0 is reserved for the title) so
  // "Makaleyi Dinle" can highlight the sentence currently being spoken.
  // Also rebuilds the flat text list TTS actually queues.
  var articleTtsSentences = [];
  function renderBodyWithSentenceSpans(paragraphs) {
    var idx = 1;
    articleTtsSentences = [];
    var html = paragraphs.map(function (p) {
      var sentences = splitSentences(p);
      var spans = sentences.map(function (s) {
        var trimmed = s.trim();
        if (!trimmed) return "";
        articleTtsSentences.push(trimmed);
        var span = '<span class="tts-sentence" data-utt-idx="' + idx + '">' + escapeHtml(trimmed) + "</span> ";
        idx++;
        return span;
      }).join("");
      return "<p>" + spans + "</p>";
    }).join("");
    document.getElementById("detail-body").innerHTML = html;
  }
  function highlightArticleSentence(idx) {
    var prev = document.querySelector(".tts-sentence.speaking");
    if (prev) prev.classList.remove("speaking");
    if (idx === 0) return; // title, nothing to highlight in the body
    var el = document.querySelector('.tts-sentence[data-utt-idx="' + idx + '"]');
    if (el) el.classList.add("speaking");
  }
  function clearArticleHighlight() {
    var prev = document.querySelector(".tts-sentence.speaking");
    if (prev) prev.classList.remove("speaking");
  }

  // ---- Reading Mode: width (font size reuses the global Settings scale) ----
  function applyReadingWidth() {
    var width = Store.get(K.readingWidth, "normal");
    var maxWidth = width === "narrow" ? "440px" : width === "wide" ? "none" : "620px";
    document.getElementById("detail-content").style.maxWidth = maxWidth;
    document.getElementById("detail-content").style.margin = maxWidth === "none" ? "0" : "0 auto";
    document.getElementById("glossary-block").style.maxWidth = maxWidth;
    document.getElementById("glossary-block").style.margin = maxWidth === "none" ? "0" : "0 auto";
    document.querySelectorAll(".reading-width-opt").forEach(function (b) {
      b.classList.toggle("tag-accent", b.dataset.width === width);
      b.classList.toggle("tag-outline", b.dataset.width !== width);
    });
  }
  document.querySelectorAll(".reading-width-opt").forEach(function (btn) {
    btn.addEventListener("click", function () {
      Store.set(K.readingWidth, btn.dataset.width);
      applyReadingWidth();
    });
  });
  document.getElementById("btn-reading-font-minus").addEventListener("click", function () {
    var pct = Math.max(85, (parseInt(localStorage.getItem("shadow_font_scale"), 10) || 100) - 5);
    localStorage.setItem("shadow_font_scale", pct);
    applyFontScale(pct);
  });
  document.getElementById("btn-reading-font-plus").addEventListener("click", function () {
    var pct = Math.min(140, (parseInt(localStorage.getItem("shadow_font_scale"), 10) || 100) + 5);
    localStorage.setItem("shadow_font_scale", pct);
    applyFontScale(pct);
  });

  function updateSaveButton() {
    var btn = document.getElementById("btn-detail-save");
    var saved = isSaved(state.article.id);
    btn.classList.toggle("on", saved);
    btn.textContent = saved ? "★" : "☆";
  }
  document.getElementById("btn-detail-save").addEventListener("click", function () {
    toggleSaved(state.article);
    updateSaveButton();
  });

  document.getElementById("btn-back").addEventListener("click", function () {
    stopSpeaking();
    setListenState(btnListen, false);
    setArticleListenState(false);
    document.getElementById("article-seek-row").hidden = true;
    window._shadowOnUttStart = null;
    document.getElementById("screen-detail").classList.remove("active");
    document.getElementById("screen-home").classList.add("active");
    renderList();
    renderHomeSections();
  });

  document.getElementById("btn-share").addEventListener("click", function () {
    var a = state.article;
    var text = a.title + "\n" + a.link;
    if (navigator.share) {
      navigator.share({ title: a.title, text: a.title, url: a.link }).catch(function () {});
    } else {
      alert("Paylaşılacak bağlantı:\n\n" + text);
    }
  });

  // ════════════════════════════════════════════════════════════════════════
  // Glossary — real words from the article + real English dictionary
  // definitions (api.dictionaryapi.dev, free, no key). Each word can be
  // tapped to open a detail sheet with Listen / Save to vocabulary /
  // "I know this", and real glossary words are also highlighted inline
  // inside the article body so they're tappable in context.
  // ════════════════════════════════════════════════════════════════════════
  var GLOSSARY_STOPWORDS = [
    "because", "through", "although", "without", "another", "something",
    "everything", "different", "important", "information", "government",
    "between", "before", "during", "therefore", "however", "really",
    "actually", "probably", "certainly", "especially", "particularly",
    "generally", "basically", "several", "various", "include", "includes",
    "included", "including", "people", "should", "would", "could", "their",
    "there", "these", "those", "other", "after", "against", "yourself"
  ];
  var GLOSSARY_MIN = 5;
  var GLOSSARY_CANDIDATES = 14;
  var currentGlossaryEntries = [];

  function wordCounts(text) {
    var counts = {};
    (text.match(/[A-Za-z']+/g) || []).forEach(function (w) {
      var lower = w.toLowerCase();
      if (lower.length < 7 || GLOSSARY_STOPWORDS.indexOf(lower) !== -1) return;
      counts[lower] = (counts[lower] || 0) + 1;
    });
    return counts;
  }
  function pickImportantWords(text) {
    var counts = wordCounts(text);
    return Object.keys(counts)
      .sort(function (a, b) { return (counts[b] - counts[a]) || (b.length - a.length); })
      .slice(0, GLOSSARY_CANDIDATES);
  }
  var NON_NOUN_ENDINGS = /(ly|ing|ed|ive|ous|ful|less|able|ible)$/;
  function pickTopicKeywords(text, count) {
    var counts = wordCounts(text);
    var nounLike = Object.keys(counts).filter(function (w) { return !NON_NOUN_ENDINGS.test(w); });
    nounLike.sort(function (a, b) { return (counts[b] - counts[a]) || (b.length - a.length); });
    return nounLike.slice(0, count || 3);
  }

  function fetchDefinition(word) {
    return fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(word))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data[0] || !data[0].meanings || !data[0].meanings[0]) return null;
        var meaning = data[0].meanings[0];
        var def = meaning.definitions && meaning.definitions[0] && meaning.definitions[0].definition;
        if (!def) return null;
        return { word: word, pos: meaning.partOfSpeech || "", definition: def };
      })
      .catch(function () { return null; });
  }

  function highlightGlossaryWordsInBody(entries) {
    if (!entries.length) return;
    var bodyEl = document.getElementById("detail-body");
    var pattern = new RegExp("\\b(" + entries.map(function (e) {
      return e.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("|") + ")\\b", "gi");
    // Sentence spans (see renderBodyWithSentenceSpans), not raw <p> — each
    // carries the utterance index used for TTS highlighting, which this
    // must preserve while adding the tappable word wrappers inside it.
    Array.prototype.forEach.call(bodyEl.querySelectorAll(".tts-sentence"), function (span) {
      span.innerHTML = escapeHtml(span.textContent).replace(pattern, function (m) {
        return '<span class="body-word" data-word="' + m.toLowerCase() + '">' + m + "</span>";
      });
    });
  }
  // v0.05: tapping a word in the article body opens the translation
  // bubble (word_bubble.js) right at that word, rather than a full-screen
  // modal with the translation buried at the bottom. EVERY word is
  // tappable now, not just the dotted-underlined glossary picks — the
  // bubble resolves the tap to a word itself, so no per-word markup is
  // needed. "Detay →" inside the bubble still opens the full modal, which
  // is where the English definition and example sentence live.
  WordBubble.init({
    translate: function (word) { return OfflineTranslate.translate(word); },
    isSaved: function (word) { return isWordSaved(word); },
    onListen: function (word) { speakQueue([word]); },
    onSave: function (word) {
      var entry = glossaryEntryFor(word);
      saveVocabWord({
        word: word,
        pos: entry ? entry.pos : "",
        // Words tapped outside the glossary have no fetched English
        // definition; store the offline Turkish meaning instead of
        // inventing one, so the vocabulary list never shows a fake gloss.
        definition: entry ? entry.definition : (OfflineTranslate.translate(word) || word),
        articleId: state.article ? state.article.id : "",
        articleTitle: state.article ? state.article.title : "",
        contextSentence: findContextSentence(word)
      });
      renderVocabScreenIfActive();
    },
    onDetail: function (word) {
      var entry = glossaryEntryFor(word);
      openWordModal(entry || {
        word: word, pos: "",
        definition: "Bu kelime için İngilizce sözlük tanımı yüklenmedi."
      });
    }
  });
  function glossaryEntryFor(word) {
    var lower = String(word).toLowerCase();
    return currentGlossaryEntries.filter(function (g) { return g.word.toLowerCase() === lower; })[0] || null;
  }
  WordBubble.attachTo(document.getElementById("detail-body"));

  var glossaryRequestId = 0;
  function renderGlossary(fullText) {
    var listEl = document.getElementById("glossary-list");
    var requestId = ++glossaryRequestId;
    listEl.innerHTML = '<div class="glossary-loading">Kelimeler aranıyor…</div>';
    currentGlossaryEntries = [];

    var candidates = pickImportantWords(fullText);
    Promise.all(candidates.map(fetchDefinition)).then(function (results) {
      if (requestId !== glossaryRequestId) return;
      var found = results.filter(Boolean).slice(0, Math.max(GLOSSARY_MIN, 8));
      currentGlossaryEntries = found;
      if (!found.length) {
        listEl.innerHTML = '<div class="glossary-loading">Bu makale için kelime bulunamadı.</div>';
        return;
      }
      listEl.innerHTML = found.map(function (entry) {
        return '<div class="glossary-item" data-word="' + escapeHtml(entry.word) + '">' +
          '<div class="glossary-word">' + escapeHtml(entry.word) +
          (entry.pos ? '<span class="pos">' + escapeHtml(entry.pos) + "</span>" : "") + "</div>" +
          '<div class="glossary-def">' + escapeHtml(entry.definition) + "</div>" +
        "</div>";
      }).join("");
      highlightGlossaryWordsInBody(found);
    });
  }
  document.getElementById("glossary-list").addEventListener("click", function (e) {
    var item = e.target.closest(".glossary-item");
    if (!item) return;
    var entry = currentGlossaryEntries.filter(function (g) { return g.word === item.dataset.word; })[0];
    if (entry) openWordModal(entry);
  });

  // ---- Word detail modal (bottom-sheet style dialog) ----
  var wordModalCurrent = null;
  // Turkish translation, v0.05: shown immediately at the TOP of the modal,
  // directly under the headword — no "Çevir" button and no Settings gate.
  // Both existed because translation used to be a network request that
  // might be slow or fail; it's now a synchronous offline dictionary
  // lookup (dict_en_tr.js), so making the user tap a button to trigger an
  // instant local lookup was pure friction. The primary path for a
  // learner is the tap-a-word bubble anyway (word_bubble.js); this modal
  // is the "tell me more" view: English definition + example sentence.
  function renderTrSection(word) {
    var body = document.getElementById("word-modal-tr-body");
    var t = OfflineTranslate.translate(word);
    body.hidden = false;
    body.innerHTML = t
      ? '<span class="tr-result">' + escapeHtml(t) + "</span>"
      : '<span style="opacity:.6;font-style:italic;">Bu kelime offline sözlükte yok.</span>';
  }

  function openWordModal(entry) {
    wordModalCurrent = entry;
    document.getElementById("word-modal-word").textContent = entry.word;
    document.getElementById("word-modal-pos").textContent = entry.pos || "";
    document.getElementById("word-modal-def").textContent = entry.definition;
    document.getElementById("word-modal-example").textContent = generateExampleSentence(entry.word, entry.pos);
    renderTrSection(entry.word);
    updateWordModalButtons();
    document.getElementById("word-modal-backdrop").hidden = false;
  }
  function updateWordModalButtons() {
    if (!wordModalCurrent) return;
    var saved = isWordSaved(wordModalCurrent.word);
    var btnSave = document.getElementById("btn-word-save");
    btnSave.textContent = saved ? "★ Kaydedildi" : "☆ Kelimeyi Kaydet";
    var vocab = getVocabMap()[wordModalCurrent.word.toLowerCase()];
    var known = vocab && vocab.known;
    document.getElementById("btn-word-known").textContent = known ? "✓ Biliyorum (işaretli)" : "✓ Biliyorum";
    document.getElementById("btn-word-known").hidden = !saved;
  }
  document.getElementById("btn-word-close").addEventListener("click", function () {
    document.getElementById("word-modal-backdrop").hidden = true;
  });
  document.getElementById("word-modal-backdrop").addEventListener("click", function (e) {
    if (e.target.id === "word-modal-backdrop") document.getElementById("word-modal-backdrop").hidden = true;
  });
  document.getElementById("btn-word-listen").addEventListener("click", function () {
    if (!wordModalCurrent) return;
    speakQueue([wordModalCurrent.word]);
  });
  document.getElementById("btn-word-save").addEventListener("click", function () {
    if (!wordModalCurrent) return;
    saveVocabWord({
      word: wordModalCurrent.word, pos: wordModalCurrent.pos, definition: wordModalCurrent.definition,
      articleId: state.article ? state.article.id : "", articleTitle: state.article ? state.article.title : "",
      contextSentence: findContextSentence(wordModalCurrent.word)
    });
    updateWordModalButtons();
    renderVocabScreenIfActive();
  });
  document.getElementById("btn-word-known").addEventListener("click", function () {
    if (!wordModalCurrent) return;
    setWordKnown(wordModalCurrent.word, true);
    updateWordModalButtons();
    renderVocabScreenIfActive();
  });

  // Fully offline word translation — see dict_en_tr.js. Used to call
  // Google Translate's public web endpoint over the network; that's gone
  // now, on purpose, so a word's translation works with the phone in
  // airplane mode, same as every other part of a saved lesson. Still
  // returns a Promise (rather than the value directly) so callers/loading
  // states written for the old network version didn't need to change.
  function fetchTurkish(text) {
    return Promise.resolve(OfflineTranslate.translate(text));
  }

  // ════════════════════════════════════════════════════════════════════════
  // My Vocabulary screen
  // ════════════════════════════════════════════════════════════════════════
  function goToVocabScreen() {
    document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
    document.getElementById("screen-vocab").classList.add("active");
    renderVocabScreen();
  }
  document.getElementById("btn-vocab").addEventListener("click", goToVocabScreen);
  document.getElementById("btn-vocab-back").addEventListener("click", function () {
    document.getElementById("screen-vocab").classList.remove("active");
    document.getElementById("screen-home").classList.add("active");
  });
  document.getElementById("btn-vocab-empty-browse").addEventListener("click", function () {
    document.getElementById("btn-vocab-back").click();
  });

  function renderVocabScreenIfActive() {
    if (document.getElementById("screen-vocab").classList.contains("active")) renderVocabScreen();
  }

  var vocabQuery = "", vocabFilter = "all";
  document.getElementById("vocab-search-input").addEventListener("input", function (e) {
    vocabQuery = e.target.value.trim().toLowerCase();
    renderVocabScreen();
  });
  document.getElementById("vocab-filter-row").addEventListener("click", function (e) {
    var chip = e.target.closest(".tag");
    if (!chip) return;
    document.querySelectorAll("#vocab-filter-row .tag").forEach(function (t) { t.classList.remove("tag-accent"); t.classList.add("tag-outline"); });
    chip.classList.remove("tag-outline"); chip.classList.add("tag-accent");
    vocabFilter = chip.dataset.vfilter;
    renderVocabScreen();
  });

  function renderVocabScreen() {
    var map = getVocabMap();
    var today = todayStr();
    var words = Object.keys(map).map(function (k) { return map[k]; }).sort(function (a, b) { return b.savedAt - a.savedAt; });
    var t = (window.I18N && window.I18N.t) || function (k) { return k; };
    var due = wordsDueForReview();
    var reviewCard = document.getElementById("review-card");
    if (due.length) {
      reviewCard.hidden = false;
      document.getElementById("review-due-count").textContent = due.length + " " + t("vocab.words");
    } else {
      reviewCard.hidden = true;
    }

    var filtered = words.filter(function (w) {
      var matchesFilter = vocabFilter === "all" ||
        (vocabFilter === "review" && !w.known && w.reviewDate <= today) ||
        (vocabFilter === "known" && w.known);
      var matchesQuery = !vocabQuery ||
        w.word.toLowerCase().indexOf(vocabQuery) !== -1 ||
        w.definition.toLowerCase().indexOf(vocabQuery) !== -1 ||
        (w.articleTitle || "").toLowerCase().indexOf(vocabQuery) !== -1;
      return matchesFilter && matchesQuery;
    });

    var empty = document.getElementById("vocab-empty");
    var listEl = document.getElementById("vocab-list");
    var noMatch = document.getElementById("vocab-no-match");
    if (!words.length) {
      empty.hidden = false; noMatch.hidden = true; listEl.innerHTML = ""; return;
    }
    empty.hidden = true;
    if (!filtered.length) {
      noMatch.hidden = false; listEl.innerHTML = ""; return;
    }
    noMatch.hidden = true;
    listEl.innerHTML = filtered.map(function (w) {
      var example = ensureExample(w);
      return '<div class="glossary-item">' +
        '<div class="glossary-word">' + escapeHtml(w.word) +
        (w.pos ? '<span class="pos">' + escapeHtml(w.pos) + "</span>" : "") +
        (w.known ? '<span class="tag tag-neutral" style="margin-left:8px; font-size:9px;">' + escapeHtml(t("vocab.known")) + "</span>" : "") + "</div>" +
        '<div class="glossary-def">' + escapeHtml(w.definition) + "</div>" +
        '<div class="glossary-example">' + escapeHtml(example) + "</div>" +
        (w.contextSentence ? '<div class="glossary-example" style="opacity:0.6; margin-top:2px;">' + escapeHtml(t("vocab.readIn")) + (w.articleTitle ? " “" + escapeHtml(w.articleTitle) + "”" : "") + ": “" + escapeHtml(w.contextSentence) + "”</div>" : (w.articleTitle ? '<div style="font-size:11px; opacity:0.5; margin-top:4px;">' + escapeHtml(w.articleTitle) + "</div>" : "")) +
      "</div>";
    }).join("");
  }

  // ---- Review flow (simple flashcards, lightweight spaced repetition) ----
  var reviewQueue = [], reviewIdx = 0;
  document.getElementById("btn-start-review").addEventListener("click", function () {
    reviewQueue = wordsDueForReview();
    reviewIdx = 0;
    if (!reviewQueue.length) return;
    document.getElementById("review-overlay").hidden = false;
    showReviewCard();
  });
  function showReviewCard() {
    if (reviewIdx >= reviewQueue.length) {
      document.getElementById("review-overlay").hidden = true;
      renderVocabScreen();
      return;
    }
    var w = reviewQueue[reviewIdx];
    document.getElementById("review-word").textContent = w.word;
    document.getElementById("review-question").hidden = false;
    document.getElementById("review-answer").hidden = true;
    document.getElementById("review-answer").innerHTML =
      escapeHtml(w.definition) + '<div style="margin-top:10px; font-style:italic; opacity:0.75;">' + escapeHtml(ensureExample(w)) + "</div>";
    document.getElementById("btn-review-show").hidden = false;
    document.getElementById("btn-review-listen").hidden = true;
    document.getElementById("review-grades").hidden = true;
    document.getElementById("review-counter").textContent = (reviewIdx + 1) + " / " + reviewQueue.length;
  }
  document.getElementById("btn-review-listen").addEventListener("click", function () {
    if (reviewQueue[reviewIdx]) speakQueue([reviewQueue[reviewIdx].word]);
  });
  document.getElementById("btn-review-show").addEventListener("click", function () {
    document.getElementById("review-answer").hidden = false;
    document.getElementById("btn-review-show").hidden = true;
    document.getElementById("btn-review-listen").hidden = false;
    document.getElementById("review-grades").hidden = false;
  });
  document.querySelectorAll(".review-grade-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      reviewWord(reviewQueue[reviewIdx].word, btn.dataset.grade);
      reviewIdx++;
      showReviewCard();
    });
  });
  document.getElementById("btn-review-close").addEventListener("click", function () {
    document.getElementById("review-overlay").hidden = true;
    renderVocabScreen();
  });

  // ════════════════════════════════════════════════════════════════════════
  // Progress screen — real locally-stored totals only, no fabricated scores
  // or proficiency claims. Learning History reads from shadow_history (see
  // getDaily's archiving) plus today's still-open record.
  // ════════════════════════════════════════════════════════════════════════
  function goToProgressScreen() {
    document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
    document.getElementById("screen-progress").classList.add("active");
    renderProgressScreen();
  }
  document.getElementById("btn-progress").addEventListener("click", goToProgressScreen);
  document.getElementById("btn-progress-back").addEventListener("click", function () {
    document.getElementById("screen-progress").classList.remove("active");
    document.getElementById("screen-home").classList.add("active");
  });

  function renderProgressScreen() {
    var t = (window.I18N && window.I18N.t) || function (k) { return k; };
    var progressMap = getProgressMap();
    var articlesRead = Object.keys(progressMap).length;
    var articlesCompleted = Object.keys(progressMap).filter(function (id) { return progressMap[id].completed; }).length;
    var wordsSaved = Object.keys(getVocabMap()).length;
    var totalMinutes = Math.round(lifetimeMinutes());
    var hours = Math.floor(totalMinutes / 60), mins = totalMinutes % 60;
    var streak = Store.get(K.streak, { count: 0 });

    document.getElementById("progress-stats").innerHTML =
      progressStatBlock(articlesRead, t("progress.articlesRead")) +
      progressStatBlock(articlesCompleted, t("progress.articlesCompleted")) +
      progressStatBlock(wordsSaved, t("progress.wordsSaved")) +
      progressStatBlock((hours ? hours + "h " : "") + mins + "m", t("progress.minutes")) +
      progressStatBlock(streak.count, t("progress.streak"));

    // Activity counts, not skill scores — see V2 spec §33: no fabricated
    // "Speaking: 84%" style numbers, only how many times each activity type
    // was actually completed.
    var progressEntries = Object.keys(progressMap).map(function (id) { return progressMap[id]; });
    var shadowingCount = progressEntries.filter(function (p) { return p.shadowingCompleted; }).length;
    var recallCount = progressEntries.filter(function (p) { return p.recallCompleted; }).length;
    var comprehensionQCount = progressEntries.reduce(function (s, p) { return s + (p.comprehensionAttempted || 0); }, 0);
    var speaking = getSpeakingResponses();
    var guidedCount = speaking.filter(function (r) { return r.type === "guided"; }).length;
    var freeCount = speaking.filter(function (r) { return r.type === "free"; }).length;
    var listeningCount = Store.get(K.listeningSessions, 0) || 0;
    var wordsReviewedCount = Store.get(K.wordsReviewed, 0) || 0;
    document.getElementById("active-practice-stats").innerHTML =
      progressStatBlock(listeningCount, t("progress.listening")) +
      progressStatBlock(shadowingCount, t("progress.shadowing")) +
      progressStatBlock(recallCount, t("progress.recall")) +
      progressStatBlock(comprehensionQCount, t("progress.comprehension")) +
      progressStatBlock(guidedCount, t("progress.guided")) +
      progressStatBlock(freeCount, t("progress.free")) +
      progressStatBlock(wordsReviewedCount, t("progress.wordsReviewed"));

    var hist = getHistory();
    var today = getDaily();
    var days = Object.keys(hist).map(function (d) { return Object.assign({ date: d }, hist[d]); });
    if (today.articles.length || today.sentences || today.minutes) {
      days.push({ date: today.date, articles: today.articles.length, sentences: today.sentences, minutes: today.minutes });
    }
    days.sort(function (a, b) { return b.date < a.date ? -1 : 1; });
    var historyEl = document.getElementById("history-list");
    var historyEmpty = document.getElementById("history-empty");
    if (!days.length) {
      historyEmpty.hidden = false; historyEl.innerHTML = ""; return;
    }
    historyEmpty.hidden = true;
    var articlesWord = t("settings.dailyGoal.articles"), minutesWord = t("settings.dailyGoal.minutes");
    historyEl.innerHTML = days.map(function (d) {
      return '<div class="history-row">' +
        '<div class="history-date">' + formatHistoryDate(d.date) + "</div>" +
        '<div class="history-meta">' + d.articles + " " + articlesWord + " · " + Math.round(d.minutes) + " " + minutesWord +
          (d.sentences ? " · " + d.sentences : "") + "</div>" +
      "</div>";
    }).join("");
  }
  function progressStatBlock(value, label) {
    return '<div class="progress-stat"><div class="progress-stat-value">' + value + '</div><div class="progress-stat-label">' + label + "</div></div>";
  }
  function formatHistoryDate(dateStr) {
    var d = new Date(dateStr + "T00:00:00");
    var months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    return d.getDate() + " " + months[d.getMonth()];
  }

  // ---- Daily goal (Settings) ----
  document.querySelectorAll('input[name="daily-goal"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      if (radio.checked) { Store.set(K.dailyGoal, parseInt(radio.value, 10)); }
    });
  });

  // ════════════════════════════════════════════════════════════════════════
  // Settings — theme, font size, speech rate, Turkish translations, daily
  // reminder toggle (persisted; actual scheduled notification is not wired
  // in this WebView-preview build — see README).
  // ════════════════════════════════════════════════════════════════════════
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll('#theme-switch input[value="' + theme + '"]').forEach(function (r) { r.checked = true; });
  }
  function applyFontScale(pct) {
    document.documentElement.style.setProperty("--font-scale", (pct / 100).toFixed(2));
    document.getElementById("font-slider").value = pct;
    document.getElementById("font-sample").textContent = pct + "%";
  }
  var speechRate = 1.0;
  function applyRate(pct) {
    speechRate = pct / 100;
    document.getElementById("rate-slider").value = pct;
    document.getElementById("rate-sample").textContent = speechRate.toFixed(1) + "x";
    if (window.AndroidTTS && window.AndroidTTS.setRate) window.AndroidTTS.setRate(speechRate);
  }

  document.getElementById("theme-switch").addEventListener("change", function (e) {
    if (e.target.name !== "theme") return;
    localStorage.setItem("shadow_theme", e.target.value);
    applyTheme(e.target.value);
  });
  document.getElementById("font-slider").addEventListener("input", function (e) {
    var pct = parseInt(e.target.value, 10);
    localStorage.setItem("shadow_font_scale", pct);
    applyFontScale(pct);
  });
  document.getElementById("rate-slider").addEventListener("input", function (e) {
    var pct = parseInt(e.target.value, 10);
    localStorage.setItem("shadow_speech_rate", pct);
    applyRate(pct);
  });
  // (The "always auto-translate" toggle was removed in v0.05 — translation
  // is now always shown instantly, so a toggle for it would have been a
  // control that does nothing.)
  document.getElementById("reminder-toggle").addEventListener("change", function (e) {
    Store.set(K.reminder, e.target.checked ? "1" : "0");
    document.getElementById("reminder-time-row").hidden = !e.target.checked;
    applyReminderSchedule();
  });
  document.getElementById("reminder-time").addEventListener("change", function (e) {
    Store.set("shadow_reminder_time", e.target.value);
    applyReminderSchedule();
  });
  // Real local notification, not just a UI toggle — see MainActivity's
  // ReminderBridge (AlarmManager + NotificationChannel). No-ops harmlessly
  // if window.AndroidReminder isn't present (e.g. desktop browser preview).
  function applyReminderSchedule() {
    var on = Store.get(K.reminder, "0") === "1";
    if (!window.AndroidReminder) return;
    if (!on) { window.AndroidReminder.cancel && window.AndroidReminder.cancel(); return; }
    var time = Store.get("shadow_reminder_time", "19:00").split(":");
    if (window.AndroidReminder.schedule) window.AndroidReminder.schedule(parseInt(time[0], 10), parseInt(time[1], 10));
  }

  // ════════════════════════════════════════════════════════════════════════
  // Content Update module (v0.10) — Settings UI for window.AndroidUpdate
  // (MainActivity.UpdateBridge / ContentUpdateManager.kt, see
  // APP_SPEC_PROMPT.md §31 for the full design). No-ops harmlessly if
  // window.AndroidUpdate isn't present (desktop browser preview) — same
  // fail-soft pattern as AndroidTTS/AndroidReminder above.
  // ════════════════════════════════════════════════════════════════════════
  function formatUpdateCheckedAt(ms) {
    var t = window.I18N.t;
    if (!ms) return t("settings.contentUpdates.notChecked");
    var d = new Date(ms);
    var locale = window.I18N.getLang() === "tr" ? "tr-TR" : "en-US";
    return t("settings.contentUpdates.lastChecked", {
      date: d.toLocaleDateString(locale) + " " + d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
    });
  }
  function renderContentUpdateStatus() {
    var t = window.I18N.t;
    var statusEl = document.getElementById("content-update-status");
    var checkedEl = document.getElementById("content-update-checked");
    var resetBtn = document.getElementById("btn-reset-update");
    var debugEl = document.getElementById("content-update-debug");
    if (!window.AndroidUpdate || !window.AndroidUpdate.getInfo) {
      statusEl.textContent = t("settings.contentUpdates.previewOnly");
      checkedEl.textContent = "";
      resetBtn.style.display = "none";
      if (debugEl) debugEl.textContent = "";
      return;
    }
    var info;
    try { info = JSON.parse(window.AndroidUpdate.getInfo()); } catch (e) { info = {}; }
    statusEl.textContent = info.active
      ? t("settings.contentUpdates.active", { version: info.version }) + (info.notes ? " " + info.notes : "")
      : t("settings.contentUpdates.bundled");
    checkedEl.textContent = formatUpdateCheckedAt(info.checkedAt);
    resetBtn.style.display = info.active ? "" : "none";
    // Debug breadcrumb (added while chasing the "reports success but the
    // app doesn't visibly change" bug, 2026-08-17): shows, from THIS running
    // page load, what shouldInterceptRequest actually decided the last time
    // it ran, and — critically — the live APP_VERSION this exact JS file
    // declares. If a real override is being served, these two lines and the
    // bottom-right badge must all agree with the manifest's version. If
    // they don't, this text tells us where the chain actually breaks
    // without needing adb/logcat from the user's phone.
    if (debugEl) {
      debugEl.textContent =
        "runningAppVersion=" + APP_VERSION +
        "\ninterceptCount=" + info.interceptCount +
        "\nlastIntercept=" + info.lastIntercept;
    }
  }
  document.getElementById("btn-check-update").addEventListener("click", function () {
    var t = window.I18N.t;
    var msgEl = document.getElementById("content-update-message");
    if (!window.AndroidUpdate || !window.AndroidUpdate.checkForUpdate) {
      msgEl.style.display = "block";
      msgEl.textContent = t("settings.contentUpdates.previewOnly");
      return;
    }
    msgEl.style.display = "block";
    msgEl.textContent = t("settings.contentUpdates.checking");
    window.AndroidUpdate.checkForUpdate();
  });
  document.getElementById("btn-reset-update").addEventListener("click", function () {
    if (!window.AndroidUpdate || !window.AndroidUpdate.resetToBundled) return;
    window.AndroidUpdate.resetToBundled();
  });
  // Called by MainActivity.UpdateBridge.checkForUpdate() once the check (and,
  // if a newer version existed, the download+verify+apply) finishes — always
  // called with a real result, success or failure, never left hanging.
  window.onContentUpdateResult = function (jsonStr) {
    var t = window.I18N.t;
    var result;
    try { result = JSON.parse(jsonStr); } catch (e) { result = { status: "error", message: "Unexpected response." }; }
    var msgEl = document.getElementById("content-update-message");
    msgEl.style.display = "block";
    var labels = {
      up_to_date: t("settings.contentUpdates.upToDate"),
      updated: t("settings.contentUpdates.updated", { version: result.version }),
      offline: t("settings.contentUpdates.offline", { message: result.message }),
      error: t("settings.contentUpdates.error", { message: result.message })
    };
    msgEl.textContent = labels[result.status] || result.message || t("settings.contentUpdates.unknown");
    renderContentUpdateStatus();
  };
  window.onContentUpdateReset = function () {
    var msgEl = document.getElementById("content-update-message");
    msgEl.style.display = "block";
    msgEl.textContent = window.I18N.t("settings.contentUpdates.resetDone");
    renderContentUpdateStatus();
  };

  function switchScreen(fromId, toId) {
    var from = document.getElementById(fromId), to = document.getElementById(toId);
    if (from) from.classList.remove("active");
    if (to) to.classList.add("active");
  }

  document.getElementById("btn-settings").addEventListener("click", function () {
    var t = (window.I18N && window.I18N.t) || function (k) { return k; };
    document.getElementById("settings-username").textContent = localStorage.getItem("shadow_user") || t("common.guest");
    switchScreen("screen-home", "screen-settings");
    renderContentUpdateStatus();
    renderDataSection();
  });
  document.getElementById("btn-settings-back").addEventListener("click", function () {
    switchScreen("screen-settings", "screen-home");
  });

  // ---- Browse Science / Saved Articles (v0.13 — moved off Home, §2) ----
  document.getElementById("btn-home-browse").addEventListener("click", function () {
    switchScreen("screen-home", "screen-browse-science");
  });
  document.getElementById("btn-home-saved").addEventListener("click", function () {
    activeStatus = "saved";
    document.querySelectorAll("#status-row-filter .tag").forEach(function (chip) {
      var on = chip.dataset.status === "saved";
      chip.classList.toggle("tag-accent", on); chip.classList.toggle("tag-outline", !on);
    });
    applyFilters();
    switchScreen("screen-home", "screen-browse-science");
  });
  document.getElementById("btn-browse-back").addEventListener("click", function () {
    switchScreen("screen-browse-science", "screen-home");
    // Reset the status filter so the next "Browse Science" visit starts
    // unfiltered rather than inheriting a "Saved Articles" shortcut's state.
    activeStatus = "all";
    document.querySelectorAll("#status-row-filter .tag").forEach(function (chip) {
      var on = chip.dataset.status === "all";
      chip.classList.toggle("tag-accent", on); chip.classList.toggle("tag-outline", !on);
    });
    applyFilters();
  });

  // ---- About / Changelog (v0.13 — moved out of Settings, §3) ----
  document.getElementById("btn-open-about").addEventListener("click", function () {
    switchScreen("screen-settings", "screen-about");
  });
  document.getElementById("btn-about-back").addEventListener("click", function () {
    switchScreen("screen-about", "screen-settings");
  });
  document.getElementById("btn-open-changelog").addEventListener("click", function () {
    switchScreen("screen-about", "screen-changelog");
  });
  document.getElementById("btn-changelog-back").addEventListener("click", function () {
    switchScreen("screen-changelog", "screen-about");
  });

  // ---- Language (v0.13, §4) — UI chrome only, never article text. ----
  document.getElementById("lang-switch").addEventListener("change", function (e) {
    if (e.target.name !== "lang") return;
    window.I18N.setLang(e.target.value);
  });
  window.addEventListener("buildo:langchange", function () {
    renderHomeSections();
    renderVersionAndChangelog();
    renderContentUpdateStatus();
    renderDataSection();
    renderOnboarding();
    if (document.getElementById("screen-vocab").classList.contains("active")) renderVocabScreen();
    if (document.getElementById("screen-progress").classList.contains("active")) renderProgressScreen();
    if (document.getElementById("screen-browse-science").classList.contains("active")) renderList();
    if (document.getElementById("screen-custom-articles").classList.contains("active")) renderCustomArticleList();
  });

  // ---- Generic confirm overlay (§ above index.html comment) ----
  function showConfirm(message, onConfirm) {
    document.getElementById("confirm-message").textContent = message;
    document.getElementById("confirm-overlay").hidden = false;
    var okBtn = document.getElementById("btn-confirm-ok");
    var cancelBtn = document.getElementById("btn-confirm-cancel");
    function cleanup() {
      document.getElementById("confirm-overlay").hidden = true;
      okBtn.removeEventListener("click", onOk);
      cancelBtn.removeEventListener("click", onCancel);
    }
    function onOk() { cleanup(); onConfirm(); }
    function onCancel() { cleanup(); }
    okBtn.addEventListener("click", onOk);
    cancelBtn.addEventListener("click", onCancel);
  }

  // ---- Data: export / import / reset / storage usage (v0.13, §17-§19) ----
  var DATA_RAW_KEYS = [
    "shadow_user", "shadow_theme", "shadow_font_scale", "shadow_speech_rate",
    "shadow_lang", "shadow_reading_width", "shadow_reminder_time", "shadow_onboarded"
  ];
  var DATA_LEARNING_KEYS = [K.progress, K.saved, K.vocab, K.daily, K.history, K.speaking, K.streak, K.listeningSessions, K.wordsReviewed];
  function collectExportData() {
    var data = { schemaVersion: DATA_SCHEMA_VERSION, appVersion: APP_VERSION, exportedAt: new Date().toISOString(), store: {} };
    Object.keys(K).forEach(function (k) { data.store[K[k]] = Store.get(K[k], null); });
    data.store[SOURCE_HEALTH_KEY] = Store.get(SOURCE_HEALTH_KEY, null);
    DATA_RAW_KEYS.forEach(function (key) {
      var v = localStorage.getItem(key);
      if (v != null) data.store[key] = v;
    });
    return data;
  }
  // Expected shape per storage key — the real type/schema check behind
  // change list §12 ("validate expected object types... reject malformed/
  // incompatible data"). Anything not listed here (a future key an older
  // build of this file doesn't know about yet) is passed through
  // unvalidated rather than rejected, so an import never fails just
  // because it's slightly newer than expected.
  var DATA_KEY_SHAPES = {};
  DATA_KEY_SHAPES[K.progress] = "object";
  DATA_KEY_SHAPES[K.saved] = "object";
  DATA_KEY_SHAPES[K.vocab] = "object";
  DATA_KEY_SHAPES[K.daily] = "object";
  DATA_KEY_SHAPES[K.history] = "object";
  DATA_KEY_SHAPES[K.speaking] = "array";
  DATA_KEY_SHAPES[K.streak] = "object";
  DATA_KEY_SHAPES[K.dailyGoal] = "number";
  DATA_KEY_SHAPES[K.listeningSessions] = "number";
  DATA_KEY_SHAPES[K.wordsReviewed] = "number";
  DATA_KEY_SHAPES[SOURCE_HEALTH_KEY] = "object";
  function valueMatchesShape(val, shape) {
    if (shape === "array") return Array.isArray(val);
    if (shape === "object") return val !== null && typeof val === "object" && !Array.isArray(val);
    if (shape === "number") return typeof val === "number" && isFinite(val);
    return true;
  }
  // Validates the ENTIRE import before writing a single key (true all-or-
  // nothing, §12) — a malformed value for key #7 out of 10 must not leave
  // keys #1-6 already overwritten. Two passes: validate everything first
  // (throws on the first problem, nothing written yet), then apply.
  function applyImportedData(parsed) {
    if (!parsed || typeof parsed !== "object") throw new Error("not a Buildo backup: not an object");
    if (typeof parsed.schemaVersion !== "number") throw new Error("not a Buildo backup: missing schemaVersion");
    if (parsed.schemaVersion > DATA_SCHEMA_VERSION) throw new Error("this backup was made by a newer version of Buildo");
    if (!parsed.store || typeof parsed.store !== "object" || Array.isArray(parsed.store)) {
      throw new Error("not a Buildo backup: missing store");
    }
    var keys = Object.keys(parsed.store);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i], val = parsed.store[key];
      if (val == null || DATA_RAW_KEYS.indexOf(key) !== -1) continue; // raw settings values are permissive strings
      var expected = DATA_KEY_SHAPES[key];
      if (expected && !valueMatchesShape(val, expected)) {
        throw new Error("invalid data for \"" + key + "\" (expected " + expected + ")");
      }
    }
    // Every key validated — now actually write it. Nothing above this line
    // touched localStorage, so a thrown error above left existing data
    // completely untouched.
    keys.forEach(function (key) {
      var val = parsed.store[key];
      if (val == null) return;
      if (DATA_RAW_KEYS.indexOf(key) !== -1) localStorage.setItem(key, String(val));
      else Store.set(key, val);
    });
  }
  function computeStorageUsageLabel() {
    var total = 0;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        total += k.length + (localStorage.getItem(k) || "").length;
      }
    } catch (e) { /* storage unavailable */ }
    var kb = total / 1024;
    return kb < 1024 ? (Math.round(kb * 10) / 10) + " KB" : (Math.round(kb / 102.4) / 10) + " MB";
  }
  function renderDataSection() {
    var usageEl = document.getElementById("settings-storage-usage");
    if (usageEl) usageEl.textContent = computeStorageUsageLabel();
  }
  document.getElementById("btn-data-export").addEventListener("click", function () {
    var msgEl = document.getElementById("data-message");
    var json = JSON.stringify(collectExportData());
    if (window.AndroidExport && window.AndroidExport.shareText) {
      window.AndroidExport.shareText(json);
    } else {
      // No native bridge (e.g. desktop preview) — show the JSON directly so
      // it can still be selected/copied by hand, same fail-soft pattern as
      // AndroidTTS/AndroidReminder/AndroidUpdate elsewhere in this file.
      msgEl.style.display = "block";
      msgEl.style.wordBreak = "break-all";
      msgEl.style.maxHeight = "160px";
      msgEl.style.overflowY = "auto";
      msgEl.textContent = json;
    }
  });
  document.getElementById("btn-data-import").addEventListener("click", function () {
    var row = document.getElementById("data-import-row");
    row.hidden = !row.hidden;
  });
  document.getElementById("btn-data-import-apply").addEventListener("click", function () {
    var t = window.I18N.t;
    var msgEl = document.getElementById("data-message");
    var raw = document.getElementById("data-import-text").value.trim();
    msgEl.style.display = "block";
    msgEl.style.wordBreak = "normal"; msgEl.style.maxHeight = ""; msgEl.style.overflowY = "";
    try {
      var parsed = JSON.parse(raw);
      applyImportedData(parsed);
      msgEl.textContent = t("settings.data.importDone");
      document.getElementById("data-import-text").value = "";
      renderDataSection();
      renderHomeSections();
    } catch (e) {
      msgEl.textContent = t("settings.data.importError");
    }
  });
  document.getElementById("btn-data-reset").addEventListener("click", function () {
    var t = window.I18N.t;
    showConfirm(t("settings.data.resetConfirm"), function () {
      DATA_LEARNING_KEYS.forEach(function (key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } });
      var msgEl = document.getElementById("data-message");
      msgEl.style.display = "block";
      msgEl.textContent = t("settings.data.resetDone");
      renderDataSection();
      renderHomeSections();
    });
  });

  window.shadowGoBack = function () {
    if (!document.getElementById("confirm-overlay").hidden) {
      document.getElementById("btn-confirm-cancel").click(); return true;
    }
    if (!document.getElementById("word-modal-backdrop").hidden) {
      document.getElementById("word-modal-backdrop").hidden = true; return true;
    }
    if (!document.getElementById("review-overlay").hidden) {
      document.getElementById("review-overlay").hidden = true; return true;
    }
    if (!document.getElementById("completion-overlay").hidden) {
      document.getElementById("completion-overlay").hidden = true; return true;
    }
    if (!document.getElementById("shadowing-overlay").hidden) {
      return true; // force the user through Listen/Repeat rather than back out mid-shadowing
    }
    if (document.getElementById("screen-changelog").classList.contains("active")) {
      document.getElementById("btn-changelog-back").click(); return true;
    }
    if (document.getElementById("screen-about").classList.contains("active")) {
      document.getElementById("btn-about-back").click(); return true;
    }
    if (document.getElementById("screen-browse-science").classList.contains("active")) {
      document.getElementById("btn-browse-back").click(); return true;
    }
    if (document.getElementById("screen-custom-articles").classList.contains("active")) {
      document.getElementById("btn-custom-back").click(); return true;
    }
    if (document.getElementById("screen-vocab").classList.contains("active")) {
      document.getElementById("btn-vocab-back").click(); return true;
    }
    if (document.getElementById("screen-progress").classList.contains("active")) {
      document.getElementById("btn-progress-back").click(); return true;
    }
    if (document.getElementById("screen-settings").classList.contains("active")) {
      document.getElementById("btn-settings-back").click();
      return true;
    }
    if (document.getElementById("screen-detail").classList.contains("active")) {
      document.getElementById("btn-back").click();
      return true;
    }
    return false;
  };

  // ════════════════════════════════════════════════════════════════════════
  // Onboarding (2 pages, shown once) -> Login (cosmetic, no account) -> Home
  // ════════════════════════════════════════════════════════════════════════
  var obPage = 1;
  function renderOnboarding() {
    document.querySelectorAll(".ob-page").forEach(function (p) {
      p.classList.toggle("active", parseInt(p.dataset.page, 10) === obPage);
    });
    document.querySelectorAll(".ob-dots .dot").forEach(function (d) {
      d.classList.toggle("active", parseInt(d.dataset.dot, 10) === obPage);
    });
    var t = (window.I18N && window.I18N.t) || function (k) { return k; };
    document.getElementById("btn-ob-next").textContent = obPage === 2 ? t("onboarding.start") : t("onboarding.next");
  }
  function finishOnboarding() {
    localStorage.setItem("shadow_onboarded", "1");
    document.getElementById("screen-onboarding").classList.remove("active");
    goToLoginOrHome();
  }
  document.getElementById("btn-ob-next").addEventListener("click", function () {
    if (obPage === 2) { finishOnboarding(); return; }
    obPage = 2; renderOnboarding();
  });
  document.getElementById("btn-ob-skip").addEventListener("click", finishOnboarding);
  document.querySelectorAll(".ob-step-demo .chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var n = parseInt(chip.dataset.demoStep, 10);
      var demo = ["This", "This news", "This news story", "This news story is", "This news story is about", "This news story is about learning English"];
      document.getElementById("ob-demo-text").textContent = demo[Math.min(n, demo.length - 1)];
      document.querySelectorAll(".ob-step-demo .chip").forEach(function (c, i) {
        c.classList.toggle("current", i === n);
      });
    });
  });

  function goHome() {
    document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
    document.getElementById("screen-home").classList.add("active");
    loadArticles();
    renderHomeSections();
  }
  function goToLoginOrHome() {
    if (localStorage.getItem("shadow_user")) { goHome(); return; }
    document.getElementById("screen-login").classList.add("active");
  }

  document.getElementById("btn-login").addEventListener("click", function () {
    var name = document.getElementById("login-name").value.trim();
    if (!name) { document.getElementById("login-name").focus(); return; }
    localStorage.setItem("shadow_user", name);
    document.getElementById("screen-login").classList.remove("active");
    goHome();
  });
  document.getElementById("login-name").addEventListener("keydown", function (e) {
    if (e.key === "Enter") document.getElementById("btn-login").click();
  });

  // ════════════════════════════════════════════════════════════════════════
  // Boot
  // ════════════════════════════════════════════════════════════════════════
  applyTheme(localStorage.getItem("shadow_theme") || "light");
  applyFontScale(parseInt(localStorage.getItem("shadow_font_scale"), 10) || 100);
  applyRate(parseInt(localStorage.getItem("shadow_speech_rate"), 10) || 100);
  var reminderOn = Store.get(K.reminder, "0") === "1";
  document.getElementById("reminder-toggle").checked = reminderOn;
  document.getElementById("reminder-time-row").hidden = !reminderOn;
  document.getElementById("reminder-time").value = Store.get("shadow_reminder_time", "19:00");
  applyReminderSchedule();
  (function () {
    var goal = String(Store.get(K.dailyGoal, 2));
    var radio = document.querySelector('input[name="daily-goal"][value="' + goal + '"]');
    if (radio) radio.checked = true;
  })();
  (function () {
    var lang = (window.I18N && window.I18N.getLang) ? window.I18N.getLang() : "tr";
    var radio = document.querySelector('input[name="lang"][value="' + lang + '"]');
    if (radio) radio.checked = true;
  })();
  renderDataSection();

  if (localStorage.getItem("shadow_onboarded")) {
    document.getElementById("screen-onboarding").classList.remove("active");
    goToLoginOrHome();
  } else {
    renderOnboarding();
  }
})();
