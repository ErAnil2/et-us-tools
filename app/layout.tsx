import type { Metadata } from "next";
import "./globals.css";
import ETLayout from "@/components/ETLayout";
import ETFooter from "@/components/ETFooter";
import { HeadScriptInjector, BodyScripts } from "@/components/AdminScripts";
import { AdSenseScript } from "@/components/GoogleAdsense";

export const metadata: Metadata = {
  title: "The Economic Times - Free Online Calculators, Games & Apps",
  description: "360+ free online calculators, games, and apps from The Economic Times",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "https://economictimes.indiatimes.com/icons/etfavicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "https://economictimes.indiatimes.com/icons/etfavicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://economictimes.indiatimes.com" />
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        <HeadScriptInjector />
        <BodyScripts />
        {/* Google AdSense - Set NEXT_PUBLIC_ADSENSE_PUBLISHER_ID in .env.local */}
        <AdSenseScript />
        <ETLayout>
          {children}
        </ETLayout>
        <ETFooter />
      </body>
    </html>
  );
}
