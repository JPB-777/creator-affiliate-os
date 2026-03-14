import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://affiliateos.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "AffiliateOS — Scan, Track & Fix Your Affiliate Links",
    template: "%s | AffiliateOS",
  },
  description:
    "Open-source affiliate link management for content creators. Scan your pages for broken affiliate links, track earnings across 10+ networks, and generate FTC disclosures.",
  keywords: [
    "affiliate link checker",
    "broken affiliate links",
    "affiliate link management",
    "affiliate earnings tracker",
    "FTC disclosure generator",
    "Amazon Associates link checker",
    "affiliate marketing tools",
    "open source affiliate",
    "content creator tools",
    "link health monitor",
  ],
  authors: [{ name: "AffiliateOS" }],
  creator: "AffiliateOS",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "AffiliateOS",
    title: "AffiliateOS — Your Affiliate Links, Under Control",
    description:
      "Scan your content for broken affiliate links, track earnings across 10+ networks, and stay FTC-compliant. Open-source & free.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AffiliateOS — Your Affiliate Links, Under Control",
    description:
      "Scan your content for broken affiliate links, track earnings across 10+ networks, and stay FTC-compliant. Open-source & free.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
