# CLAUDE.md – Redesign emmanuelkervyn.com

## Projekt

Neugestaltung der Künstler-Website von **Emmanuel Kervyn** (geb. 1959, Buchbindermeister, Papierarbeiten, Volumen, Installationen, Performance, Video).
Die aktuelle Seite (https://www.emmanuelkervyn.com) ist mit **Weebly** gebaut. Sie wird durch eine eigene statische Seite in diesem Repo ersetzt.

Ziel: Die Werke stehen im Mittelpunkt. Die Seite soll schnell laden, auf dem Handy gut funktionieren und sich zwischen **drei Stilen** umschalten lassen.

## Harte Vorgaben

- **Statisch, ohne Build-Schritt.** Nur HTML, CSS und Vanilla JS. Kein Framework, kein npm-Build, kein Bundler. Die Seite muss direkt von GitHub Pages (oder jedem Webspace) laufen.
- **`index.html` im Repo-Root** ist der Einstiegspunkt.
- **Alle Bilder liegen im Repo** (keine Hotlinks auf Weebly).
- **Videos bleiben auf Vimeo** und werden eingebettet. Im Repo liegen nur die Vorschaubilder und Standbilder.
- **Style-Changer** mit 3 Stilen, auf jeder Ansicht sichtbar erreichbar (siehe unten).
- **Dreisprachig: FR / DE / EN**, mit Sprachumschalter. Französisch ist die Originalsprache und der Fallback.
- Die Seite muss auch per `file://` geöffnet funktionieren. Deshalb Inhalte **nicht per `fetch()` aus JSON laden**, sondern als JS-Datei einbinden (`window.CONTENT = {...}`).

## Die drei Stile

Die Stile dürfen sich in **Layout und Struktur** unterscheiden, nicht nur in Farben und Schriften. Abwechslung ist ausdrücklich erwünscht. Alle drei nutzen dieselben Inhalte und Bilder.

1. **Minimal**: viel Weißraum, reduzierte Typografie, Schwarz/Weiß bzw. ein Akzent. Vorschlag: ruhiger One-Pager mit Abschnitten und schlichter Navigation; Bilder im lockeren Raster.
2. **Edel**: hochwertige Serifenschrift, dunkler oder warmer Grundton (z. B. Anthrazit, Papier, Gold – passend zum „papier doré“), großzügige Bildinszenierung. Vorschlag: Ansicht pro Bereich (Hash-Routing wie `#papier`) mit Galerie-/Lightbox-Präsentation wie in einem Ausstellungskatalog.
3. **Schrill**: kräftige Farben, starke Kontraste, große Typografie, verspielte Animationen, gern mit Bezug zu Papier, Schnitten und Rissen (das Thema der Arbeiten). Vorschlag: experimentelles Layout, z. B. Collage, horizontales Scrollen oder überlappende Elemente.

Die Vorschläge sind Ausgangspunkte. Gestalterische Freiheit ist erwünscht.

### Technische Umsetzung des Style-Changers

- Pro Stil eine CSS-Datei (`css/minimal.css`, `css/edel.css`, `css/schrill.css`) plus gemeinsame Basis (`css/base.css`).
- Wenn sich die Struktur unterscheidet: pro Stil eine Render-Funktion in `js/layouts/<stil>.js`, die aus `CONTENT` das DOM baut.
- Aktiver Stil als `data-style` am `<html>`-Element.
- Auswahl wird in `localStorage` gespeichert (in `try/catch`) und ist per URL-Parameter ansteuerbar (`?style=edel`).
- Der Umschalter ist in allen drei Stilen gut auffindbar, darf aber zum jeweiligen Stil passen. Er ist per Tastatur bedienbar und hat sinnvolle `aria`-Labels.
- `prefers-reduced-motion` respektieren (besonders im schrillen Stil).

## Mehrsprachigkeit

- Alle Texte in `content/content.js` mit Schlüsseln `fr`, `de`, `en`.
- Sprache: URL-Parameter `?lang=` → `localStorage` → Browsersprache → Fallback `fr`.
- `<html lang>` beim Wechsel aktualisieren.
- Die deutschen und englischen Fassungen sind **Übersetzungen aus dem Französischen**. Neue oder maschinell erstellte Übersetzungen in `content.js` mit `// TODO: Übersetzung prüfen` markieren, bis der Künstler sie freigegeben hat.
- Werktitel bleiben im Original (Französisch). Nur Materialangaben werden übersetzt, z. B. „Carton, papier doré“ → „Karton, Blattgold-Papier“.

## Inhalte der alten Seite

Die bestehende Seite ist die Quelle aller Texte, Bilder und Werktitel. Inhalte vollständig übernehmen, nichts erfinden.

| Bereich | Alte URL | Inhalt |
|---|---|---|
| Accueil | `/` | Einleitung „SANS TITRE“ (FR/DE/EN), Text zur Entwicklung der Arbeit, BIO |
| Écritures | `/ecritures.html` | Galerie |
| Papier | `/papier.html` | ca. 22 Bilder, Zitat „Je n'invente pas la troisième dimension, je la trouve.“ |
| Volumes | `/volumes.html` | Galerie |
| Vidéos | `/videos.html` | Vimeo-Links, Thumbnails, Standbilder |
| Écrits | `/ecrits.html` | Texte |
| In Situ | `/in-situ.html` | Installationen/Ausstellungen |
| Au Nord du Monde | `/au-nord-du-monde.html` | Projekt (u. a. Video-Standbilder) |
| Contact | `/contact.html` | Kontakt |

### Bilder übernehmen

- Die Bilder liegen unter `https://www.emmanuelkervyn.com/uploads/1/3/5/5/135563330/`.
- Immer die **Originalversion** (`*_orig.jpg/png`) laden, nicht die Vorschauen aus `editor/`.
- Ablage: `images/<bereich>/<sprechender-dateiname>.jpg`, Dateinamen in Kleinbuchstaben mit Bindestrichen, z. B. `images/papier/totem.jpg`.
- Werktitel und Materialangaben stehen auf der alten Seite im `title`-Attribut der Galerie-Links (z. B. „Totem. Carton, papier doré.“). Diese in `content.js` übernehmen: `{ src, title, material }`.
- Für die Darstellung zusätzlich optimierte Versionen erzeugen (z. B. WebP, max. 2000 px lange Kante, plus Thumbnails ca. 600 px). Originale unter `images/_orig/` behalten.
- Ein Download-Skript (z. B. `scripts/fetch-media.py`) anlegen, damit der Import nachvollziehbar und wiederholbar ist.
- Alle Bilder mit `loading="lazy"`, `width`/`height` und aussagekräftigem `alt`-Text (Werktitel + Material).

### Videos (Vimeo)

Einbettung über `https://player.vimeo.com/video/<ID>?dnt=1`.
**Datenschutz:** Den Player erst nach Klick laden (Vorschaubild + Hinweis „Video von Vimeo laden“). Vorher kein iframe und keine Requests an Vimeo.

| Titel | Vimeo-ID |
|---|---|
| 23 x 21 x 23 cm | 868071867 |
| Le Nôtre | 867880565 |
| Roll Over | 868799399 |
| Le Lion | 936714673 |
| „Paperasserie“ | 930802679 |
| In Memoriam | 976601098 |
| Go Waste | 1123881740 (Start bei 161 s: `#t=161s`) |
| Bis Repetita | 1212035053 |
| ohne Titel (Thumbnail-Links) | 867901812, 868067985, 867836794 |

⚠️ Mehrere Links auf der alten Seite zeigen auf `vimeo.com/manage/videos/...` (Vimeo-Verwaltung). Ob diese Videos öffentlich bzw. einbettbar sind, muss in den Vimeo-Einstellungen geprüft werden. Nicht einbettbare Videos melden statt sie stillschweigend wegzulassen.

## Verzeichnisstruktur

```
/
├── index.html
├── CLAUDE.md
├── README.md
├── css/
│   ├── base.css
│   ├── minimal.css
│   ├── edel.css
│   └── schrill.css
├── js/
│   ├── main.js          # Init, Routing, Stil- & Sprachwechsel
│   ├── vimeo.js         # Click-to-load-Embeds
│   └── layouts/
│       ├── minimal.js
│       ├── edel.js
│       └── schrill.js
├── content/
│   └── content.js       # alle Texte (fr/de/en), Werke, Videos
├── images/
│   ├── _orig/
│   ├── accueil/ papier/ volumes/ ecritures/ in-situ/ videos/ au-nord-du-monde/ …
├── fonts/               # Webfonts lokal (keine Google-Fonts-Requests)
└── scripts/
    └── fetch-media.py
```

## Qualität

- Responsive ab 360 px Breite. In allen drei Stilen auf Handy und Desktop prüfen.
- Barrierefreiheit: semantisches HTML, Fokuszustände, Kontrast mindestens WCAG AA (auch im schrillen Stil für Fließtext), Lightbox mit Tastatur und `Esc` bedienbar.
- Keine externen Requests außer Vimeo (und das erst nach Klick). Schriften lokal einbinden.
- Meta-Angaben: echter `<title>` und `description` statt „My Site“, Open-Graph-Bild aus dem Repo.
- Impressum/Datenschutz als Platzhalter vorsehen, falls nicht vorhanden. Inhalt kommt vom Künstler.

## Arbeitsweise

- Vor größeren gestalterischen Entscheidungen kurz Varianten beschreiben oder skizzieren.
- Keine Inhalte erfinden. Fehlende Texte, Titel oder Übersetzungen als `TODO` markieren.
- Commits klein und beschreibend halten (z. B. „Bilder Papier importiert“, „Stil Edel: Galerie-Layout“).
