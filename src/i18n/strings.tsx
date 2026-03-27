import type { Lang } from "@/context/LanguageContext";

const strings = {
  en: {
    // Nav
    navHome: "Home",
    navAbout: "About",
    navWork: "Work",
    navContact: "Contact",
    seeAllProjects: "See all projects",

    // Brand
    brandName: "Yehonatan Shapira",
    heroName: "Yehonatan Shapira",

    // Hero
    heroTagline: (
      <>
        Design is never <em>my</em> style. It&apos;s <em>your</em> problem and{" "}
        <em>our</em> solution.
      </>
    ),
    heroTaglineText:
      "Design is never my style. It\u2019s your problem and our solution.",
    viewWork: "View Work",
    letsCollaborate: "Let\u2019s Collaborate",

    // Selected Work section
    selectedWork: "Selected Work",

    // About teaser (home)
    aboutTeaserTitle: "About",
    aboutTeaserBody:
      "I\u2019m Yehonatan Shapira \u2014 a visual communication designer who believes good design starts by understanding the problem, not the tool. I work across branding, digital product, and experimental typography.",
    readMoreAboutMe: "Read more about me",

    // Work gate modal
    workGateTitle: "You haven\u2019t seen my work!",
    workGateLetMeSee: "Let me see",
    workGateConfident: "I\u2019m confident I want to collaborate",

    // About page
    aboutTitle: "About",
    aboutLead:
      "Good design starts with the right question, not the right aesthetic.",
    aboutBelieveTitle: "What I Believe In?",
    aboutBelieveBody: (
      <>
        Design is never <em>my</em> style. It&apos;s <em>your</em> problem and{" "}
        <em>our</em> solution.
      </>
    ),
    aboutWhyTitle: "Why I Do?",
    aboutWhyBody:
      "Great design starts with asking the right questions. I love the process of untangling complex information and finding the core human need behind it.",
    aboutHowTitle: "How I Do?",
    aboutHowBody:
      "Every project demands different tools. I learn what the work needs, not what my portfolio already has.",
    downloadCV: "Download CV",
    contactMe: "Contact me",

    // Work page
    workTitle: "Work",
    workSubtitle: (count: number) =>
      `${count} selected works showcasing design & development.`,

    // Project detail
    visitProject: "Visit project",
    backToWork: "Back to work",
    startAProject: "Start a project",
    previousProject: "Previous project",
    nextProject: "Next project",

    // Contact page
    contactTitle: "Contact",
    contactLead:
      "If you want to collaborate on branding, digital design, or creative direction, send a message.",
    contactSubtitle: "Or email directly at",
    contactDownloadCV: "download my CV",
    formName: "Name",
    formEmail: "Email",
    formMessage: "Message",
    formSend: "Send message",
    formSending: "Sending\u2026",
    formSent: "Message sent!",
    formSentBody: "Thanks for reaching out. I\u2019ll get back to you soon.",
    formSendAnother: "Send another",
    formError:
      "Something went wrong. Please try again or email shapidesigns@gmail.com directly.",

    // Footer
    footerCopy: "Portfolio by Yehonatan Shapira.",

    // Theme confirm
    themeConfirmDay: "It\u2019s daytime \u2014 switch to dark mode?",
    themeConfirmNight: "It\u2019s nighttime \u2014 switch to light mode?",
    themeYes: "Yes",
    themeCancel: "Cancel",

    // Language toggle
    langLabel: "EN",
    langAriaLabel: "Switch to Hebrew",

    // Student work tag
    studentWork: "Student Work",

    // Arrow direction
    arrowForward: "\u2192",
    arrowBack: "\u2190",
  },

  he: {
    navHome: "בית",
    navAbout: "אודות",
    navWork: "עבודות",
    navContact: "צור קשר",
    seeAllProjects: "צפו בכל הפרויקטים",

    brandName: "יהונתן שפירא",
    heroName: "יהונתן שפירא",

    heroTagline: (
      <>
        {"עיצוב הוא אף פעם לא הסגנון שלי. זו הבעיה שלך והפתרון שלנו."}
      </>
    ),
    heroTaglineText:
      "עיצוב הוא אף פעם לא הסגנון שלי. זו הבעיה שלך והפתרון שלנו.",
    viewWork: "צפו בעבודות",
    letsCollaborate: "בואו נעבוד",

    selectedWork: "עבודות נבחרות",

    aboutTeaserTitle: "אודות",
    aboutTeaserBody:
      "אני יהונתן שפירא — מעצב תקשורת חזותית שמאמין שעיצוב טוב מתחיל בהבנת הבעיה, לא בכלים לפתרון שלה. אני עוסק במיתוג, מוצרים דיגיטלי וטיפוגרפיה ניסיונית.",
    readMoreAboutMe: "קראו עוד עליי",

    workGateTitle: "עוד לא ראיתם את העבודות שלי",
    workGateLetMeSee: "אני רוצה לראות",
    workGateConfident: "אני בטוח שאני רוצה לעבוד איתך",

    aboutTitle: "אודות",
    aboutLead:
      "עיצוב טוב מתחיל בשאלה הנכונה, לא באסתטיקה הנכונה.",
    aboutBelieveTitle: "במה אני מאמין?",
    aboutBelieveBody: (
      <>
        {"עיצוב הוא אף פעם לא הסגנון "}
        <em>{"שלי"}</em>
        {". זו הבעיה "}
        <em>{"שלך"}</em>
        {" והפתרון "}
        <em>{"שלנו"}</em>
        {"."}
      </>
    ),
    aboutWhyTitle: "למה אני עושה את זה?",
    aboutWhyBody:
      "עיצוב גדול מתחיל בשאלות הנכונות. אני אוהב את התהליך של פירוק מידע מורכב ומציאת הצורך האנושי האמיתי שמאחוריו.",
    aboutHowTitle: "איך אני עושה את זה?",
    aboutHowBody:
      "כל פרויקט דורש כלים שונים. אני לומד מה העבודה צריכה — לא מה שכבר יש לי בתיק העבודות.",
    downloadCV: "הורדת קורות חיים",
    contactMe: "צור קשר",

    workTitle: "עבודות",
    workSubtitle: (count: number) =>
      `${count} עבודות נבחרות בעיצוב ופיתוח.`,

    visitProject: "לאתר הפרויקט",
    backToWork: "חזרה לעבודות",
    startAProject: "בואו נתחיל",
    previousProject: "פרויקט קודם",
    nextProject: "פרויקט הבא",

    contactTitle: "צור קשר",
    contactLead:
      "אם אתם רוצים לשתף פעולה במיתוג, עיצוב דיגיטלי, או הנחייה קריאטיבית, שלחו הודעה.",
    contactSubtitle: "או שלחו מייל ישירות ל",
    contactDownloadCV: "הורדת קורות חיים",
    formName: "שם",
    formEmail: "אימייל",
    formMessage: "הודעה",
    formSend: "שליחת הודעה",
    formSending: "שולח\u2026",
    formSent: "ההודעה נשלחה!",
    formSentBody: "תודה שפניתם אליי. אחזור אליכם בהקדם.",
    formSendAnother: "שלחו עוד",
    formError:
      "משהו השתבש. נסו שוב או שלחו מייל ל\u05be shapidesigns@gmail.com",

    footerCopy: "תיק עבודות של יהונתן שפירא.",

    themeConfirmDay: "עכשיו יום — לעבור למצב כהה?",
    themeConfirmNight: "עכשיו לילה — לעבור למצב בהיר?",
    themeYes: "כן",
    themeCancel: "ביטול",

    langLabel: "עב",
    langAriaLabel: "Switch to English",

    studentWork: "עבודת סטודנט",

    arrowForward: "\u2190",
    arrowBack: "\u2192",
  },
};

export type Strings = (typeof strings)["en"];

export function t(lang: Lang): Strings {
  return strings[lang] as Strings;
}

export function useTranslation(lang: Lang): Strings {
  return strings[lang] as Strings;
}
