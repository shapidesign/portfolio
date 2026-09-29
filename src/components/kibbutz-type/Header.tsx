import Link from "next/link";
import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";
import type { Face } from "./faces";
import { SpecimenText } from "./SpecimenText";

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
          <SpecimenText editable>{settings.heroTitleLine1}</SpecimenText>
          <br />
          <SpecimenText editable>{settings.heroTitleLine2}</SpecimenText>
        </h1>
        <p>{settings.heroDescription}</p>
      </div>
    </header>
  );
}
