import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET - fetch single case study
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Case study not found" }, { status: 404 })
  }
}

// PATCH - update case study
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
      .from("case_studies")
      .update({
        title: body.title,
        slug: body.slug,
        client: body.client,
        industry: body.industry,
        duration: body.duration,
        problem: body.problem,
        solution: body.solution,
        process: body.process,
        tech_stack: body.tech_stack,
        results: body.results,
        images: body.images,
        content_blocks: body.content_blocks,
        excerpt: body.excerpt,
        published: body.published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (err) {
    console.error("Error updating case study:", err)
    return NextResponse.json({ error: "Failed to update case study" }, { status: 500 })
  }
}

// DELETE - delete case study
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
      .from("case_studies")
      .delete()
      .eq("id", id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error deleting case study:", err)
    return NextResponse.json({ error: "Failed to delete case study" }, { status: 500 })
  }
}
