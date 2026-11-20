/*
 * Inhalte der Website von Emmanuel Kervyn.
 *
 * Quelle: alte Weebly-Seite emmanuelkervyn.com (Stand November 2026).
 * Französisch ist das Original und der Fallback. Deutsch und Englisch sind
 * Übersetzungen aus dem Französischen.
 *
 * Konventionen
 *   L(fr, de, en)   mehrsprachiger Text
 *   Werktitel bleiben im Original (Französisch), nur Material und Notizen werden übersetzt.
 *   img: "<bereich>/<name>"  → images/<bereich>/<name>.webp (Maße in content/media.js)
 *
 * TODO: Übersetzung prüfen – alle DE/EN-Texte in dieser Datei wurden für den
 * Relaunch neu übersetzt und sind noch nicht vom Künstler freigegeben.
 */
(function () {
  "use strict";

  const L = (fr, de, en) => ({ fr, de: de ?? fr, en: en ?? fr });

  /* Materialien: fr, de, en. TODO: Übersetzung prüfen */
  const M = {
    abrasif:      ["point de croix sur abrasif", "Kreuzstich auf Schleifpapier", "cross-stitch on abrasive paper"],
    agglomere:    ["aggloméré", "Spanplatte", "chipboard"],
    beton:        ["béton", "Beton", "concrete"],
    bois:         ["bois", "Holz", "wood"],
    boisDivers:   ["bois divers", "verschiedene Hölzer", "various woods"],
    boisTrouve:   ["bois trouvé", "Fundholz", "found wood"],
    cailloux:     ["cailloux", "Kiesel", "pebbles"],
    carton:       ["carton", "Karton", "cardboard"],
    cendre:       ["cendre", "Asche", "ash"],
    cendres:      ["cendres", "Asche", "ashes"],
    corde:        ["corde", "Seil", "rope"],
    craie:        ["craie", "Kreide", "chalk"],
    dorure:       ["dorure", "Vergoldung", "gilding"],
    feuilles:     ["feuilles", "Blätter", "leaves"],
    feutre:       ["feutre", "Filzstift", "felt-tip pen"],
    feutrePapier: ["feutre sur papier", "Filzstift auf Papier", "felt-tip pen on paper"],
    herbeBrulee:  ["herbe brûlée", "verbranntes Gras", "burnt grass"],
    mdf:          ["MDF", "MDF", "MDF"],
    metal:        ["métal", "Metall", "metal"],
    mousses:      ["mousses", "Moose", "mosses"],
    papier:       ["papier", "Papier", "paper"],
    papierDore:   ["papier doré", "Blattgold-Papier", "gilded paper"],
    pierre:       ["pierre", "Stein", "stone"],
    plastic:      ["plastic", "Kunststoff", "plastic"],
    platre:       ["plâtre", "Gips", "plaster"],
    plomb:        ["plomb", "Blei", "lead"],
    pvc:          ["PVC", "PVC", "PVC"],
    souris:       ["souris", "Maus", "mouse"],
    suie:         ["suie", "Ruß", "soot"],
    temps:        ["temps", "Zeit", "time"],
    terre:        ["terre", "Erde", "earth"],
    toile:        ["toile", "Leinwand", "canvas"],
    verre:        ["verre", "Glas", "glass"],
    video:        ["vidéo", "Video", "video"],
    ytong:        ["Ytong", "Ytong", "Ytong"],
  };
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const mat = (...keys) => {
    const pick = (i) => cap(keys.map((k) => M[k][i]).join(", "));
    return L(pick(0), pick(1), pick(2));
  };

  /* Werk: img, Titel (Original), Material, weitere Angaben */
  const w = (img, title, material, extra) => Object.assign({ img, title: title || null, material: material || null }, extra || {});

  const SANS = "Sans titre";

  window.CONTENT = {
    site: {
      name: "Emmanuel Kervyn",
      url: "https://www.emmanuelkervyn.com/",
      title: L(
        "Emmanuel Kervyn — papier, volumes, installations, vidéo",
        "Emmanuel Kervyn — Papier, Volumen, Installationen, Video",
        "Emmanuel Kervyn — paper, volumes, installations, video"
      ),
      description: L(
        "Emmanuel Kervyn (1959), artisan relieur d'art de profession : papier, volumes, installations, performance et vidéo.",
        "Emmanuel Kervyn (1959), Kunstbuchbinder von Beruf: Papier, Volumen, Installationen, Performance und Video.",
        "Emmanuel Kervyn (1959), fine bookbinder by profession: paper, volumes, installations, performance and video."
      ),
    },

    /* Oberflächentexte. TODO: Übersetzung prüfen */
    ui: {
      fr: {
        skip: "Aller au contenu",
        menu: "Menu",
        close: "Fermer",
        prev: "Image précédente",
        next: "Image suivante",
        viewer: "Visionneuse d'images",
        enlarge: "Agrandir l'image",
        style: "Style d'affichage",
        styles: { minimal: "Minimal", edel: "Élégant", schrill: "Éclatant" },
        lang: "Langue",
        langs: { fr: "Français", de: "Deutsch", en: "English" },
        nav: "Navigation principale",
        exhibitions: "Expositions",
        bio: "Bio",
        stills: "Images extraites",
        playVideo: "Lire la vidéo",
        loadVideo: "Charger la vidéo depuis Vimeo",
        vimeoNote: "En cliquant, la vidéo est chargée depuis vimeo.com. Des données sont alors transmises à Vimeo.",
        email: "E-mail",
        phone: "Téléphone",
        legal: "Mentions légales",
        privacy: "Protection des données",
        translated: null,
        backToTop: "Retour en haut",
        plate: "Pl.",
        contents: "Sommaire",
        previous: "Précédent",
        following: "Suivant",
        works: "œuvres",
        scrollHint: "Faire défiler",
      },
      de: {
        skip: "Zum Inhalt springen",
        menu: "Menü",
        close: "Schließen",
        prev: "Vorheriges Bild",
        next: "Nächstes Bild",
        viewer: "Bildansicht",
        enlarge: "Bild vergrößern",
        style: "Darstellung",
        styles: { minimal: "Minimal", edel: "Edel", schrill: "Schrill" },
        lang: "Sprache",
        langs: { fr: "Français", de: "Deutsch", en: "English" },
        nav: "Hauptnavigation",
        exhibitions: "Ausstellungen",
        bio: "Bio",
        stills: "Standbilder",
        playVideo: "Video abspielen",
        loadVideo: "Video von Vimeo laden",
        vimeoNote: "Mit dem Klick wird das Video von vimeo.com geladen. Dabei werden Daten an Vimeo übertragen.",
        email: "E-Mail",
        phone: "Telefon",
        legal: "Impressum",
        privacy: "Datenschutz",
        translated: "Übersetzung aus dem Französischen",
        backToTop: "Nach oben",
        plate: "Taf.",
        contents: "Inhalt",
        previous: "Zurück",
        following: "Weiter",
        works: "Werke",
        scrollHint: "Scrollen",
      },
      en: {
        skip: "Skip to content",
        menu: "Menu",
        close: "Close",
        prev: "Previous image",
        next: "Next image",
        viewer: "Image viewer",
        enlarge: "Enlarge image",
        style: "Display style",
        styles: { minimal: "Minimal", edel: "Elegant", schrill: "Vivid" },
        lang: "Language",
        langs: { fr: "Français", de: "Deutsch", en: "English" },
        nav: "Main navigation",
        exhibitions: "Exhibitions",
        bio: "Bio",
        stills: "Stills",
        playVideo: "Play video",
        loadVideo: "Load video from Vimeo",
        vimeoNote: "Clicking loads the video from vimeo.com, which transmits data to Vimeo.",
        email: "Email",
        phone: "Phone",
        legal: "Legal notice",
        privacy: "Privacy",
        translated: "Translated from French",
        backToTop: "Back to top",
        plate: "Pl.",
        contents: "Contents",
        previous: "Previous",
        following: "Next",
        works: "works",
        scrollHint: "Scroll",
      },
    },

    sections: [
      /* ------------------------------------------------------------ Accueil */
      {
        id: "accueil",
        type: "home",
        nav: L("Accueil", "Start", "Home"),
        image: {
          img: "accueil/accueil",
          // Kein Titel auf der alten Seite. TODO: Werktitel beim Künstler erfragen.
          alt: L(
            "Œuvre d'Emmanuel Kervyn : détail imprimé de la Joconde, une fine bande de papier découpée s'échappe de la bouche.",
            "Werk von Emmanuel Kervyn: gedrucktes Detail der Mona Lisa, ein schmaler, ausgeschnittener Papierstreifen löst sich vom Mund.",
            "Work by Emmanuel Kervyn: printed detail of the Mona Lisa, a thin cut strip of paper peels away from the mouth."
          ),
        },
        headline: "Sans titre, ohne Titel, untitled.",
        statement: L(
          "Il arrive que la forme se nomme elle-même, se raconte à vous-mêmes, et ce sera pour chacun une autre histoire. C'est la règle, il n'y a pas de règle. S'il n'y a pas de titre, ne cherchez pas, c'est qu'il n'y a rien à dire, à dire ce rien. Mais il y a à voir. J'espère que cela suffit.",
          // TODO: Übersetzung prüfen
          "Es kommt vor, dass die Form sich selbst benennt, sich Ihnen selbst erzählt, und für jeden wird es eine andere Geschichte sein. Das ist die Regel: Es gibt keine Regel. Wenn es keinen Titel gibt, suchen Sie nicht – dann gibt es nichts zu sagen, dieses Nichts zu sagen. Aber es gibt etwas zu sehen. Ich hoffe, das genügt.",
          // TODO: Übersetzung prüfen
          "Sometimes the form names itself, tells itself to you, and for each of you it will be a different story. That is the rule: there is no rule. If there is no title, don't go looking – it means there is nothing to say, to say this nothing. But there is something to see. I hope that is enough."
        ),
        // Auf der alten Seite folgt nach „Je tire le fil.“ noch das einzelne Wort „Multimedia“.
        // Es wirkt wie ein Überbleibsel und wurde weggelassen. TODO: beim Künstler nachfragen.
        text: L(
          [
            "D'un chemin qui commence avec un bout de papier, puis deux quand il est déchiré, de dé-figuration en abstraction, l'A4 a pris du volume, s'est déployé, le mur ne suffit plus.",
            "Le geste conduit à l'œuvre, puis à la suivante. toute autre, autre matériau. l'étiquette est étriquée. La cohérence se drape de vertu, que j'entaille à coups réguliers, répétés, répétés. Je tire le fil.",
          ],
          // TODO: Übersetzung prüfen
          [
            "Auf einem Weg, der mit einem Stück Papier beginnt, dann zwei, wenn es zerrissen ist, von Ent-Stellung zu Abstraktion, hat das A4 an Volumen gewonnen, hat sich entfaltet – die Wand reicht nicht mehr aus.",
            "Die Geste führt zum Werk, dann zum nächsten. ganz anders, anderes Material. das Etikett ist zu eng. Die Kohärenz hüllt sich in Tugend, in die ich mit regelmäßigen, wiederholten, wiederholten Schnitten kerbe. Ich ziehe den Faden.",
          ],
          // TODO: Übersetzung prüfen
          [
            "Along a path that begins with a scrap of paper, then two once it is torn, from dis-figuration to abstraction, the A4 sheet has gained volume, has unfolded – the wall is no longer enough.",
            "The gesture leads to the work, then to the next. entirely different, a different material. the label is too narrow. Coherence drapes itself in virtue, which I notch with regular, repeated, repeated cuts. I pull the thread.",
          ]
        ),
        bio: L(
          [
            "Emmanuel Kervyn (1959), artisan relieur d'art de profession, s'est intéressé au matériau papier, et l'a travaillé principalement par la répétition du geste d'entailles, de découpes, tendant vers une forme d'abstraction construite.",
            "La troisième dimension se trouvant inscrite dans la feuille de papier, l'artiste fut conduit à s'intéresser aux volumes, ainsi qu'à d'autres matériaux. Dans cette orientation sculpturale, la préférence va aux installations, la sobriété des moyens est certainement un principe directeur.",
            "Il pratique également la performance, ainsi que la video pour autant que ces outils soient le prolongement d'un travail ou d'une idée plastique.",
            "Multimedia : Curieux, il ne s'arrête pas à une technique particulière, un geste en appelant un autre, toute idée étant promesse d'une perte, espoir d'un gain.",
            "Pour une large part autodidacte, il sait aussi que chaque projet se nourrit de rencontres et de paroles fertiles.",
          ],
          // TODO: Übersetzung prüfen
          [
            "Emmanuel Kervyn (1959), von Beruf Kunstbuchbinder, hat sich dem Material Papier zugewandt und es vor allem durch die Wiederholung einer Geste bearbeitet – Einschnitte, Ausschnitte –, hin zu einer Form konstruierter Abstraktion.",
            "Da die dritte Dimension bereits im Papierbogen angelegt ist, wandte sich der Künstler den Volumen und weiteren Materialien zu. In dieser bildhauerischen Ausrichtung gilt die Vorliebe den Installationen; die Sparsamkeit der Mittel ist dabei gewiss ein Leitprinzip.",
            "Er arbeitet außerdem mit Performance und Video, sofern diese Mittel die Fortsetzung einer Arbeit oder einer bildnerischen Idee sind.",
            "Multimedia: Neugierig bleibt er nicht bei einer bestimmten Technik stehen; eine Geste ruft die nächste hervor, jede Idee ist Versprechen eines Verlusts, Hoffnung auf einen Gewinn.",
            "Weitgehend Autodidakt, weiß er auch, dass jedes Projekt von Begegnungen und fruchtbaren Gesprächen lebt.",
          ],
          // TODO: Übersetzung prüfen
          [
            "Emmanuel Kervyn (1959), a fine bookbinder by profession, became interested in paper as a material and has worked it mainly through the repetition of a gesture – incisions, cut-outs – tending towards a form of constructed abstraction.",
            "Since the third dimension is already inscribed in the sheet of paper, the artist was led to take an interest in volumes, as well as in other materials. Within this sculptural direction, the preference is for installations; economy of means is certainly a guiding principle.",
            "He also works with performance and video, insofar as these tools extend a piece of work or a visual idea.",
            "Multimedia: Curious, he does not stop at any one technique; one gesture calls for another, every idea being the promise of a loss, the hope of a gain.",
            "Largely self-taught, he also knows that every project is nourished by encounters and fertile conversations.",
          ]
        ),
        // Auf der alten Seite als Bild (expositions_orig.png) – hier als Text übernommen.
        exhibitions: [
          { year: 2026, place: "Rixensart", detail: L("WAW, « Bis Repetita »") },
          { year: 2026, place: "Bruxelles", detail: L("Espace D, avec Yole Devaux", "Espace D, mit Yole Devaux", "Espace D, with Yole Devaux") },
          { year: 2025, place: "Rixensart", detail: L("Kamer 9") },
          { year: 2025, place: "Namur", detail: L("Galerie Détour, « Chiffonnage », avec D. Baudon, R. Comblain", "Galerie Détour, « Chiffonnage », mit D. Baudon, R. Comblain", "Galerie Détour, « Chiffonnage », with D. Baudon, R. Comblain") },
          { year: 2024, place: "Grand-Leez", detail: L("Exit11, « Fragile », curateur avec D. Baudon, M. Myle, P. Gees", "Exit11, « Fragile », Kurator mit D. Baudon, M. Myle, P. Gees", "Exit11, « Fragile », co-curated with D. Baudon, M. Myle, P. Gees") },
          { year: 2024, place: "Toulouse", detail: L("Rencontres Traverse Vidéo, 2 vidéos sélectionnées", "Rencontres Traverse Vidéo, 2 Videos ausgewählt", "Rencontres Traverse Vidéo, 2 videos selected") },
          { year: 2023, place: "Hannut", detail: L("Piscine 23, expo collective", "Piscine 23, Gruppenausstellung", "Piscine 23, group exhibition") },
          { year: 2022, place: "Louvain-la-Neuve", detail: L("Espace 001") },
          { year: 2021, place: "Jodoigne", detail: L("« Chemin faisant », 9 installations in situ", "« Chemin faisant », 9 In-situ-Installationen", "« Chemin faisant », 9 in situ installations") },
          { year: 2021, place: "Binche", detail: L("« Hors Format », vidéo", "« Hors Format », Video", "« Hors Format », video") },
          { year: 2020, place: "Jodoigne", detail: L("« Paperasserie », performance/spectacle avec le collectif Paperworks", "« Paperasserie », Performance/Aufführung mit dem Kollektiv Paperworks", "« Paperasserie », performance/show with the Paperworks collective") },
          { year: 2019, place: "Namur", detail: L("Académie des Beaux-Arts, avec Dominique Baudon", "Académie des Beaux-Arts, mit Dominique Baudon", "Académie des Beaux-Arts, with Dominique Baudon") },
          { year: 2018, place: "Wavre", detail: L("Banque Degroof, « Financial Times »") },
          { year: 2017, place: "Namur", detail: L("Galerie Détour, « Un autre A4 est possible »") },
          { year: 2016, place: "Jodoigne", detail: L("Biennale", "Biennale", "Biennial") },
          { year: 2016, place: "Haacht", detail: L("International Paper Art, expo collective", "International Paper Art, Gruppenausstellung", "International Paper Art, group exhibition") },
          { year: 2015, place: "Braine-l'Alleud", detail: L("EDA, « Rythmes d'écriture », expo collective", "EDA, « Rythmes d'écriture », Gruppenausstellung", "EDA, « Rythmes d'écriture », group exhibition") },
          { year: 2014, place: "Jodoigne", detail: L("Biennale", "Biennale", "Biennial") },
          { year: 2014, place: "Mons", detail: L("« Autour et alentour », expo collective", "« Autour et alentour », Gruppenausstellung", "« Autour et alentour », group exhibition") },
          { year: 2014, place: "Haacht", detail: L("International Paper Art, expo collective", "International Paper Art, Gruppenausstellung", "International Paper Art, group exhibition") },
          { year: 2010, place: "Jodoigne", detail: L("« Semis anonymes. », collage textuel", "« Semis anonymes. », Textcollage", "« Semis anonymes. », text collage") },
          { year: 2010, place: "Beauvechain", detail: L("Office des Métiers d'Art, « Je n'invente pas la 3D, je la trouve. »") },
          { year: 2009, place: "Jodoigne", detail: L("Installation urbaine", "Urbane Installation", "Urban installation") },
          { year: 2006, place: "Orp", detail: L("« La Gette au bout du jardin », land art", "« La Gette au bout du jardin », Land Art", "« La Gette au bout du jardin », land art") },
          { year: 2006, place: "Libramont", detail: L("Sculptures livres", "Buchskulpturen", "Book sculptures") },
          { year: 2004, place: "Chaumont-Gistoux", detail: L("« 0.99 € poème disséminé »") },
        ],
      },

      /* ---------------------------------------------------------- Écritures */
      {
        id: "ecritures",
        type: "gallery",
        nav: L("Écritures", "Schrift", "Script"), // TODO: Übersetzung prüfen
        works: [
          w("ecritures/un-coup-de-des-belgacom", "Un coup de dés jamais n'abolira Belgacom", mat("feutre")),
          w("ecritures/5-607-249-opalka", "5.607.249", null, { note: L("Chiffre ultime du peintre Opalka.", "Die letzte Zahl des Malers Opalka.", "The painter Opalka's final number.") }),
          w("ecritures/a-la-recherche-du-temps-perdu", "À la recherche du temps perdu", null, { note: L("Fac simile d'une page de bourse avec le début du texte de Proust.", "Faksimile einer Börsenseite mit dem Anfang von Prousts Text.", "Facsimile of a stock-market page with the opening of Proust's text.") }),
          w("ecritures/alphabet-cutter", "Alphabet 'Cutter'"),
          w("ecritures/faut-il-craindre-une-remontee-des-taux", "Faut-il craindre une remontée des taux d'intérêts ?", null, { note: L("Alphabet 'Cutter'") }),
          w("ecritures/ouverture-eclair", "Ouverture éclair"),
          w("ecritures/sans-titre-metal", SANS, mat("metal")),
          w("ecritures/composition-metal", "Composition", mat("metal")),
          w("ecritures/3-carres-metal", "3 carrés", mat("metal")),
          w("ecritures/composition-plomb", "Composition", mat("plomb")),
          w("ecritures/rasoir", "Rasoir", mat("abrasif")),
          w("ecritures/3-m", "3 M", mat("abrasif")),
        ],
      },

      /* ------------------------------------------------------------- Papier */
      {
        id: "papier",
        type: "gallery",
        nav: L("Papier", "Papier", "Paper"),
        quote: L(
          "Je n'invente pas la troisième dimension, je la trouve.",
          "Ich erfinde die dritte Dimension nicht, ich finde sie.", // TODO: Übersetzung prüfen
          "I don't invent the third dimension, I find it." // TODO: Übersetzung prüfen
        ),
        lead: w("papier/entete", null, null, {
          alt: L("Œuvre en papier : bandes noires et blanches découpées et repliées.", "Papierarbeit: geschnittene und gefaltete schwarze und weiße Streifen.", "Paper work: cut and folded black and white strips."),
        }),
        works: [
          w("papier/x-men", "x-men"),
          w("papier/18-x-18", "18 x 18"),
          w("papier/18-x-18-2", "18 x 18"),
          w("papier/tensions", "Tensions"),
          w("papier/2-carres", "2 carrés"),
          w("papier/marine", "Marine"),
          w("papier/tensions-2", "Tensions"),
          w("papier/2-carres-2", "2 carrés"),
          w("papier/accroche-toi", "Accroche-toi"),
          w("papier/pommes-frites", "Pommes frites", mat("carton")),
          w("papier/sans-titre-carton", SANS, mat("carton")),
          w("papier/ote-ton-portrait", "Ôte ton portrait", mat("papier", "carton")),
          w("papier/composition-toile-papier", "Composition", mat("toile", "papier")),
          w("papier/totem", "Totem", mat("carton", "papierDore")),
          w("papier/du-jardin", "Du jardin", mat("carton", "dorure", "terre")),
          w("papier/mon-alisa-1", "Mon Alisa 1"),
          w("papier/la-moitie-d-un-3-4", "La moitié d'un 3/4"),
          w("papier/sans-titre", SANS),
          w("papier/5-couches-de-moi", "5 couches de moi"),
          w("papier/sans-titre-2", SANS),
          w("papier/autoportrait", "Autoportrait"),
        ],
      },

      /* ------------------------------------------------------------ Volumes */
      {
        id: "volumes",
        type: "gallery",
        nav: L("Volumes", "Volumen", "Volumes"),
        lead: w("volumes/compression-papier", "Compression / papier"),
        works: [
          w("volumes/words-pvc", "Words", mat("pvc")),
          w("volumes/feuilles", "Feuilles"),
          w("volumes/sans-titre-ytong-platre-papier", SANS, mat("ytong", "platre", "papier")),
          w("volumes/gratuit", "Gratuit", mat("carton", "metal")),
          w("volumes/fragile-carton-bois", "Fragile", mat("carton", "bois")),
          w("volumes/financial-times", "Financial Times", mat("papier")),
          w("volumes/sans-titre-carton-bois", SANS, mat("carton", "bois")),
          w("volumes/sans-titre-carton-metal", SANS, mat("carton", "metal")),
          w("volumes/sans-titre-platre-papier", SANS, mat("platre", "papier")), // alte Seite: „Plâtre, paier.“ (Tippfehler)
          w("volumes/elle-va-bien", "Elle va bien", mat("beton", "papier")),
          w("volumes/fragile", "Fragile"),
          w("volumes/270-a4", "270 A4"),
          w("volumes/croix-de-papier", "Croix de papier"),
          w("volumes/time", "Time", mat("metal")),
          w("volumes/sans-titre-cailloux-mdf", SANS, mat("cailloux", "mdf")),
          w("volumes/just-weight", "Just Weight", mat("cailloux", "plastic")),
          w("volumes/sans-titre-carton-verre", SANS, mat("carton", "verre")),
          w("volumes/sans-titre-bois", SANS, mat("bois")),
          w("volumes/sans-titre-bois-2", SANS, mat("bois")),
          w("volumes/autoportant", "Autoportant", mat("bois")),
          w("volumes/sans-titre-agglomere", SANS, mat("agglomere")),
          w("volumes/sans-titre-metal", SANS, mat("metal")),
          w("volumes/sans-titre-bois-corde-metal", SANS, mat("bois", "corde", "metal")),
          w("volumes/sans-titre-metal-2", SANS, mat("metal")),
          w("volumes/tenon-mortaise", "Tenon mortaise", mat("boisDivers")),
          w("volumes/emplir-de-vide", "Emplir de vide", mat("metal")),
          w("volumes/absence", "Absence", mat("bois", "cendre")),
          w("volumes/sans-titre-beton-herbe-brulee", SANS, mat("beton", "herbeBrulee")),
          w("volumes/caddy", "Caddy", mat("metal")),
          // Die folgenden vier tragen auf der alten Seite nur Materialangaben, keinen Titel.
          w("volumes/feuilles-cendres-beton", null, mat("feuilles", "cendres", "beton")),
          w("volumes/cendres-bois", null, mat("cendres", "bois"), { dims: "100 x 100 cm" }),
          w("volumes/bois-cendres-souris", null, mat("bois", "cendres", "souris")),
          w("volumes/suie-craie", null, mat("suie", "craie")),
          w("volumes/gravite", "Gravité", mat("pvc")),
          w("volumes/la-faute", "La faute", mat("pvc", "pierre")),
          w("volumes/la-fuite-dans-les-idees", "La fuite dans les idées", mat("boisTrouve", "pvc")),
          w("volumes/sans-titre-beton", SANS, mat("beton")),
          w("volumes/sans-titre-pvc", SANS, mat("pvc")),
          w("volumes/sans-titre-pvc-2", SANS, mat("pvc")),
          w("volumes/9-a4", "9 A4", mat("platre")),
          w("volumes/sans-titre-bois-3", SANS, mat("bois")),
          w("volumes/4-en-1", "4 en 1", mat("bois")),
          w("volumes/installation-espace-d", "Installation Espace D, Bxl", mat("pvc", "papier", "metal", "bois")),
          w("volumes/sans-titre-metal-papier-pvc", SANS, mat("metal", "papier", "pvc")),
          w("volumes/sans-titre-bois-pvc", SANS, mat("bois", "pvc")),
          w("volumes/sans-titre-pvc-3", SANS, mat("pvc")),
          w("volumes/in-situ-espace-d", "In situ, Espace D, Bxl", mat("papier")),
          w("volumes/p-m-monochrome", "P.M. Monochrome", mat("mdf", "video"), { dims: "59 x 59 x 30 cm" }),
        ],
      },

      /* ------------------------------------------------------------- Vidéos */
      {
        id: "videos",
        type: "videos",
        nav: L("Vidéos", "Videos", "Videos"),
        videos: [
          { title: "Bis Repetita", vimeo: "1212035053", poster: "videos/bis-repetita", stills: ["videos/bis-repetita-2", "videos/bis-repetita-3"] },
          { title: "Go Waste", vimeo: "1123881740", start: 161, poster: "videos/go-waste" },
          { title: "In Memoriam", vimeo: "976601098", poster: "videos/in-memoriam", stills: ["videos/in-memoriam-extrait", "videos/in-memoriam-extrait-2"] },
          { title: "Paperasserie", vimeo: "930802679", poster: "videos/paperasserie", note: L("Teaser, février 2019", "Teaser, Februar 2019", "Teaser, February 2019") }, // Angabe aus dem Vimeo-Titel
          { title: "Le Lion", vimeo: "936714673", poster: "videos/le-lion", stills: ["videos/le-lion-extrait", "videos/le-lion-extrait-2", "videos/le-lion-extrait-3"] },
          // TODO: Vimeo-ID fehlt. Die alte Seite verlinkt „Roll Over“ auf 868799399,
          // das ist aber laut Vimeo „façon contre façon“ (siehe unten).
          { title: "Roll Over", vimeo: null, poster: "videos/roll-over" },
          { title: "Le Nôtre", vimeo: "867880565", poster: "videos/le-notre", stills: ["videos/le-notre-2", "videos/le-notre-3"] },
          { title: "23 x 21 x 23 cm", vimeo: "868071867", poster: "videos/23-x-21-x-23-cm" },
          { title: "Hors Format", vimeo: "867836794", poster: "videos/hors-format", stills: ["videos/hors-format-1", "videos/hors-format-2", "videos/hors-format-3", "videos/hors-format-4"] },
          { title: "Fragile", vimeo: "868067985", poster: "videos/fragile" },
          { title: "Scan", vimeo: "867901812", poster: "videos/vimeo-867901812" },
          { title: "Façon contre façon", vimeo: "868799399", poster: "videos/vimeo-868799399" },
          // TODO: Vimeo-IDs fehlen. Auf der alten Seite zeigen beide Vorschaubilder fälschlich auf 868799399.
          { title: "100 x 100 cm, en pure perte", vimeo: null, poster: "videos/en-pure-perte" },
          { title: "Exister sans l'autre", vimeo: null, poster: "videos/exister-sans-l-autre" },
        ],
      },

      /* -------------------------------------------------------------- Écrits */
      {
        id: "ecrits",
        type: "texts",
        nav: L("Écrits", "Texte", "Writings"), // TODO: Übersetzung prüfen
        // Auf der alten Seite nur als Bild – hier zusätzlich als Text transkribiert.
        texts: [
          {
            title: L("On ne sauvera pas le carton", "Den Karton wird man nicht retten", "Cardboard won't be saved"),
            image: w("ecrits/on-ne-sauvera-pas-le-carton", "On ne sauvera pas le carton", mat("carton")),
            body: L(
              [
                "Amateurs de causes perdues, détournez-vous, ou vous serez perdus vous-mêmes.",
                "Le carton est insignifiant.\nCe sont quelques sinus mous et sans force, grisâtres – le mot est élégant – ‹ ternes › est plus juste, dissimulés entre deux couches de papier, couleur alluvions que marée emporte.\nUne écriture parfois, un logo, une marque, égayent un rien sa triste robe ; c'est pour lui dire : « tu as en toi des ‹ demi-portions › », « tu as servi la cause d'une soupe Julienne », « tu as porté des pommes frites ».\nLa belle affaire, la noble tâche !\nLe carton ne fait pas le poids : ses entrailles, je l'ai dit, c'est du vide.\nIl vous tombe sur le pied, votre pied ne le sait pas.\nÀ vous appuyer sur cette matière, elle n'amortira pas votre chute.\nSa couleur sale est son camouflage : le carton est partout mais on ne le voit pas : sur les parkings, à l'entrée du magasin, sous et sur les gondoles, envahissant les stocks comme une promesse faite à Sisyphe.",
                "S'avisant que l'espace public est pour lui, arrive le jour où son habit passe-partout ne cache plus ses volumes.\nIl y a assez de malheur en ce monde ; et autant d'empressement pour démembrer, aplatir, écraser ces caisses en carcasses.",
                "Ce n'est pas un combat, faute d'adversaire : la rage se heurte au consentement, la force inutile à la mollesse.\nLes colères assouvies tournent alors le dos à des empilements informes sur les boulevards, les jours de ramassage.",
                "Y échapperont peut-être ceux qui serviront de maigre couche à un clochard, gisants s'abreuvant de pluie et de l'odeur de mort.",
                "Je ne sauverai pas le carton.",
              ],
              // TODO: Übersetzung prüfen
              [
                "Liebhaber verlorener Sachen, wendet euch ab, sonst seid ihr selbst verloren.",
                "Der Karton ist bedeutungslos.\nEin paar weiche, kraftlose Wellen, gräulich – das Wort ist elegant –, ‹ fahl › trifft es besser, versteckt zwischen zwei Lagen Papier, in der Farbe von Schwemmsand, den die Flut mitnimmt.\nManchmal heitern eine Schrift, ein Logo, eine Marke sein trauriges Kleid ein wenig auf; um ihm zu sagen: « du trägst ‹ halbe Portionen › in dir », « du hast einer Julienne-Suppe gedient », « du hast Pommes frites getragen ».\nWas soll's – welch edle Aufgabe!\nDer Karton fällt nicht ins Gewicht: Sein Inneres, ich sagte es, ist Leere.\nFällt er Ihnen auf den Fuß, merkt Ihr Fuß es nicht.\nStützen Sie sich auf dieses Material, wird es Ihren Sturz nicht abfedern.\nSeine schmutzige Farbe ist seine Tarnung: Der Karton ist überall, doch man sieht ihn nicht – auf Parkplätzen, am Eingang des Geschäfts, unter und auf den Regalen, er überschwemmt die Lager wie ein Versprechen an Sisyphos.",
                "Als er bemerkt, dass der öffentliche Raum ihm gehört, kommt der Tag, an dem sein Allerweltsgewand seine Volumen nicht mehr verbirgt.\nEs gibt genug Unglück auf dieser Welt; und ebenso viel Eifer, diese Kisten zu zerlegen, platt zu drücken, zu Gerippen zu zerquetschen.",
                "Es ist kein Kampf, mangels Gegner: Die Wut stößt auf Einwilligung, die Kraft vergeblich auf Nachgiebigkeit.\nDer gestillte Zorn kehrt dann den formlosen Stapeln auf den Boulevards den Rücken, an den Tagen der Abholung.",
                "Entkommen werden vielleicht jene, die einem Obdachlosen als dürftiges Lager dienen, Liegende, die sich an Regen und Todesgeruch tränken.",
                "Ich werde den Karton nicht retten.",
              ],
              // TODO: Übersetzung prüfen
              [
                "Lovers of lost causes, turn away, or you will be lost yourselves.",
                "Cardboard is insignificant.\nA few soft, strengthless waves, greyish – the word is elegant – ‹ dull › is more accurate, hidden between two layers of paper, the colour of silt carried off by the tide.\nSometimes a script, a logo, a brand brightens its sad garment a little; just to tell it: « you have ‹ half-portions › inside you », « you served the cause of a julienne soup », « you carried French fries ».\nBig deal – what a noble task!\nCardboard doesn't carry any weight: its insides, as I said, are emptiness.\nIt falls on your foot, your foot doesn't know it.\nLean on this material and it will not break your fall.\nIts dirty colour is its camouflage: cardboard is everywhere but no one sees it – in car parks, at the shop entrance, under and on the shelves, flooding the stockrooms like a promise made to Sisyphus.",
                "Realising that public space belongs to it, the day comes when its all-purpose garb no longer hides its volumes.\nThere is enough misfortune in this world; and just as much eagerness to dismember, flatten, crush these boxes into carcasses.",
                "It is not a fight, for lack of an opponent: rage runs up against consent, force uselessly against softness.\nSated anger then turns its back on shapeless piles along the boulevards, on collection days.",
                "Perhaps those will escape that serve as a meagre bed for a homeless man, recumbent figures drinking in the rain and the smell of death.",
                "I will not save the cardboard.",
              ]
            ),
          },
          {
            title: null,
            image: w("papier/mon-alisa-1", "Mon Alisa 1"),
            body: L(
              ["Après mille tours du monde, s'étant accrochée aux cimaises les plus prestigieuses comme aux crépis de restaurants sans étoiles, ayant insolé mais sans insolence la rétine universelle, Mon Alisa à moi se satisfait de quelques pixels, une Joconde à l'économie en somme."],
              // TODO: Übersetzung prüfen
              ["Nach tausend Reisen um die Welt, nachdem sie an den renommiertesten Ausstellungswänden ebenso hing wie am Rauputz sternloser Restaurants, nachdem sie die universelle Netzhaut belichtet hat, doch ohne Dreistigkeit, begnügt sich meine eigene Alisa mit ein paar Pixeln – eine Mona Lisa zum Sparpreis, alles in allem."],
              // TODO: Übersetzung prüfen
              ["After a thousand trips around the world, having hung on the most prestigious picture rails as well as on the roughcast walls of starless restaurants, having sun-struck – but without insolence – the universal retina, my very own Alisa is content with a few pixels: a Mona Lisa on a budget, in short."]
            ),
          },
        ],
      },

      /* ------------------------------------------------------------ In Situ */
      {
        id: "in-situ",
        type: "gallery",
        nav: L("In Situ"),
        works: [
          w("in-situ/jodoigne-2021-sans-titre", SANS, null, { note: L("Jodoigne 2021") }),
          w("in-situ/jodoigne-2021-sans-titre-2", SANS, null, { note: L("Jodoigne 2021") }),
          w("in-situ/jodoigne-2021-white-washing", "White Washing", null, { note: L("Jodoigne 2021") }),
          w("in-situ/jodoigne-2021-sans-titre-3", SANS, null, { note: L("Jodoigne 2021") }),
          w("in-situ/jodoigne-2021-sans-titre-4", SANS, null, { note: L("Jodoigne 2021") }),
          w("in-situ/jodoigne-2021-le-notre-detail", "Le Nôtre", null, { note: L("Détail, Jodoigne 2021", "Detail, Jodoigne 2021", "Detail, Jodoigne 2021") }),
          w("in-situ/jodoigne-2021-sans-titre-5", SANS, null, { note: L("Jodoigne 2021") }),
          w("in-situ/jodoigne-2021-fiat-lux", "Fiat Lux", null, { note: L("Jodoigne 2021") }),
          w("in-situ/jodoigne-2019-ego", "EGO", null, { note: L("Jodoigne 2019") }),
          w("in-situ/blankenberge-2016-sans-titre", SANS, null, { note: L("Blankenberge 2016") }),
          // TODO: Jahr prüfen – auf der alten Seite steht „Blankenberge 20148“.
          w("in-situ/blankenberge-sans-titre", SANS, null, { note: L("Blankenberge") }),
          w("in-situ/oubli", "Oubli", mat("mousses", "feuilles", "temps")),
        ],
      },

      /* --------------------------------------------------- Au Nord du Monde */
      {
        id: "au-nord-du-monde",
        type: "project",
        nav: L("Au Nord du Monde"),
        subtitle: L("Installation performative", "Performative Installation", "Performative installation"),
        works: [
          w("au-nord-du-monde/installation-performative", "Au Nord du Monde", null, { note: L("Installation performative", "Performative Installation", "Performative installation") }),
          w("au-nord-du-monde/still-2", "Au Nord du Monde"),
          w("au-nord-du-monde/still-3", "Au Nord du Monde"),
          w("au-nord-du-monde/still-4", "Au Nord du Monde"),
          w("au-nord-du-monde/still-5", "Au Nord du Monde"),
          w("au-nord-du-monde/avril-2026", "Au Nord du Monde"),
        ],
      },

      /* ------------------------------------------------------------ Contact */
      {
        id: "contact",
        type: "contact",
        nav: L("Contact", "Kontakt", "Contact"),
        // Adresse wird erst im Browser zusammengesetzt (einfacher Schutz vor Adress-Sammlern).
        email: ["ekervyn", "outlook.com"],
        phone: { display: "+32 472 411 494", tel: "+32472411494" }, // alte Seite: „0032 0472 411 494“
        image: w("contact/jamais-un-coup-de-des-belgacom", "Jamais un coup de dés n'abolira Belgacom", mat("feutrePapier"), { dims: "30 x 40 cm" }),
      },
    ],

    /* Rechtliches – Platzhalter. TODO: Inhalt kommt vom Künstler. */
    legal: {
      title: L("Mentions légales", "Impressum", "Legal notice"),
      body: L(
        ["Emmanuel Kervyn", "À compléter : adresse postale et, le cas échéant, numéro d'entreprise."],
        ["Emmanuel Kervyn", "Noch zu ergänzen: Postanschrift und ggf. Unternehmensnummer."],
        ["Emmanuel Kervyn", "To be completed: postal address and, if applicable, company number."]
      ),
    },
    privacy: {
      title: L("Protection des données", "Datenschutz", "Privacy"),
      // Beschreibt das tatsächliche Verhalten der Seite. TODO: vom Künstler prüfen und ergänzen lassen.
      body: L(
        [
          "Ce site n'utilise ni cookies ni outils de mesure d'audience. Les polices et les images sont hébergées sur ce site.",
          "Le choix du style d'affichage et de la langue est enregistré uniquement dans votre navigateur (localStorage).",
          "Les vidéos sont hébergées par Vimeo. Elles ne sont chargées qu'après un clic de votre part ; Vimeo reçoit alors des données de connexion (p. ex. votre adresse IP). Le lecteur est intégré avec l'option « do not track ».",
          "À compléter : responsable du traitement et coordonnées.",
        ],
        [
          "Diese Website verwendet weder Cookies noch Statistik-Werkzeuge. Schriften und Bilder liegen auf diesem Server.",
          "Die gewählte Darstellung und Sprache werden nur in Ihrem Browser gespeichert (localStorage).",
          "Videos werden bei Vimeo gehostet. Sie werden erst nach Ihrem Klick geladen; dabei erhält Vimeo Verbindungsdaten (z. B. Ihre IP-Adresse). Der Player wird mit der Option „do not track“ eingebunden.",
          "Noch zu ergänzen: Verantwortlicher und Kontaktangaben.",
        ],
        [
          "This website uses neither cookies nor analytics. Fonts and images are hosted on this site.",
          "Your chosen display style and language are stored only in your browser (localStorage).",
          "Videos are hosted by Vimeo. They are only loaded after you click; Vimeo then receives connection data (e.g. your IP address). The player is embedded with the “do not track” option.",
          "To be completed: data controller and contact details.",
        ]
      ),
    },
  };
})();
