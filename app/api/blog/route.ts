import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (category && category !== "All") {
    query = query.eq("category", category)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: body.title,
      slug: body.slug,
      category: body.category,
      excerpt: body.excerpt,
      read_time: body.read_time || "5 min read",
      date: body.date,
      author: body.author || "Zarrar Innovations",
      content: body.content || [],
      content_blocks: body.content_blocks || [],
      featured_image: body.featured_image || null,
      images: body.images || [],
      published: body.published ?? false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
