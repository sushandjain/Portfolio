import { Metadata } from "next";
import { getContent, getDefaultContent } from "@/lib/server/db";
import PortfolioView from "@/components/PortfolioView";

export const metadata: Metadata = {
  title: "Selected Works & Production Case Studies",
  description:
    "Explore flagship software engineering architectures: Malnad Direct, TuneXIA Cloud, and Henjodi Expeditions.",
};

export default function ProjectsPage() {
  const content = getContent() || getDefaultContent();

  return <PortfolioView activeSection="work" content={content} />;
}
