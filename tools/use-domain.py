#!/usr/bin/env python3
"""Change SEO/public absolute URLs without breaking relative CSS/photos.

Examples:
    python tools/use-domain.py production   # after your custom domain is configured
    python tools/use-domain.py github       # while using github.io/sunfile for previews

No CNAME file is generated. Enable and verify the custom domain in your host's
settings once you own/control it. Using a custom domain in metadata doesn't
register, activate, or deploy the domain.
"""
from pathlib import Path
import argparse

ROOT = Path(__file__).resolve().parents[1]
URLS = {
    'production': 'https://sunpilefoundation.com/',
    'github': 'https://dineshbabu2901.github.io/sunfile/',
}
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('mode', choices=URLS)
args = parser.parse_args()
new = URLS[args.mode]
old = URLS['github' if args.mode == 'production' else 'production']
changed = 0
for path in [*ROOT.rglob('*.html'), ROOT/'robots.txt', ROOT/'sitemap.xml']:
    content = path.read_text(encoding='utf-8')
    updated = content.replace(old, new)
    if content != updated:
        path.write_text(updated, encoding='utf-8')
        changed += 1
print(f'Updated {changed} files. Public metadata URL: {new}')
print('Important: local asset paths are unchanged. This script does not configure DNS or hosting.')
