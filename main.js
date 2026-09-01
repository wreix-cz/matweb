

(function () {
  "use strict";

  var DATA = window.MATES;

  

  function showError(msg) {
    var box = document.getElementById("chyba-obsah");
    if (box) {
      box.hidden = false;
      box.textContent = msg;
    }
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function link(href, cls, text) {
    var node = el("a", cls, text);
    node.href = href;
    node.target = "_blank";
    node.rel = "noopener";
    return node;
  }

  function arrowSvg() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "13");
    svg.setAttribute("height", "13");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    var line = document.createElementNS(ns, "line");
    line.setAttribute("x1", "5"); line.setAttribute("y1", "12");
    line.setAttribute("x2", "19"); line.setAttribute("y2", "12");
    var poly = document.createElementNS(ns, "polyline");
    poly.setAttribute("points", "12 5 19 12 12 19");
    svg.appendChild(line);
    svg.appendChild(poly);
    return svg;
  }

  
  function paragraphs(text) {
    return String(text || "").split(/\n\s*\n/);
  }

  

  function fillContact() {
    if (!DATA.kontakt) return;
    var k = DATA.kontakt;
    var map = { email: k.email, skola: k.skola, adresa: k.adresa, rocnik: k.rocnik, rok: k.rokVzniku, osoba: k.osoba };

    document.querySelectorAll("[data-z]").forEach(function (node) {
      var key = node.getAttribute("data-z");
      if (key === "rok-letos") {
        node.textContent = String(new Date().getFullYear());
        return;
      }
      if (key === "email-link") {
        node.textContent = k.email;
        node.href = "mailto:" + k.email;
        return;
      }
      if (key === "telefon") {
        node.textContent = k.telefon;
        var cisla = String(k.telefon).replace(/[^\d+]/g, "");
        if (cisla) node.href = "tel:" + cisla;
        return;
      }
      if (map[key] !== undefined) node.textContent = map[key];
    });
  }

  

  function renderHero() {
    if (!DATA.hero) return;
    var h = DATA.hero;

    var stav = document.getElementById("hero-stav");
    if (stav && h.stav) stav.textContent = h.stav;

    var pod = document.getElementById("hero-podtitulek");
    if (pod && h.podtitulek) pod.textContent = h.podtitulek;

    var pozn = document.getElementById("hero-poznamka");
    var poznamka = (DATA.vzhled && DATA.vzhled.poznamka) || "";
    if (pozn) {
      if (poznamka) { pozn.hidden = false; pozn.textContent = poznamka; }
      else pozn.hidden = true;
    }

    var stats = document.getElementById("hero-statistiky");
    if (stats && h.statistiky) {
      stats.textContent = "";
      h.statistiky.forEach(function (s) {
        var d = el("div", "hero__stat");
        var b = el("b", null, s.cislo);
        d.appendChild(b);
        d.appendChild(document.createTextNode(s.text));
        stats.appendChild(d);
      });
    }
  }

  function renderHeroFotka() {
    if (!DATA.vzhled) return;
    var f = document.getElementById("hero-fotka");
    if (f && DATA.vzhled.heroFotka) f.style.backgroundImage = "url('" + DATA.vzhled.heroFotka + "')";
  }

  function renderPageFotka() {
    if (!DATA.vzhled) return;
    var f = document.getElementById("page-fotka");
    if (f && DATA.vzhled.strankyFotka) f.style.backgroundImage = "url('" + DATA.vzhled.strankyFotka + "')";
  }

  
  function excerptOf(text) {
    var s = String(text || "").split(/\n\s*\n/)[0].replace(/\s+/g, " ").trim();
    if (s.length <= 150) return s;
    var cut = s.slice(0, 150);
    var sp = cut.lastIndexOf(" ");
    return (sp > 80 ? cut.slice(0, sp) : cut) + "…";
  }

  
  function postBody(a) {
    var frag = document.createDocumentFragment();
    paragraphs(a.text).forEach(function (p) {
      if (p) frag.appendChild(el("p", "worksheet__excerpt", p));
    });
    if (a.odkaz && a.odkazText) {
      var la = link(a.odkaz, "worksheet__link", a.odkazText);
      la.target = "_self";
      la.rel = "";
      la.appendChild(arrowSvg());
      frag.appendChild(la);
    }
    return frag;
  }

  
  function fullCard(a, id) {
    var card = el("article", "worksheet worksheet--full");
    if (id) card.id = id;

    var top = el("div", "worksheet__top");
    if (a.tag) top.appendChild(el("span", "worksheet__tag", a.tag));
    if (a.datum) top.appendChild(el("time", "worksheet__date", a.datum));
    card.appendChild(top);

    var title = el("h3", "worksheet__title");
    if (a.nadpis) {
      if (a.odkaz) {
        var ta = link(a.odkaz, null, a.nadpis);
        ta.target = "_self";
        ta.rel = "";
        title.appendChild(ta);
      } else {
        title.textContent = a.nadpis;
      }
    }
    card.appendChild(title);
    card.appendChild(postBody(a));
    return card;
  }

  
  function compactCard(a) {
    var card = el("article", "worksheet worksheet--compact");

    var top = el("div", "worksheet__top");
    if (a.tag) top.appendChild(el("span", "worksheet__tag", a.tag));
    if (a.datum) top.appendChild(el("time", "worksheet__date", a.datum));
    card.appendChild(top);

    var title = el("h3", "worksheet__title");
    if (a.nadpis) title.textContent = a.nadpis;
    card.appendChild(title);

    var exc = el("p", "worksheet__excerpt worksheet__excerpt--clamp", excerptOf(a.text));
    card.appendChild(exc);

    var needsToggle = String(a.text || "").length > 160;
    if (needsToggle) {
      var btn = el("button", "worksheet__toggle");
      btn.type = "button";
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = "Rozbalit";
      card.appendChild(btn);

      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        if (expanded) {
          exc.classList.add("worksheet__excerpt--clamp");
          btn.setAttribute("aria-expanded", "false");
          btn.textContent = "Rozbalit";
        } else {
          exc.classList.remove("worksheet__excerpt--clamp");
          btn.setAttribute("aria-expanded", "true");
          btn.textContent = "Zabalit";
        }
      });
    }
    return card;
  }

  
  function renderPosts() {
    var grid = document.getElementById("posts-grid");
    if (!grid) return;
    grid.textContent = "";

    var polozky = DATA.aktuality || [];
    if (!polozky.length) {
      grid.appendChild(el("p", "empty-state", "Zatím žádné příspěvky – přidejte je v obsah.js."));
      return;
    }

    
    if (document.getElementById("all-posts")) {
      polozky.forEach(function (a, i) {
        grid.appendChild(fullCard(a, "post-" + i));
      });
      var m = /^#post-(\d+)$/.exec(window.location.hash || "");
      if (m) {
        var target = document.getElementById("post-" + m[1]);
        if (target) {
          target.classList.add("highlight");
          setTimeout(function () {
            target.scrollIntoView({ block: "start", behavior: "smooth" });
          }, 80);
        }
      }
      return;
    }

    polozky.slice(0, 3).forEach(function (a, idx) {
      grid.appendChild(idx === 0 ? fullCard(a) : compactCard(a));
    });
  }

  

  function renderSerie() {
    var box = document.getElementById("serie-karta");
    if (!box || !DATA.aktualniSerie) return;
    var s = DATA.aktualniSerie;

    box.textContent = "";

    var head = el("div", "assignment__head");
    if (s.label) head.appendChild(el("p", "assignment__label", s.label));
    if (s.nadpis) head.appendChild(el("h2", "assignment__title", s.nadpis));
    if (s.termin) {
      var dl = el("span", "assignment__deadline");
      var dlSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      dlSvg.setAttribute("width", "14"); dlSvg.setAttribute("height", "14");
      dlSvg.setAttribute("viewBox", "0 0 24 24");
      dlSvg.setAttribute("fill", "none"); dlSvg.setAttribute("stroke", "currentColor");
      dlSvg.setAttribute("stroke-width", "2"); dlSvg.setAttribute("stroke-linecap", "round");
      dlSvg.setAttribute("stroke-linejoin", "round"); dlSvg.setAttribute("aria-hidden", "true");
      dlSvg.innerHTML = '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>';
      dl.appendChild(dlSvg);
      dl.appendChild(document.createTextNode(s.termin));
      head.appendChild(dl);
    }
    box.appendChild(head);

    var body = el("div", "assignment__body");
    paragraphs(s.popis).forEach(function (p) {
      if (p) body.appendChild(el("p", null, p));
    });

    if (s.pdf || s.pdfNazev) {
      var dl = el("div", "assignment__download");
      var file = el("div", "assignment__file");
      if (s.pdfNazev) file.appendChild(el("strong", null, s.pdfNazev));
      file.appendChild(el("span", null, "PDF dokument · aktuální série"));
      dl.appendChild(file);

      if (s.pdf) {
        var btn = link(s.pdf, "btn btn-primary", "Stáhnout PDF");
        btn.setAttribute("download", "");
        btn.target = "_self";
        btn.rel = "";
        var dlSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        dlSvg.setAttribute("width", "16"); dlSvg.setAttribute("height", "16");
        dlSvg.setAttribute("viewBox", "0 0 24 24");
        dlSvg.setAttribute("fill", "none"); dlSvg.setAttribute("stroke", "currentColor");
        dlSvg.setAttribute("stroke-width", "2"); dlSvg.setAttribute("stroke-linecap", "round");
        dlSvg.setAttribute("stroke-linejoin", "round"); dlSvg.setAttribute("aria-hidden", "true");
        dlSvg.innerHTML = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>';
        btn.insertBefore(dlSvg, btn.firstChild);
        dl.appendChild(btn);
      } else {
        dl.appendChild(el("span", "text-muted", "PDF bude brzy k dispozici"));
      }
      body.appendChild(dl);
    }

    if (s.jakOdevzdat) {
      var info = el("div", "assignment__info");
      info.appendChild(el("h3", null, "Jak odevzdat řešení?"));
      var text = s.jakOdevzdat;
      if (DATA.kontakt && DATA.kontakt.email) {
        text = text.replace("{email}", DATA.kontakt.email);
      }
      var pEl = el("p");
      
      var email = (DATA.kontakt && DATA.kontakt.email) || null;
      if (email && text.indexOf(email) !== -1) {
        var before = text.split(email);
        before.forEach(function (part, i) {
          if (part) pEl.appendChild(document.createTextNode(part));
          if (i < before.length - 1) {
            var a = el("a");
            a.href = "mailto:" + email;
            a.textContent = email;
            pEl.appendChild(a);
          }
        });
      } else {
        pEl.textContent = text;
      }
      info.appendChild(pEl);
      body.appendChild(info);
    }

    box.appendChild(body);
  }

  

  function renderArchiv() {
    var list = document.getElementById("archiv-seznam");
    if (!list) return;
    list.textContent = "";

    var rocniky = DATA.archiv || [];
    if (!rocniky.length) {
      list.appendChild(el("p", "empty-state", "Archiv je zatím prázdný – série se přidávají v obsah.js."));
      return;
    }

    rocniky.forEach(function (rok) {
      var item = el("div", "archiv-item");
      var btn = el("button", "archiv-toggle");
      btn.setAttribute("type", "button");
      btn.setAttribute("aria-expanded", "false");
      btn.appendChild(el("span", null, "Ročník " + rok.rocnik));

      var chevron = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      chevron.setAttribute("class", "archiv-chevron");
      chevron.setAttribute("viewBox", "0 0 24 24");
      chevron.setAttribute("fill", "none"); chevron.setAttribute("stroke", "currentColor");
      chevron.setAttribute("stroke-width", "2"); chevron.setAttribute("stroke-linecap", "round");
      chevron.setAttribute("stroke-linejoin", "round"); chevron.setAttribute("aria-hidden", "true");
      chevron.innerHTML = '<polyline points="6 9 12 15 18 9"/>';
      btn.appendChild(chevron);
      item.appendChild(btn);

      var panel = el("div", "archiv-panel");
      var clip = el("div", "archiv-panel__clip");
      var inner = el("div", "archiv-panel__inner");

      (rok.serie || []).forEach(function (s) {
        var series = el("div", "archiv-series");
        if (s.pdf) {
          var a = link(s.pdf, "archiv-link", s.nazev);
          a.appendChild(el("span", "tag", "PDF"));
          series.appendChild(a);
        } else {
          var d = el("div", "archiv-link disabled");
          d.appendChild(el("span", null, s.nazev));
          d.appendChild(el("span", "tag", "brzy"));
          series.appendChild(d);
        }
        if (s.vzorove) {
          var vz = link(s.vzorove, "archiv-link", "Vzorové řešení – " + s.nazev);
          vz.appendChild(el("span", "tag", (String(s.vzorove).match(/\.([a-z0-9]+)$/i) || ["", "pdf"])[1].toUpperCase()));
          series.appendChild(vz);
        }
        inner.appendChild(series);
      });

      clip.appendChild(inner);
      panel.appendChild(clip);
      item.appendChild(panel);
      list.appendChild(item);

      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        panel.classList.toggle("open");
      });
    });
  }

  

  function renderONas() {
    var box = document.getElementById("o-nas");
    if (!box || !DATA.oNas) return;
    box.textContent = "";

    DATA.oNas.forEach(function (blok) {
      var article = el("article");
      if (blok.nadpis) article.appendChild(el("h3", null, blok.nadpis));
      paragraphs(blok.text).forEach(function (p) {
        if (p) article.appendChild(el("p", null, p));
      });
      box.appendChild(article);
    });
  }

  function renderKontakt() {
    var list = document.getElementById("kontakt-list");
    if (!list || !DATA.kontakt) return;
    var k = DATA.kontakt;
    list.textContent = "";

    var icons = {
      email: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
      user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      skola: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
    };

    var rows = [
      { icon: "email", label: "E-mail", value: k.email, href: "mailto:" + k.email },
      { icon: "user", label: "Kontaktní osoba", value: k.osoba + "\n" + k.telefon },
      { icon: "skola", label: "Pořadatel", value: k.skola + "\n" + k.adresa, logo: true }
    ];

    rows.forEach(function (r) {
      var item = el("div", "info-item");
      var icon = el("span", "info-item__icon");
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "none"); svg.setAttribute("stroke", "currentColor");
      svg.setAttribute("stroke-width", "2"); svg.setAttribute("stroke-linecap", "round");
      svg.setAttribute("stroke-linejoin", "round"); svg.setAttribute("aria-hidden", "true");
      svg.innerHTML = icons[r.icon];
      icon.appendChild(svg);
      item.appendChild(icon);

      var wrap = el("div");
      wrap.appendChild(el("div", "info-item__label", r.label));
      var value = el("div", "info-item__value");
      if (r.href) {
        var a = el("a");
        a.href = r.href;
        a.textContent = r.value;
        value.appendChild(a);
      } else {
        String(r.value).split("\n").forEach(function (line, i, arr) {
          value.appendChild(document.createTextNode(line));
          if (i < arr.length - 1) value.appendChild(document.createElement("br"));
        });
      }
      wrap.appendChild(value);
      if (r.logo) {
        var la = el("a");
        la.href = "https://www.gympolicka.cz";
        la.target = "_blank";
        la.rel = "noopener";
        la.setAttribute("aria-label", "Gymnázium Polička – web školy");
        var img = el("img", "info-item__logo");
        img.src = "assets/images/skola-logo.webp";
        img.alt = "Gymnázium Polička";
        la.appendChild(img);
        wrap.appendChild(la);
      }
      item.appendChild(wrap);
      list.appendChild(item);
    });
  }

  

  
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  
  function initSearch() {
    var toggle = document.getElementById("search-toggle");
    var header = document.querySelector(".site-header");
    if (!toggle || !header) return;

    
    var panel = el("div", "search-panel");
    panel.id = "search-panel";
    panel.hidden = true;

    var wrap = el("div", "container");
    var bar = el("div", "search-panel__bar");
    var input = el("input");
    input.type = "search";
    input.className = "search__input";
    input.setAttribute("placeholder", "Hledat příspěvky, série, články…");
    input.setAttribute("aria-label", "Vyhledat na webu");
    input.setAttribute("autocomplete", "off");
    bar.appendChild(input);

    var closeBtn = el("button", "search-panel__close");
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Zavřít vyhledávání");
    closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    bar.appendChild(closeBtn);
    wrap.appendChild(bar);

    var results = el("div", "search__results");
    results.id = "search-results";
    results.hidden = true;
    wrap.appendChild(results);
    panel.appendChild(wrap);
    header.appendChild(panel);

    var open = false;

    function closePanel() {
      if (!open) return;
      open = false;
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      input.value = "";
      results.hidden = true;
      results.textContent = "";
    }

    function openPanel() {
      open = true;
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      input.focus();
    }

    toggle.addEventListener("click", function () {
      if (open) closePanel();
      else openPanel();
    });
    closeBtn.addEventListener("click", closePanel);
    document.addEventListener("click", function (e) {
      if (!open) return;
      if (panel.contains(e.target) || toggle.contains(e.target)) return;
      closePanel();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && open) closePanel();
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var first = results.querySelector("a");
        if (first) window.location.href = first.getAttribute("href");
      }
    });

    
    function slovoShoda(hay, qw) {
      var parts = hay.split(/\s+/);
      for (var j = 0; j < parts.length; j++) {
        var w = parts[j];
        if (w === qw) return true;
        if (w.length >= 5 && qw.length >= 4 && w.slice(0, 5) === qw.slice(0, 5)) return true;
      }
      return false;
    }

    function hit(hay, q) {
      var words = q.split(/\s+/).filter(Boolean);
      for (var i = 0; i < words.length; i++) {
        if (!slovoShoda(hay, words[i])) return false;
      }
      return true;
    }

    
    function doSearch(input, results) {
      var q = norm(input.value.trim());
      if (q.length < 2) {
        results.hidden = true;
        results.textContent = "";
        return;
      }

      var hits = [];

      (DATA.aktuality || []).forEach(function (a, i) {
        if (hit(norm(a.nadpis + " " + a.text), q)) {
          hits.push({ type: "Příspěvek" + (a.datum ? " · " + a.datum : ""), label: a.nadpis, href: "/vsechny-prispevky/#post-" + i });
        }
      });

      (DATA.archiv || []).forEach(function (rok) {
        (rok.serie || []).forEach(function (s) {
          if (hit(norm(s.nazev + " " + rok.rocnik), q)) {
            hits.push({ type: "Archiv · " + rok.rocnik, label: s.nazev, href: "/archiv/" });
          }
        });
      });

      (DATA.oNas || []).forEach(function (o) {
        if (hit(norm(o.nadpis + " " + o.text), q)) {
          hits.push({ type: "O soutěži", label: o.nadpis, href: "/o-soutezi/" });
        }
      });


      
      if (q.indexOf("prispev") !== -1 || q.indexOf("vsechny") !== -1 || q.indexOf("posts") !== -1) {
        hits.unshift({ type: "Stránka", label: "Všechny příspěvky", href: "/vsechny-prispevky/" });
      }

      
      if (q.indexOf("matesgympol") !== -1 || q.indexOf("gympolicka") !== -1 || q.indexOf("mates policka") !== -1 || q.indexOf("policka mates") !== -1) {
        hits.unshift({ type: "Stránka", label: "O soutěži MATES", href: "/o-soutezi/" });
        hits.unshift({ type: "Stránka", label: "MATES – Úvod", href: "/" });
      }

      
      if (q.indexOf("olympiad") !== -1 || q.indexOf("soutez") !== -1 || q.indexOf("matematik") !== -1 || q.indexOf("uloh") !== -1) {
        if (!hits.length || (hits.length < 3 && hits[0].href !== "/")) {
          hits.unshift({ type: "Stránka", label: "Aktuální zadání – MATES", href: "/aktualni-zadani/" });
        }
      }

      results.textContent = "";
      results.hidden = false;

      if (!hits.length) {
        results.appendChild(el("p", "search__empty", "Nic jsme nenašli – zkuste jiné slovo."));
        return;
      }

      hits.slice(0, 12).forEach(function (h) {
        var item = el("div", "search__result");
        item.appendChild(el("span", "search__result-type", h.type));
        var a = el("a");
        a.href = h.href;
        a.textContent = h.label;
        item.appendChild(a);
        results.appendChild(item);
      });
    }

    input.addEventListener("input", function () { doSearch(input, results); });

    
    var mobileInput = document.getElementById("mobile-search-input");
    var mobileResults = document.getElementById("mobile-search-results");
    if (mobileInput && mobileResults) {
      mobileInput.addEventListener("input", function () { doSearch(mobileInput, mobileResults); });
      mobileInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          var first = mobileResults.querySelector("a");
          if (first) window.location.href = first.getAttribute("href");
        }
      });
    }
  }

  

  function initMenu() {
    var navToggle = document.querySelector(".nav__toggle");
    var mobileNav = document.getElementById("mobile-navigation");
    var mobileNavOverlay = document.getElementById("mobile-nav-overlay");
    var mobileNavClose = document.querySelector(".mobile-nav__close");
    if (!navToggle || !mobileNav) return;

    function isMobile() { return window.innerWidth <= 900; }

    function open() {
      if (!isMobile()) return;
      mobileNav.classList.add("active");
      if (mobileNavOverlay) mobileNavOverlay.classList.add("active");
      mobileNav.setAttribute("aria-hidden", "false");
      if (mobileNavOverlay) mobileNavOverlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      navToggle.classList.add("active");
      navToggle.setAttribute("aria-expanded", "true");
      var firstLink = mobileNav.querySelector("a");
      if (firstLink) setTimeout(function () { firstLink.focus(); }, 100);
    }

    function close() {
      mobileNav.classList.remove("active");
      if (mobileNavOverlay) mobileNavOverlay.classList.remove("active");
      mobileNav.setAttribute("aria-hidden", "true");
      if (mobileNavOverlay) mobileNavOverlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      navToggle.classList.remove("active");
      navToggle.setAttribute("aria-expanded", "false");
    }

    navToggle.addEventListener("click", function (e) {
      e.preventDefault();
      if (mobileNav.classList.contains("active")) close();
      else open();
    });
    if (mobileNavClose) mobileNavClose.addEventListener("click", close);
    if (mobileNavOverlay) mobileNavOverlay.addEventListener("click", close);
    mobileNav.querySelectorAll(".mobile-nav__list a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("active")) close();
    });

    mobileNav.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var focusable = mobileNav.querySelectorAll("a[href], button");
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    window.addEventListener("resize", function () {
      if (!isMobile() && mobileNav.classList.contains("active")) close();
    });
  }

  

  function main() {
    if (!DATA) {
      showError("Nepodařilo se načíst obsah. Zkontroluj obsah.js — chybí čárka, uvozovka nebo závorka? (návod v NAVOD.md)");
      initMenu();
      return;
    }
    try {
      fillContact();
      renderHeroFotka();
      renderPageFotka();
      renderHero();
      renderPosts();
      renderSerie();
      renderArchiv();
      renderONas();
      renderKontakt();
      initSearch();
      initMenu();
    } catch (err) {
      showError("Chyba při vykreslování: " + err.message + " (viz NAVOD.md)");
      if (window.console) console.error(err);
    }
    
    document.querySelectorAll("[aria-busy]").forEach(function (n) {
      n.setAttribute("aria-busy", "false");
    });
  }

  

  
  function applyLogoTheme() {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    document.querySelectorAll(".nav__logo").forEach(function (img) {
      img.style.opacity = "0";
      setTimeout(function () {
        img.setAttribute("src", dark ? "assets/images/logo-white.webp" : "assets/images/logo.webp");
        var picture = img.parentElement;
        if (picture && picture.tagName === "PICTURE") {
          var source = picture.querySelector("source");
          if (source) source.setAttribute("srcset", dark ? "assets/images/logo-white.avif" : "assets/images/logo.avif");
        }
        img.style.opacity = "1";
      }, 150);
    });
  }
  applyLogoTheme();

  document.querySelectorAll(".theme-toggle").forEach(function (b) {
    b.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      applyLogoTheme();
      try { localStorage.setItem("mates-theme", next); } catch (e) {}
    });
  });

  var hdr = document.querySelector(".site-header");
  function onScroll() {
    if (hdr) hdr.classList.toggle("is-scrolled", (window.scrollY || 0) > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }

  
  window.MATESUI = {
    renderPosts: renderPosts,
    renderAktuality: renderPosts
  };
})();
