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
    const category = searchParams.get("category") || "return"
    const timeframe = searchParams.get("timeframe") || "30d"
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    // Get leaderboard data based on category
    let orderBy: string
    const ascending = false

    switch (category) {
      case "return":
        orderBy = "total_return"
        break
      case "aum":
        orderBy = "aum"
        break
      case "sharpe":
        orderBy = "sharpe_ratio"
        break
      case "followers":
        orderBy = "followers_count"
        break
      default:
        orderBy = "total_return"
    }

    const { data: leaderboard, error } = await supabase
      .from("trading_pools")
      .select(`
        id,
        name,
        strategy,
        total_return,
        sharpe_ratio,
        max_drawdown,
        aum,
        followers_count,
        risk_score,
        created_at,
        profiles:manager_id (
          id,
          display_name,
          wallet_address
        )
      `)
      .eq("is_active", true)
      .order(orderBy, { ascending })
      .limit(limit)

    if (error) {
      console.error("Error fetching leaderboard:", error)
      return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
    }

    // Enrich with additional performance metrics
    const enrichedLeaderboard = await Promise.all(
      leaderboard?.map(async (pool, index) => {
        // Get recent performance data
        const { data: recentTrades } = await supabase
          .from("trades")
          .select("total_value, created_at, status")
          .eq("pool_id", pool.id)
          .eq("status", "executed")
          .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order("created_at", { ascending: false })

        const recentVolume =
          recentTrades?.reduce((sum, trade) => sum + Number.parseFloat(trade.total_value || 0), 0) || 0

        const recentTradeCount = recentTrades?.length || 0

        return {
          ...pool,
          rank: index + 1,
          recent_volume: recentVolume,
          recent_trades: recentTradeCount,
          performance_score: calculatePerformanceScore(pool),
        }
      }) || [],
    )

    // Get user's position in leaderboard if they have pools
    const { data: userPools } = await supabase
      .from("trading_pools")
      .select("id, name, total_return, aum, followers_count")
      .eq("manager_id", user.id)
      .eq("is_active", true)

    const userRankings =
      userPools?.map((pool) => {
        const position = enrichedLeaderboard.findIndex((p) => p.id === pool.id)
        return {
          ...pool,
          rank: position >= 0 ? position + 1 : null,
        }
      }) || []

    return NextResponse.json({
      leaderboard: enrichedLeaderboard,
      user_rankings: userRankings,
      category,
      timeframe,
      total_pools: enrichedLeaderboard.length,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculatePerformanceScore(pool: any): number {
  // Weighted performance score calculation
  const returnWeight = 0.4
  const sharpeWeight = 0.3
  const aumWeight = 0.2
  const followersWeight = 0.1

  const normalizedReturn = Math.max(0, Math.min(100, (pool.total_return || 0) * 100 + 50))
  const normalizedSharpe = Math.max(0, Math.min(100, (pool.sharpe_ratio || 0) * 20 + 50))
  const normalizedAum = Math.max(0, Math.min(100, Math.log10((pool.aum || 1) / 1000) * 10))
  const normalizedFollowers = Math.max(0, Math.min(100, Math.log10((pool.followers_count || 1) + 1) * 25))

  return Math.round(
    normalizedReturn * returnWeight +
      normalizedSharpe * sharpeWeight +
      normalizedAum * aumWeight +
      normalizedFollowers * followersWeight,
  )
}
