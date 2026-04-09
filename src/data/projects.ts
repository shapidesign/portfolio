import { Project, Accent, ShapeVariant } from "../types/project";
import generatedRaw from "./projects.generated.json";

export type { Project, Accent, ShapeVariant };

const PROJECT_CONTEXT: Record<string, string> = {
  "small-world-problems":
    "A typographic experiment exploring how a single letter, scaled and repositioned, changes meaning. Made as a self-initiated study in visual impact (and a bit of humor).",
  "the-misfit-market":
    "Research and brand identity for a concept sustainable grocery that celebrates imperfect produce. Developed as a student project at HiT.",
  "animal-to-logo":
    "An exercise in reduction \u2014 taking complex animal forms and distilling them to their meaningful truth. Inspired by Paul Rand\u2019s and George Bokhua\u2019s approach to logo thinking. HiT.",
  "digital-handprint":
    "A self-portrait built in code, not pixels. An exploration of what it means to leave a mark in a digital space that remembers nothing, and a hint of self-criticism about my computer use habits.",
  "keeping-it-clean":
    "Packaging system for The Clean Dot, designed around the idea that cleaning products shouldn\u2019t look like a compromise, hidden underneath the sink \u2014 they should be right there on the counter!",
  "no-gatekeeping":
    "A free web directory of design resources, built for students who need an easy way to find the tools that will help their academic work. Designed and developed independently for HiT VC Department.",
};

const HE_PROJECT_CONTEXT: Record<string, string> = {
  "the-misfit-market":
    "מחקר וזהות מותגית לסופרמרקט קונספט בר-קיימא שחוגג תוצרת לא-מושלמת. פותח כפרויקט לימודים בהיט.",
  "keeping-it-clean":
    "מערכת אריזות ל-The Clean Dot, בנויה סביב הרעיון שמוצרי ניקיון לא צריכים להיות פשרה מתחת לכיור — הם צריכים לעמוד על השיש!",
};

const PROJECT_STATUS: Record<string, { en: string; he: string }> = {
  "digital-handprint": { en: "SELF-INITIATED", he: "יוזמה עצמית" },
  "no-gatekeeping": { en: "SELF-INITIATED", he: "יוזמה עצמית" },
  "keeping-it-clean": { en: "DELIVERED", he: "בוצע" },
  "the-misfit-market": { en: "STUDENT WORK", he: "עבודת סטודנט" },
  "animal-to-logo": { en: "STUDENT WORK", he: "עבודת סטודנט" },
  "small-world-problems": { en: "SELF-INITIATED", he: "יוזמה עצמית" },
};

const PROJECT_DISCIPLINE: Record<string, { en: string; he: string }> = {
  "digital-handprint": { en: "CREATIVE CODING", he: "קוד יצירתי" },
  "no-gatekeeping": { en: "DIGITAL PRODUCT", he: "מוצר דיגיטלי" },
  "keeping-it-clean": { en: "BRANDING", he: "מיתוג" },
  "the-misfit-market": { en: "BRANDING", he: "מיתוג" },
  "animal-to-logo": { en: "TYPE", he: "טיפוגרפיה" },
  "small-world-problems": { en: "TYPE", he: "טיפוגרפיה" },
};

const PROJECT_DESCRIPTOR: Record<string, { en: string; he: string }> = {
  "keeping-it-clean": {
    en: "Making cleaning products earn their place on the counter.",
    he: "להפוך מוצרי ניקוי למשהו שמגיע לו לעמוד על השיש.",
  },
  "the-misfit-market": {
    en: "Reframing food waste as identity before it became fashionable.",
    he: "למסגר בזבוז מזון כזהות מותגית לפני שזה הפך לטרנד.",
  },
  "animal-to-logo": {
    en: "From a living form to a mark that lasts.",
    he: "מצורה חיה לסימן גרפי שנשאר לאורך זמן.",
  },
  "no-gatekeeping": {
    en: "Design as a public service with zero gatekeepers.",
    he: "עיצוב כשירות ציבורי, בלי שומרי סף בדרך.",
  },
  "digital-handprint": {
    en: "Turning cursor movement into a daily digital self-portrait.",
    he: "להפוך תנועת עכבר לפורטרט דיגיטלי יומי.",
  },
  "small-world-problems": {
    en: "A typographic hack that exposes system-driven writing habits.",
    he: "התערבות טיפוגרפית שחושפת איך דרישות פורמליות משפיעות על כתיבה.",
  },
};

