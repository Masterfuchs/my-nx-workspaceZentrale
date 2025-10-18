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
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const strategy = searchParams.get("strategy")
    const minAum = searchParams.get("minAum")
    const maxRisk = searchParams.get("maxRisk")

    let query = supabase
      .from("trading_pools")
      .select(`
        *,
        profiles:manager_id (
          display_name,
          wallet_address
        ),
        pool_followers (
          id,
          investment_amount
        )
      `)
      .eq("is_active", true)
      .order("aum", { ascending: false })
      .range(offset, offset + limit - 1)

    if (strategy) {
      query = query.eq("strategy", strategy)
    }
    if (minAum) {
      query = query.gte("aum", Number.parseFloat(minAum))
    }
    if (maxRisk) {
      query = query.lte("risk_score", Number.parseInt(maxRisk))
    }

    const { data: pools, error } = await query

    if (error) {
      console.error("Error fetching trading pools:", error)
      return NextResponse.json({ error: "Failed to fetch trading pools" }, { status: 500 })
    }

    // Calculate additional metrics for each pool
    const enrichedPools = pools?.map((pool) => ({
      ...pool,
      total_followers: pool.pool_followers?.length || 0,
      total_invested:
        pool.pool_followers?.reduce(
          (sum: number, follower: any) => sum + Number.parseFloat(follower.investment_amount || 0),
          0,
        ) || 0,
    }))

    return NextResponse.json({ pools: enrichedPools })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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
    const { name, description, strategy, performance_fee, management_fee, min_investment, max_investment, risk_score } =
      body

    // Validate required fields
    if (!name || !strategy || !risk_score) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new trading pool
    const { data: pool, error } = await supabase
      .from("trading_pools")
      .insert({
        name,
        description,
        manager_id: user.id,
        strategy,
        performance_fee: performance_fee || 0.2,
        management_fee: management_fee || 0.02,
        min_investment: min_investment || 100,
        max_investment,
        risk_score,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating trading pool:", error)
      return NextResponse.json({ error: "Failed to create trading pool" }, { status: 500 })
    }

    return NextResponse.json({ pool }, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
