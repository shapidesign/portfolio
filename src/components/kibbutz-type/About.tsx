import Image from "next/image";
import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";

export function About({ settings }: { settings: KibbutzTypeSettings }) {
  return (
    <section className="kt-section kt-section--about kt-wrap" aria-labelledby="kt-about-title">
      <p className="kt-label" id="kt-about-title">
        {settings.aboutLabel}
      </p>
      <p className="kt-about-lead">{settings.aboutLead}</p>
      <div className="kt-about">
        <article className="kt-about-face kt-about-face--dan">
          <header className="kt-about-heading">
            <h2 className="kt-face-dan" lang="he">
              {settings.danHeading}
            </h2>
            <p className="kt-label">{settings.danSubtitle}</p>
          </header>
          <div className="kt-about-copy">
            <p>{settings.danParagraph1}</p>
            <p>{settings.danParagraph2}</p>
          </div>
          <div className="kt-archive">
            <figure className="kt-archive-catalog">
              <Image
                src={settings.danCatalogSrc}
                alt="קטלוג לטרסט המקורי של גופן דן"
                width={750}
                height={1024}
                sizes="(min-width: 900px) 25rem, (min-width: 600px) 19rem, 15rem"
              />
              <figcaption>{settings.danCatalogCaption}</figcaption>
            </figure>
            <figure className="kt-archive-textile">
              <Image
                src={settings.danTextileSrc}
                alt="סמל קבוץ חצרים מודפס על חולצה בצבעי כחול, ירוק וכתום"
                width={1024}
                height={768}
                sizes="(min-width: 1400px) 50rem, (min-width: 900px) 55vw, calc(100vw - 5rem)"
              />
              <figcaption>{settings.danTextileCaption}</figcaption>
            </figure>
          </div>
        </article>

        <article className="kt-about-face kt-about-face--kelta">
          <header className="kt-about-heading">
            <h2 className="kt-face-kelta" lang="he">
              {settings.keltaHeading}
            </h2>
            <p className="kt-label">{settings.keltaSubtitle}</p>
          </header>
          <div className="kt-about-copy">
            <p>{settings.keltaParagraph1}</p>
            <p>{settings.keltaParagraph2}</p>
          </div>
          <figure className="kt-story-image kt-story-image--poster">
            <Image
              src={settings.keltaPosterSrc}
              alt="כרזה בכתב יד שחור עם טקסט עברי ואיור שיבולת מארכיון קיבוץ חצרים"
              width={768}
              height={1024}
              sizes="(min-width: 900px) 34rem, (min-width: 600px) 28rem, calc(100vw - 5rem)"
            />
            <figcaption>{settings.keltaPosterCaption}</figcaption>
          </figure>
        </article>
      </div>
    </section>
  );
}
