import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's portfolio positions
    const { data: positions, error: positionsError } = await supabase
      .from("portfolio_positions")
      .select("*")
      .eq("user_id", user.id)
      .order("allocation_percentage", { ascending: false })

    if (positionsError) {
      console.error("Error fetching portfolio positions:", positionsError)
      return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 })
    }

    // Get user's trading activity
    const { data: trades, error: tradesError } = await supabase
      .from("trades")
      .select(`
        *,
        trading_pools (
          name,
          strategy
        )
      `)
      .eq("trader_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100)

    if (tradesError) {
      console.error("Error fetching trades:", tradesError)
    }

    // Get user's pool investments
    const { data: investments, error: investmentsError } = await supabase
      .from("pool_followers")
      .select(`
        *,
        trading_pools (
          id,
          name,
          strategy,
          total_return,
          aum,
          risk_score
        )
      `)
      .eq("follower_id", user.id)
      .order("joined_at", { ascending: false })

    if (investmentsError) {
      console.error("Error fetching investments:", investmentsError)
    }

    // Calculate portfolio metrics
    const totalValue =
      positions?.reduce(
        (sum, pos) => sum + Number.parseFloat(pos.quantity || 0) * Number.parseFloat(pos.current_price || 0),
        0,
      ) || 0

    const totalUnrealizedPnL = positions?.reduce((sum, pos) => sum + Number.parseFloat(pos.unrealized_pnl || 0), 0) || 0

    const totalRealizedPnL = positions?.reduce((sum, pos) => sum + Number.parseFloat(pos.realized_pnl || 0), 0) || 0

    const totalInvested = investments?.reduce((sum, inv) => sum + Number.parseFloat(inv.investment_amount || 0), 0) || 0

    // Calculate asset allocation
    const assetAllocation =
      positions?.map((pos) => ({
        symbol: pos.symbol,
        value: Number.parseFloat(pos.quantity || 0) * Number.parseFloat(pos.current_price || 0),
        percentage:
          totalValue > 0
            ? ((Number.parseFloat(pos.quantity || 0) * Number.parseFloat(pos.current_price || 0)) / totalValue) * 100
            : 0,
        unrealized_pnl: Number.parseFloat(pos.unrealized_pnl || 0),
      })) || []

    // Calculate performance over time (last 30 days)
    const performanceHistory = generatePortfolioPerformanceHistory(trades || [])

    // Risk metrics
    const riskMetrics = calculateRiskMetrics(positions || [], trades || [])

    return NextResponse.json({
      summary: {
        total_value: Math.round(totalValue * 100) / 100,
        total_unrealized_pnl: Math.round(totalUnrealizedPnL * 100) / 100,
        total_realized_pnl: Math.round(totalRealizedPnL * 100) / 100,
        total_invested: Math.round(totalInvested * 100) / 100,
        total_return_percentage:
          totalValue > 0 ? Math.round(((totalUnrealizedPnL + totalRealizedPnL) / totalValue) * 10000) / 100 : 0,
      },
      positions: positions || [],
      asset_allocation: assetAllocation,
      investments: investments || [],
      recent_trades: trades?.slice(0, 20) || [],
      performance_history: performanceHistory,
      risk_metrics: riskMetrics,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generatePortfolioPerformanceHistory(trades: any[]) {
  // Group trades by date and calculate cumulative P&L
  const tradesByDate = trades.reduce(
    (acc, trade) => {
      const date = new Date(trade.created_at).toISOString().split("T")[0]
      if (!acc[date]) {
        acc[date] = { date, pnl: 0, cumulative_pnl: 0 }
      }

      const value = Number.parseFloat(trade.total_value || 0)
      const fee = Number.parseFloat(trade.fee || 0)
      acc[date].pnl += trade.side === "sell" ? value - fee : -value - fee

      return acc
    },
    {} as Record<string, any>,
  )

  // Convert to array, sort by date, and calculate cumulative P&L
  const sortedData = Object.values(tradesByDate).sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  let cumulativePnL = 0
  return sortedData.map((item: any) => {
    cumulativePnL += item.pnl
    return {
      ...item,
      cumulative_pnl: Math.round(cumulativePnL * 100) / 100,
    }
  })
}

function calculateRiskMetrics(positions: any[], trades: any[]) {
  // Calculate portfolio concentration risk
  const totalValue = positions.reduce(
    (sum, pos) => sum + Number.parseFloat(pos.quantity || 0) * Number.parseFloat(pos.current_price || 0),
    0,
  )

  const concentrationRisk =
    positions.length > 0
      ? Math.max(
          ...positions.map(
            (pos) =>
              ((Number.parseFloat(pos.quantity || 0) * Number.parseFloat(pos.current_price || 0)) / totalValue) * 100,
          ),
        )
      : 0

  // Calculate volatility from recent trades
  const recentTrades = trades.slice(0, 30)
  const returns = recentTrades.map((trade) => {
    const value = Number.parseFloat(trade.total_value || 0)
    return trade.side === "sell" ? value : -value
  })

  const avgReturn = returns.length > 0 ? returns.reduce((sum, ret) => sum + ret, 0) / returns.length : 0
  const variance =
    returns.length > 0 ? returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length : 0
  const volatility = Math.sqrt(variance)

  return {
    concentration_risk: Math.round(concentrationRisk * 100) / 100,
    volatility: Math.round(volatility * 100) / 100,
    diversification_score: positions.length > 0 ? Math.min(100, positions.length * 10) : 0,
    risk_score: Math.min(10, Math.max(1, Math.round((concentrationRisk + volatility / 1000) / 10))),
  }
}
