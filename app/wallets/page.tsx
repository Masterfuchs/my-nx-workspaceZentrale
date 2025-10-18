import type { Metadata } from "next"
import Content from "@/components/wallets/content"
import Layout from "@/components/cmsfullform/layout"

export const metadata: Metadata = {
  title: "Wallet Monitoring - DezentraleTrading",
  description: "Monitor connected wallets, connection status, and wallet analytics for decentralized trading",
}

export default function WalletsPage() {
  return (
    <Layout>
      <Content />
    </Layout>
  )
}
