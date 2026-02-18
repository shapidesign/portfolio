import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { AnimatedCursor } from "@/components/ui/AnimatedCursor";
import { IntroLoader } from "@/components/ui/IntroLoader";
import { RouteTransition } from "@/components/ui/RouteTransition";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shapidesign.com"),
  title: "Yehonatan Shapira - Visual Creator",
  description: "Portfolio website for Yehonatan Shapira, visual creator.",
  alternates: {
    canonical: "/"
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
  return (
    <html lang="en">
      <body className={spaceGrotesk.variable}>
        <IntroLoader />
        <AnimatedCursor />
        <div className="site-shell">
          <SiteHeader />
          <RouteTransition>{children}</RouteTransition>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
