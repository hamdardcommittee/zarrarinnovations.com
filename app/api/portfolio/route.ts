import { createClient } from "@/lib/supabase/server"
import { createClient as createAnonClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { portfolioProjects } from "@/lib/site-data"

function getAnonClient() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET - fetch all portfolio projects
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const admin = searchParams.get("admin") === "true"

  try {
    const supabase = admin ? await createClient() : getAnonClient()
    
    let query = supabase
      .from("portfolio_projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (!admin) {
      query = query.eq("published", true)
    }

    const { data, error } = await query

    if (error) throw error
    
    // Return database data if available, otherwise return static data
    if (data && data.length > 0) {
      return NextResponse.json(data)
    }
    
    // Return static data as fallback
    return NextResponse.json(
      portfolioProjects.map((p, i) => ({
        id: `static-${i}`,
        ...p,
        published: true,
        featured: i < 3,
        images: [],
        content_blocks: [],
        created_at: new Date().toISOString(),
      }))
    )
  } catch {
    // Return static data on error
    return NextResponse.json(
      portfolioProjects.map((p, i) => ({
        id: `static-${i}`,
        ...p,
        published: true,
        featured: i < 3,
        images: [],
        content_blocks: [],
        created_at: new Date().toISOString(),
      }))
    )
  }
}

// POST - create new portfolio project (admin only)
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    const { data, error } = await supabase
      .from("portfolio_projects")
      .insert({
        title: body.title,
        slug: body.slug,
        category: body.category,
        description: body.description,
        long_description: body.long_description,
        tags: body.tags || [],
        features: body.features || [],
        images: body.images || [],
        content_blocks: body.content_blocks || [],
        live_url: body.live_url,
        published: body.published ?? false,
        featured: body.featured ?? false,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error("Error creating portfolio project:", err)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
