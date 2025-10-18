export interface WebSocketMessage {
  type: "price_update" | "trade_executed" | "pool_update" | "portfolio_update" | "market_data"
  data: any
  timestamp: number
  userId?: string
  poolId?: string
}

export interface PriceUpdate {
  symbol: string
  price: number
  change24h: number
  volume24h: number
  timestamp: number
}

export interface TradeUpdate {
  id: string
  poolId?: string
  symbol: string
  side: "buy" | "sell"
  quantity: number
  price: number
  totalValue: number
  timestamp: number
  status: string
}

export interface PoolUpdate {
  id: string
  name: string
  aum: number
  totalReturn: number
  followersCount: number
  recentTrades: TradeUpdate[]
  timestamp: number
}

export class WebSocketService {
  private connections: Map<string, WebSocket> = new Map()
  private userSubscriptions: Map<string, Set<string>> = new Map() // userId -> Set of subscriptions
  private poolSubscriptions: Map<string, Set<string>> = new Map() // poolId -> Set of userIds

  // Simulate real-time price data (in production, this would come from external APIs)
  private priceData: Map<string, PriceUpdate> = new Map()
  private priceInterval: NodeJS.Timeout | null = null

  constructor() {
    this.initializePriceData()
    this.startPriceUpdates()
  }

  private initializePriceData() {
    const symbols = ["BTC/USDT", "ETH/USDC", "MATIC/USDC", "USDC/DAI", "SAND/ETH"]
    const basePrices = {
      "BTC/USDT": 43200,
      "ETH/USDC": 2450,
      "MATIC/USDC": 0.85,
      "USDC/DAI": 1.001,
      "SAND/ETH": 0.0003,
    }

    symbols.forEach((symbol) => {
      this.priceData.set(symbol, {
        symbol,
        price: basePrices[symbol as keyof typeof basePrices] || 1,
        change24h: (Math.random() - 0.5) * 10, // Random change between -5% and +5%
        volume24h: Math.random() * 1000000,
        timestamp: Date.now(),
      })
    })
  }

  private startPriceUpdates() {
    this.priceInterval = setInterval(() => {
      this.updatePrices()
    }, 2000) // Update every 2 seconds
  }

  private updatePrices() {
    this.priceData.forEach((priceUpdate, symbol) => {
      // Simulate price movement (±0.5% random walk)
      const change = (Math.random() - 0.5) * 0.01
      const newPrice = priceUpdate.price * (1 + change)

      const updatedPrice: PriceUpdate = {
        ...priceUpdate,
        price: Math.round(newPrice * 100000) / 100000,
        change24h: priceUpdate.change24h + change * 100,
        timestamp: Date.now(),
      }

      this.priceData.set(symbol, updatedPrice)

      // Broadcast price update to all connected clients
      this.broadcast({
        type: "price_update",
        data: updatedPrice,
        timestamp: Date.now(),
      })
    })
  }

  addConnection(userId: string, ws: WebSocket) {
    this.connections.set(userId, ws)
    this.userSubscriptions.set(userId, new Set())

    ws.on("message", (message: string) => {
      try {
        const data = JSON.parse(message)
        this.handleMessage(userId, data)
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    })

    ws.on("close", () => {
      this.removeConnection(userId)
    })

    // Send initial price data
    this.priceData.forEach((priceUpdate) => {
      this.sendToUser(userId, {
        type: "price_update",
        data: priceUpdate,
        timestamp: Date.now(),
      })
    })
  }

  removeConnection(userId: string) {
    this.connections.delete(userId)

    // Remove user from pool subscriptions
    this.poolSubscriptions.forEach((subscribers, poolId) => {
      subscribers.delete(userId)
      if (subscribers.size === 0) {
        this.poolSubscriptions.delete(poolId)
      }
    })

    this.userSubscriptions.delete(userId)
  }

  private handleMessage(userId: string, message: any) {
    switch (message.type) {
      case "subscribe_pool":
        this.subscribeToPool(userId, message.poolId)
        break
      case "unsubscribe_pool":
        this.unsubscribeFromPool(userId, message.poolId)
        break
      case "subscribe_portfolio":
        this.subscribeToPortfolio(userId)
        break
      case "ping":
        this.sendToUser(userId, { type: "pong", data: {}, timestamp: Date.now() })
        break
    }
  }

  private subscribeToPool(userId: string, poolId: string) {
    const userSubs = this.userSubscriptions.get(userId)
    if (userSubs) {
      userSubs.add(`pool:${poolId}`)
    }

    let poolSubs = this.poolSubscriptions.get(poolId)
    if (!poolSubs) {
      poolSubs = new Set()
      this.poolSubscriptions.set(poolId, poolSubs)
    }
    poolSubs.add(userId)
  }

  private unsubscribeFromPool(userId: string, poolId: string) {
    const userSubs = this.userSubscriptions.get(userId)
    if (userSubs) {
      userSubs.delete(`pool:${poolId}`)
    }

    const poolSubs = this.poolSubscriptions.get(poolId)
    if (poolSubs) {
      poolSubs.delete(userId)
      if (poolSubs.size === 0) {
        this.poolSubscriptions.delete(poolId)
      }
    }
  }

  private subscribeToPortfolio(userId: string) {
    const userSubs = this.userSubscriptions.get(userId)
    if (userSubs) {
      userSubs.add("portfolio")
    }
  }

  sendToUser(userId: string, message: WebSocketMessage) {
    const ws = this.connections.get(userId)
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    }
  }

  broadcast(message: WebSocketMessage) {
    this.connections.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message))
      }
    })
  }

  broadcastToPool(poolId: string, message: WebSocketMessage) {
    const subscribers = this.poolSubscriptions.get(poolId)
    if (subscribers) {
      subscribers.forEach((userId) => {
        this.sendToUser(userId, { ...message, poolId })
      })
    }
  }

  // Called when a trade is executed
  async notifyTradeExecuted(trade: TradeUpdate) {
    const message: WebSocketMessage = {
      type: "trade_executed",
      data: trade,
      timestamp: Date.now(),
    }

    // Notify pool subscribers
    if (trade.poolId) {
      this.broadcastToPool(trade.poolId, message)
    }

    // Notify all users for market data
    this.broadcast(message)
  }

  // Called when pool data is updated
  async notifyPoolUpdate(poolUpdate: PoolUpdate) {
    const message: WebSocketMessage = {
      type: "pool_update",
      data: poolUpdate,
      timestamp: Date.now(),
    }

    this.broadcastToPool(poolUpdate.id, message)
  }

  // Called when user's portfolio is updated
  async notifyPortfolioUpdate(userId: string, portfolioData: any) {
    const message: WebSocketMessage = {
      type: "portfolio_update",
      data: portfolioData,
      timestamp: Date.now(),
      userId,
    }

    this.sendToUser(userId, message)
  }

  destroy() {
    if (this.priceInterval) {
      clearInterval(this.priceInterval)
    }
    this.connections.clear()
    this.userSubscriptions.clear()
    this.poolSubscriptions.clear()
  }
}

// Global WebSocket service instance
export const wsService = new WebSocketService()
