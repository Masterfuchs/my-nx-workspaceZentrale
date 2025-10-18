"use client"

import { useWebSocket } from "@/hooks/use-websocket"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

export function RealTimePriceTicker() {
  const { priceData, isConnected } = useWebSocket()

  const formatPrice = (price: number, symbol: string) => {
    if (symbol.includes("USDT") || symbol.includes("USDC")) {
      return `$${price.toLocaleString()}`
    }
    return price.toFixed(6)
  }

  const formatChange = (change: number) => {
    const formatted = Math.abs(change).toFixed(2)
    return change >= 0 ? `+${formatted}%` : `-${formatted}%`
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Live Prices</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-sm text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      <div className="space-y-3">
        {Array.from(priceData.entries()).map(([symbol, data]) => (
          <div key={symbol} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <span className="font-medium">{symbol}</span>
              <Badge variant={data.change24h >= 0 ? "default" : "destructive"} className="text-xs">
                {data.change24h >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {formatChange(data.change24h)}
              </Badge>
            </div>
            <div className="text-right">
              <div className="font-semibold">{formatPrice(data.price, symbol)}</div>
              <div className="text-xs text-muted-foreground">Vol: ${(data.volume24h / 1000).toFixed(0)}K</div>
            </div>
          </div>
        ))}
      </div>

      {priceData.size === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <div className="animate-pulse">Loading price data...</div>
        </div>
      )}
    </Card>
  )
}
