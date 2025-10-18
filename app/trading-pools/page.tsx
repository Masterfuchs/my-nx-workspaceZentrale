import type { Metadata } from "next"
import Content from "@/components/trading-pools/content"
import Layout from "@/components/cmsfullform/layout"

export const metadata: Metadata = {
  title: "Trading Pools - DezentraleTrading",
  description: "Manage and analyze trading pools for decentralized copy trading",
}

export default function TradingPoolsPage() {
  return (
    <Layout>
      <Content />
    </Layout>
  )
}
