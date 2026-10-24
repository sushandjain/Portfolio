import { getContent, getDefaultContent } from "@/lib/server/db";
import PortfolioView from "@/components/PortfolioView";

export default function Home() {
  const content = getContent() || getDefaultContent();

  return <PortfolioView activeSection="home" content={content} />;
}
