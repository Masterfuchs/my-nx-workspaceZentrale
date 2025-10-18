"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Download,
  RefreshCw,
  Eye,
  Hash,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  DollarSign,
} from "lucide-react"

// Mock trade execution data
const tradeExecutions = [
  {
    id: "trade-001",
    timestamp: "2024-12-28T10:30:15Z",
    trader: "CryptoMaster",
    traderAddress: "0x742d...4e8f",
    pool: "DeFi Alpha Strategy",
    type: "BUY",
    pair: "ETH/USDC",
    amount: 5.2847,
    price: 2450.75,
    value: 12950.32,
    status: "Executed",
    executionTime: 2.3,
    gasUsed: 180000,
    gasPrice: 45,
    slippage: 0.12,
    fee: 25.9,
    txHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
    network: "Ethereum",
    strategy: "Copy Trade",
    followers: 247,
  },
  {
    id: "trade-002",
    timestamp: "2024-12-28T10:28:42Z",
    trader: "ArbitrageBot",
    traderAddress: "0x8a3b...9c2d",
    pool: "Arbitrage Master",
    type: "SELL",
    pair: "BTC/USDT",
    amount: 0.1234,
    price: 42850.0,
    value: 5287.59,
    status: "Executed",
    executionTime: 1.8,
    gasUsed: 95000,
    gasPrice: 22,
    slippage: 0.08,
    fee: 10.58,
    txHash: "0x2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a",
    network: "Polygon",
    strategy: "Arbitrage",
    followers: 156,
  },
  {
    id: "trade-003",
    timestamp: "2024-12-28T10:25:18Z",
    trader: "DeFiWizard",
    traderAddress: "0x1f5e...7a9b",
    pool: "High Frequency Bot",
    type: "BUY",
    pair: "MATIC/USDC",
    amount: 1250.0,
    price: 0.8945,
    value: 1118.13,
    status: "Failed",
    executionTime: 0.0,
    gasUsed: 45000,
    gasPrice: 8,
    slippage: 0.0,
    fee: 0.0,
    txHash: "0x3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b",
    network: "Arbitrum",
    strategy: "High Frequency",
    followers: 89,
    failureReason: "Insufficient liquidity",
  },
  {
    id: "trade-004",
    timestamp: "2024-12-28T10:22:55Z",
    trader: "YieldHunter",
    traderAddress: "0x9c4f...2a1b",
    pool: "Yield Farming Pro",
    type: "SELL",
    pair: "UNI/ETH",
    amount: 45.67,
    price: 0.0034,
    value: 0.1553,
    status: "Pending",
    executionTime: 0.0,
    gasUsed: 0,
    gasPrice: 35,
    slippage: 0.0,
    fee: 0.0,
    txHash: "0x4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c",
    network: "Ethereum",
    strategy: "Yield Farming",
    followers: 203,
  },
  {
    id: "trade-005",
    timestamp: "2024-12-28T10:20:33Z",
    trader: "SwingTrader",
    traderAddress: "0x3e7a...8d5c",
    pool: "Swing Strategy",
    type: "BUY",
    pair: "LINK/USDT",
    amount: 125.89,
    price: 14.75,
    value: 1856.88,
    status: "Executed",
    executionTime: 3.1,
    gasUsed: 125000,
    gasPrice: 42,
    slippage: 0.15,
    fee: 3.71,
    txHash: "0x5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d",
    network: "Ethereum",
    strategy: "Swing Trading",
    followers: 178,
  },
]

const tradeStats = {
  totalTrades: 1247,
  executedTrades: 1089,
  pendingTrades: 23,
  failedTrades: 135,
  totalVolume: 24500000,
  avgExecutionTime: 2.1,
  successRate: 87.3,
}

const executionTimeData = [
  { time: "00:00", avgTime: 1.8, trades: 45 },
  { time: "04:00", avgTime: 2.1, trades: 32 },
  { time: "08:00", avgTime: 2.8, trades: 78 },
  { time: "12:00", avgTime: 3.2, trades: 95 },
  { time: "16:00", avgTime: 2.9, trades: 87 },
  { time: "20:00", avgTime: 2.3, trades: 56 },
]

