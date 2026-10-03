/*
 * Centar DEVA — page templates.
 * Ported 1:1 from the Base44 React build (somatic-space-flow.base44.app, 2026-10-03):
 * same markup, same Tailwind class strings (styled by the original compiled app.css).
 * Used twice: by tools/build-website.mjs to prerender index.html (EN), and in the
 * browser by site.js to re-render on language switch.
 * Elements with data-reveal animate in (see site.js) — the framer-motion equivalents.
 */
(function (root) {
  var esc = function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  // lucide-react v0.475.0 icons, as rendered by the original.
  var icon = function (name, size, cls, body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-' +
      name + (cls ? " " + cls : "") + '">' + body + "</svg>";
  };
  var ICONS = {
    x: function (size, cls) { return icon("x", size, cls, '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>'); },
    mapPin: function (size, cls) { return icon("map-pin", size, cls, '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle>'); },
    mail: function (size, cls) { return icon("mail", size, cls, '<rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>'); },
    phone: function (size, cls) { return icon("phone", size, cls, '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>'); },
    instagram: function (size, cls) { return icon("instagram", size, cls, '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>'); }
  };

  var IMG = {
    hero: "assets/img/hero.jpg",
    philosophy: "assets/img/philosophy.jpg",
    spaces: ["assets/img/space-1.jpg", "assets/img/space-2.jpg", "assets/img/space-3.jpg"]
  };

  // data-reveal="y,duration,delay[,group]" — group ties several elements to one in-view trigger.
  var reveal = function (y, dur, delay, group) {
    return ' data-reveal="' + y + "," + dur + "," + (delay || 0) + (group ? "," + group : "") + '"';
  };
  var ls = ' style="letter-spacing: -0.02em;"';

  function nav(t, lang) {
    return '<nav data-nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out bg-transparent">' +
      '<div class="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-10 py-5 opacity-100">' +
      '<a href="#" class="font-display text-lg tracking-wide text-[#B05A47]">Centar DEVA</a>' +
      '<div class="flex items-center gap-6">' +
      '<button data-lang-toggle class="font-body text-sm tracking-widest uppercase hover:text-[#9A4A38] transition-colors duration-500 text-[hsl(var(--chart-5))]">' + (lang === "en" ? "SR" : "EN") + "</button>" +
      '<button data-menu-open class="font-body text-sm tracking-widest uppercase hover:text-[#9A4A38] transition-colors duration-500 text-[hsl(var(--chart-1))]">' + esc(t.nav.menu) + "</button>" +
      "</div></div></nav>" +
      '<div data-menu hidden class="fixed inset-0 z-[100] bg-[#F7F5F0]/95 backdrop-blur-xl flex flex-col items-center justify-center">' +
      '<div class="absolute top-6 right-6 md:right-10 flex items-center gap-6">' +
      '<button data-lang-toggle class="font-body text-sm tracking-widest uppercase text-[#2D2824] hover:text-[#9A4A38] transition-colors">' + (lang === "en" ? "SR" : "EN") + "</button>" +
      '<button data-menu-close aria-label="Close" class="text-[#2D2824] hover:text-[#9A4A38] transition-colors">' + ICONS.x(24) + "</button>" +
      "</div>" +
      '<div class="flex flex-col items-center gap-10">' +
      [["spaces", "#spaces"], ["membership", "#membership"], ["contact", "#contact"]].map(function (l, i) {
        return '<button data-menu-item data-delay="' + i * 0.08 + '" data-scroll-to="' + l[1] + '" class="font-display text-4xl md:text-5xl text-[#2D2824] hover:text-[#9A4A38] transition-colors duration-500 tracking-tight">' + esc(t.nav[l[0]]) + "</button>";
      }).join("") +
      "</div></div>";
  }

  function hero(t) {
    return '<section class="relative h-screen w-full overflow-hidden">' +
      '<div data-parallax class="absolute inset-0 will-change-transform" style="transform: translateY(0px);">' +
      '<img src="' + IMG.hero + '" alt="Sunlit street scene near the therapy space" class="w-full h-[120%] object-cover">' +
      '<div class="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65"></div>' +
      "</div>" +
      '<div class="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center opacity-100">' +
      '<p data-intro="20,1,0" class="mb-5 font-body tracking-[0.3em] uppercase text-sm text-[hsl(var(--chart-4))]">' + esc(t.hero.brand) + "</p>" +
      '<h1 data-intro="30,1.2,0" class="tracking-tight leading-tight max-w-4xl [font-family:\'Playfair_Display\',_Georgia,_\'Times_New_Roman\',_serif] font-normal text-[hsl(var(--secondary))] text-7xl sm:text-7xl md:text-7xl lg:text-7xl"' + ls + ">" +
      esc(t.hero.title1) + "<br>" + esc(t.hero.title2) + "</h1>" +
      '<button data-intro="20,1,0.7" data-scroll-to="#spaces" class="mt-10 px-8 py-3.5 font-body text-sm tracking-widest uppercase rounded-full bg-white/15 text-white border border-white/30 transition-all duration-500 hover:bg-transparent hover:border-white/50">' + esc(t.hero.cta) + "</button>" +
      "</div></section>";
  }

  function philosophy(t) {
    return '<section class="bg-[#F7F5F0] py-24 md:py-36">' +
      '<div class="w-full border-t border-[#EBE8E3]"></div>' +
      '<div data-reveal-group="philosophy" data-margin="-100px" class="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 md:pt-28">' +
      '<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">' +
      "<div" + reveal(40, 1, 0, "philosophy") + ">" +
      '<p class="font-body text-[#B05A47] text-xs tracking-widest uppercase mb-6">' + esc(t.philosophy.label) + "</p>" +
      '<h2 class="font-display text-[#2D2824] text-3xl md:text-4xl lg:text-5xl leading-tight mb-8"' + ls + ">" + esc(t.philosophy.title1) + "<br>" + esc(t.philosophy.title2) + "</h2>" +
      '<div class="space-y-5 font-body text-[#2D2824]/75 text-lg leading-relaxed"><p>' + esc(t.philosophy.p1) + "</p><p>" + esc(t.philosophy.p2) + "</p></div>" +
      "</div>" +
      '<div class="overflow-hidden rounded-[4px]"' + reveal(40, 1, 0.2, "philosophy") + ">" +
      '<img src="' + IMG.philosophy + '" alt="Close-up of natural materials — warm oak surface with soft diffused light" class="w-full h-[400px] md:h-[500px] object-cover hover:scale-105 hover:saturate-[1.1] transition-all duration-1000 ease-out">' +
      "</div></div></div></section>";
  }

  function spaces(t) {
    return '<section id="spaces" class="bg-[#EBE8E3]/40 py-24 md:py-36">' +
      '<div data-reveal-group="spaces" data-margin="-100px" class="max-w-[1400px] mx-auto px-6 md:px-10">' +
      '<div class="flex items-end justify-between mb-14"' + reveal(30, 1, 0, "spaces") + ">" +
      '<div><p class="font-body text-[#B05A47] text-xs tracking-widest uppercase mb-4">' + esc(t.spaces.label) + "</p>" +
      '<h2 class="font-display text-[#2D2824] text-3xl md:text-4xl lg:text-5xl leading-tight"' + ls + ">" + esc(t.spaces.title1) + '<br class="hidden md:block"> ' + esc(t.spaces.title2) + "</h2></div>" +
      '<div class="hidden md:flex gap-2"></div>' +
      "</div></div>" +
      '<div class="flex gap-6 overflow-x-auto scrollbar-hide px-6 md:px-10 pb-4 snap-x snap-mandatory" style="scrollbar-width: none;"' + reveal(0, 1, 0.3, "spaces") + ">" +
      t.spaces.rooms.map(function (r, i) {
        return '<div class="flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[42vw] lg:w-[30vw] snap-start group">' +
          '<div class="overflow-hidden rounded-[4px] mb-5"><img src="' + IMG.spaces[i % IMG.spaces.length] + '" alt="' + esc(r.name + " — " + r.feature) + '" class="w-full h-[300px] md:h-[360px] object-cover group-hover:scale-105 group-hover:saturate-[1.1] transition-all duration-1000 ease-out"></div>' +
          '<p class="font-body text-[#B05A47] text-xs tracking-widest uppercase mb-2">' + esc(r.feature) + "</p>" +
          '<h3 class="font-display text-[#2D2824] text-xl md:text-2xl mb-2"' + ls + ">" + esc(r.name) + "</h3>" +
          '<p class="font-body text-[#2D2824]/65 text-base leading-relaxed">' + esc(r.description) + "</p>" +
          "</div>";
      }).join("") +
      "</div></section>";
  }

  function membership(t) {
    return '<section id="membership" class="bg-[#F7F5F0] py-24 md:py-36">' +
      '<div class="w-full border-t border-[#EBE8E3]"></div>' +
      '<div data-reveal-group="membership" data-margin="-100px" class="max-w-[1400px] mx-auto px-6 md:px-10 pt-20 md:pt-28">' +
      '<div class="text-center mb-16 md:mb-20"' + reveal(30, 1, 0, "membership") + ">" +
      '<p class="font-body text-[#B05A47] text-xs tracking-widest uppercase mb-4">' + esc(t.membership.label) + "</p>" +
      '<h2 class="font-display text-[#2D2824] text-3xl md:text-4xl lg:text-5xl leading-tight"' + ls + ">" + esc(t.membership.title) + "</h2>" +
      "</div>" +
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">' +
      t.membership.tiers.map(function (tier, a) {
        var dark = a === 1;
        return '<div class="rounded-[4px] p-8 md:p-10 flex flex-col ' + (dark ? "bg-[#2D2824] text-[#F7F5F0]" : "bg-[#EBE8E3]/50 text-[#2D2824]") + '"' + reveal(40, 0.9, a * 0.15, "membership") + ">" +
          '<p class="font-body text-xs tracking-widest uppercase mb-3 text-[#B05A47]">' + esc(tier.subtitle) + "</p>" +
          '<h3 class="font-display text-2xl md:text-3xl mb-1"' + ls + ">" + esc(tier.philosophy) + "</h3>" +
          '<div class="mt-4 mb-8 min-h-[80px] flex flex-col justify-start">' +
          '<div class="font-display text-3xl md:text-4xl"' + ls + ">" + esc(tier.price) + "</div>" +
          '<div class="font-body text-sm mt-1 leading-relaxed ' + (dark ? "text-[#F7F5F0]/60" : "text-[#2D2824]/50") + '">' + esc(tier.unit) + "</div>" +
          "</div>" +
          '<div class="w-full border-t mb-8 ' + (dark ? "border-[#F7F5F0]/15" : "border-[#2D2824]/10") + '"></div>' +
          '<ul class="space-y-3 flex-1">' +
          tier.inclusions.map(function (l) {
            return '<li class="flex items-start gap-3"><span class="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#B05A47]"></span>' +
              '<span class="font-body text-base leading-relaxed ' + (dark ? "text-[#F7F5F0]/80" : "text-[#2D2824]/70") + '">' + esc(l) + "</span></li>";
          }).join("") +
          "</ul>" +
          '<a href="#contact" data-scroll-to="#contact" class="mt-10 w-full py-3.5 rounded-full font-body text-sm tracking-widest uppercase text-center transition-colors duration-500 block ' +
          (dark ? "border border-[#F7F5F0]/30 text-[#F7F5F0] hover:border-[#F7F5F0]/60 hover:bg-[#F7F5F0]/10" : "border border-[#2D2824]/20 text-[#2D2824] hover:bg-[#2D2824] hover:text-[#F7F5F0]") +
          '">' + esc(tier.cta) + "</a>" +
          "</div>";
      }).join("") +
      "</div></div></section>";
  }

  function modal(name, c) {
    return '<div data-modal="' + name + '" hidden class="fixed inset-0 z-[200] bg-[#262A22]/80 backdrop-blur-sm flex items-start md:items-center justify-center p-4 md:p-8 overflow-y-auto">' +
      '<div data-modal-panel class="bg-[#F5F4EE] text-[#262A22] rounded-[6px] w-full max-w-2xl my-8 relative">' +
      '<div class="sticky top-0 bg-[#F5F4EE] flex items-center justify-between px-8 md:px-10 pt-8 pb-4 border-b border-[#DDE0D5] rounded-t-[6px]">' +
      '<div><p class="font-body text-[#5A7048] text-xs tracking-widest uppercase mb-1">' + esc(c.updated) + "</p>" +
      '<h2 class="font-display text-2xl md:text-3xl"' + ls + ">" + esc(c.title) + "</h2></div>" +
      '<button data-modal-close aria-label="Close" class="text-[#262A22] hover:text-[#5A7048] transition-colors duration-500 flex-shrink-0 ml-4">' + ICONS.x(22) + "</button>" +
      "</div>" +
      '<div class="px-8 md:px-10 py-8 max-h-[60vh] overflow-y-auto">' +
      '<p class="font-body text-sm md:text-base text-[#262A22]/70 mb-8 leading-relaxed">' + esc(c.intro) + "</p>" +
      '<div class="space-y-6">' +
      c.sections.map(function (s) {
        return '<div><h3 class="font-display text-lg mb-2 text-[#262A22]">' + esc(s.heading) + "</h3>" +
          '<p class="font-body text-sm md:text-base text-[#262A22]/70 leading-relaxed whitespace-pre-line">' + esc(s.body) + "</p></div>";
      }).join("") +
      "</div></div></div></div>";
  }

  function footer(t) {
    var link = "font-body text-base text-[#F7F5F0]/75 group-hover:text-[#F7F5F0] transition-colors duration-500";
    var small = "font-body text-sm text-[#F7F5F0]/40 hover:text-[#F7F5F0]/70 transition-colors duration-500";
    return '<footer id="contact" class="bg-[#2D2824] text-[#F7F5F0]">' +
      '<div data-reveal-group="footer" data-margin="-80px" class="max-w-[1400px] mx-auto px-6 md:px-10 py-20 md:py-28">' +
      '<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">' +
      "<div" + reveal(30, 1, 0, "footer") + ">" +
      '<p class="font-body text-[#B05A47] text-xs tracking-widest uppercase mb-6">' + esc(t.footer.findUs) + "</p>" +
      '<div class="rounded-[4px] overflow-hidden h-[300px] md:h-[360px] bg-[#2D2824] relative">' +
      '<iframe title="Centar DEVA Location" src="https://maps.google.com/maps?q=Omladinskih%20Brigada%2076%2011070%20Novi%20Beograd&amp;z=15&amp;output=embed" class="w-full h-full border-0 grayscale opacity-70" loading="lazy"></iframe>' +
      "</div></div>" +
      '<div class="flex flex-col justify-between"' + reveal(30, 1, 0.2, "footer") + "><div>" +
      '<p class="font-body text-[#B05A47] text-xs tracking-widest uppercase mb-6">' + esc(t.footer.contact) + "</p>" +
      '<h2 class="font-display text-3xl md:text-4xl lg:text-5xl leading-tight mb-10"' + ls + ">" + esc(t.footer.title1) + "<br>" + esc(t.footer.title2) + "</h2>" +
      '<div class="space-y-5">' +
      '<a href="https://maps.google.com/?q=Omladinskih+Brigada+76+11070+Novi+Beograd" target="_blank" rel="noopener noreferrer" class="flex items-start gap-4 group">' +
      ICONS.mapPin(18, "mt-0.5 text-[#B05A47] flex-shrink-0") + '<span class="' + link + '">' + esc(t.footer.address1) + "<br>" + esc(t.footer.address2) + "</span></a>" +
      '<a href="mailto:hello@centardeva.com" class="flex items-center gap-4 group">' + ICONS.mail(18, "text-[#B05A47] flex-shrink-0") + '<span class="' + link + '">hello@centardeva.com</span></a>' +
      '<a href="tel:+381641403475" class="flex items-center gap-4 group">' + ICONS.phone(18, "text-[#B05A47] flex-shrink-0") + '<span class="' + link + '">+381 64 140 3475</span></a>' +
      '<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 group">' + ICONS.instagram(18, "text-[#B05A47] flex-shrink-0") + '<span class="' + link + '">@centardeva</span></a>' +
      "</div></div></div></div>" +
      '<div class="mt-20 pt-8 border-t border-[#F7F5F0]/10 flex flex-col sm:flex-row items-center justify-between gap-4">' +
      '<p class="font-body text-sm text-[#F7F5F0]/40">' + esc(t.footer.copyright) + "</p>" +
      '<div class="flex items-center gap-6">' +
      '<button data-modal-open="privacy" class="' + small + '">' + esc(t.footer.privacy) + "</button>" +
      '<button data-modal-open="terms" class="' + small + '">' + esc(t.footer.terms) + "</button>" +
      '<button data-scroll-top class="' + small + '">' + esc(t.footer.backToTop) + "</button>" +
      "</div></div></div>" +
      modal("terms", t.termsContent) +
      modal("privacy", t.privacyContent) +
      "</footer>";
  }

  function page(dict, lang) {
    var t = dict[lang];
    return '<div class="bg-[#F5F4EE] min-h-screen">' +
      nav(t, lang) + hero(t) + philosophy(t) + spaces(t) + membership(t) + footer(t) +
      "</div>";
  }

  var api = { page: page };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.DEVA_RENDER = api;
})(this);
