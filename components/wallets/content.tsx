"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Line,
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
import {
  Wallet,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Plus,
  Eye,
  Settings,
  Copy,
  Wifi,
  WifiOff,
  DollarSign,
  Shield,
} from "lucide-react"

// Mock wallet data
const connectedWallets = [
  {
    id: "wallet-001",
    address: "0x742d35Cc6C4C4e8f9B8B8B8B8B8B8B8B8B8B4e8f",
    type: "MetaMask",
    network: "Ethereum",
    status: "Connected",
    balance: 12.5847,
    balanceUSD: 31250.75,
    lastActivity: "2024-12-28T10:30:00Z",
    connectionTime: "2024-12-28T08:15:00Z",
    transactions: 247,
    gasSpent: 0.8945,
    riskScore: 85,
    isTrading: true,
    pools: ["DeFi Alpha Strategy", "Arbitrage Master"],
  },
  {
    id: "wallet-002",
    address: "0x8a3b9c2d1e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t",
    type: "WalletConnect",
    network: "Polygon",
    status: "Connected",
    balance: 8945.32,
    balanceUSD: 8945.32,
    lastActivity: "2024-12-28T10:25:00Z",
    connectionTime: "2024-12-28T09:20:00Z",
    transactions: 156,
    gasSpent: 12.45,
    riskScore: 92,
    isTrading: true,
    pools: ["High Frequency Bot"],
  },
  {
    id: "wallet-003",
    address: "0x1f5e7a9b3c6d8e2f4g7h9i1j3k5l7m9n1o3p5q7r",
    type: "Coinbase Wallet",
    network: "Arbitrum",
    status: "Disconnected",
    balance: 2.1234,
    balanceUSD: 5308.5,
    lastActivity: "2024-12-27T16:45:00Z",
    connectionTime: "2024-12-27T14:30:00Z",
    transactions: 89,
    gasSpent: 0.0234,
    riskScore: 78,
    isTrading: false,
    pools: [],
  },
  {
    id: "wallet-004",
    address: "0x9c4f2a1b5d8e3f6g9h2i5j8k1l4m7n0o3p6q9r2s",
    type: "Ledger",
    network: "Ethereum",
    status: "Connected",
    balance: 45.8923,
    balanceUSD: 114730.75,
    lastActivity: "2024-12-28T09:15:00Z",
    connectionTime: "2024-12-28T07:00:00Z",
    transactions: 423,
    gasSpent: 2.1567,
    riskScore: 95,
    isTrading: true,
    pools: ["DeFi Alpha Strategy", "Yield Hunter"],
  },
  {
    id: "wallet-005",
    address: "0x3e7a8d5c1f4g7h0i3j6k9l2m5n8o1p4q7r0s3t6u",
    type: "Trust Wallet",
    network: "BSC",
    status: "Error",
    balance: 156.78,
    balanceUSD: 156.78,
    lastActivity: "2024-12-28T08:30:00Z",
    connectionTime: "2024-12-28T08:00:00Z",
    transactions: 67,
    gasSpent: 0.45,
    riskScore: 65,
    isTrading: false,
    pools: [],
  },
]

const walletStats = {
  totalWallets: 24,
  connectedWallets: 18,
  activeTrading: 15,
  totalBalance: 2450000,
  avgRiskScore: 83,
}

const connectionHistory = [
  { time: "00:00", connected: 12, active: 8, errors: 1 },
  { time: "04:00", connected: 15, active: 10, errors: 0 },
  { time: "08:00", connected: 18, active: 14, errors: 2 },
  { time: "12:00", connected: 22, active: 18, errors: 1 },
  { time: "16:00", connected: 20, active: 16, errors: 3 },
  { time: "20:00", connected: 18, active: 15, errors: 1 },
]

const walletTypes = [
  { name: "MetaMask", value: 45, color: "#F6851B" },
  { name: "WalletConnect", value: 25, color: "#3B99FC" },
  { name: "Coinbase", value: 15, color: "#0052FF" },
  { name: "Ledger", value: 10, color: "#000000" },
  { name: "Others", value: 5, color: "#8B5CF6" },
]

const networkDistribution = [
  { name: "Ethereum", value: 40, color: "#627EEA" },
  { name: "Polygon", value: 30, color: "#8247E5" },
  { name: "Arbitrum", value: 15, color: "#28A0F0" },
  { name: "BSC", value: 10, color: "#F3BA2F" },
  { name: "Others", value: 5, color: "#10B981" },
]