const PROJECT_OPENER: Record<string, { en: string; he: string }> = {
  "keeping-it-clean": {
    en: "The packaging had to make sustainable cleaning products feel premium enough to stay visible in the home.",
    he: "האריזה הייתה צריכה לגרום למוצרי ניקוי אקולוגיים להרגיש פרימיום מספיק כדי להישאר גלויים בבית.",
  },
  "the-misfit-market": {
    en: "A retail identity that turns rejected produce from a flaw into the core message.",
    he: "זהות מותגית שמסובבת תוצרת שנדחתה מ״פגם״ למסר המרכזי.",
  },
  "animal-to-logo": {
    en: "The challenge was to reduce a living form into a clear symbol without losing movement and meaning.",
    he: "האתגר היה לצמצם צורה חיה לסמל ברור בלי לאבד תנועה ומשמעות.",
  },
  "no-gatekeeping": {
    en: "I needed to package scattered student knowledge into one practical interface people could use immediately.",
    he: "הייתי צריך לרכז ידע מפוזר של סטודנטים לממשק פרקטי שאפשר להשתמש בו מיד.",
  },
  "digital-handprint": {
    en: "Could a cursor behave less like a tool and more like an expressive drawing instrument?",
    he: "האם סמן העכבר יכול להיות כלי לביטוי חזותי?",
  },
  "small-world-problems": {
    en: "The brief was playful but precise: alter typography behavior while keeping the familiar academic look.",
    he: "מה אם פשוט אפשר לכתוב פחות, בלי שישימו לב?",
  },
};

type Narrative = {
  challenge: string;
  approach: string;
  decision: string;
  heChallenge: string;
  heApproach: string;
  heDecision: string;
};

