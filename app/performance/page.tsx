import type { Metadata } from "next"
import Content from "@/components/performance/content"
import Layout from "@/components/cmsfullform/layout"

export const metadata: Metadata = {
  title: "Performance Dashboard - DezentraleTrading",
  description: "Comprehensive performance analytics for copy traders and trading strategies",
}

export default function PerformancePage() {
  return (
    <Layout>
      <Content />
    </Layout>
  )
}
