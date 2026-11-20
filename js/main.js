/*
 * Gemeinsamer Kern: Zustand (Stil, Sprache), Routing, DOM-Helfer,
 * Umschalter, Lightbox und Dialog für Impressum/Datenschutz.
 * Die drei Layouts (js/layouts/*.js) registrieren sich in App.layouts
 * und bauen aus window.CONTENT ihr eigenes DOM.
 */
(function () {
  "use strict";

  const C = window.CONTENT;
  const MEDIA = window.MEDIA || {};
  const STYLES = ["minimal", "edel", "schrill"];
  const LANGS = ["fr", "de", "en"];
  const LEGAL = { impressum: "legal", datenschutz: "privacy" };
  const KEY_STYLE = "ek-style";
  const KEY_LANG = "ek-lang";

  /* ------------------------------------------------------------------ Speicher */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* privat/gesperrt */ } },
  };

  function initial(param, key, allowed, fallback) {
    const q = new URLSearchParams(location.search).get(param);
    if (allowed.includes(q)) { store.set(key, q); return q; }
    const s = store.get(key);
    if (allowed.includes(s)) return s;
    return typeof fallback === "function" ? fallback() : fallback;
  }

  function browserLang() {
    const list = navigator.languages || [navigator.language || ""];
    for (const l of list) {
      const code = String(l).slice(0, 2).toLowerCase();
      if (LANGS.includes(code)) return code;
    }
    return "fr";
  }

  /* ------------------------------------------------------------------ App */
  const App = (window.App = {
    layouts: {},
    state: {
      style: initial("style", KEY_STYLE, STYLES, "minimal"),
      lang: initial("lang", KEY_LANG, LANGS, browserLang),
    },
    styles: STYLES,
    langs: LANGS,
    content: C,
    sections: C.sections,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)"),
  });

  /** Mehrsprachigen Wert auflösen (Fallback Französisch). */
  App.t = function (v) {
    if (v == null) return v;
    if (typeof v !== "object" || Array.isArray(v)) return v;
    if (!("fr" in v)) return v;
    return v[App.state.lang] ?? v.fr;
  };
  App.ui = (key) => C.ui[App.state.lang][key] ?? C.ui.fr[key];
  App.section = (id) => C.sections.find((s) => s.id === id);
  App.roman = (n) => ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n] || String(n);

  /** Kleiner DOM-Helfer: h("a", {href: "#"}, "Text", child, …) */
  App.h = function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else if (k === "html") el.innerHTML = v;
        else if (k === "style" && typeof v === "object") {
          for (const [p, val] of Object.entries(v)) {
            if (val == null) continue;
            if (p.startsWith("--")) el.style.setProperty(p, val);
            else el.style[p] = val;
          }
        }
        else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
        else if (k === "dataset") Object.assign(el.dataset, v);
        else el.setAttribute(k, v === true ? "" : v);
      }
    }
    for (const c of children.flat(Infinity)) {
      if (c == null || c === false) continue;
      el.append(c.nodeType ? c : document.createTextNode(String(c)));
    }
    return el;
  };
  const h = App.h;

  /** Absätze mit Zeilenumbrüchen („\n“) als <p> rendern. */
  App.paragraphs = function (list, cls) {
    return (App.t(list) || []).map((p) =>
      h("p", { class: cls }, p.split("\n").map((line, i) => (i ? [h("br"), line] : line)))
    );
  };

  /* ------------------------------------------------------------------ Bilder */
  App.dims = (ref) => MEDIA[ref] || [1200, 900];
  App.src = (ref, thumb) => `images/${ref}${thumb ? "-600" : ""}.webp`;

  /** Bildunterschrift eines Werks: { title, meta } */
  App.caption = function (work) {
    const title = work.title || "";
    const meta = [App.t(work.material), work.dims, App.t(work.note)].filter(Boolean).join(" · ");
    return { title, meta };
  };
  App.alt = function (work) {
    if (work.alt) return App.t(work.alt);
    const { title, meta } = App.caption(work);
    return [title, meta].filter(Boolean).join(", ") || C.site.name;
  };

  /**
   * <img> mit srcset (600 px Thumbnail + große Fassung), width/height, lazy.
   * opts: { sizes, eager, cls, alt }
   */
  App.img = function (ref, opts = {}) {
    const [w, hgt] = App.dims(ref);
    const tw = Math.round(w >= hgt ? Math.min(600, w) : (Math.min(600, hgt) * w) / hgt);
    return h("img", {
      src: App.src(ref, !opts.large),
      srcset: `${App.src(ref, true)} ${tw}w, ${App.src(ref)} ${w}w`,
      sizes: opts.sizes || "(max-width: 700px) 100vw, 33vw",
      width: w,
      height: hgt,
      alt: opts.alt ?? "",
      loading: opts.eager ? "eager" : "lazy",
      decoding: "async",
      class: opts.cls,
    });
  };

  /**
   * Werk als anklickbare Figur, öffnet die Lightbox.
   * opts: { list, index, sizes, cls, captionCls, label, caption: false }
   */
  App.figure = function (work, opts = {}) {
    const { title, meta } = App.caption(work);
    const alt = App.alt(work);
    const btn = h(
      "button",
      {
        type: "button",
        class: "work__open",
        "aria-label": `${App.ui("enlarge")}: ${alt}`,
        onclick: (e) => App.lightbox.open(opts.list || [work], opts.index || 0, e.currentTarget),
      },
      App.img(work.img, { alt, sizes: opts.sizes, eager: opts.eager })
    );
    return h(
      "figure",
      { class: ["work", opts.cls].filter(Boolean).join(" "), style: opts.style },
      opts.label ? h("span", { class: "work__label", "aria-hidden": "true" }, opts.label) : null,
      btn,
      opts.caption === false || (!title && !meta)
        ? null
        : h(
            "figcaption",
            { class: ["work__caption", opts.captionCls].filter(Boolean).join(" ") },
            title ? h("span", { class: "work__title" }, title) : null,
            meta ? h("span", { class: "work__meta" }, meta) : null
          )
    );
  };

  /** Alle Bilder eines Bereichs (für die Lightbox). */
  App.worksOf = function (section) {
    if (section.type === "videos") {
      const out = [];
      for (const v of section.videos) {
        for (const s of v.stills || []) out.push({ img: s, title: v.title, note: { fr: "Image extraite", de: "Standbild", en: "Still" } });
      }
      return out;
    }
    return [section.lead, ...(section.works || [])].filter(Boolean);
  };

  /* ------------------------------------------------------------------ Umschalter */
  function segmented(kind, items, current, label, onPick, cls) {
    return h(
      "div",
      { class: `switch switch--${kind} ${cls || ""}`.trim(), role: "group", "aria-label": label },
      items.map((it) =>
        h(
          "button",
          {
            type: "button",
            class: "switch__btn",
            "aria-pressed": String(it.value === current),
            "data-switch": `${kind}:${it.value}`,
            lang: it.lang,
            title: it.title,
            onclick: () => onPick(it.value),
          },
          it.short ? [h("span", { "aria-hidden": "true" }, it.short), h("span", { class: "sr-only" }, it.title)] : it.text
        )
      )
    );
  }

  App.styleSwitcher = (cls) =>
    segmented(
      "style",
      STYLES.map((s) => ({ value: s, text: C.ui[App.state.lang].styles[s] })),
      App.state.style,
      App.ui("style"),
      App.setStyle,
      cls
    );

  App.langSwitcher = (cls) =>
    segmented(
      "lang",
      LANGS.map((l) => ({ value: l, short: l.toUpperCase(), title: C.ui[l].langs[l], lang: l })),
      App.state.lang,
      App.ui("lang"),
      App.setLang,
      cls
    );

  App.switchers = (cls) => h("div", { class: `switchers ${cls || ""}`.trim() }, App.langSwitcher(), App.styleSwitcher());

  App.legalLinks = (cls) =>
    h(
      "ul",
      { class: `legal-links ${cls || ""}`.trim() },
      h("li", null, h("a", { href: "#impressum" }, App.t(C.legal.title))),
      h("li", null, h("a", { href: "#datenschutz" }, App.t(C.privacy.title)))
    );

  App.translationNote = (cls) => {
    const note = App.ui("translated");
    return note ? h("p", { class: `translation-note ${cls || ""}`.trim(), lang: App.state.lang }, note) : null;
  };

  App.emailLink = (sec, cls) => {
    const addr = sec.email.join("@");
    return h("a", { href: `mailto:${addr}`, class: cls }, addr);
  };
  App.phoneLink = (sec, cls) => h("a", { href: `tel:${sec.phone.tel}`, class: cls }, sec.phone.display);

  /* ------------------------------------------------------------------ Routing */
  App.route = () => decodeURIComponent(location.hash.replace(/^#/, ""));
  App.currentSection = () => {
    const r = App.route();
    return App.section(r) ? r : "accueil";
  };

  function updateTitle(id) {
    const sec = App.section(id);
    const base = App.t(C.site.title);
    document.title = sec && id !== "accueil" ? `${App.t(sec.nav)} — ${C.site.name}` : base;
  }
  App.updateTitle = updateTitle;

  /* ------------------------------------------------------------------ Rendern */
  const root = () => document.getElementById("app");
  let layout = null;

  function render(opts = {}) {
    const html = document.documentElement;
    html.dataset.style = App.state.style;
    html.lang = App.state.lang;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", App.t(C.site.description));

    if (layout && layout.destroy) layout.destroy();
    layout = App.layouts[App.state.style];
    const app = root();
    app.replaceChildren();
    layout.render(app);
    const r = App.route();
    if (!LEGAL[r]) {
      updateTitle(App.currentSection());
      if (layout.onRoute) layout.onRoute(App.currentSection(), { initial: true, keepScroll: opts.keepScroll });
    }
    if (opts.focus) {
      const el = app.querySelector(`[data-switch="${opts.focus}"]`);
      if (el) el.focus({ preventScroll: true });
    }
  }

  function syncParam(name, value) {
    const url = new URL(location.href);
    if (url.searchParams.has(name)) {
      url.searchParams.set(name, value);
      history.replaceState(history.state, "", url);
    }
  }

  App.setStyle = function (style) {
    if (!STYLES.includes(style) || style === App.state.style) return;
    App.state.style = style;
    store.set(KEY_STYLE, style);
    syncParam("style", style);
    render({ focus: `style:${style}` });
  };

  App.setLang = function (lang) {
    if (!LANGS.includes(lang) || lang === App.state.lang) return;
    App.state.lang = lang;
    store.set(KEY_LANG, lang);
    syncParam("lang", lang);
    const y = window.scrollY;
    render({ focus: `lang:${lang}`, keepScroll: true });
    if (App.state.style === "minimal") window.scrollTo(0, y);
  };

  window.addEventListener("hashchange", () => {
    const r = App.route();
    if (LEGAL[r]) { App.legal.open(LEGAL[r]); return; }
    if (App.legal.isOpen()) App.legal.close(true);
    updateTitle(App.currentSection());
    if (layout && layout.onRoute) layout.onRoute(App.currentSection(), {});
  });

  /* ------------------------------------------------------------------ Lightbox */
  App.lightbox = (function () {
    let dlg, img, cap, count, items = [], index = 0, opener = null, touchX = null;

    function build() {
      dlg = h("dialog", { class: "lightbox", "aria-label": App.ui("viewer") });
      img = h("img", { class: "lightbox__img", alt: "" });
      cap = h("p", { class: "lightbox__caption", "aria-live": "polite" });
      count = h("p", { class: "lightbox__count" });
      const btn = (cls, label, icon, fn) =>
        h("button", { type: "button", class: `lightbox__btn ${cls}`, "aria-label": label, onclick: fn }, h("span", { "aria-hidden": "true" }, icon));
      dlg.append(
        h("figure", { class: "lightbox__figure" }, img, h("figcaption", null, cap, count)),
        btn("lightbox__prev", App.ui("prev"), "←", () => go(-1)),
        btn("lightbox__next", App.ui("next"), "→", () => go(1)),
        btn("lightbox__close", App.ui("close"), "×", close)
      );
      dlg.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      });
      dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
      dlg.addEventListener("close", () => {
        document.documentElement.classList.remove("has-dialog");
        if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      });
      dlg.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
      dlg.addEventListener("touchend", (e) => {
        if (touchX == null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX = null;
      });
      document.body.append(dlg);
    }

    function show() {
      const work = items[index];
      const [w, hh] = App.dims(work.img);
      img.src = App.src(work.img);
      img.width = w;
      img.height = hh;
      img.alt = App.alt(work);
      const { title, meta } = App.caption(work);
      cap.replaceChildren(
        title ? h("span", { class: "lightbox__title" }, title) : null,
        meta ? h("span", { class: "lightbox__meta" }, meta) : null
      );
      count.textContent = items.length > 1 ? `${index + 1} / ${items.length}` : "";
      dlg.classList.toggle("is-single", items.length < 2);
      // nächstes Bild vorladen
      if (items.length > 1) new Image().src = App.src(items[(index + 1) % items.length].img);
    }

    function go(d) {
      if (items.length < 2) return;
      index = (index + d + items.length) % items.length;
      show();
    }

    function open(list, i, from) {
      if (!dlg || !dlg.isConnected) build();
      dlg.setAttribute("aria-label", App.ui("viewer"));
      dlg.querySelector(".lightbox__prev").setAttribute("aria-label", App.ui("prev"));
      dlg.querySelector(".lightbox__next").setAttribute("aria-label", App.ui("next"));
      dlg.querySelector(".lightbox__close").setAttribute("aria-label", App.ui("close"));
      items = list; index = i; opener = from || document.activeElement;
      show();
      document.documentElement.classList.add("has-dialog");
      dlg.showModal();
      dlg.querySelector(".lightbox__close").focus();
    }

    function close() { if (dlg && dlg.open) dlg.close(); }
    return { open, close };
  })();

  /* ------------------------------------------------------------------ Impressum / Datenschutz */
  App.legal = (function () {
    let dlg, lastFocus = null;
    function open(kind) {
      if (dlg) dlg.remove();
      const data = C[kind];
      lastFocus = document.activeElement;
      dlg = h(
        "dialog",
        { class: "legal", "aria-labelledby": "legal-title" },
        h(
          "div",
          { class: "legal__inner" },
          h("h2", { id: "legal-title", class: "legal__title" }, App.t(data.title)),
          App.paragraphs(data.body, "legal__p"),
          h("button", { type: "button", class: "legal__close", onclick: () => close() }, App.ui("close"))
        )
      );
      dlg.addEventListener("close", () => {
        document.documentElement.classList.remove("has-dialog");
        if (LEGAL[App.route()]) history.replaceState(history.state, "", location.pathname + location.search);
        if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
      });
      dlg.addEventListener("click", (e) => { if (e.target === dlg) close(); });
      document.body.append(dlg);
      document.documentElement.classList.add("has-dialog");
      dlg.showModal();
      dlg.querySelector(".legal__close").focus();
    }
    function close() { if (dlg && dlg.open) dlg.close(); }
    return { open, close, isOpen: () => !!(dlg && dlg.open) };
  })();

  /* ------------------------------------------------------------------ Start */
  function start() {
    render();
    const r = App.route();
    if (LEGAL[r]) App.legal.open(LEGAL[r]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