const PROJECT_NARRATIVE: Record<string, Narrative> = {
  "keeping-it-clean": {
    challenge:
      "Cleaning products are usually designed to disappear under the sink. For The Clean Dot, the challenge was the opposite: create packaging that feels premium enough to stay visible, while still communicating sustainability in a direct and credible way. The visual system needed to look clean without becoming sterile, and distinctive without feeling loud.",
    approach:
      "I approached the range as one coherent product family rather than isolated labels. The structure relies on typographic hierarchy, controlled spacing, and a disciplined grid so users can scan product differences quickly without losing brand consistency. Instead of decorative cues, I used proportion, rhythm, and material-sensitive layouts to carry the premium feeling.",
    decision:
      "The key decision was to keep the visual language restrained and let clarity do the work. By reducing decorative noise and emphasizing precise structure, the packaging earns visual trust and supports everyday usability. That choice helps the products live on the counter as part of the home environment, not hidden as compromise items.",
    heChallenge:
      "מוצרי ניקוי בדרך כלל מעוצבים כדי להיעלם מתחת לכיור. ב-The Clean Dot האתגר היה הפוך: לבנות אריזה שמרגישה פרימיום מספיק כדי להישאר גלויה, ועדיין לתקשר קיימות בצורה כנה וברורה. המערכת הייתה צריכה להרגיש נקייה אך לא קרה, מובחנת אך לא רועשת.",
    heApproach:
      "התייחסתי לקו כולו כמשפחה אחת ולא כסדרה של תוויות נפרדות. בניתי היררכיה טיפוגרפית, גריד עקבי וקצב ריווחים שמאפשרים להבין הבדלים בין מוצרים במהירות בלי לפגוע באחידות המותג. במקום שכבות דקורטיביות, השתמשתי בפרופורציה ובסדר חזותי כדי לייצר תחושת איכות.",
    heDecision:
      "ההחלטה המרכזית הייתה לבחור באיפוק ולתת לבהירות להוביל. צמצום רעש גרפי והדגשת מבנה מדויק יוצרים אמון חזותי וגם תומכים בשימוש יומיומי. כך המוצרים מצליחים להיות נוכחים על השיש כחלק טבעי מהבית, ולא להיתפס כפתרון זמני שמסתירים.",
  },
  "the-misfit-market": {
    challenge:
      "A third of produce is rejected for cosmetic reasons even when it is fully usable. The challenge was to build a brand that reframes imperfection from a retail flaw into a cultural value people can identify with. The identity had to feel confident enough to challenge supermarket standards, not apologize for them.",
    approach:
      "I framed irregularity as character, not deficiency. The system combines direct verbal framing, raw material cues, and honest image treatment so the brand speaks with conviction instead of imitation. Every asset was designed to support one narrative: value is created by perspective, not by cosmetic uniformity.",
    decision:
      "The critical decision was to avoid visually \"fixing\" the produce. Keeping irregular forms visible in both naming and imagery transforms the so-called defect into the strongest differentiator of the brand. That decision keeps the story consistent from first impression to packaging moment.",
    heChallenge:
      "שליש מהתוצרת נזרק מסיבות אסתטיות למרות שהוא ראוי לחלוטין לשימוש. האתגר היה לבנות מותג שמזיז את התפיסה מ״פגם״ ל״ערך״, ובונה הזדהות במקום רחמים. הזהות הייתה צריכה לעמוד בביטחון מול שפת הסופרמרקט הרגילה, ולא להתנצל מולה.",
    heApproach:
      "בחרתי למסגר אי-אחידות כאופי מותגי. השפה משלבת ניסוח ישיר, טקסטורות גולמיות וטיפול דימוי כן כדי לייצר קול שלא מנסה להידמות לנורמות מדף. כל נכס נבנה כדי לחזק רעיון אחד: הערך נוצר מהסתכלות חדשה, לא מהחלקה של המציאות.",
    heDecision:
      "החלטת הליבה הייתה לא ״לתקן״ חזותית את התוצרת. שמירה על הצורות הלא אחידות בשם, בצילום ובאריזה הופכת את מה שנתפס כפגם למבדל המרכזי של המותג. כך הנרטיב נשמר עקבי מהמפגש הראשון ועד רגע הקנייה.",
  },
  "animal-to-logo": {
    challenge:
      "Translating a living creature into a logo creates a tension between detail and clarity. The challenge was to reduce the stork into a symbol that still carries migration, return, and academic growth without becoming illustrative. The mark needed to work as a concept first, then as a polished visual asset.",
    approach:
      "I ran an iterative reduction process from anatomical reference to abstract geometry. Each step removed visual noise while preserving three narrative anchors: movement, direction, and knowledge transfer. Negative space and balance between masses became the main tools for keeping symbolism readable at small and large scales.",
    decision:
      "The defining decision was shaping the wing gesture into an open-book form. That move ties the bird metaphor directly to the academic mission and gives the logo a second reading layer without added complexity. It also improves memorability because one silhouette now carries two ideas.",
    heChallenge:
      "כשמתרגמים יצור חי ללוגו נוצר מתח קבוע בין פירוט לקריאות. האתגר היה לצמצם את החסידה לסימן שמעביר נדידה, חזרה והתפתחות אקדמית בלי להיראות אילוסטרטיבי מדי. הסמל היה צריך לעבוד קודם כרעיון ורק אחר כך כאובייקט מעוצב.",
    heApproach:
      "ביצעתי תהליך צמצום איטרטיבי מצורה אנטומית לשפה גאומטרית. בכל שלב ירד רעש חזותי אבל נשמרו שלושה עוגנים רעיוניים: תנועה, כיוון והעברת ידע. העבודה עם חלל שלילי ואיזון בין מסות הייתה הכלי המרכזי לשמירה על קריאות בסקאלות שונות.",
    heDecision:
      "ההחלטה המכריעה הייתה לעצב את מחוות הכנף כספר נפתח. המהלך הזה קושר באופן ישיר בין מטאפורת החסידה למשימה האקדמית ומוסיף שכבת משמעות בלי להעמיס על הסמל. בנוסף, הוא מחזק זכירות כי אותה צללית מחזיקה שני רעיונות בו-זמנית.",
  },
  "no-gatekeeping": {
    challenge:
      "Design students often rely on scattered channels for essential resources, so valuable knowledge stays gated by social proximity. The challenge was to build a single platform that feels immediately useful without becoming another overloaded directory. The product needed to be fast to scan, practical to revisit, and clear for first-year students.",
    approach:
      "I designed the information architecture around real student tasks: finding tools, finding local services, and learning from curated references. Navigation, labels, and section logic were shaped to reduce decision fatigue and keep momentum high during short visits. The UI favors function-forward clarity so the platform behaves like infrastructure, not a showcase.",
    decision:
      "The key decision was to treat curation itself as product design. By reducing friction between intention and result, the platform operates like a public utility rather than a static resource list. That choice reinforces the project mission: design knowledge should be transferable, not guarded.",
    heChallenge:
      "סטודנטים לעיצוב תלויים לעיתים בידע שמפוזר בין קבוצות, שמועות וסימניות אישיות — ולכן ידע חיוני נשאר מאחורי שומרי סף חברתיים. האתגר היה לבנות פלטפורמה אחת שמרגישה שימושית מהרגע הראשון בלי להפוך לעוד אינדקס עמוס. המוצר היה צריך להיות מהיר לסריקה, קל לחזרה, וברור גם לסטודנטים בתחילת הדרך.",
    heApproach:
      "בניית הארכיטקטורה התחילה מצרכים אמיתיים: למצוא כלים, למצוא שירותים מקומיים, וללמוד ממקורות אוצרים. המבנה, התיוג והניווט תוכננו כדי לצמצם עומס החלטות ולשמור קצב עבודה גם בביקורים קצרים. הממשק נשען על בהירות פונקציונלית כדי להתנהג כתשתית אמיתית ולא כעמוד תדמית.",
    heDecision:
      "החלטת הליבה הייתה להתייחס לאצירה עצמה כעיצוב מוצר. ברגע שמצמצמים חיכוך בין כוונה לתוצאה, הפלטפורמה מתפקדת כשירות ציבורי ולא כעוד רשימת קישורים. הבחירה הזו משרתת את המסר המרכזי של הפרויקט: ידע עיצובי צריך לעבור הלאה, לא להישמר אצל מעטים.",
  },
  "digital-handprint": {
    challenge:
      "The cursor mediates almost every digital action, yet it is rarely treated as expressive material. The challenge was to reveal this invisible behavior and turn routine interaction into visible authorship. The project had to feel playful on first contact and reflective on repeat use.",
    approach:
      "I built a generative interaction system where movement accumulates into traces over time. Instead of treating navigation as neutral behavior, the interface reframes it as mark-making with aesthetic and behavioral meaning. The visual language was tuned to preserve spontaneity while still making patterns legible.",
    decision:
      "The central decision was to treat repetition as content, not background noise. Capturing movement across sessions produces a portrait defined by habit and rhythm rather than a single finished image. This makes the work both introspective and system-oriented at the same time.",
    heChallenge:
      "הסמן מתווך כמעט כל פעולה דיגיטלית, אבל כמעט אף פעם לא נתפס כחומר ביטוי. חשבתי איך לחשוף את ההתנהגות הבלתי נראית הזו ולהפוך אינטראקציה יומיומית לכלי חזותי.",
    heApproach:
      "בניית המערכת לקחה השראה מציורים של ג׳קסון פולוק, ונבנתה ככלי זורם שנבנה ומתעצם על עצמו עד שהוא יוצר דיוקן חד-פעמי של כל תנועות העכבר היומיות שלי.",
    heDecision:
      "התייחסתי לחזרתיות כתוכן עצמו, ולא כרעש רקע. כל תנועה שלי נספרת ונאספת במהלך היום, ויוצרת דיוקן עצמי שמבוסס על הרגלים וקצב עבודה - ולא על נראות פיזית או אישיותית. הדיוקן הוא לא רק אני - אלא אני מול המחשב.",
  },
  "small-world-problems": {
    challenge:
      "Academic writing systems often reward length, which means typography can influence outcomes in hidden ways. The challenge was to create a type intervention that changes document behavior without breaking visual familiarity. It had to feel almost invisible in use, yet conceptually sharp once revealed.",
    approach:
      "I modified David Libre through controlled width and side-bearing adjustments so lines expand subtly in real writing contexts. The implementation focused on preserving tone and rhythm so the font still feels academically credible. The result is a behavioral shift that appears minor per line but accumulates meaningfully at document scale.",
    decision:
      "The critical decision was preserving trust at the surface while changing performance underneath. That tension allows the project to remain usable, humorous, and critical at once. It exposes how formal systems can be negotiated through tiny technical decisions.",
    heChallenge:
      "בכתיבה אקדמית, דרישות אורך משפיעות על התוצאה לא פחות מהתוכן עצמו. האתגר ששמתי לעצמי היה לייצר שינוי טיפוגרפי שמשפיע על מבנה המסמך בלי לפגוע בגופן המוכר של הכותב, ובלי לפגוע בקורא.",
    heApproach:
      "לקחתי את גופן ״דוד״ המוכר והאקדמי, והחלטתי לעוות את רוחב האותיות שלו כך שלא ישימו לב לעיוות, אך בטווח הארוך השינוי ישפיע על אורך המסמך.\n\nהרעיון והשם הגיע מתותח הדוידקה - תותח שבעיקר עשה רעש אבל לא באמת פגע או השפיע. לשם הגופן ״דוד״ נוספו האותיות ק׳, י׳, ו-ה׳ - בגימטריה = 100, 10, 5 - כיוון שהאותיות נמתחו רוחבית בכ-105-110% מצורתן המקורית!",
    heDecision:
      "ביצעתי התאמות לרוחב האות ולמרווחים בין האותיות, כך שהשינויים זניחים ובלתי נתפסים לעין בלתי מיומנת, אך עוזרים לכותב להאריך את אורך המסמך מבלי לפגוע בקריאות של הטקסט או לעוות את הגופן.\n\nההשפעה על כל אות קטנה - אבל מצטברת לכדי השפעה גדולה במסמך ארוך.\n\nהיה לי חשוב שהגופן יהיה שימושי וביקורתי מבלי להפוך לגימיק צורני זול.",
  },
};

