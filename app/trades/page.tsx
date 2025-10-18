import type { Metadata } from "next"
import Content from "@/components/trades/content"
import Layout from "@/components/cmsfullform/layout"

export const metadata: Metadata = {
  title: "Trade Execution - DezentraleTrading",
  description: "Comprehensive trade execution logging, monitoring, and analysis for decentralized trading",
}

export default function TradesPage() {
  return (
    <Layout>
      <Content />
    </Layout>
  )
}
