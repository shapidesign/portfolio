const BRAND_WHITE_BG_IMAGES = new Set([
  "logotype-reveal.png",
  "black-logo-v5.png",
  "black-logo-only.png",
  "orange-bird.png",
]);

export function usesBrandWhiteBackground(src: string): boolean {
  const filename = src.split("/").pop() ?? "";
  return BRAND_WHITE_BG_IMAGES.has(filename);
}
