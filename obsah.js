/* ============================================================================
   OBSAH WEBU MATES  —  TADY SE MĚNÍ VŠECHNO
   ============================================================================

   Tohle je JEDINÝ soubor, který jako editor webu potřebujete upravovat.
   Mění se v něm: aktuality (posty), aktuální série, archiv, texty, kontakt,
   fotky a poznámky.

   Jak na to?
   - Pište texty VŽDY mezi uvozovky:   "takhle"
   - Každou položku v seznamu oddělte čárkou.  (poslední čárka nevadí)
   - Nic jiného neměňte — nemažte závorky ani názvy polí jako "nadpis:".
   - Po uložení stačí stránku obnovit (F5). Nic se negeneruje.

   Když se na stránce nahoře objeví červený pruh „Nepodařilo se načíst obsah“,
   znamená to, že v tomto souboru chybí čárka, uvozovka nebo závorka.
   Podrobný návod je v souboru NAVOD.md (ve stejné složce).
   ============================================================================ */

window.MATES = {

  /* ------------------------------------------------------------------
     KONTAKT — používá se v patičce a na stránce O soutěži
     ------------------------------------------------------------------
     - osoba:   jméno kontaktní osoby
     - telefon: telefon, jak se má zobrazit (klikací odkaz se vytvoří sám)
     ------------------------------------------------------------------ */
  kontakt: {
    email: "matesgympol@gmail.com",
    osoba: "Anežka Zahradníčková",
    telefon: "Tel. 731 073 582",
    skola: "Gymnázium Polička",
    adresa: "Nám. Republiky 101, 572 01 Polička",
    rocnik: "2025/2026",
    rokVzniku: "2017"
  },

  /* ------------------------------------------------------------------
     FOTKY A POZADÍ — stačí přepsat název souboru
     ------------------------------------------------------------------
     - heroFotka:    velká fotka na úvodní stránce (do assets/images/)
     - strankyFotka: jemná fotka na pozadí vnitřních stránek
     - poznamka:     ručně psaný vzkaz u tlačítek na úvodní stránce
                     (prázdné "" = žádný vzkaz)
     ------------------------------------------------------------------ */
  vzhled: {
    heroFotka: "assets/images/back1.webp",
    strankyFotka: "assets/images/back2.webp",
    poznamka: "Řešení zasílejte do termínu! ;)"
  },

  /* ------------------------------------------------------------------
     ÚVODNÍ STRÁNKA — horní část (hero)
     ------------------------------------------------------------------ */
  hero: {
    stav: "Ročník 2025/2026",
    podtitulek: "Matematická korespondenční soutěž pro žáky 6. a 7. tříd základních škol. Organizováno studenty Gymnázia Polička.",
    // Čísla a popisky pod tlačítky:
    statistiky: [
      { cislo: "04", text: "série ročně" },
      { cislo: "06–07", text: "třída ZŠ" },
      { cislo: "2017", text: "rok vzniku" }
    ]
  },

  /* ------------------------------------------------------------------
     PŘÍSPĚVKY — posty na úvodní stránce
     ------------------------------------------------------------------
     Na úvodní stránce se zobrazí 3 NEJNOVĚJŠÍ příspěvky: první celý,
     další dva jen s nadpisem a krátkým úryvkem (Rozbalit/Zabalit).
     VŠECHNY příspěvky jsou na stránce /vsechny-prispevky/ — dostaneš
     se tam kliknutím na nadpis „Příspěvky“ na úvodní stránce nebo přes
     vyhledávání (lupa v menu).

     JAK PŘIDAT NOVÝ PŘÍSPĚVEK:
     1) Zkopírujte celý blok v závorkách { ... } z ukázky níže.
     2) Vložte ho na ZAČÁTEK seznamu (hned za "aktuality: [").
     3) Do uvozovek doplňte: tag (štítek), datum, nadpis, text, odkaz.
     4) Ukončete ho čárkou (jako v ukázce) a soubor uložte.

     - tag:   krátký štítek nahoře na kartě, např. "Novinka", "Výsledky"
     - datum: jak chcete, např. "1. 9. 2026"
     - nadpis: titulek postu
     - text:  text postu (2–3 věty; odstavce oddělte prázdným řádkem)
     - odkaz + odkazText: VOLITELNÉ tlačítko ke stažení pod textem, např.
              odkaz: "assets/pdf/...pdf" a odkazText: "Stáhnout výsledky".
              Textová tlačítka jako "Číst více" už nepoužíváme — prázdné
              odkaz: "" = tlačítko se nezobrazí
     ------------------------------------------------------------------ */
  aktuality: [
    {
      tag: "Výsledky",
      datum: "15. 6. 2026",
      nadpis: "Výsledková listina 2026",
      text: "Kompletní výsledková listina ročníku 2025/2026 je ke stažení. Gratulujeme všem řešitelům!",
      odkaz: "assets/pdf/2025-2026/vysledky.pdf",
      odkazText: "Stáhnout výsledky"
    },
    {
      tag: "Novinka",
      datum: "1. 9. 2025",
      nadpis: "Spouštíme nový ročník 2025/2026!",
      text: "Přihlašování není potřeba – stačí stáhnout zadání první série a zaslat řešení do uvedeného termínu."
    }
  ],


  /* ------------------------------------------------------------------
     AKTUÁLNÍ ZADÁNÍ — stránka /aktualni-zadani/
     ------------------------------------------------------------------
     Když vyjde nová série:
     1) Nahrajte PDF do složky assets/pdf/ (např. jako 4-serie.pdf).
     2) Zde upravte: label (která série), nadpis, termin, popis,
        pdfNazev a pdf (cestu k souboru).
     ------------------------------------------------------------------ */
  aktualniSerie: {
    label: "3. série",
    nadpis: "Matematická korespondenční soutěž – 3. série 2025/2026",
    termin: "Termín odevzdání: 31. 3. 2026",
    popis: "Třetí série úloh pro ročník 2025/2026 je nyní k dispozici ke stažení. Řešení zasílejte poštou nebo elektronicky do uvedeného termínu. Každá série obsahuje čtyři příklady – za každý lze získat až 10 bodů.",
    pdfNazev: "MATES 3. série 2025/2026.pdf",
    pdf: "assets/pdf/2025-2026/3-serie.pdf",
    jakOdevzdat: "Řešení zasílejte poštou nebo elektronicky na adresu {email} vždy do uvedeného termínu. Do předmětu uveďte své jméno, školu a třídu."
  },

  /* ------------------------------------------------------------------
     ARCHIV — stránka /archiv/
     ------------------------------------------------------------------
     JAK PŘIDAT SÉRII DO ARCHIVU:
     1) Nahrajte PDF do assets/pdf/ (např. assets/pdf/2024-2025/4-serie.pdf).
     2) Do příslušného ročníku doplňte řádek:
          { nazev: "4. série", pdf: "assets/pdf/2024-2025/4-serie.pdf" },
     3) Nemáte-li PDF, nechte pole pdf prázdné:
          { nazev: "4. série", pdf: "" },
        řádek se pak zobrazí šedě s nápisem "brzy".

     VZOROVÁ ŘEŠENÍ (od ročníku 2025/2026):
     K sérii můžete přidat i vzorové řešení — nahrajte soubor do podsložky
     assets/pdf/<ročník>/vzorove/ a doplňte pole vzorove:
          { nazev: "1. série", pdf: "assets/pdf/2025-2026/1-serie.pdf",
            vzorove: "assets/pdf/2025-2026/vzorove/vzorove-1-serie.pdf" },
     Prázdné vzorove: "" = žádné vzorové řešení (odkaz se nezobrazí).
     ------------------------------------------------------------------ */
  archiv: [
    {
      rocnik: "2025/2026",
      serie: [
        { nazev: "1. série", pdf: "assets/pdf/2025-2026/1-serie.pdf", vzorove: "" },
        { nazev: "2. série", pdf: "assets/pdf/2025-2026/2-serie.pdf", vzorove: "" },
        { nazev: "3. série", pdf: "assets/pdf/2025-2026/3-serie.pdf", vzorove: "assets/pdf/2025-2026/vzorove/vzorove-3-serie.pdf" },
        { nazev: "4. série", pdf: "assets/pdf/2025-2026/4-serie.pdf", vzorove: "assets/pdf/2025-2026/vzorove/vzorove-4-serie.docx" },
        { nazev: "Výsledková listina", pdf: "assets/pdf/2025-2026/vysledky.pdf" }
      ]
    },
    {
      rocnik: "2024/2025",
      serie: [
        { nazev: "1. série", pdf: "" },
        { nazev: "2. série", pdf: "" },
        { nazev: "3. série", pdf: "" },
        { nazev: "4. série", pdf: "" }
      ]
    },
    {
      rocnik: "2023/2024",
      serie: [
        { nazev: "1. série", pdf: "assets/pdf/Rok%202023%20%202024/Pribeh-1.-serie-2.docx" }
      ]
    },
    {
      rocnik: "2022/2023",
      serie: [
        { nazev: "1. série", pdf: "assets/pdf/Rok%202022%20%202023/Pribeh-1.-serie-1.docx" },
        { nazev: "2. série", pdf: "assets/pdf/Rok%202022%20%202023/Pribeh-2.-serie_zkraceno.docx" },
        { nazev: "3. série", pdf: "assets/pdf/Rok%202022%20%202023/Pribeh-3.-serie.docx" },
        { nazev: "4. série", pdf: "assets/pdf/Rok%202022%20%202023/Pribeh-4.-serie.docx" }
      ]
    },
    {
      rocnik: "2021/2022",
      serie: [
        { nazev: "1. série", pdf: "assets/pdf/2021-2022/1-serie.pdf" },
        { nazev: "2. série", pdf: "assets/pdf/2021-2022/2-serie.pdf" },
        { nazev: "3. série", pdf: "assets/pdf/2021-2022/3-serie.pdf" }
      ]
    },
    {
      rocnik: "2020/2021",
      serie: [
        { nazev: "1. série", pdf: "assets/pdf/2020-2021/1-serie.pdf" },
        { nazev: "2. série", pdf: "assets/pdf/2020-2021/2-serie.pdf" },
        { nazev: "3. série", pdf: "assets/pdf/2020-2021/3-serie.pdf" },
        { nazev: "4. série", pdf: "assets/pdf/2020-2021/4-serie.pdf" }
      ]
    },
    {
      rocnik: "2019/2020",
      serie: [
        { nazev: "1. série", pdf: "assets/pdf/2019-2020/1-serie.pdf" },
        { nazev: "2. série", pdf: "assets/pdf/2019-2020/2-serie.pdf" },
        { nazev: "3. série", pdf: "assets/pdf/2019-2020/3-serie.pdf" }
      ]
    }
  ],

  /* ------------------------------------------------------------------
     O SOUTĚŽI — stránka /o-soutezi/
     ------------------------------------------------------------------
     Každý blok = jeden článek s nadpisem a textem. Odstavce oddělte
     prázdným řádkem.
     ------------------------------------------------------------------ */
  oNas: [
    {
      nadpis: "O soutěži",
      text: "MATES je matematická korespondenční soutěž pořádaná studenty Gymnázia v Poličce. Je určena pro žáky šestých a sedmých tříd základních škol a studenty odpovídajících ročníků víceletých gymnázií. Připravují ji studenti spolu s pedagogy ve svém volném čase."
    },
    {
      nadpis: "Jak soutěž funguje",
      text: "Každý ročník soutěže se skládá ze čtyř sérií po čtyřech příkladech. Příklady jsou zasazené do napínavého příběhu, jehož hlavními hrdiny jsou Mat a Tes."
    },
    {
      nadpis: "Matematické dopoledne",
      text: "Začátkem druhého pololetí mají Matesáci možnost absolvovat matematické dopoledne. Program je jako vždy rozdělen do dvou částí – v první se zúčastní zajímavé přednášky a naučí se něco nového z matematiky, ve druhé si společně zahrají několik her."
    },
    {
      nadpis: "Soustředění na Baldě",
      text: "Ke konci školního roku čeká na 30 nejlepších řešitelů matematické soustředění v rekreačním středisku Balda, kde proběhne vyvrcholení celoroční soutěže. Čtyři družstva se zde poperou v zajímavých hrách a soutěžích o různé ceny."
    },
    {
      nadpis: "Kdo může soutěžit?",
      text: "Soutěž je určena pro žáky 6. a 7. tříd základních škol. Účast je zdarma – stačí stáhnout zadání, vyřešit úlohy a zaslat řešení s přihláškou."
    }
  ]
};
