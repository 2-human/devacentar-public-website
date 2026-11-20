/*
 * Centar DEVA — page templates.
 * Ported 1:1 from the Base44 React build (somatic-space-flow.base44.app, 2026-10-03; re-synced 2026-11-20):
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
  var brand = function (name, size, cls, d) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="brand-' + name + (cls ? " " + cls : "") + '"><path d="' + d + '"></path></svg>';
  };
  var ICONS = {
    x: function (size, cls) { return icon("x", size, cls, '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>'); },
    mapPin: function (size, cls) { return icon("map-pin", size, cls, '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle>'); },
    mail: function (size, cls) { return icon("mail", size, cls, '<rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>'); },
    phone: function (size, cls) { return icon("phone", size, cls, '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>'); },
    // Brand marks from Simple Icons 13.21.0 (CC0), filled rather than stroked.
    whatsapp: function (size, cls) { return brand("whatsapp", size, cls, "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"); },
    viber: function (size, cls) { return brand("viber", size, cls, "M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.696 6.7.633 9.817.57 12.933.488 18.776 6.12 20.36h.003l-.004 2.416s-.037.977.61 1.177c.777.242 1.234-.5 1.98-1.302.407-.44.972-1.084 1.397-1.58 3.85.326 6.812-.416 7.15-.525.776-.252 5.176-.816 5.892-6.657.74-6.02-.36-9.83-2.34-11.546-.596-.55-3.006-2.3-8.375-2.323 0 0-.395-.025-1.037-.017zm.058 1.693c.545-.004.88.017.88.017 4.542.02 6.717 1.388 7.222 1.846 1.675 1.435 2.53 4.868 1.906 9.897v.002c-.604 4.878-4.174 5.184-4.832 5.395-.28.09-2.882.737-6.153.524 0 0-2.436 2.94-3.197 3.704-.12.12-.26.167-.352.144-.13-.033-.166-.188-.165-.414l.02-4.018c-4.762-1.32-4.485-6.292-4.43-8.895.054-2.604.543-4.738 1.996-6.173 1.96-1.773 5.474-2.018 7.11-2.03zm.38 2.602c-.167 0-.303.135-.304.302 0 .167.133.303.3.305 1.624.01 2.946.537 4.028 1.592 1.073 1.046 1.62 2.468 1.633 4.334.002.167.14.3.307.3.166-.002.3-.138.3-.304-.014-1.984-.618-3.596-1.816-4.764-1.19-1.16-2.692-1.753-4.447-1.765zm-3.96.695c-.19-.032-.4.005-.616.117l-.01.002c-.43.247-.816.562-1.146.932-.002.004-.006.004-.008.008-.267.323-.42.638-.46.948-.008.046-.01.093-.007.14 0 .136.022.27.065.4l.013.01c.135.48.473 1.276 1.205 2.604.42.768.903 1.5 1.446 2.186.27.344.56.673.87.984l.132.132c.31.308.64.6.984.87.686.543 1.418 1.027 2.186 1.447 1.328.733 2.126 1.07 2.604 1.206l.01.014c.13.042.265.064.402.063.046.002.092 0 .138-.008.31-.036.627-.19.948-.46.004 0 .003-.002.008-.005.37-.33.683-.72.93-1.148l.003-.01c.225-.432.15-.842-.18-1.12-.004 0-.698-.58-1.037-.83-.36-.255-.73-.492-1.113-.71-.51-.285-1.032-.106-1.248.174l-.447.564c-.23.283-.657.246-.657.246-3.12-.796-3.955-3.955-3.955-3.955s-.037-.426.248-.656l.563-.448c.277-.215.456-.737.17-1.248-.217-.383-.454-.756-.71-1.115-.25-.34-.826-1.033-.83-1.035-.137-.165-.31-.265-.502-.297zm4.49.88c-.158.002-.29.124-.3.282-.01.167.115.312.282.324 1.16.085 2.017.466 2.645 1.15.63.688.93 1.524.906 2.57-.002.168.13.306.3.31.166.003.305-.13.31-.297.025-1.175-.334-2.193-1.067-2.994-.74-.81-1.777-1.253-3.05-1.346h-.024zm.463 1.63c-.16.002-.29.127-.3.287-.008.167.12.31.288.32.523.028.875.175 1.113.422.24.245.388.62.416 1.164.01.167.15.295.318.287.167-.008.295-.15.287-.317-.03-.644-.215-1.178-.58-1.557-.367-.378-.893-.574-1.52-.607h-.018z"); },
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
    var tone = function (top, scrolled) { return ' data-tone-top="' + top + '" data-tone-scrolled="' + scrolled + '"'; };
    var btn = "font-body text-[11px] tracking-[0.2em] uppercase transition-colors duration-500 hover:text-[#B05A47] ";
    return '<nav data-nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out bg-transparent">' +
      '<div class="max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-10 py-5 opacity-100">' +
      '<a href="#"' + tone("text-[#F7F5F0]", "text-[#2D2824]") + ' class="font-display text-lg tracking-[0.06em] transition-colors duration-500 text-[#F7F5F0]">Centar DEVA</a>' +
      '<div class="flex items-center gap-6">' +
      '<button data-lang-toggle' + tone("text-[#F7F5F0]/80", "text-[#2D2824]/70") + ' class="' + btn + 'text-[#F7F5F0]/80">' + (lang === "en" ? "SR" : "EN") + "</button>" +
      '<button data-menu-open' + tone("text-[#F7F5F0]", "text-[#2D2824]") + ' class="' + btn + 'text-[#F7F5F0]">' + esc(t.nav.menu) + "</button>" +
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
      '<p data-intro="20,1,0" class="mb-5 font-body tracking-[0.3em] uppercase text-[11px] text-[#F7F5F0]/70">' + esc(t.hero.brand) + "</p>" +
      '<h1 data-intro="30,1.2,0" class="leading-[1.05] max-w-4xl [font-family:\'Playfair_Display\',_Georgia,_\'Times_New_Roman\',_serif] font-normal text-[#F7F5F0] text-4xl sm:text-5xl md:text-6xl lg:text-7xl"' + ls + ">" +
      esc(t.hero.title1) + "<br>" + esc(t.hero.title2) + "</h1>" +
      '<button data-intro="20,1,0.7" data-scroll-to="#spaces" class="mt-12 px-8 py-3.5 font-body text-[11px] tracking-[0.2em] uppercase rounded-full bg-white/10 text-white border border-white/35 transition-all duration-500 hover:bg-transparent hover:border-white/60">' + esc(t.hero.cta) + "</button>" +
      "</div></section>";
  }

  // Section label + heading, shared by philosophy, spaces and membership in the 2026-11 build.
  function heading(label, title1, title2) {
    return '<p class="font-body text-[#9A4A38]/80 text-[11px] tracking-[0.28em] uppercase mb-5">' + esc(label) + "</p>" +
      '<h2 class="font-display text-[#9A4A38] text-3xl md:text-[2.35rem] lg:text-[2.9rem] leading-[1.14]"' + ls + ">" + esc(title1) + (title2 ? "<br>" + esc(title2) : "") + "</h2>";
  }

  function philosophy(t) {
    var P = t.philosophy;
    return '<section class="border-t border-[#EBE8E3] bg-[#F7F5F0]">' +
      '<div data-reveal-group="philosophy" data-margin="-100px" class="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">' +
      '<div class="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">' +
      "<div" + reveal(30, 1, 0, "philosophy") + '><div class="">' + heading(P.label, P.title1, P.title2) + "</div>" +
      '<p class="mt-8 font-body text-[#2D2824]/70 text-lg leading-relaxed max-w-md">' + esc(P.intro) + "</p></div>" +
      '<div class="relative overflow-hidden rounded-[3px]"' + reveal(30, 1, 0.2, "philosophy") + ">" +
      '<img src="' + IMG.philosophy + '" alt="Warm interior of the DEVA Hub therapy space" class="w-full h-[340px] md:h-[440px] lg:h-[500px] object-cover">' +
      '<div class="absolute inset-0 ring-1 ring-inset ring-[#2D2824]/10 pointer-events-none"></div>' +
      "</div></div></div></section>";
  }

  function spaces(t) {
    var S = t.spaces;
    return '<section id="spaces" class="border-t border-[#E7DFD1] bg-[#F4EFE6]">' +
      '<div data-reveal-group="spaces" data-margin="-100px" class="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">' +
      "<div" + reveal(26, 1, 0, "spaces") + '><div class="">' + heading(S.label, S.title1, S.title2) + "</div></div>" +
      '<div class="mt-14 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-0 border-t border-[#2D2824]/10 pt-10 md:pt-12"' + reveal(20, 1, 0.2, "spaces") + ">" +
      S.points.map(function (pt, i) {
        return '<div class="' + (i === 0 ? "md:px-8 md:pl-0" : "md:px-8 md:border-l md:border-[#2D2824]/10") + '">' +
          '<h3 class="font-body text-[11px] tracking-[0.22em] uppercase text-[#9A4A38] mb-3">' + esc(pt.title) + "</h3>" +
          '<p class="font-body text-[#2D2824]/60 text-[15px] leading-[1.85] max-w-sm">' + esc(pt.text) + "</p></div>";
      }).join("") +
      "</div>" +
      '<div class="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">' +
      S.rooms.map(function (r, i) {
        return '<div class="group"' + reveal(24, 1, 0.3 + i * 0.12, "spaces") + ">" +
          '<h3 class="font-display text-[#9A4A38] text-xl md:text-[1.4rem] leading-snug mb-4"' + ls + ">" + esc(r.name) + "</h3>" +
          '<div class="relative overflow-hidden rounded-[4px] bg-[#EDE5D8] shadow-[0_22px_45px_-32px_rgba(45,40,36,0.55)]">' +
          '<img src="' + IMG.spaces[i % IMG.spaces.length] + '" alt="' + esc(r.name) + '" class="w-full h-[280px] md:h-[340px] lg:h-[400px] object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]">' +
          '<div class="absolute inset-0 ring-1 ring-inset ring-[#2D2824]/10 pointer-events-none"></div>' +
          "</div></div>";
      }).join("") +
      "</div></div></section>";
  }

  function membership(t) {
    var M = t.membership;
    return '<section id="membership" class="border-t border-[#EBE8E3] bg-[#F7F5F0]">' +
      '<div data-reveal-group="membership" data-margin="-100px" class="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">' +
      '<div class="mb-12 md:mb-14"' + reveal(30, 1, 0, "membership") + '><div class="text-center">' + heading(M.label, M.title) + "</div></div>" +
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto md:grid-rows-[auto_auto_auto_auto_auto_1fr_auto]">' +
      M.tiers.map(function (tier, a) {
        var dark = a === 1;
        return '<div class="rounded-[3px] p-7 md:p-9 flex flex-col md:grid md:grid-rows-subgrid md:row-span-7 ' + (dark ? "bg-[#2D2824] text-[#F7F5F0]" : "bg-[#EFE8DC] ring-1 ring-[#9A4A38]/10") + '"' + reveal(30, 0.9, a * 0.15, "membership") + ">" +
          '<p class="font-body text-[11px] tracking-[0.22em] uppercase mb-3 text-[#B05A47]">' + esc(tier.subtitle) + "</p>" +
          '<h3 class="font-display text-2xl md:text-3xl leading-tight"' + ls + ">" + esc(tier.philosophy) + "</h3>" +
          '<div class="mt-3 font-display text-3xl md:text-4xl leading-none ' + (dark ? "text-[#F7F5F0]" : "text-[#9A4A38]") + '"' + ls + ">" + esc(tier.price) + "</div>" +
          '<div class="font-body text-[11px] mt-1 leading-[1.5] ' + (dark ? "text-[#F7F5F0]/60" : "text-[#2D2824]/55") + '">' + esc(tier.unit) + "</div>" +
          '<div class="w-full border-t mt-1.5 ' + (dark ? "border-[#F7F5F0]/15" : "border-[#2D2824]/10") + '"></div>' +
          '<ul class="space-y-2.5 mt-5">' +
          tier.inclusions.map(function (l) {
            return '<li class="flex items-start gap-3"><span class="mt-2.5 w-3 h-px flex-shrink-0 bg-[#B05A47]"></span>' +
              '<span class="font-body text-[15px] leading-snug ' + (dark ? "text-[#F7F5F0]/80" : "text-[#2D2824]/70") + '">' + esc(l) + "</span></li>";
          }).join("") +
          "</ul>" +
          '<a href="#contact" data-scroll-to="#contact" class="mt-8 w-full py-3.5 rounded-full font-body text-[11px] tracking-[0.2em] uppercase text-center transition-colors duration-500 block ' +
          (dark ? "border border-[#F7F5F0]/30 text-[#F7F5F0] hover:border-[#F7F5F0]/60" : "border border-[#2D2824]/20 text-[#2D2824] hover:bg-[#2D2824] hover:text-[#F7F5F0] hover:border-[#2D2824]") +
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
      '<p class="font-body text-[#B05A47] text-[11px] tracking-[0.25em] uppercase mb-6">' + esc(t.footer.findUs) + "</p>" +
      '<div class="rounded-[3px] overflow-hidden h-[300px] md:h-[360px] bg-[#2D2824] relative">' +
      '<iframe title="Centar DEVA Location" src="https://maps.google.com/maps?q=Omladinskih%20Brigada%2076%2011070%20Novi%20Beograd&amp;z=15&amp;output=embed" class="w-full h-full border-0 grayscale opacity-70" loading="lazy"></iframe>' +
      "</div>" +
      '<a href="https://maps.google.com/?q=Omladinskih+Brigada+76+11070+Novi+Beograd" target="_blank" rel="noopener noreferrer" class="deva-address">' +
      ICONS.mapPin(16, "deva-contact-icon") + "<span>" + esc(t.footer.address1) + ", " + esc(t.footer.address2) + "</span></a>" +
      "</div>" +
      '<div class="flex flex-col justify-between"' + reveal(30, 1, 0.2, "footer") + "><div>" +
      '<p class="font-body text-[#B05A47] text-[11px] tracking-[0.25em] uppercase mb-6">' + esc(t.footer.contact) + "</p>" +
      '<h2 class="font-display text-3xl md:text-4xl lg:text-5xl leading-tight mb-10"' + ls + ">" + esc(t.footer.title1) + "<br>" + esc(t.footer.title2) + "</h2>" +
      '<div class="deva-contact">' +
      '<a href="mailto:devacentar@gmail.com" class="deva-contact-btn">' + ICONS.mail(20, "deva-contact-icon") + "<span>" + esc(t.footer.email) + "</span></a>" +
      '<a href="viber://chat?number=%2B381641403475" class="deva-contact-btn">' + ICONS.viber(20, "deva-contact-icon") + "<span>" + esc(t.footer.viber) + "</span></a>" +
      '<a href="https://wa.me/381641403475" target="_blank" rel="noopener noreferrer" class="deva-contact-btn">' + ICONS.whatsapp(20, "deva-contact-icon") + "<span>" + esc(t.footer.whatsapp) + "</span></a>" +
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
    return '<div class="bg-[#F7F5F0] min-h-screen">' +
      nav(t, lang) + hero(t) + philosophy(t) + spaces(t) + membership(t) + footer(t) +
      "</div>";
  }

  var api = { page: page };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.DEVA_RENDER = api;
})(this);
