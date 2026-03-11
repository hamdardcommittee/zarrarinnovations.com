import { createClient } from "@/lib/supabase/server"
import { createClient as createAnonClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

function getAnonClient() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET - authenticated: fetch all applications
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // First try to get applications with job postings relation
    const { data, error } = await supabase
      .from("job_applications")
      .select(`
        *,
        jobs:job_postings(title, department, slug)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      // If relation fails, fetch without it
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (fallbackError) throw fallbackError
      return NextResponse.json(fallbackData || [])
    }
    
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

// POST - public: submit a new application
export async function POST(request: Request) {
  try {
    const supabase = getAnonClient()
    const body = await request.json()

    if (!body.full_name || !body.email || !body.job_id) {
      return NextResponse.json(
        { error: "Name, email, and job are required." },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("job_applications")
      .insert([
        {
          job_id: body.job_id,
          full_name: body.full_name,
          email: body.email,
          phone: body.phone || null,
          cover_letter: body.cover_letter || null,
          portfolio_url: body.portfolio_url || null,
          linkedin_url: body.linkedin_url || null,
          experience_years: body.experience_years || null,
          current_role: body.current_role || null,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to submit application",
      },
      { status: 500 }
    )
  }
}
