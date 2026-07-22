const HORIZONTAL_SPACE = /[ \t]+/;
const LAST_REGULAR_SPACE = /(\S+)[ \t]+(\S+)([ \t]*)$/u;

function keepLastWordsTogetherInLine(line: string) {
  if (!HORIZONTAL_SPACE.test(line)) return line;
  return line.replace(LAST_REGULAR_SPACE, `$1\u00A0$2$3`);
}

export function preventOrphan(text: string): string;
export function preventOrphan(text: null | undefined): "";
export function preventOrphan(text: string | null | undefined) {
  if (!text) return "";

  // Skip orphan control on short strings — NBSP pairs can force overflow on
  // narrow iPhone widths when the last two words are long Hebrew compounds.
  if (text.length < 28) return text;

  return text
    .split(/(\r?\n)/)
    .map((part) => (part === "\n" || part === "\r\n" ? part : keepLastWordsTogetherInLine(part)))
    .join("");
}
