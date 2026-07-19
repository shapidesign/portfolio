import type { Lang } from "@/context/LanguageContext";

const strings = {
  en: {
    // Nav
    navHome: "Home",
    navAbout: "About",
    navWork: "Work",
    navShirts: "Shirts",
    navContact: "Contact",
    seeAllProjects: "See all projects",

    // Brand
    brandName: "Yehonatan Shapira",
    heroName: "Yehonatan Shapira",

    // Hero
    heroLine1: "design is never my style.",
    heroLine2: "its your challenge",
    heroLine3Prefix: "and",
    heroLine3Accent: "our solution.",
    heroTagline: (
      <>
        design is never <em>my</em> style. its <em>your</em> challenge and{" "}
        <em>our</em> solution.
      </>
    ),
    heroTaglineText:
      "design is never my style. its your challenge and our solution.",
    heroOrientationLine:
      "Visual communication — branding · digital product · experimental type",
    viewWork: "View Work",
    letsCollaborate: "Let\u2019s Collaborate",

    // Selected Work section
    selectedWork: "Selected Work",

    // About teaser (home)
    aboutTeaserTitle: "Yehonatan Shapira",
    aboutTeaserBody:
      "I\u2019m Yehonatan Shapira \u2014 a visual communication designer who believes good design starts by understanding the challenge, not the tool. I work across branding, digital product, and experimental typography.",
    readMoreAboutMe: "Read more about me",

    // Work gate modal
    workGateTitle: "You haven\u2019t seen my work!",
    workGateLetMeSee: "Let me see",
    workGateConfident: "I\u2019m confident I want to collaborate",

    // About page
    aboutTitle: "About",
    aboutLead:
      "Good design starts with the right question, not the right aesthetic.",
    aboutWhoHeading: "Who I am",
    aboutWhoBody:
      "I am Yehonatan Shapira, a visual communication designer based in Jaffa. I build identity systems and digital experiences that balance clarity with personality.",
    aboutHowHeading: "How I work",
    aboutHowBody:
      "My process starts with the real constraint, not the visual trend. I map the problem, set hierarchy, and design the system so every choice supports the message.",
    aboutNowHeading: "What I am doing now",
    aboutNowBody:
      "Right now I am focused on branding, product interfaces, and experimental typography projects that connect strategic thinking with strong visual execution.",
    downloadCV: "Download CV",
    contactMe: "Contact me",

    // Work page
    workTitle: "Work",
    workSubtitle: (count: number) =>
      `${count} selected works showcasing design & development.`,

    // Shirts page
    shirtsTitle: "Shirts",
    shirtsStoreHint: "Browse products here and checkout on Shopify when ready.",
    shirtsEmpty: "No shirts are published yet. Please check back soon.",
    shirtsError:
      "Store link is not configured yet. Add NEXT_PUBLIC_SHOPIFY_STORE_URL (or NEXT_PUBLIC_SHOPIFY_SHIRTS_URL) to .env.local.",
    shirtsBuyNow: "Shop shirts",
    merchTitle: "Merch",
    merchStoreHint: "Browse merch here and checkout on Shopify when ready.",
    merchError:
      "Store link is not configured yet. Add NEXT_PUBLIC_SHOPIFY_STORE_URL (or NEXT_PUBLIC_SHOPIFY_MERCH_URL) to .env.local.",
    merchBuyNow: "Shop merch",
    shopLoading: "Loading products...",
    shopCollectionError: "Could not load products right now. Please try again.",
    shopRetry: "Try again",
    shopViewDetails: "View details",
    shopCartTitle: "Your cart",
    shopCartEmpty: "Your cart is empty.",
    shopCheckout: "Checkout on Shopify",
    shopUpdateError: "Could not update cart. Please try again.",
    shopProductError: "Could not load this product right now.",
    shopProductNotFound: "Product not found.",
    shopBackToCollection: "Back to collection",
    shopVariant: "Variant",
    shopOptionUnavailable: "Out of stock",
    shopQuantity: "Quantity",
    shopAddToCart: "Add to cart",
    shopAddingToCart: "Adding...",
    shopAddedToCart: "Added to cart.",
    shopCart: "Cart",
    shopCartClose: "Close cart",
    shopContinueShopping: "Continue shopping",
    shopSubtotal: "Subtotal",
    shopTaxNote: "Prices shown in approximate ILS. Checkout on Shopify is charged in USD.",
    shopRemove: "Remove",
    shopShopAll: "Shop all on Shopify",
    shopBestSellers: "Best Sellers",
    shopCarouselPrev: "Previous products",
    shopCarouselNext: "Next products",
    shopPrevImage: "Previous image",
    shopNextImage: "Next image",
    shopCloseImage: "Close image",
    shopOpenImage: "Open image full screen",
    storeFilterAll: "All",
    catOversizedFront: "Oversized · Front",
    catOversizedBack: "Oversized · Back",
    catTshirts: "T-Shirts",
    catKids: "Kids shirts",
    catToddler: "Toddler shirts",

    // Project detail
    visitProject: "Visit project",
    backToWork: "Back to work",
    startAProject: "Start a project",
    previousProject: "Previous project",
    nextProject: "Next project",

    // Contact page
    contactTitle: "Contact",
    contactHero: "Let\u2019s talk",
    contactLead:
      "If you want to collaborate on branding, digital design, or creative direction, send\u00A0a\u00A0message.",
    contactAvailability:
      "Available for new projects — branding, digital product design, and experimental work.",
    contactSubtitle: "Or email directly\u00A0at",
    contactDownloadCV: "download my CV",
    formName: "Name",
    formEmail: "Email",
    formMessage: "Message",
    formSend: "Let\u2019s talk",
    formSending: "Sending\u2026",
    formSent: "Message sent!",
    formSentBody: "Thanks for reaching out. I\u2019ll get back to you soon.",
    formSendAnother: "Send another",
    formError:
      "Something went wrong. Please try again or email itsalefsofit@gmail.com directly.",

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
    navShirts: "חולצות",
    navContact: "צור קשר",
    seeAllProjects: "צפו בכל הפרויקטים",

    brandName: "יהונתן שפירא",
    heroName: "יהונתן שפירא",

    heroLine1: "עיצוב הוא אף פעם לא הסגנון שלי.",
    heroLine2: "זה האתגר שלך",
    heroLine3Prefix: "",
    heroLine3Accent: "והפתרון שלנו.",
    heroTagline: (
      <>
        {"עיצוב הוא אף פעם לא הסגנון שלי. זה האתגר שלך והפתרון שלנו."}
      </>
    ),
    heroTaglineText:
      "עיצוב הוא אף פעם לא הסגנון שלי. זה האתגר שלך והפתרון שלנו.",
    heroOrientationLine:
      "תקשורת חזותית — מיתוג · מוצר דיגיטלי · טיפוגרפיה ניסיונית",
    viewWork: "צפו בעבודות",
    letsCollaborate: "בואו נעבוד",

    selectedWork: "עבודות נבחרות",

    aboutTeaserTitle: "יהונתן שפירא",
    aboutTeaserBody:
      "אני יהונתן שפירא — מעצב תקשורת חזותית שמאמין שעיצוב טוב מתחיל בהבנת הבעיה, לא בכלים לפתרון שלה. אני עוסק במיתוג, מוצרים דיגיטלי וטיפוגרפיה ניסיונית.",
    readMoreAboutMe: "קראו עוד עליי",

    workGateTitle: "עוד לא ראיתם את העבודות שלי",
    workGateLetMeSee: "אני רוצה לראות",
    workGateConfident: "אני בטוח שאני רוצה לעבוד איתך",

    aboutTitle: "אודות",
    aboutLead:
      "עיצוב טוב מתחיל בשאלה הנכונה, לא באסתטיקה הנכונה.",
    aboutWhoHeading: "מי אני",
    aboutWhoBody:
      "אני יהונתן שפירא, מעצב תקשורת חזותית מיפו. אני בונה זהויות מותג וחוויות דיגיטליות שמאזנות בין בהירות לבין אופי.",
    aboutHowHeading: "איך אני עובד",
    aboutHowBody:
      "התהליך שלי מתחיל מהאילוץ האמיתי ולא מהטרנד החזותי. אני ממפה את הבעיה, בונה היררכיה, ומעצב מערכת שבה כל בחירה משרתת את המסר.",
    aboutNowHeading: "מה אני עושה עכשיו",
    aboutNowBody:
      "כיום אני מתמקד בפרויקטים של מיתוג, ממשקים דיגיטליים וטיפוגרפיה ניסיונית, שמחברים חשיבה אסטרטגית עם ביצוע חזותי מדויק.",
    downloadCV: "הורדת קורות חיים",
    contactMe: "צור קשר",

    workTitle: "עבודות",
    workSubtitle: (count: number) =>
      `${count} עבודות נבחרות בעיצוב ופיתוח.`,

    shirtsTitle: "חולצות",
    shirtsStoreHint: "עיינו במוצרים כאן ועברו לתשלום ב-Shopify כשתהיו מוכנים.",
    shirtsEmpty: "עדיין אין חולצות שפורסמו. נסו שוב בקרוב.",
    shirtsError:
      "קישור החנות עדיין לא מוגדר. הוסיפו NEXT_PUBLIC_SHOPIFY_STORE_URL (או NEXT_PUBLIC_SHOPIFY_SHIRTS_URL) לקובץ .env.local.",
    shirtsBuyNow: "לקניית חולצות",
    merchTitle: "מרצ׳",
    merchStoreHint: "עיינו במרצ׳ כאן ועברו לתשלום ב-Shopify כשתהיו מוכנים.",
    merchError:
      "קישור החנות עדיין לא מוגדר. הוסיפו NEXT_PUBLIC_SHOPIFY_STORE_URL (או NEXT_PUBLIC_SHOPIFY_MERCH_URL) לקובץ .env.local.",
    merchBuyNow: "לקניית מרצ׳",
    shopLoading: "טוען מוצרים...",
    shopCollectionError: "לא ניתן לטעון מוצרים כרגע. נסו שוב.",
    shopRetry: "נסו שוב",
    shopViewDetails: "לפרטים",
    shopCartTitle: "העגלה שלך",
    shopCartEmpty: "העגלה ריקה.",
    shopCheckout: "לתשלום ב-Shopify",
    shopUpdateError: "לא ניתן לעדכן את העגלה. נסו שוב.",
    shopProductError: "לא ניתן לטעון את המוצר כרגע.",
    shopProductNotFound: "המוצר לא נמצא.",
    shopBackToCollection: "חזרה לאוסף",
    shopVariant: "וריאציה",
    shopOptionUnavailable: "אזל מהמלאי",
    shopQuantity: "כמות",
    shopAddToCart: "הוספה לעגלה",
    shopAddingToCart: "מוסיף...",
    shopAddedToCart: "נוסף לעגלה.",
    shopCart: "עגלה",
    shopCartClose: "סגירת עגלה",
    shopContinueShopping: "המשך קנייה",
    shopSubtotal: "סכום ביניים",
    shopTaxNote: "המחירים מוצגים בש\"ח (משוער). התשלום ב-Shopify מתבצע ב-USD.",
    shopRemove: "הסרה",
    shopShopAll: "לחנות המלאה ב-Shopify",
    shopBestSellers: "הנמכרים ביותר",
    shopCarouselPrev: "מוצרים קודמים",
    shopCarouselNext: "מוצרים הבאים",
    shopPrevImage: "תמונה קודמת",
    shopNextImage: "תמונה הבאה",
    shopCloseImage: "סגירת תמונה",
    shopOpenImage: "פתיחת תמונה במסך מלא",
    storeFilterAll: "הכול",
    catOversizedFront: "אוברסייז · קדמי",
    catOversizedBack: "אוברסייז · אחורי",
    catTshirts: "טי-שירטים",
    catKids: "חולצות ילדים",
    catToddler: "חולצות פעוטות",

    visitProject: "לאתר הפרויקט",
    backToWork: "חזרה לעבודות",
    startAProject: "בואו נתחיל",
    previousProject: "פרויקט קודם",
    nextProject: "פרויקט הבא",

    contactTitle: "צור קשר",
    contactHero: "בואו נדבר",
    contactLead:
      "אם אתם רוצים לשתף פעולה במיתוג, עיצוב דיגיטלי, או הנחייה קריאטיבית, שלחו\u00A0הודעה.",
    contactAvailability:
      "זמין לפרויקטים חדשים — מיתוג, עיצוב מוצר דיגיטלי, ועבודה ניסיונית.",
    contactSubtitle: "או שלחו מייל ישירות\u00A0ל",
    contactDownloadCV: "הורדת קורות חיים",
    formName: "שם",
    formEmail: "אימייל",
    formMessage: "הודעה",
    formSend: "בואו נדבר",
    formSending: "שולח\u2026",
    formSent: "ההודעה נשלחה!",
    formSentBody: "תודה שפניתם אליי. אחזור אליכם בהקדם.",
    formSendAnother: "שלחו עוד",
    formError:
      "משהו השתבש. נסו שוב או שלחו מייל ל\u05be itsalefsofit@gmail.com",

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
