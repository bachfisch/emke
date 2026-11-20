/*
 * Stil „Schrill“: Collage.
 * Desktop: horizontal scrollende Bahn aus Tafeln (Mausrad scrollt seitwärts).
 * Handy / schmale Fenster: vertikal gestapelt.
 * Gerissene Kanten (clip-path), Schnittlinien, schräg geklebte Bilder.
 * Bewegung entfällt bei prefers-reduced-motion.
 */
(function () {
  "use strict";
  const App = window.App;
  const h = App.h;
  let track = null;
  let cleanup = [];

  const WIDE = window.matchMedia("(min-width: 900px) and (min-height: 560px)");

  /* deterministischer Zufall, damit die Collage bei jedem Laden gleich aussieht */
  function rand(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  }
  const hash = (str) => [...str].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7);

  /** gerissene Kante oben und unten als clip-path-Polygon */
  function torn(seed, amp = 2.2, steps = 18) {
    const r = rand(Math.abs(seed) + 1);
    const top = [], bottom = [];
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * 100;
      top.push(`${x.toFixed(1)}% ${(r() * amp).toFixed(2)}%`);
      bottom.push(`${(100 - x).toFixed(1)}% ${(100 - r() * amp).toFixed(2)}%`);
    }
    return `polygon(${top.join(",")},${bottom.join(",")})`;
  }
  const tilt = (seed, max = 3) => ((rand(Math.abs(seed) + 11)() * 2 - 1) * max).toFixed(2) + "deg";

  const COLORS = ["pink", "yellow", "blue", "paper"];

  /* ---------------------------------------------------------------- Bausteine */
  function panelHead(sec, n, color) {
    return h(
      "header",
      { class: `sc-head sc-bg--${color}`, style: { clipPath: torn(hash(sec.id), 1.5) } },
      h("span", { class: "sc-head__no", "aria-hidden": "true" }, String(n).padStart(2, "0")),
      h("h2", { class: "sc-head__title", id: `${sec.id}-title`, tabindex: "-1" }, App.t(sec.nav))
    );
  }

  function collage(list, seedBase) {
    return h(
      "div",
      { class: "sc-collage" },
      list.map((w, i) => {
        const seed = seedBase + i * 97;
        const [iw, ih] = App.dims(w.img);
        const fig = App.figure(w, {
          list,
          index: i,
          cls: `sc-work sc-work--${COLORS[i % 3]}`,
          sizes: "(max-width: 900px) 50vw, 30vw",
        });
        fig.style.setProperty("--ar", Math.min(Math.max(iw / ih, 0.25), 1.9).toFixed(3));
        fig.style.setProperty("--tilt", tilt(seed, 3.5));
        fig.style.setProperty("--shift", `${-Math.round(rand(seed)() * 18)}px`);
        const img = fig.querySelector("img");
        img.style.clipPath = torn(seed, 1.6, 14);
        return fig;
      })
    );
  }

  function ticker(text) {
    const run = h("span", { class: "sc-ticker__run" }, Array.from({ length: 6 }, () => `${text} ✂ `));
    return h("div", { class: "sc-ticker", "aria-hidden": "true" }, run, run.cloneNode(true));
  }

  /* ---------------------------------------------------------------- Tafeln */
  function panelHome(sec) {
    const lines = sec.headline.replace(/\.$/, "").split(",").map((s) => s.trim());
    return h(
      "section",
      { id: sec.id, class: "sc-panel sc-home", "aria-labelledby": "sc-name" },
      h(
        "div",
        { class: "sc-home__title" },
        h("h1", { class: "sc-name", id: "sc-name", tabindex: "-1" }, h("span", null, "Emmanuel"), h("span", null, "Kervyn")),
        h(
          "p",
          { class: "sc-headline", lang: "fr" },
          lines.map((l, i) => h("span", { class: `sc-headline__line sc-bg--${COLORS[i]}`, style: { clipPath: torn(i * 13 + 5, 6, 10), "--tilt": tilt(i * 7, 2.5) } }, l))
        )
      ),
      h(
        "div",
        { class: "sc-home__img" },
        h("span", { class: "sc-tape", "aria-hidden": "true" }),
        App.figure(sec.image, { caption: false, eager: true, sizes: "(max-width: 900px) 90vw, 40vw" })
      ),
      h(
        "div",
        { class: "sc-note sc-note--statement", style: { "--tilt": "-1.5deg" } },
        h("p", { class: "sc-big" }, App.t(sec.statement))
      ),
      h("div", { class: "sc-note sc-note--text", style: { "--tilt": "1.2deg" } }, App.paragraphs(sec.text)),
      h(
        "div",
        { class: "sc-note sc-note--bio", style: { "--tilt": "-0.8deg" } },
        h("h2", { class: "sc-label" }, App.ui("bio")),
        App.paragraphs(sec.bio)
      ),
      h(
        "div",
        { class: "sc-receipt", style: { "--tilt": "1.5deg" } },
        h("h2", { class: "sc-label" }, App.ui("exhibitions")),
        h(
          "ol",
          { class: "sc-receipt__list", reversed: true },
          sec.exhibitions.map((e) => h("li", null, h("b", null, e.year), " ", h("span", null, `${e.place} — ${App.t(e.detail)}`)))
        )
      ),
      ticker(sec.headline.toUpperCase())
    );
  }

  function panelGallery(sec, n, color) {
    const list = App.worksOf(sec);
    return h(
      "section",
      { id: sec.id, class: "sc-panel sc-gallery", "aria-labelledby": `${sec.id}-title` },
      panelHead(sec, n, color),
      sec.subtitle ? h("p", { class: "sc-sub" }, App.t(sec.subtitle)) : null,
      sec.quote
        ? h(
            "blockquote",
            { class: "sc-quote" },
            h("p", { lang: "fr" }, sec.quote.fr),
            App.state.lang !== "fr" ? h("p", { class: "sc-quote__tr" }, App.t(sec.quote)) : null
          )
        : null,
      collage(list, hash(sec.id))
    );
  }

  function panelVideos(sec, n, color) {
    const stills = App.worksOf(sec);
    let k = 0;
    return h(
      "section",
      { id: sec.id, class: "sc-panel sc-videos", "aria-labelledby": `${sec.id}-title` },
      panelHead(sec, n, color),
      h(
        "div",
        { class: "sc-videos__grid" },
        sec.videos.map((v, i) => {
          const start = k;
          k += (v.stills || []).length;
          return h(
            "div",
            { class: `sc-video sc-video--${COLORS[i % 3]}`, style: { "--tilt": tilt(i * 31 + 3, 1.6) } },
            App.video(v, { sizes: "(max-width: 900px) 90vw, 35vw" }),
            v.stills
              ? h(
                  "div",
                  { class: "sc-video__stills", role: "group", "aria-label": `${App.ui("stills")}: ${v.title}` },
                  v.stills.map((s, j) =>
                    App.figure(stills[start + j], { list: stills, index: start + j, caption: false, sizes: "120px", cls: "sc-still", style: { "--tilt": tilt(j * 17 + i, 8) } })
                  )
                )
              : null
          );
        })
      )
    );
  }

  function panelTexts(sec, n, color) {
    return h(
      "section",
      { id: sec.id, class: "sc-panel sc-texts", "aria-labelledby": `${sec.id}-title` },
      panelHead(sec, n, color),
      sec.texts.map((t, i) =>
        h(
          "article",
          { class: "sc-text", style: { "--tilt": tilt(i * 5 + 2, 1.2) } },
          h("div", { class: "sc-text__img" }, App.figure(t.image, { sizes: "(max-width: 900px) 90vw, 25vw" })),
          h("div", { class: "sc-text__body", tabindex: "0", role: "region", "aria-label": t.title ? App.t(t.title) : t.image.title }, t.title ? h("h3", { class: "sc-text__title" }, App.t(t.title)) : null, App.paragraphs(t.body))
        )
      )
    );
  }

  function panelContact(sec, n, color) {
    return h(
      "section",
      { id: sec.id, class: "sc-panel sc-contact", "aria-labelledby": `${sec.id}-title` },
      panelHead(sec, n, color),
      h(
        "div",
        { class: "sc-contact__card sc-bg--blue", style: { clipPath: torn(99, 2.5) } },
        h("p", { class: "sc-label" }, App.ui("email")),
        h("p", { class: "sc-contact__big" }, App.emailLink(sec)),
        h("p", { class: "sc-label" }, App.ui("phone")),
        h("p", { class: "sc-contact__big" }, App.phoneLink(sec))
      ),
      h("div", { class: "sc-contact__img", style: { "--tilt": "2deg" } }, App.figure(sec.image, { sizes: "(max-width: 900px) 80vw, 25vw" })),
      h(
        "footer",
        { class: "sc-footer" },
        h("p", null, `© ${App.content.site.name}`),
        App.legalLinks(),
        App.translationNote()
      )
    );
  }

  /* ---------------------------------------------------------------- Rahmen */
  function render(app) {
    const nav = h(
      "nav",
      { class: "sc-nav", "aria-label": App.ui("nav") },
      h(
        "ul",
        { class: "sc-nav__list" },
        App.sections.map((s, i) =>
          h("li", null, h("a", { href: `#${s.id}`, class: `sc-nav__link sc-nav__link--${COLORS[i % 3]}`, "data-id": s.id }, App.t(s.nav)))
        )
      )
    );
    const tools = h("div", { class: "sc-tools" }, App.switchers());
    const progress = h("div", { class: "sc-progress", "aria-hidden": "true" }, h("span"));

    track = h("main", { id: "main", class: "sc-track", tabindex: "-1" });
    let n = 0;
    App.sections.forEach((sec, i) => {
      const color = COLORS[i % 3];
      if (sec.type === "home") { track.append(panelHome(sec)); return; }
      n += 1;
      track.append(h("div", { class: "sc-cut", "aria-hidden": "true" }, h("span", null, "✂")));
      if (sec.type === "videos") track.append(panelVideos(sec, n, color));
      else if (sec.type === "texts") track.append(panelTexts(sec, n, color));
      else if (sec.type === "contact") track.append(panelContact(sec, n, color));
      else track.append(panelGallery(sec, n, color));
    });

    const skip = h("a", { href: "#main", class: "skip-link", onclick: (e) => { e.preventDefault(); track.focus(); } }, App.ui("skip"));
    app.append(skip, h("a", { href: "#accueil", class: "sc-logo", "aria-label": App.content.site.name }, "E.K."), tools, progress, track, nav);

    /* Mausrad → seitwärts (nur im Breitformat) */
    const onWheel = (e) => {
      if (!WIDE.matches || e.ctrlKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      // innere, vertikal scrollbare Bereiche (Texte, Liste) zuerst scrollen lassen
      for (let el = e.target; el && el !== track; el = el.parentElement) {
        if (el.scrollHeight > el.clientHeight + 2 && /(auto|scroll)/.test(getComputedStyle(el).overflowY)) {
          const atTop = el.scrollTop <= 0, atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
          if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) return;
        }
      }
      const factor = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? track.clientWidth : 1;
      track.scrollLeft += e.deltaY * factor;
      e.preventDefault();
    };
    track.addEventListener("wheel", onWheel, { passive: false });

    /* Fortschritt + aktive Navigation */
    const bar = progress.firstChild;
    const onScroll = () => {
      const wide = WIDE.matches;
      const max = wide ? track.scrollWidth - track.clientWidth : document.documentElement.scrollHeight - innerHeight;
      const pos = wide ? track.scrollLeft : scrollY;
      bar.style.transform = `scaleX(${max > 0 ? pos / max : 0})`;
      markCurrent(wide);
    };
    /* aktiver Bereich: letzte Tafel, deren Anfang das erste Drittel des Fensters erreicht hat */
    const panels = [...track.querySelectorAll(".sc-panel")];
    let current = null;
    const markCurrent = (wide) => {
      let id = panels[0].id;
      for (const p of panels) {
        const r = p.getBoundingClientRect();
        if ((wide ? r.left : r.top) <= (wide ? innerWidth : innerHeight) / 3) id = p.id;
      }
      if (id === current) return;
      current = id;
      nav.querySelectorAll(".sc-nav__link").forEach((a) => {
        if (a.dataset.id === id) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanup.push(() => window.removeEventListener("scroll", onScroll));

    let io = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (en.isIntersecting) en.target.classList.add("is-in");
          }
        },
        { threshold: 0 }
      );
      track.querySelectorAll(".sc-work").forEach((el) => io.observe(el));
      cleanup.push(() => io.disconnect());
    } else {
      track.querySelectorAll(".sc-work").forEach((el) => el.classList.add("is-in"));
    }

    onScroll();
    const onResize = () => onScroll();
    WIDE.addEventListener("change", onResize);
    cleanup.push(() => WIDE.removeEventListener("change", onResize));
  }

  function onRoute(id, opts) {
    if (!track) return;
    const el = document.getElementById(id);
    if (!el) return;
    if (opts.keepScroll) return;
    if (opts.initial && id === "accueil" && !location.hash) return;
    const smooth = !opts.initial && !App.reducedMotion.matches;
    if (WIDE.matches) {
      track.scrollTo({ left: el.offsetLeft, behavior: smooth ? "smooth" : "auto" });
    } else {
      el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    }
    if (!opts.initial) {
      const head = el.querySelector("h1, h2");
      if (head) head.focus({ preventScroll: true });
    }
  }

  function destroy() {
    cleanup.forEach((f) => f());
    cleanup = [];
    track = null;
  }

  App.layouts.schrill = { render, onRoute, destroy };
})();
