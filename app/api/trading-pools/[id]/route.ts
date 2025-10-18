import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: pool, error } = await supabase
      .from("trading_pools")
      .select(`
        *,
        profiles:manager_id (
          display_name,
          wallet_address
        ),
        pool_followers (
          id,
          follower_id,
          investment_amount,
          allocation_percentage,
          joined_at,
          profiles:follower_id (
            display_name
          )
        ),
        trades (
          id,
          symbol,
          side,
          quantity,
          price,
          total_value,
          status,
          execution_time,
          created_at
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching trading pool:", error)
      return NextResponse.json({ error: "Trading pool not found" }, { status: 404 })
    }

    // Calculate performance metrics
    const totalInvested =
      pool.pool_followers?.reduce(
        (sum: number, follower: any) => sum + Number.parseFloat(follower.investment_amount || 0),
        0,
      ) || 0

    const recentTrades = pool.trades?.slice(0, 10) || []

    const enrichedPool = {
      ...pool,
      total_followers: pool.pool_followers?.length || 0,
      total_invested: totalInvested,
      recent_trades: recentTrades,
    }

    return NextResponse.json({ pool: enrichedPool })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, performance_fee, management_fee, min_investment, max_investment, is_active } = body

    // Update trading pool (only manager can update)
    const { data: pool, error } = await supabase
      .from("trading_pools")
      .update({
        name,
        description,
        performance_fee,
        management_fee,
        min_investment,
        max_investment,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("manager_id", user.id) // Ensure only manager can update
      .select()
      .single()

    if (error) {
      console.error("Error updating trading pool:", error)
      return NextResponse.json({ error: "Failed to update trading pool or unauthorized" }, { status: 500 })
    }

    return NextResponse.json({ pool })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
