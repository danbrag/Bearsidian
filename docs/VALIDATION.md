# Validation and visual review

## Maintainer visual acceptance — October 6, 2026

The maintainer tested the consolidated snippet in their working Obsidian vault and reported that it looked good. Follow-up screenshots and feedback guided two small refinements:

- Inactive Markdown note titles in the editor tab bar use `--bear-tab-inactive-text: #929698` at full opacity, balancing legibility with the active tab's emphasis. Active titles, note icons, and sidebar tab controls retain their existing styling.
- The manufactured caret for Iconic folders uses `left: 2px`, aligning it with plain-folder carets. Icon/title offsets and native folder hierarchy spacing remain unchanged.

The maintainer accepted these final refinements. Each CSS change passed parsing and diff checks, was committed and pushed, and was deployed to all three available registered vaults with matching bytes. This acceptance covers the appearance exercised by the maintainer; it does not establish coverage of all views, toolbar modes, or platforms.

## Sidebar mention contrast correction — October 6, 2026

A maintainer-supplied DevTools capture confirmed that the right-sidebar backlink excerpt used muted sidebar text (`#a5aaac`) on a light result-card background (`#f7f6f3`). The result card also inherited the light border palette, and matched text used a pale yellow highlight. The captured DOM includes `.search-result-container`, `.search-result-file-matches`, `.search-result-file-match`, and `.search-result-file-matched-text`.

The correction supplies a local result palette in either sidebar, covering the shared result structure used by linked/unlinked mentions, outgoing links, and search. It sets dark card/border/interaction colors, brighter excerpt text, and white matched text on a dark amber highlight. Main-editor result cards retain the theme palette. Native wrapping, collapse behavior, and result layout are preserved.

The read-only `scripts/capture-mention-styles.js` helper collects computed styles and matching rules without note text or link destinations. Inspect a mention in DevTools Elements, then run the script in Console. It copies a report to the clipboard. Review reports before sharing, because custom CSS may contain private URLs or paths.

Automated Chromium checks replayed the supplied matched-rule cascade and reproduced the original pale card/muted text combination. A standalone result fixture then passed 12 combinations of light/dark mode, left/right sidebar, and backlink/outgoing-link/search view. Checks covered card and highlight colors, excerpt text, pointer hover, `.has-focus`, keyboard focus outlines, and a long excerpt at a narrow width. Main-editor card styles remained unchanged in both modes. The fixture uses captured rules plus locally installed Obsidian result interaction rules; it is not a complete live Obsidian DOM or full theme reconstruction. The canonical stylesheet parsed in Chromium, the capture helper passed JavaScript syntax checking, and the diff passed whitespace checking.

On October 7, the maintainer enabled Bearsidian in the test vault, supplied light/dark screenshots showing the corrected cards and highlights, and accepted their appearance. The subsequent native audit expanded coverage beyond those linked-mention screenshots; see below.

## Native sidebar audit — October 7, 2026

With the maintainer's authorization, five synthetic Markdown notes were created in the scratchpad vault. The two legacy snippets were disabled through Obsidian Settings so the audit exercised Bearsidian plus the independent Focus Mode dimming snippet. No new plugin was installed.

Native screenshots and live DevTools DOM/computed-style captures identified three additional light-mode defects:

- Sidebar alias pills and plain-text properties used `#222222` against the dark sidebar. Local metadata palette bindings now supply readable values, tags, links, row interaction states, and subdued dividers. Property inputs use the row surface, unchecked checkboxes have a readable border and checked checkboxes keep their accent, and native date controls use a dark color scheme within sidebar metadata only.
- Footnotes rendered an embedded editor with Bear Style's light-mode `--bear-text-color: #444`. The Footnotes sidebar now locally binds that alias and its identifier/divider/editing palette.
- The left Search field used a white background with sidebar-colored text. Sidebar search fields now share the dark input surface, readable placeholders, and a suitable focus border.

Live light/dark checks covered linked and unlinked mentions, aliases, task excerpts, multiple matches, long titles/context, outgoing links (including an unlinked destination), global search and zero-result states, file/all properties, outline, nested tags, grouped bookmarks, and Quick Switcher suggestions. A light-mode bookmark context menu and native property calendar were also inspected. Property focus and a checked/unchecked checkbox were exercised. Clicking an unlinked mention's **Link** button changed the fixture from 10 linked / 4 unlinked mentions to 11 linked / 3 unlinked mentions and persisted the wikilink to the note.

