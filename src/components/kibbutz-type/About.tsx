import Image from "next/image";
import type { KibbutzTypeSettings } from "@/lib/kibbutz-type-settings";
import { SpecimenText } from "./SpecimenText";

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
            <SpecimenText as="h2" className="kt-face-dan" editable>
              {settings.danHeading}
            </SpecimenText>
            <p className="kt-label">{settings.danSubtitle}</p>
          </header>
          <div className="kt-about-copy">
            <SpecimenText as="p" multiline editable>
              {settings.danParagraph1}
            </SpecimenText>
            <SpecimenText as="p" multiline editable>
              {settings.danParagraph2}
            </SpecimenText>
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
            <SpecimenText as="h2" className="kt-face-kelta" editable>
              {settings.keltaHeading}
            </SpecimenText>
            <p className="kt-label">{settings.keltaSubtitle}</p>
          </header>
          <div className="kt-about-copy">
            <SpecimenText as="p" multiline editable>
              {settings.keltaParagraph1}
            </SpecimenText>
            <SpecimenText as="p" multiline editable>
              {settings.keltaParagraph2}
            </SpecimenText>
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

        <article className="kt-about-face kt-about-face--babayit">
          <header className="kt-about-heading">
            <SpecimenText as="h2" className="kt-face-babayit" editable>
              {settings.babayitHeading}
            </SpecimenText>
            <p className="kt-label">{settings.babayitSubtitle}</p>
          </header>
          <div className="kt-about-copy">
            <SpecimenText as="p" multiline editable>
              {settings.babayitParagraph1}
            </SpecimenText>
            <SpecimenText as="p" multiline editable>
              {settings.babayitParagraph2}
            </SpecimenText>
          </div>
          <figure className="kt-story-image kt-story-image--masthead">
            <Image
              src={settings.babayitMastheadSrc}
              alt="כותרת עלון בבית עם לוגו גאומטרי ומספר גיליון"
              width={457}
              height={343}
              sizes="(min-width: 900px) 34rem, (min-width: 600px) 28rem, calc(100vw - 5rem)"
            />
            <figcaption>{settings.babayitMastheadCaption}</figcaption>
          </figure>
        </article>
      </div>
    </section>
  );
}
