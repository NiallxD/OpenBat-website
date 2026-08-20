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
 * The one thing persisted is the edit in progress: a draft is kept in
 * localStorage under DRAFT_KEY so a closed tab, a flat battery or a stray
 * reload doesn't cost someone an evening's work. It never leaves the device,
 * it is offered back on the next visit rather than reapplied silently, and it
 * is cleared the moment the edit is submitted or discarded. There is no other
 * storage and no cookies. The beforeunload prompt is still here, but it is the
 * lesser guard — iOS Safari mostly ignores it, which is exactly the case the
 * draft covers.
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
 * on the committed guide already being in exactly that form, and it is — it was
 * normalised for this reason on 2026-08-20, in a commit that changed no values.
 *
 * Before that it mixed one-line contributor objects with expanded ones and
 * wrote some numbers as `54.0`, which JavaScript renders as `54`; a save from
 * here rewrote 1461 lines and buried the real change in the noise. The same
 * edit against the normalised file is two lines. If the guide is ever
 * hand-edited back into a different shape that noise returns — the field guide
 * README's "Formatting" section documents the layout and how to restore it.
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

  // The worker that opens the pull request, so contributing needs no GitHub
  // account (see worker/README.md). Only the ENTRY is sent — the worker fetches
  // the current guide itself and splices it in, which is what stops two
  // contributors working hours apart from clobbering one another. If this URL
  // changes it must change in the CSP's `connect-src` too, or the request is
  // blocked in production while still working on localhost.
  var SUBMIT_URL = 'https://api.openbat.app/guide-submit';

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
        hint: 'Genus is parsed from this automatically. Don’t add a separate genus field. Only the genus name should be capitalised.' },
      { path: 'order', label: 'Order', type: 'text', placeholder: 'Chiroptera' },
      { path: 'family', label: 'Family', type: 'text', placeholder: 'Vespertilionidae' }
    ]},
    { title: 'Regions', fields: [
      { path: 'regions', label: 'Regions', type: 'regions', required: true }
    ]},
    { title: 'Summary', fields: [
      { path: 'summary', label: 'Summary', type: 'textarea' }
    ]},
    { title: 'Photo', fields: [
      { path: 'imageURL', label: 'Image URL', type: 'text',
        hint: ['Must be a Creative Commons or public-domain image. ',
               { text: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/Category:Chiroptera' },
               ' is a great place to start.'] },
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

  /// A hint is plain text, except where one word in it should be a link. An
  /// array of parts carries both without letting HTML into the schema: strings
  /// become text nodes, { text, url } becomes an anchor. Anything a hint links
  /// to is somewhere else entirely — a licence, a photo library — so it opens
  /// in its own tab rather than throwing away a half-filled form.
  function hintNodes(hint) {
    return (typeof hint === 'string' ? [hint] : hint).map(function (part) {
      if (typeof part === 'string') return document.createTextNode(part);
      return el('a', { href: part.url, target: '_blank', rel: 'noopener noreferrer', text: part.text });
    });
  }

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

  function markDirty() { dirty = true; saveDraft(); }

  /* ----------------------------------------------------------- draft store */

  // Bumped if the shape below ever changes, so an old draft is dropped rather
  // than half-read into a form that no longer matches it.
  var DRAFT_KEY = 'openbat.guide-editor.draft.v1';
  var draftTimer = null;

  /// localStorage throws rather than returning null in a few real situations —
  /// Safari private browsing, storage disabled by policy, a full quota. None of
  /// them should break the editor, so every access goes through these and a
  /// failure just means the draft feature quietly isn't available.
  function readDraft() {
    try {
      var raw = window.localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function writeDraft(obj) {
    try { window.localStorage.setItem(DRAFT_KEY, JSON.stringify(obj)); } catch (e) { /* no draft, then */ }
  }

  function clearDraft() {
    if (draftTimer) { clearTimeout(draftTimer); draftTimer = null; }
    try { window.localStorage.removeItem(DRAFT_KEY); } catch (e) { /* nothing to do */ }
    renderDraftNote();
  }

  /// Debounced: typing a summary fires on every keystroke, and there is no
  /// reason to serialise the whole species that often.
  function saveDraft() {
    if (!editing) return;
    if (draftTimer) clearTimeout(draftTimer);
    draftTimer = setTimeout(writeDraftNow, 500);
  }

  function writeDraftNow() {
    draftTimer = null;
    if (!editing || !dirty) return;
    writeDraft({
      savedAt: new Date().toISOString(),
      isNew: editingIndex < 0,
      originalId: originalId,
      // What it was called when they left, for the restore prompt — the id is
      // what actually finds the species again.
      label: editing.commonName || editing.id || 'a new species',
      editing: editing,
      lockedContributors: lockedContributors,
      note: (ui && ui.note) ? ui.note.value : ''
    });
    renderDraftNote();
  }

  // The debounce means a draft can be up to half a second behind when the page
  // goes away. `pagehide` fires on the paths `beforeunload` misses on iOS —
  // swiping the app away, the tab being reclaimed in the background — so the
  // last edit is flushed there rather than lost.
  window.addEventListener('pagehide', writeDraftNow);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') writeDraftNow();
  });

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
    copyOne: root.querySelector('[data-copy-entry]'),
    submit:  root.querySelector('[data-submit]'),
    note:    root.querySelector('[data-note]'),
    result:  root.querySelector('[data-result]'),
    submitSection: root.querySelector('[data-submit-section]'),
    draftRestore: root.querySelector('[data-draft-restore]'),
    draftNote: root.querySelector('[data-draft-note]')
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
    offerDraft();
    ui.search.focus();
  }

  /* --------------------------------------------------------- draft restore */

  /// A saved draft is offered, never reapplied on its own. Someone who came
  /// back for an unrelated species should not find last week's half-finished
  /// entry loaded under a name they didn't pick.
  function offerDraft() {
    var draft = readDraft();
    clear(ui.draftRestore);
    ui.draftRestore.hidden = !draft;
    if (!draft) return;

    ui.draftRestore.appendChild(el('p', { class: 'ge-draft-title',
      text: 'You have an unfinished edit to ' + (draft.label || 'a species') + '.' }));
    ui.draftRestore.appendChild(el('p', { class: 'ge-hint',
      text: 'Saved on this device ' + describeWhen(draft.savedAt) + '. It has never been sent anywhere.' }));
    ui.draftRestore.appendChild(el('div', { class: 'ge-draft-actions' }, [
      el('button', { class: 'ge-btn', type: 'button', text: 'Pick up where I left off',
                     onclick: function () { restoreDraft(draft); } }),
      el('button', { class: 'ge-btn ge-btn-quiet', type: 'button', text: 'Discard it',
                     onclick: function () {
                       if (!window.confirm('Delete the saved draft of ' + (draft.label || 'this species') + '? This can’t be undone.')) return;
                       clearDraft();
                       ui.draftRestore.hidden = true;
                     } })
    ]));
  }

  function restoreDraft(draft) {
    // Find the species again by the id it had when the draft was made, not by
    // the index: the guide is refetched on every visit and may well have moved
    // or gained entries since.
    var index = -1;
    if (!draft.isNew && draft.originalId) {
      index = guide.species.findIndex
        ? guide.species.findIndex(function (sp) { return sp.id === draft.originalId; })
        : -1;
    }
    var lost = !draft.isNew && index < 0;

    openEditor(index);
    editing = draft.editing || editing;
    // The draft's own snapshot, not the loaded guide's: validation checks that
    // the credits the editor started with came through untouched, and that
    // test has to be against what was locked when the draft was written.
    lockedContributors = draft.lockedContributors || [];
    originalId = draft.isNew ? null : draft.originalId;
    editingIndex = index;
    if (ui.note) ui.note.value = draft.note || '';
    ui.title.textContent = index >= 0
      ? 'Editing ' + (editing.commonName || editing.id)
      : (draft.isNew ? 'New species' : 'Restored draft');
    dirty = true;
    buildForm();
    renderDraftNote();

    if (lost) {
      showProblems(['The species this draft was based on (' + draft.originalId +
                    ') is no longer in the guide — it may have been renamed or merged since. ' +
                    'Your work is here and can be submitted as a new entry, but check it against the current guide first.']);
    }
  }

  /// Rough, and deliberately so: "yesterday" is what someone needs to decide
  /// whether a draft is theirs, and an exact timestamp reads like a log entry.
  function describeWhen(iso) {
    var then = new Date(iso);
    if (isNaN(then.getTime())) return 'earlier';
    var mins = Math.round((Date.now() - then.getTime()) / 60000);
    if (mins < 2) return 'a moment ago';
    if (mins < 60) return mins + ' minutes ago';
    if (mins < 120) return 'about an hour ago';
    if (mins < 24 * 60) return 'about ' + Math.round(mins / 60) + ' hours ago';
    if (mins < 48 * 60) return 'yesterday';
    return 'on ' + then.toISOString().slice(0, 10);
  }

  /// The in-form counterpart: says a draft is being kept and gives the one
  /// control that removes it. Storing someone's work without telling them, or
  /// without a way to delete it, is the version of this feature to avoid.
  function renderDraftNote() {
    if (!ui.draftNote) return;
    var draft = readDraft();
    clear(ui.draftNote);
    ui.draftNote.hidden = !draft;
    if (!draft) return;
    ui.draftNote.appendChild(el('span', {
      text: 'Saved on this device ' + describeWhen(draft.savedAt) + ', so you can close this and come back. It stays in this browser until you submit or delete it. ' }));
    ui.draftNote.appendChild(el('button', {
      class: 'ge-linkbtn', type: 'button', text: 'Delete the saved draft',
      onclick: function () {
        if (!window.confirm('Delete the saved draft? Your edit stays open here, but it won’t survive closing the page.')) return;
        clearDraft();
      }
    }));
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
    ui.draftRestore.hidden = true;
    renderDraftNote();
    ui.title.textContent = index >= 0
      ? 'Editing ' + (editing.commonName || editing.id)
      : 'New species';
    buildForm();
    // Not window.scrollTo(0, 0). On a phone the search box has usually just
    // been focused, so the keyboard is up and Safari has zoomed in; sending the
    // page to absolute 0,0 lands in the top-left corner of that zoomed viewport
    // and reads as the page throwing you to the top and sideways at once.
    // Dismiss the keyboard, then bring the editor's own top into view.
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    // Static markup, so unlike the generated sections it keeps whatever state
    // the last species left it in. Start it closed like the rest.
    ui.submitSection.open = false;
    ui.edit.scrollIntoView({ block: 'start' });
  }

  /// The crop of static/images/world-map.svg, in degrees. Antarctica is cut
  /// off the bottom — no region sits there, and keeping it wasted a third of
  /// the map's height on empty ice. Change either number and the SVG has to be
  /// regenerated to match or every pin drifts.
  var MAP_LAT_TOP = 84;
  var MAP_LAT_BOTTOM = -58;

  /// Which side of its pin each region's label sits on, so that neighbouring
  /// labels — Eastern/Western US, UK & Ireland against Continental Europe —
  /// fall away from each other instead of stacking up. Hand-placed because the
  /// region set is fixed and small; anything the guide adds later defaults to
  /// 's' and simply hangs below its pin, which is readable even if it is not
  /// tuned. Directions are compass points: 'w' puts the label west of the pin.
  var LABEL_DIR = {
    'canada-west': 'w', 'canada-east': 'ne',
    'america-west': 'w', 'america-east': 'e',
    'mexico-central-america': 'w', 'caribbean': 'e',
    'south-america-north': 'e', 'south-america-south': 'w',
    'uk-ireland': 'w', 'continental-europe': 'e',
    'north-africa-middle-east': 'w', 'west-africa': 'w',
    'east-africa': 'e', 'southern-africa': 'w',
    'central-asia': 'e', 'east-asia': 'e',
    'south-asia': 'e', 'southeast-asia': 'e',
    'australia-west': 'nw', 'australia-east': 'w',
    'new-zealand-pacific': 'sw'
  };

  function hasCoords(region) {
    return typeof region.latitude === 'number' && isFinite(region.latitude) &&
           typeof region.longitude === 'number' && isFinite(region.longitude) &&
           region.latitude <= MAP_LAT_TOP && region.latitude >= MAP_LAT_BOTTOM;
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
      // `ge-regions--map` only goes on when every region carries a usable
      // latitude/longitude. Half a map — some regions pinned, the rest piled in
      // one corner — is worse than the plain chip list, so it is all or nothing
      // and the guide's own data decides. Mobile ignores the class entirely.
      var mappable = guide.regions.length > 0 && guide.regions.every(hasCoords);
      var box = el('div', { class: 'ge-regions' + (mappable ? ' ge-regions--map' : '') });
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
        // The region's slug is deliberately NOT shown. It used to sit beside
        // every name as a `<code>` chip, which doubled each row's height,
        // wrapped half the names onto two lines and made the whole section
        // read as debug output. Nobody picking regions needs the id — it is an
        // internal key, and the name is what they are choosing by. It stays as
        // the checkbox's `title` for the rare case someone wants it.
        var chip = el('label', { class: 'ge-region', title: region.id }, [
          cb, el('span', { class: 'ge-region-name', text: region.name })
        ]);
        if (mappable) {
          // Equirectangular, matching static/images/world-map.svg: x is
          // longitude across the full 360°, y is latitude over the band the
          // map is cropped to. Percentages rather than pixels so the map keeps
          // its pins aligned at any width the column happens to be.
          chip.style.setProperty('--x', ((region.longitude + 180) / 360 * 100).toFixed(3) + '%');
          chip.style.setProperty('--y', ((MAP_LAT_TOP - region.latitude) /
                                         (MAP_LAT_TOP - MAP_LAT_BOTTOM) * 100).toFixed(3) + '%');
          chip.setAttribute('data-label-dir', LABEL_DIR[region.id] || 's');
        }
        box.appendChild(chip);
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
    SPEC.forEach(function (section, index) {
      var body = el('div', { class: 'ge-fields' });
      section.fields.forEach(function (field) {
        var control = fieldControl(field);
        body.appendChild(el('div', { class: 'ge-field' }, [
          el('label', { class: 'ge-label', for: 'f-' + field.path.replace(/\./g, '-') }, [
            el('span', { text: field.label }),
            field.required ? el('span', { class: 'ge-req', text: 'required' }) : null
          ]),
          control,
          field.hint ? el('p', { class: 'ge-hint' }, hintNodes(field.hint)) : null
        ]));
      });
      // A <details> rather than a hand-rolled toggle: it collapses without any
      // JavaScript, keyboard and screen-reader behaviour come free, and — the
      // part that matters here — browsers open a collapsed <details> to reveal
      // a match when someone uses in-page find, so Ctrl+F still works across
      // the whole form.
      //
      // Only the first section is open. A dozen expanded groups is a wall of
      // boxes to scroll past before you reach anything you meant to change,
      // and every section's badge already says whether it holds anything — so
      // closed is readable, not hidden. Validation is safe with the required
      // fields collapsed because showProblems() opens every section before it
      // lists the errors, so nothing is ever complained about out of sight.
      ui.form.appendChild(el('details', { class: 'ge-section', open: index === 0 ? '' : null }, [
        el('summary', { class: 'ge-section-head' }, [
          el('span', { class: 'ge-section-title', text: section.title }),
          sectionBadge(section)
        ]),
        body
      ]));
    });
    ui.form.appendChild(contributorsSection());
  }

  /// A count of how many of a section's fields are filled, so a collapsed
  /// section still says whether there is anything inside it. Without this the
  /// closed state hides the difference between "empty" and "already written",
  /// which is exactly what someone scanning the form wants to know.
  function sectionBadge(section) {
    var filled = section.fields.filter(function (field) {
      return prune(getPath(editing, field.path)) !== undefined;
    }).length;
    var required = section.fields.some(function (f) { return f.required; });
    if (!filled) {
      return el('span', { class: 'ge-section-badge' + (required ? ' is-required' : ''),
                          text: required ? 'needed' : 'empty' });
    }
    return el('span', { class: 'ge-section-badge is-filled',
                        text: filled + ' of ' + section.fields.length });
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

    // Closed like every section but the first, so the badge carries the whole
    // message while it is shut. It counts what THIS edit added, not the total:
    // a species with three existing credits and none from you still has a
    // required section to fill, and a badge reading "3 people" would say the
    // opposite.
    var added = (editing.contributors || []).length - lockedContributors.length;
    return el('details', { class: 'ge-section' }, [
      el('summary', { class: 'ge-section-head' }, [
        el('span', { class: 'ge-section-title', text: 'Contributors' }),
        el('span', { class: 'ge-section-badge' + (added ? ' is-filled' : ' is-required'),
                     text: added
                       ? (added === 1 ? 'you’re credited' : added + ' added')
                       : 'add yourself' })
      ]),
      el('p', { class: 'ge-hint',
        text: editingIndex >= 0
          ? 'Add yourself as an editor — every edit needs one, so the guide records who wrote what. Existing credits are locked: they record other people’s work, and only an entry you add here can be removed again.'
          : 'Add yourself — every entry needs one. The first name is treated as this species’ creator, which here is you.' }),
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

    // Every edit has to carry a credit for the person making it. Locked
    // entries don't count towards this — they belong to whoever wrote the
    // species before — so the test is that the list grew during this session.
    if ((s.contributors || []).length <= lockedContributors.length) {
      problems.push(editingIndex >= 0
        ? 'Add yourself under Contributors — every edit needs the name of the person who made it.'
        : 'Add yourself under Contributors — a new species needs the name of the person who created it.');
    }

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

    // Open every section, or an error can name a field that is currently
    // hidden inside a collapsed one — "an image credit is required" with no
    // visible image credit box is a dead end.
    Array.prototype.forEach.call(ui.form.querySelectorAll('details.ge-section'), function (d) {
      d.open = true;
    });
    ui.submitSection.open = true;

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

  /* ---------------------------------------------------------------- submit */

  function showResult(kind, nodes) {
    clear(ui.result);
    ui.result.hidden = false;
    ui.result.className = 'ge-outcome is-' + kind;
    nodes.forEach(function (n) { ui.result.appendChild(n); });
    ui.result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  ui.submit.addEventListener('click', function () {
    withValidated(function (species) {
      // Deliberately sends the entry alone, never the assembled file. The
      // worker rebuilds against whatever is current, so a submission can't
      // carry a stale copy of everyone else's work back over the top of them.
      var body = JSON.stringify({ species: species, note: ui.note.value.trim() });

      ui.submit.disabled = true;
      ui.submit.textContent = 'Submitting…';
      showResult('working', [el('p', { text: 'Opening a pull request…' })]);

      fetch(SUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            return { ok: res.ok, status: res.status, data: data };
          });
        })
        .then(function (r) {
          if (!r.ok || !r.data.url) {
            throw new Error(r.data.error || ('The server said ' + r.status + '.'));
          }
          dirty = false;
          // It is out of the browser and in a pull request now; keeping a copy
          // of it here would only be something to trip over next visit.
          clearDraft();
          showResult('ok', [
            el('p', { class: 'ge-outcome-title', text: 'Thank you — that’s been sent for review.' }),
            el('p', {}, [
              el('span', { text: 'Nothing is live yet. You can follow it here: ' }),
              el('a', { href: r.data.url, target: '_blank', rel: 'noopener',
                        text: 'pull request #' + (r.data.number || '') })
            ]),
            el('p', { class: 'ge-hint', text: 'You can keep editing other species if you like — each one is sent separately.' })
          ]);
          ui.submit.textContent = 'Submitted';
        })
        .catch(function (err) {
          // The manual route still works, and saying so matters more than the
          // error itself — nobody should lose their work because a worker is
          // down or a network blocked it.
          showResult('error', [
            el('p', { class: 'ge-outcome-title', text: 'That couldn’t be submitted.' }),
            el('p', { text: err.message }),
            el('p', { class: 'ge-hint', text: 'Nothing was lost. Open “Or do it yourself on GitHub” below to download your edit and submit it that way instead.' })
          ]);
          ui.submit.disabled = false;
          ui.submit.textContent = 'Try submitting again';
        });
    });
  });

  ui.back.addEventListener('click', function () {
    if (dirty && !window.confirm('Discard the changes to this species? The saved draft goes too.')) return;
    if (dirty) clearDraft();
    dirty = false;
    editing = null;
    ui.edit.hidden = true;
    ui.browse.hidden = false;
    showProblems([]);
    // Reset the submit affordances, or the next species opens showing the last
    // one's outcome and a disabled button.
    ui.result.hidden = true;
    ui.note.value = '';
    ui.submit.disabled = false;
    ui.submit.textContent = 'Submit for review';
    renderResults();
    // Coming back from the bottom of a long form would otherwise leave the
    // list scrolled off the top of the screen.
    offerDraft();
    ui.browse.scrollIntoView({ block: 'start' });
  });
})();
