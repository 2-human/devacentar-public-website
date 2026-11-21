/*
 * Centar DEVA — behaviour, vanilla port of the Base44 React build.
 * Every page is prerendered per language (rs/, en/; tools/build-website.mjs), so this file only
 * adds behaviour: nav background after 60px, fullscreen menu, hero parallax (0.3x), in-view
 * reveals (framer-motion ease [0.2,0,0.2,1]), in-page scrolling, the privacy/terms dialogs,
 * the click-to-load map and back to top. The language switch is a plain link to the other
 * language's page. With "reduce motion" set in the system, nothing animates and scrolling jumps.
 */
(function () {
  // shown inside another page (the hub's Live site and previews): load the hub's pick agent next to this file; it stays
  // silent unless the hub greets it from its own address (assets/pick-agent.js). Visitors never load it.
  if (window.parent !== window && document.currentScript) {
    var agent = document.createElement("script"); agent.src = document.currentScript.src.replace(/site\.js(\?.*)?$/, "pick-agent.js"); document.head.appendChild(agent);
  }
  var EASE = "cubic-bezier(0.2, 0, 0.2, 1)";
  var NAV_SCROLLED = ["bg-[#F7F5F0]/90", "backdrop-blur-md", "border-b", "border-[#EBE8E3]"];
  var REDUCE = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.getElementById("root");

  var animate = function (el, y, dur, delay) {
    el.style.transition = REDUCE ? "none" : "opacity " + dur + "s " + EASE + " " + delay + "s, transform " + dur + "s " + EASE + " " + delay + "s";
    el.style.opacity = "1";
    el.style.transform = "none";
  };
  var hide = function (el, y) {
    if (REDUCE) return;
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = y ? "translateY(" + y + "px)" : "none";
  };
  var parse = function (v) { return v.split(","); };
  var behavior = REDUCE ? "auto" : "smooth";
  // Scroll to a section and move keyboard focus there too, so the next Tab continues from it.
  var scrollTo = function (sel) {
    var el = document.querySelector(sel);
    if (!el) return;
    el.scrollIntoView({ behavior: behavior });
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };

  function setupReveals() {
    if (REDUCE) return; // everything is visible as rendered
    root.querySelectorAll("[data-reveal]").forEach(function (el) { hide(el, +parse(el.dataset.reveal)[0]); });
    root.querySelectorAll("[data-intro]").forEach(function (el) {
      var p = parse(el.dataset.intro);
      hide(el, +p[0]);
      requestAnimationFrame(function () { requestAnimationFrame(function () { animate(el, +p[0], +p[1], +p[2]); }); });
    });
    root.querySelectorAll("[data-reveal-group]").forEach(function (g) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          root.querySelectorAll('[data-reveal$=",' + g.dataset.revealGroup + '"]').forEach(function (el) {
            var p = parse(el.dataset.reveal);
            animate(el, +p[0], +p[1], +p[2]);
          });
          io.disconnect();
        });
      }, { rootMargin: g.dataset.margin || "0px" });
      io.observe(g);
    });
  }

  function onScroll() {
    var nav = root.querySelector("[data-nav]");
    var scrolled = window.scrollY > 60;
    NAV_SCROLLED.forEach(function (c) { nav.classList.toggle(c, scrolled); });
    nav.classList.toggle("bg-transparent", !scrolled);
    nav.querySelectorAll("[data-tone-top]").forEach(function (el) { // light text over the hero, dark on the scrolled bar
      var from = (scrolled ? el.dataset.toneTop : el.dataset.toneScrolled), to = (scrolled ? el.dataset.toneScrolled : el.dataset.toneTop);
      if (from !== to) { el.classList.remove(from); el.classList.add(to); }
    });
    var px = root.querySelector("[data-parallax]");
    if (px && !REDUCE) px.style.transform = "translateY(" + window.scrollY * 0.3 + "px)";
  }

  // The menu is a dialog: the Menu button says whether it is open, focus goes in and stays in, and comes back on close.
  var menuOpener = null;
  function openMenu() {
    var m = root.querySelector("[data-menu]");
    menuOpener = root.querySelector("[data-menu-open]");
    menuOpener.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    m.hidden = false;
    var first = m.querySelector("[data-menu-item]");
    setTimeout(function () { if (first) first.focus(); }, REDUCE ? 0 : 60);
    hide(m, 0);
    requestAnimationFrame(function () { requestAnimationFrame(function () { animate(m, 0, 0.5, 0); }); });
    m.querySelectorAll("[data-menu-item]").forEach(function (b) {
      hide(b, 20);
      requestAnimationFrame(function () { requestAnimationFrame(function () { animate(b, 20, 0.6, +b.dataset.delay); }); });
    });
  }
  function closeMenu(keepFocus) {
    var m = root.querySelector("[data-menu]");
    var b = root.querySelector("[data-menu-open]");
    b.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (!keepFocus && b) b.focus();
    m.style.transition = REDUCE ? "none" : "opacity 0.5s " + EASE;
    m.style.opacity = "0";
    setTimeout(function () { m.hidden = true; }, REDUCE ? 0 : 500);
  }

  // Privacy and terms dialogs (while their pages are not published): focus moves into the dialog, Tab stays in it,
  // and focus returns to the button that opened it.
  var opener = null;
  var focusables = function (m) {
    return [].filter.call(m.querySelectorAll('a[href],button,[tabindex]:not([tabindex="-1"])'), function (el) { return !el.disabled && el.offsetParent !== null; });
  };
  function openModal(name, from) {
    var m = root.querySelector('[data-modal="' + name + '"]');
    var p = m.querySelector("[data-modal-panel]");
    opener = from || document.activeElement;
    m.hidden = false;
    document.body.style.overflow = "hidden";
    hide(m, 0);
    if (!REDUCE) { p.style.transition = "none"; p.style.opacity = "0"; p.style.transform = "translateY(30px) scale(0.98)"; }
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      animate(m, 0, 0.4, 0);
      animate(p, 30, 0.5, 0);
      var close = m.querySelector("[data-modal-close]"); if (close) close.focus();
    }); });
  }
  function closeModal(m) {
    var p = m.querySelector("[data-modal-panel]");
    m.style.transition = REDUCE ? "none" : "opacity 0.4s " + EASE; m.style.opacity = "0";
    p.style.transition = REDUCE ? "none" : "opacity 0.5s " + EASE + ", transform 0.5s " + EASE;
    p.style.opacity = "0"; if (!REDUCE) p.style.transform = "translateY(30px) scale(0.98)";
    document.body.style.overflow = "";
    setTimeout(function () { m.hidden = true; }, REDUCE ? 0 : 500);
    if (opener && opener.focus) opener.focus();
    opener = null;
  }

  // With MAP_ON_CLICK (render.js) the map loads only when asked for, so Google sets no cookies before that.
  function loadMap(btn) {
    var f = document.createElement("iframe");
    f.title = btn.dataset.mapTitle || "Centar DEVA";
    f.src = btn.dataset.map;
    f.className = "w-full h-full border-0 grayscale opacity-70";
    btn.replaceWith(f);
  }

  // Room cards on phones: two slides (photo, text). A swipe left or right switches to the other slide; the new one
  // comes in from the side the finger moves away from, so both directions feel natural. Dots do the same on tap.
  var PHONE = window.matchMedia ? window.matchMedia("(max-width: 639px)") : { matches: false };
  function showSlide(card, to, dir) { // dir -1: content moves left (swipe left), +1: content moves right
    var from = +card.dataset.slide;
    if (to === from) return;
    var out = card.querySelector('[data-panel="' + from + '"]'), inn = card.querySelector('[data-panel="' + to + '"]');
    var t = REDUCE ? "none" : "transform .45s " + EASE;
    inn.style.transition = "none"; inn.style.transform = "translateX(" + (-dir * 100) + "%)";
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      out.style.transition = t; inn.style.transition = t;
      out.style.transform = "translateX(" + (dir * 100) + "%)"; inn.style.transform = "translateX(0)";
    }); });
    card.dataset.slide = to;
    out.setAttribute("aria-hidden", "true"); inn.removeAttribute("aria-hidden");
    card.querySelectorAll("[data-goto]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.goto === to)); });
  }
  root.querySelectorAll("[data-room]").forEach(function (card) {
    var x0 = null, y0 = 0;
    card.addEventListener("touchstart", function (e) { if (!PHONE.matches) return; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    card.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return; // a tap or a vertical scroll
      showSlide(card, 1 - card.dataset.slide, dx < 0 ? -1 : 1);
    }, { passive: true });
  });
  // Back on a wider screen, the photo is shown again.
  if (PHONE.addEventListener) PHONE.addEventListener("change", function () {
    root.querySelectorAll("[data-room]").forEach(function (card) {
      card.dataset.slide = "0";
      card.querySelectorAll("[data-panel]").forEach(function (p) { p.style.transition = "none"; p.style.transform = ""; });
      card.querySelector('[data-panel="1"]').setAttribute("aria-hidden", "true"); card.querySelector('[data-panel="0"]').removeAttribute("aria-hidden");
      card.querySelectorAll("[data-goto]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.goto === "0")); });
    });
  });

  // Share: the device's share sheet where there is one (phones), otherwise the link is copied and a short notice says so
  // (the notice is a polite live region, so screen readers announce it too).
  var toastTimer;
  function notice(text) {
    var t = root.querySelector("[data-toast]"); if (!t) return;
    t.textContent = text; t.classList.add("is-on");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove("is-on"); t.textContent = ""; }, 2600);
  }
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (ok, fail) { // older browsers
      var f = document.createElement("textarea"); f.value = text; f.setAttribute("readonly", ""); f.style.position = "fixed"; f.style.opacity = "0";
      document.body.appendChild(f); f.select();
      try { document.execCommand("copy") ? ok() : fail(); } catch (e) { fail(e); } finally { f.remove(); }
    });
  }
  function share(btn) {
    var canon = document.querySelector('link[rel="canonical"]');
    var data = { title: document.title, url: canon ? canon.href : location.href.split("#")[0] };
    var copied = function () { copy(data.url).then(function () { notice(btn.dataset.copied); }, function () { window.prompt("", data.url); }); };
    if (navigator.share) navigator.share(data).catch(function (err) { if (!err || err.name !== "AbortError") copied(); });
    else copied();
  }

  root.addEventListener("click", function (e) {
    var sh = e.target.closest("[data-share]");
    if (sh) { share(sh); return; }
    var g = e.target.closest("[data-goto]");
    if (g) { var card = g.closest("[data-room]"); showSlide(card, +g.dataset.goto, +g.dataset.goto > +card.dataset.slide ? -1 : 1); return; }
    var t = e.target.closest("[data-menu-open],[data-menu-close],[data-scroll-to],[data-scroll-top],[data-modal-open],[data-modal-close],[data-modal],[data-modal-panel],[data-map]");
    if (!t) return;
    if (t.hasAttribute("data-modal-panel")) return; // clicks inside a dialog panel don't close it
    if (t.hasAttribute("data-menu-open")) openMenu();
    else if (t.hasAttribute("data-menu-close")) closeMenu();
    else if (t.hasAttribute("data-scroll-to")) {
      e.preventDefault();
      if (t.hasAttribute("data-menu-item")) closeMenu(true); // focus goes to the section instead
      scrollTo(t.dataset.scrollTo);
    } else if (t.hasAttribute("data-scroll-top")) window.scrollTo({ top: 0, behavior: behavior });
    else if (t.hasAttribute("data-modal-open")) openModal(t.dataset.modalOpen, t);
    else if (t.hasAttribute("data-modal-close")) closeModal(t.closest("[data-modal]"));
    else if (t.hasAttribute("data-modal")) closeModal(t);
    else if (t.hasAttribute("data-map")) loadMap(t);
  });
  document.addEventListener("keydown", function (e) {
    var open = root.querySelector("[data-modal]:not([hidden])") || root.querySelector("[data-menu]:not([hidden])");
    if (e.key === "Escape") {
      if (open && open.hasAttribute("data-menu")) { closeMenu(); return; }
      if (open) closeModal(open);
      else if (!root.querySelector("[data-menu]").hidden) closeMenu();
    } else if (e.key === "Tab" && open) { // keep focus inside the open dialog
      var f = focusables(open); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!open.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener("scroll", onScroll, { passive: true });

  setupReveals();
  onScroll();
})();
