import Link from "next/link";
import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";
import type { Face } from "./faces";

type HeaderProps = Readonly<{
  face: Face;
  settings: KibbutzTypeSettings;
}>;

export function Header({ face, settings }: HeaderProps) {
  return (
    <header className="kt-wrap">
      <nav className="kt-header" aria-label="ניווט">
        <Link href="/" prefetch={false}>
          {settings.backLabel}
        </Link>
        <span>{settings.navBadge}</span>
      </nav>
      <div className="kt-hero">
        <h1 className={face.className}>
          {settings.heroTitleLine1}
          <br />
          {settings.heroTitleLine2}
        </h1>
        <p>{settings.heroDescription}</p>
      </div>
    </header>
  );
}
