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
  Loader2,
} from "lucide-react"
import { useTradingPools } from "@/lib/api/hooks"
import { useState } from "react"

export default function TradingPoolsContent() {
  const [activeTab, setActiveTab] = useState("all")
  const { data: poolsData, error, isLoading } = useTradingPools()

  const tradingPools = poolsData?.pools || []
  const poolStats = poolsData?.stats || {
    totalPools: 0,
    activePools: 0,
    totalAUM: 0,
    avgPerformance: 0,
    totalFollowers: 0,
  }

  const filteredPools = tradingPools.filter((pool: any) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return pool.status === "Active"
    if (activeTab === "paused") return pool.status === "Paused"
    if (activeTab === "top") return pool.performance > 20
    return true
  })

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="all">Alle Pools</TabsTrigger>
              <TabsTrigger value="active">Aktiv</TabsTrigger>
              <TabsTrigger value="paused">Pausiert</TabsTrigger>
              <TabsTrigger value="top">Top Performer</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-6">
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  <span className="ml-2 text-muted-foreground">Lade Trading Pools...</span>
                </div>
              )}

              {error && (
                <div className="text-center py-8 text-destructive">
                  Fehler beim Laden der Trading Pools. Bitte versuchen Sie es später erneut.
                </div>
              )}

              {!isLoading && !error && filteredPools.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Keine Trading Pools gefunden für diesen Filter.
                </div>
              )}

              {!isLoading && !error && filteredPools.length > 0 && (
                <div className="space-y-4">
                  {filteredPools.map((pool: any) => (
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
                                <p className="text-sm text-muted-foreground">{pool.trader_address}</p>
                              </div>
                            </div>
                          </div>

                          {/* Performance */}
                          <div className="lg:col-span-2">
                            <div className="flex items-center space-x-2">
                              {pool.performance_30d > 0 ? (
                                <TrendingUp className="h-4 w-4 text-chart-4" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-chart-5" />
                              )}
                              <span
                                className={`font-semibold ${pool.performance_30d > 0 ? "text-chart-4" : "text-chart-5"}`}
                              >
                                {pool.performance_30d > 0 ? "+" : ""}
                                {pool.performance_30d}%
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">30d Performance</p>
                          </div>

                          {/* AUM */}
                          <div className="lg:col-span-2">
                            <div className="text-lg font-semibold text-foreground">
                              ${(pool.total_aum / 1000000).toFixed(2)}M
                            </div>
                            <p className="text-sm text-muted-foreground">Assets Under Management</p>
                          </div>

                          {/* Followers */}
                          <div className="lg:col-span-1">
                            <div className="text-lg font-semibold text-foreground">
                              {pool.follower_count.toLocaleString()}
                            </div>
                            <p className="text-sm text-muted-foreground">Follower</p>
                          </div>

                          {/* Risk & Status */}
                          <div className="lg:col-span-2">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge
                                variant={
                                  pool.risk_level === "Low"
                                    ? "default"
                                    : pool.risk_level === "Medium"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {pool.risk_level} Risk
                              </Badge>
                              <Badge variant={pool.status === "Active" ? "default" : "secondary"}>{pool.status}</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">Win Rate: {pool.win_rate}%</div>
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
                              <span className="ml-2 text-foreground font-medium">{pool.management_fee}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Min. Investment:</span>
                              <span className="ml-2 text-foreground font-medium">${pool.min_investment}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Max Drawdown:</span>
                              <span className="ml-2 text-chart-5 font-medium">{pool.max_drawdown}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Sharpe Ratio:</span>
                              <span className="ml-2 text-foreground font-medium">{pool.sharpe_ratio}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
