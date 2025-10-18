"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Users, DollarSign, Target, Filter } from "lucide-react"

// Mock performance data
const performanceData = [
  { date: "2024-01", value: 100000, pnl: 0, trades: 45, winRate: 65.5 },
  { date: "2024-02", value: 108500, pnl: 8500, trades: 52, winRate: 67.3 },
  { date: "2024-03", value: 112300, pnl: 12300, trades: 48, winRate: 70.8 },
  { date: "2024-04", value: 105800, pnl: 5800, trades: 41, winRate: 63.4 },
  { date: "2024-05", value: 118900, pnl: 18900, trades: 55, winRate: 72.7 },
  { date: "2024-06", value: 124500, pnl: 24500, trades: 49, winRate: 75.5 },
  { date: "2024-07", value: 131200, pnl: 31200, trades: 58, winRate: 74.1 },
  { date: "2024-08", value: 128700, pnl: 28700, trades: 46, winRate: 69.6 },
  { date: "2024-09", value: 135400, pnl: 35400, trades: 53, winRate: 77.4 },
  { date: "2024-10", value: 142800, pnl: 42800, trades: 61, winRate: 78.7 },
  { date: "2024-11", value: 138900, pnl: 38900, trades: 44, winRate: 72.7 },
  { date: "2024-12", value: 145600, pnl: 45600, trades: 57, winRate: 80.7 },
]

const topTraders = [
  {
    id: "trader-001",
    name: "CryptoMaster",
    address: "0x742d...4e8f",
    performance: 45.6,
    followers: 1247,
    aum: 2450000,
    winRate: 78.5,
    trades: 156,
    sharpeRatio: 2.15,
    maxDrawdown: -8.2,
    rank: 1,
  },
  {
    id: "trader-002",
    name: "DeFiWizard",
    address: "0x8a3b...9c2d",
    performance: 38.7,
    followers: 892,
    aum: 1850000,
    winRate: 74.2,
    trades: 324,
    sharpeRatio: 1.98,
    maxDrawdown: -12.1,
    rank: 2,
  },
  {
    id: "trader-003",
    name: "ArbitrageBot",
    address: "0x1f5e...7a9b",
    performance: 32.1,
    followers: 456,
    aum: 980000,
    winRate: 82.3,
    trades: 1247,
    sharpeRatio: 1.76,
    maxDrawdown: -6.8,
    rank: 3,
  },
  {
    id: "trader-004",
    name: "YieldHunter",
    address: "0x9c4f...2a1b",
    performance: 28.9,
    followers: 634,
    aum: 1320000,
    winRate: 71.4,
    trades: 89,
    sharpeRatio: 1.54,
    maxDrawdown: -15.3,
    rank: 4,
  },
  {
    id: "trader-005",
    name: "SwingTrader",
    address: "0x3e7a...8d5c",
    performance: 25.3,
    followers: 723,
    aum: 1150000,
    winRate: 68.9,
    trades: 203,
    sharpeRatio: 1.42,
    maxDrawdown: -11.7,
    rank: 5,
  },
]

const assetAllocation = [
  { name: "BTC", value: 35, color: "#F7931A" },
  { name: "ETH", value: 28, color: "#627EEA" },
  { name: "DeFi", value: 20, color: "#2DD4BF" },
  { name: "Altcoins", value: 12, color: "#8B5CF6" },
  { name: "Stablecoins", value: 5, color: "#10B981" },
]

const riskMetrics = {
  volatility: 18.5,
  beta: 1.23,
  alpha: 12.4,
  informationRatio: 0.87,
  calmarRatio: 2.34,
  sortinoRatio: 1.98,
}

