// Runnable self-check for wall drag math.
// Not imported by the app. Run with:
//   node --experimental-strip-types src/components/kibbutz-type/wall-drag.check.ts
import { shiftPlacement } from "./wall-drag.ts";

const assert = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(`wall-drag self-check failed: ${msg}`);
};

assert(shiftPlacement(10, 10, -5, 0, true).x === 15, "rtl drag left increases x");
assert(shiftPlacement(10, 10, 5, 0, true).x === 5, "rtl drag right decreases x");
assert(shiftPlacement(10, 10, 5, 0, false).x === 15, "ltr drag right increases x");
assert(shiftPlacement(10, 10, 0, 4, true).y === 14, "drag down increases y");
assert(shiftPlacement(10, 10, 0, -4, true).y === 6, "drag up decreases y");
assert(shiftPlacement(70, 10, -20, 0, true).x === 78, "clamp x max");
assert(shiftPlacement(5, 10, 20, 0, true).x === 0, "clamp x min");
assert(shiftPlacement(10, 80, 0, 10, true).y === 82, "clamp y max");
assert(shiftPlacement(10, 2, 0, -10, true).y === 0, "clamp y min");

console.log("wall-drag.check.ts passed");
