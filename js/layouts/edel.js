/*
 * Stil „Edel“: Ausstellungskatalog.
 * Eine Ansicht pro Bereich (Hash-Routing, z. B. #papier), römische Kapitelzahlen,
 * Werke als Bildtafeln mit Passepartout, Lightbox als Katalogblatt.
 */
(function () {
  "use strict";
  const App = window.App;
  const h = App.h;
  let main = null;
  let onKey = null;

  const chapters = () => App.sections.filter((s) => s.id !== "accueil");
  const chapterNo = (id) => chapters().findIndex((s) => s.id === id) + 1;
  const countOf = (sec) =>
    sec.type === "videos" ? sec.videos.length : sec.type === "texts" ? sec.texts.length : sec.type === "contact" ? 0 : App.worksOf(sec).length;

  /* ---------------------------------------------------------------- Bausteine */
  function chapterHead(sec, extra) {
    const n = chapterNo(sec.id);
    const count = countOf(sec);
    return h(
      "header",
      { class: "ed-chapter" },
      h("p", { class: "ed-chapter__no", "aria-hidden": "true" }, App.roman(n)),
      h("h1", { class: "ed-chapter__title", tabindex: "-1" }, App.t(sec.nav)),
      count && sec.type !== "texts" ? h("p", { class: "ed-chapter__count" }, `${count} ${sec.type === "videos" ? App.t(sec.nav).toLowerCase() : App.ui("works")}`) : null,
      extra
    );
  }

  function pager(sec) {
    const list = chapters();
    const i = list.findIndex((s) => s.id === sec.id);
    const prev = i > 0 ? list[i - 1] : App.section("accueil");
    const next = i < list.length - 1 ? list[i + 1] : null;
    const link = (s, dir) =>
      h(
        "a",
        { href: `#${s.id}`, class: `ed-pager__link ed-pager__link--${dir}` },
        h("span", { class: "ed-pager__dir" }, dir === "prev" ? `← ${App.ui("previous")}` : `${App.ui("following")} →`),
        h("span", { class: "ed-pager__name" }, s.id === "accueil" ? App.t(s.nav) : `${App.roman(chapterNo(s.id))}. ${App.t(s.nav)}`)
      );
    return h("nav", { class: "ed-pager", "aria-label": `${App.ui("previous")} / ${App.ui("following")}` }, link(prev, "prev"), next ? link(next, "next") : h("span"));
  }

  /* ---------------------------------------------------------------- Ansichten */
  function viewHome(sec) {
    return h(
      "article",
      { class: "ed-view ed-home" },
      h(
        "section",
        { class: "ed-hero" },
        h("div", { class: "ed-hero__frame" }, App.figure(sec.image, { caption: false, eager: true, sizes: "(max-width: 900px) 90vw, 40vw" })),
        h(
          "div",
          { class: "ed-hero__text" },
          h("h1", { class: "ed-hero__name", tabindex: "-1" }, App.content.site.name),
          h("p", { class: "ed-hero__headline", lang: "fr" }, sec.headline),
          h("p", { class: "ed-hero__statement" }, App.t(sec.statement))
        )
      ),
      h(
        "nav",
        { class: "ed-toc", "aria-labelledby": "ed-toc-title" },
        h("h2", { class: "ed-label", id: "ed-toc-title" }, App.ui("contents")),
        h(
          "ol",
          { class: "ed-toc__list" },
          chapters().map((s, i) =>
            h(
              "li",
              null,
              h(
                "a",
                { href: `#${s.id}`, class: "ed-toc__link" },
                h("span", { class: "ed-toc__no" }, App.roman(i + 1)),
                h("span", { class: "ed-toc__name" }, App.t(s.nav)),
                h("span", { class: "ed-toc__dots", "aria-hidden": "true" }),
                h("span", { class: "ed-toc__count" }, countOf(s) || "")
              )
            )
          )
        )
      ),
      h("section", { class: "ed-essay" }, App.paragraphs(sec.text)),
      h(
        "section",
        { class: "ed-about" },
        h("div", { class: "ed-bio" }, h("h2", { class: "ed-label" }, App.ui("bio")), App.paragraphs(sec.bio)),
        h(
          "div",
          { class: "ed-exh" },
          h("h2", { class: "ed-label" }, App.ui("exhibitions")),
          h(
            "ol",
            { class: "ed-exh__list", reversed: true },
            sec.exhibitions.map((e, i, arr) =>
              h(
                "li",
                { class: "ed-exh__item" },
                h("span", { class: "ed-exh__year" }, i && arr[i - 1].year === e.year ? "" : e.year),
                h("span", { class: "ed-exh__text" }, h("span", { class: "ed-exh__place" }, e.place), " — ", App.t(e.detail))
              )
            )
          )
        )
      )
    );
  }

  function viewGallery(sec) {
    const list = App.worksOf(sec);
    const lead = sec.lead;
    const rest = lead ? list.slice(1) : list;
    return h(
      "article",
      { class: "ed-view" },
      chapterHead(
        sec,
        [
          sec.subtitle ? h("p", { class: "ed-chapter__sub" }, App.t(sec.subtitle)) : null,
          sec.quote
            ? h(
                "blockquote",
                { class: "ed-quote" },
                h("p", { lang: "fr" }, sec.quote.fr),
                App.state.lang !== "fr" ? h("p", { class: "ed-quote__tr" }, App.t(sec.quote)) : null
              )
            : null,
        ]
      ),
      lead ? h("div", { class: "ed-lead" }, App.figure(lead, { list, index: 0, sizes: "(max-width: 1100px) 100vw, 70vw", eager: true })) : null,
      h(
        "ol",
        { class: "ed-plates" },
        rest.map((w, i) =>
          h(
            "li",
            { class: "ed-plate" },
            App.figure(w, {
              list,
              index: lead ? i + 1 : i,
              label: `${App.ui("plate")} ${i + 1}`,
              sizes: "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw",
              cls: "ed-work",
            })
          )
        )
      ),
      pager(sec)
    );
  }

  function viewVideos(sec) {
    const stills = App.worksOf(sec);
    let k = 0;
    return h(
      "article",
      { class: "ed-view" },
      chapterHead(sec),
      h(
        "ol",
        { class: "ed-films" },
        sec.videos.map((v, i) => {
          const start = k;
          k += (v.stills || []).length;
          return h(
            "li",
            { class: "ed-film" },
            h("p", { class: "ed-film__no", "aria-hidden": "true" }, String(i + 1).padStart(2, "0")),
            App.video(v, { sizes: "(max-width: 900px) 100vw, 60vw", cls: "ed-film__video" }),
            v.stills
              ? h(
                  "div",
                  { class: "ed-film__stills", role: "group", "aria-label": `${App.ui("stills")}: ${v.title}` },
                  v.stills.map((s, j) => App.figure(stills[start + j], { list: stills, index: start + j, caption: false, sizes: "160px", cls: "ed-still" }))
                )
              : null
          );
        })
      ),
      pager(sec)
    );
  }

  function viewTexts(sec) {
    return h(
      "article",
      { class: "ed-view" },
      chapterHead(sec),
      sec.texts.map((t) =>
        h(
          "section",
          { class: "ed-page" },
          h("div", { class: "ed-page__img" }, App.figure(t.image, { sizes: "(max-width: 900px) 90vw, 30vw" })),
          h("div", { class: "ed-page__body" }, t.title ? h("h2", { class: "ed-page__title" }, App.t(t.title)) : null, App.paragraphs(t.body))
        )
      ),
      pager(sec)
    );
  }

  function viewContact(sec) {
    return h(
      "article",
      { class: "ed-view ed-contact" },
      chapterHead(sec),
      h(
        "div",
        { class: "ed-contact__card" },
        h("p", { class: "ed-label" }, App.ui("email")),
        h("p", { class: "ed-contact__line" }, App.emailLink(sec)),
        h("p", { class: "ed-label" }, App.ui("phone")),
        h("p", { class: "ed-contact__line" }, App.phoneLink(sec))
      ),
      h("div", { class: "ed-contact__img" }, App.figure(sec.image, { sizes: "(max-width: 900px) 90vw, 40vw" })),
      pager(sec)
    );
  }

  function view(id) {
    const sec = App.section(id) || App.section("accueil");
    if (sec.type === "home") return viewHome(sec);
    if (sec.type === "videos") return viewVideos(sec);
    if (sec.type === "texts") return viewTexts(sec);
    if (sec.type === "contact") return viewContact(sec);
    return viewGallery(sec);
  }

  /* ---------------------------------------------------------------- Rahmen */
  function render(app) {
    const navList = h(
      "ol",
      { class: "ed-nav__list" },
      chapters().map((s, i) =>
        h("li", null, h("a", { href: `#${s.id}`, class: "ed-nav__link", "data-id": s.id }, h("span", { class: "ed-nav__no", "aria-hidden": "true" }, App.roman(i + 1)), App.t(s.nav)))
      )
    );
    const nav = h("nav", { class: "ed-nav", id: "ed-nav", "aria-label": App.ui("nav") }, navList);
    const menuBtn = h("button", { type: "button", class: "ed-menu-btn", "aria-expanded": "false", "aria-controls": "ed-nav" }, App.ui("menu"));
    const header = h(
      "header",
      { class: "ed-header" },
      menuBtn,
      h("a", { href: "#accueil", class: "ed-brand" }, App.content.site.name),
      App.switchers("ed-tools"),
      nav
    );
    const toggle = (open) => {
      header.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
    };
    menuBtn.addEventListener("click", () => toggle(!header.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) toggle(false); });
    onKey = (e) => { if (e.key === "Escape" && header.classList.contains("is-open")) { toggle(false); menuBtn.focus(); } };
    document.addEventListener("keydown", onKey);

    main = h("main", { id: "main", class: "ed-main", tabindex: "-1" });
    const footer = h(
      "footer",
      { class: "ed-footer" },
      h("p", { class: "ed-footer__name" }, App.content.site.name),
      App.legalLinks(),
      App.translationNote()
    );
    const skip = h("a", { href: "#main", class: "skip-link", onclick: (e) => { e.preventDefault(); main.focus(); } }, App.ui("skip"));
    app.append(skip, header, main, footer);
  }

  function onRoute(id, opts) {
    if (!main) return;
    main.replaceChildren(view(id));
    document.querySelectorAll(".ed-nav__link").forEach((a) => {
      if (a.dataset.id === id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    if (!opts.keepScroll) window.scrollTo(0, 0);
    if (!opts.initial) {
      const h1 = main.querySelector("h1");
      if (h1) h1.focus({ preventScroll: true });
    }
  }

  function destroy() {
    if (onKey) document.removeEventListener("keydown", onKey);
    onKey = null;
    main = null;
  }

  App.layouts.edel = { render, onRoute, destroy };
})();
