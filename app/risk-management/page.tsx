import type { Metadata } from "next"
import { RiskManagementContent } from "@/components/risk-management/content"

export const metadata: Metadata = {
  title: "Risk Management | DezentraleTrading",
  description: "Advanced risk management controls and monitoring for decentralized trading",
}

export default function RiskManagementPage() {
  return <RiskManagementContent />
}
