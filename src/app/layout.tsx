import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { AnimatedCursor } from "@/components/ui/AnimatedCursor";
import { IntroLoader } from "@/components/ui/IntroLoader";
import { RouteTransition } from "@/components/ui/RouteTransition";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ProjectProvider } from "@/context/ProjectContext";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shapidesign.com"),
  title: {
    default: "Yehonatan Shapira - Designer",
    template: "%s | Yehonatan Shapira"
  },
  description: "Portfolio of Yehonatan Shapira, designer specializing in branding, digital design, and creative direction.",
  keywords: ["Yehonatan Shapira", "Designer", "Design", "Portfolio", "Creative", "Branding", "Digital Design"],
  openGraph: {
    title: "Yehonatan Shapira - Designer",
    description: "Design is never my style. It's your problem and our solution.",
    url: "https://www.shapidesign.com",
    siteName: "Yehonatan Shapira Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yehonatan Shapira - Designer",
    description: "Design is never my style. It's your problem and our solution.",
  },
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }]
  },
  verification: {
    google: "U-2D1MkhvyQTAMMdWvbroor5m9lSgPmmMVrQtPW1fjA"
  }
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk"
});

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Yehonatan Shapira",
    "url": "https://www.shapidesign.com",
    "jobTitle": "Designer",
    "description": "Design is never my style. It's your problem and our solution."
  };

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var m=localStorage.getItem("theme-manual"),t;if(m){t=localStorage.getItem("theme")}else{var h=new Date().getHours();t=(h>=7&&h<18)?"light":"dark"}document.documentElement.setAttribute("data-theme",t||"light")})()` }} />
      </head>
      <body className={spaceGrotesk.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <IntroLoader />
        <AnimatedCursor />
        <ProjectProvider>
          <div className="site-shell">
            <SiteHeader />
            <RouteTransition>{children}</RouteTransition>
            <SiteFooter />
          </div>
        </ProjectProvider>
      </body>
    </html>
  );
}
