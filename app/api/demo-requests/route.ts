import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

function createAnonClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// POST - public: submit demo request
export async function POST(request: NextRequest) {
  const anon = createAnonClient()
  const body = await request.json()

  const { name, email, phone, company_name, business_type, preferred_demo_time, message, product_id, product_title } = body

  if (!name || !email || !product_title) {
    return NextResponse.json(
      { error: "Name, email, and product are required." },
      { status: 400 }
    )
  }

  const { data, error } = await anon
    .from("demo_requests")
    .insert({
      product_id: product_id || null,
      product_title,
      name,
      company_name: company_name || null,
      email,
      phone: phone || null,
      business_type: business_type || null,
      preferred_demo_time: preferred_demo_time || null,
      message: message || null,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data.id })
}

// GET - authenticated: fetch demo requests
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  let query = supabase
    .from("demo_requests")
    .select("*")
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
