/*
 * Centar DEVA — behaviour, vanilla port of the Base44 React build.
 * Language (localStorage "deva-lang", default en), nav background after 60px,
 * fullscreen menu, hero parallax (0.3x), in-view reveals (framer-motion
 * ease [0.2,0,0.2,1]), privacy/terms modals, smooth scrolling.
 */
(function () {
  var EASE = "cubic-bezier(0.2, 0, 0.2, 1)";
  var NAV_SCROLLED = ["bg-[#F7F5F0]/90", "backdrop-blur-md", "border-b", "border-[#EBE8E3]"];
  var root = document.getElementById("root");
  var lang = "en";
  try { lang = localStorage.getItem("deva-lang") || "en"; } catch (e) {}

  var animate = function (el, y, dur, delay) {
    el.style.transition = "opacity " + dur + "s " + EASE + " " + delay + "s, transform " + dur + "s " + EASE + " " + delay + "s";
    el.style.opacity = "1";
    el.style.transform = "none";
  };
  var hide = function (el, y) {
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = y ? "translateY(" + y + "px)" : "none";
  };
  var parse = function (v) { return v.split(","); };
  var scrollTo = function (sel) {
    var el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  var observer;
  function setupReveals(instant) {
    if (observer) observer.disconnect();
    var reveals = root.querySelectorAll("[data-reveal]");
    if (instant) { // language switch: content already seen, keep it visible
      reveals.forEach(function (el) { el.style.opacity = "1"; el.style.transform = "none"; });
      return;
    }
    reveals.forEach(function (el) { hide(el, +parse(el.dataset.reveal)[0]); });
    root.querySelectorAll("[data-intro]").forEach(function (el) {
      var p = parse(el.dataset.intro);
      hide(el, +p[0]);
      requestAnimationFrame(function () { requestAnimationFrame(function () { animate(el, +p[0], +p[1], +p[2]); }); });
    });
    var groups = root.querySelectorAll("[data-reveal-group]");
    groups.forEach(function (g) {
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
    var px = root.querySelector("[data-parallax]");
    if (px) px.style.transform = "translateY(" + window.scrollY * 0.3 + "px)";
  }

  function openMenu() {
    var m = root.querySelector("[data-menu]");
    m.hidden = false;
    hide(m, 0);
    requestAnimationFrame(function () { requestAnimationFrame(function () { animate(m, 0, 0.5, 0); }); });
    m.querySelectorAll("[data-menu-item]").forEach(function (b) {
      hide(b, 20);
      requestAnimationFrame(function () { requestAnimationFrame(function () { animate(b, 20, 0.6, +b.dataset.delay); }); });
    });
  }
  function closeMenu() {
    var m = root.querySelector("[data-menu]");
    m.style.transition = "opacity 0.5s " + EASE;
    m.style.opacity = "0";
    setTimeout(function () { m.hidden = true; }, 500);
  }

  function openModal(name) {
    var m = root.querySelector('[data-modal="' + name + '"]');
    var p = m.querySelector("[data-modal-panel]");
    m.hidden = false;
    document.body.style.overflow = "hidden";
    hide(m, 0);
    p.style.transition = "none"; p.style.opacity = "0"; p.style.transform = "translateY(30px) scale(0.98)";
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      animate(m, 0, 0.4, 0);
      animate(p, 30, 0.5, 0);
    }); });
  }
  function closeModal(m) {
    var p = m.querySelector("[data-modal-panel]");
    m.style.transition = "opacity 0.4s " + EASE; m.style.opacity = "0";
    p.style.transition = "opacity 0.5s " + EASE + ", transform 0.5s " + EASE;
    p.style.opacity = "0"; p.style.transform = "translateY(30px) scale(0.98)";
    document.body.style.overflow = "";
    setTimeout(function () { m.hidden = true; }, 500);
  }

  function render(instant) {
    document.documentElement.lang = lang;
    root.innerHTML = window.DEVA_RENDER.page(window.DEVA_I18N, lang);
    setupReveals(instant);
    onScroll();
  }

  root.addEventListener("click", function (e) {
    var t = e.target.closest("[data-lang-toggle],[data-menu-open],[data-menu-close],[data-scroll-to],[data-scroll-top],[data-modal-open],[data-modal-close],[data-modal],[data-modal-panel]");
    if (!t) return;
    if (t.hasAttribute("data-modal-panel")) return; // clicks inside a modal panel don't close it
    if (t.hasAttribute("data-lang-toggle")) {
      var menuOpen = !root.querySelector("[data-menu]").hidden;
      lang = lang === "en" ? "sr" : "en";
      try { localStorage.setItem("deva-lang", lang); } catch (err) {}
      render(true);
      if (menuOpen) { var m = root.querySelector("[data-menu]"); m.hidden = false; m.style.opacity = "1"; }
    } else if (t.hasAttribute("data-menu-open")) openMenu();
    else if (t.hasAttribute("data-menu-close")) closeMenu();
    else if (t.hasAttribute("data-scroll-to")) {
      e.preventDefault();
      if (t.hasAttribute("data-menu-item")) closeMenu();
      scrollTo(t.dataset.scrollTo);
    } else if (t.hasAttribute("data-scroll-top")) window.scrollTo({ top: 0, behavior: "smooth" });
    else if (t.hasAttribute("data-modal-open")) openModal(t.dataset.modalOpen);
    else if (t.hasAttribute("data-modal-close")) closeModal(t.closest("[data-modal]"));
    else if (t.hasAttribute("data-modal")) closeModal(t);
  });
  window.addEventListener("scroll", onScroll, { passive: true });

  // index.html ships prerendered EN markup; re-render only when the saved language differs.
  if (lang !== "en") render(false);
  else { setupReveals(false); onScroll(); }
})();
