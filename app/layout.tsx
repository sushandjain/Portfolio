import type { Metadata, Viewport } from "next";
import { Anybody, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Anybody({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#090B10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sushandjain.dev"),
  title: {
    default: "Sushan D Jain — Full-Stack Architect & TCS Systems Engineer",
    template: "%s | Sushan D Jain",
  },
  description:
    "Interactive kinetic portfolio of Sushan D Jain, Full-Stack Developer & Systems Engineer at TCS. Creator of TuneXIA Cloud, Malnad Direct D2C & Kheti Bazaar. Anthropic Claude Certified Associate & 2nd Place TCS National AI Hackathon.",
  keywords: [
    "Sushan Jain",
    "Sushan D Jain",
    "Full-Stack Architect",
    "Systems Engineer",
    "TCS Bengaluru",
    "React 19",
    "Next.js 15",
    "Node.js",
    "TypeScript",
    "Anthropic Claude Certified Associate",
    "TuneXIA Cloud",
    "Malnad Direct",
    "TCS AI Friday Hackathon",
    "Portfolio",
  ],
  authors: [{ name: "Sushan D Jain", url: "https://github.com/sushandjain" }],
  creator: "Sushan D Jain",
  publisher: "Sushan D Jain",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sushandjain.dev",
    siteName: "Sushan D Jain Portfolio",
    title: "Sushan D Jain — Full-Stack Architect & TCS Systems Engineer",
    description:
      "Interactive kinetic stretch portfolio. Production flagships in MERN, Next.js 15 App Router, high-throughput REST APIs, and Anthropic Claude AI architectures.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sushan D Jain — Full-Stack Architect & TCS Systems Engineer Social Preview Card",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sushan D Jain — Full-Stack Architect & TCS Systems Engineer",
    description:
      "Interactive kinetic stretch portfolio showcasing full-stack flagships, enterprise systems reliability, and Anthropic Claude AI certification.",
    images: ["/og-image.png"],
    creator: "@sushandjain",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="antialiased selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
