"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { WebSocketMessage, PriceUpdate, TradeUpdate, PoolUpdate } from "@/lib/websocket/server"

interface UseWebSocketOptions {
  onPriceUpdate?: (data: PriceUpdate) => void
  onTradeExecuted?: (data: TradeUpdate) => void
  onPoolUpdate?: (data: PoolUpdate) => void
  onPortfolioUpdate?: (data: any) => void
  reconnectInterval?: number
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [priceData, setPriceData] = useState<Map<string, PriceUpdate>>(new Map())

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const reconnectInterval = options.reconnectInterval || 5000

  const connect = useCallback(() => {
    try {
      console.log("Connecting to WebSocket...")

      // Simulate connection success
      setTimeout(() => {
        setIsConnected(true)
        setConnectionError(null)
        console.log("WebSocket connected")

        startDataSimulation()
      }, 1000)
    } catch (error) {
      console.error("WebSocket connection error:", error)
      setConnectionError(error instanceof Error ? error.message : "Connection failed")
      scheduleReconnect()
    }
  }, [])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsConnected(false)
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }, [])

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    reconnectTimeoutRef.current = setTimeout(() => {
      console.log("Attempting to reconnect...")
      connect()
    }, reconnectInterval) as unknown as number
  }, [connect, reconnectInterval])

  const startDataSimulation = useCallback(() => {
    const symbols = ["BTC/USDT", "ETH/USDC", "MATIC/USDC", "USDC/DAI", "SAND/ETH"]
    const basePrices = {
      "BTC/USDT": 43200,
      "ETH/USDC": 2450,
      "MATIC/USDC": 0.85,
      "USDC/DAI": 1.001,
      "SAND/ETH": 0.0003,
    }

    const priceUpdateInterval = setInterval(() => {
      symbols.forEach((symbol) => {
        const basePrice = basePrices[symbol as keyof typeof basePrices] || 1
        const change = (Math.random() - 0.5) * 0.01
        const newPrice = basePrice * (1 + change)

        const priceUpdate: PriceUpdate = {
          symbol,
          price: Math.round(newPrice * 100000) / 100000,
          change24h: (Math.random() - 0.5) * 10,
          volume24h: Math.random() * 1000000,
          timestamp: Date.now(),
        }

        setPriceData((prev) => new Map(prev.set(symbol, priceUpdate)))

        if (options.onPriceUpdate) {
          options.onPriceUpdate(priceUpdate)
        }

        const message: WebSocketMessage = {
          type: "price_update",
          data: priceUpdate,
          timestamp: Date.now(),
        }
        setLastMessage(message)
      })
    }, 2000)

    const tradeUpdateInterval = setInterval(() => {
      const symbols = ["BTC/USDT", "ETH/USDC", "MATIC/USDC"]
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]
      const randomSide = Math.random() > 0.5 ? "buy" : "sell"
      const randomQuantity = Math.random() * 10
      const randomPrice = Math.random() * 1000 + 100

      const tradeUpdate: TradeUpdate = {
        id: `trade_${Date.now()}`,
        symbol: randomSymbol,
        side: randomSide,
        quantity: randomQuantity,
        price: randomPrice,
        totalValue: randomQuantity * randomPrice,
        timestamp: Date.now(),
        status: "executed",
      }

      if (options.onTradeExecuted) {
        options.onTradeExecuted(tradeUpdate)
      }

      const message: WebSocketMessage = {
        type: "trade_executed",
        data: tradeUpdate,
        timestamp: Date.now(),
      }
      setLastMessage(message)
    }, 10000)

    return () => {
      clearInterval(priceUpdateInterval)
      clearInterval(tradeUpdateInterval)
    }
  }, [options])

  const subscribeToPool = useCallback((poolId: string) => {
    console.log(`Subscribing to pool: ${poolId}`)
  }, [])

  const unsubscribeFromPool = useCallback((poolId: string) => {
    console.log(`Unsubscribing from pool: ${poolId}`)
  }, [])

  const subscribeToPortfolio = useCallback(() => {
    console.log("Subscribing to portfolio updates")
  }, [])

  useEffect(() => {
    connect()
    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    isConnected,
    connectionError,
    lastMessage,
    priceData,
    connect,
    disconnect,
    subscribeToPool,
    unsubscribeFromPool,
    subscribeToPortfolio,
  }
}
