import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://solutionsind.com"),
  title: {
    default: "Next Solutions — Built for What's Next",
    template: "%s | Next Solutions",
  },
  description:
    "Explore computer hardware, compare verified specifications and request the right configuration from Next Solutions.",
  icons: {
    icon: "/brand/next-solutions-logo.jpeg",
    shortcut: "/brand/next-solutions-logo.jpeg",
    apple: "/brand/next-solutions-logo.jpeg",
  },
  openGraph: {
    title: "Next Solutions — Built for What's Next",
    description:
      "Explore computer hardware, compare verified specifications and request the right configuration.",
    type: "website",
    siteName: "Next Solutions",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${spaceGrotesk.variable} ${plexMono.variable}`}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
