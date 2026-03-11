import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from("products")
    .insert({
      title: body.title,
      slug: body.slug,
      short_description: body.short_description,
      description: body.description,
      category: body.category || "System",
      features: body.features || [],
      screenshots: body.screenshots || [],
      pricing: body.pricing || null,
      demo_video_url: body.demo_video_url || null,
      faq: body.faq || [],
      published: body.published ?? false,
      featured: body.featured ?? false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
