/*
 * guide-editor.js — a form editor for the field guide's SpeciesGuideData.json.
 *
 * The guide is read straight from the field guide repo on load, from the same
 * raw URL the app itself fetches, so a contributor always starts from what is
 * currently live rather than from whatever copy they downloaded last week. That
 * matters for more than convenience: two people editing the same stale base is
 * how one silently reverts the other.
 *
 * This is the page's ONE outbound request, it is read-only, and it sends
 * nothing about the visitor beyond what any HTTP request carries. It needs
 * `https://raw.githubusercontent.com` in the CSP's `connect-src` (see
 * templates/base.njk) — without it the fetch fails silently in production while
 * working perfectly on localhost. Editing still happens entirely in the
 * browser: the edited file is handed back as a download and never uploaded.
 *
 * Dropping a file in still works, and is the fallback whenever the fetch fails
 * — offline, GitHub down, or a network that blocks it.
 *
 * Nothing is persisted — no localStorage, no cookies. Reloading the page loses
 * the edit, which is why there is an unsaved-changes prompt.
 *
 * ## What this is really for
 *
 * The form fields are the obvious part and the least valuable. What actually
 * breaks contributions today is the rules around the edit, so those are
 * enforced here rather than left to memory:
 *   • `dataVersion` MUST go up by one or the change reaches nobody's device.
 *   • `updatedAt` moves with it.
 *   • `imageCredit` is required whenever `imageURL` is set.
 *   • `schemaVersion` must be left alone.
 *   • Renaming an existing id should be a deliberate, separate PR.
 * The first two are done automatically on export; the rest are checked and
 * refuse to export until they pass.
 *
 * ## Output formatting
 *
 * Exported as `JSON.stringify(guide, null, 2)`, which is what keeps a pull
 * request reviewable: only the edited entry shows up in the diff. That relies
 * on the committed file already being in exactly that form, and as of writing
 * IT IS NOT — the guide mixes one-line contributor objects with expanded ones
 * and writes some numbers as `54.0`, which JavaScript renders as `54`. Measured
 * against the current file, a save from here rewrites 1461 lines and buries the
 * real change in the noise.
 *
 * So the guide needs normalising ONCE — commit it as
 * `JSON.stringify(parsed, null, 2)` on its own, changing no values — and every
 * export after that is a clean, minimal diff. Until that happens, the first
 * pull request out of this page carries the reformatting with it. Nothing here
 * depends on it having been done; it only affects how reviewable the diff is.
 */
