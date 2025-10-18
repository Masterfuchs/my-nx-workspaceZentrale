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
import { TrendingUp, Users, DollarSign, Target, Filter, Loader2 } from "lucide-react"
import { usePerformanceData, useLeaderboard, useMarketData } from "@/lib/api/hooks"
import { useState } from "react"

export default function PerformanceContent() {
  const [timeframe, setTimeframe] = useState("30d")
  const { data: performanceData, isLoading: perfLoading } = usePerformanceData(timeframe)
  const { data: leaderboardData, isLoading: leaderLoading } = useLeaderboard(5)
  const { data: marketData, isLoading: marketLoading } = useMarketData()

  const chartData = performanceData?.chartData || []
  const metrics = performanceData?.metrics || {
    totalPerformance: 0,
    activeTraders: 0,
    totalAUM: 0,
    avgWinRate: 0,
  }
  const topTraders = leaderboardData?.traders || []
  const assetAllocation = marketData?.assetAllocation || []
  const riskMetrics = performanceData?.riskMetrics || {
    volatility: 0,
    beta: 0,
    alpha: 0,
    informationRatio: 0,
    calmarRatio: 0,
    sortinoRatio: 0,
  }

  const isLoading = perfLoading || leaderLoading || marketLoading

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
          <Select value={timeframe} onValueChange={setTimeframe}>
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

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <span className="ml-2 text-muted-foreground">Lade Performance-Daten...</span>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Key Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Gesamt Performance</p>
                    <p className="text-2xl font-bold text-chart-4">+{metrics.totalPerformance}%</p>
                    <p className="text-xs text-muted-foreground">vs. letzter Monat</p>
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
                    <p className="text-2xl font-bold text-foreground">{metrics.activeTraders}</p>
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
                    <p className="text-2xl font-bold text-foreground">${(metrics.totalAUM / 1000000).toFixed(1)}M</p>
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
                    <p className="text-2xl font-bold text-foreground">{metrics.avgWinRate}%</p>
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
                    <AreaChart data={chartData}>
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
                        {assetAllocation.map((entry: any, index: number) => (
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
                  {assetAllocation.map((asset: any, index: number) => (
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
                {topTraders.map((trader: any) => (
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
                          <div className="text-lg font-semibold text-foreground">
                            ${(trader.aum / 1000000).toFixed(2)}M
                          </div>
                          <p className="text-sm text-muted-foreground">AUM</p>
                        </div>

                        {/* Followers */}
                        <div className="lg:col-span-1">
                          <div className="text-lg font-semibold text-foreground">
                            {trader.followers.toLocaleString()}
                          </div>
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
                    <BarChart data={chartData}>
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
        </>
      )}
    </div>
  )
}
