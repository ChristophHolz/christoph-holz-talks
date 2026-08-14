/* Aktuelle Talks aus content.keynotes in die Keynote-Karten schreiben.
 *
 * Ersetzt Titel, Untertitel, Kurztext und Bild der drei Karten. Der Kurztext wird
 * auf fünf Zeilen begrenzt, darunter führt „mehr …“ auf die Talk-Seite.
 * Läuft nach der Hydration und wird bei Re-Renders erneut angewendet.
 */
(() => {
  const TALK_BASE = 'https://talks.christophholz.com/';

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

  function cards() {
    const heading = [...document.querySelectorAll('h2')].find((h) =>
      /keynote/i.test(h.textContent)
    );
    const section = heading?.closest('section');
    return section ? [...section.querySelectorAll('article')] : [];
  }

  function apply() {
    const list = cards();
    if (list.length < TALKS.length) return;

    list.slice(0, TALKS.length).forEach((card, i) => {
      const talk = TALKS[i];
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

      // Untertitel in kleinerer Schrift direkt unter den Titel.
      let sub = card.querySelector('.talk-subtitle');
      if (!sub) {
        sub = document.createElement('p');
        sub.className = 'talk-subtitle';
        h3?.after(sub);
      }
      sub.textContent = talk.subtitle;

      const p = card.querySelector('p:not(.talk-subtitle)');
      if (p) {
        p.textContent = talk.summary;
        p.classList.add('talk-summary');
      }

      // „mehr …“ steht außerhalb des beschnittenen Absatzes, sonst wäre es mit abgeschnitten.
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
