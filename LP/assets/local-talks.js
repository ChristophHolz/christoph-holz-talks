/* Aktuelle Talks aus content.keynotes in die Keynote-Karten schreiben.
 *
 * Ersetzt Titel, Untertitel, Kurztext und Bild der drei Karten. Der Kurztext wird
 * auf fünf Zeilen begrenzt, darunter führt „mehr …“ auf die Talk-Seite.
 * Läuft nach der Hydration und wird bei Re-Renders erneut angewendet.
 */
(() => {
  const TALK_BASE = 'https://talks.christophholz.com/';

  const MEHR = window.LP_TALKS_MEHR || [];

  const TALKS = window.LP_TALKS || [
    {
      id: 'mensch-und-maschine-ein-unschlagbares-team',
      title: 'Mensch und Maschine – ein unschlagbares Team',
      subtitle: 'Wie die Zusammenarbeit mit kognitiven Robotern und KI der Arbeit ihre Menschlichkeit zurück gibt.',
      summary:
        'Unsere Urgroßeltern haben unmenschliche Arbeit in den Fabriken der industriellen Revolution geleistet — weil es noch keine Automatisierung, keine Roboter, keine KI gab. Diese Arbeit war nie für Menschen gemacht. Wenn alles Unmenschliche wegdigitalisiert ist, bleibt das, was uns ausmacht — der Mensch. Und wer glaubt, KI oder Roboter machen arbeitslos, hat bloß nicht verstanden, was Arbeit eigentlich ist.',
      image: './assets/talk-mensch-und-maschine-ein-unschlagbares-team.webp',
      alt: 'Mensch und Maschine - ein unschlagbares Team'
    },
    {
      id: 'wenn-die-babyboomer-gehen-und-die-roboter-kommen',
      title: 'Wenn die Babyboomer gehen und die Roboter kommen',
      subtitle:
        'Wie Sie Ihr Unternehmen durch den doppelten Umbruch aus Demografie und Künstlicher Intelligenz führen',
      summary:
        'Jahrzehntelang fürchteten wir: „Die Roboter nehmen uns die Arbeit weg.“ Die Demografie dreht den Satz um. Uns gehen die Menschen aus — und die Maschinen kommen gerade noch rechtzeitig. Wenn die Babyboomer in Rente gehen, nehmen sie Jahrzehnte stillen Wissens mit; wenn die KI zur Arbeit kommt, übernimmt sie zuerst die Bürokratie, die ohnehin niemand vermisst. Christoph Holz zeigt in fünf Gedankenexperimenten, wie ganze Branchen vom Umbruch aus Demografie und Künstlicher Intelligenz profitieren.',
      image: './assets/talk-wenn-die-babyboomer-gehen-und-die-roboter-kommen.webp',
      alt: 'Wenn die Babyboomer gehen und die Roboter kommen'
    },
    {
      id: 'wenn-die-software-zum-teamplayer-wird',
      title: 'Wenn die Software zum Teamplayer wird',
      subtitle: 'KI-Agenten — vom Werkzeug, das man bedient, zum Mitarbeiter, den man beauftragt',
      summary:
        'Software hat immer auf den Klick gewartet. KI-Agenten warten nicht mehr: Sie planen, entscheiden, greifen selbst zu Werkzeugen und erledigen mehrstufige Aufgaben ohne Begleitung. Damit ändert sich nicht die Bedienung, sondern die Rolle — aus dem Anwender wird ein Auftraggeber, aus der Software eine digitale Belegschaft. Christoph Holz zeigt, welche Routine sich heute schon delegieren lässt, welche Führungs- und Kontrollfragen das aufwirft und was am Ende menschlich bleibt.',
      image: './assets/talk-wenn-die-software-zum-teamplayer-wird.webp',
      alt: 'Wenn die Software zum Auftragnehmer wird'
    }
  ];

  /** Die Karten stecken in der Sektion mit „Keynote“ in der Überschrift — es muss
      aber die mit den Talk-Karten sein: andere Blöcke dürfen das Wort ebenfalls
      tragen, haben aber keine Bilder in ihren Karten. */
  function cards() {
    for (const h of document.querySelectorAll('h2')) {
      if (!/keynote/i.test(h.textContent)) continue;
      const artikel = [...(h.closest('section')?.querySelectorAll('article') || [])];
      if (artikel.filter((a) => a.querySelector('img')).length >= TALKS.length) return artikel;
    }
    return [];
  }

  /** Eine Karte mit den Daten eines Talks füllen. */
  function fuelle(card, talk) {
    if (card.dataset.localTalk === talk.id) return;
    card.dataset.localTalk = talk.id;

    const img = card.querySelector('img');
    if (img) {
      img.src = talk.image;
      img.alt = talk.alt;

      // Auch das Bild führt zum Talk — wie „mehr …“, in einem neuen Tab.
      let bildLink = img.closest('a.talk-image-link');
      if (!bildLink) {
        bildLink = document.createElement('a');
        bildLink.className = 'talk-image-link';
        img.replaceWith(bildLink);
        bildLink.append(img);
      }
      bildLink.href = TALK_BASE + talk.id;
      bildLink.target = '_blank';
      bildLink.rel = 'noopener';
    }

    const h3 = card.querySelector('h3');
    if (h3) h3.textContent = talk.title;

    let sub = card.querySelector('.talk-subtitle');
    if (!sub) {
      sub = document.createElement('p');
      sub.className = 'talk-subtitle';
      h3?.after(sub);
    }
    sub.textContent = talk.subtitle;

    // Der Kurztext entfällt auf den Landingpages: Die Karte zeigt Bild, Titel und
    // Untertitel; alles Weitere steht auf der Talk-Seite hinter „mehr …“.
    const p = card.querySelector('p:not(.talk-subtitle)');
    if (p) p.remove();

    // „Das Publikum nimmt mit“ — nur die Varianten-Seite liefert diesen Text mit.
    // Gestaltung kommt aus der Vorlage: Label wie die Eyebrows, Text wie der Kurztext.
    if (talk.mitnahme) {
      let mit = card.querySelector('[data-mitnahme]');
      if (!mit) {
        mit = document.createElement('div');
        mit.dataset.mitnahme = 'on';
        mit.className = 'flex flex-col gap-1';
        const label = document.createElement('span');
        label.className = 'text-xs tracking-[0.12em] text-primary uppercase';
        const text = document.createElement('p');
        text.className = 'text-base leading-relaxed text-on-surface/75';
        mit.append(label, text);
        sub.after(mit);
      }
      mit.firstElementChild.textContent = 'Das Publikum nimmt mit';
      mit.lastElementChild.textContent = talk.mitnahme;
    }

    let more = card.querySelector('.talk-more');
    if (!more) {
      more = document.createElement('a');
      more.className = 'talk-more';
      card.append(more);
    }
    more.href = TALK_BASE + talk.id;
    more.textContent = 'mehr …';
    more.target = '_blank';
    more.rel = 'noopener';
  }

  function apply() {
    const list = cards();
    if (list.length < TALKS.length) return;
    list.slice(0, TALKS.length).forEach((card, i) => fuelle(card, TALKS[i]));
    weitereVortraege(list);
  }

  /** „Weitere Vorträge anzeigen“ blendet bis zu drei zusätzliche Talks ein.
      Ohne Hydration hätte der Knopf sonst keine Funktion. */
  function weitereVortraege(list) {
    const knopf = [...document.querySelectorAll('button')].find(
      (b) => /weitere vorträge/i.test(b.textContent) && !b.dataset.localMore
    );
    if (!knopf) return;
    knopf.dataset.localMore = 'on';

    if (!MEHR.length) {
      knopf.closest('div')?.remove();
      return;
    }

    knopf.type = 'button';
    knopf.addEventListener('click', (e) => {
      e.preventDefault();
      const raster = list[0]?.parentElement;
      if (!raster) return;
      for (const talk of MEHR.slice(0, 3)) {
        const karte = list[0].cloneNode(true);
        karte.removeAttribute('data-local-talk');
        karte.querySelector('span')?.remove();
        fuelle(karte, talk);
        raster.append(karte);
      }
      knopf.closest('div')?.remove();
    });
  }

  const start = () => {
    apply();
    const main = document.querySelector('main') || document.body;
    new MutationObserver(apply).observe(main, { childList: true, subtree: true });
  };

  if (document.readyState === 'complete') setTimeout(start, 200);
  else window.addEventListener('load', () => setTimeout(start, 200));
})();