export default function WalletsContent() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Connected":
        return <CheckCircle className="h-4 w-4 text-chart-4" />
      case "Disconnected":
        return <XCircle className="h-4 w-4 text-muted-foreground" />
      case "Error":
        return <AlertTriangle className="h-4 w-4 text-chart-5" />
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Connected":
        return <Badge className="bg-chart-4/20 text-chart-4 hover:bg-chart-4/30">Connected</Badge>
      case "Disconnected":
        return <Badge variant="secondary">Disconnected</Badge>
      case "Error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wallet Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Überwachen Sie verbundene Wallets, Verbindungsstatus und Wallet-Analytics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-border bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-2" />
            Wallet verbinden
          </Button>
        </div>
      </div>

      {/* Wallet Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wallet className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium text-muted-foreground">Gesamt Wallets</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">{walletStats.totalWallets}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Wifi className="h-4 w-4 text-chart-4" />
              <div className="text-sm font-medium text-muted-foreground">Verbunden</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">{walletStats.connectedWallets}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-accent" />
              <div className="text-sm font-medium text-muted-foreground">Aktiv Trading</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">{walletStats.activeTrading}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-accent" />
              <div className="text-sm font-medium text-muted-foreground">Gesamt Balance</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">
              ${(walletStats.totalBalance / 1000000).toFixed(1)}M
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-chart-4" />
              <div className="text-sm font-medium text-muted-foreground">Ø Risk Score</div>
            </div>
            <div className="text-2xl font-bold text-foreground mt-1">{walletStats.avgRiskScore}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Status Chart */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Connection Status</CardTitle>
            <CardDescription>Wallet-Verbindungen über die letzten 24 Stunden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={connectionHistory}>
                  <defs>
                    <linearGradient id="colorConnected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="connected"
                    stackId="1"
                    stroke="hsl(var(--chart-4))"
                    fill="url(#colorConnected)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="active"
                    stackId="2"
                    stroke="hsl(var(--accent))"
                    fill="url(#colorActive)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="errors"
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Type Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Wallet Types</CardTitle>
            <CardDescription>Verteilung der Wallet-Anbieter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={walletTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {walletTypes.map((entry, index) => (
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
              {walletTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                    <span className="text-sm text-foreground">{type.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{type.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Wallets Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Connected Wallets</CardTitle>
          <CardDescription>Übersicht aller verbundenen Wallets mit Status, Balance und Aktivität</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted">
              <TabsTrigger value="all">Alle Wallets</TabsTrigger>
              <TabsTrigger value="connected">Verbunden</TabsTrigger>
              <TabsTrigger value="trading">Trading</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-6">
              <div className="space-y-4">
                {connectedWallets.map((wallet) => (
                  <Card key={wallet.id} className="bg-muted/50 border-border">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Wallet Info */}
                        <div className="lg:col-span-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                              <Wallet className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-foreground">{wallet.type}</h3>
                                {getStatusIcon(wallet.status)}
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <p className="text-sm text-muted-foreground font-mono">
                                  {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                                </p>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status & Network */}
                        <div className="lg:col-span-2">
                          <div className="space-y-2">
                            {getStatusBadge(wallet.status)}
                            <div>
                              <Badge variant="outline">{wallet.network}</Badge>
                            </div>
                          </div>
                        </div>

                        {/* Balance */}
                        <div className="lg:col-span-2">
                          <div className="text-lg font-semibold text-foreground">
                            ${wallet.balanceUSD.toLocaleString()}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {wallet.balance.toFixed(4)}{" "}
                            {wallet.network === "Ethereum"
                              ? "ETH"
                              : wallet.network === "Polygon"
                                ? "MATIC"
                                : wallet.network === "BSC"
                                  ? "BNB"
                                  : "ETH"}
                          </p>
                        </div>

                        {/* Risk Score */}
                        <div className="lg:col-span-2">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Risk Score</span>
                              <span className="text-sm font-medium text-foreground">{wallet.riskScore}</span>
                            </div>
                            <Progress value={wallet.riskScore} className="h-2" />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-3">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" className="border-border bg-transparent">
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            <Button size="sm" variant="outline" className="border-border bg-transparent">
                              <Settings className="h-4 w-4 mr-1" />
                              Einstellungen
                            </Button>
                            {wallet.status === "Connected" && (
                              <Button size="sm" variant="outline" className="border-border bg-transparent">
                                <WifiOff className="h-4 w-4 mr-1" />
                                Trennen
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Transaktionen:</span>
                            <span className="ml-2 text-foreground font-medium">{wallet.transactions}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Gas verbraucht:</span>
                            <span className="ml-2 text-foreground font-medium">{wallet.gasSpent.toFixed(4)} ETH</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Letzte Aktivität:</span>
                            <span className="ml-2 text-foreground font-medium">
                              {new Date(wallet.lastActivity).toLocaleTimeString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Trading:</span>
                            <span className="ml-2">
                              {wallet.isTrading ? (
                                <Badge className="bg-chart-4/20 text-chart-4">Aktiv</Badge>
                              ) : (
                                <Badge variant="secondary">Inaktiv</Badge>
                              )}
                            </span>
                          </div>
                        </div>
                        {wallet.pools.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm text-muted-foreground">Aktive Pools: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {wallet.pools.map((pool, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {pool}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="connected">
              <div className="text-center py-8 text-muted-foreground">Verbundene Wallets werden hier angezeigt...</div>
            </TabsContent>

            <TabsContent value="trading">
              <div className="text-center py-8 text-muted-foreground">
                Aktive Trading Wallets werden hier angezeigt...
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="text-center py-8 text-muted-foreground">Wallet Analytics werden hier angezeigt...</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Network Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Network Distribution</CardTitle>
            <CardDescription>Verteilung der Wallets nach Blockchain-Netzwerken</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={networkDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: any) => [`${value}%`, "Anteil"]}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Connection Health</CardTitle>
            <CardDescription>Übersicht der Verbindungsqualität und -stabilität</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-chart-4" />
                  <span className="text-sm text-foreground">Stabile Verbindungen</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-foreground">18</div>
                  <div className="text-xs text-muted-foreground">75%</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-accent" />
                  <span className="text-sm text-foreground">Instabile Verbindungen</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-foreground">4</div>
                  <div className="text-xs text-muted-foreground">17%</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <XCircle className="h-4 w-4 text-chart-5" />
                  <span className="text-sm text-foreground">Fehlerhafte Verbindungen</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-foreground">2</div>
                  <div className="text-xs text-muted-foreground">8%</div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Durchschnittliche Uptime</span>
                  <span className="text-sm font-medium text-foreground">98.5%</span>
                </div>
                <Progress value={98.5} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
