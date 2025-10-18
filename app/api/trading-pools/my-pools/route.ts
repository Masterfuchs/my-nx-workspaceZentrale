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

    // Get pools managed by the user
    const { data: managedPools, error: managedError } = await supabase
      .from("trading_pools")
      .select(`
        *,
        pool_followers (
          id,
          investment_amount,
          follower_id,
          profiles:follower_id (
            display_name
          )
        )
      `)
      .eq("manager_id", user.id)
      .order("created_at", { ascending: false })

    // Get pools followed by the user
    const { data: followedPools, error: followedError } = await supabase
      .from("pool_followers")
      .select(`
        *,
        trading_pools (
          *,
          profiles:manager_id (
            display_name,
            wallet_address
          )
        )
      `)
      .eq("follower_id", user.id)
      .order("joined_at", { ascending: false })

    if (managedError || followedError) {
      console.error("Error fetching user pools:", managedError || followedError)
      return NextResponse.json({ error: "Failed to fetch pools" }, { status: 500 })
    }

    // Calculate metrics for managed pools
    const enrichedManagedPools = managedPools?.map((pool) => ({
      ...pool,
      total_followers: pool.pool_followers?.length || 0,
      total_invested:
        pool.pool_followers?.reduce(
          (sum: number, follower: any) => sum + Number.parseFloat(follower.investment_amount || 0),
          0,
        ) || 0,
    }))

    return NextResponse.json({
      managed_pools: enrichedManagedPools || [],
      followed_pools: followedPools || [],
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
