/* Авто-гід 2026 — логіка сторінки. Дані: data/models.js (window.MODELS), data/content.js. */
(function () {
  "use strict";
  var DATA = window.MODELS || [];
  var PICKS = window.PICKS || [];
  var PICKS_SUV = window.PICKS_SUV || [];
  var BRANDS = window.BRANDS || [];
  var ENGINES = window.ENGINES || [];
  var GLOSSARY = window.GLOSSARY || [];

  var SEG = { A: "Міні (A)", B: "Малий хетч (B)", C: "Компакт (C)", D: "Великий / універсал (D)", "SUV-B": "Малий SUV", "SUV-C": "SUV / кросовер", "SUV-D": "Великий SUV", "4x4": "Позашляховик (4x4)", Sport: "Купе / спорт" };
  var TIER = { top: "Рекомендую", ok: "Хороша", risk: "Тільки окремі версії", avoid: "Уникай" };
  var VERD = { ok: "Брати", warn: "З нюансами", bad: "Уникай" };
  var FUEL = { P: "Petrol", D: "Diesel", H: "Hybrid" };
  var KEY = "autogid26v2";

  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function grp(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function eur(n) { return grp(n) + " €"; }
  function num(v) { return String(v).replace(".", ","); }
  function kk(a) { return num(a[0]) + "–" + num(a[1]) + " k€"; }
  function dots(r) { var h = ""; for (var i = 1; i <= 5; i++) h += '<b class="' + (i <= r ? "f" : "") + '"></b>'; return '<span class="dots" role="img" aria-label="надійність ' + r + ' з 5">' + h + "</span>"; }
  function find(b, m, g) { for (var i = 0; i < DATA.length; i++) { var x = DATA[i]; if (x.b === b && x.m === m && (!g || x.g === g)) return x; } return null; }
  function byId(id) { for (var i = 0; i < DATA.length; i++) if (DATA[i].id === id) return DATA[i]; return null; }
  function mark(c) { return c === "+" ? ["ok", "+"] : c === "-" ? ["bad", "×"] : ["warn", "!"]; }
  function reduceMotion() { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function short(p) { return (p[1].indexOf(p[0]) === 0 ? "" : (p[0] === "Volkswagen" ? "VW" : p[0]) + " ") + p[1].replace("Golf 7 / 7.5", "Golf 7.5"); }
  function fullName(x) { return x.m.indexOf(x.b) === 0 ? x.m : x.b + " " + x.m; }
  function sp(x, i) { return x.sp ? x.sp[i] : null; }

  var st = { budget: 15000, cmp: [], q: "", brand: "", seg: "", tier: "", sort: "fit", m4: false, bud: false, rel: false, awd: false, tab: "all" };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || "{}"); for (var k in saved) if (k in st) st[k] = saved[k]; } catch (e) {}
  st.budget = Math.max(7000, Math.min(20000, +st.budget || 15000));
  st.cmp = (st.cmp || []).filter(function (id) { return byId(id); });
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }

  function inBudget(x) { return x.p[0] * 1000 <= st.budget; }
  function quality(x) { return x.r * 10 + (x.t === "top" ? 8 : x.t === "ok" ? 3 : x.t === "avoid" ? -20 : -6) + x.p[1] * 0.3; }
  function fit(x) { return quality(x) + (inBudget(x) ? 15 : -15) + (x.m4 ? 2 : 0); }

  /* Графік топ-12 */
  function chart() {
    var lo = 7, hi = 20, b = st.budget / 1000;
    function pos(v) { return Math.max(0, Math.min(100, (v - lo) / (hi - lo) * 100)); }
    $("#chart").innerHTML = PICKS.map(function (p, i) {
      var inb = p[4][0] <= b, name = short(p);
      return '<div class="crow" data-i="' + i + '" role="button" tabindex="0" aria-label="' + esc(name + ", " + p[2] + ", " + kk(p[4])) + '">' +
        '<div class="cl"><b>' + (i + 1) + ". " + esc(name) + "</b><i>" + esc(p[2]) + " · " + esc(p[3]) + "</i></div>" +
        '<div class="track"><div class="bline" style="left:' + pos(b) + '%"></div><div class="bar' + (inb ? " in" : "") + '" style="left:' + pos(p[4][0]) + "%;width:" + (pos(p[4][1]) - pos(p[4][0])) + '%"></div></div>' +
        '<div class="cp">' + kk(p[4]) + "</div></div>";
    }).join("");
    $("#axis").children[1].innerHTML = [7, 10, 13, 16, 20].map(function (t) { return '<span style="left:' + pos(t) + '%">' + t + " k€</span>"; }).join("");
    var reach = PICKS.filter(function (p) { return p[4][0] <= b; });
    $("#finding").textContent = reach.length
      ? "Budget " + eur(st.budget) + ": досяжні " + reach.length + " з 12 найкращих версій. Найкращий баланс — " + reach.slice(0, 3).map(function (p) { return short(p) + " " + p[2].split(" · ")[0]; }).join(", ").replace(/, ([^,]*)$/, " і $1") + "."
      : "Budget " + eur(st.budget) + ": найкраще — Fabia 3 1.2 TSI, Polo 5 1.2 TSI, Yaris 3 1.5 або Auris 2 1.6.";
  }

  /* Топи */
  function pickCards(arr) {
    return '<div class="picks">' + arr.map(function (p, i) {
      var x = find(p[0], p[1], p[6]);
      return '<article class="pick"><div class="rk">' + (i + 1) + "</div><h3>" + esc(p[1].indexOf(p[0]) === 0 ? p[1] : p[0] + " " + p[1]) + '</h3><div class="ver">' + esc(p[2]) + "</div>" +
        "<dl><dt>Роки</dt><dd>" + esc(p[3]) + "</dd><dt>Price</dt><dd>" + kk(p[4]) + "</dd><dt>Надійність</dt><dd>" + (x ? dots(x.r) : "") + "</dd>" +
        (x && x.sp ? "<dt>Еталон</dt><dd>" + x.sp[1] + " hp · " + num(x.sp[3]) + " s · " + num(x.sp[4]) + " l</dd>" : "") + "</dl>" +
        "<p>" + esc(p[5]) + '</p><button class="cbtn" type="button" data-open="' + (x ? x.id : "") + '">Відкрити розбір</button></article>';
    }).join("") + "</div>";
  }
  function good(x) { return x.r >= 4 && (x.t === "top" || x.t === "ok"); }
  function byQ(a, b) { return quality(b) - quality(a); }
  var FUN = ["mini-cooper-f56-f56", "bmw-se-rie-1-f20-f21", "volkswagen-scirocco-3-13"];
  var X4 = ["dacia-duster-hs-hm", "fiat-panda-3-319"];
  var TOPS = [
    { id: "all", t: "Загалом", d: "Найкращий баланс надійності, ціни, салону і запчастин серед хетчбеків, седанів і універсалів.", cards: function () { return PICKS; } },
    { id: "suv", t: "SUV і 4x4", d: "Кросовери і джипи до 20 k€. 4x4/AWD — повний привід; 2WD — тільки передній, але дешевший у покупці, страховці й пальному.", cards: function () { return PICKS_SUV; } },
    { id: "u10", t: "До 10 k€", d: "Надійні моделі, які реально знайти до 10 k€ — старші роки або більший пробіг. Price — діапазон для всього покоління.", f: function (x) { return good(x) && x.s !== "4x4" && x.p[0] < 8 && x.p[1] <= 22; }, s: byQ, v: function (x) { return sp(x, 1) + " hp"; } },
    { id: "m15", t: "10–15 k€", d: "Надійні моделі, у яких нормальні екземпляри починаються приблизно з 8–12 k€.", f: function (x) { return good(x) && x.s !== "4x4" && x.p[0] >= 8 && x.p[0] < 12.5 && x.p[1] >= 14; }, s: byQ, v: function (x) { return sp(x, 1) + " hp"; } },
    { id: "m20", t: "15–20 k€", d: "Новіші та більші машини: нормальні екземпляри — від 13 k€, найкращі — до 20 k€.", f: function (x) { return good(x) && x.s !== "4x4" && x.p[0] >= 12.5 && x.p[0] <= 19 && x.p[1] <= 46; }, s: byQ, v: function (x) { return sp(x, 1) + " hp"; } },
    { id: "rel", t: "Найнадійніші", d: "Оцінка надійності 5 з 5: мінімум поломок за TÜV, ADAC і відгуками власників.", f: function (x) { return x.r === 5; }, s: function (a, b) { return (b.t === "top") - (a.t === "top") || a.p[0] - b.p[0]; }, v: function (x) { return "5/5"; } },
    { id: "eco", t: "Найекономніші", d: "Найменша витрата пального еталонної версії (змішаний цикл, дані виробника).", f: function (x) { return x.sp && good(x) && x.p[0] <= 16; }, s: function (a, b) { return a.sp[4] - b.sp[4]; }, v: function (x) { return num(x.sp[4]) + " l/100"; } },
    { id: "boot", t: "Найбільший багажник", d: "Об'єм багажника еталонної версії (до шторки, сидіння підняті).", f: function (x) { return x.sp && x.sp[6] > 0 && x.r >= 3 && x.t !== "avoid" && x.p[0] <= 16; }, s: function (a, b) { return b.sp[6] - a.sp[6]; }, v: function (x) { return x.sp[6] + " l"; } },
    { id: "fast", t: "Найдинамічніші", d: "Найшвидший розгін 0–100 km/h серед еталонних версій.", f: function (x) { return x.sp && x.r >= 3 && x.t !== "avoid" && x.p[0] <= 15; }, s: function (a, b) { return a.sp[3] - b.sp[3]; }, v: function (x) { return num(x.sp[3]) + " s"; } },
    { id: "young", t: "Для молодого водія", d: "До 130 hp, надійні й прості: дешевша страховка в перші роки (jeune conducteur) і ремонти.", f: function (x) { return good(x) && x.sp && x.sp[1] <= 130 && x.p[0] <= 15 && x.s !== "Sport" && x.s !== "4x4" && x.s !== "SUV-D"; }, s: byQ, v: function (x) { return x.sp[1] + " hp"; } },
    { id: "fun", t: "Для задоволення", d: "Легкі, жваві, з механікою: купе, родстери і гарячі хетчі.", f: function (x) { return x.s === "Sport" || FUN.indexOf(x.id) >= 0; }, s: function (a, b) { return b.r - a.r || a.sp[3] - b.sp[3]; }, v: function (x) { return x.sp[1] + " hp · " + num(x.sp[3]) + " s"; } },
    { id: "x4", t: "Справжні 4x4", d: "Позашляховики з рамою або пониженою передачею, плюс найкращі прості 4x4 для гір.", f: function (x) { return x.s === "4x4" || X4.indexOf(x.id) >= 0; }, s: function (a, b) { return b.r - a.r || a.p[0] - b.p[0]; }, v: function (x) { return x.sp ? x.sp[1] + " hp" : ""; } }
  ];
  function tops() {
    if (!TOPS.some(function (t) { return t.id === st.tab; })) st.tab = "all";
    $("#topTabs").innerHTML = TOPS.map(function (t) { return '<button type="button" class="tab" role="tab" id="tab-' + t.id + '" aria-controls="topBox" aria-selected="' + (t.id === st.tab) + '" data-tab="' + t.id + '">' + t.t + "</button>"; }).join("");
    var T = TOPS.filter(function (t) { return t.id === st.tab; })[0];
    $("#topDesc").textContent = T.d;
    if (T.cards) { $("#topBox").innerHTML = pickCards(T.cards()); return; }
    var list = DATA.filter(T.f).sort(T.s).slice(0, 12);
    $("#topBox").innerHTML = '<ol class="tlist" aria-labelledby="tab-' + T.id + '">' + list.map(function (x, i) {
      return '<li><button type="button" class="trow" data-open="' + x.id + '"><span class="tn">' + (i + 1) + '</span><span class="tm"><b>' + esc(fullName(x)) + "</b><span>" + esc(x.g + " · " + x.y + (x.sp ? " · " + x.sp[0] : "")) + '</span></span><span class="tv">' + esc(T.v(x)) + '</span><span class="tp">' + (x.pe ? "≈" : "") + kk(x.p) + "<small>" + dots(x.r) + "</small></span></button></li>";
    }).join("") + "</ol>";
  }

  /* Картка моделі */
  function specGrid(x) {
    if (!x.sp) return "";
    var s = x.sp;
    return '<h4>Характеристики (еталон)</h4><dl class="sgrid"><dt>Версія</dt><dd>' + esc(s[0]) + "</dd><dt>Power</dt><dd>" + s[1] + " hp · " + s[2] + " Nm</dd><dt>0–100 km/h</dt><dd>" + num(s[3]) + " s</dd><dt>Витрата</dt><dd>" + num(s[4]) + " l/100 km (" + FUEL[x.f] + ")</dd><dt>Довжина</dt><dd>" + num((s[5] / 1000).toFixed(2)) + " m</dd><dt>Багажник</dt><dd>" + (s[6] ? s[6] + " l" : "кузов-пікап") + "</dd><dt>Маса</dt><dd>" + grp(s[7]) + " kg</dd><dt>Gearbox</dt><dd>" + (x.tr === "M" ? "Manual" : "Auto") + "</dd><dt>Привід</dt><dd>" + (x.awd ? "є версії 4x4 / AWD" : "передній / задній") + "</dd></dl>";
  }
  function card(x) {
    var hi = 40; function pc(v) { return Math.min(100, v / hi * 100); }
    var on = st.cmp.indexOf(x.id) >= 0;
    var eng = x.e.map(function (s) { var m = mark(s.charAt(0)); return '<li><span class="mk ' + m[0] + '" role="img" aria-label="' + VERD[m[0]] + '">' + m[1] + "</span>" + esc(s.slice(1)) + "</li>"; }).join("");
    var w = x.w.map(function (s) { return '<li><span class="mk dot" aria-hidden="true">•</span>' + esc(s) + "</li>"; }).join("");
    var chk = x.chk.length ? "<h4>Перевірити при огляді</h4><ul>" + x.chk.map(function (s) { return '<li><span class="mk dot" aria-hidden="true">•</span>' + esc(s) + "</li>"; }).join("") + "</ul>" : "";
    var specs = x.sp ? '<div class="specs"><span><b>' + x.sp[1] + "</b> hp</span><span><b>" + num(x.sp[3]) + "</b> s 0–100</span><span><b>" + num(x.sp[4]) + "</b> l/100</span><span><b>" + (x.sp[6] || "—") + "</b> l багажник</span></div>" : "";
    return '<article class="card" id="m-' + x.id + '">' +
      '<div class="ch"><div><div class="brand">' + esc(x.b) + "</div><h3>" + esc(x.m) + '</h3><div class="meta">' + esc(x.g) + " · " + esc(x.y) + " · " + esc(SEG[x.s] || x.s) + "</div></div>" +
      '<span class="tier t-' + x.t + '">' + TIER[x.t] + "</span></div>" +
      '<div class="prow"><span class="price">' + (x.pe ? "≈" : "") + kk(x.p) + '</span><span class="dots">надійність ' + dots(x.r) + "</span></div>" +
      '<div class="mini" aria-hidden="true"><i style="left:' + pc(x.p[0]) + "%;width:" + (pc(x.p[1]) - pc(x.p[0])) + '%"></i><u style="left:' + pc(st.budget / 1000) + '%"></u></div>' +
      specs + (x.sp ? '<div class="sref">еталон: ' + esc(x.sp[0]) + "</div>" : "") +
      '<div class="tags">' + (x.m4 ? '<span class="tag y">Manual + 4-cyl petrol</span>' : "") + (x.awd ? '<span class="tag">4x4 / AWD</span>' : "") + (inBudget(x) ? '<span class="tag">В межах Budget</span>' : "") + "</div>" +
      '<div class="bestl"><b>Брати:</b> ' + esc(x.best) + "</div>" +
      '<details><summary>Повний розбір</summary><div class="det">' + specGrid(x) +
      "<h4>Engines</h4><ul>" + eng + "</ul>" +
      "<h4>Gearbox</h4><p>" + esc(x.gb) + "</p>" +
      (w ? "<h4>Слабкі місця</h4><ul>" + w + "</ul>" : "") +
      "<h4>Що кажуть власники</h4><p>" + esc(x.rv) + "</p>" + chk +
      '<div class="verd">' + esc(x.v) + "</div></div></details>" +
      '<button class="cbtn' + (on ? " on" : "") + '" type="button" data-cmp="' + x.id + '" aria-pressed="' + on + '">' + (on ? "У порівнянні" : "Порівняти") + "</button></article>";
  }

  function list() {
    var q = st.q.trim().toLowerCase();
    var r = DATA.filter(function (x) {
      return (!st.brand || x.b === st.brand) && (!st.seg || x.s === st.seg) && (!st.tier || x.t === st.tier) &&
        (!st.m4 || x.m4) && (!st.bud || inBudget(x)) && (!st.rel || x.r >= 4) && (!st.awd || x.awd) &&
        (!q || [x.b, x.m, x.g, x.y, x.best, x.v, x.rv, x.gb, x.sp ? x.sp[0] : "", x.awd ? "4x4 awd" : "", SEG[x.s]].concat(x.e).join(" ").toLowerCase().indexOf(q) >= 0);
    });
    var big = 1e9;
    var sorts = {
      fit: function (a, b) { return fit(b) - fit(a) || a.p[0] - b.p[0]; },
      r: function (a, b) { return b.r - a.r || a.p[0] - b.p[0]; },
      p: function (a, b) { return a.p[0] - b.p[0] || b.r - a.r; },
      hp: function (a, b) { return (sp(b, 1) || 0) - (sp(a, 1) || 0); },
      acc: function (a, b) { return (sp(a, 3) || big) - (sp(b, 3) || big); },
      cons: function (a, b) { return (sp(a, 4) || big) - (sp(b, 4) || big); },
      boot: function (a, b) { return (sp(b, 6) || 0) - (sp(a, 6) || 0); },
      b: function (a, b) { return a.b.localeCompare(b.b) || a.p[0] - b.p[0]; }
    };
    r.sort(sorts[st.sort] || sorts.fit);
    $("#count").textContent = "Показано " + r.length + " з " + DATA.length;
    $("#grid").innerHTML = r.length ? r.map(card).join("") : '<div class="empty">Нічого не знайдено. Зніми частину фільтрів.</div>';
    $("#fIn").textContent = DATA.filter(function (x) { return x.r >= 4 && x.t !== "avoid" && x.t !== "risk" && inBudget(x); }).length;
  }

  function cmp() {
    var xs = st.cmp.map(byId).filter(Boolean);
    $("#cbar").classList.toggle("show", xs.length > 0);
    document.body.classList.toggle("has-cbar", xs.length > 0);
    $("#cbarN").textContent = xs.length;
    if (!xs.length) {
      $("#cmpBox").innerHTML = '<div class="empty">Поки нічого не вибрано.<br><button class="cbtn" type="button" id="cDemo">Приклад: Golf 7.5 vs Octavia 3 vs Mazda 3</button></div>';
      return;
    }
    function names(x, c) { var a = x.e.filter(function (s) { return s.charAt(0) === c; }).map(function (s) { return esc(s.slice(1).split(" — ")[0]); }); return a.length ? a.join("<br>") : "—"; }
    function S(i, f) { return function (x) { return x.sp ? f(x.sp[i]) : "—"; }; }
    var rows = [
      ["Роки", function (x) { return esc(x.y); }],
      ["Кузов", function (x) { return esc(SEG[x.s] || x.s) + (x.awd ? " · 4x4/AWD" : ""); }],
      ["Price 2026", function (x) { return (x.pe ? "≈" : "") + kk(x.p); }],
      ["Надійність", function (x) { return dots(x.r); }],
      ["Оцінка", function (x) { return '<span class="tier t-' + x.t + '">' + TIER[x.t] + "</span>"; }],
      ["Еталон", S(0, esc)],
      ["Power", function (x) { return x.sp ? x.sp[1] + " hp · " + x.sp[2] + " Nm" : "—"; }],
      ["0–100", S(3, function (v) { return num(v) + " s"; })],
      ["Витрата", S(4, function (v) { return num(v) + " l/100"; })],
      ["Довжина", S(5, function (v) { return num((v / 1000).toFixed(2)) + " m"; })],
      ["Багажник", S(6, function (v) { return v ? v + " l" : "—"; })],
      ["Маса", S(7, function (v) { return grp(v) + " kg"; })],
      ["Брати", function (x) { return esc(x.best); }],
      ["Engines +", function (x) { return names(x, "+"); }],
      ["Engines ×", function (x) { return names(x, "-"); }],
      ["Gearbox", function (x) { return esc(x.gb); }],
      ["Слабкі місця", function (x) { return x.w.map(esc).join("<br>") || "—"; }],
      ["Відгуки", function (x) { return esc(x.rv); }],
      ["Вердикт", function (x) { return "<b>" + esc(x.v) + "</b>"; }]
    ];
    $("#cmpBox").innerHTML = '<div class="scroll"><table class="cmp"><thead><tr><th scope="col"><span class="sr">Параметр</span></th>' +
      xs.map(function (x) { return '<th scope="col"><span class="brand">' + esc(x.b) + '</span><br><span class="cn">' + esc(x.m) + '</span><br><span class="meta">' + esc(x.g) + '</span><br><button class="cbtn" type="button" data-cmp="' + x.id + '">Прибрати</button></th>'; }).join("") +
      "</tr></thead><tbody>" + rows.map(function (r) { return '<tr><th scope="row">' + r[0] + "</th>" + xs.map(function (x) { return "<td>" + r[1](x) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
  }

  function costs() {
    $("#cgTable").tBodies[0].innerHTML = [4, 5, 6, 7, 8, 9, 10].map(function (c) { return "<tr><td>" + c + ' CV</td><td class="r">' + eur(c * 68.95 + 13.76) + "</td></tr>"; }).join("");
    var km = Math.max(0, +$("#km").value || 0), lp = Math.max(0, +$("#lp").value || 0), pp = Math.max(0, +$("#pp").value || 0);
    var f = km * lp / 100 * pp;
    $("#fuelRes").textContent = eur(f) + " / рік";
    $("#fuelSub").textContent = "≈ " + eur(f / 12) + " на місяць · " + grp(km * lp / 100) + " l пального";
    var items = [["Carte grise (6 CV, IDF)", 6 * 68.95 + 13.76], ["Страховка tous risques, молодий водій, 1-й рік", 1800], ["Пальне", f], ["ТО і дрібниці", 450], ["Паркування, мийка, péage (оцінка)", 250]];
    var sum = items.reduce(function (a, b) { return a + b[1]; }, 0);
    $("#yearTable").tBodies[0].innerHTML = items.map(function (i) { return "<tr><td>" + i[0] + '</td><td class="r">' + eur(i[1]) + "</td></tr>"; }).join("") +
      '<tr><td><b>Разом без ціни машини</b></td><td class="r"><b>' + eur(sum) + '</b></td></tr><tr><td>≈ на місяць</td><td class="r">' + eur(sum / 12) + "</td></tr>";
  }

  function stackLabels(table) {
    var heads = Array.prototype.map.call(table.tHead.rows[0].cells, function (c) { return c.textContent; });
    Array.prototype.forEach.call(table.tBodies[0].rows, function (tr) { Array.prototype.forEach.call(tr.cells, function (td, i) { td.setAttribute("data-l", heads[i] || ""); }); });
  }
  function syncInputs() {
    $("#budget").value = st.budget; $("#budV").textContent = eur(st.budget);
    $("#q").value = st.q; $("#fBrand").value = st.brand; $("#fSeg").value = st.seg; $("#fTier").value = st.tier; $("#fSort").value = st.sort;
    $("#cM4").checked = st.m4; $("#cBud").checked = st.bud; $("#cRel").checked = st.rel; $("#cAwd").checked = st.awd;
  }
  function resetFilters() { st.q = ""; st.brand = ""; st.seg = ""; st.tier = ""; st.m4 = false; st.bud = false; st.rel = false; st.awd = false; syncInputs(); list(); save(); }
  function openModel(id) {
    if (!id) return;
    if (!document.getElementById("m-" + id)) resetFilters();
    var el = document.getElementById("m-" + id); if (!el) return;
    el.querySelector("details").open = true;
    el.classList.add("hl"); setTimeout(function () { el.classList.remove("hl"); }, 2500);
    el.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  }
  function refreshBtns() {
    Array.prototype.forEach.call(document.querySelectorAll(".card [data-cmp]"), function (btn) {
      var on = st.cmp.indexOf(btn.getAttribute("data-cmp")) >= 0;
      btn.classList.toggle("on", on); btn.setAttribute("aria-pressed", on); btn.textContent = on ? "У порівнянні" : "Порівняти";
    });
  }
  function toggleCmp(id) {
    var i = st.cmp.indexOf(id);
    if (i >= 0) st.cmp.splice(i, 1); else { if (st.cmp.length >= 4) st.cmp.shift(); st.cmp.push(id); }
    save(); cmp(); refreshBtns();
  }
  var tt0 = 0;
  function toast(msg) { var t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(tt0); tt0 = setTimeout(function () { t.classList.remove("show"); }, 2200); }
  function share() {
    var url = location.href.split("#")[0], title = document.title;
    if (navigator.share) { navigator.share({ title: title, text: "Вживані авто у Франції за 7–20 k€: моделі, мотори, ціни, топи", url: url }).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(url).then(function () { toast("Посилання скопійовано"); }, function () { toast(url); }); return; }
    toast(url);
  }

  /* Початкове заповнення */
  var brands = DATA.map(function (x) { return x.b; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(function (a, b) { return a.localeCompare(b); });
  $("#fBrand").insertAdjacentHTML("beforeend", brands.map(function (b) { return "<option>" + esc(b) + "</option>"; }).join(""));
  $("#fSeg").insertAdjacentHTML("beforeend", Object.keys(SEG).map(function (k) { return '<option value="' + k + '">' + SEG[k] + "</option>"; }).join(""));
  $("#fM").textContent = DATA.length; $("#fB").textContent = brands.length;
  $("#brandList").innerHTML = BRANDS.map(function (b) { return '<div class="' + b[0] + '"><b>' + esc(b[1]) + "</b><p>" + esc(b[2]) + "</p></div>"; }).join("");
  $("#engTable").tBodies[0].innerHTML = ENGINES.map(function (e) { return "<tr><td><b>" + esc(e[0]) + "</b></td><td>" + esc(e[1]) + '</td><td><span class="v ' + e[2] + '">' + VERD[e[2]] + "</span></td><td>" + esc(e[3]) + "</td></tr>"; }).join("");
  $("#glTable").tBodies[0].innerHTML = GLOSSARY.map(function (g) { return "<tr><td><b>" + esc(g[0]) + "</b></td><td>" + esc(g[1]) + "</td><td>" + esc(g[2]) + "</td></tr>"; }).join("");
  stackLabels($("#engTable")); stackLabels($("#glTable"));
  syncInputs(); chart(); tops(); list(); cmp(); costs();

  /* Події */
  var raf = 0;
  $("#budget").addEventListener("input", function (e) {
    st.budget = +e.target.value; $("#budV").textContent = eur(st.budget);
    cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { chart(); list(); save(); });
  });
  var qt = 0;
  $("#q").addEventListener("input", function (e) { st.q = e.target.value; clearTimeout(qt); qt = setTimeout(function () { list(); save(); }, 150); });
  [["#fBrand", "brand"], ["#fSeg", "seg"], ["#fTier", "tier"], ["#fSort", "sort"]].forEach(function (p) { $(p[0]).addEventListener("change", function (e) { st[p[1]] = e.target.value; list(); save(); }); });
  [["#cM4", "m4"], ["#cBud", "bud"], ["#cRel", "rel"], ["#cAwd", "awd"]].forEach(function (p) { $(p[0]).addEventListener("change", function (e) { st[p[1]] = e.target.checked; list(); save(); }); });
  ["#km", "#lp", "#pp"].forEach(function (s) { $(s).addEventListener("input", costs); });
  $("#reset").addEventListener("click", resetFilters);
  $("#cClear").addEventListener("click", function () { st.cmp = []; save(); cmp(); refreshBtns(); });
  $("#totop").addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" }); });
  $("#share").addEventListener("click", share);
  $("#topTabs").addEventListener("keydown", function (e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    var ids = TOPS.map(function (t) { return t.id; }), i = ids.indexOf(st.tab);
    st.tab = ids[(i + (e.key === "ArrowRight" ? 1 : ids.length - 1)) % ids.length]; save(); tops();
    var b = document.getElementById("tab-" + st.tab); if (b) b.focus();
  });

  document.addEventListener("click", function (e) {
    var t = e.target;
    var tb = t.closest("[data-tab]"); if (tb) { st.tab = tb.getAttribute("data-tab"); save(); tops(); var nb = document.getElementById("tab-" + st.tab); if (nb) nb.scrollIntoView({ block: "nearest", inline: "nearest" }); return; }
    var c = t.closest("[data-cmp]"); if (c) { toggleCmp(c.getAttribute("data-cmp")); return; }
    var o = t.closest("[data-open]"); if (o) { openModel(o.getAttribute("data-open")); return; }
    if (t.id === "cDemo") {
      st.cmp = [find("Volkswagen", "Golf 7 / 7.5"), find("Skoda", "Octavia 3"), find("Mazda", "Mazda 3", "BM / BN")].filter(Boolean).map(function (x) { return x.id; });
      save(); cmp(); refreshBtns(); return;
    }
    var r = t.closest(".crow"); if (r) { var p = PICKS[+r.getAttribute("data-i")]; var x = p && find(p[0], p[1], p[6]); if (x) openModel(x.id); }
  });
  document.addEventListener("keydown", function (e) {
    var r = e.target.closest && e.target.closest(".crow");
    if (r && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); r.click(); }
  });

  var tt = $("#totop");
  window.addEventListener("scroll", function () { tt.classList.toggle("show", window.scrollY > 900); }, { passive: true });
  if ("IntersectionObserver" in window) {
    var links = {}; Array.prototype.forEach.call(document.querySelectorAll("nav.sec a"), function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var secObs = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove("cur"); });
          var a = links[en.target.id]; a.classList.add("cur");
          var sc = a.parentNode; if (sc.scrollWidth > sc.clientWidth) sc.scrollTo({ left: a.offsetLeft - 16, behavior: "auto" });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) secObs.observe(s); });
  }
})();
