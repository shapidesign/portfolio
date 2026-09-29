// Runnable self-check for the wall profanity filter + validation.
// Not imported by the app. Run with:
//   node --experimental-strip-types src/lib/kibbutz-wall.check.ts
import { isBlocked, validateWallInput } from "./kibbutz-wall.ts";

const assert = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(`kibbutz-wall self-check failed: ${msg}`);
};

const blocked = [
  "זונה",
  "הזונה",
  "בן זונה",
  "ז ו נ ה",
  "ז.ו.נ.ה",
  "שרמוטה",
  "זין",
  "הזין",
  "זיייין",
  "זינים",
  "מזדיין",
  "מזדיינת",
  "תזדייני",
  "כוסית",
  "כוס אמק",
  "כוסאמק",
  "כוס עמק",
  "חרא",
  "פיפי",
  "הומו",
  "הומואים",
  "קוקסינל",
  "פות",
  "יש פות פה",
];
const allowed = [
  "כוס",
  "כוס קפה",
  "כוסות",
  "מזין",
  "זינוק",
  "מאזינים",
  "פותח",
  "הומוגני",
  "שמונים לחצרים",
  "חצרים 80",
];

for (const t of blocked) assert(isBlocked(t), `should block "${t}"`);
for (const t of allowed) assert(!isBlocked(t), `should allow "${t}"`);

const ok = validateWallInput({ text: "  שמונים   שנה ", face: "dan", color: "orange" });
assert(ok.ok && ok.entry.text === "שמונים שנה", "trims + collapses whitespace");
assert(!validateWallInput({ text: "hello", face: "dan", color: "navy" }).ok, "rejects latin");
assert(!validateWallInput({ text: "א".repeat(41), face: "dan", color: "navy" }).ok, "rejects >40");
assert(!validateWallInput({ text: "שלום", face: "x", color: "navy" }).ok, "rejects unknown face");
assert(validateWallInput({ text: "בבית", face: "babayit", color: "orange" }).ok, "accepts babayit face");
assert(!validateWallInput({ text: "שלום", face: "dan", color: "#fff" }).ok, "rejects unknown color");
assert(!validateWallInput({ text: "", face: "dan", color: "navy" }).ok, "rejects empty");
const bl = validateWallInput({ text: "בן זונה", face: "dan", color: "navy" });
assert(!bl.ok && bl.error === "blocked", "reports blocked");

console.log("kibbutz-wall.check.ts passed");
