"use client"

import { useState } from "react"
import { useWebSocket } from "@/hooks/use-websocket"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { TradeUpdate } from "@/lib/websocket/server"

export function RealTimeTradesFeed() {
  const [trades, setTrades] = useState<TradeUpdate[]>([])

  const { isConnected } = useWebSocket({
    onTradeExecuted: (trade) => {
      setTrades((prev) => [trade, ...prev.slice(0, 49)]) // Keep last 50 trades
    },
  })

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const formatValue = (value: number) => {
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Live Trades</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-sm text-muted-foreground">{trades.length} trades</span>
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {trades.map((trade) => (
            <div
              key={trade.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 animate-in slide-in-from-top-2 duration-300"
            >
              <div className="flex items-center gap-3">
                <Badge variant={trade.side === "buy" ? "default" : "destructive"}>{trade.side.toUpperCase()}</Badge>
                <div>
                  <div className="font-medium">{trade.symbol}</div>
                  <div className="text-xs text-muted-foreground">{formatTime(trade.timestamp)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatValue(trade.totalValue)}</div>
                <div className="text-xs text-muted-foreground">
                  {trade.quantity.toFixed(4)} @ ${trade.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {trades.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="animate-pulse">Waiting for trades...</div>
          </div>
        )}
      </ScrollArea>
    </Card>
  )
}
