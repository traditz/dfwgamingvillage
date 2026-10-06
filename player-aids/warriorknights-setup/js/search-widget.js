/* =============================================================================
   Rulebook search: the standard for every DFWGV player-aid page (v1.1, October 2026).
   v1.1: words split by a space after a PDF ligature or soft hyphen are joined; on-page answers keep a space
   where a nested list or table is left out.
   The same file is used unchanged on every page. Don't edit it per page.
   Contract and registration reference: tools/search/SEARCH_STANDARD.md.

   What it does, in the page's search panel:
     1. "On this page" (first): the page's own rendered setup steps, reference sections and
        Components glossary for the current configuration. Each answer is the whole matching
        bullet, table row, step or glossary item, with its section title, its citation and a
        Show button that opens the section, scrolls to it and highlights it.
     2. "In the rulebooks": every rulebook page the configuration allows, ranked (BM25 with a
        phrase and a proximity boost). Each card shows whole sentences around the best cluster of
        matches, the page's match count and a "Read the whole page" view; a visible total and
        "Show more" replace any silent cap.

   Page contract:
     index.html  <link rel="stylesheet" href="css/search.css?v=1">        after components.css
                 <script src="js/search-widget.js?v=1"></script>           after comp-widget.js, BEFORE app.js
     styles.css  the token block `#components {` becomes `#components, .aid-srch {`
     app.js      the old search is removed; inside the IIFE (so it can close over docVisible):
                   window.AID_SEARCH = { index: NS.rulesIndex, visible: docVisible,
                                         hint: (c) => "…", noMatch: (c) => "…" };
                 and update() already ends with
                   document.dispatchEvent(new CustomEvent("aid:config", { detail: c }));
   The widget reads window.AID_SEARCH lazily and re-runs the search after every aid:config, so
   the query survives configuration changes. It never touches the DOM while loading, so it also
   loads in Node (tools/search/search_check.js).
   ============================================================================= */
