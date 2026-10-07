/*
 * Read-only Obsidian DevTools diagnostic.
 * Inspect a problematic mention/card in Elements so it is available as $0,
 * then paste this script into Console. The report is copied to the clipboard.
 * Repeat for relevant modes/states; hover can be forced in Elements > :hov.
 * Note text and link destinations are omitted. CSS rules can contain custom
 * URLs or local paths: review the report before sharing it.
 */
(() => {
    const selected = typeof $0 !== 'undefined' && $0 instanceof Element ? $0 : null;
    const root = selected?.closest('.backlink-pane, .outgoing-link-pane, .search-result-container')
        || selected?.closest('.workspace-leaf-content') || selected;
    if (!root) throw new Error('Inspect the problematic mention in Elements first, then rerun.');

    const properties = [
        'color', 'background-color', 'background-image', 'border-top-color',
        'box-shadow', 'opacity', 'display', 'visibility', 'font-size',
        'line-height', 'white-space', 'overflow-wrap', 'word-break',
        'overflow-x', 'overflow-y', 'width', 'min-width', 'max-width',
        '--background-primary', '--background-primary-alt', '--background-secondary',
        '--text-normal', '--text-muted', '--text-faint', '--text-accent',
        '--text-highlight-bg', '--search-result-background',
        '--search-result-background-hover', '--search-result-background-active'
    ];
    const label = el => el.tagName.toLowerCase()
        + [...el.classList].map(name => '.' + name).join('');
    const nodes = new Set();
    for (let el = selected; el; el = el.parentElement) nodes.add(el);
    nodes.add(root);
    const candidates = [...root.querySelectorAll('*')];
    const relevant = candidates.filter(el =>
        /search-result|backlink|outgoing-link|tree-item|highlight|internal-link/.test(el.className?.toString() || '')
        || el.matches('mark, a, input, button'));
    relevant.slice(0, 60).forEach(el => nodes.add(el));
    if (selected) [...selected.querySelectorAll('*')].slice(0, 20).forEach(el => nodes.add(el));
    const elements = [...nodes];
    const rows = elements.map((el, index) => {
        const style = getComputedStyle(el);
        return {
            index, element: label(el), parent: el.parentElement ? label(el.parentElement) : null,
            state: Object.fromEntries(['data-type', 'role', 'aria-expanded', 'aria-selected', 'aria-disabled']
                .filter(key => el.hasAttribute(key)).map(key => [key, el.getAttribute(key)])),
            computed: Object.fromEntries(properties.map(key => [key, style.getPropertyValue(key).trim()])),
            inline: el.style.cssText,
            hovered: el.matches(':hover'), focused: el.matches(':focus'),
            bounds: {width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height},
            scroll: {width: el.scrollWidth, height: el.scrollHeight}
        };
    });
    const matchedRules = [];
    const unreadableSheets = [];
    const wanted = key => properties.includes(key)
        || /^(background|border|outline|text-decoration|padding|margin|font|overflow|--)/.test(key);
    function walk(rules, source, conditions = []) {
        for (const rule of rules) {
            if (rule.selectorText && rule.style) {
                const matches = [];
                elements.forEach((el, index) => {
                    try { if (el.matches(rule.selectorText)) matches.push(index); } catch (_) {}
                });
                if (matches.length) {
                    const declarations = [...rule.style].filter(wanted).map(key => ({
                        property: key, value: rule.style.getPropertyValue(key),
                        important: rule.style.getPropertyPriority(key) === 'important'
                    }));
                    if (declarations.length) matchedRules.push({source, conditions, selector: rule.selectorText, matches, declarations});
                }
            }
            if (rule.cssRules) walk(rule.cssRules, source,
                rule.conditionText ? [...conditions, rule.conditionText] : conditions);
        }
    }
    [...document.styleSheets].forEach((sheet, index) => {
        const source = sheet.href || `inline stylesheet ${index}`;
        try { walk(sheet.cssRules, source, sheet.disabled ? ['stylesheet disabled'] : []); }
        catch (error) { unreadableSheets.push({source, reason: error.name}); }
    });
    const report = {
        capturedAt: new Date().toISOString(), bodyClasses: document.body.className,
        viewport: {width: innerWidth, height: innerHeight, pixelRatio: devicePixelRatio},
        selected: selected ? label(selected) : null, root: label(root),
        omittedRelevantElements: Math.max(0, relevant.length - 60),
        elements: rows, matchedRules, unreadableSheets
    };
    const output = JSON.stringify(report, null, 2);
    if (typeof copy === 'function') copy(output);
    console.log(output);
    console.info('Mention style report ready; copied when DevTools copy() is available. Note text and link destinations were omitted.');
})();
