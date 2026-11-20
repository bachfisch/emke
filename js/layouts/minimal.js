/*
 * Stil „Minimal“: ruhiger One-Pager.
 * Alle Bereiche untereinander, schlichte Navigation mit Ankern,
 * Bilder im lockeren Spaltenraster, ein einziger roter Akzent.
 */
(function () {
  "use strict";
  const App = window.App;
  const h = App.h;
  let observer = null;
  let onKey = null;

  const pad = (n) => String(n).padStart(2, "0");

  function sectionHeader(sec, n) {
    return h(
      "header",
      { class: "mn-section__head" },
      h("span", { class: "mn-num", "aria-hidden": "true" }, pad(n)),
      h("h2", { class: "mn-h2", id: `${sec.id}-title` }, App.t(sec.nav))
    );
  }

  function gallery(sec) {
    const list = App.worksOf(sec);
    return h(
      "div",
      { class: "mn-grid" },
      list.map((w, i) =>
        App.figure(w, { list, index: i, sizes: "(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 30vw", cls: "mn-work" })
      )
    );
  }

  function home(sec) {
    return h(
      "section",
      { id: sec.id, class: "mn-section mn-home", "aria-labelledby": "accueil-title" },
      h(
        "div",
        { class: "mn-home__intro" },
        h("h1", { class: "mn-home__name", id: "accueil-title" }, App.content.site.name),
        h("p", { class: "mn-home__headline", lang: "fr" }, sec.headline),
        h("p", { class: "mn-home__statement" }, App.t(sec.statement))
      ),
      h(
        "div",
        { class: "mn-home__visual" },
        App.figure(sec.image, { caption: false, eager: true, sizes: "(max-width: 900px) 100vw, 45vw", cls: "mn-home__img" })
      ),
      h("div", { class: "mn-home__text" }, App.paragraphs(sec.text)),
      h(
        "div",
        { class: "mn-about" },
        h(
          "div",
          { class: "mn-bio" },
          h("h2", { class: "mn-h3" }, App.ui("bio")),
          App.paragraphs(sec.bio)
        ),
        h(
          "div",
          { class: "mn-exh" },
          h("h2", { class: "mn-h3" }, App.ui("exhibitions")),
          h(
            "ol",
            { class: "mn-exh__list", reversed: true },
            sec.exhibitions.map((e) =>
              h("li", { class: "mn-exh__item" }, h("span", { class: "mn-exh__year" }, e.year), h("span", { class: "mn-exh__place" }, e.place), h("span", { class: "mn-exh__detail" }, App.t(e.detail)))
            )
          )
        )
      )
    );
  }

  function videos(sec, n) {
    const stills = App.worksOf(sec);
    let k = 0;
    return h(
      "section",
      { id: sec.id, class: "mn-section", "aria-labelledby": `${sec.id}-title` },
      sectionHeader(sec, n),
      h(
        "div",
        { class: "mn-videos" },
        sec.videos.map((v) => {
          const start = k;
          k += (v.stills || []).length;
          return h(
            "div",
            { class: "mn-video" },
            App.video(v, { sizes: "(max-width: 800px) 100vw, 45vw" }),
            v.stills
              ? h(
                  "div",
                  { class: "mn-stills", role: "group", "aria-label": `${App.ui("stills")}: ${v.title}` },
                  v.stills.map((s, i) => App.figure(stills[start + i], { list: stills, index: start + i, caption: false, sizes: "120px", cls: "mn-still" }))
                )
              : null
          );
        })
      )
    );
  }

  function texts(sec, n) {
    return h(
      "section",
      { id: sec.id, class: "mn-section", "aria-labelledby": `${sec.id}-title` },
      sectionHeader(sec, n),
      sec.texts.map((t) =>
        h(
          "article",
          { class: "mn-text" },
          h("div", { class: "mn-text__img" }, App.figure(t.image, { sizes: "(max-width: 800px) 100vw, 35vw" })),
          h(
            "div",
            { class: "mn-text__body" },
            t.title ? h("h3", { class: "mn-h3" }, App.t(t.title)) : null,
            App.paragraphs(t.body)
          )
        )
      )
    );
  }

  function contact(sec, n) {
    return h(
      "section",
      { id: sec.id, class: "mn-section mn-contact", "aria-labelledby": `${sec.id}-title` },
      sectionHeader(sec, n),
      h(
        "div",
        { class: "mn-contact__grid" },
        h(
          "dl",
          { class: "mn-contact__list" },
          h("dt", null, App.ui("email")),
          h("dd", null, App.emailLink(sec, "mn-contact__link")),
          h("dt", null, App.ui("phone")),
          h("dd", null, App.phoneLink(sec, "mn-contact__link"))
        ),
        App.figure(sec.image, { sizes: "(max-width: 800px) 100vw, 40vw", cls: "mn-contact__img" })
      )
    );
  }

  function generic(sec, n) {
    return h(
      "section",
      { id: sec.id, class: "mn-section", "aria-labelledby": `${sec.id}-title` },
      sectionHeader(sec, n),
      sec.subtitle ? h("p", { class: "mn-subtitle" }, App.t(sec.subtitle)) : null,
      sec.quote
        ? h(
            "blockquote",
            { class: "mn-quote" },
            h("p", { lang: "fr" }, `« ${sec.quote.fr} »`),
            App.state.lang !== "fr" ? h("p", { class: "mn-quote__tr" }, App.t(sec.quote)) : null
          )
        : null,
      gallery(sec)
    );
  }

  function render(app) {
    const sections = App.sections;
    const navItems = sections.filter((s) => s.id !== "accueil");

    const nav = h(
      "nav",
      { class: "mn-nav", id: "mn-nav", "aria-label": App.ui("nav") },
      h("ul", { class: "mn-nav__list" }, navItems.map((s) => h("li", null, h("a", { href: `#${s.id}`, class: "mn-nav__link", "data-id": s.id }, App.t(s.nav)))))
    );
    const menuBtn = h(
      "button",
      { type: "button", class: "mn-menu-btn", "aria-expanded": "false", "aria-controls": "mn-nav" },
      App.ui("menu")
    );
    const header = h(
      "header",
      { class: "mn-header" },
      h("a", { href: "#accueil", class: "mn-brand" }, App.content.site.name),
      menuBtn,
      nav,
      App.switchers("mn-tools")
    );
    const toggle = (open) => {
      header.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    };
    menuBtn.addEventListener("click", () => toggle(!header.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) toggle(false); });
    onKey = (e) => { if (e.key === "Escape" && header.classList.contains("is-open")) { toggle(false); menuBtn.focus(); } };
    document.addEventListener("keydown", onKey);

    const main = h("main", { id: "main", class: "mn-main", tabindex: "-1" });
    let n = 0;
    for (const sec of sections) {
      if (sec.type === "home") main.append(home(sec));
      else {
        n += 1;
        if (sec.type === "videos") main.append(videos(sec, n));
        else if (sec.type === "texts") main.append(texts(sec, n));
        else if (sec.type === "contact") main.append(contact(sec, n));
        else main.append(generic(sec, n));
      }
    }

    const footer = h(
      "footer",
      { class: "mn-footer" },
      h("p", null, `© ${App.content.site.name}`),
      App.legalLinks(),
      App.translationNote(),
      h("a", { href: "#accueil", class: "mn-top" }, `↑ ${App.ui("backToTop")}`)
    );

    app.append(skipLink(), header, main, footer);

    // aktiven Bereich in der Navigation markieren
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const en of entries) {
            if (!en.isIntersecting) continue;
            nav.querySelectorAll(".mn-nav__link").forEach((a) => {
              if (a.dataset.id === en.target.id) a.setAttribute("aria-current", "location");
              else a.removeAttribute("aria-current");
            });
          }
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      main.querySelectorAll(".mn-section").forEach((s) => observer.observe(s));
    }
  }

  function skipLink() {
    return h(
      "a",
      {
        href: "#main",
        class: "skip-link",
        onclick: (e) => {
          e.preventDefault();
          document.getElementById("main").focus();
        },
      },
      App.ui("skip")
    );
  }

  function onRoute(id, opts) {
    if (opts.keepScroll) return;
    const el = document.getElementById(id);
    if (!el) return;
    if (opts.initial && id === "accueil" && !location.hash) return;
    const smooth = !opts.initial && !App.reducedMotion.matches;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
    if (!opts.initial) {
      const head = el.querySelector("h1, h2");
      if (head) { head.setAttribute("tabindex", "-1"); head.focus({ preventScroll: true }); }
    }
  }

  function destroy() {
    if (observer) observer.disconnect();
    if (onKey) document.removeEventListener("keydown", onKey);
    observer = onKey = null;
  }

  App.layouts.minimal = { render, onRoute, destroy };
})();