export default function PerformanceContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Umfassende Leistungsanalyse für Copy-Trader und Handelsstrategien
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-32 bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Tage</SelectItem>
              <SelectItem value="30d">30 Tage</SelectItem>
              <SelectItem value="90d">90 Tage</SelectItem>
              <SelectItem value="1y">1 Jahr</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-border bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gesamt Performance</p>
                <p className="text-2xl font-bold text-chart-4">+45.6%</p>
                <p className="text-xs text-muted-foreground">vs. letzter Monat +3.2%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktive Trader</p>
                <p className="text-2xl font-bold text-foreground">247</p>
                <p className="text-xs text-muted-foreground">+12 neue diese Woche</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gesamt AUM</p>
                <p className="text-2xl font-bold text-foreground">$24.8M</p>
                <p className="text-xs text-muted-foreground">+8.5% diesen Monat</p>
              </div>
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ø Win Rate</p>
                <p className="text-2xl font-bold text-foreground">74.2%</p>
                <p className="text-xs text-muted-foreground">Über alle Trader</p>
              </div>
              <Target className="h-8 w-8 text-chart-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Portfolio Performance</CardTitle>
            <CardDescription>Entwicklung des Gesamtportfolios über die Zeit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: any) => [`$${value.toLocaleString()}`, "Portfolio Wert"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Asset Allocation</CardTitle>
            <CardDescription>Verteilung der verwalteten Assets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: any) => [`${value}%`, "Anteil"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {assetAllocation.map((asset, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }} />
                    <span className="text-sm text-foreground">{asset.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{asset.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Traders Leaderboard */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Top Trader Leaderboard</CardTitle>
          <CardDescription>
            Die besten Copy-Trader basierend auf Performance und Risiko-adjustierten Metriken
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topTraders.map((trader) => (
              <Card key={trader.id} className="bg-muted/50 border-border">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Rank & Trader Info */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-accent/20 rounded-full">
                          <span className="text-sm font-bold text-accent">#{trader.rank}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{trader.name}</h3>
                          <p className="text-sm text-muted-foreground">{trader.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Performance */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-chart-4" />
                        <span className="font-semibold text-chart-4">+{trader.performance}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">YTD Performance</p>
                    </div>

                    {/* AUM */}
                    <div className="lg:col-span-2">
                      <div className="text-lg font-semibold text-foreground">${(trader.aum / 1000000).toFixed(2)}M</div>
                      <p className="text-sm text-muted-foreground">AUM</p>
                    </div>

                    {/* Followers */}
                    <div className="lg:col-span-1">
                      <div className="text-lg font-semibold text-foreground">{trader.followers.toLocaleString()}</div>
                      <p className="text-sm text-muted-foreground">Follower</p>
                    </div>

                    {/* Metrics */}
                    <div className="lg:col-span-2">
                      <div className="text-sm space-y-1">
                        <div>
                          Win Rate: <span className="font-medium text-foreground">{trader.winRate}%</span>
                        </div>
                        <div>
                          Sharpe: <span className="font-medium text-foreground">{trader.sharpeRatio}</span>
                        </div>
                      </div>
                    </div>

                    {/* Risk */}
                    <div className="lg:col-span-2">
                      <div className="text-sm space-y-1">
                        <div>
                          Max DD: <span className="font-medium text-chart-5">{trader.maxDrawdown}%</span>
                        </div>
                        <div>
                          Trades: <span className="font-medium text-foreground">{trader.trades}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Risk Metrics</CardTitle>
            <CardDescription>Risiko-adjustierte Performance-Kennzahlen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Volatilität</span>
                  <span className="text-sm font-medium text-foreground">{riskMetrics.volatility}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Beta</span>
                  <span className="text-sm font-medium text-foreground">{riskMetrics.beta}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Alpha</span>
                  <span className="text-sm font-medium text-chart-4">{riskMetrics.alpha}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Info Ratio</span>
                  <span className="text-sm font-medium text-foreground">{riskMetrics.informationRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Calmar Ratio</span>
                  <span className="text-sm font-medium text-foreground">{riskMetrics.calmarRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sortino Ratio</span>
                  <span className="text-sm font-medium text-foreground">{riskMetrics.sortinoRatio}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Trading Activity</CardTitle>
            <CardDescription>Handelsaktivität über die letzten 12 Monate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: any) => [value, "Trades"]}
                  />
                  <Bar dataKey="trades" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
