import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

function createAnonClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// GET - public: fetch all published media items
export async function GET() {
  try {
    const anon = createAnonClient()
    const { data, error } = await anon
      .from("media_slider")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true })

    if (error) {
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json([])
  }
}

// POST - authenticated: add new media item
export async function POST(request: NextRequest) {
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
      .from("media_slider")
      .insert({
        type: body.type || "image",
        src: body.src,
        thumbnail: body.thumbnail || null,
        title: body.title || null,
        description: body.description || null,
        published: body.published ?? true,
        sort_order: body.sort_order || 0,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to add media item" },
      { status: 500 }
    )
  }
}
