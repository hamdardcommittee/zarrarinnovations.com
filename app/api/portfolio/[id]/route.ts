import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET - fetch single portfolio project
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }
}

// PATCH - update portfolio project
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    const { data, error } = await supabase
      .from("portfolio_projects")
      .update({
        title: body.title,
        slug: body.slug,
        category: body.category,
        description: body.description,
        long_description: body.long_description,
        tags: body.tags,
        features: body.features,
        images: body.images,
        content_blocks: body.content_blocks,
        live_url: body.live_url,
        published: body.published,
        featured: body.featured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error("Error updating portfolio project:", err)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

// DELETE - delete portfolio project
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from("portfolio_projects")
      .delete()
      .eq("id", id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error deleting portfolio project:", err)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
