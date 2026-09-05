import Link from "next/link";
import type { Face } from "./faces";

type HeaderProps = Readonly<{ face: Face }>;

export function Header({ face }: HeaderProps) {
  return (
    <header className="kt-wrap">
      <nav className="kt-header" aria-label="ניווט">
        <Link href="/" prefetch={false}>
          → חזרה לדף הבית
        </Link>
        <span>חצרים 80 · 1946–2026</span>
      </nav>
      <div className="kt-hero">
        <h1 className={face.className}>
          גופנים חדשים
          <br />
          שמונים לחצרים
        </h1>
        <p>
          משפחת גופנים עבריים שעוצבה לחגיגות שמונים שנה לקיבוץ חצרים. דן מחודש וקלטה 01.
        </p>
      </div>
    </header>
  );
}
