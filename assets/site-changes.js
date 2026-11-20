/*
 * Centar DEVA — website change sets: what the hub assistant may change in the site's data, checked and applied the same
 * way everywhere (the hub's preview, the assistant server, the publishing workflow .github/workflows/site-change.yml).
 * Not loaded by the website itself.
 *
 * A change set:
 *   { title: "Instagram in the footer", summary: "…",
 *     edits: [ { path: "footer.followUs", sr: "Pratite nas", en: "Follow us" },          text, per language
 *              { path: "site.social", value: [ { network: "instagram", url: "https://www.instagram.com/…/", handle: "@…" } ] } ] }
 *
 * Text: `path` names existing copy in i18n.js (dots, list items by number: "spaces.points.0.text"); give sr, en or both.
 * Links: `site.social` replaces the whole list of social links (known networks, https, the network's own address).
 * Anything else (layout, new sections, contact numbers) is not a change set: it is a code change.
 *
 *   validate(dict, change) -> { ok, errors: [..] }      apply(dict, change) -> new dict (the input is not touched)
 *   diff(dict, change) -> [{ path, lang, before, after }]
 */
(function (root) {
  var NETWORKS = {
    instagram: /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?$/,
    facebook: /^https:\/\/(www\.|m\.)?facebook\.com\/[A-Za-z0-9_.\-\/?=]+$/,
    linkedin: /^https:\/\/(www\.)?linkedin\.com\/(company|in)\/[A-Za-z0-9_\-%]+\/?$/,
    youtube: /^https:\/\/(www\.)?youtube\.com\/(@[A-Za-z0-9_.\-]+|channel\/[A-Za-z0-9_\-]+|c\/[A-Za-z0-9_\-]+)\/?$/,
    tiktok: /^https:\/\/(www\.)?tiktok\.com\/@[A-Za-z0-9_.]+\/?$/
  };
  var LANGS = ["sr", "en"], MAX_EDITS = 20, MAX_TEXT = 2000, MAX_LINKS = 8;

  var clone = function (x) { return JSON.parse(JSON.stringify(x)); };
  var parts = function (path) { return String(path).split(".").map(function (p) { return /^\d+$/.test(p) ? Number(p) : p; }); };
  function get(obj, ps) { for (var i = 0; i < ps.length; i++) { if (obj == null || typeof obj !== "object" || !Object.prototype.hasOwnProperty.call(obj, ps[i])) return undefined; obj = obj[ps[i]]; } return obj; }
  function set(obj, ps, v) { for (var i = 0; i < ps.length - 1; i++) obj = obj[ps[i]]; obj[ps[ps.length - 1]] = v; }

  function validate(dict, change) {
    var errors = [], c = change || {};
    if (typeof c.title !== "string" || !c.title.trim() || c.title.length > 120) errors.push("title: a short title is needed (up to 120 characters)");
    if (!Array.isArray(c.edits) || !c.edits.length) errors.push("edits: at least one edit is needed");
    else if (c.edits.length > MAX_EDITS) errors.push("edits: at most " + MAX_EDITS);
    (Array.isArray(c.edits) ? c.edits : []).forEach(function (e, i) {
      var at = "edit " + (i + 1) + " (" + (e && e.path) + "): ";
      if (!e || typeof e.path !== "string" || !e.path) return errors.push(at + "no path");
      if (e.path === "site.social") {
        if (!Array.isArray(e.value)) return errors.push(at + "value must be the whole list of links");
        if (e.value.length > MAX_LINKS) errors.push(at + "at most " + MAX_LINKS + " links");
        e.value.forEach(function (s, j) {
          var where = at + "link " + (j + 1) + ": ";
          if (!s || !NETWORKS[s.network]) return errors.push(where + "network must be one of " + Object.keys(NETWORKS).join(", "));
          if (typeof s.url !== "string" || !NETWORKS[s.network].test(s.url)) errors.push(where + "not a " + s.network + " profile address (https, the network's own site): " + s.url);
          if (s.handle != null && (typeof s.handle !== "string" || s.handle.length > 60)) errors.push(where + "handle: text up to 60 characters");
          Object.keys(s).forEach(function (k) { if (["network", "url", "handle"].indexOf(k) < 0) errors.push(where + "unknown field " + k); });
        });
        return;
      }
      if (e.path.split(".")[0] === "site") return errors.push(at + "only site.social can be changed here; other links are a code change");
      var langs = LANGS.filter(function (l) { return e[l] != null; });
      if (!langs.length) errors.push(at + "give the new text in sr, en or both");
      if (e.value != null) errors.push(at + "text edits use sr / en, not value");
      langs.forEach(function (l) {
        var cur = get(dict[l], parts(e.path));
        if (typeof cur !== "string") errors.push(at + "no such text in " + l + " (only existing copy can change; new elements are a code change)");
        if (typeof e[l] !== "string") errors.push(at + l + " must be text");
        else if (e[l].length > MAX_TEXT) errors.push(at + l + " is longer than " + MAX_TEXT + " characters");
      });
    });
    return { ok: !errors.length, errors: errors };
  }

  function apply(dict, change) {
    var r = validate(dict, change);
    if (!r.ok) throw new Error("invalid change set: " + r.errors.join("; "));
    var d = clone(dict);
    change.edits.forEach(function (e) {
      if (e.path === "site.social") { d.site = d.site || {}; d.site.social = e.value.map(function (s) { var o = { network: s.network, url: s.url }; if (s.handle) o.handle = s.handle; return o; }); return; }
      LANGS.forEach(function (l) { if (e[l] != null) set(d[l], parts(e.path), e[l]); });
    });
    return d;
  }

  function diff(dict, change) {
    var out = [];
    (change.edits || []).forEach(function (e) {
      if (e.path === "site.social") return out.push({ path: e.path, lang: null, before: JSON.stringify(((dict.site || {}).social) || []), after: JSON.stringify(e.value) });
      LANGS.forEach(function (l) { if (e[l] != null) out.push({ path: e.path, lang: l, before: get(dict[l], parts(e.path)), after: e[l] }); });
    });
    return out;
  }

  var api = { validate: validate, apply: apply, diff: diff, NETWORKS: Object.keys(NETWORKS), LANGS: LANGS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.DEVA_CHANGES = api;
})(this);
