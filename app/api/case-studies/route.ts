import { createClient } from "@/lib/supabase/server"
import { createClient as createAnonClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { caseStudies } from "@/lib/site-data"

function getAnonClient() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET - fetch all case studies
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const admin = searchParams.get("admin") === "true"

  try {
    const supabase = admin ? await createClient() : getAnonClient()
    
    let query = supabase
      .from("case_studies")
      .select("*")
      .order("created_at", { ascending: false })

    if (!admin) {
      query = query.eq("published", true)
    }

    const { data, error } = await query

    if (error) throw error
    
    if (data && data.length > 0) {
      return NextResponse.json(data)
    }
    
    // Return static data as fallback
    return NextResponse.json(
      caseStudies.map((cs, i) => ({
        id: `static-${i}`,
        ...cs,
        published: true,
        images: [],
        content_blocks: [],
        created_at: new Date().toISOString(),
      }))
    )
  } catch {
    return NextResponse.json(
      caseStudies.map((cs, i) => ({
        id: `static-${i}`,
        ...cs,
        published: true,
        images: [],
        content_blocks: [],
        created_at: new Date().toISOString(),
      }))
    )
  }
}

// POST - create new case study (admin only)
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    const { data, error } = await supabase
      .from("case_studies")
      .insert({
        title: body.title,
        slug: body.slug,
        client: body.client,
        industry: body.industry,
        duration: body.duration,
        problem: body.problem,
        solution: body.solution,
        process: body.process || [],
        tech_stack: body.tech_stack || [],
        results: body.results || [],
        images: body.images || [],
        content_blocks: body.content_blocks || [],
        excerpt: body.excerpt,
        published: body.published ?? false,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error("Error creating case study:", err)
    return NextResponse.json({ error: "Failed to create case study" }, { status: 500 })
  }
}
