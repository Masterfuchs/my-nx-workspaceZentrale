"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Shield, Settings } from "lucide-react"

const riskMetrics = [
  { name: "Portfolio Risk", current: 65, limit: 80, status: "medium" },
  { name: "Concentration Risk", current: 45, limit: 60, status: "good" },
  { name: "Liquidity Risk", current: 78, limit: 85, status: "high" },
  { name: "Volatility Risk", current: 52, limit: 70, status: "good" },
]

const riskEvents = [
  { type: "High Volatility", asset: "BTC", severity: "high", time: "2 min ago", action: "Position reduced by 15%" },
  {
    type: "Concentration Limit",
    asset: "ETH",
    severity: "medium",
    time: "15 min ago",
    action: "New positions blocked",
  },
  { type: "Drawdown Alert", asset: "SOL", severity: "high", time: "1 hour ago", action: "Stop-loss triggered" },
  { type: "Liquidity Warning", asset: "MATIC", severity: "low", time: "2 hours ago", action: "Monitoring increased" },
]

const exposureData = [
  { asset: "BTC", exposure: 35, limit: 40, value: 23450 },
  { asset: "ETH", exposure: 28, limit: 35, value: 18760 },
  { asset: "USDC", exposure: 15, limit: 20, value: 10050 },
  { asset: "SOL", exposure: 12, limit: 15, value: 8040 },
  { asset: "MATIC", exposure: 6, limit: 10, value: 4020 },
  { asset: "Others", exposure: 4, limit: 5, value: 2680 },
]

const drawdownData = [
  { date: "Jan", drawdown: -2.1 },
  { date: "Feb", drawdown: -5.3 },
  { date: "Mar", drawdown: -3.8 },
  { date: "Apr", drawdown: -1.2 },
  { date: "May", drawdown: -4.7 },
  { date: "Jun", drawdown: -2.9 },
]

export function RiskManagementContent() {
  const [stopLossEnabled, setStopLossEnabled] = useState(true)
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(true)
  const [positionSizingEnabled, setPositionSizingEnabled] = useState(true)
  const [alertsEnabled, setAlertsEnabled] = useState(true)

  const [maxDrawdown, setMaxDrawdown] = useState([15])
  const [maxPositionSize, setMaxPositionSize] = useState([25])
  const [riskPerTrade, setRiskPerTrade] = useState([2])
  const [stopLossPercent, setStopLossPercent] = useState([5])

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Risk Management</h2>
          <p className="text-muted-foreground">Advanced risk controls and monitoring for your trading portfolio</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-trading-success/10 text-trading-success border-trading-success">
            <Shield className="h-3 w-3 mr-1" />
            Risk Controls Active
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {riskMetrics.map((metric, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.name}</CardTitle>
              <Shield
                className={`h-4 w-4 ${
                  metric.status === "good"
                    ? "text-trading-success"
                    : metric.status === "medium"
                      ? "text-trading-warning"
                      : "text-trading-danger"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">{metric.current}%</span>
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
                <Progress value={(metric.current / metric.limit) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground">Limit: {metric.limit}%</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Risk Controls */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Risk Controls</CardTitle>
            <CardDescription>Configure automated risk management settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stop Loss */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="stop-loss" className="text-foreground">
                  Stop Loss
                </Label>
                <Switch id="stop-loss" checked={stopLossEnabled} onCheckedChange={setStopLossEnabled} />
              </div>
              {stopLossEnabled && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Stop Loss Percentage</Label>
                  <Slider
                    value={stopLossPercent}
                    onValueChange={setStopLossPercent}
                    max={20}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground">Current: {stopLossPercent[0]}%</div>
                </div>
              )}
            </div>

            {/* Take Profit */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="take-profit" className="text-foreground">
                  Take Profit
                </Label>
                <Switch id="take-profit" checked={takeProfitEnabled} onCheckedChange={setTakeProfitEnabled} />
              </div>
            </div>

            {/* Position Sizing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="position-sizing" className="text-foreground">
                  Position Sizing
                </Label>
                <Switch
                  id="position-sizing"
                  checked={positionSizingEnabled}
                  onCheckedChange={setPositionSizingEnabled}
                />
              </div>
              {positionSizingEnabled && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Max Position Size</Label>
                  <Slider
                    value={maxPositionSize}
                    onValueChange={setMaxPositionSize}
                    max={50}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground">Current: {maxPositionSize[0]}%</div>
                </div>
              )}
            </div>

            {/* Risk Per Trade */}
            <div className="space-y-3">
              <Label className="text-sm text-muted-foreground">Risk Per Trade</Label>
              <Slider
                value={riskPerTrade}
                onValueChange={setRiskPerTrade}
                max={10}
                min={0.5}
                step={0.1}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">Current: {riskPerTrade[0]}%</div>
            </div>

            {/* Max Drawdown */}
            <div className="space-y-3">
              <Label className="text-sm text-muted-foreground">Max Drawdown</Label>
              <Slider value={maxDrawdown} onValueChange={setMaxDrawdown} max={30} min={5} step={1} className="w-full" />
              <div className="text-xs text-muted-foreground">Current: {maxDrawdown[0]}%</div>
            </div>

            {/* Alerts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="alerts" className="text-foreground">
                  Risk Alerts
                </Label>
                <Switch id="alerts" checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exposure Analysis */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Asset Exposure Analysis</CardTitle>
            <CardDescription>Current vs maximum allowed exposure by asset</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={exposureData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="asset" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
                  }}
                />
                <Bar dataKey="exposure" fill="#F59E0B" name="Current Exposure" />
                <Bar dataKey="limit" fill="#374151" name="Exposure Limit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="events">Risk Events</TabsTrigger>
          <TabsTrigger value="drawdown">Drawdown Analysis</TabsTrigger>
          <TabsTrigger value="limits">Position Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Risk Events</CardTitle>
              <CardDescription>Latest risk management actions and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          event.severity === "high"
                            ? "bg-trading-danger"
                            : event.severity === "medium"
                              ? "bg-trading-warning"
                              : "bg-trading-success"
                        }`}
                      />
                      <div>
                        <div className="font-medium text-foreground">{event.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.asset} • {event.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          event.severity === "high"
                            ? "text-trading-danger border-trading-danger"
                            : event.severity === "medium"
                              ? "text-trading-warning border-trading-warning"
                              : "text-trading-success border-trading-success"
                        }`}
                      >
                        {event.severity}
                      </Badge>
                      <div className="text-sm text-muted-foreground mt-1">{event.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drawdown" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Drawdown Analysis</CardTitle>
              <CardDescription>Historical drawdown patterns and recovery</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={drawdownData}>
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
                  <Area
                    type="monotone"
                    dataKey="drawdown"
                    stroke="#EF4444"
                    fill="url(#drawdownGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Position Limits</CardTitle>
              <CardDescription>Current position limits and utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {exposureData.map((asset, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{asset.asset}</span>
                        <Badge variant="outline" className="text-xs">
                          ${asset.value.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {asset.exposure}% / {asset.limit}%
                      </div>
                    </div>
                    <Progress value={(asset.exposure / asset.limit) * 100} className="h-2" />
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
