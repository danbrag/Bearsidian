# Initial consolidation validation

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

## Remaining native visual checks

Deployment copies the snippet but does not enable it or disable older snippets. Enable `bearsidian` and disable the two superseded custom snippets in Obsidian before evaluating it on its own. Keep Focus Mode dimming independent.

A full visual acceptance pass has not been performed. Check:

- Light/dark editor, both sidebars, hover/active states, tabs, titlebar, status bar, vault controls, and lower ribbon corners.
- Several nesting depths, collapsed/expanded folders, folders with and without Iconic icons, note icons, SVG and emoji icons; confirm native hierarchy remains intact.
- Editing Toolbar at wide/narrow editor widths and any toolbar modes you use; check balanced insets and no clipping.
- The six standard highlights in both lower/upper-case inline hex values, plus a custom color that should retain its background.
- Reading view, live preview, empty editor, additional windows, and stacked tabs as applicable.

Legacy/overlapping selectors and the inherited root palette remain because source inspection cannot establish that removing them would be safe. Compatibility outside the inspected macOS configuration is unverified.
