import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Memory Bank — Preserve Your Family's Story",
    template: "%s | Memory Bank",
  },
  description:
    "A secure digital memory vault for families. Capture stories, answer daily prompts from Nexa, and share precious moments with the people who matter most.",
  keywords: [
    "family memories",
    "digital memory vault",
    "family stories",
    "memory journal",
    "life story",
    "family history",
    "daily prompts",
    "memory preservation",
  ],
  authors: [{ name: "Memory Bank" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Memory Bank",
    title: "Memory Bank — Preserve Your Family's Story",
    description:
      "A secure digital memory vault for families. Capture stories, answer daily prompts, and share precious moments with the people who matter most.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memory Bank — Preserve Your Family's Story",
    description:
      "A secure digital memory vault for families. Capture stories, answer daily prompts, and share precious moments.",
  },
  icons: {
    icon: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${lora.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
