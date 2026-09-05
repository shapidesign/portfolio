import Image from "next/image";

export function About() {
  return (
    <section className="kt-section kt-section--about kt-wrap" aria-labelledby="kt-about-title">
      <p className="kt-label" id="kt-about-title">
        על הפרויקט
      </p>
      <p className="kt-about-lead">
        קיבוץ חצרים נוסד ב-1946 בנגב. לכבוד שמונים שנותיו עוצבו שני גופנים עבריים: אחד מחייה גופן
        טרנספר קלאסי שהודבק על כרזות הקיבוץ, והשני מתרגם את כתב היד של הכרזות עצמן לגופן חי.
      </p>
      <div className="kt-about">
        <article className="kt-about-face kt-about-face--dan">
          <header className="kt-about-heading">
            <h2 className="kt-face-dan" lang="he">
              דן מחודש
            </h2>
            <p className="kt-label">Dan Revived · חידוש לגופן ״דן״ של דן תל ורדי</p>
          </header>
          <div className="kt-about-copy">
            <p>
              סביב שנות ה-70-80 עיצב דן תל ורדי את ״דן״ - גופן עברי גאומטרי שהופץ על גיליונות אותיות
              טרנספר של לטרסט, והודבק אות-אות על כרזות, שלטים ועלוני חג בקיבוצים ברחבי הארץ. הגופן
              שימש את הלוגו של סמל וחולצות ״קבוץ חצרים״ המוכרות לכולם.
            </p>
            <p>
              דן מחודש מחזיר את האותיות האלה למסך: הצורות המקוריות נשמרו, המידות והריווח הותאמו
              לטקסט דיגיטלי, והתוצאה היא גופן כותרות גאומטרי, עגלגל ופשוט.
            </p>
          </div>
          <div className="kt-archive">
            <figure className="kt-archive-catalog">
              <Image
                src="/images/kibbutz-type/dan-letraset-catalog.jpg"
                alt="קטלוג לטרסט המקורי של גופן דן"
                width={750}
                height={1024}
                sizes="(min-width: 900px) 25rem, (min-width: 600px) 19rem, 15rem"
              />
              <figcaption>קטלוג לטרסט · דן</figcaption>
            </figure>
            <figure className="kt-archive-textile">
              <Image
                src="/images/kibbutz-type/kibbutz-hatzerim-textile.jpg"
                alt="סמל קבוץ חצרים מודפס על חולצה בצבעי כחול, ירוק וכתום"
                width={1024}
                height={768}
                sizes="(min-width: 1400px) 50rem, (min-width: 900px) 55vw, calc(100vw - 5rem)"
              />
              <figcaption>סמל קבוץ חצרים על חולצה</figcaption>
            </figure>
          </div>
        </article>

        <article className="kt-about-face kt-about-face--kelta">
          <header className="kt-about-heading">
            <h2 className="kt-face-kelta" lang="he">
              קלטה 01
            </h2>
            <p className="kt-label">Kelta 01 · גופן חדש שנולד מכתב היד של כרזות הקיבוץ</p>
          </header>
          <div className="kt-about-copy">
            <p>
              בארכיון הקיבוץ שמורות כרזות שנכתבו בטושים שחורים על בריסטול לחג, לאסיפה, לערב שירה.
              הכתב הזה הוא הקול החזותי של חצרים במשך עשרות שנים.
            </p>
            <p>
              קלטה 01 נולד מהכרזות האלה. הוא לא מעתיק כתב יד ספציפי אלא מזקק את הקצב, הקווים
              המחוברים והחום שלו לגופן שאפשר להקליד בו — כדי שגם השנה, ההזמנה לחג תיראה כמו שלנו.
            </p>
          </div>
          <figure className="kt-story-image kt-story-image--poster">
            <Image
              src="/images/kibbutz-type/kelta-poster.jpg"
              alt="כרזה בכתב יד שחור עם טקסט עברי ואיור שיבולת מארכיון קיבוץ חצרים"
              width={768}
              height={1024}
              sizes="(min-width: 900px) 34rem, (min-width: 600px) 28rem, calc(100vw - 5rem)"
            />
            <figcaption>כרזה כתובה ביד מארכיון קיבוץ חצרים</figcaption>
          </figure>
        </article>
      </div>
    </section>
  );
}
