export type FaceId = "dan" | "kelta";

export type Face = {
  id: FaceId;
  name: string;
  heName: string;
  /** CSS class that sets the font-family (see kibbutz-type.css). */
  className: string;
  heSource: string;
  /** Glyph coverage, read from the font files' cmap (fc-scan). */
  letters: string;
  digits: string;
  punctuation: string;
};

const HEBREW_LETTERS = "אבגדהוזחטיכךלמםנןסעפףצץקרשת";
const DIGITS = "0123456789";

export const FACES: Face[] = [
  {
    id: "dan",
    name: "Dan Revived",
    heName: "דן מחודש",
    className: "kt-face-dan",
    heSource: "חידוש לגופן ״דן״ של דן תל ורדי",
    letters: HEBREW_LETTERS,
    digits: DIGITS,
    punctuation: "!#'()*,-./:;?[]_{}·–—‘’“”•…׳״",
  },
  {
    id: "kelta",
    name: "Kelta 01",
    heName: "קלטה 01",
    className: "kt-face-kelta",
    heSource: "גופן חדש שנולד מכתב היד של כרזות הקיבוץ",
    letters: HEBREW_LETTERS,
    digits: DIGITS,
    punctuation: "(),-.׳״",
  },
];

export function getFace(id: FaceId): Face {
  return FACES.find((face) => face.id === id) ?? FACES[0];
}
