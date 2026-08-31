/* ============================================================================
   MATES — EDITOVACÍ REŽIM (skrytý, zaheslovaný)
   ============================================================================
   Jak otevřít:  stiskněte 5× rychle za sebou klávesu E  (nebo otevřete
                 stránku s #editor na konci adresy, např. /#editor)
   Co umí:       přidat aktualitu a stáhnout aktualizovaný obsah.js,
                 který pak nahrajete na server (nahradí ten starý).

   ZMĚNA HESLA:  v souboru editor.js najděte řádek  var HESLO_HASH = "..."
                 a nahraďte ho novým hashem. Hash vygenerujete přímo
                 v editovacím režimu (sekce „Změnit heslo“) nebo na
                 Raspberry Pi příkazem:
                     echo -n "nove-heslo" | sha256sum

   BEZPEČNOST:   web je statický, takže ochrana heslem je jen orientační
                 (kód si každý může přečíst). Slouží jako zábrana před
                 náhodnou změnou obsahu návštěvníky. Pro pořádné zabezpečení
                 by byl potřeba backend (PHP/Node) — viz README.md.
   ============================================================================ */

(function () {
  "use strict";

  var HESLO_HASH = "e1ab230d48e362c6f066b3cbd8b548c41190aed916df74b12f0c5fe72d827eb1";

  var pridane = [];   // bloky aktualit přidaných v této relaci (jako text)

  /* ------------------------------------------------------------------
     SHA-256 (čistý JS — funguje i na obyčejném http, kde není crypto.subtle)
     ------------------------------------------------------------------ */
  function sha256(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var result = "";
    var words = [];
    var asciiBitLength = ascii.length * 8;
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [];
    var primeCounter = k.length;
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
      if (!isComposite[candidate]) {
        for (var i = 0; i < 313; i += candidate) {
          isComposite[i] = candidate;
        }
        hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
        k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
      }
    }
    ascii += "\x80";
    while (ascii.length % 64 - 56) ascii += "\x00";
    for (i = 0; i < ascii.length; i++) {
      var j = ascii.charCodeAt(i);
      if (j >> 8) return; // jen ASCII
      words[i >> 2] |= j << ((3 - i) % 4) * 8;
    }
    words[words.length] = ((asciiBitLength / maxWord) | 0);
    words[words.length] = asciiBitLength;
    for (j = 0; j < words.length;) {
      var w = words.slice(j, j += 16);
      var oldHash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2];
        var a = hash[0], e = hash[4];
        var temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e & hash[5]) ^ ((~e) & hash[6]))
          + k[i]
          + (w[i] = (i < 16) ? w[i] : (
              w[i - 16]
              + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
              + w[i - 7]
              + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
            ) | 0
          );
        var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }
      for (i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }
    for (i = 0; i < 8; i++) {
      for (j = 3; j + 1; j--) {
        var b = (hash[i] >> (j * 8)) & 255;
        result += ((b < 16) ? 0 : "") + b.toString(16);
      }
    }
    return result;
  }

  function hashHesla(heslo) {
    // podpora českých znaků v hesle (převod na UTF-8 bajty)
    return sha256(unescape(encodeURIComponent(String(heslo))));
  }

  /* ------------------------------------------------------------------
     Pomocníci pro UI
     ------------------------------------------------------------------ */
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  var overlay = null;      // tmavé pozadí
  var promptBox = null;    // přihlašovací okénko
  var panelBox = null;     // editovací panel

  function zobrazOverlay() {
    if (overlay) return;
    overlay = el("div", "edit-overlay");
    overlay.setAttribute("aria-hidden", "false");
    document.body.appendChild(overlay);

    // Přihlášení
    promptBox = el("div", "edit-box");
    promptBox.setAttribute("role", "dialog");
    promptBox.setAttribute("aria-modal", "true");
    promptBox.setAttribute("aria-label", "Odemknutí editovacího režimu");
    promptBox.innerHTML =
      '<span class="eyebrow">Editovací režim</span>' +
      '<h2 class="edit-title">Zadejte heslo</h2>' +
      '<div class="field"><label for="edit-heslo">Heslo</label>' +
      '<input type="password" id="edit-heslo" autocomplete="off"></div>' +
      '<div class="edit-chyba" id="edit-chyba" hidden></div>' +
      '<div class="edit-akce">' +
      '<button type="button" class="btn btn-primary" id="edit-odemknout">Odemknout</button>' +
      '<button type="button" class="btn btn-outline" id="edit-zrusit">Zrušit</button>' +
      "</div>";
    overlay.appendChild(promptBox);

    var hesloInput = promptBox.querySelector("#edit-heslo");
    var chyba = promptBox.querySelector("#edit-chyba");

    function odemknout() {
      var v = hesloInput.value;
      if (!v) return;
      if (hashHesla(v) === HESLO_HASH) {
        overlay.removeChild(promptBox);
        promptBox = null;
        zobrazPanel();
      } else {
        chyba.hidden = false;
        chyba.textContent = "Špatné heslo.";
        hesloInput.select();
      }
    }

    promptBox.querySelector("#edit-odemknout").addEventListener("click", odemknout);
    promptBox.querySelector("#edit-zrusit").addEventListener("click", zavri);
    hesloInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") odemknout();
    });
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) zavri();
    });
    document.addEventListener("keydown", zavriNaEscape);
    setTimeout(function () { hesloInput.focus(); }, 50);
  }

  function zavriNaEscape(e) {
    if (e.key === "Escape") zavri();
  }

  function zavri() {
    if (overlay) {
      overlay.remove();
      overlay = null;
      promptBox = null;
      panelBox = null;
    }
    document.removeEventListener("keydown", zavriNaEscape);
  }

  /* ------------------------------------------------------------------
     Editovací panel
     ------------------------------------------------------------------ */
  function zobrazPanel() {
    panelBox = el("div", "edit-box edit-panel");
    panelBox.setAttribute("role", "dialog");
    panelBox.setAttribute("aria-modal", "true");
    panelBox.setAttribute("aria-label", "Editovací režim MATES");

    var head = el("div", "edit-panel__head");
    head.appendChild(el("span", "eyebrow", "Editovací režim"));
    var closeBtn = el("button", "btn btn-sm btn-outline", "Zavřít (Esc)");
    closeBtn.setAttribute("type", "button");
    closeBtn.addEventListener("click", zavri);
    head.appendChild(closeBtn);
    panelBox.appendChild(head);

    var hint = el("p", "edit-poznamka",
      "Přidáte aktualitu a stáhnete nový obsah.js, který pak nahrajete na server (nahradí ten starý). Pro živý náhled otevřete úvodní stránku.");
    panelBox.appendChild(hint);

    // Formulář
    var pole = [
      { id: "e-tag", label: "Tag (štítek)", ph: "Novinka", povinne: false },
      { id: "e-datum", label: "Datum", ph: "1. 9. 2026", povinne: false },
      { id: "e-nadpis", label: "Nadpis", ph: "Nadpis vaší zprávy", povinne: true },
      { id: "e-text", label: "Text (2–3 věty)", ph: "Krátký popis...", textarea: true, povinne: true },
      { id: "e-odkaz", label: "Odkaz (PDF ke stažení, prázdné = bez tlačítka)", ph: "assets/pdf/2026-2027/vysledky.pdf", povinne: false },
      { id: "e-odkazText", label: "Text tlačítka", ph: "Stáhnout výsledky", povinne: false }
    ];

    var form = el("div", "edit-form");
    pole.forEach(function (p) {
      var f = el("div", "field");
      var label = el("label", null, p.label + (p.povinne ? " *" : ""));
      label.setAttribute("for", p.id);
      f.appendChild(label);
      if (p.textarea) {
        var ta = el("textarea", null);
        ta.id = p.id; ta.placeholder = p.ph || ""; ta.rows = 3;
        f.appendChild(ta);
      } else {
        var inp = el("input");
        inp.type = "text"; inp.id = p.id; inp.placeholder = p.ph || "";
        f.appendChild(inp);
      }
      form.appendChild(f);
    });
    panelBox.appendChild(form);

    var akce = el("div", "edit-akce");
    var addBtn = el("button", "btn btn-primary", "Přidat aktualitu");
    addBtn.setAttribute("type", "button");
    addBtn.addEventListener("click", pridejAktualitu);
    akce.appendChild(addBtn);
    panelBox.appendChild(akce);

    // Přidané v této relaci
    var seznam = el("div", "edit-pridane");
    seznam.id = "edit-pridane";
    panelBox.appendChild(seznam);
    prekresliPridane();

    // Stažení
    var stah = el("div", "edit-stazeni");
    stah.appendChild(el("p", "edit-poznamka", "Až budete hotoví, stáhněte nový obsah.js a nahrajte ho na server."));
    var stahBtn = el("button", "btn btn-chalk btn-full", "Stáhnout obsah.js");
    stahBtn.setAttribute("type", "button");
    stahBtn.addEventListener("click", stahniObsah);
    stah.appendChild(stahBtn);
    var stav = el("div", "edit-chyba", "");
    stav.id = "edit-stav";
    stav.hidden = true;
    stah.appendChild(stav);
    panelBox.appendChild(stah);

    // Změna hesla
    var hesloWrap = el("details", "edit-heslo");
    hesloWrap.appendChild(el("summary", null, "Změnit heslo"));
    var hf = el("div", "edit-form");
    var hfield = el("div", "field");
    var hlabel = el("label", null, "Nové heslo");
    hlabel.setAttribute("for", "e-nove-heslo");
    hfield.appendChild(hlabel);
    var hinp = el("input");
    hinp.type = "text"; hinp.id = "e-nove-heslo";
    hfield.appendChild(hinp);
    hf.appendChild(hfield);
    var hbtn = el("button", "btn btn-outline btn-sm", "Vygenerovat hash");
    hbtn.setAttribute("type", "button");
    var hout = el("p", "edit-hash-vystup", "");
    hbtn.addEventListener("click", function () {
      var v = hinp.value;
      if (!v) return;
      var h = hashHesla(v);
      hout.textContent = "Hash: " + h;
      hout.hidden = false;
      navigator.clipboard && navigator.clipboard.writeText(h).catch(function () {});
    });
    hf.appendChild(hbtn);
    hout.hidden = true;
    hf.appendChild(hout);
    hf.appendChild(el("p", "edit-poznamka",
      "Hash zadejte do souboru editor.js (řádek HESLO_HASH) a nahrajte na server."));
    hesloWrap.appendChild(hf);
    panelBox.appendChild(hesloWrap);

    overlay.appendChild(panelBox);
    var prvni = panelBox.querySelector("input");
    if (prvni) setTimeout(function () { prvni.focus(); }, 50);
  }

  /* ------------------------------------------------------------------
     Přidání aktuality
     ------------------------------------------------------------------ */
  function citace(v) {
    return '"' + String(v).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n") + '"';
  }

  function pridejAktualitu() {
    var g = function (id) {
      var n = document.getElementById(id);
      return n ? n.value.trim() : "";
    };
    var tag = g("e-tag"), datum = g("e-datum"), nadpis = g("e-nadpis"),
        text = g("e-text"), odkaz = g("e-odkaz"), odkazText = g("e-odkazText");

    var stav = document.getElementById("edit-stav");
    if (stav) { stav.hidden = true; stav.textContent = ""; }

    if (!nadpis || !text) {
      if (stav) { stav.hidden = false; stav.textContent = "Vyplňte prosím nadpis i text."; }
      return;
    }

    var blok = "    {\n" +
      "      tag: " + citace(tag || "Novinka") + ",\n" +
      "      datum: " + citace(datum || "") + ",\n" +
      "      nadpis: " + citace(nadpis) + ",\n" +
      "      text: " + citace(text) + ",\n" +
      "      odkaz: " + citace(odkaz || "") + ",\n" +
      "      odkazText: " + citace(odkazText || "Stáhnout výsledky") + "\n" +
      "    },";

    pridane.unshift(blok);
    prekresliPridane();

    // Živý náhled na stránce (úvod)
    if (window.MATES) {
      var novy = {
        tag: tag || "Novinka",
        datum: datum,
        nadpis: nadpis,
        text: text,
        odkaz: odkaz,
        odkazText: odkazText || "Stáhnout výsledky"
      };
      if (!window.MATES.aktuality) window.MATES.aktuality = [];
      window.MATES.aktuality.unshift(novy);
      if (window.MATESUI && window.MATESUI.renderPosts) {
        window.MATESUI.renderPosts();
      }
    }

    ["e-tag", "e-datum", "e-nadpis", "e-text", "e-odkaz", "e-odkazText"].forEach(function (id) {
      var n = document.getElementById(id);
      if (n) n.value = "";
    });

    if (stav) { stav.hidden = false; stav.textContent = "Aktualita přidána (do paměti). Teď stáhněte obsah.js a nahrajte ho na server."; }
  }

  function prekresliPridane() {
    var box = document.getElementById("edit-pridane");
    if (!box) return;
    box.textContent = "";
    if (!pridane.length) {
      box.appendChild(el("p", "edit-poznamka", "Zatím nic nepřidáno."));
      return;
    }
    var nadpis = el("h3", "edit-pridane__nadpis", "Přidáno v této relaci (" + pridane.length + ")");
    box.appendChild(nadpis);
    pridane.forEach(function (b) {
      var pre = el("pre", "edit-kod", b);
      box.appendChild(pre);
    });
    var clear = el("button", "btn btn-outline btn-sm", "Vyčistit");
    clear.setAttribute("type", "button");
    clear.addEventListener("click", function () {
      pridane.length = 0;
      prekresliPridane();
    });
    box.appendChild(clear);
  }

  /* ------------------------------------------------------------------
     Generování nového obsah.js
     ------------------------------------------------------------------ */
  function stahniObsah() {
    var stav = document.getElementById("edit-stav");
    function zprava(ok, text) {
      if (!stav) return;
      stav.hidden = false;
      stav.className = "edit-chyba" + (ok ? " edit-ok" : "");
      stav.textContent = text;
    }

    var bloky = pridane.join("\n");

    function stahniText(text, nazev) {
      var blob = new Blob([text], { type: "application/javascript;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = el("a");
      a.href = url;
      a.download = nazev || "obsah.js";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    }

    function overVystup(text) {
      // Ověří, že vygenerovaný soubor jde načíst jako skript
      var stary = window.MATES;
      try {
        new Function(text)();
        var ok = !!window.MATES;
        window.MATES = stary;
        return ok;
      } catch (err) {
        window.MATES = stary;
        return false;
      }
    }

    // 1) Pokus: vezmeme původní obsah.js a vložíme nové bloky (zachová komentáře)
    if (window.fetch) {
      fetch("obsah.js", { cache: "no-store" })
        .then(function (r) { return r.ok ? r.text() : null; })
        .then(function (text) {
          if (text === null) throw new Error("nacteni");
          // pozor: hledáme řádek se skutečnou deklarací, ne zmínku v komentáři
          var m = /(\n\s*aktuality\s*:\s*\[)/.exec(text);
          if (!m) throw new Error("znacka");
          var vystup = text.slice(0, m.index + m[0].length) +
            (bloky ? "\n" + bloky : "") +
            text.slice(m.index + m[0].length);
          if (!overVystup(vystup)) throw new Error("syntax");
          stahniText(vystup, "obsah.js");
          zprava(true, "Staženo. Nahrajte soubor obsah.js na server (nahradí ten starý).");
        })
        .catch(function (err) {
          // 2) Záložní: vygenerujeme obsah.js z paměti (bez komentářů)
          var vystup = "/* Vygenerováno editovacím režimem MATES " + new Date().toISOString() +
            " (původní obsah.js se nepodařilo načíst, komentáře se nezachovaly). */\n" +
            "window.MATES = " + JSON.stringify(window.MATES, null, 2) + ";\n";
          if (!overVystup(vystup)) {
            zprava(false, "Nepodařilo se vygenerovat soubor. Zkuste to prosím znovu nebo upravte obsah.js ručně (NAVOD.md).");
            return;
          }
          stahniText(vystup, "obsah.js");
          zprava(true, "Staženo (bez komentářů — soubor obsah.js se nepodařilo načíst). Nahrajte ho na server.");
        });
    } else {
      zprava(false, "Tento prohlížeč nepodporuje stažení souboru.");
    }
  }

  /* ------------------------------------------------------------------
     Spuštění: klávesa E ×5 nebo adresa s #editor
     ------------------------------------------------------------------ */
  var casy = [], posledni = 0;
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT")) return;
    if (e.key !== "e" && e.key !== "E") return;
    var now = Date.now();
    if (now - posledni > 2000) casy.length = 0;
    posledni = now;
    casy.push(now);
    if (casy.length >= 5) {
      casy.length = 0;
      if (!overlay) zobrazOverlay();
    }
  });

  if (/[#&]editor\b/.test(window.location.hash)) {
    zobrazOverlay();
  }

  /* Vystaveno pro testování */
  window.MATESEDIT = { sha256: sha256, hashHesla: hashHesla };
})();
