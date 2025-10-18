"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Code,
  Network,
  Activity,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Copy,
  Play,
  Pause,
  Settings,
  RefreshCw,
  Eye,
  FileText,
  Hash,
  Coins,
} from "lucide-react"

// Mock smart contract data
const contracts = [
  {
    id: "contract-001",
    name: "DezentraleTrading Pool Manager",
    address: "0x742d35Cc6C4C4e8f9B8B8B8B8B8B8B8B8B8B4e8f",
    network: "Ethereum",
    status: "Active",
    version: "v2.1.0",
    deployedAt: "2024-01-15",
    gasUsed: 2450000,
    transactions: 1247,
    tvl: 12500000,
    lastInteraction: "2024-12-28T10:30:00Z",
    functions: [
      { name: "createPool", calls: 45, gasAvg: 180000 },
      { name: "joinPool", calls: 892, gasAvg: 95000 },
      { name: "exitPool", calls: 234, gasAvg: 120000 },
      { name: "rebalance", calls: 76, gasAvg: 250000 },
    ],
  },
  {
    id: "contract-002",
    name: "Copy Trading Executor",
    address: "0x8a3b9c2d1e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t",
    network: "Polygon",
    status: "Active",
    version: "v1.8.2",
    deployedAt: "2024-02-20",
    gasUsed: 1850000,
    transactions: 3421,
    tvl: 8900000,
    lastInteraction: "2024-12-28T09:45:00Z",
    functions: [
      { name: "executeTrade", calls: 2341, gasAvg: 85000 },
      { name: "updateStrategy", calls: 156, gasAvg: 145000 },
      { name: "pauseTrading", calls: 23, gasAvg: 65000 },
      { name: "withdrawFunds", calls: 901, gasAvg: 110000 },
    ],
  },
  {
    id: "contract-003",
    name: "Risk Management Oracle",
    address: "0x1f5e7a9b3c6d8e2f4g7h9i1j3k5l7m9n1o3p5q7r",
    network: "Arbitrum",
    status: "Paused",
    version: "v1.2.1",
    deployedAt: "2024-03-10",
    gasUsed: 980000,
    transactions: 567,
    tvl: 3200000,
    lastInteraction: "2024-12-27T16:20:00Z",
    functions: [
      { name: "checkRiskLimits", calls: 445, gasAvg: 45000 },
      { name: "updatePriceFeeds", calls: 89, gasAvg: 75000 },
      { name: "triggerStopLoss", calls: 33, gasAvg: 125000 },
    ],
  },
]

const gasData = [
  { time: "00:00", ethereum: 45, polygon: 12, arbitrum: 8, optimism: 6 },
  { time: "04:00", ethereum: 52, polygon: 15, arbitrum: 9, optimism: 7 },
  { time: "08:00", ethereum: 78, polygon: 22, arbitrum: 14, optimism: 11 },
  { time: "12:00", ethereum: 95, polygon: 28, arbitrum: 18, optimism: 14 },
  { time: "16:00", ethereum: 112, polygon: 35, arbitrum: 22, optimism: 17 },
  { time: "20:00", ethereum: 89, polygon: 26, arbitrum: 16, optimism: 13 },
]

const recentTransactions = [
  {
    id: "tx-001",
    hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
    contract: "Pool Manager",
    function: "createPool",
    status: "Success",
    gasUsed: 180000,
    gasPrice: 45,
    value: "1.5 ETH",
    timestamp: "2024-12-28T10:30:00Z",
    network: "Ethereum",
  },
  {
    id: "tx-002",
    hash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a",
    contract: "Copy Trading Executor",
    function: "executeTrade",
    status: "Success",
    gasUsed: 85000,
    gasPrice: 22,
    value: "0.8 MATIC",
    timestamp: "2024-12-28T10:25:00Z",
    network: "Polygon",
  },
  {
    id: "tx-003",
    hash: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b",
    contract: "Risk Management Oracle",
    function: "checkRiskLimits",
    status: "Failed",
    gasUsed: 45000,
    gasPrice: 8,
    value: "0.0 ETH",
    timestamp: "2024-12-28T10:20:00Z",
    network: "Arbitrum",
  },
]

const networkStats = {
  ethereum: { gasPrice: 45, blockTime: 12, congestion: "High" },
  polygon: { gasPrice: 22, blockTime: 2, congestion: "Medium" },
  arbitrum: { gasPrice: 8, blockTime: 1, congestion: "Low" },
  optimism: { gasPrice: 6, blockTime: 2, congestion: "Low" },
}

