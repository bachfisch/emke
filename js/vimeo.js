/*
 * Vimeo-Einbettung mit Klick-zum-Laden.
 * Vor dem Klick: nur lokales Vorschaubild, kein iframe, keine Anfrage an Vimeo.
 * Nach dem Klick: player.vimeo.com mit dnt=1 (do not track).
 */
(function () {
  "use strict";
  const App = window.App;
  const h = App.h;

  function playerUrl(v) {
    const params = new URLSearchParams({ dnt: "1", autoplay: "1", title: "0", byline: "0", portrait: "0" });
    return `https://player.vimeo.com/video/${encodeURIComponent(v.vimeo)}?${params}${v.start ? `#t=${v.start}s` : ""}`;
  }

  function load(wrap, v) {
    const iframe = h("iframe", {
      src: playerUrl(v),
      title: v.title,
      allow: "autoplay; fullscreen; picture-in-picture",
      referrerpolicy: "strict-origin-when-cross-origin",
      class: "video__frame",
    });
    wrap.querySelector(".video__stage").replaceChildren(iframe);
    wrap.classList.add("is-loaded");
    const note = wrap.querySelector(".video__note");
    if (note) note.remove();
    iframe.focus();
  }

  /**
   * Video-Element. opts: { cls, sizes, showTitle (default true), eager }
   * Videos ohne Vimeo-ID (vimeo: null) werden als Standbild gezeigt.
   */
  App.video = function (v, opts = {}) {
    const poster = App.img(v.poster, { alt: "", sizes: opts.sizes || "(max-width: 700px) 100vw, 50vw", eager: opts.eager });
    const note = App.t(v.note);
    const titleEl =
      opts.showTitle === false
        ? null
        : h("figcaption", { class: "video__caption" }, h("span", { class: "video__title" }, v.title), note ? h("span", { class: "video__meta" }, note) : null);

    if (!v.vimeo) {
      poster.alt = v.title;
      return h("figure", { class: `video video--still ${opts.cls || ""}`.trim() }, h("div", { class: "video__stage" }, poster), titleEl);
    }

    const wrap = h("figure", { class: `video ${opts.cls || ""}`.trim() });
    const btn = h(
      "button",
      {
        type: "button",
        class: "video__load",
        "aria-label": `${App.ui("loadVideo")}: ${v.title}`,
        onclick: () => load(wrap, v),
      },
      poster,
      h("span", { class: "video__play", "aria-hidden": "true" }, h("span", { class: "video__icon" }, "▶"), h("span", { class: "video__label" }, App.ui("playVideo")))
    );
    wrap.append(
      h("div", { class: "video__stage" }, btn),
      titleEl,
      h("p", { class: "video__note" }, App.ui("vimeoNote"))
    );
    return wrap;
  };
})();
