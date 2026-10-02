export type WallPoint = { x: number; y: number };

const X_MAX = 78;
const Y_MAX = 82;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Next `--x` / `--y` percentages after a pointer move.
 * `dxPct` / `dyPct` are the pointer delta as a percent of the canvas
 * (positive dx is toward the right edge of the screen).
 * Words are anchored with `inset-inline-start`, so in RTL a drag toward
 * the left edge increases `--x`.
 */
export function shiftPlacement(
  x: number,
  y: number,
  dxPct: number,
  dyPct: number,
  rtl: boolean,
): WallPoint {
  return {
    x: clamp(x + (rtl ? -dxPct : dxPct), 0, X_MAX),
    y: clamp(y + dyPct, 0, Y_MAX),
  };
}
