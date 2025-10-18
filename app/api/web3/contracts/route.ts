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
    const network = searchParams.get("network")
    const contractType = searchParams.get("type")

    let query = supabase.from("smart_contracts").select("*").order("created_at", { ascending: false })

    if (network) {
      query = query.eq("network", network)
    }

    if (contractType) {
      query = query.eq("contract_type", contractType)
    }

    const { data: contracts, error } = await query

    if (error) {
      console.error("Error fetching smart contracts:", error)
      return NextResponse.json({ error: "Failed to fetch smart contracts" }, { status: 500 })
    }

    return NextResponse.json({ contracts })
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
    const { name, address, network, abi, contract_type, gas_limit, deployment_block } = body

    if (!name || !address || !network || !contract_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: contract, error } = await supabase
      .from("smart_contracts")
      .insert({
        name,
        address,
        network,
        abi,
        contract_type,
        gas_limit,
        deployment_block,
        is_verified: false, // Will be verified separately
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating smart contract:", error)
      return NextResponse.json({ error: "Failed to create smart contract" }, { status: 500 })
    }

    return NextResponse.json({ contract }, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
