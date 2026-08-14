/* Anfrageformular ohne Buchungsslots — lokale Variante.
 *
 * Die Studio-Komponente blendet ihre Felder erst nach Slot-Auswahl ein und hat
 * ohne konfigurierte Slots nichts anzuzeigen. Dieses Skript blendet den
 * Slot-Teil aus und hängt die Felder des Homepage-Formulars in das bestehende
 * <form> — die versteckten Kampagnen-Felder bleiben dadurch erhalten.
 *
 * Läuft nach der Hydration und beobachtet die Section, damit ein Re-Render von
 * Svelte das Formular nicht wieder entfernt.
 */
(() => {
  const ENDPOINT = 'https://speaker.christophholz.com/api/leads/intake';
  const FIELDS = [
    { id: 'email', label: 'E-Mail-Adresse', placeholder: 'your@email.com', type: 'email', required: true },
    { id: 'name', label: 'Name', placeholder: 'Ihr Name', type: 'text' },
    { id: 'phone', label: 'Telefon (optional)', placeholder: '+49123456789', type: 'tel' },
    { id: 'company', label: 'Unternehmen', placeholder: 'Ihre Organisation', type: 'text' },
    {
      id: 'scope',
      label: 'Worum geht es?',
      placeholder: 'Wir planen einen Event: Datum und Uhrzeit: Veranstaltungsort:',
      type: 'textarea',
      required: true
    }
  ];

  const hide = (el) => el && (el.style.display = 'none');

  function buildFields() {
    const wrap = document.createElement('div');
    wrap.className = 'local-lead-fields';

    for (const f of FIELDS) {
      const label = document.createElement('label');
      label.className = 'local-lead-field';
      label.htmlFor = `local-${f.id}`;

      const span = document.createElement('span');
      span.textContent = f.required ? `${f.label}*` : f.label;

      const input = document.createElement(f.type === 'textarea' ? 'textarea' : 'input');
      input.id = `local-${f.id}`;
      input.name = f.id;
      input.placeholder = f.placeholder;
      if (f.required) input.required = true;
      if (f.type === 'textarea') input.rows = 4;
      else input.type = f.type;

      label.append(span, input);
      wrap.append(label);
    }

    const actions = document.createElement('div');
    actions.className = 'local-lead-actions';

    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'local-lead-submit';
    button.textContent = 'Anfrage senden';

    const state = document.createElement('p');
    state.className = 'local-lead-state';
    state.hidden = true;

    actions.append(button, state);
    wrap.append(actions);
    return { wrap, button, state };
  }

  /** Kampagnen-Kontext aus den versteckten Feldern der Studio-Komponente. */
  function context(form) {
    const out = {};
    for (const key of ['campaignId', 'campaignPageId']) {
      const value = form.querySelector(`[name="${key}"]`)?.value;
      if (value && !Number.isNaN(Number(value))) out[key] = Number(value);
    }
    return out;
  }

  function attach() {
    const booking = document.getElementById('booking');
    const form = booking?.querySelector('form');
    if (!form || form.dataset.localLeadForm === 'on') return;
    form.dataset.localLeadForm = 'on';

    // Slot-Hinweis, Ausverkauft-Box und Ausweich-Link gehören zur Kalender-Variante.
    hide(booking.querySelector('section > p'));
    hide(form.querySelector('div[class*="amber"]'));
    booking.querySelectorAll('a[href^="mailto:"]').forEach(hide);

    const { wrap, button, state } = buildFields();
    form.append(wrap);

    const show = (text, kind) => {
      state.hidden = false;
      state.textContent = text;
      state.dataset.kind = kind;
    };

    form.addEventListener(
      'submit',
      async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const data = new FormData(form);
        const payload = {
          email: data.get('email') || '',
          name: data.get('name') || '',
          phone: data.get('phone') || '',
          company: data.get('company') || '',
          scope: data.get('scope') || '',
          ...context(form)
        };

        button.disabled = true;
        button.textContent = 'Bitte warten …';
        try {
          const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const result = await res.json().catch(() => ({}));
          if (res.ok && result.success === true) {
            show(result.message || 'Danke — wir melden uns in Kürze bei Ihnen.', 'ok');
            form.reset();
          } else {
            show(result.message || 'Das hat nicht geklappt. Bitte erneut versuchen.', 'fail');
          }
        } catch (_) {
          // Die Intake-API erlaubt nur www. und speaker.christophholz.com als Origin,
          // von localhost blockt der Browser den Request per CORS.
          show(
            'Lokal blockiert: /api/leads/intake nimmt nur Anfragen von christophholz.com an. ' +
              'Auf der echten Seite geht dieselbe Anfrage durch.',
            'fail'
          );
        } finally {
          button.disabled = false;
          button.textContent = 'Anfrage senden';
        }
      },
      true
    );
  }

  const start = () => {
    attach();
    const booking = document.getElementById('booking');
    if (booking) new MutationObserver(attach).observe(booking, { childList: true, subtree: true });
  };

  if (document.readyState === 'complete') setTimeout(start, 200);
  else window.addEventListener('load', () => setTimeout(start, 200));
})();