(function (G) {
  "use strict";

  var VERSION = "1.1";
  var errors = [];
  function logErr(where, e) {
    var msg = where + ": " + (e && e.message ? e.message : String(e));
    if (errors.indexOf(msg) === -1 && errors.length < 100) errors.push(msg);
  }
  var now = (typeof performance !== "undefined" && performance && typeof performance.now === "function")
    ? function () { return performance.now(); } : function () { return Date.now(); };
  function num(v, d) { return typeof v === "number" && isFinite(v) ? v : d; }
  function numAsc(a, b) { return a - b; }
  function popcount(x) { var c = 0; x = x >>> 0; while (x) { x &= x - 1; c++; } return c; }
  function isFn(f) { return typeof f === "function"; }

  /* ============================================================== §A text === */
  var UNI = (function () { try { return new RegExp("\\p{Lu}", "u").test("É"); } catch (e) { return false; } })();
  function re(u, a, f) {
    if (UNI) { try { return new RegExp(u, f + "u"); } catch (e) { /* fall back to the ASCII form */ } }
    return new RegExp(a, f);
  }
  var W_U = "\\p{L}\\p{N}\\u00AD\\u200B-\\u200D";
  var W_A = "A-Za-z0-9\\u00AA\\u00B2\\u00B3\\u00B5\\u00B9\\u00BA\\u00BC-\\u00BE\\u00C0-\\u00D6\\u00D8-\\u00F6" +
            "\\u00F8-\\u02AF\\u0370-\\u03FF\\u0400-\\u04FF\\u1E00-\\u1FFF\\uFB00-\\uFB06\\u00AD\\u200B-\\u200D";
  var AP = "'\\u2019\\u02BC";
  /* a word: letters/digits (soft hyphens and zero-width characters inside it are kept, then folded away),
     with inner apostrophes ("player's", "can't") */
  var TOKEN_RE = re("[" + W_U + "]+(?:[" + AP + "][" + W_U + "]+)*", "[" + W_A + "]+(?:[" + AP + "][" + W_A + "]+)*", "g");
  var MARKS_RE = re("\\p{M}+", "[\\u0300-\\u036F\\u1AB0-\\u1AFF\\u1DC0-\\u1DFF\\u20D0-\\u20FF\\uFE20-\\uFE2F]+", "g");
  var LETTER_RE = re("\\p{L}", "[A-Za-z\\u00C0-\\u024F]", "");
  var LOWER_RE = re("\\p{Ll}", "[a-z\\u00DF-\\u00FF]", "");
  var LIVE_RE = re("[\\p{L}\\p{N}]$", "[A-Za-z0-9\\u00C0-\\u024F]$", "");
  var SPECIAL = { "ł": "l", "ø": "o", "æ": "ae", "œ": "oe", "ß": "ss", "đ": "d", "ı": "i" };
  var SPECIAL_RE = /[łøæœßđı]/g;

  /* normWord: the folded form of one word. NFKD (ligatures ﬁ ﬂ ﬃ, accents), soft hyphens and
     zero-width characters removed, ł ø æ œ ß đ ı spelled out, lower case, a trailing 's dropped
     and the other apostrophes removed. Memoized. */
  var NW = new Map();
  function normWord(w) {
    var r = NW.get(w);
    if (r !== undefined) return r;
    var s = String(w);
    if (/[^\x00-\x7F]/.test(s)) {
      if (s.normalize) { try { s = s.normalize("NFKD"); } catch (e) { /* keep */ } }
      s = s.replace(MARKS_RE, "").replace(/[\u00AD\u200B-\u200D]/g, "").toLowerCase()
        .replace(SPECIAL_RE, function (c) { return SPECIAL[c]; }).replace(/[‘’ʼ]/g, "'");
    } else s = s.toLowerCase();
    if (s.indexOf("'") !== -1) s = s.replace(/'s$/, "").replace(/'/g, "");
    if (NW.size > 100000) NW.clear();
    NW.set(w, s);
    return s;
  }

  /* stem: a light English stemmer for matching keys only (never shown).
     flying→fly, winning→win, moving/moves/moved/move→mov, areas→area, heroes→hero, goes→go,
     casualties→casualty; string, thing, speed, used and basis stay as they are. */
  var STEM_KEEP = new Set(("always news series species perhaps bias gas yes this thus plus bonus focus lens less " +
    "unless across chaos atlas canvas whereas").split(" "));
  var SM = new Map();
  function undouble(b) {
    var n = b.length, c = b.charAt(n - 1);
    return n >= 4 && c === b.charAt(n - 2) && "bcdfghjkmnpqrtvwx".indexOf(c) !== -1 ? b.slice(0, -1) : b;
  }
  function stem(w) {
    var r = SM.get(w);
    if (r !== undefined) return r;
    var s = w, b;
    if (w.length > 3 && /^[a-z]+$/.test(w) && !STEM_KEEP.has(w)) {
      if (s.length > 4 && /ies$/.test(s)) s = s.slice(0, -3) + "y";
      else if (/oes$/.test(s)) s = s.slice(0, -2);
      else if (/(?:ch|sh|ss|x|z)es$/.test(s)) s = s.slice(0, -2);
      else if (/s$/.test(s) && !/(?:ss|us|is)$/.test(s)) s = s.slice(0, -1);
      if (s.length >= 6 && /ing$/.test(s)) {
        b = s.slice(0, -3);
        if (b.length >= 3 && /[aeiouy]/.test(b)) s = undouble(b);
      } else if (s.length > 4 && /ied$/.test(s)) s = s.slice(0, -3) + "y";
      else if (s.length >= 5 && /ed$/.test(s) && !/eed$/.test(s)) {
        b = s.slice(0, -2);
        if (b.length >= 3 && /[aeiouy]/.test(b)) s = undouble(b);
      }
      if (s.length >= 4 && /e$/.test(s)) s = s.slice(0, -1);
    }
    if (SM.size > 100000) SM.clear();
    SM.set(w, s);
    return s;
  }

  /* Stopwords: the union of the four older pages' lists. They never score, but they count toward a
     phrase ("roll of the dice"). A stem that a stopword produces is a stopword stem. */
  var STOP_LIST = ("a an the and or but if then of to in on for from with as at by be is are was were do does did " +
    "can could should would will may might must have has had this that these those it its it's i you he she they we " +
    "me my your our their what when where which who whom why how whats hows than into over under about yours during " +
    "while there here not no yes get got make use using used such per each any all some many much you're i'm we're " +
    "they're his her him").split(" ");
  var STOP = new Set(), STOP_STEMS = new Set();
  STOP_LIST.forEach(function (w) { var n = normWord(w); STOP.add(n); STOP_STEMS.add(stem(n)); });

  /* repairText (v1.1): some indexes store words split by a space after a ligature or a soft hyphen, as the PDFs
     were extracted ("Conﬂ ict", "Inﬂ uence", "ﬁ rst", "Shufﬂ e", "Lead­ ership"). The space goes when a
     lower-case letter follows, so matching, snippets and the whole-page view all see the word. A word-final
     ﬀ/ﬅ/ﬆ before a standalone word keeps its space: "oﬀ the board", "pays oﬀ later". (Only ﬀ ends English
     words in practice; "the shorter ﬂ at edge" is "flat".) */
  var JOIN_STOP = new Set("the a an of to and or in on at by for from with as is if later it".split(" "));
  var WORD_END_LIG = "\uFB00\uFB05\uFB06";
  var SPLIT_RE = re("([\\uFB00-\\uFB06\\u00AD]) (?=\\p{Ll})(\\p{L}*)", "([\\uFB00-\\uFB06\\u00AD]) (?=[a-z\\u00DF-\\u00FF])([A-Za-z\\u00C0-\\u024F]*)", "g");
  function repairText(t) {
    if (typeof t !== "string" || !/[\uFB00-\uFB06\u00AD] /.test(t)) return t;
    return t.replace(SPLIT_RE, function (m, c, w) { return WORD_END_LIG.indexOf(c) !== -1 && JOIN_STOP.has(w) ? m : c + w; });
  }

  function squash(s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function foldQ(s) {
    return String(s == null ? "" : s).replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, "\"")
      .replace(/\s+/g, " ").trim().toLowerCase();
  }

  /* ---- the dictionary shared by the rulebook index, the page's own units and queries ---- */
  var NONE = 0xFFFFFFFF;
  function newDict() {
    return { byStem: new Map(), stems: [], stop: [], surf: new Map(), words: [], surfStem: [], surfCount: [], sorted: null };
  }
  function stemId(D, s, add) {
    var i = D.byStem.get(s);
    if (i === undefined) {
      if (!add) return -1;
      i = D.stems.length;
      D.byStem.set(s, i); D.stems.push(s); D.stop.push(STOP_STEMS.has(s));
    }
    return i;
  }
  function addSurf(D, w) {
    var i = D.words.length;
    D.surf.set(w, i); D.words.push(w); D.surfStem.push(stemId(D, stem(w), true)); D.surfCount.push(0);
    D.sorted = null;
    return i;
  }

  /* tokenize: every word with its offsets in the ORIGINAL text, so matching, phrases, proximity,
     snippet windows and highlighting all work on offsets (no regex ever runs over escaped HTML).
     id = stem id (NONE when unknown and add is false), sid = surface-word id. */
  function tokenize(text, D, add, count) {
    var st = [], en = [], id = [], sid = [], m;
    text = String(text == null ? "" : text);
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(text))) {
      var w = normWord(m[0]);
      if (!w) continue;
      var si = D ? D.surf.get(w) : undefined;
      if (si === undefined && D && add) si = addSurf(D, w);
      st.push(m.index); en.push(m.index + m[0].length);
      if (si === undefined) { id.push(NONE); sid.push(NONE); }
      else { id.push(D.surfStem[si]); sid.push(si); if (count) D.surfCount[si]++; }
    }
    return { start: new Uint32Array(st), end: new Uint32Array(en), id: new Uint32Array(id), sid: new Uint32Array(sid), n: st.length };
  }
  function idSet(tk) { var s = new Set(); for (var j = 0; j < tk.n; j++) if (tk.id[j] !== NONE) s.add(tk.id[j]); return s; }

  /* ---- sentences ---- */
  var ABBR = new Set("p pp pg e.g eg i.e ie vs cf fig no nos vol ch approx min max st ref sec incl viz al ca".split(" "));
  var SENT_RE = re("([.!?]+|\\u2026)([\"'\\u201D\\u2019)\\]]*)\\s+(?=[\"'\\u201C\\u2018(\\[]?[\\p{Lu}\\p{N}\\u2022\\u2726\\u25CF\\u25AA\\u25A0\\u25BA])",
                   "([.!?]+|\\u2026)([\"'\\u201D\\u2019)\\]]*)\\s+(?=[\"'\\u201C\\u2018(\\[]?[A-Z0-9\\u00C0-\\u00DE\\u2022\\u2726\\u25CF\\u25AA\\u25A0\\u25BA])", "g");
  var WORD_BEFORE = re("[\\p{L}.]+$", "[A-Za-z\\u00C0-\\u024F.]+$", "");
  var ONE_CAP = re("^\\p{Lu}$", "^[A-Z\\u00C0-\\u00DE]$", "");
  var HARD_RE = /\n|(?:^|\s)([•✦●▪■►]|[QA]:\s)/g;
  var SEP_RE = /; |: | [–—] /g;

  /* sentenceStarts: the offsets where sentences start. A break follows . ! ? … (and closing quotes)
     before a capital, digit or bullet; never after an abbreviation (p. e.g. i.e. no. fig. …) or a
     single capital initial; "p.12" never breaks (no space). Hard starts: a line break, a bullet,
     "Q:" and "A:". Fragments under 12 characters join the next sentence; a sentence over 600
     characters is split at the "; " / ": " / " – " nearest its middle. */
  function sentenceStarts(text) {
    text = String(text == null ? "" : text);
    var L = text.length, pts = [0], hard = new Set(), m, p;
    SENT_RE.lastIndex = 0;
    while ((m = SENT_RE.exec(text))) {
      if (m[1] === ".") {
        var w = WORD_BEFORE.exec(text.slice(Math.max(0, m.index - 16), m.index));
        if (w && (ABBR.has(w[0].toLowerCase().replace(/^\.+|\.+$/g, "")) || ONE_CAP.test(w[0]))) continue;
      }
      pts.push(m.index + m[0].length);
    }
    HARD_RE.lastIndex = 0;
    while ((m = HARD_RE.exec(text))) {
      p = m[1] ? m.index + m[0].length - m[1].length : m.index + 1;
      while (p < L && /\s/.test(text.charAt(p))) p++;
      if (p < L) { pts.push(p); hard.add(p); }
    }
    headingStarts(text).forEach(function (x) { pts.push(x); });   // an ALL-CAPS heading after lower-case text starts a sentence
    pts.sort(numAsc);
    var out = [0];
    for (var i = 1; i < pts.length; i++) {
      p = pts[i];
      while (p < L && /\s/.test(text.charAt(p))) p++;
      if (p < L && p > out[out.length - 1]) out.push(p);
    }
    var mg = [0];
    for (i = 1; i < out.length; i++) {
      if (out[i] - mg[mg.length - 1] < 12) continue;          // a short fragment joins the next sentence
      mg.push(out[i]);
    }
    if (mg.length > 1 && L - mg[mg.length - 1] < 12) mg.pop();  // a short tail joins the previous one
    var fin = [];
    for (i = 0; i < mg.length; i++) {
      var a = mg[i], b = i + 1 < mg.length ? mg[i + 1] : L;
      fin.push(a);
      if (b - a > 600) splitLong(text, a, b, fin);
    }
    var hs = new Set();
    fin.forEach(function (x) { if (hard.has(x)) hs.add(x); });
    return { s: fin, hard: hs, L: L };
  }
  function splitLong(text, a, b, out) {
    if (b - a <= 600) return;
    var mid = (a + b) / 2, best = -1, bd = Infinity, m;
    SEP_RE.lastIndex = a;
    while ((m = SEP_RE.exec(text)) && m.index < b) {
      var at = m.index + m[0].length;
      if (at - a < 80 || b - at < 80) continue;
      var d = Math.abs(at - mid);
      if (d < bd) { bd = d; best = at; }
    }
    if (best < 0) return;
    splitLong(text, a, best, out);
    out.push(best);
    splitLong(text, best, b, out);
  }
  /* index of the sentence holding offset pos */
  function sentAt(S, pos) {
    var lo = 0, hi = S.length - 1;
    while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (S[mid] <= pos) lo = mid; else hi = mid - 1; }
    return lo;
  }
  function sentEnd(S, k, text) {
    var e = k + 1 < S.length ? S[k + 1] : text.length;
    while (e > S[k] && /\s/.test(text.charAt(e - 1))) e--;
    return e;
  }

  /* ---- paragraphs for "Read the whole page" (display only) ---- */
  var HEAD_RE = re("\\p{Lu}[\\p{Lu}'\\u2019\\-]+(?:[ ,:&\\u2013\\u2014\\-]+(?:\\d+[\\u2013\\u2014\\-.]?)?\\p{Lu}[\\p{Lu}'\\u2019\\-]+)+(?=[\\s:]+(?:\\p{Lu}|\\d|$))",
                   "[A-Z][A-Z'\\u2019\\-]+(?:[ ,:&\\u2013\\u2014\\-]+(?:\\d+[\\u2013\\u2014\\-.]?)?[A-Z][A-Z'\\u2019\\-]+)+(?=[\\s:]+(?:[A-Z]|\\d|$))", "g");
  /* heading runs: 2+ ALL-CAPS words after lower-case text ("…on page 3. COMPLETE SETUP This section…") */
  function headingStarts(text) {
    var out = [], m, num;
    HEAD_RE.lastIndex = 0;
    while ((m = HEAD_RE.exec(text))) {
      var i = m.index;
      if (i > 0 && (LETTER_RE.test(text.charAt(i - 1)) || /\d/.test(text.charAt(i - 1)))) continue;
      /* a topic number belongs to its heading: "Resources 26 CUSTODIANS TOKEN The…", "78.7 STEP 5—RETREAT:" */
      if ((num = /(^|\s)(\d+(?:\.\d+)*)\s+$/.exec(text.slice(Math.max(0, i - 14), i)))) i -= num[0].length - num[1].length;
      var k = i - 1;
      while (k >= 0 && !LETTER_RE.test(text.charAt(k))) k--;
      if (k >= 0 && LOWER_RE.test(text.charAt(k))) out.push(i);
    }
    return out;
  }
  /* paragraphs: split on line breaks when the text has them; otherwise group sentences, starting a new
     paragraph at a hard start or a heading run, or once it reaches 420 characters (never over 900). */
  function paragraphs(text, ss) {
    text = String(text == null ? "" : text);
    ss = ss || sentenceStarts(text);
    var L = text.length, out = [], heads = headingStarts(text), forced = new Set(heads);
    ss.hard.forEach(function (x) { forced.add(x); });
    function push(a, b) {
      while (a < b && /\s/.test(text.charAt(a))) a++;
      while (b > a && /\s/.test(text.charAt(b - 1))) b--;
      if (b > a) out.push([a, b]);
    }
    function group(a, b) {
      var pts = [a], i;
      for (i = 0; i < ss.s.length; i++) if (ss.s[i] > a && ss.s[i] < b) pts.push(ss.s[i]);
      for (i = 0; i < heads.length; i++) if (heads[i] > a && heads[i] < b) pts.push(heads[i]);
      pts.sort(numAsc);
      var cur = a, curLen = 0;
      for (i = 0; i < pts.length; i++) {
        var p = pts[i], q = i + 1 < pts.length ? pts[i + 1] : b, len = q - p;
        if (p > cur && (forced.has(p) || curLen >= 420 || curLen + len > 900)) { push(cur, p); cur = p; curLen = 0; }
        curLen += len;
      }
      push(cur, b);
    }
    if (text.indexOf("\n") !== -1) {
      var a = 0;
      while (a <= L) {
        var nl = text.indexOf("\n", a), b = nl < 0 ? L : nl;
        if (/\S/.test(text.slice(a, b))) group(a, b);
        if (nl < 0) break;
        a = nl + 1;
      }
    } else group(0, L);
    return out;
  }

  /* ============================================================= §B index === */
  /* buildIndex(entries): one inverted index over the rulebook pages. post[stemId] = [doc, tf, doc, tf, …]
     for content words only; docs[i] keeps its tokens (offsets) for phrases, proximity and snippets.
     Sentences, paragraphs and the folded text are built per page on demand. */
  function buildIndex(entries) {
    var t0 = now(), D = newDict(), post = [], last = [], docs = [], total = 0, tokens = 0;
    entries = Array.isArray(entries) ? entries : [];
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i], t = e && typeof e.t === "string" ? repairText(e.t) : "";
      var tk = tokenize(t, D, true, true), len = 0;
      for (var j = 0; j < tk.n; j++) {
        var id = tk.id[j];
        if (D.stop[id]) continue;
        len++;
        var p = post[id];
        if (p === undefined) p = post[id] = [];
        if (last[id] !== i) { last[id] = i; p.push(i, 1); } else p[p.length - 1]++;
      }
      tokens += tk.n;
      total += len;
      docs.push({ text: t, tk: tk, len: Math.max(1, len), sents: null, paras: null, folded: null });
    }
    return { D: D, post: post, docs: docs, entries: entries, N: entries.length,
             avgdl: Math.max(1, total / Math.max(1, entries.length)), tokens: tokens, ms: now() - t0 };
  }
  /* a page's text as indexed (repaired): token offsets, sentences, snippets and the whole-page view all use it */
  function docText(I, d) { return I.docs[d].text; }
  function docSents(I, d) { var doc = I.docs[d]; if (!doc.sents) doc.sents = sentenceStarts(doc.text); return doc.sents; }
  function docParas(I, d) { var doc = I.docs[d]; if (!doc.paras) doc.paras = paragraphs(doc.text, docSents(I, d)); return doc.paras; }
  function docFolded(I, d) { var doc = I.docs[d]; if (doc.folded === null) doc.folded = foldQ(doc.text); return doc.folded; }

  /* ============================================================= §C query === */
  var QSTART = new Set("how what why when where who which can do does should is are will if must may".split(" "));
  var QNOISE = new Set("happen happens happened mean means meant work works exactly actually possible".split(" "));
  var MAX_TERMS = 30, MAX_EXPAND = 40;

  /* the surface words starting with prefix, most frequent first (at most max) */
  function expand(D, prefix, max) {
    if (!D.sorted) {
      D.sorted = D.words.map(function (w, i) { return i; });
      D.sorted.sort(function (a, b) { var x = D.words[a], y = D.words[b]; return x < y ? -1 : x > y ? 1 : 0; });
    }
    var A = D.sorted, lo = 0, hi = A.length;
    while (lo < hi) { var mid = (lo + hi) >> 1; if (D.words[A[mid]] < prefix) lo = mid + 1; else hi = mid; }
    var hits = [];
    for (var k = lo; k < A.length; k++) {
      var w = D.words[A[k]];
      if (w.lastIndexOf(prefix, 0) !== 0) break;
      if (w !== prefix) hits.push(A[k]);
    }
    if (hits.length > max) {
      hits.sort(function (a, b) { return D.surfCount[b] - D.surfCount[a] || (D.words[a] < D.words[b] ? -1 : 1); });
      hits.length = max;
    }
    return hits;
  }

  var SYN_CACHE = { src: null, map: null };
  function synMap(syn) {
    if (SYN_CACHE.src === syn) return SYN_CACHE.map;
    var map = new Map();
    Object.keys(syn || {}).forEach(function (k) {
      var ks = stem(normWord(k)), set = map.get(ks) || new Set();
      (Array.isArray(syn[k]) ? syn[k] : []).forEach(function (v) {
        var t = String(v).match(TOKEN_RE);
        if (t && t.length === 1) set.add(stem(normWord(t[0])));
      });
      map.set(ks, set);
    });
    SYN_CACHE = { src: syn, map: map };
    return map;
  }

  /* compile(raw, I, R) → CQ: the query as stem ids.
     phrase: every token including stopwords (−1 if unknown); terms: the content words, each with its
     alternatives (alts: stemId → weight); syn: synonym alternatives (0.45, never count toward coverage).
     The last word gets prefix expansion while typing (live, ≥ 3 characters, not a question). */
  function compile(raw, I, R) {
    var D = I.D;
    raw = String(raw == null ? "" : raw);
    var CQ = { raw: raw, folded: foldQ(raw), phrase: [], terms: [], syn: [], n: 0, question: false, live: false,
               empty: false, stopOnly: false, termOf: new Map(), synOf: new Map(), lastAlts: null, phraseOk: false, full: 0 };
    var toks = [], m;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(raw)) && toks.length < 64) {
      var w = normWord(m[0]);
      if (w) toks.push({ raw: m[0], w: w, s: stem(w) });
    }
    if (!toks.length) { CQ.empty = true; return CQ; }
    CQ.question = QSTART.has(toks[0].w) || /\?\s*$/.test(raw);
    CQ.live = LIVE_RE.test(raw);
    toks.forEach(function (t) {
      t.stop = STOP.has(t.w) || STOP_STEMS.has(t.s);
      var id = D.byStem.get(t.s);
      t.id = id === undefined ? -1 : id;
      CQ.phrase.push(t.id);
    });
    var byStem = new Map();
    toks.forEach(function (t) {
      if (t.stop || (CQ.question && QNOISE.has(t.w)) || byStem.has(t.s) || CQ.terms.length >= MAX_TERMS) return;
      var term = { label: t.raw, w: t.w, s: t.s, alts: new Map(), prefix: false };
      if (t.id >= 0) term.alts.set(t.id, 1);
      byStem.set(t.s, term);
      CQ.terms.push(term);
    });
    if (!CQ.terms.length) { CQ.stopOnly = true; return CQ; }
    var last = toks[toks.length - 1];
    if (CQ.live && !CQ.question && !last.stop && last.w.length >= 3 && byStem.has(last.s)) {
      var lt = byStem.get(last.s), wt = D.surf.has(last.w) ? 0.5 : 0.85;
      expand(D, last.w, MAX_EXPAND).forEach(function (si) {
        var id = D.surfStem[si];
        if (!D.stop[id] && !lt.alts.has(id)) lt.alts.set(id, wt);
      });
      lt.prefix = true;
      CQ.lastAlts = lt.alts;
    }
    CQ.n = CQ.terms.length;
    CQ.full = CQ.n >= 31 ? 0x7FFFFFFF : (1 << CQ.n) - 1;
    CQ.terms.forEach(function (t, ti) {
      t.alts.forEach(function (w, id) {
        var cur = CQ.termOf.get(id);
        if (cur) { cur.mask |= 1 << ti; if (w > cur.w) cur.w = w; }
        else CQ.termOf.set(id, { ti: ti, mask: 1 << ti, w: w });
      });
    });
    if (R && R.synonyms && typeof R.synonyms === "object") {
      var SM2 = synMap(R.synonyms);
      CQ.terms.forEach(function (t) {
        var set = SM2.get(t.s);
        if (!set) return;
        var alts = new Map();
        set.forEach(function (s2) {
          var id = D.byStem.get(s2);
          if (id === undefined || D.stop[id] || CQ.termOf.has(id) || CQ.synOf.has(id)) return;
          alts.set(id, 0.45); CQ.synOf.set(id, 0.45);
        });
        if (alts.size) CQ.syn.push({ label: t.label, alts: alts });
      });
    }
    var P = CQ.phrase, L = P.length;
    CQ.phraseOk = L >= 2 && P.slice(0, L - 1).every(function (x) { return x >= 0; }) &&
      (P[L - 1] >= 0 || !!(CQ.lastAlts && CQ.lastAlts.size && !last.stop));
    return CQ;
  }

  /* phrase runs: token ranges [j0, j1] that spell the query in order (the last word may be any of its alts) */
  function phraseRuns(tk, CQ, firstOnly) {
    var runs = [];
    if (!CQ.phraseOk) return runs;
    var P = CQ.phrase, L = P.length, last = CQ.lastAlts, n = tk.n;
    for (var j = 0; j + L <= n; j++) {
      if (tk.id[j] !== P[0]) continue;
      var k = 1;
      while (k < L - 1 && tk.id[j + k] === P[k]) k++;
      if (k < L - 1) continue;
      var lid = tk.id[j + L - 1];
      if (lid === P[L - 1] || (last && last.has(lid))) {
        runs.push([j, j + L - 1]);
        if (firstOnly) return runs;
        j += L - 1;
      }
    }
    return runs;
  }

  /* ============================================================== §D rank === */
  function visibility(R, c) {
    var cache = new Map(), f = R && R.visible;
    return function (x) {
      if (cache.has(x)) return cache.get(x);
      var v = true;
      if (isFn(f)) { try { v = !!f(x, c); } catch (e) { logErr("visible(" + x + ")", e); v = false; } }
      cache.set(x, v);
      return v;
    };
  }
  function maskFor(I, vis) {
    var mask = new Uint8Array(I.N);
    for (var i = 0; i < I.N; i++) mask[i] = vis(I.entries[i] ? I.entries[i].x : "") ? 1 : 0;
    return mask;
  }
  /* topic suppression (older pages): when the query is about a rule a newer book in play governs,
     the older books' passages on that topic are hidden (official FAQ/unofficial entries never are) */
  function suppression(I, CQ, env) {
    var rules = env.R && env.R.suppress;
    if (!Array.isArray(rules) || !rules.length) return null;
    var hide = null;
    rules.forEach(function (rule) {
      if (!rule || !Array.isArray(rule.kw) || !Array.isArray(rule.chain)) return;
      var kws = rule.kw.map(foldQ).filter(Boolean);
      if (!kws.some(function (k) { return CQ.folded.indexOf(k) !== -1; })) return;
      var gov = null;
      for (var k = rule.chain.length - 1; k >= 0; k--) if (env.vis(rule.chain[k])) { gov = rule.chain[k]; break; }
      if (gov === null) return;
      for (var i = 0; i < I.N; i++) {
        var pg = I.entries[i];
        if (!pg || pg.s || pg.x === gov || rule.chain.indexOf(pg.x) === -1) continue;
        var f = docFolded(I, i);
        if (kws.some(function (kw) { return f.indexOf(kw) !== -1; })) { if (!hide) hide = new Uint8Array(I.N); hide[i] = 1; }
      }
    });
    return hide;
  }
  /* the tightest token window holding the most distinct terms */
  function tightest(pos, term, n) {
    var best = { d: 0, span: 0, l: -1, r: -1 };
    if (!pos.length) return best;
    var cnt = new Int32Array(Math.max(1, n)), d = 0, l = 0;
    for (var r = 0; r < pos.length; r++) {
      if (cnt[term[r]]++ === 0) d++;
      while (l < r && cnt[term[l]] > 1) { cnt[term[l]]--; l++; }
      var span = pos[r] - pos[l];
      if (d > best.d || (d === best.d && span < best.span)) best = { d: d, span: span, l: l, r: r };
    }
    return best;
  }
  /* a word in an ALL-CAPS rulebook heading ("78.7 STEP 5—RETREAT:", "26 CUSTODIANS TOKEN"): the page
     defines it. Title-case headings can't be told from text, so this only ever adds. */
  var UPPER_RE = re("\\p{Lu}", "[A-Z\\u00C0-\\u00DE]", "");
  /* token kinds: 1 an ALL-CAPS word, 2 a number, 3 a capitalised word ("The"), 0 anything else, -1 none */
  function tokKind(text, tk, j) {
    if (j < 0 || j >= tk.n) return -1;
    var s = text.slice(tk.start[j], tk.end[j]);
    if (/^\d+$/.test(s)) return 2;
    if (LOWER_RE.test(s)) return UPPER_RE.test(s.charAt(0)) ? 3 : 0;
    return s.length >= 2 && UPPER_RE.test(s) && !/\d/.test(s) ? 1 : 0;
  }
  /* a heading: a short run of ALL-CAPS words (numbers allowed inside: "STEP 5—RETREAT") that starts after a
     number or a sentence end and is followed by prose ("…: If a player", "TOKEN The custodians token…").
     Map labels and component lists ("THIBAH 6 1 MECATOL REX 42 40") are runs followed by numbers or more labels. */
  function inHeading(text, tk, j) {
    if (tokKind(text, tk, j) !== 1) return false;
    var a = j, b = j, k;
    for (;;) { k = tokKind(text, tk, a - 1); if (k === 1) a--; else if (k === 2 && tokKind(text, tk, a - 2) === 1) a -= 2; else break; }
    for (;;) { k = tokKind(text, tk, b + 1); if (k === 1) b++; else if (k === 2 && tokKind(text, tk, b + 2) === 1) b += 2; else break; }
    if (b - a > 8 || tokKind(text, tk, b + 1) !== 3) return false;
    if (a === 0 || tokKind(text, tk, a - 1) === 2) return true;
    var p = tk.start[a] - 1;
    while (p >= 0 && /\s/.test(text.charAt(p))) p--;
    return p < 0 || /[.:;!?)—–”"]/.test(text.charAt(p));
  }
  function scanDoc(tk, CQ, text) {
    var pos = [], term = [], head = 0;
    for (var j = 0; j < tk.n; j++) {
      var t = CQ.termOf.get(tk.id[j]);
      if (!t) continue;
      pos.push(j); term.push(t.ti);
      if (text && !(head & t.mask) && inHeading(text, tk, j)) head |= t.mask;
    }
    var w = tightest(pos, term, CQ.n);
    return { phrase: phraseRuns(tk, CQ, true).length > 0, prox: w.d >= 2 ? (w.d - 1) / (1 + w.span / 25) : 0,
             head: CQ.n ? popcount(head & CQ.full) / CQ.n : 0 };
  }
  function rerank(I, list, CQ, prec) {
    list.sort(function (a, b) { return b.base - a.base || a.i - b.i; });
    var top = Math.min(list.length, 120);
    for (var k = 0; k < list.length; k++) {
      var a = list[k], p = num(prec[I.entries[a.i].x], 0) * 0.003;
      if (k < top) {
        var sc = scanDoc(I.docs[a.i].tk, CQ, docText(I, a.i));
        a.phrase = sc.phrase; a.prox = sc.prox; a.head = sc.head;
        a.score = a.base * (sc.phrase ? 2.4 : 1) * (1 + 0.7 * sc.prox) * (1 + 0.35 * sc.head) + p;
      } else a.score = a.base + p;
    }
    var head = list.slice(0, top).sort(function (a, b) { return b.score - a.score || a.i - b.i; });
    for (k = 0; k < top; k++) list[k] = head[k];
    return list;
  }

  /* searchDocs(I, CQ, env) → { tiers:[{label, cls, full:[Hit], partial:[Hit]}], full, partial, ms }
     env = { R, mask (visible pages), vis (x → visible) }. Hit = { i, score, base, count, cov, full }. */
  function searchDocs(I, CQ, env) {
    /* b = 0.4 (not the textbook 0.75): rulebook pages run long and FAQ answers short, and a higher b lets a
       passing mention in a two-line Q&A or a near-empty cover page outrank the rule itself */
    var t0 = now(), R = env.R || {}, bm = R.bm25 || {}, k1 = num(bm.k1, 1.2), b = num(bm.b, 0.4);
    var hide = suppression(I, CQ, env), acc = new Map();
    function add(alts, ti) {
      alts.forEach(function (w, id) {
        var p = I.post[id];
        if (!p) return;
        var df = p.length / 2, idf = Math.log(1 + (I.N - df + 0.5) / (df + 0.5));
        for (var j = 0; j < p.length; j += 2) {
          var d = p[j];
          if (!env.mask[d] || (hide && hide[d])) continue;
          var tf = p[j + 1], dl = I.docs[d].len;
          var sc = w * idf * tf * (k1 + 1) / (tf + k1 * (1 - b + b * dl / I.avgdl));
          var a = acc.get(d);
          if (!a) { a = { i: d, base: 0, cov: 0, count: 0, score: 0, full: false, phrase: false, prox: 0 }; acc.set(d, a); }
          a.base += sc;
          if (ti >= 0) { a.cov |= 1 << ti; a.count += tf; }
        }
      });
    }
    CQ.terms.forEach(function (t, ti) { add(t.alts, ti); });
    CQ.syn.forEach(function (s) { add(s.alts, -1); });
    var defs = Array.isArray(R.tiers) && R.tiers.length ? R.tiers : [{ label: "In the rulebooks" }];
    var tiers = defs.map(function (t) { return { label: String(t.label || "In the rulebooks"), cls: t.cls || "", show: t.show, test: t.test, full: [], partial: [] }; });
    var nFull = 0, nPart = 0;
    acc.forEach(function (a) {
      var c = popcount(a.cov);
      a.full = c === CQ.n;
      if (!a.full) {
        if (!(CQ.n >= 2 && c * 2 >= CQ.n)) return;
        var f = c / CQ.n;
        a.base *= 0.25 + 0.75 * f * f;
      }
      var pg = I.entries[a.i], k = tiers.length - 1;
      for (var t = 0; t < tiers.length; t++) {
        if (!isFn(tiers[t].test)) { k = t; break; }
        var ok = false;
        try { ok = !!tiers[t].test(pg); } catch (e) { logErr("tier test " + tiers[t].label, e); }
        if (ok) { k = t; break; }
      }
      if (a.full) { tiers[k].full.push(a); nFull++; } else { tiers[k].partial.push(a); nPart++; }
    });
    var showPartial = R.partial === "always" || nFull < 5, prec = R.precedence || {};
    tiers.forEach(function (T) {
      rerank(I, T.full, CQ, prec);
      if (showPartial) rerank(I, T.partial, CQ, prec); else T.partial = [];
    });
    return { tiers: tiers, full: nFull, partial: showPartial ? nPart : 0, partialHidden: showPartial ? 0 : nPart, hidden: hide, ms: now() - t0 };
  }

  /* =========================================================== §E snippet === */
  /* matches on one token list: content occurrences, phrase runs, and the <mark> spans
     (one per phrase run; synonyms get class aid-srch-syn) */
  function matchInfo(D, tk, CQ, withSyn, text) {
    var occ = [], occT = [], occW = [], occS = [], spans = [], runs = phraseRuns(tk, CQ, false), r = 0, j;
    for (j = 0; j < tk.n; j++) {
      var t = CQ.termOf.get(tk.id[j]);
      if (!t) continue;
      var w = t.w;
      if (D && tk.sid[j] !== NONE && CQ.terms[t.ti].w === D.words[tk.sid[j]]) w += 0.25;   // the exact form typed
      if (text && inHeading(text, tk, j)) w += 0.5;                                          // the heading that defines it
      occ.push(j); occT.push(t.ti); occW.push(w); occS.push(tk.start[j]);
    }
    for (j = 0; j < tk.n; j++) {
      if (r < runs.length && runs[r][0] === j) { spans.push([tk.start[j], tk.end[runs[r][1]], 0]); j = runs[r][1]; r++; continue; }
      var id = tk.id[j];
      if (CQ.termOf.has(id)) spans.push([tk.start[j], tk.end[j], 0]);
      else if (withSyn !== false && CQ.synOf.has(id)) spans.push([tk.start[j], tk.end[j], 1]);
    }
    return { occ: occ, occT: occT, occW: occW, occS: occS, runs: runs, spans: spans };
  }
  function firstAtOrAfter(arr, x) { var lo = 0, hi = arr.length; while (lo < hi) { var m = (lo + hi) >> 1; if (arr[m] < x) lo = m + 1; else hi = m; } return lo; }
  function hitsIn(M, a, b) { var k = firstAtOrAfter(M.occS, a); return k < M.occS.length && M.occS[k] < b; }
  function maskIn(M, a, b) {
    var m = 0;
    for (var k = firstAtOrAfter(M.occS, a); k < M.occS.length && M.occS[k] < b; k++) m |= 1 << M.occT[k];
    return m;
  }
  /* HTML for text[lo, hi) with the marks; everything between marks is escaped; line breaks become spaces */
  function spansHtml(text, spans, lo, hi) {
    var out = "", pos = lo;
    for (var k = 0; k < spans.length; k++) {
      var s = spans[k];
      if (s[1] <= lo) continue;
      if (s[0] >= hi) break;
      var a = Math.max(s[0], lo), b = Math.min(s[1], hi);
      if (a < pos) continue;
      out += esc(text.slice(pos, a)) + (s[2] ? "<mark class=\"aid-srch-syn\">" : "<mark>") + esc(text.slice(a, b)) + "</mark>";
      pos = b;
    }
    out += esc(text.slice(pos, hi));
    return out.replace(/\s*\n\s*/g, " ");
  }
  /* the anchor: the first phrase run with the most distinct terms nearby; otherwise the tightest
     window with the most distinct terms (ties: larger Σweight — exact forms weigh more — then earlier).
     With one term, the sentence holding the most (weighted) matches. */
  function anchorWindow(M, CQ, S) {
    var q, k;
    if (M.runs.length) {
      var bestK = 0, bestD = -1;
      M.runs.forEach(function (run, i) {
        var seen = 0;
        for (q = 0; q < M.occ.length; q++) if (M.occ[q] >= run[0] - 25 && M.occ[q] <= run[1] + 25) seen |= 1 << M.occT[q];
        var d = popcount(seen);
        if (d > bestD) { bestD = d; bestK = i; }
      });
      return { a: M.runs[bestK][0], b: M.runs[bestK][1] };
    }
    if (!M.occ.length) return null;
    if (CQ.n === 1 && S) {
      var bestS = -1, bestW = -1, bestQ = 0;
      for (q = 0; q < M.occ.length; q++) {
        var si = sentAt(S, M.occS[q]), w = 0, first = q;
        while (q < M.occ.length && sentAt(S, M.occS[q]) === si) { w += M.occW[q]; q++; }
        q--;
        if (w > bestW + 1e-9) { bestW = w; bestS = si; bestQ = first; }
      }
      return { a: M.occ[bestQ], b: M.occ[bestQ] };
    }
    var n = Math.max(1, CQ.n), cnt = new Int32Array(n), d2 = 0, l = 0, best = null, pre = [0];
    for (q = 0; q < M.occW.length; q++) pre.push(pre[q] + M.occW[q]);
    for (k = 0; k < M.occ.length; k++) {
      if (cnt[M.occT[k]]++ === 0) d2++;
      while (l < k && cnt[M.occT[l]] > 1) { cnt[M.occT[l]]--; l++; }
      var span = M.occ[k] - M.occ[l], ws = pre[k + 1] - pre[l];
      if (!best || d2 > best.d || (d2 === best.d && (span < best.span || (span === best.span && ws > best.w + 1e-9))))
        best = { d: d2, span: span, w: ws, a: M.occ[l], b: M.occ[k] };
    }
    return best;
  }

  /* snippet(I, d, CQ, {max, min}) → { html, whole }
     Whole sentences around the anchor (grown toward min, up to 3 sentences, preferring neighbours with
     hits; an adjacent sentence with hits is merged while the total stays ≤ max). A page that fits in max
     is shown whole. A word the main fragment misses adds its best short sentence (" … ", total ≤ 600). */
  function snippet(I, d, CQ, opt) {
    opt = opt || {};
    var max = opt.max || 450, min = opt.min || 160, cap = 600;
    var text = docText(I, d), tk = I.docs[d].tk;
    var M = matchInfo(I.D, tk, CQ, true, text);
    if (text.length <= max) return { html: spansHtml(text, M.spans, 0, text.length).trim(), whole: true, len: text.length };
    var SS = docSents(I, d), S = SS.s, lo, hi, cutL = false, cutR = false;
    var win = anchorWindow(M, CQ, S);
    if (!win) { lo = 0; hi = sentEnd(S, 0, text); win = null; }
    else {
      var ca = tk.start[win.a], cb = tk.end[win.b];
      var sa = sentAt(S, ca), sb = sentAt(S, Math.max(ca, cb - 1));
      lo = S[sa]; hi = sentEnd(S, sb, text);
      if (hi - lo > max && sb > sa) { sb = sa; hi = sentEnd(S, sa, text); }          // terms far apart: anchor on the first
      if (hi - lo > max) {                                                            // one very long sentence: a window
        var mid = sb === sa && cb - ca > max ? ca + 40 : (ca + cb) >> 1;
        lo = Math.max(S[sa], Math.min(mid - (max >> 1), hi - max));
        hi = Math.min(hi, lo + max);
        while (lo > S[sa] && LETTER_RE.test(text.charAt(lo - 1)) && LETTER_RE.test(text.charAt(lo))) lo++;
        while (hi < text.length && hi > lo && LETTER_RE.test(text.charAt(hi - 1)) && LETTER_RE.test(text.charAt(hi))) hi--;
        while (lo < hi && /\s/.test(text.charAt(lo))) lo++;
        while (hi > lo && /\s/.test(text.charAt(hi - 1))) hi--;
        cutL = lo > S[sa]; cutR = hi < sentEnd(S, sa, text);
      } else {
        var count = sb - sa + 1;
        while (hi - lo < min && count < 3) {
          var canP = sa > 0, canN = sb + 1 < S.length;
          if (!canP && !canN) break;
          var nHi = canN ? sentEnd(S, sb + 1, text) : 0, pLo = canP ? S[sa - 1] : 0;
          var nHit = canN && hitsIn(M, S[sb + 1], nHi), pHit = canP && hitsIn(M, pLo, S[sa]);
          var preferN = canN && (nHit || !pHit);
          if (preferN && nHi - lo <= max) { sb++; hi = nHi; }
          else if (canP && hi - pLo <= max) { sa--; lo = pLo; }
          else if (canN && nHi - lo <= max) { sb++; hi = nHi; }
          else break;
          count++;
        }
        var grew = true;
        while (grew) {
          grew = false;
          if (sb + 1 < S.length) {
            var e2 = sentEnd(S, sb + 1, text);
            if (hitsIn(M, S[sb + 1], e2) && e2 - lo <= max) { sb++; hi = e2; grew = true; }
          }
          if (sa > 0 && hitsIn(M, S[sa - 1], S[sa]) && hi - S[sa - 1] <= max) { sa--; lo = S[sa]; grew = true; }
        }
      }
    }
    while (lo < hi && /\s/.test(text.charAt(lo))) lo++;
    var parts = [{ a: lo, b: hi, cutL: cutL, cutR: cutR }];
    var used = (hi - lo) + (cutL ? 2 : 0) + (cutR ? 2 : 0);
    var covered = maskIn(M, lo, hi);
    if (win && CQ.n > 1 && (covered & CQ.full) !== CQ.full) {
      var best = null;
      for (var s = 0; s < S.length; s++) {
        var a = S[s], b = sentEnd(S, s, text);
        if (b - a > 220 || (a < hi && b > lo)) continue;
        var m2 = maskIn(M, a, b), gain = popcount(m2 & ~covered);
        if (!gain) continue;
        var tot = popcount(m2);
        if (!best || gain > best.gain || (gain === best.gain && tot > best.tot)) best = { a: a, b: b, gain: gain, tot: tot };
      }
      if (best && used + 3 + (best.b - best.a) <= cap) parts.push({ a: best.a, b: best.b, cutL: false, cutR: false });
    }
    parts.sort(function (x, y) { return x.a - y.a; });
    var html = "";
    parts.forEach(function (p, k) {
      if (k > 0) html += " … ";
      else if (p.cutL) html += "… ";
      html += spansHtml(text, M.spans, p.a, p.b);
      if (k === parts.length - 1 && p.cutR) html += " …";
    });
    return { html: html, whole: false, len: used };
  }
  /* fullPage(I, d, CQ) → { html, marks }: the page in paragraphs with every match marked */
  function fullPage(I, d, CQ) {
    var text = docText(I, d), M = matchInfo(I.D, I.docs[d].tk, CQ);
    var P = docParas(I, d), html = "";
    for (var k = 0; k < P.length; k++) html += "<p>" + spansHtml(text, M.spans, P[k][0], P[k][1]) + "</p>";
    return { html: html, marks: M.spans.length };
  }

  /* ========================================================== §F on-page === */
  var GLOSSARY = { name: "Components", section: "#aid-comp .aid-comp-set", title: ".aid-comp-set-name", units: ".aid-comp-item",
                   kind: "glossary", revealable: "#aid-comp-body, .aid-comp-set, .aid-comp-item", stray: false };
  var PRESETS = {
    factory: [
      { name: "Setup", section: "#setup .step", title: ".step-head h4", num: ".step-num", body: ".step-text", cite: ".src-line" },
      { name: "Reference", section: "#reference > details.ref", title: "summary", body: ".ref-body", cite: ".ref-body > .src-line" },
      GLOSSARY
    ],
    detail: [
      { name: "Setup", section: "#detail .steps ol.ustep > li", title: ".st", num: ".snum", body: ".sd", cite: ".ssrc" },
      { name: "How to play", section: "#detail .htp-sec", title: "h5" },
      { name: "Locations", section: "#detail .loc-board", title: "h5" },
      { name: "FAQ", section: "#detail details.faq-item", title: "summary", body: ".faq-a" },
      { name: "Reference", section: "#detail .reference", title: "h3", units: "tbody tr, .ref-notes li" },
      GLOSSARY
    ]
  };
  var GROUP_DEF = { units: "li, p, tr, dd, figcaption, blockquote", sub: "h4, h5, h6, dt, details > summary",
                    strip: ".tag, .etag, .rs-badge, .cc-flag", exclude: ".src-line, .ssrc", stray: true };
  var BLOCK = new Set(("address article aside blockquote dd details div dl dt fieldset figcaption figure footer form h1 h2 h3 h4 " +
    "h5 h6 header hr li main nav ol p pre section summary table tbody td tfoot th thead tr ul caption").split(" "));
  var SKIP = new Set("script style template noscript svg img button input select textarea canvas video audio iframe object picture".split(" "));
  var KEEP = { b: 1, strong: 1, i: 1, em: 1, sup: 1, sub: 1, small: 1, q: 1, code: 1 };
  var SPAN_OK = /^(etag|tag|tag-[\w-]+|e-[\w-]+|aid-comp-qty|rs-badge)$/;
  var DROP = "ul, ol, table, figure, img, svg, button, input, select, textarea, details, script, style, template, [aria-hidden='true'], [data-search='off']";

  function matches(el, sel) { try { return !!sel && !!el.matches && el.matches(sel); } catch (e) { return false; } }
  function isOff(el, rev) {
    if (el.hidden || el.hasAttribute("inert") || el.getAttribute("aria-hidden") === "true" || el.getAttribute("data-search") === "off")
      return !(rev && matches(el, rev));
    return false;
  }
  function blockedUp(el, rev) {
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) if (isOff(e, rev)) return true;
    return false;
  }
  /* visible text of an element without the stripped parts (tags, badges) */
  function cleanText(el, strip) {
    if (!el) return "";
    if (!strip || !el.querySelector(strip)) return squash(el.textContent);
    var c = el.cloneNode(true);
    [].forEach.call(c.querySelectorAll(strip), function (x) { x.parentNode && x.parentNode.removeChild(x); });
    return squash(c.textContent);
  }
  function hashStr(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36); }
  function leadBold(el) {
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType === 3) { if (/\S/.test(n.nodeValue)) return ""; continue; }
      if (n.nodeType !== 1) continue;
      return (n.localName === "b" || n.localName === "strong") ? squash(n.textContent) : "";
    }
    return "";
  }
  /* a header row: in <thead>, or the table's first row when every cell is a <th> */
  function headerRow(tr) {
    if (!tr || tr.localName !== "tr") return false;
    if (tr.parentElement && tr.parentElement.localName === "thead") return true;
    var table = tr.closest ? tr.closest("table") : null;
    if (!table || table.rows[0] !== tr) return false;
    var cells = [].filter.call(tr.children, function (c) { return c.localName === "td" || c.localName === "th"; });
    return cells.length > 0 && cells.every(function (c) { return c.localName === "th"; });
  }
  /* column headers for a body row, by column index (colspan aware) */
  function headersFor(tr) {
    var table = tr.closest ? tr.closest("table") : null;
    if (!table) return [];
    var hr = null;
    if (table.tHead && table.tHead.rows.length) hr = table.tHead.rows[table.tHead.rows.length - 1];
    else if (table.rows.length && headerRow(table.rows[0]) && table.rows[0] !== tr) hr = table.rows[0];
    if (!hr) return [];
    var out = [];
    [].forEach.call(hr.cells, function (c) { var t = squash(c.textContent); for (var k = 0; k < (c.colSpan || 1); k++) out.push(t); });
    return out;
  }

  /* extractUnits(groups, D): the page's rendered answers for the current configuration.
     Units are the innermost matching elements (an outer li gives only its lead-in); text sitting
     directly in a block goes to that block. Hidden, inert, aria-hidden and data-search="off" content
     is skipped unless it matches the group's revealable selector; closed <details> stay searchable. */
  function extractUnits(groups, D) {
    var t0 = now(), U = { units: [], secs: [], heads: [], els: new Set(), D: D }, order = 0;
    if (typeof document === "undefined" || !document.querySelectorAll) return U;
    (groups || []).forEach(function (g0) {
      if (!g0 || !g0.section) return;
      var g = {};
      Object.keys(GROUP_DEF).forEach(function (k) { g[k] = GROUP_DEF[k]; });
      Object.keys(g0).forEach(function (k) { if (g0[k] !== undefined) g[k] = g0[k]; });
      var secs;
      try { secs = document.querySelectorAll(g.section); } catch (e) { logErr("onPage section " + g.section, e); return; }
      [].forEach.call(secs, function (sec) {
        if (blockedUp(sec, g.revealable)) return;
        try { extractSection(sec, g); } catch (e) { logErr("onPage " + g.name, e); }
      });
    });
    function extractSection(sec, g) {
      var titleEl = g.title ? sec.querySelector(g.title) : null;
      var title = titleEl ? cleanText(titleEl, g.strip) : "";
      var numEl = g.num ? sec.querySelector(g.num) : null;
      var body = g.body ? sec.querySelector(g.body) : sec;
      var citeEl = g.cite ? sec.querySelector(g.cite) : null;
      var titleTk = tokenize(title, D, true, false);
      var S = { el: sec, g: g, body: body, title: title, titleTk: titleTk, titleIds: idSet(titleTk), num: numEl ? squash(numEl.textContent) : "",
                cite: citeEl ? squash(citeEl.textContent) : "", order: order++, units: [], len: 0,
                key: g.name + "|" + title + "|" + hashStr(squash(sec.textContent).slice(0, 400)) };
      if (g.kind === "glossary") {
        var meta = sec.querySelector(".aid-comp-set-meta");
        S.cite = meta ? squash(meta.textContent).replace(/^\d+\s+items?\s*·\s*/i, "") : "";
      }
      U.secs.push(S);
      if (!body) return;
      var titleBlock = null;
      if (titleEl && body.contains(titleEl)) {
        for (var e = titleEl; e && e !== body; e = e.parentElement) if (BLOCK.has(e.localName)) titleBlock = e;
        if (!titleBlock) titleBlock = titleEl;
      }
      var strays = new Map(), curSub = null;
      function newUnit(el, parent, stray) {
        var u = { el: el, g: g, sec: S, parent: parent, buf: [], sub: curSub, stray: !!stray, order: order++,
                  lead: parent ? squash(parent.buf.join("")) : "", leadKind: parent ? "parent" : "" };
        if (el.localName === "tr") { var hs = headersFor(el); if (hs.length) { u.lead = squash(hs.join(" ")); u.leadKind = "header"; } }
        S.units.push(u);
        return u;
      }
      function strayFor(blockEl) {
        var u = strays.get(blockEl);
        if (!u) { u = newUnit(blockEl, null, true); strays.set(blockEl, u); }
        return u;
      }
      function visit(node, unit, blockEl) {
        for (var ch = node.firstChild; ch; ch = ch.nextSibling) {
          if (ch.nodeType === 3) {
            var v = ch.nodeValue;
            if (!v) continue;
            if (unit) unit.buf.push(v);
            else if (g.stray && /\S/.test(v)) strayFor(blockEl).buf.push(v);
            continue;
          }
          if (ch.nodeType !== 1) continue;
          var tag = ch.localName;
          if (SKIP.has(tag) || ch === titleBlock || isOff(ch, g.revealable) || (g.exclude && matches(ch, g.exclude))) continue;
          if (tag === "tr" && headerRow(ch)) continue;          // column labels: context for the body rows, not answers
          if (tag === "br") { if (unit) unit.buf.push(" "); else if (strays.has(blockEl)) strays.get(blockEl).buf.push(" "); continue; }
          if (g.sub && matches(ch, g.sub) && !matches(ch, g.units)) {
            var ht = cleanText(ch, g.strip);
            if (ht) {
              var htk = tokenize(ht, D, true, false);
              curSub = { el: ch, text: ht, tk: htk, ids: idSet(htk), sec: S, order: order++, first: null,
                         key: g.name + "|" + title + "|h|" + ht };
              U.heads.push(curSub);
            }
            continue;
          }
          var saved = curSub;
          /* the text before and after a nested unit or block reads as two words, never "bag:Place" (v1.1) */
          var gap = function () { if (unit) unit.buf.push(" "); else if (strays.has(blockEl)) strays.get(blockEl).buf.push(" "); };
          if (matches(ch, g.units)) {
            gap();
            var u = newUnit(ch, unit, false);
            visit(ch, u, ch);
            curSub = saved;
            gap();
            continue;
          }
          var isBlock = BLOCK.has(tag), chip = !isBlock && typeof ch.className === "string" && /\S/.test(ch.className);
          if (isBlock || chip) gap();
          visit(ch, unit, unit ? blockEl : (isBlock ? ch : blockEl));
          if (isBlock || chip) gap();
          if (isBlock) curSub = saved;          // a sub-heading's scope ends with its parent element
        }
      }
      visit(body, null, body);
      S.units = S.units.filter(function (u) {
        u.text = squash(u.buf.join(""));
        u.buf = null;
        if (!u.text) return false;
        u.tk = tokenize(u.text, D, true, false);
        u.ids = idSet(u.tk);
        u.len = u.text.length;
        var ctx = [u.sub ? u.sub.text : "", u.lead].join(" ");
        u.ctxIds = idSet(tokenize(ctx, D, true, false));
        if (u.leadKind === "header") u.headIds = idSet(tokenize(u.lead, D, true, false));
        S.titleIds.forEach(function (x) { u.ctxIds.add(x); });
        var lb = leadBold(u.el);
        if (lb && !u.stray) { u.leadIds = idSet(tokenize(lb, D, true, false)); u.leadLen = lb.length; }
        if (g.kind === "glossary") {
          var nm = u.el.querySelector(".aid-comp-name"), q = nm && nm.querySelector(".aid-comp-qty");
          var name = nm ? squash(nm.textContent.replace(q ? q.textContent : "", "")) : "";
          u.nameIds = idSet(tokenize(name, D, true, false));
          var src = u.el.querySelector(".aid-comp-src");
          if (src) u.cite = squash(src.textContent);
        }
        u.key = g.name + "|" + title + "|" + hashStr(u.text);
        if (u.sub && !u.sub.first) u.sub.first = u;
        S.len += u.len;
        U.els.add(u.el);
        return true;
      });
      S.first = S.units[0] || null;
      S.units.forEach(function (u) { U.units.push(u); });
    }
    U.ms = now() - t0;
    return U;
  }

  /* answer(U, CQ) → { list:[Answer], total }. A unit answers when its own text has at least one term and
     its own text plus its context (title, sub-heading, lead-in) has every term. Sections and sub-headings
     whose title has every term answer too ("open this section"). */
  function answer(U, CQ) {
    var n = CQ.n, res = [];
    if (!U || !n) return { list: [], total: 0 };
    function maskOf(ids) {
      var m = 0;
      if (!ids || !ids.size) return 0;
      CQ.terms.forEach(function (t, ti) {
        var hit = false;
        t.alts.forEach(function (w, id) { if (!hit && ids.has(id)) hit = true; });
        if (hit) m |= 1 << ti;
      });
      return m;
    }
    /* a title or heading that IS the topic: every content word in it is a query word ("The Arborec" for "arborec") */
    function exact(tk) {
      var any = false;
      for (var j = 0; j < tk.n; j++) {
        var id = tk.id[j];
        if (id === NONE || !U.D || U.D.stop[id]) continue;
        if (!CQ.termOf.has(id)) return false;
        any = true;
      }
      return any;
    }
    var tmask = new Map(), tphrase = new Map(), answered = new Set();
    U.secs.forEach(function (S) { tmask.set(S, maskOf(S.titleIds)); tphrase.set(S, phraseRuns(S.titleTk, CQ, true).length ? 1 : 0); });
    U.units.forEach(function (u) {
      var own = maskOf(u.ids);
      if (!own) return;
      var all = own | maskOf(u.ctxIds);
      if (all !== CQ.full) return;
      answered.add(u.sec); if (u.sub) answered.add(u.sub);
      if (u.headIds) own |= maskOf(u.headIds);        // a table row: its column labels count like its own text
      var po = phraseRuns(u.tk, CQ, true).length ? 1 : 0, tm = tmask.get(u.sec) || 0, pos = [], term = [];
      for (var j = 0; j < u.tk.n; j++) { var t = CQ.termOf.get(u.tk.id[j]); if (t) { pos.push(j); term.push(t.ti); } }
      var w = n > 1 ? tightest(pos, term, n) : null, prox = w && w.d >= 2 ? (w.d - 1) / (1 + w.span / 5) / (n - 1) : 0;
      if (u.headIds && n > 1) prox = Math.max(prox, (popcount(own) - 1) / 1.2 / (n - 1));   // a row's label and its column header sit together
      var len = u.headIds ? u.len + u.lead.length : u.len;                                     // a row reads with its column labels
      var s = 4 * po + 2 * (tphrase.get(u.sec) || 0) + 3 * popcount(own) / n + (popcount(all | own) - popcount(own)) / n +
              1.5 * popcount(tm) / n + 0.5 / (1 + len / 280) * Math.min(1, len / 60) +       // label-length units aren't answers
              1.5 * prox +                                                                     // the words close together ("Seal a closed gate")
              0.2 * Math.min(3, Math.max(0, pos.length - popcount(maskOf(u.ids))));           // a bullet that keeps returning to the term
      if (u.nameIds && maskOf(u.nameIds) === CQ.full) s += 2;            // a glossary item named by the query
      if (u.leadIds && u.len - u.leadLen >= 30 && maskOf(u.leadIds) === CQ.full) s += 1.5;   // a bullet that leads with the term ("<b>Retreat</b> — …")
      res.push({ kind: "unit", u: u, sec: u.sec, s: s, order: u.order, key: u.key, el: u.el });
    });
    /* sections and sub-headings named by the query: "open this section". One whose title only mentions the
       term is left out when a bullet from it already answers (that bullet is the better card). */
    U.secs.forEach(function (S) {
      if (S.g.kind === "glossary" || tmask.get(S) !== CQ.full) return;
      var ex = exact(S.titleTk);
      if (!ex && answered.has(S)) return;
      var s = 2 * (tphrase.get(S) || 0) + 1 + 1.5 + 0.5 / (1 + S.len / 280) + 1 + (ex ? 2 : 0);
      res.push({ kind: "section", sec: S, s: s, order: S.order, key: S.key, el: S.el, first: S.first });
    });
    U.heads.forEach(function (h) {
      if (maskOf(h.ids) !== CQ.full) return;
      var ex = exact(h.tk);
      if (!ex && answered.has(h)) return;
      var s = 2 * (phraseRuns(h.tk, CQ, true).length ? 1 : 0) + 1 + 1.5 * popcount(tmask.get(h.sec) || 0) / n + 1.5 + 0.5 + (ex ? 2 : 0);
      res.push({ kind: "heading", sec: h.sec, head: h, s: s, order: h.order, key: h.key, el: h.el, first: h.first });
    });
    /* a section or heading card shows its first bullet: when that bullet also answers on its own, keep one card */
    var shownFirst = new Map();
    res.forEach(function (r) { if (r.kind !== "unit" && r.first) shownFirst.set(r.first, r); });
    res = res.filter(function (r) {
      if (r.kind !== "unit" || !shownFirst.has(r.u)) return true;
      var hd = shownFirst.get(r.u);
      if (r.s > hd.s) hd.s = r.s;
      return false;
    });
    res.sort(function (a, b) { return b.s - a.s || a.order - b.order; });
    /* at most 2 per section in the first 5 (the whole Components glossary counts as one section) */
    var first = [], rest = [], per = new Map();
    res.forEach(function (r) {
      var sk = r.sec.g.kind === "glossary" ? r.sec.g : r.sec, k = per.get(sk) || 0;
      if (first.length < 5 && k < 2) { first.push(r); per.set(sk, k + 1); } else rest.push(r);
    });
    var all = first.concat(rest);
    return { list: all.slice(0, 30), total: all.length };
  }

  /* ---- answer display: a sanitized copy of the unit, with marks ---- */
  /* segments: {t:text} | {o:tag, cls?} | {c:tag} | {br:1}; nested lists, tables, figures, images, buttons,
     details, other units and the citation line are left out; links and other wrappers are unwrapped */
  function segsOf(el, g, U) {
    var segs = [];
    function walk(node) {
      for (var ch = node.firstChild; ch; ch = ch.nextSibling) {
        if (ch.nodeType === 3) { segs.push({ t: ch.nodeValue }); continue; }
        if (ch.nodeType !== 1) continue;
        var tag = ch.localName;
        if ((U && U.els.has(ch)) || matches(ch, DROP) || (g.exclude && matches(ch, g.exclude)) || matches(ch, g.units)) {
          /* a left-out list, table or nested answer still separates the text around it (v1.1) */
          segs.push(BLOCK.has(tag) || (U && U.els.has(ch)) || matches(ch, g.units) ? { blk: 1 } : { t: " " });
          continue;
        }
        if (tag === "br") { segs.push({ br: 1 }); continue; }
        if (KEEP[tag]) { segs.push({ o: tag }); walk(ch); segs.push({ c: tag }); continue; }
        if (tag === "span" && typeof ch.className === "string" && /\S/.test(ch.className) &&
            ch.className.trim().split(/\s+/).every(function (c) { return SPAN_OK.test(c); })) {
          /* a kept chip (tag, count badge) is spaced from its neighbours: "22 Monster figures", not "22Monster" */
          segs.push({ t: " " }, { o: "span", cls: ch.className.trim().replace(/\s+/g, " ") }); walk(ch); segs.push({ c: "span" }, { t: " " }); continue;
        }
        if (BLOCK.has(tag)) { segs.push({ blk: 1 }); walk(ch); segs.push({ blk: 1 }); continue; }
        var chip = typeof ch.className === "string" && /\S/.test(ch.className);
        if (chip) segs.push({ t: " " });
        walk(ch);
        if (chip) segs.push({ t: " " });
      }
    }
    if (el.localName === "tr") {
      var heads = headersFor(el), col = 0;
      [].forEach.call(el.cells || [], function (cell) {
        var span = cell.colSpan || 1, hs = heads.slice(col, col + span).filter(function (x, i, a) { return x && a.indexOf(x) === i; });
        col += span;
        var before = segs.length;
        walk(cell);
        var inner = segs.splice(before);
        if (!squash(inner.map(function (s) { return s.t || ""; }).join(""))) return;
        if (before > 0) segs.push({ t: " · " });
        if (hs.length) { segs.push({ o: "b" }, { t: hs.join(" / ") }, { c: "b" }, { t: ": " }); }
        if (cell.localName === "th" && !hs.length) { segs.push({ o: "b" }); segs.push.apply(segs, inner); segs.push({ c: "b" }); }
        else segs.push.apply(segs, inner);
      });
    } else walk(el);
    /* tidy: collapse whitespace, turn block boundaries into single line breaks, drop leading/trailing breaks */
    var out = [], pendingBr = false;
    segs.forEach(function (s) {
      if (s.blk || s.br) { pendingBr = true; return; }
      if (s.t !== undefined) {
        var t = s.t.replace(/\s+/g, " ");
        if (!t) return;
        if (pendingBr) {
          if (out.some(function (x) { return x.t !== undefined && /\S/.test(x.t); })) { if (/\S/.test(t)) { out.push({ br: 1 }); pendingBr = false; } }
          else pendingBr = false;
        }
        out.push({ t: t });
        return;
      }
      out.push(s);
    });
    for (var i = 0; i < out.length; i++) if (out[i].t !== undefined) { out[i].t = out[i].t.replace(/^\s+/, ""); if (out[i].t) break; }
    for (i = out.length - 1; i >= 0; i--) if (out[i].t !== undefined) { out[i].t = out[i].t.replace(/\s+$/, ""); if (out[i].t) break; }
    return out;
  }
  function segsHtml(segs, D, CQ) {
    var flat = "", k;
    for (k = 0; k < segs.length; k++) flat += segs[k].t !== undefined ? segs[k].t : (segs[k].br ? " " : "");
    var spans = CQ ? matchInfo(D, tokenize(flat, D, false, false), CQ, false).spans : [];
    var html = "", pos = 0, si = 0;
    for (k = 0; k < segs.length; k++) {
      var sg = segs[k];
      if (sg.t !== undefined) {
        var t = sg.t, a = pos, b = pos + t.length, x = 0;
        while (x < t.length) {
          var abs = a + x;
          while (si < spans.length && spans[si][1] <= abs) si++;
          var sp = spans[si];
          if (sp && sp[0] <= abs) { var e = Math.min(b, sp[1]) - a; html += "<mark>" + esc(t.slice(x, e)) + "</mark>"; x = e; }
          else { var nx = sp ? Math.min(b, sp[0]) - a : t.length; html += esc(t.slice(x, nx)); x = nx; }
        }
        pos = b;
      } else if (sg.br) { html += "<br>"; pos += 1; }
      else if (sg.o) html += sg.o === "span" ? "<span class=\"" + esc(sg.cls) + "\">" : "<" + sg.o + ">";
      else if (sg.c) html += "</" + sg.c + ">";
    }
    return html;
  }
  function answerHtml(ans, D, CQ, U) {
    var u = ans.kind === "unit" ? ans.u : ans.first;
    if (!u || !u.el) return "";
    return segsHtml(segsOf(u.el, u.g, U), D, CQ);
  }

  /* ============================================================ §G reveal === */
  function reducedMotion() {
    try { return !!(G.matchMedia && G.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; }
  }
  /* how much of the viewport's top the page's sticky bars cover once docked: the lowest docked bottom edge
     (a jump-nav docked under a sticky topbar has top = the topbar's height) */
  function stickyHeight(sel) {
    if (!sel) return 0;
    var h = 0;
    try {
      [].forEach.call(document.querySelectorAll(sel), function (el) {
        var cs = getComputedStyle(el);
        if (cs.position !== "sticky" && cs.position !== "fixed") return;
        h = Math.max(h, (parseFloat(cs.top) || 0) + el.getBoundingClientRect().height);
      });
    } catch (e) { /* none */ }
    return h;
  }
  function scrollGap() { return stickyHeight((S.R || {}).sticky) + Math.min(96, (G.innerHeight || 800) * 0.15); }
  function scrollToEl(el, instant) {
    var top = el.getBoundingClientRect().top + (G.pageYOffset || document.documentElement.scrollTop || 0) - scrollGap();
    var root = document.documentElement, was = root.style.scrollBehavior;
    if (instant) root.style.scrollBehavior = "auto";       // a page's `html { scroll-behavior: smooth }` would animate it
    try { G.scrollTo({ top: Math.max(0, top), behavior: instant || reducedMotion() ? "auto" : "smooth" }); }
    catch (e) { G.scrollTo(0, Math.max(0, top)); }
    if (instant) root.style.scrollBehavior = was;
  }
  /* once the scroll has settled, put the target back where it was meant to land if the page moved under it
     (lazy images loading above it during a smooth scroll: BSG's Combat panel grows 700 px), and restart its
     highlight so it runs from arrival, not from the click. Once only, and never after the reader has scrolled,
     clicked or typed. (v1.1) */
  function settleOn(el, flashEl) {
    var token = ++S.jumpToken, last = -1, same = 0, ticks = 0, touched = false, EV = ["wheel", "touchstart", "keydown", "mousedown"];
    var mark = function () { touched = true; };
    var done = function () { EV.forEach(function (t) { G.removeEventListener(t, mark, true); }); };
    EV.forEach(function (t) { G.addEventListener(t, mark, true); });
    var tick = function () {
      if (token !== S.jumpToken || touched) return done();
      var y = G.pageYOffset || 0;
      same = y === last ? same + 1 : 0;
      last = y;
      if (same < 3 && ++ticks < 40) return void setTimeout(tick, 100);
      done();
      if (el.isConnected && Math.abs(el.getBoundingClientRect().top - scrollGap()) > 24) scrollToEl(el, true);
      if (flashEl && flashEl.isConnected) flash(flashEl);
    };
    setTimeout(tick, 150);
  }
  function flash(el) {
    var col = "";
    try { col = S.out ? getComputedStyle(S.out).getPropertyValue("--s-flash").trim() : ""; } catch (e) { /* none */ }
    if (S.flashEl && S.flashEl !== el) { S.flashEl.classList.remove("aid-srch-flash"); S.flashEl.style.removeProperty("--aid-srch-flash"); }
    if (col) el.style.setProperty("--aid-srch-flash", col);
    el.classList.remove("aid-srch-flash");
    void el.offsetWidth;
    el.classList.add("aid-srch-flash");
    S.flashEl = el;
    clearTimeout(S.flashT);
    S.flashT = setTimeout(function () { el.classList.remove("aid-srch-flash"); el.style.removeProperty("--aid-srch-flash"); }, 2200);
  }
  function removeBack() { if (S.back && S.back.parentNode) S.back.parentNode.removeChild(S.back); S.back = null; }
  /* the "Back to search results" button goes where it reads naturally: at the end of a unit, at the top of an
     opened section's body, right after a heading — and for a table row, right after the table (a row's last
     cell can sit off-screen in a table that scrolls sideways on a phone) */
  function backLink(el, key, ans) {
    removeBack();
    var host = el, first = false, after = false;
    if (ans && ans.kind === "section" && ans.sec && ans.sec.body && ans.sec.body !== el) { host = ans.sec.body; first = el.localName === "details"; }
    else if (el.localName === "tr") {
      var tbl = el.closest ? el.closest("table") : null;
      host = tbl || el; after = true;
      for (var p = tbl && tbl.parentElement; p && p !== document.body; p = p.parentElement) {
        var ox = getComputedStyle(p).overflowX;
        if (ox === "auto" || ox === "scroll") { host = p; break; }
        if (BLOCK.has(p.localName) && p.localName !== "div") break;
      }
    }
    else if (el.localName === "details") { host = el.querySelector("summary + *") || el; first = true; }
    else if (/^(h[1-6]|summary)$/.test(el.localName)) after = true;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "aid-srch aid-srch-back";
    b.setAttribute("data-search", "off");
    b.textContent = "Back to search results";
    b.addEventListener("click", function () {
      removeBack();
      var show = null;
      if (S.out) [].some.call(S.out.querySelectorAll(".aid-srch-answer"), function (c) {
        if (c.getAttribute("data-key") === key) { show = c.querySelector(".aid-srch-show"); return true; }
        return false;
      });
      var target = show || S.input;
      if (target) { scrollToEl(target); settleOn(target); try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); } }
    });
    if (after && host.parentNode) host.parentNode.insertBefore(b, host.nextSibling);
    else if (first) host.insertBefore(b, host.firstChild);
    else host.appendChild(b);
    S.back = b;
    return b;
  }
  function refind(ans) {
    S.gen++;
    var U = ensureUnits();
    if (!U) return null;
    var pools = [U.units, U.secs, U.heads];
    for (var p = 0; p < pools.length; p++) for (var i = 0; i < pools[p].length; i++) if (pools[p][i].key === ans.key) return pools[p][i].el;
    return null;
  }
  /* jump(answer): open what hides it (closed <details>, the Components glossary and its filter),
     scroll it into view below any sticky bar, flash it, focus it and offer "Back to search results" */
  function jump(ans) {
    var R = S.R || {}, el = ans.el;
    removeBack();                      // a leftover Back button above the target would shift it after the scroll (v1.1)
    if (!el || !el.isConnected) {
      el = refind(ans);
      if (!el) { run("stale"); return null; }
    }
    if (isFn(R.reveal)) { try { R.reveal(el); } catch (e) { logErr("reveal", e); } }
    for (var e = el; e; e = e.parentElement) if (e.localName === "details" && !e.open) e.open = true;
    var comp = el.closest ? el.closest("#aid-comp") : null;
    if (comp) {
      var body = document.getElementById("aid-comp-body");
      if (body && body.hidden) { var tg = document.getElementById("aid-comp-toggle"); if (tg) tg.click(); }
      var hid = false;
      for (var anc = el; anc && anc !== comp; anc = anc.parentElement) if (anc.hidden) hid = true;
      if (hid) {
        var f = comp.querySelector(".aid-comp-filter input, input[type=search]");
        if (f) { f.value = ""; f.dispatchEvent(new Event("input", { bubbles: true })); }
      }
    }
    var focusEl = el.localName === "details" ? (el.querySelector("summary") || el) : el;
    scrollToEl(focusEl);
    settleOn(focusEl, el);
    flash(el);
    if (!focusEl.hasAttribute("tabindex") && !/^(a|button|input|select|textarea|summary)$/.test(focusEl.localName)) {
      focusEl.setAttribute("tabindex", "-1");
      var rm = function () { focusEl.removeAttribute("tabindex"); focusEl.removeEventListener("blur", rm); };
      focusEl.addEventListener("blur", rm);
    }
    try { focusEl.focus({ preventScroll: true }); } catch (x) { focusEl.focus(); }
    backLink(el, ans.key, ans);
    S.lastJump = { key: ans.key, el: el, focus: focusEl, at: Date.now() };
    return el;
  }

  /* ============================================================ §H render === */
  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : many); }
  function defaultLoc(pg) {
    return (pg.p == null || pg.p === "") ? (pg.sec || "") : /^\d/.test(String(pg.p)) ? "p." + pg.p : String(pg.p);
  }
  function labelOf(pg) {
    var L = { book: String(pg.b == null ? "" : pg.b), loc: defaultLoc(pg), tag: null, badge: null };
    var R = S.R || {};
    if (isFn(R.label)) {
      try {
        var x = R.label(pg);
        if (x && typeof x === "object") Object.keys(x).forEach(function (k) { if (x[k] !== undefined) L[k] = x[k]; });
      } catch (e) { logErr("label", e); }
    }
    return L;
  }
  function cardClass(pg) {
    var R = S.R || {};
    if (!isFn(R.cardClass)) return "";
    try { return String(R.cardClass(pg) || "").trim(); } catch (e) { logErr("cardClass", e); return ""; }
  }
  function call(f, c, dflt) {
    if (!isFn(f)) return dflt;
    try { var v = f(c); return v == null ? dflt : String(v); } catch (e) { logErr("hook", e); return dflt; }
  }
  function headTag(level) { return "h" + Math.min(6, Math.max(2, level)); }

  function setStatus(text, kind) {
    var R = S.R || {}, rs = R.skin === "rs";
    var st = S.status;
    if (!st || st.parentNode !== S.out) {
      st = h(rs ? "div" : "p");
      st.setAttribute("role", "status");
      S.out.insertBefore(st, S.out.firstChild);
      S.status = st;
    }
    var cls = (rs ? (kind === "count" ? "rs-count" : "rs-hint") : "rhint") + " aid-srch-status" + (kind === "count" ? " is-count" : "");
    if (st.className !== cls) st.className = cls;
    if (st.textContent !== text) st.textContent = text;
  }
  function clearResults() {
    var out = S.out;
    for (var n = out.firstChild; n;) { var nx = n.nextSibling; if (n !== S.status) out.removeChild(n); n = nx; }
  }
  function groupHead(level, label, count) {
    var hd = h(headTag(level), "aid-srch-h");
    hd.appendChild(document.createTextNode(label + " "));
    hd.appendChild(h("span", "aid-srch-count", count));
    return hd;
  }
  function showButton(label) {
    var b = h("button", "aid-srch-show", "Show");
    b.type = "button";
    b.setAttribute("aria-label", "Show on the page: " + label);
    return b;
  }
  function moreButton(text) { var b = h("button", "aid-srch-more", text); b.type = "button"; return b; }
  function focusCard(card) { if (!card) return; card.setAttribute("tabindex", "-1"); try { card.focus({ preventScroll: false }); } catch (e) { card.focus(); } }

  function ctxLine(ans) {
    var sec = ans.sec, u = ans.u, parts = sec.g.name + ": ";
    if (sec.num) parts += "Step " + sec.num + " · ";
    parts += sec.title || "";
    if (ans.kind === "heading") parts += " › " + ans.head.text;
    else if (u) {
      if (u.sub) parts += " › " + u.sub.text;
      if (u.lead && u.leadKind === "parent") {
        var ld = u.lead.replace(/[:—–\-\s]+$/, "");
        if (ld.length > 70) ld = ld.slice(0, 68).replace(/\s+\S*$/, "") + "…";
        if (ld) parts += " › " + ld;
      }
    }
    return parts;
  }
  function answerTitle(ans) { return ans.kind === "heading" ? ans.head.text : (ans.sec.title || ans.sec.g.name); }
  function answerCite(ans) { return (ans.u && ans.u.cite) || ans.sec.cite || ""; }

  function answerCard(ans, model) {
    var rs = model.rs, card, sum;
    if (rs) { card = h("div", "rs-item aid-srch-answer"); sum = h("div", "rs-sum aid-srch-sum"); card.appendChild(sum); }
    else { card = h("div", "rhit aid-srch-answer"); sum = card; }
    card.setAttribute("data-key", ans.key);
    card.setAttribute("data-kind", ans.kind);
    sum.appendChild(h("div", rs ? "rs-meta aid-srch-ctx" : "rhit-src aid-srch-ctx", ctxLine(ans)));
    var html = answerHtml(ans, model.I.D, model.CQ, model.U);
    if (html) { var body = h("div", (rs ? "rs-snip" : "rhit-text") + " aid-srch-unit"); body.innerHTML = html; sum.appendChild(body); }
    var foot = h("div", "aid-srch-foot"), cite = answerCite(ans);
    if (cite) foot.appendChild(h("span", "aid-srch-cite", cite));
    var btn = showButton(answerTitle(ans));
    btn.addEventListener("click", function () { jump(ans); });
    foot.appendChild(btn);
    sum.appendChild(foot);
    return card;
  }
  function onPageGroup(model) {
    var A = model.ans, lvl = model.level, sec = h("section", "aid-srch-group aid-srch-onpage");
    sec.setAttribute("aria-label", "On this page");
    sec.appendChild(groupHead(lvl, "On this page", A.total > 30 ? "30+" : String(A.total)));
    var list = h("div", "aid-srch-list");
    sec.appendChild(list);
    var shown = Math.min(A.list.length, S.view.onpage);
    for (var k = 0; k < shown; k++) list.appendChild(answerCard(A.list[k], model));
    if (A.list.length > shown) {
      var more = moreButton("");
      var label = function () {
        var left = A.list.length - S.view.onpage;
        more.textContent = "Show " + Math.min(10, left) + " more on this page";
      };
      label();
      more.addEventListener("click", function () {
        var from = S.view.onpage, to = Math.min(A.list.length, from + 10), firstNew = null;
        for (var k2 = from; k2 < to; k2++) { var c = answerCard(A.list[k2], model); list.appendChild(c); if (!firstNew) firstNew = c; }
        S.view.onpage = to;
        if (to >= A.list.length) more.parentNode.removeChild(more); else label();
        focusCard(firstNew);
      });
      sec.appendChild(more);
    }
    return sec;
  }

  /* "Read the whole page": built lazily on first open; Next/Previous match move .is-current and scroll the box */
  function fullView(model, a, L, container, rs) {
    var full = fullPage(model.I, a.i, model.CQ);
    var nav = h("div", "aid-srch-nav");
    var pos = h("span", "aid-srch-pos");
    var prev = h("button", "aid-srch-prev", "Previous match"), next = h("button", "aid-srch-next", "Next match");
    prev.type = next.type = "button";
    nav.appendChild(pos); nav.appendChild(prev); nav.appendChild(next);
    var box = h("div", (rs ? "" : "rhit-text ") + "aid-srch-full");
    if (rs) box = container;
    box.setAttribute("tabindex", "0");
    box.setAttribute("role", "region");
    box.setAttribute("aria-label", (L.book + " " + (L.loc || "")).trim() + ", full text");
    var textBox = h("div", "aid-srch-fulltext");
    textBox.innerHTML = full.html;
    if (rs) { box.appendChild(nav); box.appendChild(textBox); }
    else { container.appendChild(nav); box.appendChild(textBox); container.appendChild(box); }
    var marks = textBox.querySelectorAll("mark"), cur = 0;
    function show(k, scroll) {
      if (!marks.length) { pos.textContent = "No matches"; prev.disabled = next.disabled = true; return; }
      cur = (k + marks.length) % marks.length;
      [].forEach.call(marks, function (m, i) { m.classList.toggle("is-current", i === cur); });
      pos.textContent = "Match " + (cur + 1) + " of " + marks.length;
      prev.disabled = next.disabled = marks.length < 2;
      if (scroll) {
        var m = marks[cur], top = 0;
        for (var e = m; e && e !== box; e = e.offsetParent) top += e.offsetTop;
        if (rs) top -= nav.offsetHeight;
        box.scrollTop = Math.max(0, top - box.clientHeight * 0.3);
      }
    }
    prev.addEventListener("click", function () { show(cur - 1, true); });
    next.addEventListener("click", function () { show(cur + 1, true); });
    show(0, false);
    return { box: box, first: function () { show(0, true); } };
  }

  function hitCard(T, a, model) {
    var I = model.I, pg = I.entries[a.i], L = labelOf(pg), rs = model.rs, cc = cardClass(pg);
    var nTxt = plural(a.count, "match", "matches");
    var sn = snippet(I, a.i, model.CQ, {});
    var card;
    if (rs) {
      card = h("details", "rs-item aid-srch-hit" + (cc ? " " + cc : ""));
      var sum = h("summary", "rs-sum"), meta = h("div", "rs-meta");
      if (L.tag && L.tag.text) meta.appendChild(h("span", L.tag.cls || "etag", L.tag.text));
      if (L.badge && L.badge.text) meta.appendChild(h("span", L.badge.cls || "rs-badge", L.badge.text));
      meta.appendChild(h("span", "rs-page", [L.book, L.loc, nTxt].filter(Boolean).join(" · ")));
      if (!sn.whole) meta.appendChild(h("span", "rs-toggle", "Read the whole page"));
      sum.appendChild(meta);
      var snip = h("div", "rs-snip aid-srch-snip");
      snip.innerHTML = sn.html;
      sum.appendChild(snip);
      card.appendChild(sum);
      if (sn.whole) { card = wrapWhole(card, sum); }
      else {
        var fullBox = h("div", "rs-full aid-srch-full"), built = null;
        card.appendChild(fullBox);
        card.addEventListener("toggle", function () {
          if (card.open) {
            S.view.open.add(a.i);
            if (!built) built = fullView(model, a, L, fullBox, true);
            built.first();
          } else S.view.open.delete(a.i);
        });
        if (S.view.open.has(a.i)) card.open = true;
      }
    } else {
      card = h("div", "rhit aid-srch-hit" + (cc ? " " + cc : ""));
      var src = h("div", "rhit-src");
      if (L.tag && L.tag.text) { src.appendChild(h("span", L.tag.cls || "tag", L.tag.text)); src.appendChild(document.createTextNode(" ")); }
      src.appendChild(document.createTextNode(L.book));
      if (L.loc) { src.appendChild(document.createTextNode(" ")); src.appendChild(h("span", "rhit-page", "— " + L.loc)); }
      if (L.badge && L.badge.text) { src.appendChild(document.createTextNode(" ")); src.appendChild(h("span", L.badge.cls || "rs-badge", L.badge.text)); }
      src.appendChild(document.createTextNode(" "));
      src.appendChild(h("span", "aid-srch-n", "· " + nTxt));
      card.appendChild(src);
      var sn2 = h("div", "rhit-text aid-srch-snip");
      sn2.innerHTML = sn.html;
      card.appendChild(sn2);
      if (!sn.whole) {
        var det = h("details", "aid-srch-page"), view = null;
        det.appendChild(h("summary", null, "Read the whole page"));
        det.addEventListener("toggle", function () {
          if (det.open) {
            S.view.open.add(a.i);
            if (!view) view = fullView(model, a, L, det, false);
            view.first();
          } else S.view.open.delete(a.i);
        });
        card.appendChild(det);
        if (S.view.open.has(a.i)) det.open = true;
      }
    }
    card.setAttribute("data-x", String(pg.x));
    card.setAttribute("data-i", String(a.i));
    return card;
  }
  /* rs skin: a page shown whole needs no expander, so it is a plain card */
  function wrapWhole(details, sum) {
    var div = h("div", details.className + " aid-srch-whole");
    var inner = h("div", "rs-sum aid-srch-sum");
    while (sum.firstChild) inner.appendChild(sum.firstChild);
    div.appendChild(inner);
    return div;
  }

  /* a group of rulebook cards with its own heading, total and paging. Each tier's full matches get one, in tier
     order; then every tier's partial matches share one "Pages with some of your words" group (v1.1: a page holding
     all your words never sits below one holding only some of them) */
  function pagesGroup(model, label, cls, list, subBase, key, show, kindCls) {
    var lvl = model.level, rs = model.rs, total = list.length;
    var sec = h("section", "aid-srch-group aid-srch-books " + kindCls + (cls ? " aid-srch-tier" : ""));
    sec.setAttribute("aria-label", label);
    if (rs && cls) {
      var head = h("div", cls + " aid-srch-tierh");
      if (/rs-divider/.test(cls)) head.appendChild(h("span", null, label)); else head.textContent = label;
      head.appendChild(document.createTextNode(" "));
      head.appendChild(h("span", "aid-srch-count", String(total)));
      sec.appendChild(head);
    } else sec.appendChild(groupHead(lvl, label, String(total)));
    var cur = Math.min(total, S.view.more[key] || num(show, model.pageSize));
    var subText = function () { return subBase + (total > cur ? " · showing " + cur : ""); };
    var sub = h(rs ? "div" : "p", (rs ? "rs-hint" : "rhint") + " aid-srch-sub", subText());
    sec.appendChild(sub);
    var box = h("div", "aid-srch-list");
    sec.appendChild(box);
    for (var k = 0; k < cur; k++) box.appendChild(hitCard(null, list[k], model));
    if (total > cur) {
      var more = moreButton("");
      var label2 = function () { var left = total - cur; more.textContent = "Show " + Math.min(model.pageSize, left) + " more (" + left + " left)"; };
      label2();
      more.addEventListener("click", function () {
        var to = Math.min(total, cur + model.pageSize), firstNew = null;
        for (var k2 = cur; k2 < to; k2++) { var c = hitCard(null, list[k2], model); box.appendChild(c); if (!firstNew) firstNew = c; }
        cur = to;
        S.view.more[key] = cur;
        sub.textContent = subText();
        if (cur >= total) more.parentNode.removeChild(more); else label2();
        focusCard(firstNew);
      });
      sec.appendChild(more);
    }
    return sec;
  }
  function bookGroups(model) {
    var res = model.res, CQ = model.CQ, out = [], partial = [], cls = "";
    res.tiers.forEach(function (T, ti) {
      if (T.cls && !cls) cls = T.cls;
      partial = partial.concat(T.partial);
      if (!T.full.length) return;
      var nf = T.full.length;
      var sub = CQ.n === 1 ? plural(nf, "page matches", "pages match") + " “" + CQ.terms[0].label + "”"
                           : plural(nf, "page contains", "pages contain") + " all your words";
      out.push(pagesGroup(model, T.label, T.cls, T.full, sub, "t" + ti, T.show, "aid-srch-full-matches"));
    });
    if (partial.length) {
      var np = partial.length;
      var sub2 = (res.full ? "" : "No page contains all your words; ") + plural(np, "page has", "pages have") + " some of them";
      out.push(pagesGroup(model, "Pages with some of your words", cls, partial, sub2, "partial", null, "aid-srch-partial"));
    }
    return out;
  }

  function render(model) {
    var R = S.R || {}, c = model.c;
    clearResults();
    if (model.kind === "hint") { setStatus(model.text, "hint"); return; }
    if (model.kind === "stop") { setStatus("Try a more specific word.", "hint"); return; }
    var A = model.ans, res = model.res, pages = res.full + res.partial;
    /* a page with its own tiers (FAQ, unofficial FAQ…) counts "pages", not "rulebook pages" (v1.1) */
    var noun = Array.isArray(R.tiers) && R.tiers.length > 1 ? ["page", "pages"] : ["rulebook page", "rulebook pages"];
    if (!A.total && !pages) {
      setStatus(call(R.noMatch, c, "No matches on this page or in the rulebooks."), "hint");
    } else {
      var bits = [];
      if (A.total) bits.push((A.total > 30 ? "30+" : A.total) + (A.total === 1 ? " answer" : " answers") + " on this page");
      if (res.full) bits.push(plural(res.full, noun[0], noun[1]));
      else if (res.partial) bits.push(plural(res.partial, noun[0], noun[1]) + " with some of your words");
      else bits.push("no " + noun[1]);
      setStatus(bits.join(" · "), "count");
      if (A.total) S.out.appendChild(onPageGroup(model));
      bookGroups(model).forEach(function (g) { S.out.appendChild(g); });
    }
    var note = call(R.note, c, "");
    if (note) S.out.appendChild(h(model.rs ? "div" : "p", (model.rs ? "rs-hint" : "rhint") + " aid-srch-note", note));
  }

  /* ========================================================= §I lifecycle === */
  var S = { R: null, input: null, out: null, status: null, q: "", qKey: null, ctx: null, gen: 0, pending: false, t: 0,
            I: null, Isrc: null, mask: null, maskKey: null, vis: null, U: null, Ukey: null,
            view: { onpage: 5, more: {}, open: new Set() }, last: null, lastJump: null, back: null, flashEl: null, flashT: 0, jumpToken: 0,
            stats: { buildMs: null, unitsMs: null, queries: [] } };

  function registration() { var R = G.AID_SEARCH; return R && typeof R === "object" ? R : null; }
  function freshView() { return { onpage: 5, more: {}, open: new Set() }; }
  function context() {
    var R = S.R || {};
    if (isFn(R.context)) { try { var c = R.context(); if (c) return c; } catch (e) { logErr("context", e); } }
    return S.ctx || {};
  }
  function indexOf(R) {
    var ix = R.index;
    if (isFn(ix)) { try { ix = ix(); } catch (e) { logErr("index", e); ix = null; } }
    return Array.isArray(ix) ? ix : [];
  }
  function ensureIndex(R) {
    R = R || S.R || registration();
    if (!R) return null;
    var ix = indexOf(R);
    if (!S.I || S.Isrc !== ix) {
      S.I = buildIndex(ix);
      S.Isrc = ix;
      S.mask = null; S.U = null;
      S.stats.buildMs = Math.round(S.I.ms * 10) / 10;
      S.stats.pages = S.I.N; S.stats.tokens = S.I.tokens; S.stats.words = S.I.D.words.length;
    }
    return S.I;
  }
  function ensureMask(I, c) {
    if (S.mask && S.maskKey === S.gen + "|" + I.N && S.maskI === I) return S.mask;
    S.vis = visibility(S.R, c);
    S.mask = maskFor(I, S.vis);
    S.maskKey = S.gen + "|" + I.N; S.maskI = I;
    return S.mask;
  }
  function groupsOf(R) {
    var op = R.onPage === undefined ? "factory" : R.onPage;
    var groups = op === false ? [] : Array.isArray(op) ? op : (PRESETS[op] || PRESETS.factory);
    if (Array.isArray(R.onPageExtra)) groups = groups.concat(R.onPageExtra);
    return groups;
  }
  function ensureUnits() {
    var R = S.R || registration(), I = S.I;
    if (!R || !I) return null;
    if (S.U && S.Ukey === S.gen && S.UI === I) return S.U;
    S.U = extractUnits(groupsOf(R), I.D);
    S.Ukey = S.gen; S.UI = I;
    S.stats.unitsMs = Math.round(S.U.ms * 10) / 10;
    S.stats.units = S.U.units.length;
    return S.U;
  }

  /* mount: idempotent; binds the input and claims the results container (older pages rebuild both
     on every configuration change, so this runs again after each aid:config) */
  function mount() {
    var R = registration();
    if (!R || typeof document === "undefined" || !document.querySelector) return false;
    var input = document.querySelector(R.input || "#rsearch"), out = document.querySelector(R.results || "#rresults");
    if (!input || !out) return false;
    if (input !== S.input) {
      bind(input);
      if (S.q && !input.value) input.value = S.q;
      S.input = input;
    }
    if (out !== S.out) {
      out.classList.add("aid-srch");
      out.removeAttribute("aria-live");
      S.out = out; S.status = null;
    }
    S.R = R;
    return true;
  }
  function bind(input) {
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("enterkeyhint", "search");
    input.addEventListener("input", function (e) {
      if (e && e.isComposing) return;
      clearTimeout(S.t);
      S.t = setTimeout(function () { safeRun("type"); }, 120);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); clearTimeout(S.t); safeRun("enter"); }
    });
  }
  function safeRun(why) { try { run(why); } catch (e) { logErr("run", e); } }

  /* run: the whole search for the input's current value and the current configuration */
  function run(why) {
    if (!mount()) return null;
    var R = S.R, q = S.input.value || "", qKey = foldQ(q), c = context(), t0 = now();
    if (qKey !== S.qKey) { S.qKey = qKey; S.view = freshView(); }
    S.q = q;
    var level = R.headingLevel === 4 ? 4 : 3, rs = R.skin === "rs", minChars = num(R.minChars, 2), pageSize = Math.max(1, num(R.pageSize, 8));
    var hint = call(R.hint, c, "Search this page and the rulebooks. Type a word, a phrase or a question.");
    var model = { c: c, level: level, rs: rs, pageSize: pageSize };
    if (qKey.length < minChars) { model.kind = "hint"; model.text = hint; render(model); S.last = { why: why, q: q, kind: "hint" }; return S.last; }
    var I = ensureIndex(R);
    var mask = ensureMask(I, c);
    var U = ensureUnits();
    var CQ = compile(q, I, R);
    if (CQ.empty) { model.kind = "hint"; model.text = hint; render(model); S.last = { why: why, q: q, kind: "hint" }; return S.last; }
    if (CQ.stopOnly) { model.kind = "stop"; render(model); S.last = { why: why, q: q, kind: "stop" }; return S.last; }
    var res = searchDocs(I, CQ, { R: R, mask: mask, vis: S.vis });
    var ans = answer(U, CQ);
    model.kind = "results"; model.I = I; model.CQ = CQ; model.res = res; model.ans = ans; model.U = U;
    render(model);
    var ms = now() - t0;
    S.stats.queries.push(Math.round(ms * 10) / 10);
    if (S.stats.queries.length > 50) S.stats.queries.shift();
    S.last = { why: why, q: q, kind: "results", CQ: CQ, res: res, ans: ans, ms: ms, rankMs: res.ms };
    return S.last;
  }

  function schedule() {
    if (S.pending) return;
    S.pending = true;
    var go = function () { S.pending = false; mount(); safeRun("config"); };
    if (typeof queueMicrotask === "function") queueMicrotask(go); else Promise.resolve().then(go);
  }
  function prebuild() {
    var go = function () { try { var R = registration(); if (R) ensureIndex(R); } catch (e) { logErr("prebuild", e); } };
    if (typeof G.requestIdleCallback === "function") G.requestIdleCallback(go, { timeout: 2000 }); else setTimeout(go, 1200);
  }
  if (typeof document !== "undefined" && document && isFn(document.addEventListener)) {
    document.addEventListener("aid:config", function (e) { S.ctx = (e && e.detail) || {}; S.gen++; schedule(); });
    var ready = function () { mount(); prebuild(); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready); else setTimeout(ready, 0);
  }

  /* ---------------------------------------------------------------- export --- */
  G.AidSearch = {
    version: VERSION,
    core: { normWord: normWord, stem: stem, tokenize: tokenize, repairText: repairText, docText: docText, sentenceStarts: sentenceStarts, paragraphs: paragraphs,
            buildIndex: buildIndex, compile: compile, searchDocs: searchDocs, snippet: snippet, fullPage: fullPage,
            extractUnits: extractUnits, answer: answer, answerHtml: answerHtml, esc: esc, foldQ: foldQ, newDict: newDict,
            STOP: STOP, defaultLoc: defaultLoc, visibility: visibility, maskFor: maskFor,
            /* the checker's one-call search: compile + rank with a visible() for context c */
            query: function (I, raw, R, c) {
              var vis = visibility(R || {}, c || {}), mask = maskFor(I, vis), CQ = compile(raw, I, R || {});
              if (CQ.empty || CQ.stopOnly) return { CQ: CQ, res: null, mask: mask, vis: vis };
              return { CQ: CQ, res: searchDocs(I, CQ, { R: R || {}, mask: mask, vis: vis }), mask: mask, vis: vis };
            } },
    presets: PRESETS,
    run: function () { return run("api"); },
    jump: jump,
    debug: {
      state: function () { return S; },
      units: function () {
        if (!S.R) mount();
        if (!S.I) ensureIndex(S.R);
        var U = ensureUnits();
        return U ? U.units.map(function (u) { return { group: u.g.name, title: u.sec.title, sub: u.sub ? u.sub.text : "", text: u.text, key: u.key }; }) : [];
      },
      last: function () { return S.last; },
      lastJump: function () { return S.lastJump; },
      stats: function () { return S.stats; }
    },
    errors: errors
  };
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
