/*
 * Centar DEVA — the whole HTML document of a page: head (title, description, social cards, structured data, styles)
 * around render.js's page body. Shared by tools/build-website.mjs (the published site) and the hub's preview of a
 * proposed change, so a preview is the page the build would write, not a mock-up.
 *   html(dict, lang, page) -> "<!DOCTYPE html>…"     dict = window.DEVA_I18N (i18n.js), lang = "sr" | "en"
 * (Body not indented inside the wrapper: the template literals are the page's bytes.)
 */
(function (root) {
var R = typeof module !== "undefined" && module.exports ? require("./render.js") : root.DEVA_RENDER;
var page = R.page, path = R.path;
const SITE = "https://centardeva.com/";

// Colour fixes for WCAG AA, as selector -> colour (filled in from the axe report; see the review of 20 Nov 2026).
const CONTRAST = String.raw`.text-\[\#9A4A38\]\/80{color:rgba(154,74,56,.92)}` +            // section labels: 3.7 -> 4.6
  String.raw`.text-\[\#2D2824\]\/60{color:rgba(45,40,36,.68)}` +                               // spaces points: 3.8 -> 4.7
  String.raw`.text-\[\#2D2824\]\/55{color:rgba(45,40,36,.68)}` +                               // "per session" notes: 3.3 -> 4.7
  String.raw`.bg-\[\#EFE8DC\] .text-\[\#B05A47\]{color:#9E5140}` +                             // light tier label: 3.9 -> 4.7
  String.raw`.bg-\[\#2D2824\] .text-\[\#B05A47\],footer .text-\[\#B05A47\]{color:#C38273}` +   // labels on dark: 3.1 -> 4.7
  String.raw`.text-\[\#F7F5F0\]\/40{color:rgba(247,245,240,.55)}`;                            // footer fine print: 3.4 -> 4.6
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const STYLE = "[hidden]{display:none!important}" +
  ".deva-page-top{padding-top:64px}" +
  ".deva-contact{display:flex;flex-direction:column;gap:12px;max-width:420px}" +
  ".deva-contact-btn{display:flex;align-items:center;gap:16px;padding:18px 24px;border:1px solid rgba(247,245,240,.18);border-radius:3px;font-family:inherit;font-size:16px;letter-spacing:.02em;color:#F7F5F0;text-decoration:none;transition:background-color .5s,border-color .5s,color .5s}" +
  ".deva-contact-btn .deva-contact-icon{color:#B05A47;flex-shrink:0;transition:color .5s}" +
  ".deva-contact-btn:hover,.deva-contact-btn:focus-visible{background:#B05A47;border-color:#B05A47}" +
  ".deva-contact-btn:hover .deva-contact-icon,.deva-contact-btn:focus-visible .deva-contact-icon{color:#F7F5F0}" +
  ".deva-address{display:inline-flex;align-items:center;gap:10px;margin-top:16px;font-size:14px;color:rgba(247,245,240,.6);text-decoration:none;transition:color .5s}" +
  ".deva-address .deva-contact-icon{color:#B05A47}.deva-address:hover{color:#F7F5F0}" +
  // social links under the contact buttons (only when render.js draws them)
  ".deva-social{margin-top:40px}.deva-social-list{display:flex;flex-wrap:wrap;gap:4px 24px;list-style:none;margin:0;padding:0}" +
  ".deva-social-link{display:inline-flex;align-items:center;gap:10px;min-height:44px;font-size:15px;color:rgba(247,245,240,.78);text-decoration:none;transition:color .5s}.deva-social-link:hover{color:#F7F5F0}" +
  // skip link: hidden until it gets keyboard focus
  ".deva-skip{position:absolute;left:16px;top:-60px;z-index:300;padding:10px 16px;background:#2D2824;color:#F7F5F0;border-radius:3px;font-size:14px;text-decoration:none;transition:top .2s}" +
  ".deva-skip:focus{top:16px}main:focus{outline:none}" +
  // the map loads on request (no Google cookies before that)
  ".deva-map{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border:0;cursor:pointer;color:#F7F5F0;font:inherit;" +
  "background:radial-gradient(circle at 50% 45%,rgba(176,90,71,.18),transparent 60%),repeating-linear-gradient(45deg,rgba(247,245,240,.035) 0 1px,transparent 1px 28px),repeating-linear-gradient(-45deg,rgba(247,245,240,.035) 0 1px,transparent 1px 28px),#36302B;transition:background-color .5s}" +
  ".deva-map:hover,.deva-map:focus-visible{background-color:#3F3833}.deva-map-show{font-size:16px;letter-spacing:.02em}.deva-map-note{font-size:12px;color:rgba(247,245,240,.6)}" +
  // WCAG AA contrast (4.5:1) for the small labels and notes the Base44 colours drew at 3.0-4.2:1; same hues, darker or lighter
  CONTRAST +
  // header: logo left of the name
  ".deva-brand{display:inline-flex;align-items:center;gap:10px;flex-shrink:0}.deva-logo{width:30px;height:30px;border-radius:6px;flex-shrink:0}" +
  // phones: logo 26px, name a touch tighter, so the icons keep room
  "@media (max-width:639px){.deva-brand{gap:8px;letter-spacing:.02em}.deva-logo{width:26px;height:26px;border-radius:5px}}" +
  // header: contact icons and the menu button (36x36 targets, 40x40 for the menu), visible keyboard focus
  ".deva-nav-right{gap:6px}.deva-nav-icons{display:flex;align-items:center;gap:0;margin:0;padding:0;list-style:none}" +
  ".deva-nav-icon{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:transparent;border:0;padding:0;cursor:pointer}" +
  ".deva-burger{width:40px;height:40px;margin-right:-8px}" +
  "@media (min-width:640px){.deva-nav-right{gap:14px}.deva-nav-icons{gap:4px}}" +
  // share: footer button looks like the contact links; "link copied" notice; text only for screen readers
  "button.deva-contact-btn{width:100%;background:transparent;cursor:pointer;text-align:left}" +
  ".deva-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
  ".deva-toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,16px);z-index:400;padding:12px 20px;border-radius:999px;background:#2D2824;color:#F7F5F0;font-size:14px;opacity:0;pointer-events:none;transition:opacity .3s,transform .3s}" +
  ".deva-toast.is-on{opacity:1;transform:translate(-50%,0)}" +
  // phones: 32px icon targets and a 36px menu button (WCAG 2.2 minimum is 24px)
  "@media (max-width:639px){.deva-nav-icon{width:32px}.deva-burger{width:36px;margin-right:-6px}.deva-nav-right{gap:2px}}" +
  // the smallest phones (320-359px): slightly smaller name and icons so the row keeps air after the name
  // small phones (340-379px, e.g. 360 Android, 375 iPhone SE) and the smallest (under 340px)
  "@media (max-width:379px){.deva-brand{font-size:16px;gap:7px;letter-spacing:.01em}.deva-logo{width:24px;height:24px;border-radius:4px}.deva-nav-icon{width:29px}.deva-burger{width:34px}}" +
  "@media (max-width:339px){.deva-brand{font-size:15px;gap:6px;letter-spacing:0}.deva-logo{width:22px;height:22px}.deva-nav-icon{width:27px}.deva-burger{width:32px}}" +
  // language selector in the menu
  ".deva-langs{position:absolute;bottom:48px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:14px;font-size:13px;letter-spacing:.2em;text-transform:uppercase}" +
  ".deva-lang{color:rgba(45,40,36,.72);text-decoration:none;padding:10px 4px;transition:color .5s}a.deva-lang:hover{color:#9A4A38}" +
  ".deva-lang-current{color:#2D2824;text-decoration:underline;text-underline-offset:6px;text-decoration-color:#B05A47}.deva-lang-sep{color:rgba(45,40,36,.4)}" +
  "[data-nav] a:focus-visible,[data-nav] button:focus-visible,[data-menu] a:focus-visible,[data-menu] button:focus-visible,.deva-dots button:focus-visible,.deva-contact-btn:focus-visible,.deva-map:focus-visible,footer a:focus-visible,footer button:focus-visible{outline:2px solid currentColor;outline-offset:3px;border-radius:3px}" +
  // room cards: on phones (<640px) a photo slide and a text slide, switched by swiping either way (site.js)
  ".deva-room-text,.deva-dots{display:none}" +
  "@media (max-width:639px){[data-room]{touch-action:pan-y}" +
  ".deva-room-text{display:flex;flex-direction:column;justify-content:center;position:absolute;inset:0;padding:26px 26px 40px;background:#EDE5D8;color:#2D2824;transform:translateX(100%);overflow-y:auto}" +
  ".deva-room-desc{font-size:15px;line-height:1.75;color:rgba(45,40,36,.82);margin:0}" +
  ".deva-room-list{list-style:none;margin:0;padding:0;display:grid;gap:10px}.deva-room-list li{display:flex;align-items:center;gap:12px;font-size:15px;color:rgba(45,40,36,.82)}" +
  ".deva-room-dash{width:12px;height:1px;background:#B05A47;flex-shrink:0}" +
  // each dot is a 24x24 tap target (WCAG 2.2) drawing an 8px dot
  ".deva-dots{display:flex;gap:0;position:absolute;left:50%;bottom:2px;transform:translateX(-50%);z-index:2}" +
  ".deva-dots button{width:24px;height:24px;padding:0;border:0;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center}" +
  ".deva-dots button::before{content:'';width:8px;height:8px;border-radius:50%;border:1px solid rgba(247,245,240,.9);box-shadow:0 0 0 1px rgba(45,40,36,.25)}" +
  ".deva-dots button[aria-pressed=true]::before{background:#F7F5F0}" +
  "[data-room][data-slide='1'] .deva-dots button::before{border-color:#9A4A38;box-shadow:none}[data-room][data-slide='1'] .deva-dots button[aria-pressed=true]::before{background:#9A4A38}}" +
  "@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition-duration:0s!important;animation-duration:0s!important}}";

const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500&display=swap";
const SHARE_ALT = { sr: "Centar DEVA, terapijski prostori u Novom Beogradu", en: "Centar DEVA, therapy spaces in Novi Beograd" };

// Structured data: the site, and the business as a local business (name, address, contact, prices, map).
// No map coordinates: add "geo" only from a confirmed location, never a guess.
function ld(t, lang, url) {
  const f = t.footer, prices = t.membership.tiers.map((x) => x.price);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": SITE + "#website", url: SITE, name: "Centar DEVA", inLanguage: ["sr-Latn", "en"], publisher: { "@id": SITE + "#business" } },
      { "@type": "WebPage", "@id": url + "#page", url, name: `${t.hero.brand} · ${t.hero.title1} ${t.hero.title2}`, description: t.hero.subtitle, inLanguage: lang === "sr" ? "sr-Latn" : "en", isPartOf: { "@id": SITE + "#website" }, about: { "@id": SITE + "#business" }, primaryImageOfPage: SITE + "assets/img/share.jpg" },
      { "@type": "LocalBusiness", "@id": SITE + "#business", name: "Centar DEVA", url: SITE, logo: SITE + "assets/img/logo.png",
        image: [SITE + "assets/img/share.jpg", SITE + "assets/img/space-1.jpg", SITE + "assets/img/space-2.jpg", SITE + "assets/img/space-3.jpg"],
        description: t.hero.subtitle,
        address: { "@type": "PostalAddress", streetAddress: f.address1, postalCode: "11070", addressLocality: "Novi Beograd", addressRegion: "Beograd", addressCountry: "RS" },
        telephone: "+381641403475", email: "devacentar@gmail.com",
        hasMap: "https://maps.google.com/?q=Omladinskih+Brigada+76+11070+Novi+Beograd",
        priceRange: `${prices[0]} – ${prices[prices.length - 1]}`, currenciesAccepted: "RSD, EUR",
        knowsLanguage: ["sr", "en"], areaServed: { "@type": "City", name: "Beograd" } }
    ]
  };
}

