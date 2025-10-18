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

    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "30d"
    const poolId = searchParams.get("poolId")

    // Calculate date range based on timeframe
    const getDateRange = (timeframe: string) => {
      const now = new Date()
      switch (timeframe) {
        case "7d":
          return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        case "30d":
          return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        case "90d":
          return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        case "1y":
          return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        default:
          return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      }
    }

    const startDate = getDateRange(timeframe)

    // Base query for trades
    let tradesQuery = supabase
      .from("trades")
      .select(`
        *,
        trading_pools (
          name,
          strategy
        )
      `)
      .gte("created_at", startDate.toISOString())
      .eq("status", "executed")

    // Filter by pool if specified
    if (poolId) {
      tradesQuery = tradesQuery.eq("pool_id", poolId)
    } else {
      // Only show trades from pools the user manages or follows
      const { data: userPools } = await supabase.from("trading_pools").select("id").eq("manager_id", user.id)

      const { data: followedPools } = await supabase.from("pool_followers").select("pool_id").eq("follower_id", user.id)

      const accessiblePoolIds = [
        ...(userPools?.map((p) => p.id) || []),
        ...(followedPools?.map((p) => p.pool_id) || []),
      ]

      if (accessiblePoolIds.length > 0) {
        tradesQuery = tradesQuery.in("pool_id", accessiblePoolIds)
      } else {
        // User has no accessible pools
        return NextResponse.json({
          totalTrades: 0,
          totalVolume: 0,
          winRate: 0,
          avgTradeSize: 0,
          profitLoss: 0,
          performanceChart: [],
          topPerformers: [],
          recentTrades: [],
        })
      }
    }

    const { data: trades, error: tradesError } = await tradesQuery.order("created_at", { ascending: false })

    if (tradesError) {
      console.error("Error fetching trades:", tradesError)
      return NextResponse.json({ error: "Failed to fetch performance data" }, { status: 500 })
    }

    // Calculate performance metrics
    const totalTrades = trades?.length || 0
    const totalVolume = trades?.reduce((sum, trade) => sum + Number.parseFloat(trade.total_value || 0), 0) || 0
    const avgTradeSize = totalTrades > 0 ? totalVolume / totalTrades : 0

    // Calculate win rate (simplified - assumes buy low, sell high)
    const winningTrades =
      trades?.filter((trade) => {
        // This is a simplified calculation - in reality, you'd need to track entry/exit prices
        return trade.side === "sell" && Number.parseFloat(trade.price) > 0
      }).length || 0
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    // Calculate P&L (simplified)
    const profitLoss =
      trades?.reduce((sum, trade) => {
        const value = Number.parseFloat(trade.total_value || 0)
        const fee = Number.parseFloat(trade.fee || 0)
        return trade.side === "sell" ? sum + value - fee : sum - value - fee
      }, 0) || 0

    // Generate performance chart data (daily aggregation)
    const performanceChart = generatePerformanceChart(trades || [], timeframe)

    // Get top performing pools
    const { data: topPerformers, error: topError } = await supabase
      .from("trading_pools")
      .select(`
        id,
        name,
        strategy,
        total_return,
        sharpe_ratio,
        aum,
        followers_count,
        profiles:manager_id (
          display_name
        )
      `)
      .eq("is_active", true)
      .order("total_return", { ascending: false })
      .limit(10)

    if (topError) {
      console.error("Error fetching top performers:", topError)
    }

    return NextResponse.json({
      totalTrades,
      totalVolume,
      winRate: Math.round(winRate * 100) / 100,
      avgTradeSize: Math.round(avgTradeSize * 100) / 100,
      profitLoss: Math.round(profitLoss * 100) / 100,
      performanceChart,
      topPerformers: topPerformers || [],
      recentTrades: trades?.slice(0, 20) || [],
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generatePerformanceChart(trades: any[], timeframe: string) {
  if (!trades.length) return []

  // Group trades by date
  const tradesByDate = trades.reduce(
    (acc, trade) => {
      const date = new Date(trade.created_at).toISOString().split("T")[0]
      if (!acc[date]) {
        acc[date] = { date, volume: 0, trades: 0, pnl: 0 }
      }
      acc[date].volume += Number.parseFloat(trade.total_value || 0)
      acc[date].trades += 1

      // Simplified P&L calculation
      const value = Number.parseFloat(trade.total_value || 0)
      const fee = Number.parseFloat(trade.fee || 0)
      acc[date].pnl += trade.side === "sell" ? value - fee : -value - fee

      return acc
    },
    {} as Record<string, any>,
  )

  // Convert to array and sort by date
  return Object.values(tradesByDate).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
}
