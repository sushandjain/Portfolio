import { Metadata } from "next";
import { getContent, getDefaultContent } from "@/lib/server/db";
import PortfolioView from "@/components/PortfolioView";

export const metadata: Metadata = {
  title: "Credentials & Academic Foundations",
  description:
    "Anthropic Claude Certified Associate, Bachelor of Engineering from Sahyadri College, and Full-Stack JSpiders specialization.",
};

export default function CredentialsPage() {
  const content = getContent() || getDefaultContent();

  return <PortfolioView activeSection="credentials" content={content} />;
}
