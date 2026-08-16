/* Mit den Pfeiltasten durch die Landingpages blättern.
 *
 * Rechts geht zur nächsten Seite, links zur vorherigen; am Ende wird umgebrochen.
 * Von der Übersicht führt Rechts auf die erste Seite, Links auf die letzte.
 * Eingabefelder und Tastenkürzel bleiben unangetastet.
 */
(() => {
  const ANZAHL = 10;

  /** Nummer der aktuellen Seite, 0 steht für die Übersicht. */
  function aktuell() {
    const treffer = /\/lp(\d+)\.html/.exec(location.pathname);
    return treffer ? Number(treffer[1]) : 0;
  }

  function ziel(richtung) {
    const jetzt = aktuell();
    if (jetzt === 0) return richtung > 0 ? 'lp1.html' : `lp${ANZAHL}.html`;
    const naechste = ((jetzt - 1 + richtung + ANZAHL) % ANZAHL) + 1;
    return `lp${naechste}.html`;
  }

  function tipptGerade(el) {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }

  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    if (tipptGerade(document.activeElement)) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

    e.preventDefault();
    location.href = ziel(e.key === 'ArrowRight' ? 1 : -1);
  });

  // Dezenter Hinweis, damit die Tastatursteuerung auffindbar ist.
  addEventListener('load', () => {
    if (document.querySelector('.blaettern-hinweis')) return;
    const hinweis = document.createElement('div');
    hinweis.className = 'blaettern-hinweis';
    const jetzt = aktuell();
    hinweis.innerHTML =
      `<a href="${ziel(-1)}" aria-label="vorherige Seite">←</a>` +
      `<span>${jetzt ? `LP ${jetzt} von ${ANZAHL}` : 'Übersicht'}</span>` +
      `<a href="${ziel(1)}" aria-label="nächste Seite">→</a>`;
    document.body.append(hinweis);
  });
})();
