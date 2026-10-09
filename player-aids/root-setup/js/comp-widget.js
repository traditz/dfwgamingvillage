/* =============================================================================
   Components glossary widget: the standard for every DFWGV player-aid page (v1.1).
   The same file is used unchanged on every page. Don't edit it per page.

   What it does: renders window.AID_COMPONENTS (from the page's js/components.js) into
   <div id="aid-comp">, grouped by set and filtered by the page's current configuration.
   Each component shows its rulebook picture, count and name, and optionally a short note.

   Page contract:
     1. index.html has the page's own section chrome, placed before the Rules Reference, e.g.
          <section class="…page's section classes…" id="components" aria-labelledby="comp-h" hidden>
            <h2 id="comp-h">Components</h2>
            <p class="…page's note class…">…</p>
            <div id="aid-comp"></div>
          </section>
        and loads, BEFORE js/app.js:
          <link rel="stylesheet" href="css/components.css?v=1">   (with the page's --comp-* tokens in styles.css)
          <script src="js/components.js?v=1"></script>
          <script src="js/comp-widget.js?v=1"></script>
     2. The page's app.js announces its configuration at the end of every update():
          document.dispatchEvent(new CustomEvent("aid:config", { detail: c }));
        where c is the context object the page's data.js functions receive (has(), mod(), mode, p…).

   Data format (js/components.js):
     window.AID_COMPONENTS = {
       sets: [                                   // display groups, in order
         { id: "core", name: "Base game", src: "Rules p.3", when: null },
         { id: "exp1", name: "Expansion", src: "Exp p.2", when: (c) => c.has("exp1") }
       ],
       items: [
         { set: "core", qty: "22", name: "Monster figures", note: "1 Mother Hydra, 1 Father Dagon, 20 Deep Ones",
           img: "core-monsters.webp", w: 320, h: 214, when: (c) => …optional…, src: "…optional override…" }
       ]
     };
   - set.when / item.when: optional. Omitted or null means always shown while its set is shown.
   - set.fig: optional (v1.1). The colour of that set's picture panels, e.g. "#e8dcc4". Use it when a rulebook is printed
     on a different paper colour than the page's --comp-fig, so no box shows around its pictures.
   - img: a file in images/components/ (webp, long side ≤ 320 px). w/h: its pixel size. img is optional.
   - qty, note: text exactly as the rulebook gives it. note may hold simple inline HTML (<i>, <b>).
   ============================================================================= */
