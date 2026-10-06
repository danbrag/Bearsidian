#!/bin/sh
# Copy the canonical snippet to registered vaults; never sync in reverse.
set -eu
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_dir=$(dirname -- "$script_dir")
exec python3 - "$repo_dir/snippets/bearsidian.css" "$@" <<'PY'
import argparse
import json
import os
from pathlib import Path
import sys
import tempfile

parser = argparse.ArgumentParser(description='Copy Bearsidian to available registered Obsidian vaults.')
parser.add_argument('--registry', type=Path, default=Path.home() / 'Library/Application Support/obsidian/obsidian.json', help='Obsidian registry JSON (default: macOS registry)')
parser.add_argument('--dry-run', action='store_true', help='Report destinations without writing files')
source = Path(sys.argv.pop(1))
args = parser.parse_args()
try:
    data = source.read_bytes()
    registry = json.loads(args.registry.read_text())
    entries = registry['vaults']
    if not isinstance(entries, dict):
        raise ValueError('vaults must be an object')
    # Validate the complete registry before performing any writes.
    paths = []
    for entry in entries.values():
        raw = entry['path']
        if not isinstance(raw, str) or not Path(raw).is_absolute():
            raise ValueError('registered vault paths must be absolute strings')
        if Path(raw) not in paths:
            paths.append(Path(raw))
except (OSError, ValueError, KeyError, TypeError) as error:
    print(f'ERROR: Cannot read canonical CSS or vault registry: {error}', file=sys.stderr)
    sys.exit(1)

updated = skipped = errors = 0
for vault in paths:
    config = vault / '.obsidian'
    snippets = config / 'snippets'
    destination = snippets / 'bearsidian.css'
    if not vault.is_dir() or not config.is_dir():
        print(f'SKIPPED: {vault} (vault or .obsidian unavailable)')
        skipped += 1
        continue
    # Avoid deploying through links or replacing a linked snippet.
    if config.is_symlink() or snippets.is_symlink() or destination.is_symlink():
        print(f'SKIPPED: {vault} (linked configuration/snippets/destination; copy deployment requires local files)')
        skipped += 1
        continue
    if args.dry_run:
        print(f'WOULD UPDATE: {destination}')
        continue
    temporary = None
    try:
        # Never create vault or .obsidian parents, including missing external disks.
        snippets.mkdir(exist_ok=True)
        with tempfile.NamedTemporaryFile(dir=snippets, prefix='.bearsidian-', delete=False) as handle:
            temporary = Path(handle.name)
            handle.write(data)
        temporary.chmod(0o644)
        os.replace(temporary, destination)
        temporary = None
        if destination.read_bytes() != data:
            raise OSError('deployed bytes do not match canonical CSS')
        print(f'UPDATED: {destination} (verified)')
        updated += 1
    except OSError as error:
        print(f'ERROR: {vault}: {error}', file=sys.stderr)
        errors += 1
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
print(f'{updated} updated, {skipped} skipped, {errors} errors' + (' (dry run)' if args.dry_run else ''))
sys.exit(1 if errors else 0)
PY