(function () {
  'use strict';

  var root = document.getElementById('guide-editor');
  if (!root) return;

  /* ---------------------------------------------------------------- state */

  var guide = null;         // the whole parsed file
  var editing = null;       // the species object being edited (a working copy)
  var editingIndex = -1;    // its index in guide.species, or -1 for a new one
  var originalId = null;    // to detect a rename, which needs its own PR
  // The contributor entries this species already had when it was opened. They
  // are an attribution record of other people's work, so they are read-only
  // here: you may append yourself and remove what you appended, nothing else.
  // Kept as a snapshot rather than just a count so export can prove they came
  // through untouched.
  var lockedContributors = [];
  var dirty = false;
  var source = null;        // where the loaded guide came from, shown in the UI

  // The same raw URL the app fetches the guide from, deliberately — if the two
  // ever point at different branches, the editor would be editing something no
  // install is reading.
  var GUIDE_URL = 'https://raw.githubusercontent.com/NiallxD/OpenBat-FieldGuide/main/SpeciesGuideData.json';

  /* ----------------------------------------------------------- field spec */

  // Standard IUCN categories, offered as suggestions rather than enforced —
  // the schema says "e.g.", and local authorities use their own wording.
  var IUCN = ['Least Concern', 'Near Threatened', 'Vulnerable', 'Endangered',
              'Critically Endangered', 'Extinct in the Wild', 'Extinct',
              'Data Deficient', 'Not Evaluated'];

  var SPEC = [
    { title: 'Identity', fields: [
      { path: 'id', label: 'ID', type: 'text', required: true,
        hint: 'Stable slug — genus-species, lowercase, hyphenated. Other entries and saved user data reference this.' },
      { path: 'commonName', label: 'Common name', type: 'text', required: true },
      { path: 'scientificName', label: 'Scientific name', type: 'text', required: true,
        hint: 'Genus is parsed from this automatically. Don’t add a separate genus field.' },
      { path: 'order', label: 'Order', type: 'text', placeholder: 'Chiroptera' },
      { path: 'family', label: 'Family', type: 'text', placeholder: 'Vespertilionidae' },
      { path: 'code', label: 'Classifier code', type: 'text', placeholder: 'PIPPIP',
        hint: 'Leave blank if a bundled ID model already names this species. Required if none does — without it there is no range map and it never appears in “bats near you”.' }
    ]},
    { title: 'Regions', fields: [
      { path: 'regions', label: 'Regions', type: 'regions', required: true }
    ]},
    { title: 'Summary', fields: [
      { path: 'summary', label: 'Summary', type: 'textarea' }
    ]},
    { title: 'Photo', fields: [
      { path: 'imageURL', label: 'Image URL', type: 'text',
        hint: 'Must be a Creative Commons or public-domain image. Leave blank and the app falls back to an unpredictable Wikipedia lookup.' },
      { path: 'imageCredit', label: 'Image credit', type: 'text',
        placeholder: 'Jane Doe, Wikimedia Commons, CC BY-SA 4.0',
        hint: 'Required whenever an image URL is set.' }
    ]},
    { title: 'Measurements', fields: [
      { path: 'measurements.forearmMmRange', label: 'Forearm', type: 'range', unit: 'mm' },
      { path: 'measurements.wingspanCmRange', label: 'Wingspan', type: 'range', unit: 'cm' },
      { path: 'measurements.weightGRange', label: 'Weight', type: 'range', unit: 'g' },
      { path: 'measurements.color', label: 'Colour', type: 'text' }
    ]},
    { title: 'Morphology', fields: [
      { path: 'morphology.earType', label: 'Ear type', type: 'text' },
      { path: 'morphology.tailType', label: 'Tail type', type: 'text' },
      { path: 'morphology.noseType', label: 'Nose type', type: 'text' },
      { path: 'morphology.otherFeatures', label: 'Other features', type: 'list',
        hint: 'One short feature per line.' }
    ]},
    { title: 'Echolocation', fields: [
      { path: 'echolocation.callType', label: 'Call type', type: 'text', placeholder: 'FM, CF-FM' },
      { path: 'echolocation.peakFreqHzRange', label: 'Peak frequency (Pf)', type: 'range', unit: 'Hz' },
      { path: 'echolocation.characteristicFreqHzRange', label: 'Characteristic frequency (Cf)', type: 'range', unit: 'Hz' },
      { path: 'echolocation.freqHighHzRange', label: 'Frequency high (Fhigh)', type: 'range', unit: 'Hz' },
      { path: 'echolocation.freqLowHzRange', label: 'Frequency low (Flow)', type: 'range', unit: 'Hz' },
      { path: 'echolocation.durationMsRange', label: 'Duration', type: 'range', unit: 'ms' },
      { path: 'echolocation.notes', label: 'Notes', type: 'textarea' },
      { path: 'echolocation.exemplarImageName', label: 'Exemplar image name', type: 'text',
        hint: 'Must match an image asset bundled in the app. Leave blank if you don’t have one.' }
    ]},
    { title: 'Conservation', fields: [
      { path: 'conservation.iucnStatus', label: 'IUCN status', type: 'text', datalist: IUCN },
      { path: 'conservation.localStatus', label: 'Local status', type: 'text' }
    ]},
    { title: 'Habits', fields: [
      { path: 'habits.roosting', label: 'Roosting', type: 'textarea' },
      { path: 'habits.migration', label: 'Migration', type: 'textarea' },
      { path: 'habits.feeding', label: 'Feeding', type: 'textarea' },
      { path: 'habits.reproduction', label: 'Reproduction', type: 'textarea' },
      { path: 'habits.other', label: 'Other', type: 'textarea' }
    ]},
    { title: 'References', fields: [
      { path: 'references', label: 'References', type: 'list',
        hint: 'One citation per line. Any readable format is fine.' }
    ]}
  ];

  /* --------------------------------------------------------------- helpers */

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return (o === null || o === undefined) ? undefined : o[k];
    }, obj);
  }

  function setPath(obj, path, value) {
    var parts = path.split('.');
    var last = parts.pop();
    var target = parts.reduce(function (o, k) {
      if (o[k] === null || typeof o[k] !== 'object') o[k] = {};
      return o[k];
    }, obj);
    target[last] = value;
  }

  // The schema's rule is "leave it out" rather than "leave it empty" — the app
  // only renders a section whose fields are present, so an empty object would
  // draw an empty box. Strip blanks recursively before export.
  function prune(value) {
    if (Array.isArray(value)) {
      var arr = value.map(prune).filter(function (v) { return v !== undefined; });
      return arr.length ? arr : undefined;
    }
    if (value && typeof value === 'object') {
      var out = {};
      Object.keys(value).forEach(function (k) {
        var v = prune(value[k]);
        if (v !== undefined) out[k] = v;
      });
      return Object.keys(out).length ? out : undefined;
    }
    if (typeof value === 'string') {
      var t = value.trim();
      return t.length ? t : undefined;
    }
    if (value === null || value === undefined) return undefined;
    if (typeof value === 'number' && isNaN(value)) return undefined;
    return value;
  }

  function todayISO() {
    return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  }

  function slugify(scientificName) {
    return String(scientificName || '').trim().toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function markDirty() { dirty = true; }

  window.addEventListener('beforeunload', function (e) {
    if (!dirty) return;
    e.preventDefault();
    e.returnValue = '';
  });

  /* ------------------------------------------------------------ DOM lookup */

  var ui = {
    load:    root.querySelector('[data-step="load"]'),
    browse:  root.querySelector('[data-step="browse"]'),
    edit:    root.querySelector('[data-step="edit"]'),
    drop:    root.querySelector('[data-drop]'),
    file:    root.querySelector('[data-file]'),
    paste:   root.querySelector('[data-paste]'),
    pasteGo: root.querySelector('[data-paste-go]'),
    loadErr: root.querySelector('[data-load-error]'),
    fetching: root.querySelector('[data-fetching]'),
    fallback: root.querySelector('[data-fallback]'),
    retry:   root.querySelector('[data-retry]'),
    meta:    root.querySelector('[data-meta]'),
    search:  root.querySelector('[data-search]'),
    results: root.querySelector('[data-results]'),
    addNew:  root.querySelector('[data-add-new]'),
    form:    root.querySelector('[data-form]'),
    title:   root.querySelector('[data-edit-title]'),
    errors:  root.querySelector('[data-errors]'),
    back:    root.querySelector('[data-back]'),
    download:root.querySelector('[data-download]'),
    copy:    root.querySelector('[data-copy]'),
    copyOne: root.querySelector('[data-copy-entry]')
  };

  /* ------------------------------------------------------------- load step */

  function showLoadError(msg) {
    ui.loadErr.textContent = msg;
    ui.loadErr.hidden = !msg;
  }

  function showFallback(message) {
    ui.fetching.hidden = true;
    ui.fallback.hidden = false;
    showLoadError(message || '');
  }

  function acceptText(text, from) {
    var parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      showFallback('That file isn’t valid JSON: ' + err.message);
      return;
    }
    if (!parsed || !Array.isArray(parsed.species) || !Array.isArray(parsed.regions)) {
      showFallback('That JSON doesn’t look like SpeciesGuideData.json — it needs top-level "species" and "regions" lists.');
      return;
    }
    showLoadError('');
    guide = parsed;
    source = from || 'your file';
    ui.load.hidden = true;
    ui.browse.hidden = false;
    renderMeta();
    renderResults();
    ui.search.focus();
  }

  // Read-only, and cache-busted: an editor that hands you a stale base is worse
  // than one that fails loudly, because the resulting pull request quietly
  // reverts whatever landed in between.
  function fetchGuide() {
    ui.fetching.hidden = false;
    ui.fallback.hidden = true;
    showLoadError('');

    if (typeof fetch !== 'function') {
      showFallback('This browser can’t fetch the guide automatically.');
      return;
    }

    fetch(GUIDE_URL, { cache: 'no-store', credentials: 'omit' })
      .then(function (res) {
        if (!res.ok) throw new Error('GitHub returned ' + res.status);
        return res.text();
      })
      .then(function (text) { acceptText(text, 'GitHub (main)'); })
      .catch(function (err) {
        showFallback('Couldn’t load the guide from GitHub (' + err.message + ').');
      });
  }

  function readFile(file) {
    var reader = new FileReader();
    reader.onload = function () { acceptText(String(reader.result), 'your file'); };
    reader.onerror = function () { showFallback('Couldn’t read that file.'); };
    reader.readAsText(file);
  }

  ui.retry.addEventListener('click', fetchGuide);
  fetchGuide();

  ui.file.addEventListener('change', function () {
    if (ui.file.files && ui.file.files[0]) readFile(ui.file.files[0]);
  });

  ['dragenter', 'dragover'].forEach(function (evt) {
    ui.drop.addEventListener(evt, function (e) {
      e.preventDefault(); ui.drop.classList.add('is-over');
    });
  });
  ['dragleave', 'drop'].forEach(function (evt) {
    ui.drop.addEventListener(evt, function (e) {
      e.preventDefault(); ui.drop.classList.remove('is-over');
    });
  });
  ui.drop.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]);
  });

  ui.pasteGo.addEventListener('click', function () {
    var t = ui.paste.value.trim();
    if (t) acceptText(t, 'pasted JSON');
  });

  /* ----------------------------------------------------------- browse step */

  function renderMeta() {
    clear(ui.meta);
    ui.meta.appendChild(el('span', { text: 'Loaded from ' + source }));
    ui.meta.appendChild(el('span', { text: guide.species.length + ' species' }));
    ui.meta.appendChild(el('span', { text: guide.regions.length + ' regions' }));
    ui.meta.appendChild(el('span', { text: 'dataVersion ' + guide.dataVersion }));
    ui.meta.appendChild(el('span', { class: 'ge-meta-note', text: 'exports as ' + (guide.dataVersion + 1) }));
  }

  function matches(species, q) {
    if (!q) return true;
    var hay = (species.commonName + ' ' + species.scientificName + ' ' +
               (species.family || '') + ' ' + (species.id || '')).toLowerCase();
    // Every whitespace-separated term must appear somewhere, so "pip common"
    // and "common pip" both find the Common Pipistrelle.
    return q.toLowerCase().split(/\s+/).every(function (term) {
      return hay.indexOf(term) !== -1;
    });
  }

  function renderResults() {
    var q = ui.search.value.trim();
    var list = guide.species.filter(function (s) { return matches(s, q); });
    clear(ui.results);

    if (!list.length) {
      ui.results.appendChild(el('p', { class: 'ge-empty',
        text: q ? 'No species matches “' + q + '”.' : 'The guide has no species yet.' }));
      return;
    }

    list.forEach(function (species) {
      var idx = guide.species.indexOf(species);
      ui.results.appendChild(
        el('button', { class: 'ge-result', type: 'button', onclick: function () { openEditor(idx); } }, [
          el('span', { class: 'ge-result-name', text: species.commonName || '(unnamed)' }),
          el('span', { class: 'ge-result-sci', text: species.scientificName || '' }),
          el('span', { class: 'ge-result-meta', text: (species.family || 'No family') + ' · ' +
            ((species.regions || []).length + ' region' + ((species.regions || []).length === 1 ? '' : 's')) })
        ])
      );
    });
  }

  ui.search.addEventListener('input', renderResults);
  ui.addNew.addEventListener('click', function () { openEditor(-1); });

  /* ------------------------------------------------------------- edit step */

  function openEditor(index) {
    editingIndex = index;
    if (index >= 0) {
      // Deep copy, so abandoning the edit doesn't leave a half-changed entry
      // behind in the loaded guide.
      editing = JSON.parse(JSON.stringify(guide.species[index]));
      originalId = editing.id;
      lockedContributors = JSON.parse(JSON.stringify(editing.contributors || []));
    } else {
      editing = { id: '', commonName: '', scientificName: '', regions: [] };
      originalId = null;
      // A new species has no history to protect — the first person to add
      // themselves becomes its creator.
      lockedContributors = [];
    }
    ui.browse.hidden = true;
    ui.edit.hidden = false;
    ui.title.textContent = index >= 0
      ? 'Editing ' + (editing.commonName || editing.id)
      : 'New species';
    buildForm();
    window.scrollTo(0, 0);
  }

  function fieldControl(field) {
    var value = getPath(editing, field.path);
    var id = 'f-' + field.path.replace(/\./g, '-');

    if (field.type === 'range') {
      var minInput = el('input', {
        type: 'number', step: 'any', class: 'ge-num', id: id + '-min',
        placeholder: 'min', value: (value && value.min !== undefined) ? value.min : '',
        'aria-label': field.label + ' minimum'
      });
      var maxInput = el('input', {
        type: 'number', step: 'any', class: 'ge-num', id: id + '-max',
        placeholder: 'max', value: (value && value.max !== undefined) ? value.max : '',
        'aria-label': field.label + ' maximum'
      });
      function syncRange() {
        var lo = minInput.value.trim(), hi = maxInput.value.trim();
        if (!lo && !hi) setPath(editing, field.path, undefined);
        else setPath(editing, field.path, {
          min: lo === '' ? undefined : Number(lo),
          max: hi === '' ? undefined : Number(hi)
        });
        markDirty();
      }
      minInput.addEventListener('input', syncRange);
      maxInput.addEventListener('input', syncRange);
      return el('div', { class: 'ge-range' }, [
        minInput, el('span', { class: 'ge-range-dash', text: '–' }), maxInput,
        field.unit ? el('span', { class: 'ge-unit', text: field.unit }) : null
      ]);
    }

    if (field.type === 'list') {
      var ta = el('textarea', { id: id, rows: '4' });
      ta.value = (value || []).join('\n');
      ta.addEventListener('input', function () {
        var lines = ta.value.split('\n').map(function (s) { return s.trim(); })
                            .filter(function (s) { return s.length; });
        setPath(editing, field.path, lines.length ? lines : undefined);
        markDirty();
      });
      return ta;
    }

    if (field.type === 'regions') {
      var box = el('div', { class: 'ge-regions' });
      guide.regions.forEach(function (region) {
        var checked = (editing.regions || []).indexOf(region.id) !== -1;
        var cb = el('input', { type: 'checkbox', id: id + '-' + region.id });
        cb.checked = checked;
        cb.addEventListener('change', function () {
          var cur = editing.regions || [];
          if (cb.checked) { if (cur.indexOf(region.id) === -1) cur.push(region.id); }
          else { cur = cur.filter(function (r) { return r !== region.id; }); }
          editing.regions = cur;
          markDirty();
        });
        box.appendChild(el('label', { class: 'ge-region' }, [
          cb, el('span', { text: region.name }), el('code', { text: region.id })
        ]));
      });
      return box;
    }

    if (field.type === 'textarea') {
      var t = el('textarea', { id: id, rows: '4' });
      t.value = value || '';
      t.addEventListener('input', function () {
        setPath(editing, field.path, t.value); markDirty();
      });
      return t;
    }

    // Plain text, optionally with suggestions.
    var input = el('input', { type: 'text', id: id, value: value || '',
                              placeholder: field.placeholder || '' });
    if (field.datalist) {
      var listId = id + '-list';
      input.setAttribute('list', listId);
      var dl = el('datalist', { id: listId });
      field.datalist.forEach(function (v) { dl.appendChild(el('option', { value: v })); });
      input.appendChild(dl);
    }
    input.addEventListener('input', function () {
      setPath(editing, field.path, input.value); markDirty();
    });

    // Filling in the scientific name of a NEW species offers the id for free,
    // in the exact shape the schema asks for. Only while the id is untouched —
    // never overwrite something the contributor typed, and never touch an
    // existing entry's id, which is a deliberate separate change.
    if (field.path === 'scientificName') {
      input.addEventListener('input', function () {
        if (editingIndex >= 0) return;
        var idField = ui.form.querySelector('#f-id');
        if (!idField) return;
        if (idField.value && idField.value !== slugify(idField.dataset.lastAuto || '')) return;
        var slug = slugify(input.value);
        idField.value = slug;
        idField.dataset.lastAuto = input.value;
        editing.id = slug;
      });
    }

    return input;
  }

  function buildForm() {
    clear(ui.form);
    SPEC.forEach(function (section) {
      var body = el('div', { class: 'ge-fields' });
      section.fields.forEach(function (field) {
        var control = fieldControl(field);
        body.appendChild(el('div', { class: 'ge-field' }, [
          el('label', { class: 'ge-label', for: 'f-' + field.path.replace(/\./g, '-') }, [
            el('span', { text: field.label }),
            field.required ? el('span', { class: 'ge-req', text: 'required' }) : null
          ]),
          control,
          field.hint ? el('p', { class: 'ge-hint', text: field.hint }) : null
        ]));
      });
      ui.form.appendChild(el('section', { class: 'ge-section' }, [
        el('h3', { text: section.title }), body
      ]));
    });
    ui.form.appendChild(contributorsSection());
  }

  /* --------------------------------------------------------- contributors */

  // The first entry is the page's creator and every one after is an editor, so
  // this never reorders and never rewrites an existing row's name — it only
  // appends. Editing someone else's entry would quietly rewrite authorship.
  function contributorsSection() {
    var list = el('div', { class: 'ge-contributors' });

    function render() {
      clear(list);
      (editing.contributors || []).forEach(function (c, i) {
        // Only what you appended in this sitting can be taken back out. Entries
        // that were already on the species are someone else's credit for work
        // they did, and are shown as a record rather than as editable rows —
        // there is no × on them and nothing in this form writes to them.
        var isMine = i >= lockedContributors.length;
        list.appendChild(el('div', { class: 'ge-contributor' + (isMine ? ' is-mine' : '') }, [
          el('span', { class: 'ge-contributor-role', text: i === 0 ? 'Creator' : 'Editor' }),
          el('span', { class: 'ge-contributor-name', text: c.name || '(no name)' }),
          el('span', { class: 'ge-contributor-date', text: (c.date || '').slice(0, 10) }),
          el('span', { class: 'ge-contributor-note', text: c.note || '' }),
          isMine
            ? el('button', { class: 'ge-remove', type: 'button',
                title: 'Remove the entry you just added', 'aria-label': 'Remove the entry you just added',
                text: '×', onclick: function () {
                  editing.contributors.splice(i, 1); markDirty(); render();
                }})
            : el('span', { class: 'ge-locked', title: 'Existing credit — can’t be changed here',
                'aria-label': 'Existing credit, can’t be changed here', text: '🔒' })
        ]));
      });
      if (!(editing.contributors || []).length) {
        list.appendChild(el('p', { class: 'ge-empty', text: 'No contributors recorded yet.' }));
      }
    }

    var nameInput = el('input', { type: 'text', placeholder: 'Your name', 'aria-label': 'Contributor name' });
    var noteInput = el('input', { type: 'text',
      placeholder: editingIndex >= 0 ? 'What you changed' : 'Created species profile',
      'aria-label': 'Contribution note' });

    var addBtn = el('button', { class: 'ge-btn ge-btn-quiet', type: 'button', text: 'Add me', onclick: function () {
      var name = nameInput.value.trim();
      if (!name) { nameInput.focus(); return; }
      if (!editing.contributors) editing.contributors = [];
      editing.contributors.push({
        name: name,
        date: todayISO(),
        note: noteInput.value.trim() || (editingIndex >= 0 ? 'Edited species profile' : 'Created species profile')
      });
      nameInput.value = ''; noteInput.value = '';
      markDirty(); render();
    }});

    render();

    return el('section', { class: 'ge-section' }, [
      el('h3', { text: 'Contributors' }),
      el('p', { class: 'ge-hint',
        text: editingIndex >= 0
          ? 'Add yourself as an editor when you change a species you didn’t create. Existing credits are locked — they record other people’s work, and only an entry you add here can be removed again.'
          : 'The first entry is treated as this page’s creator — that’s you.' }),
      list,
      el('div', { class: 'ge-contributor-add' }, [nameInput, noteInput, addBtn])
    ]);
  }

  /* ------------------------------------------------------------ validation */

  function validate() {
    var problems = [];
    var s = prune(JSON.parse(JSON.stringify(editing))) || {};

    if (!s.id) problems.push('An ID is required.');
    if (!s.commonName) problems.push('A common name is required.');
    if (!s.scientificName) problems.push('A scientific name is required.');
    if (!s.regions || !s.regions.length) problems.push('Pick at least one region.');

    if (s.id && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.id)) {
      problems.push('The ID should be lowercase words separated by hyphens, e.g. pipistrellus-pipistrellus.');
    }

    // The schema's one hard cross-field rule.
    if (s.imageURL && !s.imageCredit) {
      problems.push('An image credit is required whenever an image URL is set.');
    }

    // Uniqueness, and the "renaming is its own PR" rule.
    var clash = guide.species.some(function (other, i) {
      return i !== editingIndex && other.id === s.id;
    });
    if (clash) problems.push('Another species already uses the ID “' + s.id + '”.');
    if (originalId && s.id !== originalId) {
      problems.push('This changes an existing ID (' + originalId + ' → ' + s.id +
                    '). Saved user data references IDs, so a rename should be its own separate pull request — change it back, or make this change on its own.');
    }

    // Belt and braces on the attribution record. The form gives no way to
    // touch an existing contributor, so this should be unreachable — which is
    // exactly why it is worth asserting: a bug that silently dropped someone's
    // credit would otherwise be invisible until it had already been merged.
    var kept = (s.contributors || []).slice(0, lockedContributors.length);
    if (JSON.stringify(kept) !== JSON.stringify(prune(JSON.parse(JSON.stringify(lockedContributors))) || [])) {
      problems.push('The existing contributor credits have been altered. They record other people’s work and can’t be changed here — reload the page and make your edit again.');
    }

    // Ranges, checked after pruning so a half-filled pair is still caught.
    SPEC.forEach(function (section) {
      section.fields.forEach(function (f) {
        if (f.type !== 'range') return;
        var r = getPath(s, f.path);
        if (!r) return;
        if (r.min === undefined || r.max === undefined) {
          problems.push(f.label + ' needs both a minimum and a maximum, or neither.');
        } else if (Number(r.min) > Number(r.max)) {
          problems.push(f.label + '’s minimum is greater than its maximum.');
        }
      });
    });

    return { problems: problems, species: s };
  }

  function showProblems(problems) {
    clear(ui.errors);
    ui.errors.hidden = !problems.length;
    if (!problems.length) return;
    ui.errors.appendChild(el('p', { class: 'ge-errors-title',
      text: problems.length === 1 ? 'One thing to fix:' : problems.length + ' things to fix:' }));
    var ul = el('ul');
    problems.forEach(function (p) { ul.appendChild(el('li', { text: p })); });
    ui.errors.appendChild(ul);
    ui.errors.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ---------------------------------------------------------------- export */

  // Builds the whole file with this one entry replaced or appended, and the
  // version fields moved. Whole-file rather than a fragment because
  // `dataVersion` has to go up in the same change — a fragment would leave the
  // contributor to remember that, which is the mistake this page exists to stop.
  function buildOutput(species) {
    var out = JSON.parse(JSON.stringify(guide));
    if (editingIndex >= 0) out.species[editingIndex] = species;
    else out.species.push(species);
    out.dataVersion = (Number(guide.dataVersion) || 0) + 1;
    out.updatedAt = todayISO();
    return JSON.stringify(out, null, 2) + '\n';
  }

  function withValidated(fn) {
    var result = validate();
    showProblems(result.problems);
    if (result.problems.length) return;
    fn(result.species);
  }

  ui.download.addEventListener('click', function () {
    withValidated(function (species) {
      var blob = new Blob([buildOutput(species)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = el('a', { href: url, download: 'SpeciesGuideData.json' });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      dirty = false;
    });
  });

  // A fallback for anywhere the download is awkward (some in-app browsers), and
  // the quickest route if you have GitHub's web editor already open.
  function copyToClipboard(text, button) {
    var done = function () {
      var was = button.textContent;
      button.textContent = 'Copied';
      setTimeout(function () { button.textContent = was; }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else { fallback(); }

    function fallback() {
      var ta = el('textarea', {});
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { /* nothing else to try */ }
      document.body.removeChild(ta);
    }
  }

  ui.copy.addEventListener('click', function () {
    withValidated(function (species) {
      copyToClipboard(buildOutput(species), ui.copy);
      dirty = false;
    });
  });

  ui.copyOne.addEventListener('click', function () {
    withValidated(function (species) {
      copyToClipboard(JSON.stringify(species, null, 2), ui.copyOne);
    });
  });

  ui.back.addEventListener('click', function () {
    if (dirty && !window.confirm('Discard the changes to this species?')) return;
    dirty = false;
    editing = null;
    ui.edit.hidden = true;
    ui.browse.hidden = false;
    showProblems([]);
    renderResults();
  });
})();