(function () {
  "use strict";

  var DATA = window.AID_COMPONENTS;
  var IMG_DIR = "images/components/";
  var state = { open: false, query: "", zoom: {} };
  var lastCtx = null;
  var root = null;
  var errors = [];
  if (DATA) DATA._errors = errors;

  function ok(fn, c, what) {
    if (typeof fn !== "function") return true;
    try { return !!fn(c); } catch (e) { errors.push(what + ": " + e.message); return false; }
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  function norm(s) { return String(s || "").toLowerCase().replace(/<[^>]+>/g, "").normalize("NFD").replace(/[̀-ͯ]/g, ""); }

  // The sets and items shown for context c: [{set, items:[…]}]
  function visible(c) {
    var out = [];
    (DATA.sets || []).forEach(function (s) {
      if (!ok(s.when, c, "set " + s.id)) return;
      var items = (DATA.items || []).filter(function (it) {
        return it.set === s.id && ok(it.when, c, "item " + it.name);
      });
      if (items.length) out.push({ set: s, items: items });
    });
    return out;
  }

  function key(it) { return it.set + "|" + it.name; }

  function itemNode(it) {
    var li = el("li", "aid-comp-item" + (it.img ? "" : " no-img"));
    li.setAttribute("data-q", norm(it.name + " " + (it.note || "") + " " + (it.qty || "")));
    var k = key(it);
    if (it.img) {
      var fig = el("button", "aid-comp-fig");
      fig.type = "button";
      var z = !!state.zoom[k];
      fig.setAttribute("aria-pressed", z ? "true" : "false");
      fig.setAttribute("aria-label", (z ? "Shrink picture: " : "Enlarge picture: ") + it.name);
      var img = document.createElement("img");
      img.src = IMG_DIR + it.img;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      if (it.w && it.h) { img.width = it.w; img.height = it.h; }
      fig.appendChild(img);
      fig.addEventListener("click", function () {
        state.zoom[k] = !state.zoom[k];
        li.classList.toggle("is-zoomed", !!state.zoom[k]);
        fig.setAttribute("aria-pressed", state.zoom[k] ? "true" : "false");
        fig.setAttribute("aria-label", (state.zoom[k] ? "Shrink picture: " : "Enlarge picture: ") + it.name);
      });
      if (z) li.classList.add("is-zoomed");
      li.appendChild(fig);
    }
    var txt = el("div", "aid-comp-txt");
    var name = el("p", "aid-comp-name");
    if (it.qty) name.appendChild(el("span", "aid-comp-qty", it.qty));
    name.appendChild(document.createTextNode(it.name));
    txt.appendChild(name);
    if (it.note) {
      var note = el("p", "aid-comp-note");
      note.innerHTML = it.note;
      txt.appendChild(note);
    }
    if (it.src) txt.appendChild(el("p", "aid-comp-src", it.src));
    li.appendChild(txt);
    return li;
  }

  function applyFilter() {
    if (!root) return;
    var q = norm(state.query).trim();
    var shown = 0;
    root.querySelectorAll(".aid-comp-set").forEach(function (sec) {
      var n = 0;
      sec.querySelectorAll(".aid-comp-item").forEach(function (li) {
        var hit = !q || li.getAttribute("data-q").indexOf(q) !== -1;
        li.hidden = !hit;
        if (hit) n++;
      });
      sec.hidden = n === 0;
      shown += n;
    });
    var live = root.querySelector(".aid-comp-shown");
    if (live) live.textContent = q ? shown + (shown === 1 ? " match" : " matches") : "";
    var none = root.querySelector(".aid-comp-none");
    if (none) none.hidden = shown !== 0;
  }

  function render(c) {
    lastCtx = c;
    if (!DATA || !root) return;
    var groups = visible(c);
    var total = groups.reduce(function (a, g) { return a + g.items.length; }, 0);
    var section = document.getElementById("components");
    if (section) section.hidden = total === 0;
    root.textContent = "";
    if (!total) return;

    var bar = el("div", "aid-comp-bar");
    var btn = el("button", "aid-comp-toggle");
    btn.type = "button";
    btn.id = "aid-comp-toggle";
    btn.setAttribute("aria-controls", "aid-comp-body");
    btn.setAttribute("aria-expanded", state.open ? "true" : "false");
    btn.appendChild(el("span", "aid-comp-toggle-label", state.open ? "Hide components" : "Show components"));
    btn.appendChild(el("span", "aid-comp-count", total + (total === 1 ? " item" : " items")));
    bar.appendChild(btn);
    root.appendChild(bar);

    var body = el("div", "aid-comp-body");
    body.id = "aid-comp-body";
    body.hidden = !state.open;

    if (total > 10) {
      var tools = el("div", "aid-comp-tools");
      var lab = el("label", "aid-comp-filter");
      lab.appendChild(el("span", "aid-comp-vh", "Filter components"));
      var inp = document.createElement("input");
      inp.type = "search";
      inp.placeholder = "Filter components…";
      inp.value = state.query;
      inp.autocomplete = "off";
      inp.addEventListener("input", function () { state.query = inp.value; applyFilter(); });
      lab.appendChild(inp);
      tools.appendChild(lab);
      var live = el("span", "aid-comp-shown");
      live.setAttribute("aria-live", "polite");
      tools.appendChild(live);
      body.appendChild(tools);
    }

    groups.forEach(function (g) {
      var sec = el("section", "aid-comp-set");
      sec.setAttribute("data-set", g.set.id);
      if (g.set.fig) sec.style.setProperty("--c-fig", g.set.fig);   // per-set picture panel colour (v1.1)
      var h = el("h3", "aid-comp-set-h");
      h.appendChild(el("span", "aid-comp-set-name", g.set.name));
      var meta = g.items.length + (g.items.length === 1 ? " item" : " items") + (g.set.src ? " · " + g.set.src : "");
      h.appendChild(el("span", "aid-comp-set-meta", meta));
      sec.appendChild(h);
      var ul = el("ul", "aid-comp-grid");
      g.items.forEach(function (it) { ul.appendChild(itemNode(it)); });
      sec.appendChild(ul);
      body.appendChild(sec);
    });
    var none = el("p", "aid-comp-none", "No components match that filter.");
    none.hidden = true;
    body.appendChild(none);
    root.appendChild(body);

    btn.addEventListener("click", function () {
      state.open = !state.open;
      body.hidden = !state.open;
      btn.setAttribute("aria-expanded", state.open ? "true" : "false");
      btn.querySelector(".aid-comp-toggle-label").textContent = state.open ? "Hide components" : "Show components";
    });
    applyFilter();
  }

  document.addEventListener("aid:config", function (e) {
    if (!root) root = document.getElementById("aid-comp");
    render(e.detail || {});
  });
  // Nothing renders (the section stays hidden) until the page announces a configuration.
  document.addEventListener("DOMContentLoaded", function () {
    root = document.getElementById("aid-comp");
    if (lastCtx !== null) render(lastCtx);
  });

  // For tests and harnesses (Node or browser): the pure filtering step.
  window.AidComponents = { visible: function (c) { return DATA ? visible(c) : []; }, render: render, version: 1.1 };
})();