const volumeData = [
  { date: "Mon", volume: 2450000, trades: 156 },
  { date: "Tue", volume: 3200000, trades: 203 },
  { date: "Wed", volume: 1890000, trades: 134 },
  { date: "Thu", volume: 4100000, trades: 267 },
  { date: "Fri", volume: 3750000, trades: 245 },
  { date: "Sat", volume: 2100000, trades: 145 },
  { date: "Sun", volume: 1650000, trades: 97 },
]

export default function TradesContent() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Executed":
        return <CheckCircle className="h-4 w-4 text-chart-4" />
      case "Pending":
        return <Clock className="h-4 w-4 text-accent" />
      case "Failed":
        return <XCircle className="h-4 w-4 text-chart-5" />
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Executed":
        return <Badge className="bg-chart-4/20 text-chart-4 hover:bg-chart-4/30">Executed</Badge>
      case "Pending":
        return <Badge className="bg-accent/20 text-accent hover:bg-accent/30">Pending</Badge>
      case "Failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    return type === "BUY" ? (
      <ArrowUpRight className="h-4 w-4 text-chart-4" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-chart-5" />
    )
  }

  const getTypeBadge = (type: string) => {
    return type === "BUY" ? (
      <Badge className="bg-chart-4/20 text-chart-4 hover:bg-chart-4/30">BUY</Badge>
    ) : (
      <Badge className="bg-chart-5/20 text-chart-5 hover:bg-chart-5/30">SELL</Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trade Execution Logging</h1>
          <p className="text-muted-foreground mt-1">
            Umfassende Handelsausführung, Überwachung und Analyse für dezentrales Trading
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-border bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
          <Button variant="outline" className="border-border bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Trade Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium text-muted-foreground">Gesamt Trades</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">{tradeStats.totalTrades.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">+12% vs. letzte Woche</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-chart-4" />
              <div className="text-sm font-medium text-muted-foreground">Erfolgsrate</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">{tradeStats.successRate}%</div>
            <div className="text-xs text-muted-foreground">+2.1% vs. letzte Woche</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-accent" />
              <div className="text-sm font-medium text-muted-foreground">Handelsvolumen</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              ${(tradeStats.totalVolume / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground">+8.5% vs. letzte Woche</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-accent" />
              <div className="text-sm font-medium text-muted-foreground">Ø Ausführungszeit</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">{tradeStats.avgExecutionTime}s</div>
            <div className="text-xs text-muted-foreground">-0.3s vs. letzte Woche</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Time Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Execution Performance</CardTitle>
            <CardDescription>Durchschnittliche Ausführungszeit über 24 Stunden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={executionTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value}s`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: any, name: string) => [
                      name === "avgTime" ? `${value}s` : value,
                      name === "avgTime" ? "Ø Ausführungszeit" : "Trades",
                    ]}
                  />
                  <Line type="monotone" dataKey="avgTime" stroke="hsl(var(--accent))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Volume Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Trading Volume</CardTitle>
            <CardDescription>Handelsvolumen der letzten 7 Tage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: any, name: string) => [
                      name === "volume" ? `$${value.toLocaleString()}` : value,
                      name === "volume" ? "Volumen" : "Trades",
                    ]}
                  />
                  <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trade Execution Logs */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Trade Execution Logs</CardTitle>
              <CardDescription>Detaillierte Aufzeichnung aller Handelsausführungen</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Suche nach Trades..." className="pl-8 w-64 bg-background border-border" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  <SelectItem value="executed">Executed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="border-border bg-transparent">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="recent">Recent Trades</TabsTrigger>
              <TabsTrigger value="executed">Executed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4 mt-6">
              <div className="space-y-3">
                {tradeExecutions.map((trade) => (
                  <Card key={trade.id} className="bg-muted/30 border-border">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        {/* Trade Info */}
                        <div className="lg:col-span-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(trade.type)}
                              {getStatusIcon(trade.status)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-foreground">{trade.pair}</span>
                                {getTypeBadge(trade.type)}
                              </div>
                              <div className="text-sm text-muted-foreground">{trade.trader}</div>
                            </div>
                          </div>
                        </div>

                        {/* Amount & Price */}
                        <div className="lg:col-span-2">
                          <div className="text-sm">
                            <div className="font-medium text-foreground">
                              {trade.amount.toLocaleString()} {trade.pair.split("/")[0]}
                            </div>
                            <div className="text-muted-foreground">@ ${trade.price.toLocaleString()}</div>
                          </div>
                        </div>

                        {/* Value */}
                        <div className="lg:col-span-2">
                          <div className="text-lg font-semibold text-foreground">${trade.value.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            Fee: ${trade.fee.toFixed(2)} • Slippage: {trade.slippage}%
                          </div>
                        </div>

                        {/* Status & Network */}
                        <div className="lg:col-span-2">
                          <div className="space-y-1">
                            {getStatusBadge(trade.status)}
                            <div>
                              <Badge variant="outline">{trade.network}</Badge>
                            </div>
                          </div>
                        </div>

                        {/* Execution Details */}
                        <div className="lg:col-span-2">
                          <div className="text-sm">
                            {trade.status === "Executed" && (
                              <>
                                <div className="text-foreground">Exec: {trade.executionTime}s</div>
                                <div className="text-muted-foreground">Gas: {(trade.gasUsed / 1000).toFixed(0)}k</div>
                              </>
                            )}
                            {trade.status === "Failed" && <div className="text-chart-5">{trade.failureReason}</div>}
                            {trade.status === "Pending" && <div className="text-accent">Waiting for execution...</div>}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground">Pool:</span>
                            <span className="ml-2 text-foreground">{trade.pool}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Strategy:</span>
                            <span className="ml-2 text-foreground">{trade.strategy}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Followers:</span>
                            <span className="ml-2 text-foreground">{trade.followers}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Time:</span>
                            <span className="ml-2 text-foreground">
                              {new Date(trade.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <Hash className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-mono text-muted-foreground">
                            {trade.txHash.slice(0, 20)}...{trade.txHash.slice(-10)}
                          </span>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="executed">
              <div className="text-center py-8 text-muted-foreground">Ausgeführte Trades werden hier angezeigt...</div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="text-center py-8 text-muted-foreground">Ausstehende Trades werden hier angezeigt...</div>
            </TabsContent>

            <TabsContent value="failed">
              <div className="text-center py-8 text-muted-foreground">
                Fehlgeschlagene Trades werden hier angezeigt...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Execution Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-chart-4" />
                  <span className="text-sm text-foreground">Executed</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{tradeStats.executedTrades}</div>
                  <div className="text-xs text-muted-foreground">
                    {((tradeStats.executedTrades / tradeStats.totalTrades) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-accent" />
                  <span className="text-sm text-foreground">Pending</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{tradeStats.pendingTrades}</div>
                  <div className="text-xs text-muted-foreground">
                    {((tradeStats.pendingTrades / tradeStats.totalTrades) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-chart-5" />
                  <span className="text-sm text-foreground">Failed</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-foreground">{tradeStats.failedTrades}</div>
                  <div className="text-xs text-muted-foreground">
                    {((tradeStats.failedTrades / tradeStats.totalTrades) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Top Trading Pairs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">ETH/USDC</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">$2.4M</div>
                  <div className="text-xs text-muted-foreground">156 trades</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">BTC/USDT</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">$1.8M</div>
                  <div className="text-xs text-muted-foreground">89 trades</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">MATIC/USDC</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">$1.2M</div>
                  <div className="text-xs text-muted-foreground">234 trades</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Network Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Ethereum</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">2.3s avg</div>
                  <div className="text-xs text-muted-foreground">89% success</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Polygon</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">1.8s avg</div>
                  <div className="text-xs text-muted-foreground">94% success</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Arbitrum</span>
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">1.2s avg</div>
                  <div className="text-xs text-muted-foreground">96% success</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
