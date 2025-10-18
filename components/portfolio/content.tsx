"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Wallet, DollarSign, Target, AlertTriangle, Zap, Globe, RefreshCw } from "lucide-react"

const portfolioData = [
  { date: "Jan", value: 45000, pnl: 2500 },
  { date: "Feb", value: 52000, pnl: 7000 },
  { date: "Mar", value: 48000, pnl: 3000 },
  { date: "Apr", value: 61000, pnl: 16000 },
  { date: "May", value: 58000, pnl: 13000 },
  { date: "Jun", value: 67000, pnl: 22000 },
]

const assetAllocation = [
  { name: "BTC", value: 35, amount: 23450, color: "#F7931A" },
  { name: "ETH", value: 28, amount: 18760, color: "#627EEA" },
  { name: "USDC", value: 15, amount: 10050, color: "#2775CA" },
  { name: "SOL", value: 12, amount: 8040, color: "#9945FF" },
  { name: "MATIC", value: 6, amount: 4020, color: "#8247E5" },
  { name: "Others", value: 4, amount: 2680, color: "#64748B" },
]

const topPositions = [
  { symbol: "BTC/USDT", amount: "1.2456", value: "$67,890", pnl: "+12.5%", pnlValue: "+$7,543", status: "profit" },
  { symbol: "ETH/USDT", amount: "8.7432", value: "$18,760", pnl: "+8.3%", pnlValue: "+$1,442", status: "profit" },
  { symbol: "SOL/USDT", amount: "45.123", value: "$8,040", pnl: "-2.1%", pnlValue: "-$172", status: "loss" },
  { symbol: "MATIC/USDT", amount: "1,234.56", value: "$4,020", pnl: "+15.7%", pnlValue: "+$547", status: "profit" },
]

const riskMetrics = [
  { metric: "Portfolio Beta", value: "1.23", status: "medium" },
  { metric: "Sharpe Ratio", value: "2.45", status: "good" },
  { metric: "Max Drawdown", value: "-8.5%", status: "good" },
  { metric: "Volatility", value: "18.2%", status: "medium" },
]

const recentTransactions = [
  { type: "Buy", asset: "BTC", amount: "0.1234", value: "$6,789", time: "2 min ago", status: "completed" },
  { type: "Sell", asset: "ETH", amount: "2.456", value: "$5,432", time: "15 min ago", status: "completed" },
  { type: "Buy", asset: "SOL", amount: "12.34", value: "$1,234", time: "1 hour ago", status: "pending" },
  { type: "Sell", asset: "MATIC", amount: "456.78", value: "$567", time: "2 hours ago", status: "completed" },
]

export function PortfolioContent() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M")
  const [walletConnected, setWalletConnected] = useState(false)

  const connectWallet = () => {
    setWalletConnected(true)
    console.log("[v0] Wallet connection initiated")
  }

  const disconnectWallet = () => {
    setWalletConnected(false)
    console.log("[v0] Wallet disconnected")
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header with Wallet Connection */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Portfolio Tracking</h2>
          <p className="text-muted-foreground">Comprehensive portfolio analytics and performance tracking</p>
        </div>
        <div className="flex items-center gap-4">
          {walletConnected ? (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-trading-success/10 text-trading-success border-trading-success">
                <Wallet className="h-3 w-3 mr-1" />
                Connected: 0x1234...5678
              </Badge>
              <Button variant="outline" size="sm" onClick={disconnectWallet}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={connectWallet} className="bg-trading-primary hover:bg-trading-primary/90">
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-trading-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$67,000</div>
            <div className="flex items-center text-xs text-trading-success">
              <TrendingUp className="h-3 w-3 mr-1" />
              +22.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total P&L</CardTitle>
            <Target className="h-4 w-4 text-trading-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-trading-success">+$22,000</div>
            <div className="flex items-center text-xs text-trading-success">
              <TrendingUp className="h-3 w-3 mr-1" />
              +48.9% total return
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Positions</CardTitle>
            <Zap className="h-4 w-4 text-trading-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Globe className="h-3 w-3 mr-1" />
              Across 4 networks
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Risk Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-trading-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-trading-warning">Medium</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Progress value={65} className="w-16 h-1 mr-2" />
              65/100
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Portfolio Performance Chart */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Portfolio Performance</CardTitle>
                <CardDescription>Portfolio value and P&L over time</CardDescription>
              </div>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1D">1D</SelectItem>
                  <SelectItem value="1W">1W</SelectItem>
                  <SelectItem value="1M">1M</SelectItem>
                  <SelectItem value="3M">3M</SelectItem>
                  <SelectItem value="1Y">1Y</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={portfolioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#F59E0B" fill="url(#portfolioGradient)" strokeWidth={2} />
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Asset Allocation</CardTitle>
            <CardDescription>Current portfolio distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {assetAllocation.map((asset) => (
                <div key={asset.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }} />
                    <span className="text-foreground">{asset.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-foreground font-medium">{asset.value}%</div>
                    <div className="text-muted-foreground text-xs">${asset.amount.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="positions" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="positions">Top Positions</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Top Positions</CardTitle>
              <CardDescription>Your largest portfolio positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPositions.map((position, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-trading-primary/10 flex items-center justify-center">
                        <span className="text-trading-primary font-semibold text-sm">
                          {position.symbol.split("/")[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{position.symbol}</div>
                        <div className="text-sm text-muted-foreground">{position.amount} tokens</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-foreground">{position.value}</div>
                      <div
                        className={`text-sm ${position.status === "profit" ? "text-trading-success" : "text-trading-danger"}`}
                      >
                        {position.pnl} ({position.pnlValue})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Transactions</CardTitle>
              <CardDescription>Latest portfolio transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={tx.type === "Buy" ? "default" : "secondary"}
                        className={
                          tx.type === "Buy"
                            ? "bg-trading-success/10 text-trading-success"
                            : "bg-trading-danger/10 text-trading-danger"
                        }
                      >
                        {tx.type}
                      </Badge>
                      <div>
                        <div className="font-medium text-foreground">{tx.asset}</div>
                        <div className="text-sm text-muted-foreground">{tx.amount} tokens</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-foreground">{tx.value}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge
                          variant="outline"
                          className={`text-xs ${tx.status === "completed" ? "text-trading-success border-trading-success" : "text-trading-warning border-trading-warning"}`}
                        >
                          {tx.status}
                        </Badge>
                        {tx.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Risk Analysis</CardTitle>
              <CardDescription>Portfolio risk metrics and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {riskMetrics.map((metric, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{metric.metric}</span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          metric.status === "good"
                            ? "text-trading-success border-trading-success"
                            : metric.status === "medium"
                              ? "text-trading-warning border-trading-warning"
                              : "text-trading-danger border-trading-danger"
                        }`}
                      >
                        {metric.status}
                      </Badge>
                    </div>
                    <div className="text-xl font-bold text-foreground">{metric.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
