import type { Metadata } from "next"
import Content from "@/components/smart-contracts/content"
import Layout from "@/components/cmsfullform/layout"

export const metadata: Metadata = {
  title: "Smart Contracts - DezentraleTrading",
  description: "Smart contract interactions, monitoring, and gas tracking for decentralized trading",
}

export default function SmartContractsPage() {
  return (
    <Layout>
      <Content />
    </Layout>
  )
}
