/*
 * Centar DEVA — behaviour, vanilla port of the Base44 React build.
 * Every page is prerendered per language (rs/, en/; tools/build-website.mjs), so this file only
 * adds behaviour: nav background after 60px, fullscreen menu, hero parallax (0.3x), in-view
 * reveals (framer-motion ease [0.2,0,0.2,1]), in-page scrolling, the privacy/terms dialogs and
 * back to top. The language switch is a plain link to the other language's page.
 */
(function () {
  var EASE = "cubic-bezier(0.2, 0, 0.2, 1)";
  var NAV_SCROLLED = ["bg-[#F7F5F0]/90", "backdrop-blur-md", "border-b", "border-[#EBE8E3]"];
  var root = document.getElementById("root");

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
    nav.querySelectorAll("[data-tone-top]").forEach(function (el) { // light text over the hero, dark on the scrolled bar
      var from = (scrolled ? el.dataset.toneTop : el.dataset.toneScrolled), to = (scrolled ? el.dataset.toneScrolled : el.dataset.toneTop);
      if (from !== to) { el.classList.remove(from); el.classList.add(to); }
    });
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

  // Privacy and terms dialogs (while their pages are not published).
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

  root.addEventListener("click", function (e) {
    var t = e.target.closest("[data-menu-open],[data-menu-close],[data-scroll-to],[data-scroll-top],[data-modal-open],[data-modal-close],[data-modal],[data-modal-panel]");
    if (!t) return;
    if (t.hasAttribute("data-modal-panel")) return; // clicks inside a dialog panel don't close it
    if (t.hasAttribute("data-menu-open")) openMenu();
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
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = root.querySelector("[data-modal]:not([hidden])");
    if (open) closeModal(open);
    else if (!root.querySelector("[data-menu]").hidden) closeMenu();
  });
  window.addEventListener("scroll", onScroll, { passive: true });

  setupReveals(false);
  onScroll();
})();
