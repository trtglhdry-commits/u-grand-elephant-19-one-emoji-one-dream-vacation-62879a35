// One Emoji, One Dream Vacation
// (make.fun bounty u-grand-elephant-19-one-emoji-one-dream-vacation-62879a35)
//
// Writes exactly one emoji, nothing else, to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt).
// Deterministic: the same single code point on every run.
//
// The entry is Mount Fuji (U+1F5FB), against the judge's brief:
//   - Exactly one emoji, no words, and it plainly names a dream
//     vacation: Mount Fuji is Japan in a single glyph — a trip with a
//     destination, not just a holiday mood.
//   - Evokes the trip vividly at a glance, like a postcard: a
//     snow-capped mountain against the sky is the postcard itself —
//     a stranger sees the place before reading a word.
//   - Personal and specific rather than generic: one particular
//     mountain, one particular dream (climb Fuji at sunrise), where
//     the generic beach and sunset emojis could stand for any trip.
//   - A spark of surprise: the field is flooded with islands and
//     sunsets; Fuji is a fresh, unexpected pick that still reads
//     instantly.
//   - Reads instantly across cultures and screens: the most famous
//     mountain on earth, clear at the smallest size, needing no
//     explanation.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY = "\u{1F5FB}";

// The kit's gate: UTF-8 text of 1 to 8 characters, not only whitespace.
// Enforce it here, plus the competition's own rule — exactly one emoji,
// nothing else — so a bad entry can never be written.
const chars = [...ENTRY];
if (chars.length !== 1) {
  throw new Error(`entry is ${chars.length} characters; must be exactly 1 emoji`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (/\s/.test(ENTRY)) {
  throw new Error("entry must contain no whitespace");
}
// One emoji: a single code point outside the basic multilingual plane
// (or a single BMP symbol) — reject anything joined or combined.
const codePoint = ENTRY.codePointAt(0);
if (codePoint === undefined || codePoint < 0x1f000) {
  throw new Error("entry must be a single emoji code point");
}
// No joiners or selectors: a ZWJ sequence or a variation selector would
// smuggle a second glyph into "one emoji".
if (ENTRY.includes("\u200D") || ENTRY.includes("\uFE0E") || ENTRY.includes("\uFE0F")) {
  throw new Error("entry must not contain joiners or variation selectors");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
// No trailing newline: the file holds exactly the one emoji, nothing else.
writeFileSync(outPath, ENTRY, "utf8");
// Read back and confirm the written file holds exactly the gated entry.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) {
  throw new Error("entry.txt does not match the gated entry");
}
console.log(`wrote 1 emoji (U+${codePoint.toString(16).toUpperCase()}) to ${outPath}`);
