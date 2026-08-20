---
title: Field Guide Editor
description: Contribute to the OpenBat Field Guide.
permalink: /guide-editor/
publish: true
---

## Field Guide Editor

OpenBat stores all of it's Field Guide data in one place on GitHub. Each time someone opens the OpenBat Field Guide on their phone, the app checks to see if there is a new version and if their is, downloads it.

The tool below allows anyone to suggest edits and additions to the Field Guide. The current guide loads automatically, so you're always editing the latest version. **You don't need a GitHub account** to suggest edits!

<div class="ge-steps">
  <p><strong>1.</strong> Find your species below, or add a new one, and edit it.</p>
  <p><strong>2.</strong> Add your name under Contributors, so you get the credit.</p>
  <p><strong>3.</strong> Press Submit. Nothing goes live until it's been checked.</p>
</div>

Nothing is sent anywhere until you press Submit, and if you'd rather handle the pull request yourself you still can, the option is at the bottom of the form.

Before adding a photo or writing a description, please read the [contributor guide](https://github.com/NiallxD/OpenBat-FieldGuide#contributing-a-species-or-region), particularly the rules on image licensing and writing in your own words.

<div id="guide-editor">

  <section data-step="load" class="ge-card">
    <h3>Loading the guide</h3>

    <p class="ge-fetching" data-fetching>Fetching the latest guide from GitHub…</p>

    <div data-fallback hidden>
      <p class="ge-error" data-load-error hidden></p>
      <p>You can open the file yourself instead — <a href="https://github.com/NiallxD/OpenBat-FieldGuide/blob/main/SpeciesGuideData.json">download it from GitHub</a>, then:</p>
      <div class="ge-drop" data-drop>
        <p>Drop <code>SpeciesGuideData.json</code> here</p>
        <p class="ge-hint">or</p>
        <label class="ge-btn">
          Choose file
          <input type="file" accept="application/json,.json" data-file hidden>
        </label>
      </div>
      <details class="ge-paste">
        <summary>Paste the JSON instead</summary>
        <textarea data-paste rows="6" placeholder="Paste the contents of SpeciesGuideData.json"></textarea>
        <button type="button" class="ge-btn ge-btn-quiet" data-paste-go>Load pasted JSON</button>
      </details>
      <p><button type="button" class="ge-btn ge-btn-quiet" data-retry>Try GitHub again</button></p>
    </div>
  </section>

  <section data-step="browse" class="ge-card" hidden>
    <div class="ge-meta" data-meta></div>
    <div class="ge-search-row">
      <input type="search" data-search placeholder="Search by name, family or ID" aria-label="Search species">
      <button type="button" class="ge-btn" data-add-new>Add a new species</button>
    </div>
    <div class="ge-results" data-results></div>
  </section>

  <section data-step="edit" class="ge-card" hidden>
    <div class="ge-edit-head">
      <h3 data-edit-title></h3>
      <button type="button" class="ge-btn ge-btn-quiet" data-back>Back to list</button>
    </div>

    <div class="ge-errors" data-errors hidden></div>
    <div data-form></div>

    <div class="ge-field ge-submit-note">
      <label class="ge-label" for="ge-note"><span>Anything the reviewer should know?</span></label>
      <textarea id="ge-note" data-note rows="2" placeholder="Optional — where your information came from, anything you're unsure about"></textarea>
    </div>

    <div class="ge-actions">
      <button type="button" class="ge-btn ge-btn-primary" data-submit>Submit for review</button>
    </div>
    <p class="ge-hint">No GitHub account needed. Your entry is sent for review as a pull request — nothing goes live until it's checked and merged.</p>

    <div class="ge-outcome" data-result hidden></div>

    <details class="ge-manual">
      <summary>Or do it yourself on GitHub</summary>
      <p class="ge-hint">Prefer to open the pull request in your own name? Take the file and go through GitHub as normal.</p>
      <div class="ge-actions">
        <button type="button" class="ge-btn ge-btn-quiet" data-download>Download updated guide</button>
        <button type="button" class="ge-btn ge-btn-quiet" data-copy>Copy whole file</button>
        <button type="button" class="ge-btn ge-btn-quiet" data-copy-entry>Copy this entry only</button>
      </div>
      <p class="ge-hint">The downloaded file is the complete guide with your entry changed, the version bumped and the date set — replace <code>SpeciesGuideData.json</code> with it in your pull request. Only your entry will show up in the diff.</p>
    </details>
  </section>

</div>

<script src="/static/js/guide-editor.js" defer></script>
