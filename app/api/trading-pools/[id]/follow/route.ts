import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: poolId } = await params
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { investment_amount, allocation_percentage = 1.0, auto_copy = true } = body

    if (!investment_amount || investment_amount <= 0) {
      return NextResponse.json({ error: "Invalid investment amount" }, { status: 400 })
    }

    // Check if pool exists and get min investment
    const { data: pool, error: poolError } = await supabase
      .from("trading_pools")
      .select("min_investment, max_investment, is_active")
      .eq("id", poolId)
      .single()

    if (poolError || !pool) {
      return NextResponse.json({ error: "Trading pool not found" }, { status: 404 })
    }

    if (!pool.is_active) {
      return NextResponse.json({ error: "Trading pool is not active" }, { status: 400 })
    }

    if (investment_amount < pool.min_investment) {
      return NextResponse.json(
        {
          error: `Minimum investment is ${pool.min_investment}`,
        },
        { status: 400 },
      )
    }

    if (pool.max_investment && investment_amount > pool.max_investment) {
      return NextResponse.json(
        {
          error: `Maximum investment is ${pool.max_investment}`,
        },
        { status: 400 },
      )
    }

    // Check if user is already following this pool
    const { data: existingFollow } = await supabase
      .from("pool_followers")
      .select("id")
      .eq("pool_id", poolId)
      .eq("follower_id", user.id)
      .single()

    if (existingFollow) {
      return NextResponse.json({ error: "Already following this pool" }, { status: 400 })
    }

    // Create follow relationship
    const { data: follow, error } = await supabase
      .from("pool_followers")
      .insert({
        pool_id: poolId,
        follower_id: user.id,
        investment_amount,
        allocation_percentage,
        auto_copy,
      })
      .select()
      .single()

    if (error) {
      console.error("Error following pool:", error)
      return NextResponse.json({ error: "Failed to follow pool" }, { status: 500 })
    }

    // Update pool followers count
    await supabase.rpc("increment_followers_count", { pool_id: poolId })

    return NextResponse.json({ follow }, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: poolId } = await params
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Remove follow relationship
    const { error } = await supabase.from("pool_followers").delete().eq("pool_id", poolId).eq("follower_id", user.id)

    if (error) {
      console.error("Error unfollowing pool:", error)
      return NextResponse.json({ error: "Failed to unfollow pool" }, { status: 500 })
    }

    // Update pool followers count
    await supabase.rpc("decrement_followers_count", { pool_id: poolId })

    return NextResponse.json({ message: "Successfully unfollowed pool" })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
