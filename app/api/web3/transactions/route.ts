import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { pool_id, symbol, side, quantity, price, total_value, fee, gas_used, gas_price, transaction_hash, network } =
      body

    if (!symbol || !side || !quantity || !price || !total_value || !transaction_hash || !network) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create trade record
    const { data: trade, error } = await supabase
      .from("trades")
      .insert({
        pool_id,
        trader_id: user.id,
        symbol,
        side,
        quantity,
        price,
        total_value,
        fee: fee || 0,
        status: "executed",
        execution_time: new Date().toISOString(),
        gas_used,
        gas_price,
        transaction_hash,
        network,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating trade record:", error)
      return NextResponse.json({ error: "Failed to create trade record" }, { status: 500 })
    }

    // Update portfolio positions if this is a personal trade (not pool trade)
    if (!pool_id) {
      await updatePortfolioPosition(supabase, user.id, symbol, side, quantity, price)
    }

    return NextResponse.json({ trade }, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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
    const network = searchParams.get("network")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = supabase
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
      .limit(limit)

    if (network) {
      query = query.eq("network", network)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data: transactions, error } = await query

    if (error) {
      console.error("Error fetching transactions:", error)
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function updatePortfolioPosition(
  supabase: any,
  userId: string,
  symbol: string,
  side: string,
  quantity: number,
  price: number,
) {
  try {
    // Get existing position
    const { data: existingPosition } = await supabase
      .from("portfolio_positions")
      .select("*")
      .eq("user_id", userId)
      .eq("symbol", symbol)
      .single()

    if (existingPosition) {
      // Update existing position
      const currentQuantity = Number.parseFloat(existingPosition.quantity)
      const currentAvgPrice = Number.parseFloat(existingPosition.average_price)

      let newQuantity: number
      let newAvgPrice: number
      let realizedPnL = Number.parseFloat(existingPosition.realized_pnl)

      if (side === "buy") {
        newQuantity = currentQuantity + quantity
        newAvgPrice = (currentQuantity * currentAvgPrice + quantity * price) / newQuantity
      } else {
        // sell
        newQuantity = Math.max(0, currentQuantity - quantity)
        newAvgPrice = currentAvgPrice // Keep same average price
        realizedPnL += quantity * (price - currentAvgPrice) // Calculate realized P&L
      }

      await supabase
        .from("portfolio_positions")
        .update({
          quantity: newQuantity,
          average_price: newAvgPrice,
          current_price: price,
          realized_pnl: realizedPnL,
          last_updated: new Date().toISOString(),
        })
        .eq("id", existingPosition.id)
    } else if (side === "buy") {
      // Create new position (only for buy orders)
      await supabase.from("portfolio_positions").insert({
        user_id: userId,
        symbol,
        quantity,
        average_price: price,
        current_price: price,
        unrealized_pnl: 0,
        realized_pnl: 0,
      })
    }
  } catch (error) {
    console.error("Error updating portfolio position:", error)
  }
}
