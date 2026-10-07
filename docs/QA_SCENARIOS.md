# Synthetic vault scenarios

Use these fixtures in a disposable vault running Bear Style and Bearsidian. They intentionally contain aliases, tasks, links, nested tags, mixed property types, long labels, and an unresolved link. They are test content, not product documentation.

Copy the five Markdown files from `docs/qa-fixtures/` into a folder named **Bearsidian QA** in the vault. Preserve that folder name because the `related` property contains a vault-relative link to it. Enable `bearsidian`, disable the superseded `bear-dark-sidebar` and `sidebar-text-size` snippets, and leave independent snippets under their own control.

Open **Palette Target**. Initially the sidebar should find 10 linked mentions across two source notes and four unlinked mentions in **Unlinked Samples**, including its alias **Palette Alias**. The note itself contains a plain-text **Empty State** mention for the Outgoing links unlinked section. **Empty State** has no outgoing links or properties; it does have that incoming unlinked mention.

## Audit coverage — October 7, 2026

| Surface | Native coverage | Outcome |
| --- | --- | --- |
| Linked mentions | Light/dark; aliases, heading/Markdown links, tasks, repeated matches, long source title/context | Readable cards and highlights |
| Unlinked mentions | Light/dark; title and alias matches; hover controls; Link action | Link persisted; linked count 10 → 11 and unlinked count 4 → 3 |
| Outgoing links | Light/dark; resolved/unresolved destinations, heading link, unlinked destination | Readable titles, destination pill, and excerpt |
| Global search | Light/dark; populated and zero-result states | White input corrected; results and empty state readable |
| File properties | Light/dark; alias/list pills, tags, text, number, checkbox, date, related link; focus and checkbox interaction | Dark text corrected; inputs and row/divider states coordinated |
| Native property date picker | Calendar opened in light-mode app with dark sidebar | Calendar and icon use the dark control scheme |
| All properties | Light/dark; names, icons, and counts | Readable |
| Outline | Light/dark; nested headings, selected row, long heading | Native wrapping preserved |
| Tags | Light/dark; nested tags and counts | Readable |
| Footnotes | Light/dark; actual rendered footnote embed | Light-mode dark text corrected |
| Bookmarks | Light/dark; long label within a group | Readable and wrapped |
| Floating UI | Quick Switcher title/alias/bookmark suggestions in both modes; bookmark dialog and native context menu in light mode | Readable; no new CSS needed |
| Narrow right sidebar | Properties in both modes; unlinked mentions and outline in light mode at 220 px | Native stacked properties and wrapping retained |
| Embedded backlinks | Reading view, light/dark | Main editor palette retained |

The maintainer accepted the original linked-card correction from screenshots. The broader rows above are agent-performed native checks using the scratchpad fixtures. Eight additional browser replay cases verify the captured property/search/footnote cascade across both sidebar positions, both modes, and 220/300 px widths; they also verify that a center property panel keeps its original text color.

Page-preview hover behavior is not counted as verified: a programmatic preview-hook attempt did not retain a visible popover. Additional windows, stacked tabs, Canvas, Bases, mobile, and unlisted community-plugin surfaces have not been covered by this pass.

## Repeating key interactions

1. In **Palette Target → Backlinks**, expand Unlinked mentions and hover a result. Click **Link** once. Confirm the result becomes a linked mention and the source Markdown contains a wikilink. The original fixture copy in this repository retains all four plain-text mentions for a clean rerun.
2. In **Outgoing links**, expand Unlinked mentions. Confirm **Empty State** appears as a potential destination and that an unresolved **Missing QA Note** remains distinguishable in Links.
3. Search for `path:"Bearsidian QA" "Palette"`, then use an unmatched term to check the empty state. Inspect the field, highlights, result controls, and sort selector.
4. Open **Show file properties**. Focus the `status` value, toggle `reviewed` on/off, and open the date-picker button without changing its date. Repeat at 300 px and 220 px sidebar widths.
5. Bookmark **Palette Target**, give it a long title, and place it in a group. Inspect the grouped row and its context menu.
6. With the note itself active, toggle backlinks in document and inspect them in Reading view. Restore the setting and sidebar sizes afterward.

## Reviewed images

- [Before/after contrast comparison](../screenshots/qa/sidebar-contrast-before-after.png)
- [Light-mode sidebar coverage](../screenshots/qa/sidebar-coverage-light.png)
- [Dark-mode sidebar coverage](../screenshots/qa/sidebar-coverage-dark.png)
- [Narrow properties in both modes](../screenshots/qa/narrow-properties.png)

These images are cropped native screenshots of synthetic fixture content. Full-window captures and raw live CSS/DOM exports were kept outside the repository.
