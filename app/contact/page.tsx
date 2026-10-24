import { Metadata } from "next";
import { getContent, getDefaultContent } from "@/lib/server/db";
import PortfolioView from "@/components/PortfolioView";

export const metadata: Metadata = {
  title: "Contact & Direct Dispatch",
  description:
    "Get in touch with Sushan D Jain for full-stack engineering opportunities, distributed system consulting, or technical collaborations.",
};

export default function ContactPage() {
  const content = getContent() || getDefaultContent();

  return <PortfolioView activeSection="contact" content={content} />;
}