The right sidebar was checked at 300 px and 220 px. At 220 px, native property rows stack labels/values, outline titles wrap, and mention controls remain available. In-document backlinks were checked in Reading view in both modes and retain the main editor palette. The original sidebar sizes and disabled in-document backlink state were restored after the audit. The scratchpad retains the synthetic notes and grouped bookmark for further checking.

Eight Chromium replay combinations used captured live property/footnote/search DOM and the actual running Obsidian/theme/plugin styles: light/dark, left/right sidebar, and 220/300 px widths. They reproduced the original light-mode property and footnote defects, verified the correction, and confirmed a property panel in the center retains its existing text color. Chromium parsed all 155 canonical rules with no empty declaration blocks. Native screenshots provide the separate visual evidence; the replay is not a replacement for app interaction.

Reviewed comparison images are in [`screenshots/qa`](../screenshots/qa/). See [QA scenarios](QA_SCENARIOS.md) for fixture setup and the coverage table. Raw DOM/style exports and full-window captures were kept outside the repository. Page-preview hover behavior, additional windows, stacked tabs, Canvas, Bases, mobile, and unlisted plugin surfaces remain outside verified coverage. An attempted programmatic page-preview hook did not retain a visible popover, so it is not counted as visual evidence.

## Initial consolidation checks

Checks performed against the initial consolidation:

- Parsed all 138 original rules with tinycss2 and all 141 canonical rules (some grouped selectors split to remove only superseded members). Parsed declaration lists and checked for malformed tokens.
- Compared all 487 effective original selector/property entries, respecting `!important` and source order. All retained values match after resolving the two new color variables and accounting for the intentionally case-insensitive highlight selectors.
- Removed 46 superseded selector/property entries. No repeated exact selector/property entries remain in the canonical CSS. Overlapping selectors and deliberate shorthand/longhand background pairs remain.
- Preserved source order, native hierarchy spacing, tuned caret/icon offsets, toolbar geometry, and six highlight RGBA values. This comparison is a source-level check, not a complete browser cascade or rendering proof.
- Passed `sh -n scripts/deploy.sh` and `zsh -n scripts/deploy.sh`.
- Exercised deployment twice using a temporary registry: available vaults, missing snippets directory, paths with spaces, unavailable external-disk path, existing vault without `.obsidian`, and symlink skip. Confirmed no missing parent directories were created and an unrelated snippet remained unchanged.
- Ran actual deployment after the CSS commit: three available registered vaults updated, bytes verified; zero skipped and zero write errors. The unregistered reusable template was not targeted.
- Checked public files for personal vault paths, home-directory/volume paths, embedded credentials and accidental configuration/note contents. Only custom CSS, project documentation and the helper are published; no vault registry, appearance configuration, plugin settings, or notes are included.

The small CSS parser was installed only into a temporary validation directory. No dependency tree, test framework, permanent hook, or CI was added to this project.

## Additional visual coverage

Deployment copies the snippet but does not enable it or disable older snippets. Enable `bearsidian` and disable the two superseded custom snippets in Obsidian before evaluating it on its own. Keep Focus Mode dimming independent.

The following scenarios have not been comprehensively verified and remain useful checks after future CSS, theme, or plugin changes:

- Light/dark editor, both sidebars, hover/active states, tabs, titlebar, status bar, vault controls, and lower ribbon corners.
- Several nesting depths, collapsed/expanded folders, folders with and without Iconic icons, note icons, SVG and emoji icons; confirm native hierarchy remains intact.
- Editing Toolbar at wide/narrow editor widths and any toolbar modes you use; check balanced insets and no clipping.
- The six standard highlights in both lower/upper-case inline hex values, plus a custom color that should retain its background.
- Reading view, live preview, empty editor, additional windows, and stacked tabs as applicable.

Legacy/overlapping selectors and the inherited root palette remain because source inspection cannot establish that removing them would be safe. Compatibility outside the inspected macOS configuration is unverified.
