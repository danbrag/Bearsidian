# Bearsidian

Bearsidian is a CSS enhancement layer that makes the **Bear Style** theme in Obsidian look and behave more like Bear. It preserves a set of manually tuned desktop customizations in one maintainable snippet. It is not a standalone theme.

## What it changes

- Dark left and right sidebars, ribbons, navigation controls, vault switcher, titlebar, and status bar.
- Consistent dark result cards, readable excerpts and match highlights for sidebar mentions and search results, with hover and focus colors.
- Off-white editor and empty-note surfaces in light mode; Bear Style continues to supply the dark editor.
- File/folder labels, Bear-style folder carets, and carefully aligned Iconic file/folder icons, while retaining Obsidian's native hierarchy indentation.
- Readable medium-gray inactive note titles in the editor tab bar, with the active tab retaining its theme styling.
- Balanced Editing Toolbar insets and darker versions of its six standard pastel highlight colors.

## Requirements and compatibility

**Required:** Obsidian desktop and the Bear Style theme. The snippet depends on their styling and DOM structure.

**Optional:** [Iconic](https://github.com/gfxholo/iconic) for custom file/folder icons, and [Editing Toolbar](https://github.com/PKM-er/obsidian-editing-toolbar) for the toolbar and highlight integrations. Neither plugin is required to use the sidebar/chrome customization. Focus Mode dimming remains an independent snippet and is not included.

The source configuration was inspected on macOS with Obsidian **1.14.4**, Bear Style **1.2.1**, Iconic **1.1.10**, and Editing Toolbar **4.1.5**. The maintainer tested the consolidated snippet in their working vault and accepted its appearance, including the final inactive-tab text contrast and Iconic caret alignment. CSS parsing, source cascade comparison, and copy deployment were also verified. This is not a comprehensive check of every view or plugin mode; see [validation details](docs/VALIDATION.md). Mobile, Windows, Linux, other themes, and other plugin/version combinations have not been tested.

## Installation

1. Install and select **Bear Style** under **Settings → Appearance → Themes**.
2. Download [snippets/bearsidian.css](snippets/bearsidian.css) and copy it to:

   ```text
   <vault>/.obsidian/snippets/bearsidian.css
   ```

3. In **Settings → Appearance → CSS snippets**, refresh the snippet list if necessary and enable **bearsidian**.
4. If migrating from the original customizations, disable **bear-dark-sidebar** and **sidebar-text-size** after enabling Bearsidian. Keep their files until you have reviewed the result. Other independent snippets can remain enabled.

Use a regular copied file. Obsidian does not need access to the repository or its disk after installation.

## Updating

Replace the vault's `bearsidian.css` with the latest repository copy. Obsidian normally reloads changed snippets; refresh or toggle the snippet if the change does not appear. Repeat for each vault where you use Bearsidian.

## Customization and limitations

The `body` variables near the top of the stylesheet control the main sidebar palette. `--bear-tab-inactive-text` controls inactive note titles in the editor tab bar and defaults to a medium gray (`#929698`). `--bear-editor-bg` on `.theme-light` controls the light editor surface. A retained `:root` palette reflects the original cascade: variables set directly on `body` take precedence over inherited root values. Edit the `body` palette for normal application colors.

When developing, edit **only `snippets/bearsidian.css`** and deploy from the repository. Vault copies are outputs and will be overwritten by deployment. For a shared setup, keep additional personal overrides in a separate snippet and check their cascade order.

The Iconic offsets and caret placement are intentional. Do not replace `.nav-folder-children` indentation or reposition its hierarchy. The existing rule on that element changes only guide-line color. Iconic's `.iconic-item` wrapper remains under the plugin's control.

Editing Toolbar uses the original `left: 24px` and `width: calc(100% - 48px)` geometry. Its six standard inline hex highlight colors are matched case-insensitively in dark mode. Custom highlight backgrounds remain unchanged; highlighted text uses the editor's normal text color.

Many declarations use `!important` to override theme/plugin styling. Obsidian or plugin DOM changes can require adjustments. Broad titlebar/ribbon/vault selectors are retained for compatibility; stacked tabs, extra windows, custom toolbar modes, emoji icons, and narrow layouts need visual checking. See [the CSS inventory](docs/INVENTORY.md) for preservation decisions.

## Local development and deployment

The repository copy is canonical:

```text
snippets/bearsidian.css → scripts/deploy.sh → registered vault copies
```

The helper is an optional **development/local maintenance convenience**, not a requirement for normal users. It requires `python3` and a POSIX shell. On macOS it reads Obsidian's registered-vault list from `~/Library/Application Support/obsidian/obsidian.json`; this avoids parsing CLI output or maintaining a second vault list.

```sh
./scripts/deploy.sh --dry-run
./scripts/deploy.sh
```

For another registry location, use `--registry /path/to/obsidian.json`. The registry must have a `vaults` object containing entries with absolute `path` values. Only registered vaults are considered, including registered test vaults. Unregistered templates are not deployment targets.

The script verifies that each vault and `.obsidian` directory exists before creating `snippets`. It skips unavailable vaults and linked configuration/snippet destinations without creating their missing parents. It copies atomically, verifies bytes, reports each update/skip, and continues if another vault fails. Actual write errors produce a nonzero exit status; unavailable vaults do not. It never deletes unrelated snippets or changes which snippets are enabled.

Development workflow:

1. Edit the canonical stylesheet and check CSS syntax and cascade behavior.
2. Review the diff and run `sh -n scripts/deploy.sh` (or `zsh -n scripts/deploy.sh`) when changing the helper.
3. Commit a logical change.
4. **After every commit that changes `snippets/bearsidian.css`, run `./scripts/deploy.sh`** and verify its reported destinations.
5. Review Obsidian visually in light/dark modes, with nested folders and the optional plugins in use.

Documentation-only commits do not require deployment. No Git hook is installed. Existing template configuration synchronization remains independent of Bearsidian.

## Project files

- `snippets/bearsidian.css` — the canonical customization.
- `scripts/deploy.sh` — optional registered-vault copy helper.
- `docs/INVENTORY.md` — complete original rule inventory and consolidation decisions.
- `docs/VALIDATION.md` — initial verification evidence and outstanding visual checks.
- `screenshots/` — reserved for future screenshots reviewed for public sharing.

Original imported CSS is recoverable from the initial inventory commit in Git history. Local originals are preserved during migration; the current repository keeps one canonical snippet.

## License

[MIT](LICENSE).
