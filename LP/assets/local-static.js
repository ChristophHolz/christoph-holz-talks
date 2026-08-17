/* Ergänzt, was ohne SvelteKit-Hydration fehlt.
 *
 * Die Seite wird unter /LP/ statisch ausgeliefert; der Client-Router von
 * SvelteKit ist entfernt, weil er für diesen Pfad keine Route kennt und die
 * Seite sonst durch seine 500er-Fehlerseite ersetzt. Alles, was erst im Browser
 * gerendert wurde, kommt hier zurück.
 */
(() => {
  const VIDEOS = window.LP_VIDEOS || [
    { id: 'xmJRcJAr8Rc', title: 'Christoph Holz — Keynote-Ausschnitt' },
    { id: '2tyK-fIgqOc', title: 'Christoph Holz — Bühnenmitschnitt' },
    { id: 'mpbtCg2NSUs', title: 'Christoph Holz — Showreel' }
  ];

  /** Videoraster: Das SSR-HTML liefert nur die Platzhalter #s1–#s3, die Player
      hat sonst die YouTube-IFrame-API der Hydration hineingesetzt. */
  function videos() {
    VIDEOS.forEach((v, i) => {
      const slot = document.getElementById(`s${i + 1}`);
      if (!slot || slot.dataset.localVideo === 'on') return;
      slot.dataset.localVideo = 'on';
      slot.classList.add('local-video');

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${v.id}?rel=0&playsinline=1`;
      iframe.title = v.title;
      iframe.loading = 'lazy';
      iframe.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      slot.append(iframe);
    });
  }

  /* Texte, die der Server nicht mitliefert: Überschriften, Hero-Text und der
     Nutzen-Block standen im SSR-HTML leer und wurden erst im Browser gefüllt.
     Die Inhalte stammen aus dem content_json der Kampagnenseite. */
  const TEXTE = window.LP_TEXTE || [
    {
      sektion: 0,
      werte: [
        ['span', 'The Digital Future Authority'],
        ['h1', 'Mensch & KI: ein unschlagbares Team'],
        [
          'p',
          'Buchen Sie Christoph Holz für einen unvergesslichen Vortrag über die Zukunft von Wirtschaft und Gesellschaft in Zeiten der KI, der Ihre Gäste motiviert, inspiriert und unterhält.'
        ]
      ]
    },
    {
      sektion: 3,
      werte: [
        ['h2', 'Keynote-Themen, die bei Ihrem Publikum ankommen'],
        ['p', 'Wählen Sie das Thema, das zu Ihrem Anlass passt — jede Keynote wird auf Publikum und Zeitrahmen zugeschnitten.']
      ]
    },
    {
      sektion: 4,
      werte: [
        ['h2', 'Was Ihr Publikum von diesem Vortrag mitnimmt'],
        ['p', 'Anhand bildhafter Metaphern und Beispielen verstehen Ihre Gäste, was Künstliche Intelligenz kann und wo die Grenzen liegen.'],
        ['h3', 'Entscheidungsreifes Verständnis'],
        ['p', 'Das Publikum verlässt die Keynotes, Dinner Speeches und Impulsvorträge mit einem klaren Verständnis für KI als strategischen Partner.'],
        ['h3', 'Praktischer Umsetzungsleitfaden'],
        ['p', 'Die Teilnehmer erhalten konkrete Möglichkeiten, die Erkenntnisse direkt in Entscheidungen und Workflows anzuwenden.'],
        ['h3', 'Sofortige nächste Schritte'],
        ['p', 'Sie nehmen spezifische nächste Schritte mit, die direkt nach dem Vortrag umgesetzt werden können.']
      ]
    },
    {
      sektion: 5,
      werte: [
        ['h2', 'Warum Christoph'],
        ['h4', 'Einer, der KI wirklich versteht'],
        ['p', 'Christoph hat eine nachgewiesene Erfolgsbilanz darin, komplexe KI-Veränderungen in klare Entscheidungen zu verwandeln, auf die Führungskräfte sofort reagieren können.'],
        ['h4', 'Maßgeschneidert für Ihr Event'],
        ['p', 'Holz spricht die Sprache seines Publikums und holt es dort ab, wo es gerade steht.'],
        ['h4', 'Ergebnisorientierte Lieferung'],
        ['p', 'Sein Ansatz ist darauf ausgelegt, entscheidungsreifes Verständnis zu liefern — statt abstrakter Theorie.']
      ]
    },
    {
      sektion: 7,
      werte: [
        ['h2', 'Erzählen Sie uns von Ihrem Event'],
        ['p', 'Schreiben Sie uns kurz, was Sie planen — Datum, Ort und Publikum genügen für den Anfang. Sie fragen damit ein unverbindliches Briefing-Gespräch an, keine Buchung.']
      ]
    },
    { sektion: 9, werte: [['h2', 'Was Teilnehmer über Christoph Holz sagen']] },
    {
      sektion: 10,
      werte: [
        ['span', 'Kostenlose Ressource'],
        ['h2', 'Lernen Sie Christoph durch das Booklet kennen'],
        [
          'p',
          'Eine prägnante Einführung in Christophs Keynote-Themen, seinen Vortragsstil und die Relevanz für Ihren Event. Kein Formular und keine E-Mail erforderlich.'
        ],
        ['span', 'Booklet herunterladen']
      ]
    }
  ];

  function texte() {
    const sections = document.querySelectorAll('section');
    for (const eintrag of TEXTE) {
      const sec = sections[eintrag.sektion];
      if (!sec) continue;
      // Leere Slots in Dokumentreihenfolge auffüllen, je Tag getrennt gezählt.
      const offen = {};
      for (const [tag, text] of eintrag.werte) {
        offen[tag] = offen[tag] || [...sec.querySelectorAll(tag)].filter((el) => !el.children.length && !el.textContent.trim());
        const ziel = offen[tag].shift();
        if (ziel) ziel.textContent = text;
      }
    }
  }


  /* Beschriftung der Haupt-Buttons. Auf der Studio-Seite steuert das ein
     abgeschlossenes A/B-Experiment in der Datenbank; hier stehen die Texte fest. */
  const CTA_TEXTE = [
    ['Vortrag anfragen', 'Emailanfrage'],
    ['Vortrag Anfragen', 'Emailanfrage'],
    ['Verfügbarkeit prüfen', 'Kontaktform']
  ];

  function ctas() {
    for (const el of document.querySelectorAll('a, button')) {
      if (el.children.length) continue;
      const text = el.textContent.trim();
      for (const [alt, neu] of CTA_TEXTE) {
        if (text === alt) el.textContent = neu;
      }
    }
  }

  /** h4 unter einer h2 überspringt eine Ebene — Lighthouse bemängelt das zu Recht.
      Die Knoten werden als h3 neu aufgebaut, Klassen und Text bleiben.
      Gesucht wird über die Struktur, nicht über eine feste Position: die
      Varianten-Seite hat eine andere Abschnittsreihenfolge. */
  function ueberschriftenRang() {
    for (const sek of document.querySelectorAll('section')) {
      const h4s = [...sek.querySelectorAll('h4')];
      if (!h4s.length || sek.querySelector('h3')) continue;
      for (const h4 of h4s) {
        const h3 = document.createElement('h3');
        h3.className = h4.className;
        h3.textContent = h4.textContent;
        h4.replaceWith(h3);
      }
    }
  }

  const start = () => {
    texte();
    ueberschriftenRang();
    videos();
    ctas();
  };
  // Beschriftungen erneut setzen, falls Karten nachträglich ersetzt werden.
  setTimeout(() => document.readyState === 'complete' && ctas(), 600);
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