function isValidProject(item: unknown): item is Project {
  if (typeof item !== "object" || item === null) return false;
  const p = item as Record<string, unknown>;
  return typeof p.slug === "string" && typeof p.title === "string";
}

const generatedProjects: Project[] = Array.isArray(generatedRaw)
  ? (generatedRaw as unknown[])
    .filter(isValidProject)
    .map((p) => ({
      ...p,
      context: PROJECT_CONTEXT[p.slug] ?? "",
      status: PROJECT_STATUS[p.slug]?.en ?? "DELIVERED",
      heStatus: PROJECT_STATUS[p.slug]?.he ?? "בוצע",
      discipline: PROJECT_DISCIPLINE[p.slug]?.en ?? p.category.toUpperCase(),
      heDiscipline: PROJECT_DISCIPLINE[p.slug]?.he ?? p.category,
      descriptor: PROJECT_DESCRIPTOR[p.slug]?.en ?? p.summary,
      heDescriptor: PROJECT_DESCRIPTOR[p.slug]?.he ?? p.heContext ?? p.summary,
      opener: PROJECT_OPENER[p.slug]?.en ?? p.context ?? p.summary,
      heOpener: PROJECT_OPENER[p.slug]?.he ?? p.heContext ?? p.summary,
      narrativeChallenge: PROJECT_NARRATIVE[p.slug]?.challenge ?? p.challenge ?? p.summary,
      narrativeApproach: PROJECT_NARRATIVE[p.slug]?.approach ?? p.process ?? p.summary,
      narrativeDecision: PROJECT_NARRATIVE[p.slug]?.decision ?? p.outcome ?? p.summary,
      heNarrativeChallenge: PROJECT_NARRATIVE[p.slug]?.heChallenge ?? p.heDescription ?? p.summary,
      heNarrativeApproach: PROJECT_NARRATIVE[p.slug]?.heApproach ?? p.heDescription ?? p.summary,
      heNarrativeDecision: PROJECT_NARRATIVE[p.slug]?.heDecision ?? p.heDescription ?? p.summary,
      ...(!p.heContext && HE_PROJECT_CONTEXT[p.slug]
        ? { heContext: HE_PROJECT_CONTEXT[p.slug] }
        : {}),
    }))
    .sort((a, b) => {
      if (a.slug === "digital-handprint") return -1;
      if (b.slug === "digital-handprint") return 1;
      return 0;
    })
  : [];

export const projects: Project[] = generatedProjects;

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
