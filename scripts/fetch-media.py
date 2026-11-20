#!/usr/bin/env python3
"""
Importiert alle Bilder der alten Weebly-Seite (emmanuelkervyn.com) ins Repo
und erzeugt optimierte Fassungen für die Darstellung.

    python3 -m pip install pillow
    python3 scripts/fetch-media.py            # lädt nur fehlende Originale
    python3 scripts/fetch-media.py --force    # lädt alles neu

Ergebnis:
    images/_orig/<bereich>/<name>.<ext>   Original (unverändert, *_orig von Weebly)
    images/<bereich>/<name>.webp          max. 2000 px lange Kante
    images/<bereich>/<name>-600.webp      Thumbnail, max. 600 px lange Kante
    content/media.js                      window.MEDIA = { "<bereich>/<name>": [w, h], ... }

Die Liste MEDIA unten ist die einzige Quelle: neue Bilder dort eintragen
und das Skript erneut ausführen. Werktitel und Texte stehen in content/content.js.
"""
import json
import pathlib
import re
import sys
import time
import urllib.error
import urllib.request

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow fehlt: python3 -m pip install pillow")

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = "https://www.emmanuelkervyn.com/uploads/1/3/5/5/135563330/"
LARGE, THUMB = 2000, 600

# (bereich, name, datei auf weebly)  –  Kommentar = Titel-Attribut auf der alten Seite
MEDIA = [
    # Accueil
    ("accueil", "accueil", "mg-3966-mail-resize_orig.jpg"),
    ("accueil", "expositions", "expositions_orig.png"),
    # Écritures
    ("ecritures", "un-coup-de-des-belgacom", "mg-3952-crop-mail-resize_orig.jpg"),  # " un coup de dés jamais n'abolira Belgacom " Feutre.
    ("ecritures", "5-607-249-opalka", "dscf1886_orig.jpg"),  # " 5.607.249 " Chiffre ultime du peintre Opalka.
    ("ecritures", "a-la-recherche-du-temps-perdu", "emmanuel-kervyn-sept18-0013_orig.jpg"),
    ("ecritures", "alphabet-cutter", "img-0472-2_orig.jpg"),
    ("ecritures", "faut-il-craindre-une-remontee-des-taux", "img-0513-copie_orig.jpg"),
    ("ecritures", "ouverture-eclair", "ouverture-clair_orig.jpg"),
    ("ecritures", "sans-titre-metal", "img-0527-copie_orig.jpg"),
    ("ecritures", "composition-metal", "img-0501-2-copie-jpg-1_orig.jpg"),
    ("ecritures", "3-carres-metal", "img-0500-copie_orig.jpg"),
    ("ecritures", "composition-plomb", "img-7466-jpg-corr_orig.jpg"),
    ("ecritures", "rasoir", "20250528-165746_orig.jpg"),
    ("ecritures", "3-m", "20250528-165517_orig.jpg"),
    # Papier
    ("papier", "entete", "p1060105_orig.jpg"),
    ("papier", "x-men", "mg-3910-crop-mail-resize_orig.jpg"),
    ("papier", "18-x-18", "emmanuel-kervyn-1_orig.jpg"),
    ("papier", "18-x-18-2", "img-5489-copie_orig.jpg"),
    ("papier", "tensions", "dsc-7613-jpg-corr_orig.jpg"),
    ("papier", "2-carres", "emmanuel-kervyn-sept18-0005-tif-corr_orig.jpg"),
    ("papier", "marine", "img-2465-jpg-corr_orig.jpg"),
    ("papier", "tensions-2", "img-2441-jpg-corr_orig.jpg"),
    ("papier", "2-carres-2", "img-1236-jpg-corr_orig.jpg"),
    ("papier", "accroche-toi", "img-2461-copie-jpg-corr_orig.jpg"),
    ("papier", "pommes-frites", "pommes-frites_orig.jpg"),
    ("papier", "sans-titre-carton", "caisse-et-trous_orig.jpg"),
    ("papier", "ote-ton-portrait", "ote-ton-portrait-trous_orig.jpg"),
    ("papier", "composition-toile-papier", "img-1216-copie-jpg-corr_orig.jpg"),
    ("papier", "totem", "totem_orig.jpg"),
    ("papier", "du-jardin", "emmanuel-kervyn-sept18-0006-2_orig.jpg"),
    ("papier", "mon-alisa-1", "mg-3945-crop-mail-resize_orig.jpg"),
    ("papier", "la-moitie-d-un-3-4", "mg-3928-mail-resize_orig.jpg"),
    ("papier", "sans-titre", "p1120891-jpg-corr_orig.jpg"),
    ("papier", "5-couches-de-moi", "img-1226-copie-jpg-corr_orig.jpg"),
    ("papier", "sans-titre-2", "img-1221-copie-jpg-corr_orig.jpg"),
    ("papier", "autoportrait", "emmanuel-kervyn-2-copie-jpg-ss-cadre_orig.jpg"),
    # Volumes
    ("volumes", "compression-papier", "img-0543-copie_orig.jpg"),
    ("volumes", "words-pvc", "280941115-569529411176593-9134203340171189458-n-jpg-corr_orig.jpg"),
    ("volumes", "feuilles", "46190036-285142168797104-8177690668718620672-o-1_orig.jpg"),
    ("volumes", "sans-titre-ytong-platre-papier", "img-2829-jpg-corr-jpg-corr_orig.jpg"),
    ("volumes", "gratuit", "img-2054-2_orig.jpg"),
    ("volumes", "fragile-carton-bois", "emmanuel-kervyn-sept18-0011-jpg-corr_orig.jpg"),
    ("volumes", "financial-times", "emmanuel-kervyn-sept18-0016-jpg-corr_orig.jpg"),
    ("volumes", "sans-titre-carton-bois", "emmanuel-kervyn-sept18-0020-jpg-corr_orig.jpg"),
    ("volumes", "sans-titre-carton-metal", "img-2646-2_orig.jpg"),
    ("volumes", "sans-titre-platre-papier", "img-3657-jpg-corr_orig.jpg"),
    ("volumes", "elle-va-bien", "dsc-8987_orig.jpg"),
    ("volumes", "fragile", "img-1006-copie_orig.jpg"),
    ("volumes", "270-a4", "20250528-170343_orig.jpg"),
    ("volumes", "croix-de-papier", "20250528-170407_orig.jpg"),
    ("volumes", "time", "emmanuel-kervyn-sept18-0015_orig.jpg"),
    ("volumes", "sans-titre-cailloux-mdf", "img-2836-jpg-corr_orig.jpg"),
    ("volumes", "just-weight", "img-3349-jpg-corr-2_orig.jpg"),
    ("volumes", "sans-titre-carton-verre", "img-3472-jpg-corr_orig.jpg"),
    ("volumes", "sans-titre-bois", "img-3606-jpg-corr_orig.jpg"),
    ("volumes", "sans-titre-bois-2", "img-3617-jpg-corr_orig.jpg"),
    ("volumes", "autoportant", "img-3632-jpg-corr_orig.jpg"),
    ("volumes", "sans-titre-agglomere", "img-3644-jpg-corr_orig.jpg"),
    ("volumes", "sans-titre-metal", "img-4237-jpg-corr_orig.jpg"),
    ("volumes", "sans-titre-bois-corde-metal", "img-4433_orig.jpg"),
    ("volumes", "sans-titre-metal-2", "img-4757-jpg-corr_orig.jpg"),
    ("volumes", "tenon-mortaise", "img-4936_orig.jpg"),
    ("volumes", "emplir-de-vide", "img-7359_orig.jpg"),
    ("volumes", "absence", "img-7421-jpg-corr_orig.jpg"),
    ("volumes", "sans-titre-beton-herbe-brulee", "img-7624-jpg-corr_orig.jpg"),
    ("volumes", "caddy", "img-9177-jpg-corr_orig.jpg"),
    ("volumes", "feuilles-cendres-beton", "img-8961_orig.jpg"),
    ("volumes", "cendres-bois", "img-8970-jpg-corr_orig.jpg"),
    ("volumes", "bois-cendres-souris", "img-8986_orig.jpg"),
    ("volumes", "suie-craie", "img-9030_orig.jpg"),
    ("volumes", "gravite", "20240108-181806-copie_orig.jpg"),
    ("volumes", "la-faute", "img-1001-copie_orig.jpg"),
    ("volumes", "la-fuite-dans-les-idees", "img-1041-copie_orig.jpg"),
    ("volumes", "sans-titre-beton", "img-0925-copie_orig.jpg"),
    ("volumes", "sans-titre-pvc", "20240130-182718-copie_orig.jpg"),
    ("volumes", "sans-titre-pvc-2", "img-1008-copie_orig.jpg"),
    ("volumes", "9-a4", "20250607-145836_orig.jpg"),
    ("volumes", "sans-titre-bois-3", "20250528-165852_orig.jpg"),
    ("volumes", "4-en-1", "20250528-165804_orig.jpg"),
    ("volumes", "installation-espace-d", "img-2065_orig.jpg"),
    ("volumes", "sans-titre-metal-papier-pvc", "img-2075_orig.jpg"),
    ("volumes", "sans-titre-bois-pvc", "img-2081_orig.jpg"),
    ("volumes", "sans-titre-pvc-3", "img-2087_orig.jpg"),
    ("volumes", "in-situ-espace-d", "img-2093_orig.jpg"),
    ("volumes", "p-m-monochrome", "img-2096_orig.jpg"),
    # Vidéos: Vorschaubilder
    ("videos", "en-pure-perte", "capture-jpg-en-pure-perte_orig.jpg"),
    ("videos", "exister-sans-l-autre", "capture-jpg-exister-ss-l-autre_orig.jpg"),
    ("videos", "facon-contre-facon", "capture-jpg-fa-on-contre-f_orig.jpg"),
    ("videos", "scan", "capture-jpg-scan-1_orig.jpg"),
    ("videos", "fragile", "capture-jpg-fragile_orig.jpg"),
    ("videos", "hors-format", "dsc03940-ep-pic-mo-jpg-corr-psd-titre_orig.jpg"),
    ("videos", "23-x-21-x-23-cm", "vlcsnap-2023-09-25-21h58m46s832_orig.png"),
    ("videos", "le-notre", "vlcsnap-2023-09-21-09h49m06s217_orig.jpg"),
    ("videos", "roll-over", "vlcsnap-2023-09-27-19h18m55s235_orig.png"),
    ("videos", "le-lion", "vlcsnap-2023-11-29-20h54m15s607_orig.png"),
    ("videos", "paperasserie", "vlcsnap-2024-04-04-22h10m45s014_orig.png"),
    ("videos", "in-memoriam", "vlcsnap-2024-07-04-16h03m24s826_orig.png"),
    ("videos", "go-waste", "capture-d-cran-2-10-2025-145818-vimeo-com_orig.jpeg"),
    ("videos", "bis-repetita", "vlcsnap-2026-07-22-17h51m19s902_orig.png"),
    # Vidéos: Standbilder
    ("videos", "bis-repetita-2", "20260427-102446_orig.jpg"),
    ("videos", "bis-repetita-3", "vlcsnap-2026-07-22-18h32m54s096_orig.png"),
    ("videos", "in-memoriam-extrait", "vlcsnap-2024-02-01-07h13m19s033-png-corr_orig.png"),
    ("videos", "in-memoriam-extrait-2", "vlcsnap-2024-09-25-09h35m43s257_orig.png"),
    ("videos", "le-lion-extrait", "pour-flyer-soir-e-video-1_orig.jpg"),
    ("videos", "le-lion-extrait-2", "vlcsnap-2024-09-25-09h01m42s120_orig.png"),
    ("videos", "le-lion-extrait-3", "vlcsnap-2024-09-25-09h02m38s574_orig.png"),
    ("videos", "hors-format-1", "vlcsnap-2023-09-21-10h14m13s693_orig.jpg"),
    ("videos", "hors-format-2", "vlcsnap-2023-09-21-10h15m16s566_orig.jpg"),
    ("videos", "hors-format-3", "vlcsnap-2023-09-21-10h19m26s826_orig.jpg"),
    ("videos", "hors-format-4", "vlcsnap-2023-09-21-10h20m57s607_orig.jpg"),
    ("videos", "le-notre-2", "vlcsnap-2023-09-21-09h59m26s083_orig.jpg"),
    ("videos", "le-notre-3", "vlcsnap-2023-09-21-10h07m36s688_orig.jpg"),
    # Au Nord du Monde
    ("au-nord-du-monde", "installation-performative", "vlcsnap-2026-01-11-21h07m54s630_orig.png"),
    ("au-nord-du-monde", "still-2", "vlcsnap-2026-01-11-21h09m00s207_orig.png"),
    ("au-nord-du-monde", "still-3", "vlcsnap-2026-06-04-09h58m32s259_orig.png"),
    ("au-nord-du-monde", "still-4", "vlcsnap-2026-06-04-10h00m23s489_orig.png"),
    ("au-nord-du-monde", "still-5", "vlcsnap-2026-06-04-10h03m56s737_orig.png"),
    ("au-nord-du-monde", "avril-2026", "avril-2026-au-nord-du-monde-1359-prv_orig.jpg"),
    # Écrits (Texte als Bild)
    ("ecrits", "on-ne-sauvera-pas-le-carton", "on-ne-sauvera-pas-le-carton_orig.jpg"),
    ("ecrits", "joconde", "txt-joconde_orig.jpg"),
    # In Situ
    ("in-situ", "jodoigne-2021-sans-titre", "img-5986_orig.jpg"),
    ("in-situ", "jodoigne-2021-sans-titre-2", "chemin-faisant-jodoigne-2021-002-jpg-corr_orig.jpg"),
    ("in-situ", "jodoigne-2021-white-washing", "chemin-faisant-jodoigne-2021-008-jpg-corr_orig.jpg"),
    ("in-situ", "jodoigne-2021-sans-titre-3", "img-6074_orig.jpg"),
    ("in-situ", "jodoigne-2021-sans-titre-4", "img-6159_orig.jpg"),
    ("in-situ", "jodoigne-2021-le-notre-detail", "img-6101-jpg-corr_orig.jpg"),
    ("in-situ", "jodoigne-2021-sans-titre-5", "img-6138_orig.jpg"),
    ("in-situ", "jodoigne-2021-fiat-lux", "img-6178-jpg-corr_orig.jpg"),
    ("in-situ", "jodoigne-2019-ego", "img-6613_orig.jpg"),
    ("in-situ", "blankenberge-2016-sans-titre", "img-1890-jpg-corr_orig.jpg"),
    ("in-situ", "blankenberge-sans-titre", "img-4668-jpg-corr-2_orig.jpg"),
    ("in-situ", "oubli", "img-6899-jpg-corrig-e_orig.jpg"),
    # Contact
    ("contact", "jamais-un-coup-de-des-belgacom", "mg-3952-crop-mail-resize-jpg-corr_orig.jpg"),
]


