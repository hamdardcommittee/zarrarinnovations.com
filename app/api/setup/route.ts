import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { blogPosts } from "@/lib/site-data"

export async function POST() {
  try {
    const supabase = await createClient()

    // Try inserting categories
    const categories = [
      "Web Development",
      "UI/UX Design",
      "E-Commerce",
      "Business Systems",
      "Mobile Apps",
      "Tech Trends",
    ]

    const { error: catError } = await supabase
      .from("blog_categories")
      .upsert(
        categories.map((name) => ({ name })),
        { onConflict: "name" }
      )

    if (catError) {
      return NextResponse.json(
        { error: "Categories table may not exist. Please run the SQL migration first.", details: catError.message },
        { status: 500 }
      )
    }

    // Seed blog posts
    const postsToInsert = blogPosts.map((post) => ({
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      read_time: post.readTime,
      date: post.date,
      author: post.author,
      content: post.content,
      published: true,
    }))

    const { error: postError } = await supabase
      .from("blog_posts")
      .upsert(postsToInsert, { onConflict: "slug" })

    if (postError) {
      return NextResponse.json(
        { error: "Blog posts table may not exist. Please run the SQL migration first.", details: postError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully" })
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error", details: String(err) },
      { status: 500 }
    )
  }
}
