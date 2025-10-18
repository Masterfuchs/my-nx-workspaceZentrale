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
  private priceData: Map<string, PriceUpdate> = new Map()
  private listeners: Map<string, Set<(message: WebSocketMessage) => void>> = new Map()

  constructor() {
    this.initializePriceData()
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
        change24h: (Math.random() - 0.5) * 10,
        volume24h: Math.random() * 1000000,
        timestamp: Date.now(),
      })
    })
  }

  getPriceData(): PriceUpdate[] {
    return Array.from(this.priceData.values())
  }

  subscribe(channel: string, callback: (message: WebSocketMessage) => void) {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, new Set())
    }
    this.listeners.get(channel)?.add(callback)
  }

  unsubscribe(channel: string, callback: (message: WebSocketMessage) => void) {
    this.listeners.get(channel)?.delete(callback)
  }

  emit(channel: string, message: WebSocketMessage) {
    this.listeners.get(channel)?.forEach((callback) => callback(message))
  }

  async notifyTradeExecuted(trade: TradeUpdate) {
    const message: WebSocketMessage = {
      type: "trade_executed",
      data: trade,
      timestamp: Date.now(),
    }
    this.emit("trades", message)
  }

  async notifyPoolUpdate(poolUpdate: PoolUpdate) {
    const message: WebSocketMessage = {
      type: "pool_update",
      data: poolUpdate,
      timestamp: Date.now(),
    }
    this.emit(`pool:${poolUpdate.id}`, message)
  }

  async notifyPortfolioUpdate(userId: string, portfolioData: any) {
    const message: WebSocketMessage = {
      type: "portfolio_update",
      data: portfolioData,
      timestamp: Date.now(),
      userId,
    }
    this.emit(`portfolio:${userId}`, message)
  }
}

export const wsService = new WebSocketService()
