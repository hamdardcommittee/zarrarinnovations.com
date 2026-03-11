import { createClient } from "@/lib/supabase/server"
import { createClient as createAnonClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

function getAnonClient() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET - public: get a single job by ID
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getAnonClient()
    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }
}

// PUT - authenticated: update a job posting
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
      .update(body)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update job" },
      { status: 500 }
    )
  }
}

// DELETE - authenticated: delete a job posting
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("job_postings").delete().eq("id", id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete job" },
      { status: 500 }
    )
  }
}