# Vimeo-Videos: das Posterbild (1280 px) wird einmalig über die oEmbed-API geholt
# und liegt danach im Repo. Die Seite selbst stellt vor dem Klick keine Anfrage an Vimeo.
VIMEO = [
    # Nur für Videos, deren Vorschaubild auf der alten Seite ein Screenshot war.
    "868799399",  # façon contre façon
    "867901812",  # scan
]

# Open-Graph-Bild (1200 × 630) für Link-Vorschauen
OG_SOURCE = ("accueil", "accueil")


def fetch_vimeo_poster(video_id: str, dest: pathlib.Path) -> None:
    api = f"https://vimeo.com/api/oembed.json?url=https://vimeo.com/{video_id}&width=1280"
    req = urllib.request.Request(api, headers={"User-Agent": "fetch-media/1.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        thumb = json.load(r)["thumbnail_url"]
    thumb = re.sub(r"_\d+x\d+", "_1280x720", thumb)
    req = urllib.request.Request(thumb, headers={"User-Agent": "fetch-media/1.0", "Accept": "image/jpeg"})
    with urllib.request.urlopen(req, timeout=60) as r:
        dest.write_bytes(r.read())


def make_og(src: pathlib.Path, dest: pathlib.Path) -> None:
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        ImageOps.fit(im, (1200, 630), Image.LANCZOS, centering=(0.5, 0.45)).save(dest, "JPEG", quality=85)


def download(remote: str, dest: pathlib.Path) -> str:
    """Lädt das Original; fällt auf die Weebly-Vorschau zurück, wenn kein *_orig existiert."""
    for name in (remote, remote.replace("_orig", "")):
        for attempt in range(6):
            try:
                req = urllib.request.Request(BASE + name, headers={"User-Agent": "fetch-media/1.0"})
                with urllib.request.urlopen(req, timeout=60) as r:
                    dest.write_bytes(r.read())
                time.sleep(0.5)  # Weebly drosselt bei zu vielen Anfragen (HTTP 429)
                return name
            except urllib.error.HTTPError as e:
                if e.code == 404:
                    break
                if e.code in (429, 503):
                    time.sleep(5 * (attempt + 1))
                    continue
                raise
    raise RuntimeError(f"nicht gefunden: {remote}")


def render(src: pathlib.Path, dest: pathlib.Path, size: int) -> tuple[int, int]:
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") and "transparency" in im.info or im.mode == "RGBA" else "RGB")
        im.thumbnail((size, size), Image.LANCZOS)
        im.save(dest, "WEBP", quality=82, method=6)
        return im.size


def main() -> None:
    force = "--force" in sys.argv
    dims, fallbacks = {}, []
    jobs = [(s, n, r) for s, n, r in MEDIA] + [("videos", f"vimeo-{v}", f"vimeo:{v}") for v in VIMEO]
    for section, name, remote in jobs:
        ext = ".jpg" if remote.startswith("vimeo:") else pathlib.Path(remote).suffix.lower().replace(".jpeg", ".jpg")
        orig = ROOT / "images" / "_orig" / section / f"{name}{ext}"
        orig.parent.mkdir(parents=True, exist_ok=True)
        if force or not orig.exists():
            if remote.startswith("vimeo:"):
                fetch_vimeo_poster(remote[6:], orig)
            else:
                got = download(remote, orig)
                if got != remote:
                    fallbacks.append(f"{section}/{name}: {got}")
            print("↓", section, name)
        out = ROOT / "images" / section
        out.mkdir(parents=True, exist_ok=True)
        large, thumb = out / f"{name}.webp", out / f"{name}-600.webp"
        if force or not large.exists() or large.stat().st_mtime < orig.stat().st_mtime:
            dims[f"{section}/{name}"] = render(orig, large, LARGE)
            render(orig, thumb, THUMB)
        else:
            with Image.open(large) as im:
                dims[f"{section}/{name}"] = im.size

    og_src = next((ROOT / "images" / "_orig" / OG_SOURCE[0]).glob(f"{OG_SOURCE[1]}.*"))
    make_og(og_src, ROOT / "images" / "og.jpg")

    js = ROOT / "content" / "media.js"
    js.parent.mkdir(exist_ok=True)
    body = ",\n".join(f'  "{k}": [{w}, {h}]' for k, (w, h) in dims.items())
    js.write_text(
        "// Automatisch erzeugt von scripts/fetch-media.py – nicht von Hand bearbeiten.\n"
        "// Bildmaße der WebP-Fassung (max. 2000 px). Thumbnails: <name>-600.webp\n"
        f"window.MEDIA = {{\n{body}\n}};\n",
        encoding="utf-8",
    )
    print(f"\n{len(dims)} Bilder, content/media.js geschrieben.")
    if fallbacks:
        print("Kein *_orig vorhanden, Vorschau verwendet:\n  " + "\n  ".join(fallbacks))


if __name__ == "__main__":
    main()
