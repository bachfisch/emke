# emmanuelkervyn.com

Statische Website des Künstlers Emmanuel Kervyn. Sie ersetzt die bisherige Weebly-Seite.

- Nur HTML, CSS und Vanilla JS, ohne Build-Schritt
- Drei umschaltbare Stile: **Minimal**, **Edel** und **Schrill**
- Drei Sprachen: **FR** (Original und Fallback), **DE**, **EN**
- Alle Bilder und Schriften liegen im Repo. Videos kommen von Vimeo und laden erst nach einem Klick.

## Ansehen

`index.html` direkt im Browser öffnen (funktioniert per `file://`) oder lokal ausliefern:

```sh
python3 -m http.server 8000   # → http://localhost:8000
```

Mit URL-Parametern lassen sich Stil und Sprache direkt ansteuern, z. B. `?style=edel&lang=de`. Gültige Werte sind `minimal`, `edel`, `schrill` und `fr`, `de`, `en`. Die Wahl wird im Browser gespeichert (`localStorage`).

Bereiche sind per Hash erreichbar: `#ecritures`, `#papier`, `#volumes`, `#videos`, `#ecrits`, `#in-situ`, `#au-nord-du-monde`, `#contact`, `#impressum` und `#datenschutz`.

## Die drei Stile

| Stil | Idee | Struktur |
|---|---|---|
| Minimal | Weiß, ruhig, ein roter Akzent (der „Schnitt“) | One-Pager, alle Bereiche untereinander, Spaltenraster |
| Edel | Ausstellungskatalog: Anthrazit, Papier, Gold, Cormorant Garamond | eine Ansicht pro Bereich (Hash-Routing), römische Kapitel, Bildtafeln |
| Schrill | Collage aus Papierfetzen: Pink, Gelb, Kobalt, gerissene Kanten | Desktop: horizontal scrollende Bahn (Mausrad scrollt seitwärts); Handy: vertikal |

In allen Stilen öffnet ein Klick auf ein Werk die Lightbox. Sie lässt sich mit `←`/`→`, `Esc` und Wischgesten bedienen. Bei `prefers-reduced-motion` laufen keine Animationen.

## Struktur

```
index.html              Einstieg, Meta-Angaben, früher Stil-/Sprach-Check
content/content.js      ALLE Texte (fr/de/en), Werke, Ausstellungen, Videos
content/media.js        Bildmaße (automatisch erzeugt)
css/base.css            Schriften, Reset, Lightbox, Dialoge, Video
css/<stil>.css          ein Stylesheet pro Stil (gilt nur bei <html data-style="…">)
js/main.js              Zustand, Routing, Umschalter, Lightbox, Helfer
js/vimeo.js             Vimeo-Einbettung mit Klick zum Laden (dnt=1)
js/layouts/<stil>.js    eine Render-Funktion pro Stil
images/<bereich>/       WebP (max. 2000 px) und Thumbnails (*-600.webp)
images/_orig/           Originaldateien von der alten Seite
images/og.jpg           Vorschaubild für Link-Vorschauen
fonts/                  Webfonts (SIL Open Font License)
scripts/fetch-media.py  Bildimport von der alten Seite (wiederholbar)
```

## Inhalte pflegen

**Texte und Werke** stehen in `content/content.js`:

- `L(fr, de, en)` ist ein mehrsprachiger Text.
- `w(bild, titel, material, extra)` ist ein Werk. Werktitel bleiben französisch, nur Materialangaben werden übersetzt.
- Materialien kommen aus dem Wörterbuch `M` und werden mit `mat("carton", "bois")` kombiniert. Ein neues Material trägt man einmal in `M` ein.

**Neues Bild:**

1. Die Datei in `MEDIA` in `scripts/fetch-media.py` eintragen. Für eigene Dateien, die nicht von Weebly kommen, das Original direkt nach `images/_orig/<bereich>/<name>.jpg` legen.
2. Das Skript ausführen:
   ```sh
   python3 -m pip install pillow
   python3 scripts/fetch-media.py
   ```
3. Das Werk in `content/content.js` eintragen, z. B. `w("papier/<name>", "Titel", mat("papier"))`.

**Neues Video:** einen Eintrag in `videos` im Bereich `videos` anlegen, mit `vimeo` (ID), `poster` (Bild) und optional `stills` und `start` (Sekunden).

## Veröffentlichen (GitHub Pages)

Unter Settings → Pages die Quelle „Deploy from a branch“, Branch `main` und Ordner `/ (root)` wählen. Einen Build-Schritt gibt es nicht. Läuft die Seite unter einer anderen Domain als `www.emmanuelkervyn.com`, müssen `canonical` und `og:url`/`og:image` in `index.html` angepasst werden.

## Offene Punkte (vom Künstler zu klären)

Im Code sind alle Stellen mit `TODO` markiert (`grep -rn TODO content js index.html`).

1. **Übersetzungen prüfen.** Alle DE- und EN-Texte sind neue Übersetzungen aus dem Französischen und noch nicht freigegeben. Das gilt für Statement, Bio, Écrits, Materialien, Ausstellungsliste und Navigation, etwa „Écritures“ → „Schrift/Script“ und „Écrits“ → „Texte/Writings“.
2. **Fehlende Vimeo-IDs.** Auf der alten Seite verlinken *Roll Over*, *100 x 100 cm, en pure perte* und *Exister sans l'autre* alle auf Video 868799399. Laut Vimeo ist das aber *façon contre façon*. Diese drei werden deshalb vorerst nur als Standbild gezeigt.
3. **Vimeo-Verwaltungslinks.** Alle übrigen IDs (auch die früheren `vimeo.com/manage/…`-Links) sind öffentlich und einbettbar (per oEmbed geprüft im November 2026).
4. **Startbild.** Das Bild auf der Startseite hat keinen Titel. Den Werktitel beim Künstler erfragen.
5. **„Multimedia“.** Nach „Je tire le fil.“ stand auf der alten Startseite das einzelne Wort „Multimedia“. Es wurde als vermutliches Überbleibsel weggelassen.
6. **In Situ.** Bei „Sans Titre Blankenberge 20148“ ist das Jahr unklar.
7. **Impressum und Datenschutz.** Die Platzhalter müssen ergänzt werden: Adresse, ggf. Unternehmensnummer und Verantwortlicher. Der Datenschutztext beschreibt bereits das tatsächliche Verhalten der Seite.

## Bewusste Änderungen gegenüber der alten Seite

- Die Ausstellungsliste war ein Bild (`expositions_orig.png`) und ist jetzt echter Text.
- Die Écrits („On ne sauvera pas le carton“ und der Joconde-Text) waren nur als Bild vorhanden. Sie sind zusätzlich als Text transkribiert, das Bild bleibt erhalten.
- Die Standbilder aus „Hors Format“ und „Le Nôtre“ standen auf der Kontaktseite. Sie hängen jetzt an den jeweiligen Videos.
- Offensichtliche Tippfehler wurden korrigiert, z. B. „paier“ → „papier“ und „brulée“ → „brûlée“.
