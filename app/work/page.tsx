import { Metadata } from "next";
import { getContent, getDefaultContent } from "@/lib/server/db";
import PortfolioView from "@/components/PortfolioView";

export const metadata: Metadata = {
  title: "Selected Works & Production Case Studies",
  description:
    "Explore flagship software engineering architectures: Malnad Direct D2C Speed Post logistics, TuneXIA Cloud progressive audio streaming, and Henjodi Expeditions booking portal.",
};

export default function WorkPage() {
  const content = getContent() || getDefaultContent();

  return <PortfolioView activeSection="work" content={content} />;
}
