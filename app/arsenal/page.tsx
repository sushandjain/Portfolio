import { Metadata } from "next";
import { getContent, getDefaultContent } from "@/lib/server/db";
import PortfolioView from "@/components/PortfolioView";

export const metadata: Metadata = {
  title: "Technical Arsenal & Systems Matrix",
  description:
    "Comprehensive skills matrix covering React, Next.js, Node.js, Express, MongoDB, TypeScript, Tailwind CSS, Redis, and Cloud architecture.",
};

export default function ArsenalPage() {
  const content = getContent() || getDefaultContent();

  return <PortfolioView activeSection="arsenal" content={content} />;
}