// Title and description per page, from the page's own copy so they stay in step with it.
function meta(t, p) {
  const brand = t.hero.brand, f = t.footer;
  return {
    home: [`${brand} · ${t.hero.title1} ${t.hero.title2}`, t.hero.subtitle],
    spaces: [`${t.nav.spaces} · ${brand}`, `${t.spaces.title1} ${t.spaces.title2}. ${t.spaces.points[0].text}`],
    membership: [`${t.nav.membership} · ${brand}`, t.membership.tiers.map((x) => `${x.philosophy}: ${x.price} ${x.unit}`).join(". ") + "."],
    contact: [`${t.nav.contact} · ${brand}`, `${f.address1}, ${f.address2} · ${f.email}, ${f.viber}, ${f.whatsapp}`],
    privacy: [`${t.privacyContent.title} · ${brand}`, t.privacyContent.intro],
    terms: [`${t.termsContent.title} · ${brand}`, t.termsContent.intro]
  }[p];
}

function html(dict, lang, p) {
  const t = dict[lang], rel = path(lang, p), base = "../".repeat(rel.split("/").filter(Boolean).length);
  const [title, desc] = meta(t, p).map(esc), url = SITE + rel, other = lang === "sr" ? "en" : "sr";
  const alt = (l) => `<link rel="alternate" hreflang="${l}" href="${SITE + path(l, p)}">`;
  return `<!DOCTYPE html>
<!-- GENERATED by tools/build-website.mjs — edit assets/render.js or assets/i18n.js, then rebuild. -->
<html lang="${lang === "sr" ? "sr-Latn" : "en"}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
${alt(lang)}
${alt(other)}
<link rel="alternate" hreflang="x-default" href="${SITE + path("sr", p)}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}assets/img/share.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:alt" content="${esc(SHARE_ALT[lang])}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(t.hero.brand)}">
<meta property="og:locale" content="${lang === "sr" ? "sr_RS" : "en_US"}">
<meta property="og:locale:alternate" content="${lang === "sr" ? "en_US" : "sr_RS"}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${SITE}assets/img/share.jpg">
<meta name="twitter:image:alt" content="${esc(SHARE_ALT[lang])}">
<meta name="theme-color" content="#2D2824">
<link rel="icon" href="${base}favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="${base}assets/img/icon-32.png">
<link rel="apple-touch-icon" href="${base}assets/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="image" href="${base}assets/img/hero.jpg" imagesrcset="${base}assets/img/opt/hero-640.webp 640w, ${base}assets/img/opt/hero-1024.webp 1024w" imagesizes="100vw" fetchpriority="high">
<link rel="preload" as="style" href="${FONTS}" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="${FONTS}"></noscript>
<link rel="stylesheet" href="${base}assets/app.css">
<style>${STYLE}</style>
<script type="application/ld+json">${JSON.stringify(ld(t, lang, url))}</script>
</head>
<body>
<div id="root">${page(dict, lang, { page: p, base })}</div>
<script src="${base}assets/site.js"></script>
</body>
</html>
`;
}

var api = { html: html, SITE: SITE, esc: esc };
if (typeof module !== "undefined" && module.exports) module.exports = api;
else root.DEVA_DOCUMENT = api;
})(this);
