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
    const timeframe = searchParams.get("timeframe") || "24h"

    // Get market overview data from recent trades
    const { data: recentTrades, error: tradesError } = await supabase
      .from("trades")
      .select("symbol, total_value, created_at, status")
      .eq("status", "executed")
      .gte("created_at", getTimeframeDate(timeframe).toISOString())
      .order("created_at", { ascending: false })

    if (tradesError) {
      console.error("Error fetching market data:", tradesError)
      return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
    }

    // Aggregate market data by symbol
    const marketData = aggregateMarketData(recentTrades || [])

    // Get trending pools based on recent activity
    const { data: trendingPools, error: poolsError } = await supabase
      .from("trading_pools")
      .select(`
        id,
        name,
        strategy,
        total_return,
        aum,
        followers_count,
        created_at,
        profiles:manager_id (
          display_name
        )
      `)
      .eq("is_active", true)
      .order("followers_count", { ascending: false })
      .limit(10)

    if (poolsError) {
      console.error("Error fetching trending pools:", poolsError)
    }

    // Get network statistics
    const networkStats = await getNetworkStatistics(supabase)

    return NextResponse.json({
      market_overview: marketData,
      trending_pools: trendingPools || [],
      network_stats: networkStats,
      timeframe,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getTimeframeDate(timeframe: string): Date {
  const now = new Date()
  switch (timeframe) {
    case "1h":
      return new Date(now.getTime() - 60 * 60 * 1000)
    case "24h":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000)
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    default:
      return new Date(now.getTime() - 24 * 60 * 60 * 1000)
  }
}

function aggregateMarketData(trades: any[]) {
  const symbolData = trades.reduce(
    (acc, trade) => {
      const symbol = trade.symbol
      if (!acc[symbol]) {
        acc[symbol] = {
          symbol,
          volume: 0,
          trades: 0,
          last_price: 0,
          first_price: 0,
        }
      }

      acc[symbol].volume += Number.parseFloat(trade.total_value || 0)
      acc[symbol].trades += 1

      // Track first and last prices for price change calculation
      if (acc[symbol].first_price === 0) {
        acc[symbol].first_price = Number.parseFloat(trade.total_value || 0) / Number.parseFloat(trade.quantity || 1)
      }
      acc[symbol].last_price = Number.parseFloat(trade.total_value || 0) / Number.parseFloat(trade.quantity || 1)

      return acc
    },
    {} as Record<string, any>,
  )

  // Convert to array and calculate price changes
  return Object.values(symbolData)
    .map((data: any) => ({
      ...data,
      price_change: data.first_price > 0 ? ((data.last_price - data.first_price) / data.first_price) * 100 : 0,
      volume: Math.round(data.volume * 100) / 100,
    }))
    .sort((a: any, b: any) => b.volume - a.volume)
}

async function getNetworkStatistics(supabase: any) {
  // Get network distribution from wallet connections
  const { data: walletStats } = await supabase
    .from("wallet_connections")
    .select("network, balance")
    .eq("is_connected", true)

  const networkDistribution =
    walletStats?.reduce((acc: any, wallet: any) => {
      const network = wallet.network
      if (!acc[network]) {
        acc[network] = { network, wallets: 0, total_balance: 0 }
      }
      acc[network].wallets += 1
      acc[network].total_balance += Number.parseFloat(wallet.balance || 0)
      return acc
    }, {}) || {}

  // Get gas usage statistics
  const { data: gasStats } = await supabase
    .from("trades")
    .select("gas_used, gas_price, network")
    .not("gas_used", "is", null)
    .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  const avgGasUsed =
    gasStats?.length > 0
      ? gasStats.reduce((sum, trade) => sum + Number.parseFloat(trade.gas_used || 0), 0) / gasStats.length
      : 0

  const avgGasPrice =
    gasStats?.length > 0
      ? gasStats.reduce((sum, trade) => sum + Number.parseFloat(trade.gas_price || 0), 0) / gasStats.length
      : 0

  return {
    network_distribution: Object.values(networkDistribution),
    gas_metrics: {
      avg_gas_used: Math.round(avgGasUsed),
      avg_gas_price: Math.round(avgGasPrice * 100) / 100,
      total_transactions: gasStats?.length || 0,
    },
  }
}
