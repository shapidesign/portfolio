import type { Metadata } from "next";
import Script from "next/script";
import { LEGACY_DOMAIN_REDIRECT_SCRIPT, SITE_NAME, SITE_ORIGIN } from "@/lib/site";
import { Bricolage_Grotesque, Roboto_Mono, Science_Gothic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AnimatedCursor } from "@/components/ui/AnimatedCursor";
import { IntroLoader } from "@/components/ui/IntroLoader";
import { RouteTransition } from "@/components/ui/RouteTransition";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProjectProvider } from "@/context/ProjectContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/ui/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Yehonatan Shapira — Product & Visual Designer",
    template: "%s — Yehonatan Shapira"
  },
  description: "Yehonatan Shapira (Shapi) is a product and visual designer specializing in branding, typography, digital design, and creative direction. View selected work and get in touch.",
  keywords: [
    "Yehonatan Shapira", "Yehonatan Shapira designer", "Yehonatan Shapira portfolio",
    "Alef Sofit", "alefsofit", "Shapi Design", "Shapi", "shapidesign",
    "visual designer", "graphic designer", "visual communication designer",
    "branding designer", "brand identity", "logo designer",
    "typography designer", "digital designer", "creative direction",
    "Israeli designer", "design portfolio", "freelance designer",
  ],
  authors: [{ name: "Yehonatan Shapira", url: SITE_ORIGIN }],
  creator: "Yehonatan Shapira",
  openGraph: {
    title: "Yehonatan Shapira — Product & Visual Designer",
    description: "Design is never my style. It's your problem and our solution. Portfolio of Yehonatan Shapira — branding, typography, and digital design.",
    url: SITE_ORIGIN,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yehonatan Shapira — Product & Visual Designer",
    description: "Design is never my style. It's your problem and our solution. Portfolio of Yehonatan Shapira — branding, typography, and digital design.",
  },
  alternates: {
    canonical: `${SITE_ORIGIN}/`,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }]
  },
  verification: {
    google: "U-2D1MkhvyQTAMMdWvbroor5m9lSgPmmMVrQtPW1fjA"
  },
  other: {
    "google-site-verification": "U-2D1MkhvyQTAMMdWvbroor5m9lSgPmmMVrQtPW1fjA",
  },
};

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-bricolage",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto-mono",
});

const scienceGothic = Science_Gothic({
  subsets: ["latin"],
  variable: "--font-science-gothic",
});

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_ORIGIN}/#person`,
    "name": "Yehonatan Shapira",
    "alternateName": ["Alef Sofit", "alefsofit", "Shapi", "Shapi Design", "shapidesign"],
    "url": SITE_ORIGIN,
    "image": `${SITE_ORIGIN}/opengraph-image`,
    "jobTitle": "Product & Visual Designer",
    "description": "Product and visual designer specializing in branding, typography, digital design, and creative direction.",
    "knowsAbout": [
      "Visual Design", "Graphic Design", "Branding", "Brand Identity",
      "Typography", "Logo Design", "Digital Design", "Web Design",
      "Creative Direction", "Figma", "Adobe Creative Cloud", "Copywriting"
    ],
    "sameAs": [
      "https://www.linkedin.com/in/yehonatan-shapira"
    ],
    "email": "mailto:itsalefsofit@gmail.com",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    "name": SITE_NAME,
    "alternateName": ["Alef Sofit", "Shapi Design", "Yehonatan Shapira Portfolio"],
    "url": SITE_ORIGIN,
    "description": "Portfolio of Yehonatan Shapira, visual communication and graphic designer.",
    "publisher": { "@id": `${SITE_ORIGIN}/#person` },
  };

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: LEGACY_DOMAIN_REDIRECT_SCRIPT }}
        />
        <link
          rel="preload"
          href="/fonts/narkiss-yair-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/tmu4num.css" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KND8EK229Z"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KND8EK229Z');
          `}
        </Script>
      </head>
      <body className={`${bricolage.variable} ${robotoMono.variable} ${scienceGothic.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([personJsonLd, websiteJsonLd]) }}
        />
        <IntroLoader />
        <AnimatedCursor />
        <LanguageProvider>
          <ProjectProvider>
            <CartProvider>
              <div className="site-shell">
                <SiteHeader />
                <RouteTransition>{children}</RouteTransition>
                <SiteFooter />
              </div>
              <CartDrawer />
            </CartProvider>
          </ProjectProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
