import { Metadata } from "next";
import { getContent, getDefaultContent } from "@/lib/server/db";
import PortfolioView from "@/components/PortfolioView";

export const metadata: Metadata = {
  title: "Experience & Engineering Tenure",
  description:
    "Tata Consultancy Services (TCS) Systems Engineer tenure, distributed systems architecture, and 2nd Place TCS National AI Hackathon honors.",
};

export default function ExperiencePage() {
  const content = getContent() || getDefaultContent();

  return <PortfolioView activeSection="experience" content={content} />;
}
