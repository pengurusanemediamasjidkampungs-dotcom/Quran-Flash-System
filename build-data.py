"""Build data.js — embed all Quran data (verses only, tafsir stays as fetch)."""
import json, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(BASE, 'data.js')

# Read surah list
with open(os.path.join(BASE, 'data', 'surah_list.json'), encoding='utf-8') as f:
    surah_list = json.load(f)

# Read all verse data (114 surahs)
verses = {}
for sid in range(1, 115):
    path = os.path.join(BASE, 'data', f'{sid:03d}.json')
    if os.path.exists(path):
        with open(path, encoding='utf-8') as f:
            raw = json.load(f)
            for v in raw:
                v['arabic'] = v['arabic'].lstrip('\ufeff')
            verses[sid] = raw

# Build compact JS
parts = []
parts.append('const QURAN_DATA={')
parts.append(f'list:{json.dumps(surah_list, ensure_ascii=False, separators=(",",":"))}')
parts.append(f',v:{json.dumps(verses, ensure_ascii=False, separators=(",",":"))}')
parts.append('};\n')

js = ''.join(parts)

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(js)

size_mb = os.path.getsize(OUT) / 1024 / 1024
print(f'Generated data.js: {os.path.getsize(OUT):,} bytes ({size_mb:.1f} MB)')
print(f'  Surah list: {len(surah_list)} entries')
print(f'  Surah data: {len(verses)} files')
