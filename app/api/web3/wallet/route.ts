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
    const { wallet_address, wallet_type, network, balance } = body

    if (!wallet_address || !wallet_type || !network) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if wallet connection already exists
    const { data: existingConnection } = await supabase
      .from("wallet_connections")
      .select("id")
      .eq("user_id", user.id)
      .eq("wallet_address", wallet_address)
      .eq("network", network)
      .single()

    if (existingConnection) {
      // Update existing connection
      const { data: connection, error } = await supabase
        .from("wallet_connections")
        .update({
          wallet_type,
          balance: balance || 0,
          last_activity: new Date().toISOString(),
          is_connected: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingConnection.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating wallet connection:", error)
        return NextResponse.json({ error: "Failed to update wallet connection" }, { status: 500 })
      }

      return NextResponse.json({ connection })
    } else {
      // Create new wallet connection
      const { data: connection, error } = await supabase
        .from("wallet_connections")
        .insert({
          user_id: user.id,
          wallet_address,
          wallet_type,
          network,
          balance: balance || 0,
          last_activity: new Date().toISOString(),
          is_connected: true,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating wallet connection:", error)
        return NextResponse.json({ error: "Failed to create wallet connection" }, { status: 500 })
      }

      return NextResponse.json({ connection }, { status: 201 })
    }
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

    const { data: connections, error } = await supabase
      .from("wallet_connections")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching wallet connections:", error)
      return NextResponse.json({ error: "Failed to fetch wallet connections" }, { status: 500 })
    }

    return NextResponse.json({ connections })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
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
    const walletId = searchParams.get("id")

    if (!walletId) {
      return NextResponse.json({ error: "Wallet ID required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("wallet_connections")
      .update({ is_connected: false, updated_at: new Date().toISOString() })
      .eq("id", walletId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error disconnecting wallet:", error)
      return NextResponse.json({ error: "Failed to disconnect wallet" }, { status: 500 })
    }

    return NextResponse.json({ message: "Wallet disconnected successfully" })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
