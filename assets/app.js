/* Авто-гід 2026 — логіка сторінки. Дані: data/models.js (window.MODELS), data/content.js. */
(function () {
  "use strict";
  var DATA = window.MODELS || [];
  var PICKS = window.PICKS || [];
  var PICKS_SUV = window.PICKS_SUV || [];
  var BRANDS = window.BRANDS || [];
  var ENGINES = window.ENGINES || [];
  var GLOSSARY = window.GLOSSARY || [];
  var PHOTOS = window.PHOTOS || {};
  var INTERIOR = window.INTERIOR || {};
  DATA.forEach(function (x) {
    var q = INTERIOR[x.id];
    x.iq = q ? q[0] : 0; x.inn = q ? q[1] : "";
    x.ph = (PHOTOS[x.id] || []).map(function (p) { return { k: p[0], p: p[1], a: p[2], l: p[3], y: p[4], ow: p[5] || 0 }; });
  });

  var SEG = { A: "Міні (A)", B: "Малий хетч (B)", C: "Компакт (C)", D: "Великий / універсал (D)", "SUV-B": "Малий SUV", "SUV-C": "SUV / кросовер", "SUV-D": "Великий SUV", "4x4": "Позашляховик (4x4)", Sport: "Купе / спорт" };
  var TIER = { top: "Рекомендую", ok: "Хороша", risk: "Тільки окремі версії", avoid: "Уникай" };
  var VERD = { ok: "Брати", warn: "З нюансами", bad: "Уникай" };
  var FUEL = { P: "Petrol", D: "Diesel", H: "Hybrid" };
  var KEY = "autogid26v2";

  /* Мова: українська в коді, французька — data/fr.js (window.FR), вантажиться лише при виборі FR */
  var LANG = "uk", FR = null;
  try { LANG = (new URLSearchParams(location.search).get("lang") || localStorage.getItem("autogid-lang")) === "fr" ? "fr" : "uk"; } catch (e) {}
  function t(s, v) {
    var r = LANG === "fr" && FR && FR.ui[s] != null ? FR.ui[s] : s;
    return v ? r.replace(/\{(\w+)\}/g, function (m, k) { return v[k] != null ? v[k] : m; }) : r;
  }
  function seg(k) { return t(SEG[k] || k); }
  function hp(n) { return n + " " + t("hp"); }
  function plural(n, one, few, many) { if (LANG === "fr") return n === 1 ? t(one) : t(many); var a = n % 10, b = n % 100; return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? few : many; }

  function $(s) { return document.querySelector(s); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }).replace(/ (k?€)/g, "\u00a0$1"); }
  function grp(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function eur(n) { return grp(n) + " €"; }
  function num(v) { return String(v).replace(".", ","); }
  function kk(a) { return num(a[0]) + "–" + num(a[1]) + " k€"; }
  function dots(r, what) { var h = ""; for (var i = 1; i <= 5; i++) h += '<b class="' + (i <= r ? "f" : "") + '"></b>'; return '<span class="dots" role="img" aria-label="' + esc(t("{w} {r} з 5", { w: t(what || "надійність"), r: r })) + '">' + h + "</span>"; }
  /* Фото з Wikimedia Commons: p = шлях файлу (a/ab/Name.jpg), мініатюри стандартних розмірів */
  var CW = "https://upload.wikimedia.org/wikipedia/commons/";
  function th(p, w) { return CW + "thumb/" + p + "/" + w + "px-" + p.split("/").pop(); }
  /* Розміри мініатюр Wikimedia (стандартні) не більші за оригінал: f.ow — ширина оригіналу */
  function sizesOf(f, ws) { var r = ws.filter(function (w) { return !f.ow || w <= f.ow; }); return r.length ? r : [ws[0]]; }
  function srcset(f, ws) { return sizesOf(f, ws || [500, 960, 1280]).map(function (w) { return th(f.p, w) + " " + w + "w"; }).join(", "); }
  function big(f, w) { var b = sizesOf(f, [500, 960, 1280, 1920]).filter(function (x) { return x <= w; }); return th(f.p, b.length ? b[b.length - 1] : 500); }
  function screenW() { return Math.min(1920, Math.round((window.innerWidth || 1280) * (window.devicePixelRatio || 1))); }
  function filePage(p) { return "https://commons.wikimedia.org/wiki/File:" + p.split("/").pop(); }
  function credit(f) { return '<a href="' + filePage(f.p) + '" target="_blank" rel="noopener">' + t("Фото:") + " " + esc(f.a) + " · " + esc(f.l) + "</a>"; }
  function phLabel(f) { return t(f.k === "i" ? "Салон" : "Зовні") + (f.y ? " · " + f.y : ""); }
  function iqText(x) { return x.iq ? t(["", "погано", "бюджетно", "середньо", "добре", "преміум"][x.iq]) : ""; }
  function find(b, m, g) { for (var i = 0; i < DATA.length; i++) { var x = DATA[i]; if (x.b === b && x.m === m && (!g || x.g === g)) return x; } return null; }
  function byId(id) { for (var i = 0; i < DATA.length; i++) if (DATA[i].id === id) return DATA[i]; return null; }
  function mark(c) { return c === "+" ? ["ok", "+"] : c === "-" ? ["bad", "×"] : ["warn", "!"]; }
  function reduceMotion() { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function short(p) { return (p[1].indexOf(p[0]) === 0 ? "" : (p[0] === "Volkswagen" ? "VW" : p[0]) + " ") + p[1].replace("Golf 7 / 7.5", "Golf 7.5"); }
  function fullName(x) { return x.m.indexOf(x.b) === 0 ? x.m : x.b + " " + x.m; }
  function sp(x, i) { return x.sp ? x.sp[i] : null; }

  var st = { budget: 15000, cmp: [], q: "", brand: "", seg: "", tier: "", sort: "fit", m4: false, bud: false, rel: false, awd: false, iq: false, tab: "all" };
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
      ? t("Budget {b}: досяжні {n} з 12 найкращих версій. Найкращий баланс — {list}.", { b: eur(st.budget), n: reach.length, list: reach.slice(0, 3).map(function (p) { return short(p) + " " + p[2].split(" · ")[0]; }).join(", ").replace(/, ([^,]*)$/, " " + t("і") + " $1") })
      : t("Budget {b}: найкраще — Fabia 3 1.2 TSI, Polo 5 1.2 TSI, Yaris 3 1.5 або Auris 2 1.6.", { b: eur(st.budget) });
  }

  /* Топи */
  function pickCards(arr) {
    return '<div class="picks">' + arr.map(function (p, i) {
      var x = find(p[0], p[1], p[6]);
      var f = x && firstPhoto(x, "e");
      return '<article class="pick">' + (f ? '<button type="button" class="pimg" data-ph="' + x.id + '" data-n="' + x.ph.indexOf(f) + '" aria-label="' + t("Фото:") + " " + esc(fullName(x)) + '"><img src="' + th(f.p, 500) + '" srcset="' + srcset(f) + '" sizes="(max-width: 700px) 92vw, 380px" alt="" loading="lazy" decoding="async"></button>' : "") +
        '<div class="rk">' + (i + 1) + "</div><h3>" + esc(p[1].indexOf(p[0]) === 0 ? p[1] : p[0] + " " + p[1]) + '</h3><div class="ver">' + esc(p[2]) + "</div>" +
        "<dl><dt>" + t("Роки") + "</dt><dd>" + esc(p[3]) + "</dd><dt>" + t("Price") + "</dt><dd>" + kk(p[4]) + "</dd><dt>" + t("Надійність") + "</dt><dd>" + (x ? dots(x.r) : "") + "</dd>" + (x && x.iq ? "<dt>" + t("Салон") + "</dt><dd>" + dots(x.iq, "салон") + " " + iqText(x) + "</dd>" : "") +
        (x && x.sp ? "<dt>" + t("Еталон") + "</dt><dd>" + hp(x.sp[1]) + " · " + num(x.sp[3]) + " s · " + num(x.sp[4]) + " l</dd>" : "") + "</dl>" +
        "<p>" + esc(p[5]) + '</p><button class="cbtn" type="button" data-open="' + (x ? x.id : "") + '">' + t("Відкрити сторінку моделі") + "</button></article>";
    }).join("") + "</div>";
  }
  function firstPhoto(x, k) { for (var i = 0; i < x.ph.length; i++) if (x.ph[i].k === k) return x.ph[i]; return x.ph[0] || null; }
  function good(x) { return x.r >= 4 && (x.t === "top" || x.t === "ok"); }
  function byQ(a, b) { return quality(b) - quality(a); }
  var FUN = ["mini-cooper-f56-f56", "bmw-se-rie-1-f20-f21", "volkswagen-scirocco-3-13"];
  var X4 = ["dacia-duster-hs-hm", "fiat-panda-3-319"];
  var TOPS = [
    { id: "all", t: "Загалом", d: "Найкращий баланс надійності, ціни, салону і запчастин серед хетчбеків, седанів і універсалів.", cards: function () { return PICKS; } },
    { id: "suv", t: "SUV і 4x4", d: "Кросовери і джипи до 20 k€. 4x4/AWD — повний привід; 2WD — тільки передній, але дешевший у покупці, страховці й пальному.", cards: function () { return PICKS_SUV; } },
    { id: "u10", t: "До 10 k€", d: "Надійні моделі, які реально знайти до 10 k€ — старші роки або більший пробіг. Price — діапазон для всього покоління.", f: function (x) { return good(x) && x.s !== "4x4" && x.p[0] < 8 && x.p[1] <= 22; }, s: byQ, v: function (x) { return hp(sp(x, 1)); } },
    { id: "m15", t: "10–15 k€", d: "Надійні моделі, у яких нормальні екземпляри починаються приблизно з 8–12 k€.", f: function (x) { return good(x) && x.s !== "4x4" && x.p[0] >= 8 && x.p[0] < 12.5 && x.p[1] >= 14; }, s: byQ, v: function (x) { return hp(sp(x, 1)); } },
    { id: "m20", t: "15–20 k€", d: "Новіші та більші машини: нормальні екземпляри — від 13 k€, найкращі — до 20 k€.", f: function (x) { return good(x) && x.s !== "4x4" && x.p[0] >= 12.5 && x.p[0] <= 19 && x.p[1] <= 46; }, s: byQ, v: function (x) { return hp(sp(x, 1)); } },
    { id: "rel", t: "Найнадійніші", d: "Оцінка надійності 5 з 5: мінімум поломок за TÜV, ADAC і відгуками власників.", f: function (x) { return x.r === 5; }, s: function (a, b) { return (b.t === "top") - (a.t === "top") || a.p[0] - b.p[0]; }, v: function (x) { return "5/5"; } },
    { id: "cabin", t: "Найкращий салон", d: "Найякісніші матеріали й збирання: м'який пластик, без скрипів. Тільки надійні моделі до 16 k€ за ціною входу.", f: function (x) { return x.iq >= 4 && x.r >= 3 && x.t !== "avoid" && x.p[0] <= 16; }, s: function (a, b) { return b.iq - a.iq || quality(b) - quality(a); }, v: function (x) { return t("салон") + " " + x.iq + "/5"; } },
    { id: "eco", t: "Найекономніші", d: "Найменша витрата пального еталонної версії (змішаний цикл, дані виробника).", f: function (x) { return x.sp && good(x) && x.p[0] <= 16; }, s: function (a, b) { return a.sp[4] - b.sp[4]; }, v: function (x) { return num(x.sp[4]) + " l/100"; } },
    { id: "boot", t: "Найбільший багажник", d: "Об'єм багажника еталонної версії (до шторки, сидіння підняті).", f: function (x) { return x.sp && x.sp[6] > 0 && x.r >= 3 && x.t !== "avoid" && x.p[0] <= 16; }, s: function (a, b) { return b.sp[6] - a.sp[6]; }, v: function (x) { return x.sp[6] + " l"; } },
    { id: "fast", t: "Найдинамічніші", d: "Найшвидший розгін 0–100 km/h серед еталонних версій.", f: function (x) { return x.sp && x.r >= 3 && x.t !== "avoid" && x.p[0] <= 15; }, s: function (a, b) { return a.sp[3] - b.sp[3]; }, v: function (x) { return num(x.sp[3]) + " s"; } },
    { id: "young", t: "Для молодого водія", d: "До 130 hp, надійні й прості: дешевша страховка в перші роки (jeune conducteur) і ремонти.", f: function (x) { return good(x) && x.sp && x.sp[1] <= 130 && x.p[0] <= 15 && x.s !== "Sport" && x.s !== "4x4" && x.s !== "SUV-D"; }, s: byQ, v: function (x) { return hp(x.sp[1]); } },
    { id: "fun", t: "Для задоволення", d: "Легкі, жваві, з механікою: купе, родстери і гарячі хетчі.", f: function (x) { return x.s === "Sport" || FUN.indexOf(x.id) >= 0; }, s: function (a, b) { return b.r - a.r || a.sp[3] - b.sp[3]; }, v: function (x) { return hp(x.sp[1]) + " · " + num(x.sp[3]) + " s"; } },
    { id: "x4", t: "Справжні 4x4", d: "Позашляховики з рамою або пониженою передачею, плюс найкращі прості 4x4 для гір.", f: function (x) { return x.s === "4x4" || X4.indexOf(x.id) >= 0; }, s: function (a, b) { return b.r - a.r || a.p[0] - b.p[0]; }, v: function (x) { return x.sp ? hp(x.sp[1]) : ""; } }
  ];
  function tops() {
    if (!TOPS.some(function (T) { return T.id === st.tab; })) st.tab = "all";
    $("#topTabs").innerHTML = TOPS.map(function (T) { return '<button type="button" class="tab" role="tab" id="tab-' + T.id + '" aria-controls="topBox" aria-selected="' + (T.id === st.tab) + '" data-tab="' + T.id + '">' + t(T.t) + "</button>"; }).join("");
    var T = TOPS.filter(function (o) { return o.id === st.tab; })[0];
    $("#topDesc").textContent = t(T.d);
    $("#topBox").setAttribute("aria-labelledby", "tab-" + T.id);
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
    return '<dl class="sgrid"><dt>' + t("Версія") + "</dt><dd>" + esc(s[0]) + "</dd><dt>" + t("Power") + "</dt><dd>" + hp(s[1]) + " · " + s[2] + " Nm</dd><dt>0–100 km/h</dt><dd>" + num(s[3]) + " s</dd><dt>" + t("Витрата") + "</dt><dd>" + num(s[4]) + " l/100 km (" + t(FUEL[x.f]) + ")</dd><dt>" + t("Довжина") + "</dt><dd>" + num((s[5] / 1000).toFixed(2)) + " m</dd><dt>" + t("Багажник") + "</dt><dd>" + (s[6] ? s[6] + " l" : t("кузов-пікап")) + "</dd><dt>" + t("Маса") + "</dt><dd>" + grp(s[7]) + " kg</dd><dt>" + t("Gearbox") + "</dt><dd>" + (x.tr === "M" ? "Manual" : "Auto") + "</dd><dt>" + t("Привід") + "</dt><dd>" + t(x.awd ? "є версії 4x4 / AWD" : "передній / задній") + "</dd></dl>";
  }
  function href(x) { return "#model/" + x.id; }
  function pc40(v) { return Math.min(100, v / 40 * 100); }
  function cmpBtn(x) { var on = st.cmp.indexOf(x.id) >= 0; return '<button class="cbtn' + (on ? " on" : "") + '" type="button" data-cmp="' + x.id + '" aria-pressed="' + on + '">' + t(on ? "У порівнянні" : "Порівняти") + "</button>"; }
  function card(x) {
    var specs = x.sp ? '<div class="specs"><span><b>' + x.sp[1] + "</b> " + t("hp") + "</span><span><b>" + num(x.sp[3]) + "</b> s 0–100</span><span><b>" + num(x.sp[4]) + "</b> l/100</span><span><b>" + (x.sp[6] || "—") + "</b> " + t("l багажник") + "</span></div>" : "";
    var f = firstPhoto(x, "e");
    var nE = x.e.length;
    var img = f ? '<div class="cimg"><a href="' + href(x) + '" tabindex="-1" aria-hidden="true"><img src="' + th(f.p, 500) + '" srcset="' + srcset(f) + '" sizes="(max-width: 700px) 92vw, 400px" alt="" loading="lazy" decoding="async">' +
      (x.ph.length > 1 ? '<span class="pcount">' + x.ph.length + " " + t("фото") + (x.ph.some(function (p) { return p.k === "i"; }) ? " · " + t("салон") : "") + "</span>" : "") + "</a>" +
      '<span class="pcred">' + credit(f) + "</span></div>" : "";
    return '<article class="card" id="m-' + x.id + '">' + img +
      '<div class="ch"><div><div class="brand">' + esc(x.b) + '</div><h3><a class="clink" href="' + href(x) + '">' + esc(x.m) + '</a></h3><div class="meta">' + esc(x.g) + " · " + esc(x.y) + " · " + esc(seg(x.s)) + "</div></div>" +
      '<span class="tier t-' + x.t + '">' + t(TIER[x.t]) + "</span></div>" +
      '<div class="prow"><span class="price">' + (x.pe ? "≈" : "") + kk(x.p) + '</span><span class="rates"><span class="dots">' + t("надійність") + " " + dots(x.r) + "</span>" + (x.iq ? '<span class="dots">' + t("салон") + " " + dots(x.iq, "салон") + "</span>" : "") + "</span></div>" +
      '<div class="mini" aria-hidden="true"><i style="left:' + pc40(x.p[0]) + "%;width:" + (pc40(x.p[1]) - pc40(x.p[0])) + '%"></i><u style="left:' + pc40(st.budget / 1000) + '%"></u></div>' +
      specs + (x.sp ? '<div class="sref">' + t("еталон:") + " " + esc(x.sp[0]) + "</div>" : "") + tags(x) +
      '<div class="bestl"><b>' + t("Брати:") + "</b> " + esc(x.best) + "</div>" +
      '<div class="cact"><a class="more" href="' + href(x) + '">' + t("Детально: {n} {w}, салон, фото →", { n: nE, w: plural(nE, "мотор", "мотори", "моторів") }) + "</a>" + cmpBtn(x) + "</div></article>";
  }
  function tags(x) {
    return '<div class="tags">' + (x.m4 ? '<span class="tag y">' + t("Manual + 4-cyl petrol") + "</span>" : "") + (x.awd ? '<span class="tag">4x4 / AWD</span>' : "") + (inBudget(x) ? '<span class="tag">' + t("В межах Budget") + "</span>" : "") + "</div>";
  }

  /* Сторінка моделі на весь екран: #model/<id> */
  function engParts(s) { var t = s.slice(1), i = t.indexOf(" — "); return i > 0 ? [t.slice(0, i), t.slice(i + 3)] : [t, ""]; }
  function bullets(arr) { return "<ul>" + arr.map(function (s) { return '<li><span class="mk dot" aria-hidden="true">•</span>' + esc(s) + "</li>"; }).join("") + "</ul>"; }
  function group(x) { return x.s.indexOf("SUV") === 0 || x.s === "4x4" ? "suv" : x.s; }
  function similar(x) {
    return DATA.filter(function (y) { return y.id !== x.id && group(y) === group(x) && y.t !== "avoid" && y.p[0] <= x.p[1] && y.p[1] >= x.p[0]; })
      .sort(function (a, b) { return quality(b) - quality(a); }).slice(0, 4);
  }
  function miniCard(y) {
    var f = firstPhoto(y, "e");
    return '<a class="altc" href="' + href(y) + '">' + (f ? '<img src="' + th(f.p, 500) + '" srcset="' + srcset(f, [500, 960]) + '" sizes="(max-width: 600px) 92vw, 300px" alt="" loading="lazy" decoding="async">' : '<span class="noimg"></span>') +
      "<b>" + esc(fullName(y)) + "</b><span>" + esc(y.g + " · " + y.y) + "</span><span>" + (y.pe ? "≈" : "") + kk(y.p) + " · " + dots(y.r) + "</span></a>";
  }
  function page(x) {
    var main = firstPhoto(x, "e");
    var gal = x.ph.length ? '<div class="mpgal"><button type="button" class="mpmain" data-ph="' + x.id + '" data-n="' + x.ph.indexOf(main) + '" aria-label="' + t("Фото на весь екран") + '"><img src="' + big(main, 960) + '" fetchpriority="high" srcset="' + srcset(main, [500, 960, 1280, 1920]) + '" sizes="(max-width: 900px) 100vw, 60vw" alt="' + esc(fullName(x) + " — " + phLabel(main).toLowerCase()) + '" decoding="async"></button>' +
      '<p class="mpcred">' + esc(phLabel(main)) + " · " + credit(main) + "</p>" +
      (x.ph.length > 1 ? '<div class="thumbs">' + x.ph.map(function (f, i) { return '<button type="button" data-ph="' + x.id + '" data-n="' + i + '" aria-label="' + esc(phLabel(f)) + '"><img src="' + th(f.p, 330) + '" alt="" loading="lazy" decoding="async"><span>' + t(f.k === "i" ? "Салон" : "Зовні") + "</span></button>"; }).join("") + "</div>" : "") + "</div>"
      : '<div class="mpgal nophoto"><p>' + t("Вільних фото цього покоління поки немає.") + "</p></div>";
    var groups = [["+", "ok", "Брати"], ["~", "warn", "З нюансами"], ["-", "bad", "Уникай"]].map(function (g) {
      var es = x.e.filter(function (s) { return s.charAt(0) === g[0]; });
      if (!es.length) return "";
      return '<div class="eg"><h4><span class="v ' + g[1] + '">' + t(g[2]) + "</span> · " + es.length + "</h4><ul class=\"engs\">" + es.map(function (s) { var p = engParts(s); var m = mark(s.charAt(0)); return '<li class="' + m[0] + '"><span class="mk ' + m[0] + '" aria-hidden="true">' + m[1] + "</span><b>" + esc(p[0]) + "</b>" + (p[1] ? "<span>" + esc(p[1]) + "</span>" : "") + "</li>"; }).join("") + "</ul></div>";
    }).join("");
    var ints = x.ph.filter(function (f) { return f.k === "i"; });
    var sim = similar(x);
    return '<div class="mphead">' + gal +
      '<div class="mpinfo"><div class="brand">' + esc(x.b) + '</div><h2 id="mpT">' + esc(x.m) + '</h2><div class="meta">' + esc(x.g) + " · " + esc(x.y) + " · " + esc(seg(x.s)) + "</div>" +
      '<span class="tier t-' + x.t + '">' + t(TIER[x.t]) + "</span>" +
      '<div class="mpprice">' + (x.pe ? "≈" : "") + kk(x.p) + "<small>" + t("ціна 2026 у Франції за все покоління") + "</small></div>" +
      '<div class="mini" aria-hidden="true"><i style="left:' + pc40(x.p[0]) + "%;width:" + (pc40(x.p[1]) - pc40(x.p[0])) + '%"></i><u style="left:' + pc40(st.budget / 1000) + '%"></u></div>' +
      '<dl class="mprate"><dt>' + t("Надійність") + "</dt><dd>" + dots(x.r) + " " + x.r + "/5</dd>" + (x.iq ? "<dt>" + t("Салон") + "</dt><dd>" + dots(x.iq, "салон") + " " + x.iq + "/5 · " + iqText(x) + "</dd>" : "") + "</dl>" +
      tags(x) +
      '<div class="best"><b>' + t("Яку версію брати") + "</b>" + esc(x.best) + "</div>" + cmpBtn(x) + "</div></div>" +
      '<div class="verd big">' + esc(x.v) + "</div>" +
      '<section class="mpsec"><h3>' + t("Мотори: що брати, що обходити") + '</h3><p class="note">' + t("Перевір код мотора в сервісній книжці або за VIN — однакова назва буває в різних поколінь двигуна.") + '</p><div class="egs">' + groups + "</div></section>" +
      '<div class="mpcols">' +
      '<section class="mpsec"><h3>' + t("Коробка передач") + "</h3><p>" + esc(x.gb) + "</p>" + (x.w.length ? "<h3>" + t("Слабкі місця") + "</h3>" + bullets(x.w) : "") + (x.chk.length ? "<h3>" + t("Перевірити при огляді") + "</h3>" + bullets(x.chk) : "") + "</section>" +
      '<section class="mpsec">' + (x.iq ? "<h3>" + t("Салон") + "</h3><p class=\"iq\">" + dots(x.iq, "салон") + " <b>" + x.iq + "/5 · " + iqText(x) + "</b></p><p>" + esc(x.inn) + "</p>" +
        (ints.length ? '<div class="ithumbs">' + ints.map(function (f) { return '<button type="button" data-ph="' + x.id + '" data-n="' + x.ph.indexOf(f) + '" aria-label="' + t("Фото салону") + '"><img src="' + th(f.p, 500) + '" srcset="' + srcset(f, [500, 960]) + '" sizes="(max-width: 900px) 46vw, 300px" alt="" loading="lazy" decoding="async"></button>'; }).join("") + "</div>" : "") : "") +
        (x.sp ? "<h3>" + t("Характеристики еталона") + "</h3>" + specGrid(x) : "") + "</section></div>" +
      '<section class="mpsec"><h3>' + t("Що кажуть власники") + "</h3><p>" + esc(x.rv) + "</p></section>" +
      sources(x) +
      (sim.length ? '<section class="mpsec"><h3>' + t("Схожі альтернативи") + '</h3><div class="alts">' + sim.map(miniCard).join("") + "</div></section>" : "");
  }
  /* Незалежні джерела для перевірки: fiches-auto (відгуки й поломки цього покоління), TÜV, ADAC, відкликання, HistoVec */
  function ext(href, label, note) { return '<li><a href="' + href + '" target="_blank" rel="noopener">' + label + "</a>" + (note ? "<span>" + note + "</span>" : "") + "</li>"; }
  function sources(x) {
    var S = (window.SOURCES || {})[x.id] || [], FA = "https://www.fiches-auto.fr";
    var own = S.map(function (s) {
      return ext(FA + s[2], t("Відгуки власників") + " · fiches-auto.fr", esc(s[0]) + " · " + t("{n} відгуків", { n: s[1] })) +
        (s[3] ? ext(FA + s[3], t("Типові поломки й надійність") + " · fiches-auto.fr", esc(s[0])) : "");
    }).join("");
    return '<section class="mpsec"><h3>' + t("Перевір сам: незалежні джерела") + '</h3><p class="note">' +
      t("Оцінки надійності й салону на цьому сайті — редакційний підсумок відомих проблем моторів і коробок, відгуків власників, TÜV-Report і ADAC. Перед покупкою звір їх із незалежними джерелами:") +
      '</p><ul class="srcs">' + own +
      ext("https://www.tuev-verband.de/tuev-report-datenbank", t("TÜV-Report: дефекти на техогляді за моделлю й віком"), "tuev-verband.de") +
      ext("https://www.adac.de/rund-ums-fahrzeug/unfall-schaden-panne/adac-pannenstatistik-2026/", t("ADAC Pannenstatistik 2026: поломки на дорозі за моделями"), "adac.de") +
      ext("https://rappel.conso.gouv.fr/", t("RappelConso: офіційні відкликання (rappels) у Франції"), "rappel.conso.gouv.fr") +
      ext("https://histovec.interieur.gouv.fr/histovec/home", t("HistoVec: історія конкретної машини (власники, аварії, пробіг)"), "histovec.interieur.gouv.fr") +
      "</ul></section>";
  }
  var mp = { id: null, back: null, title: document.title, ukTitle: document.title, ukDesc: (document.querySelector('meta[name="description"]') || {}).content, inApp: false };
  function route() {
    var m = location.hash.match(/^#model\/([\w-]+)$/), x = m && byId(m[1]);
    var box = $("#mp");
    if (x) {
      if (mp.id !== x.id) {
        $("#mpBody").innerHTML = page(x); $("#mpBarT").textContent = fullName(x);
        box.scrollTop = 0; mp.id = x.id;
      }
      if (box.hidden) { mp.back = document.activeElement; box.hidden = false; document.body.classList.add("mp-open"); }
      document.title = fullName(x) + " — " + mp.title;
      var h = $("#mpT"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    } else if (!box.hidden) {
      box.hidden = true; document.body.classList.remove("mp-open"); document.title = mp.title;
      var c = mp.id && document.getElementById("m-" + mp.id);
      var target = (mp.back && document.contains(mp.back)) ? mp.back : c && c.querySelector(".clink");
      if (target) target.focus({ preventScroll: true });
      if (c && !mp.back) c.scrollIntoView({ block: "center" });
      mp.id = null;
    }
  }
  function closePage() {
    if (mp.inApp) { mp.inApp = false; history.back(); }
    else { history.replaceState(null, "", location.pathname + location.search); route(); }
  }

  function list() {
    var q = st.q.trim().toLowerCase();
    var r = DATA.filter(function (x) {
      return (!st.brand || x.b === st.brand) && (!st.seg || x.s === st.seg) && (!st.tier || x.t === st.tier) &&
        (!st.m4 || x.m4) && (!st.bud || inBudget(x)) && (!st.rel || x.r >= 4) && (!st.awd || x.awd) && (!st.iq || x.iq >= 4) &&
        (!q || [x.b, x.m, x.g, x.y, x.best, x.v, x.rv, x.gb, x.inn, x.sp ? x.sp[0] : "", x.awd ? "4x4 awd" : "", seg(x.s)].concat(x.e).join(" ").toLowerCase().indexOf(q) >= 0);
    });
    var big = 1e9;
    var sorts = {
      fit: function (a, b) { return fit(b) - fit(a) || a.p[0] - b.p[0]; },
      r: function (a, b) { return b.r - a.r || a.p[0] - b.p[0]; },
      iq: function (a, b) { return b.iq - a.iq || b.r - a.r || a.p[0] - b.p[0]; },
      p: function (a, b) { return a.p[0] - b.p[0] || b.r - a.r; },
      hp: function (a, b) { return (sp(b, 1) || 0) - (sp(a, 1) || 0); },
      acc: function (a, b) { return (sp(a, 3) || big) - (sp(b, 3) || big); },
      cons: function (a, b) { return (sp(a, 4) || big) - (sp(b, 4) || big); },
      boot: function (a, b) { return (sp(b, 6) || 0) - (sp(a, 6) || 0); },
      b: function (a, b) { return a.b.localeCompare(b.b) || a.p[0] - b.p[0]; }
    };
    r.sort(sorts[st.sort] || sorts.fit);
    $("#count").textContent = t("Показано {a} з {b}", { a: r.length, b: DATA.length });
    $("#grid").innerHTML = r.length ? r.map(card).join("") : '<div class="empty">' + t("Нічого не знайдено. Зніми частину фільтрів.") + "</div>";
    $("#fIn").textContent = DATA.filter(function (x) { return x.r >= 4 && x.t !== "avoid" && x.t !== "risk" && inBudget(x); }).length;
  }

  function cmp() {
    var xs = st.cmp.map(byId).filter(Boolean);
    $("#cbar").classList.toggle("show", xs.length > 0);
    document.body.classList.toggle("has-cbar", xs.length > 0);
    $("#cbarN").textContent = xs.length;
    if (!xs.length) {
      $("#cmpBox").innerHTML = '<div class="empty">' + t("Поки нічого не вибрано.") + '<br><button class="cbtn" type="button" id="cDemo">' + t("Приклад: Golf 7.5 vs Octavia 3 vs Mazda 3") + "</button></div>";
      return;
    }
    function names(x, c) { var a = x.e.filter(function (s) { return s.charAt(0) === c; }).map(function (s) { return esc(s.slice(1).split(" — ")[0]); }); return a.length ? a.join("<br>") : "—"; }
    function S(i, f) { return function (x) { return x.sp ? f(x.sp[i]) : "—"; }; }
    var rows = [
      ["Роки", function (x) { return esc(x.y); }],
      ["Кузов", function (x) { return esc(seg(x.s)) + (x.awd ? " · 4x4/AWD" : ""); }],
      ["Price 2026", function (x) { return (x.pe ? "≈" : "") + kk(x.p); }],
      ["Надійність", function (x) { return dots(x.r); }],
      ["Салон", function (x) { return x.iq ? dots(x.iq, "салон") + " " + x.iq + "/5<br><small>" + esc(x.inn) + "</small>" : "—"; }],
      ["Оцінка", function (x) { return '<span class="tier t-' + x.t + '">' + t(TIER[x.t]) + "</span>"; }],
      ["Еталон", S(0, esc)],
      ["Power", function (x) { return x.sp ? hp(x.sp[1]) + " · " + x.sp[2] + " Nm" : "—"; }],
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
    $("#cmpBox").innerHTML = '<div class="scroll"><table class="cmp"><thead><tr><th scope="col"><span class="sr">' + t("Параметр") + "</span></th>" +
      xs.map(function (x) { var f = firstPhoto(x, "e"); return '<th scope="col">' + (f ? '<button type="button" class="cmpimg" data-ph="' + x.id + '" data-n="' + x.ph.indexOf(f) + '" aria-label="' + t("Фото:") + " " + esc(fullName(x)) + '"><img src="' + th(f.p, 500) + '" alt="" loading="lazy" decoding="async"></button>' : "") + '<span class="brand">' + esc(x.b) + '</span><br><a class="cn" href="' + href(x) + '">' + esc(x.m) + '</a><br><span class="meta">' + esc(x.g) + '</span><br><button class="cbtn" type="button" data-cmp="' + x.id + '">' + t("Прибрати") + "</button></th>"; }).join("") +
      "</tr></thead><tbody>" + rows.map(function (r) { return '<tr><th scope="row">' + t(r[0]) + "</th>" + xs.map(function (x) { return "<td>" + r[1](x) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
  }

  function costs() {
    $("#cgTable").tBodies[0].innerHTML = [4, 5, 6, 7, 8, 9, 10].map(function (c) { return "<tr><td>" + c + ' CV</td><td class="r">' + eur(c * 68.95 + 13.76) + "</td></tr>"; }).join("");
    var km = Math.max(0, +$("#km").value || 0), lp = Math.max(0, +$("#lp").value || 0), pp = Math.max(0, +$("#pp").value || 0);
    var f = km * lp / 100 * pp;
    $("#fuelRes").textContent = eur(f) + " " + t("/ рік");
    $("#fuelSub").textContent = t("≈ {m} на місяць · {l} l пального", { m: eur(f / 12), l: grp(km * lp / 100) });
    var items = [["Carte grise (6 CV, IDF)", 6 * 68.95 + 13.76], [t("Страховка tous risques, молодий водій, 1-й рік"), 1800], [t("Пальне"), f], [t("ТО і дрібниці"), 450], [t("Паркування, мийка, péage (оцінка)"), 250]];
    var sum = items.reduce(function (a, b) { return a + b[1]; }, 0);
    $("#yearTable").tBodies[0].innerHTML = items.map(function (i) { return "<tr><td>" + i[0] + '</td><td class="r">' + eur(i[1]) + "</td></tr>"; }).join("") +
      "<tr><td><b>" + t("Разом без ціни машини") + '</b></td><td class="r"><b>' + eur(sum) + "</b></td></tr><tr><td>" + t("≈ на місяць") + '</td><td class="r">' + eur(sum / 12) + "</td></tr>";
  }

  function stackLabels(table) {
    var heads = Array.prototype.map.call(table.tHead.rows[0].cells, function (c) { return c.textContent; });
    Array.prototype.forEach.call(table.tBodies[0].rows, function (tr) { Array.prototype.forEach.call(tr.cells, function (td, i) { td.setAttribute("data-l", heads[i] || ""); }); });
  }
  function syncInputs() {
    $("#budget").value = st.budget; $("#budV").textContent = eur(st.budget);
    $("#q").value = st.q; $("#fBrand").value = st.brand; $("#fSeg").value = st.seg; $("#fTier").value = st.tier; $("#fSort").value = st.sort;
    $("#cM4").checked = st.m4; $("#cBud").checked = st.bud; $("#cRel").checked = st.rel; $("#cAwd").checked = st.awd; $("#cIq").checked = st.iq;
  }
  function resetFilters() { st.q = ""; st.brand = ""; st.seg = ""; st.tier = ""; st.m4 = false; st.bud = false; st.rel = false; st.awd = false; st.iq = false; syncInputs(); list(); save(); }

  /* Перегляд фото на весь екран */
  var lb = { x: null, i: 0 };
  function lbShow() {
    var f = lb.x.ph[lb.i], n = lb.x.ph.length;
    $("#lbImg").src = big(f, screenW()); $("#lbImg").alt = fullName(lb.x) + " — " + phLabel(f).toLowerCase();
    $("#lbCap").innerHTML = "<b>" + esc(fullName(lb.x)) + "</b> · " + esc(phLabel(f)) + " · " + (lb.i + 1) + "/" + n + "<br>" + credit(f);
    $("#lbPrev").hidden = $("#lbNext").hidden = n < 2;
    var nx = lb.x.ph[(lb.i + 1) % n]; if (nx) new Image().src = big(nx, screenW());
  }
  function lbOpen(id, i) {
    var x = byId(id); if (!x || !x.ph.length) return;
    lb.x = x; lb.i = Math.max(0, Math.min(x.ph.length - 1, i || 0)); lbShow();
    var d = $("#lb"); if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute("open", "");
  }
  function lbStep(s) { if (!lb.x) return; var n = lb.x.ph.length; lb.i = (lb.i + s + n) % n; lbShow(); }
  function lbClose() { var d = $("#lb"); if (d.close && d.open) d.close(); else d.removeAttribute("open"); }
  function openModel(id) {
    if (!id || !byId(id)) return;
    if (location.hash !== "#model/" + id) { mp.inApp = true; location.hash = "model/" + id; }
  }
  function refreshBtns() {
    Array.prototype.forEach.call(document.querySelectorAll(".card [data-cmp], .mp [data-cmp]"), function (btn) {
      var on = st.cmp.indexOf(btn.getAttribute("data-cmp")) >= 0;
      btn.classList.toggle("on", on); btn.setAttribute("aria-pressed", on); btn.textContent = t(on ? "У порівнянні" : "Порівняти");
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
    if (navigator.share) { navigator.share({ title: title, text: t("Вживані авто у Франції за 7–20 k€: моделі, мотори, ціни, топи"), url: url }).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(url).then(function () { toast(t("Посилання скопійовано")); }, function () { toast(url); }); return; }
    toast(url);
  }

  /* Переклад даних: українські оригінали зберігаються в _uk, французькі беруться з FR */
  function swapData() {
    var fr = LANG === "fr" && FR;
    DATA.forEach(function (x) {
      if (!x._uk) x._uk = { e: x.e, gb: x.gb, w: x.w, rv: x.rv, chk: x.chk, best: x.best, v: x.v, inn: x.inn, y: x.y };
      var o = x._uk, f = fr && FR.models[x.id];
      ["e", "gb", "w", "rv", "chk", "best", "v"].forEach(function (k) { x[k] = f && f[k] != null ? f[k] : o[k]; });
      x.inn = fr && FR.interior[x.id] != null ? FR.interior[x.id] : o.inn;
      x.y = fr ? o.y.replace("нині", t("нині")) : o.y;
    });
    [[PICKS, "picks"], [PICKS_SUV, "picksSuv"]].forEach(function (pair) {
      pair[0].forEach(function (p, i) {
        if (!p._uk) p._uk = [p[2], p[5]];
        var f = fr && FR[pair[1]][i];
        p[2] = f ? f[0] : p._uk[0]; p[5] = f ? f[1] : p._uk[1];
      });
    });
    BRANDS.forEach(function (b, i) { if (!b._uk) b._uk = [b[1], b[2]]; var f = fr && FR.brands[i]; b[1] = f ? f[0] : b._uk[0]; b[2] = f ? f[1] : b._uk[1]; });
    ENGINES.forEach(function (e, i) { if (!e._uk) e._uk = [e[0], e[1], e[3]]; var f = fr && FR.engines[i]; e[0] = f ? f[0] : e._uk[0]; e[1] = f ? f[1] : e._uk[1]; e[3] = f ? f[2] : e._uk[2]; });
    GLOSSARY.forEach(function (g, i) { if (!g._uk) g._uk = g.slice(0, 3); var f = fr && FR.glossary[i]; for (var k = 0; k < 3; k++) g[k] = f ? f[k] : g._uk[k]; });
  }
  /* Статичні тексти сторінки: елементи з data-i (вміст) і data-i-a (aria-label) */
  function applyStatic() {
    var fr = LANG === "fr" && FR;
    Array.prototype.forEach.call(document.querySelectorAll("[data-i]"), function (el) {
      if (el._uk == null) el._uk = el.innerHTML;
      var v = fr ? FR.html[el.getAttribute("data-i")] : null;
      el.innerHTML = v != null ? v : el._uk;
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-i-a]"), function (el) {
      if (el._uka == null) el._uka = el.getAttribute("aria-label");
      var v = fr ? FR.html[el.getAttribute("data-i-a")] : null;
      el.setAttribute("aria-label", v != null ? v.replace(/<[^>]+>/g, "") : el._uka);
      if (el.hasAttribute("title")) el.setAttribute("title", el.getAttribute("aria-label"));
    });
    if (!mp.ukTitle) { mp.ukTitle = document.title; mp.ukDesc = document.querySelector('meta[name="description"]').content; }
    mp.title = fr ? FR.meta.title : mp.ukTitle;
    if (!mp.id) document.title = mp.title;
    document.querySelector('meta[name="description"]').content = fr ? FR.meta.desc : mp.ukDesc;
    document.documentElement.lang = LANG === "fr" ? "fr" : "uk";
    Array.prototype.forEach.call(document.querySelectorAll("[data-lang]"), function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-lang") === LANG); });
    themeLabel();
  }
  function applyLang() {
    swapData(); applyStatic(); renderAll();
    if (mp.id) { var id = mp.id; mp.id = null; route(); if (!mp.id) mp.id = id; }
    document.documentElement.classList.remove("i18n-wait");
  }
  function loadFR(cb) {
    if (FR) return cb();
    var s = document.createElement("script");
    s.src = "data/fr.js";
    s.onload = function () { FR = window.FR || null; if (!FR) LANG = "uk"; cb(); };
    s.onerror = function () { LANG = "uk"; cb(); toast("Не вдалося завантажити французьку версію"); };
    document.head.appendChild(s);
  }
  function setLang(l) {
    LANG = l === "fr" ? "fr" : "uk";
    try { localStorage.setItem("autogid-lang", LANG); } catch (e) {}
    try {
      var u = new URL(location.href);
      if (LANG === "fr") u.searchParams.set("lang", "fr"); else u.searchParams.delete("lang");
      history.replaceState(history.state, "", u.pathname + u.search + u.hash);
    } catch (e) {}
    loadFR(applyLang);
  }

  /* Тема: авто (як у системі) → світла → темна */
  var THEMES = ["auto", "light", "dark"], THEME_N = { auto: "авто", light: "світла", dark: "темна" };
  function curTheme() { return document.documentElement.getAttribute("data-theme") || "auto"; }
  function themeLabel() { var b = $("#themeBtn"); if (!b) return; var l = t("Тема: {n}", { n: t(THEME_N[curTheme()]) }); b.setAttribute("aria-label", l); b.title = l; }
  function setTheme(th) {
    var d = document.documentElement;
    if (th === "auto") d.removeAttribute("data-theme"); else d.setAttribute("data-theme", th);
    try { if (th === "auto") localStorage.removeItem("autogid-theme"); else localStorage.setItem("autogid-theme", th); } catch (e) {}
    Array.prototype.forEach.call(document.querySelectorAll('meta[name="theme-color"]'), function (m, i) {
      if (!m._c) m._c = m.content;
      m.content = th === "light" ? "#ffffff" : th === "dark" ? "#15110f" : m._c;
    });
    themeLabel();
  }

  /* Початкове заповнення */
  var brands = DATA.map(function (x) { return x.b; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(function (a, b) { return a.localeCompare(b); });
  $("#fBrand").insertAdjacentHTML("beforeend", brands.map(function (b) { return "<option>" + esc(b) + "</option>"; }).join(""));
  $("#fM").textContent = DATA.length; $("#fB").textContent = brands.length;
  function staticLists() {
    var fs = $("#fSeg"); while (fs.options.length > 1) fs.remove(1);
    fs.insertAdjacentHTML("beforeend", Object.keys(SEG).map(function (k) { return '<option value="' + k + '">' + esc(seg(k)) + "</option>"; }).join(""));
    $("#brandList").innerHTML = BRANDS.map(function (b) { return '<div class="' + b[0] + '"><b>' + esc(b[1]) + "</b><p>" + esc(b[2]) + "</p></div>"; }).join("");
    $("#engTable").tBodies[0].innerHTML = ENGINES.map(function (e) { return "<tr><td><b>" + esc(e[0]) + "</b></td><td>" + esc(e[1]) + '</td><td><span class="v ' + e[2] + '">' + t(VERD[e[2]]) + "</span></td><td>" + esc(e[3]) + "</td></tr>"; }).join("");
    $("#glTable").tBodies[0].innerHTML = GLOSSARY.map(function (g) { return "<tr><td><b>" + esc(g[0]) + "</b></td><td>" + esc(g[1]) + "</td><td>" + esc(g[2]) + "</td></tr>"; }).join("");
    stackLabels($("#engTable")); stackLabels($("#glTable"));
  }
  function renderAll() { staticLists(); syncInputs(); chart(); tops(); list(); cmp(); costs(); }
  renderAll();

  /* Події */
  /* Графік оновлюється щокадру, а сітку з 201 картки перебудовуємо, коли повзунок зупинився. */
  var raf = 0, lt = 0;
  $("#budget").addEventListener("input", function (e) {
    st.budget = +e.target.value; $("#budV").textContent = eur(st.budget);
    cancelAnimationFrame(raf); raf = requestAnimationFrame(chart);
    clearTimeout(lt); lt = setTimeout(function () { list(); save(); }, 120);
  });
  var qt = 0;
  $("#q").addEventListener("input", function (e) { st.q = e.target.value; clearTimeout(qt); qt = setTimeout(function () { list(); save(); }, 150); });
  [["#fBrand", "brand"], ["#fSeg", "seg"], ["#fTier", "tier"], ["#fSort", "sort"]].forEach(function (p) { $(p[0]).addEventListener("change", function (e) { st[p[1]] = e.target.value; list(); save(); }); });
  [["#cM4", "m4"], ["#cBud", "bud"], ["#cRel", "rel"], ["#cAwd", "awd"], ["#cIq", "iq"]].forEach(function (p) { $(p[0]).addEventListener("change", function (e) { st[p[1]] = e.target.checked; list(); save(); }); });
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
    var lg = t.closest("[data-lang]"); if (lg) { if (lg.getAttribute("data-lang") !== LANG) setLang(lg.getAttribute("data-lang")); return; }
    if (t.closest("#themeBtn")) { setTheme(THEMES[(THEMES.indexOf(curTheme()) + 1) % 3]); return; }
    var ph = t.closest("[data-ph]"); if (ph) { lbOpen(ph.getAttribute("data-ph"), +ph.getAttribute("data-n")); return; }
    if (t.id === "lb") { lbClose(); return; }
    var tb = t.closest("[data-tab]"); if (tb) { st.tab = tb.getAttribute("data-tab"); save(); tops(); var nb = document.getElementById("tab-" + st.tab); if (nb) nb.scrollIntoView({ block: "nearest", inline: "nearest" }); return; }
    var c = t.closest("[data-cmp]"); if (c) { toggleCmp(c.getAttribute("data-cmp")); return; }
    var o = t.closest("[data-open]"); if (o) { openModel(o.getAttribute("data-open")); return; }
    var a = t.closest('a[href^="#model/"]'); if (a && !e.metaKey && !e.ctrlKey && !e.shiftKey) { e.preventDefault(); openModel(a.getAttribute("href").slice(7)); return; }
    if (t.id === "cDemo") {
      st.cmp = [find("Volkswagen", "Golf 7 / 7.5"), find("Skoda", "Octavia 3"), find("Mazda", "Mazda 3", "BM / BN")].filter(Boolean).map(function (x) { return x.id; });
      save(); cmp(); refreshBtns(); return;
    }
    var r = t.closest(".crow"); if (r) { var p = PICKS[+r.getAttribute("data-i")]; var x = p && find(p[0], p[1], p[6]); if (x) openModel(x.id); }
  });
  window.addEventListener("hashchange", route);
  $("#mpBack").addEventListener("click", closePage);
  $("#mpShare").addEventListener("click", function () {
    var x = byId(mp.id); if (!x) return;
    var url = location.href.split("#")[0] + href(x);
    if (navigator.share) { navigator.share({ title: fullName(x) + " — " + mp.title, url: url }).catch(function () {}); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(url).then(function () { toast(t("Посилання на модель скопійовано")); }, function () { toast(url); }); return; }
    toast(url);
  });
  route();
  setTheme(curTheme());
  if (LANG === "fr") { loadFR(applyLang); setTimeout(function () { document.documentElement.classList.remove("i18n-wait"); }, 4000); }
  $("#lbPrev").addEventListener("click", function () { lbStep(-1); });
  $("#lbNext").addEventListener("click", function () { lbStep(1); });
  $("#lbClose").addEventListener("click", lbClose);
  var tx = null;
  $("#lb").addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  $("#lb").addEventListener("touchend", function (e) { if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1); }, { passive: true });
  document.addEventListener("keydown", function (e) {
    if ($("#lb").open && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); lbStep(e.key === "ArrowRight" ? 1 : -1); return; }
    if (e.key === "Escape" && !$("#lb").open && !$("#mp").hidden) { e.preventDefault(); closePage(); return; }
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
