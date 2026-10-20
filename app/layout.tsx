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
};

export const metadata: Metadata = {
  title: "Sushan D Jain — Full-Stack Developer & Systems Engineer",
  description:
    "Portfolio of Sushan D Jain, Full-Stack Developer and Systems Engineer at TCS. Creator of Malnad Direct (Western Ghats D2C) & Tunexia (Cloud Music Streaming). Specializing in React.js, Node.js, TypeScript, and high-throughput REST APIs.",
  keywords: [
    "Sushan Jain",
    "Sushan D Jain",
    "Full-Stack Developer",
    "Systems Engineer",
    "TCS Bengaluru",
    "React Developer",
    "Node.js Developer",
    "TypeScript",
    "Malnad Direct",
    "Tunexia",
    "Portfolio",
  ],
  authors: [{ name: "Sushan D Jain" }],
  openGraph: {
    title: "Sushan D Jain — Full-Stack Developer & Systems Engineer",
    description:
      "Interactive kinetic stretch portfolio showcasing full-stack projects, enterprise systems engineering, and modern web applications.",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
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