export default function SmartContractsContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Smart Contract Interactions</h1>
          <p className="text-muted-foreground mt-1">
            Verwalten Sie Smart Contract Interaktionen, Gas-Tracking und Transaktionsüberwachung
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-border bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Code className="h-4 w-4 mr-2" />
            Contract deployen
          </Button>
        </div>
      </div>

      {/* Network Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(networkStats).map(([network, stats]) => (
          <Card key={network} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Network className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground capitalize">{network}</span>
                </div>
                <Badge
                  variant={
                    stats.congestion === "Low" ? "default" : stats.congestion === "Medium" ? "secondary" : "destructive"
                  }
                >
                  {stats.congestion}
                </Badge>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas Price:</span>
                  <span className="text-foreground font-medium">{stats.gasPrice} gwei</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Block Time:</span>
                  <span className="text-foreground font-medium">{stats.blockTime}s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gas Price Tracker */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Gas Price Tracker</CardTitle>
            <CardDescription>Aktuelle Gas-Preise über verschiedene Netzwerke</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gasData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `${value} gwei`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: any, name: string) => [
                      `${value} gwei`,
                      name.charAt(0).toUpperCase() + name.slice(1),
                    ]}
                  />
                  <Line type="monotone" dataKey="ethereum" stroke="#627EEA" strokeWidth={2} />
                  <Line type="monotone" dataKey="polygon" stroke="#8247E5" strokeWidth={2} />
                  <Line type="monotone" dataKey="arbitrum" stroke="#28A0F0" strokeWidth={2} />
                  <Line type="monotone" dataKey="optimism" stroke="#FF0420" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#627EEA] rounded-full" />
                <span className="text-foreground">Ethereum</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#8247E5] rounded-full" />
                <span className="text-foreground">Polygon</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#28A0F0] rounded-full" />
                <span className="text-foreground">Arbitrum</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#FF0420] rounded-full" />
                <span className="text-foreground">Optimism</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>Häufig verwendete Contract-Funktionen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-primary/10 text-primary hover:bg-primary/20">
              <Play className="h-4 w-4 mr-2" />
              Pool erstellen
            </Button>
            <Button className="w-full justify-start bg-accent/10 text-accent hover:bg-accent/20">
              <Activity className="h-4 w-4 mr-2" />
              Trade ausführen
            </Button>
            <Button className="w-full justify-start bg-chart-5/10 text-chart-5 hover:bg-chart-5/20">
              <Pause className="h-4 w-4 mr-2" />
              Trading pausieren
            </Button>
            <Button className="w-full justify-start bg-muted text-muted-foreground hover:bg-muted/80">
              <Settings className="h-4 w-4 mr-2" />
              Risk Limits setzen
            </Button>
            <Button className="w-full justify-start bg-chart-4/10 text-chart-4 hover:bg-chart-4/20">
              <Coins className="h-4 w-4 mr-2" />
              Funds abheben
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Smart Contracts Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Deployed Contracts</CardTitle>
          <CardDescription>Übersicht aller deployed Smart Contracts mit Status und Metriken</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="all">Alle Contracts</TabsTrigger>
              <TabsTrigger value="active">Aktiv</TabsTrigger>
              <TabsTrigger value="paused">Pausiert</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              <div className="space-y-4">
                {contracts.map((contract) => (
                  <Card key={contract.id} className="bg-muted/50 border-border">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Contract Info */}
                        <div className="lg:col-span-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                              <Code className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{contract.name}</h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <p className="text-sm text-muted-foreground font-mono">
                                  {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                                </p>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant={contract.status === "Active" ? "default" : "secondary"}>
                                  {contract.status}
                                </Badge>
                                <Badge variant="outline">{contract.network}</Badge>
                                <Badge variant="outline">{contract.version}</Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="lg:col-span-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">TVL:</span>
                              <div className="font-semibold text-foreground">
                                ${(contract.tvl / 1000000).toFixed(1)}M
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Transactions:</span>
                              <div className="font-semibold text-foreground">
                                {contract.transactions.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Gas Used:</span>
                              <div className="font-semibold text-foreground">
                                {(contract.gasUsed / 1000000).toFixed(2)}M
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Deployed:</span>
                              <div className="font-semibold text-foreground">
                                {new Date(contract.deployedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="border-border bg-transparent">
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            <Button size="sm" variant="outline" className="border-border bg-transparent">
                              <Settings className="h-4 w-4 mr-1" />
                              Konfiguration
                            </Button>
                            <Button size="sm" variant="outline" className="border-border bg-transparent">
                              <FileText className="h-4 w-4 mr-1" />
                              Logs
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Function Statistics */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <h4 className="text-sm font-medium text-foreground mb-3">Function Calls (30d)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {contract.functions.map((func, index) => (
                            <div key={index} className="space-y-1">
                              <div className="font-medium text-foreground">{func.name}</div>
                              <div className="text-muted-foreground">
                                {func.calls} calls • Ø {(func.gasAvg / 1000).toFixed(0)}k gas
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="text-center py-8 text-muted-foreground">Aktive Contracts werden hier angezeigt...</div>
            </TabsContent>

            <TabsContent value="paused">
              <div className="text-center py-8 text-muted-foreground">Pausierte Contracts werden hier angezeigt...</div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="text-center py-8 text-muted-foreground">Contract Analytics werden hier angezeigt...</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Transactions</CardTitle>
          <CardDescription>Neueste Smart Contract Transaktionen und deren Status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <Card key={tx.id} className="bg-muted/30 border-border">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Transaction Hash */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm text-foreground">
                          {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                        </span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Contract & Function */}
                    <div className="lg:col-span-3">
                      <div className="text-sm">
                        <div className="font-medium text-foreground">{tx.contract}</div>
                        <div className="text-muted-foreground">{tx.function}</div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center space-x-2">
                        {tx.status === "Success" ? (
                          <CheckCircle className="h-4 w-4 text-chart-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-chart-5" />
                        )}
                        <Badge variant={tx.status === "Success" ? "default" : "destructive"}>{tx.status}</Badge>
                      </div>
                    </div>

                    {/* Gas & Value */}
                    <div className="lg:col-span-2">
                      <div className="text-sm">
                        <div className="text-foreground">{(tx.gasUsed / 1000).toFixed(0)}k gas</div>
                        <div className="text-muted-foreground">{tx.value}</div>
                      </div>
                    </div>

                    {/* Network & Time */}
                    <div className="lg:col-span-2">
                      <div className="text-sm">
                        <Badge variant="outline" className="mb-1">
                          {tx.network}
                        </Badge>
                        <div className="text-muted-foreground">{new Date(tx.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
