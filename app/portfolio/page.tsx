import type { Metadata } from "next"
import { PortfolioContent } from "@/components/portfolio/content"

export const metadata: Metadata = {
  title: "Portfolio Tracking | DezentraleTrading",
  description: "Comprehensive portfolio tracking and analytics for decentralized trading",
}

export default function PortfolioPage() {
  return <PortfolioContent />
}
