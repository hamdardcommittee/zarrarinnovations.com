import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

// Create a service-role-less anon client for public inserts
// This bypasses the cookie-based auth so the anon key RLS policies apply
function createAnonClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// POST - public: submit a new lead from the contact form
export async function POST(request: NextRequest) {
  const anon = createAnonClient()
  const body = await request.json()

  const { name, email, phone, subject, message, service } = body

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Name, email, subject, and message are required." },
      { status: 400 }
    )
  }

  const { data, error } = await anon
    .from("leads")
    .insert({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      service: service || "General",
      status: "new",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data.id })
}

// GET - authenticated: fetch leads with optional filters
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const service = searchParams.get("service")
  const search = searchParams.get("search")
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  if (service && service !== "all") {
    query = query.eq("service", service)
  }

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`
    )
  }

  if (from) {
    query = query.gte("created_at", from)
  }

  if (to) {
    query = query.lte("created_at", to + "T23:59:59.999Z")
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
