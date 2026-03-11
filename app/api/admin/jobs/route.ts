import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET - authenticated: get ALL jobs (including unpublished)
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
