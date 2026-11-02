#!/usr/bin/env python3
"""Basic offline smoke checks for Sun Pile Foundation static site (Python 3)."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
from bs4 import BeautifulSoup
import json, re, sys

ROOT = Path(__file__).resolve().parents[1]
errors = []
page_urls = set()
indexable = []
site_paths = list(ROOT.rglob('*.html'))
for path in site_paths:
    doc = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
    main = doc.find('main')
    robots = doc.find('meta', attrs={'name':'robots'})
    if robots and 'noindex' not in robots.get('content',''):
        indexable.append(path)
        if not doc.title or not doc.title.get_text(strip=True): errors.append(f'{path}: missing title')
        if not doc.find('meta',attrs={'name':'description'}):errors.append(f'{path}: missing description')
        canon = doc.find('link', attrs={'rel':'canonical'})
        if not canon: errors.append(f'{path}: missing canonical')
        else: page_urls.add(canon.get('href'))
        if not doc.find('meta',attrs={'property':'og:image'}):errors.append(f'{path}: missing OG image')
        if not main:errors.append(f'{path}: no main')
    for element in doc.find_all(['a','img','script','link','source','video']):
        for attr in ('href','src','poster','srcset'):
            val = element.get(attr)
            if not val or attr=='srcset':continue
            if val.startswith(('#','mailto:','tel:','javascript:','data:','https:','http:','//')):continue
            val=unquote(urlsplit(val).path)
            if not val:continue
            target = (path.parent / val).resolve()
            if target.is_dir(): target=target/'index.html'
            if target.is_file():continue
            if val.endswith('/') and (path.parent/val/'index.html').is_file():continue
            errors.append(f'{path.relative_to(ROOT)}: missing {attr} {val}')
    for script in doc.find_all('script', attrs={'type':'application/ld+json'}):
        try: json.loads(script.string or script.get_text())
        except Exception as e: errors.append(f'{path}: invalid JSON-LD {e}')

sm=ROOT/'sitemap.xml'
if sm.exists():
    import xml.etree.ElementTree as ET
    try:
        root=ET.parse(sm).getroot()
        names={'http://www.sitemaps.org/schemas/sitemap/0.9'}
        listed={x.text for x in root.findall('{*}url/{*}loc')}
        for url in page_urls:
            if url not in listed:errors.append('Not in sitemap: '+url)
        if not listed.issubset(page_urls):errors.append('Sitemap has URLs not matched by page canonicals: '+repr(listed-page_urls))
    except Exception as e:errors.append(f'Sitemap XML invalid: {e}')
print(f'HTML pages: {len(site_paths)}; indexable canonicals: {len(page_urls)}; issues: {len(errors)}')
for e in errors[:45]: print('ERROR:',e)
sys.exit(1 if errors else 0)
