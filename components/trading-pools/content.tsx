"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Wallet,
  BarChart3,
  Settings,
  Plus,
  Eye,
} from "lucide-react"

// Mock data for trading pools
const tradingPools = [
  {
    id: "pool-001",
    name: "DeFi Alpha Strategy",
    trader: "0x742d...4e8f",
    totalValue: 2450000,
    followers: 1247,
    performance: 24.5,
    risk: "Medium",
    status: "Active",
    aum: 2450000,
    fee: 2.5,
    minInvestment: 1000,
    maxDrawdown: -8.2,
    sharpeRatio: 1.85,
    trades: 156,
    winRate: 68.5,
  },
  {
    id: "pool-002",
    name: "Arbitrage Master",
    trader: "0x8a3b...9c2d",
    totalValue: 1850000,
    followers: 892,
    performance: 18.7,
    risk: "Low",
    status: "Active",
    aum: 1850000,
    fee: 1.8,
    minInvestment: 500,
    maxDrawdown: -4.1,
    sharpeRatio: 2.12,
    trades: 324,
    winRate: 74.2,
  },
  {
    id: "pool-003",
    name: "High Frequency Bot",
    trader: "0x1f5e...7a9b",
    totalValue: 980000,
    followers: 456,
    performance: -3.2,
    risk: "High",
    status: "Paused",
    aum: 980000,
    fee: 3.0,
    minInvestment: 2000,
    maxDrawdown: -15.8,
    sharpeRatio: 0.92,
    trades: 1247,
    winRate: 52.3,
  },
]

const poolStats = {
  totalPools: 24,
  activePools: 18,
  totalAUM: 12500000,
  avgPerformance: 16.8,
  totalFollowers: 5847,
}

export default function TradingPoolsContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trading Pools</h1>
          <p className="text-muted-foreground mt-1">
            Verwalten und analysieren Sie Handelspools für dezentrales Copy-Trading
          </p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Neuen Pool erstellen
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-accent" />
              <div className="text-sm font-medium text-muted-foreground">Gesamt Pools</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">{poolStats.totalPools}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium text-muted-foreground">Aktive Pools</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">{poolStats.activePools}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-accent" />
              <div className="text-sm font-medium text-muted-foreground">Gesamt AUM</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">${(poolStats.totalAUM / 1000000).toFixed(1)}M</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-chart-4" />
              <div className="text-sm font-medium text-muted-foreground">Ø Performance</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">+{poolStats.avgPerformance}%</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium text-muted-foreground">Follower</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">{poolStats.totalFollowers.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Pools Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Aktive Trading Pools</CardTitle>
          <CardDescription>Übersicht aller verfügbaren Trading Pools mit Performance-Metriken</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="all">Alle Pools</TabsTrigger>
              <TabsTrigger value="active">Aktiv</TabsTrigger>
              <TabsTrigger value="paused">Pausiert</TabsTrigger>
              <TabsTrigger value="top">Top Performer</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              <div className="space-y-4">
                {tradingPools.map((pool) => (
                  <Card key={pool.id} className="bg-muted/50 border-border">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Pool Info */}
                        <div className="lg:col-span-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                              <Wallet className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">{pool.name}</h3>
                              <p className="text-sm text-muted-foreground">{pool.trader}</p>
                            </div>
                          </div>
                        </div>

                        {/* Performance */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center space-x-2">
                            {pool.performance > 0 ? (
                              <TrendingUp className="h-4 w-4 text-chart-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-chart-5" />
                            )}
                            <span className={`font-semibold ${pool.performance > 0 ? "text-chart-4" : "text-chart-5"}`}>
                              {pool.performance > 0 ? "+" : ""}
                              {pool.performance}%
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">30d Performance</p>
                        </div>

                        {/* AUM */}
                        <div className="lg:col-span-2">
                          <div className="text-lg font-semibold text-foreground">
                            ${(pool.aum / 1000000).toFixed(2)}M
                          </div>
                          <p className="text-sm text-muted-foreground">Assets Under Management</p>
                        </div>

                        {/* Followers */}
                        <div className="lg:col-span-1">
                          <div className="text-lg font-semibold text-foreground">{pool.followers.toLocaleString()}</div>
                          <p className="text-sm text-muted-foreground">Follower</p>
                        </div>

                        {/* Risk & Status */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge
                              variant={
                                pool.risk === "Low" ? "default" : pool.risk === "Medium" ? "secondary" : "destructive"
                              }
                            >
                              {pool.risk} Risk
                            </Badge>
                            <Badge variant={pool.status === "Active" ? "default" : "secondary"}>{pool.status}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">Win Rate: {pool.winRate}%</div>
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="border-border bg-transparent">
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            <Button size="sm" variant="outline" className="border-border bg-transparent">
                              <Settings className="h-4 w-4 mr-1" />
                              Verwalten
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Additional Metrics */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Gebühr:</span>
                            <span className="ml-2 text-foreground font-medium">{pool.fee}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Min. Investment:</span>
                            <span className="ml-2 text-foreground font-medium">${pool.minInvestment}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Max Drawdown:</span>
                            <span className="ml-2 text-chart-5 font-medium">{pool.maxDrawdown}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Sharpe Ratio:</span>
                            <span className="ml-2 text-foreground font-medium">{pool.sharpeRatio}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="text-center py-8 text-muted-foreground">Aktive Pools werden hier angezeigt...</div>
            </TabsContent>

            <TabsContent value="paused">
              <div className="text-center py-8 text-muted-foreground">Pausierte Pools werden hier angezeigt...</div>
            </TabsContent>

            <TabsContent value="top">
              <div className="text-center py-8 text-muted-foreground">Top Performer werden hier angezeigt...</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
