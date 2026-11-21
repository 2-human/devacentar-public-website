/* The hub's Pick inside an embedded page (the pick protocol, v1). The Centar DEVA hub (admin.centardeva.com) shows
 * pages in frames: the live site, website-change previews, the brand guidelines. So the hub assistant's Pick works in
 * them as on the hub itself, a page loads this agent when it is shown inside another page (site.js does it for the
 * website; the hub adds it to the copies it builds). It does nothing until the hub greets it from an allowed address,
 * then only while the hub says Pick is on:
 *   hub → page   { type: "hub-pick:hello", on }   start talking (the hub's address is checked), Pick on or off
 *                { type: "hub-pick:on" | "hub-pick:off" }   Pick switched; { type: "hub-pick:clear" } focus cleared
 *   page → hub   { type: "hub-pick:ready", height }          answered; the page's height (for frames sized to it)
 *                { type: "hub-pick:hover", rect, label }     the element under the pointer (rect in this page's viewport)
 *                { type: "hub-pick:focus", rect, info }      the element clicked or Entered: { tag, text, heading, label }
 *                { type: "hub-pick:rects", hover, focus }    both rects again after a scroll or resize
 *                { type: "hub-pick:key", key: "Escape" }     Esc pressed in the page
 * While Pick is on, a click in the page picks instead of acting (links and buttons do nothing), as on the hub. */
(function () {
  if (window.__hubPickAgent || window.parent === window) return;
  window.__hubPickAgent = 1;
  // the hub, or a hub preview on this machine (any local port: the tests serve it on a free one); an agent only ever
  // shares what is on its own page
  var allowed = function (o) { return o === "https://admin.centardeva.com" || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(o); };
  var PICKABLE = "tr,li,figure,h1,h2,h3,h4,h5,p,dt,dd,img,button,a,label,blockquote,pre,section,article,iframe,svg,[class*=tile],[class*=card]";
  var hub = null, on = false, hoverEl = null, focusEl = null;
  var clean = function (s, n) { s = String(s || "").replace(/\s+/g, " ").trim(); return n && s.length > n ? s.slice(0, n) + "…" : s; };
  var send = function (m) { if (hub) window.parent.postMessage(m, hub); };
  var rectOf = function (n) { if (!n || !n.isConnected) return null; var r = n.getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height }; };
  var height = function () { return Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0); };
  function pickable(t) {
    if (!t || t.nodeType !== 1 || t === document.body || t === document.documentElement) return null;
    var c = t.closest(PICKABLE);
    if (c && c.tagName === "TD") c = c.closest("tr") || c;
    if (c && c.closest("svg") && c.tagName.toLowerCase() !== "svg") c = c.closest("svg").closest("a,button") || c.closest("svg");
    return c || t;
  }
  function headingBefore(n) {
    var hs = [].slice.call(document.querySelectorAll("h1,h2,h3")).filter(function (h) { return h === n || (h.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_FOLLOWING); });
    return hs.length ? clean(hs[hs.length - 1].textContent, 80) : "";
  }
  function describe(n) {
    var tag = n.tagName.toLowerCase(), aria = n.getAttribute("aria-label") || n.getAttribute("title") || "";
    var text = tag === "img" ? "image: " + (n.getAttribute("alt") || "") + " (" + (n.currentSrc || n.src || "").split("/").pop().split("?")[0] + ")" : clean(n.innerText || n.textContent || aria, 1200) || aria;
    var head = headingBefore(n), first = clean(text, 60);
    return { tag: tag, text: text, heading: head, label: (head && head !== first ? head + " › " : "") + (first || tag) };
  }
  function over(e) { if (!on) return; var p = pickable(e.target); if (p === hoverEl) return; hoverEl = p; send({ type: "hub-pick:hover", rect: rectOf(p), label: p ? describe(p).label : "" }); }
  function pick(e, p) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); focusEl = p; send({ type: "hub-pick:focus", rect: rectOf(p), info: describe(p) }); }
  function click(e) { if (!on) return; var p = pickable(e.target); if (p) pick(e, p); }
  function key(e) {
    if (e.key === "Escape" && hub) send({ type: "hub-pick:key", key: "Escape" });
    if (on && e.key === "Enter" && e.target !== document.body) { var p = pickable(e.target); if (p) pick(e, p); }
  }
  var queued = 0;
  function rects() { if (queued || !hub) return; queued = requestAnimationFrame(function () { queued = 0; send({ type: "hub-pick:rects", hover: on ? rectOf(hoverEl) : null, focus: rectOf(focusEl) }); }); }
  window.addEventListener("message", function (e) {
    var m = e.data; if (!m || typeof m.type !== "string" || m.type.indexOf("hub-pick:") !== 0 || e.source !== window.parent) return;
    if (m.type === "hub-pick:hello") {
      if (!allowed(e.origin)) return;   // only the hub may switch Pick on
      hub = e.origin; on = !!m.on; send({ type: "hub-pick:ready", height: height() }); return;
    }
    if (e.origin !== hub) return;
    if (m.type === "hub-pick:on") on = true;
    else if (m.type === "hub-pick:off") { on = false; hoverEl = null; rects(); }
    else if (m.type === "hub-pick:clear") { focusEl = null; rects(); }
  });
  document.addEventListener("mouseover", over, true);
  document.addEventListener("click", click, true);
  document.addEventListener("keydown", key, true);
  window.addEventListener("scroll", rects, true);
  window.addEventListener("resize", rects);
  // the page grew (fonts, images): tell the hub, for frames sized to their page
  var lastH = 0; setInterval(function () { var h = height(); if (hub && Math.abs(h - lastH) > 2) { lastH = h; send({ type: "hub-pick:ready", height: h }); } }, 1000);
})();
