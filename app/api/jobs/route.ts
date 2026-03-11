import { createClient as createAnonClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

function getAnonClient() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET - public: fetch published jobs
export async function GET() {
  try {
    const supabase = getAnonClient()
    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST - authenticated: create a new job posting
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from("job_postings")
      .insert([body])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create job" },
      { status: 500 }
    )
  }
}
