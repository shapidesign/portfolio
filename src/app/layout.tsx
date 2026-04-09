import type { Metadata } from "next";
import { Rubik, Bricolage_Grotesque } from "next/font/google";
import { AnimatedCursor } from "@/components/ui/AnimatedCursor";
import { IntroLoader } from "@/components/ui/IntroLoader";
import { RouteTransition } from "@/components/ui/RouteTransition";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProjectProvider } from "@/context/ProjectContext";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shapidesign.com"),
  title: {
    default: "Yehonatan Shapira — Product & Visual Designer",
    template: "%s — Yehonatan Shapira"
  },
  description: "Yehonatan Shapira (Shapi) is a product and visual designer specializing in branding, typography, digital design, and creative direction. View selected work and get in touch.",
  keywords: [
    "Yehonatan Shapira", "Yehonatan Shapira designer", "Yehonatan Shapira portfolio",
    "Shapi Design", "Shapi", "shapidesign",
    "visual designer", "graphic designer", "visual communication designer",
    "branding designer", "brand identity", "logo designer",
    "typography designer", "digital designer", "creative direction",
    "Israeli designer", "design portfolio", "freelance designer",
  ],
  authors: [{ name: "Yehonatan Shapira", url: "https://www.shapidesign.com" }],
  creator: "Yehonatan Shapira",
  openGraph: {
    title: "Yehonatan Shapira — Product & Visual Designer",
    description: "Design is never my style. It's your problem and our solution. Portfolio of Yehonatan Shapira — branding, typography, and digital design.",
    url: "https://www.shapidesign.com",
    siteName: "Shapi Design — Yehonatan Shapira",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yehonatan Shapira — Product & Visual Designer",
    description: "Design is never my style. It's your problem and our solution. Portfolio of Yehonatan Shapira — branding, typography, and digital design.",
  },
  alternates: {
    canonical: "https://www.shapidesign.com",
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

const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  variable: "--font-rubik",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-bricolage",
});

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.shapidesign.com/#person",
    "name": "Yehonatan Shapira",
    "alternateName": ["Shapi", "Shapi Design", "shapidesign"],
    "url": "https://www.shapidesign.com",
    "image": "https://www.shapidesign.com/opengraph-image",
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
    "email": "mailto:shapidesigns@gmail.com",
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.shapidesign.com/#website",
    "name": "Shapi Design — Yehonatan Shapira",
    "alternateName": ["Shapi Design", "Yehonatan Shapira Portfolio"],
    "url": "https://www.shapidesign.com",
    "description": "Portfolio of Yehonatan Shapira, visual communication and graphic designer.",
    "publisher": { "@id": "https://www.shapidesign.com/#person" },
  };

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var m=localStorage.getItem("theme-manual"),t;if(m){t=localStorage.getItem("theme")}else{var h=new Date().getHours();t=(h>=7&&h<18)?"light":"dark"}document.documentElement.setAttribute("data-theme",t||"dark")})()` }} />
      </head>
      <body className={`${rubik.variable} ${bricolage.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([personJsonLd, websiteJsonLd]) }}
        />
        <IntroLoader />
        <AnimatedCursor />
        <LanguageProvider>
          <ProjectProvider>
            <div className="site-shell">
              <SiteHeader />
              <RouteTransition>{children}</RouteTransition>
              <SiteFooter />
            </div>
          </ProjectProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
