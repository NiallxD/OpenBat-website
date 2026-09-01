---
title: Field Guide Editor
description: Contribute to the OpenBat Field Guide.
permalink: /guide-editor/
cards: false
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
    <div class="ge-draft-restore" data-draft-restore hidden></div>
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

    <details class="ge-section ge-submit-section" data-submit-section>
      <summary class="ge-section-head">
        <span class="ge-section-title">Submit for review</span>
        <span class="ge-section-badge">last step</span>
      </summary>

    <p class="ge-hint ge-draft-note" data-draft-note hidden></p>

    <div class="ge-field ge-submit-note">
      <label class="ge-label" for="ge-note"><span>Anything the reviewer should know?</span></label>
      <textarea id="ge-note" data-note rows="2" placeholder="Optional — where your information came from, anything you're unsure about"></textarea>
    </div>

    <div class="ge-licence"><p>By submitting, you agree that your words can be published as part of the OpenBat Field Guide under the licence the guide uses, <a href="https://creativecommons.org/licenses/by-nc/4.0/">Creative Commons BY-NC 4.0</a>. In short: anyone may copy and build on the guide for non-commercial use, as long as its contributors are credited. You keep the copyright in what you wrote — you're giving permission to use it, not giving it away. Only add a photo if you hold the rights to it or it is already published under a compatible licence.</p></div>

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
      <p class="ge-hint">The downloaded file is the complete guide with your entry changed — replace <code>SpeciesGuideData.json</code> with it in your pull request. Only your entry will show up in the diff, and the version number is bumped for you once it's merged.</p>
    </details>
    </details>
  </section>

</div>

<!-- ?v= is a cache-buster, same rule as the stylesheet in base.njk: GitHub
     Pages serves this with a long cache lifetime, so bump the number in the
     same commit as any edit to guide-editor.js or returning visitors keep
     running the old copy. -->
<script src="/static/js/guide-editor.js?v=9" defer></script>
