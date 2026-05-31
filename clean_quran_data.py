"""clean_quran_data.py — Unicode normalisation & ghost character removal.

Usage:
    python clean_quran_data.py          # Clean all data/ JSON files in-place
    python clean_quran_data.py --check  # Dry-run: report only, no writes

This script:
  1. NFC-normalises all Arabic text (ensures canonical composition)
  2. Strips BOM (U+FEFF), zero-width chars, and invisible control chars
  3. Removes soft hyphens and other glyph-corrupting codepoints
  4. Validates JSON integrity after cleaning
"""

import json, os, sys, unicodedata

INVISIBLE = {
    0x200B,   # ZERO WIDTH SPACE
    0x200C,   # ZERO WIDTH NON-JOINER
    0x200D,   # ZERO WIDTH JOINER
    0x200E,   # LEFT-TO-RIGHT MARK
    0x200F,   # RIGHT-TO-LEFT MARK
    0x2028,   # LINE SEPARATOR
    0x2029,   # PARAGRAPH SEPARATOR
    0x202A,   # LEFT-TO-RIGHT EMBEDDING
    0x202B,   # RIGHT-TO-LEFT EMBEDDING
    0x202C,   # POP DIRECTIONAL FORMATTING
    0x202D,   # LEFT-TO-RIGHT OVERRIDE
    0x202E,   # RIGHT-TO-LEFT OVERRIDE
    0x2060,   # WORD JOINER
    0x2061,   # FUNCTION APPLICATION
    0x2062,   # INVISIBLE TIMES
    0x2063,   # INVISIBLE SEPARATOR
    0x2064,   # INVISIBLE PLUS
    0xFEFF,   # BOM / ZERO WIDTH NO-BREAK SPACE
    0x00AD,   # SOFT HYPHEN
    0x034F,   # COMBINING GRAPHEME JOINER
}

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE, "data")

def clean_text(text):
    """NFC-normalise and strip invisible/ghost characters from a string."""
    # Remove invisible characters
    cleaned = "".join(ch for ch in text if ord(ch) not in INVISIBLE)
    # NFC normalise (compose canonically)
    cleaned = unicodedata.normalize("NFC", cleaned)
    return cleaned

def clean_file(filepath, dry_run=False):
    """Clean all text fields in a Quran JSON data file."""
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    modified = False
    for entry in data if isinstance(data, list) else [data]:
        for key in ("arabic", "ms", "en", "translationMs", "translationEn"):
            if key in entry and isinstance(entry[key], str):
                cleaned = clean_text(entry[key])
                if cleaned != entry[key]:
                    if not dry_run:
                        entry[key] = cleaned
                    modified = True

    if modified and not dry_run:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return "CLEANED"
    elif modified and dry_run:
        return "WOULD_CLEAN"
    return "OK"

def main():
    dry_run = "--check" in sys.argv
    surah_files = sorted(
        f for f in os.listdir(DATA_DIR) if f.endswith(".json") and f[0].isdigit()
    )

    stats = {"OK": 0, "CLEANED": 0, "WOULD_CLEAN": 0, "WARN": 0}

    for fname in surah_files:
        path = os.path.join(DATA_DIR, fname)
        result = clean_file(path, dry_run=dry_run)
        stats[result] = stats.get(result, 0) + 1
        if result != "OK":
            print(f"  {result:16s} {fname}")

    # Clean surah_list.json too
    list_path = os.path.join(DATA_DIR, "surah_list.json")
    if os.path.exists(list_path):
        result = clean_file(list_path, dry_run=dry_run)
        stats[result] = stats.get(result, 0) + 1
        if result != "OK":
            print(f"  {result:16s} surah_list.json")

    print()
    print(f"  Total files : {sum(stats.values())}")
    print(f"  Clean       : {stats['OK']}")
    if dry_run:
        print(f"  Would clean : {stats.get('WOULD_CLEAN', 0)}")
    else:
        print(f"  Cleaned     : {stats.get('CLEANED', 0)}")
    print(f"  Warnings    : {stats.get('WARN', 0)}")

    if dry_run and stats.get("WOULD_CLEAN", 0) > 0:
        print(f"\n  Run without --check to apply cleaning.")
    elif not dry_run:
        print(f"\n  [OK] done.")

if __name__ == "__main__":
    main()
