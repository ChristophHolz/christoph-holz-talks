/* Mit den Pfeiltasten durch die Landingpages blättern.
 *
 * Rechts geht zur nächsten Seite, links zur vorherigen; am Ende wird umgebrochen.
 * Von der Übersicht führt Rechts auf die erste Seite, Links auf die letzte.
 * Oben führt von jeder Landingpage zurück zur Übersicht.
 * Eingabefelder und Tastenkürzel bleiben unangetastet.
 */
(() => {
  const ANZAHL = 10;

  /** Nummer der aktuellen Seite; 0 für die Übersicht und für Varianten wie lp1b. */
  function aktuell() {
    const treffer = /\/lp(\d+)\.html$/.exec(location.pathname);
    return treffer ? Number(treffer[1]) : 0;
  }

  /** Nur die Übersicht selbst — Varianten zählen nicht dazu. */
  function istUebersicht() {
    return /\/(index\.html)?$/.test(location.pathname);
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

    // Oben führt zurück zur Übersicht. Auf der Übersicht selbst bleibt die Taste
    // dem Scrollen überlassen.
    if (e.key === 'ArrowUp') {
      if (istUebersicht()) return;
      e.preventDefault();
      location.href = 'index.html';
      return;
    }

    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;

    e.preventDefault();
    location.href = ziel(e.key === 'ArrowRight' ? 1 : -1);
  });

  // Kein sichtbarer Hinweis: Die Pfeiltasten-Navigation bleibt bewusst unsichtbar
  // (Christoph 2026-08-16) — nur Tastatur, kein Pill im Bild.
})();
