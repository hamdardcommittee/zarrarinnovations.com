"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Clock, User, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHero } from "@/components/section-hero"
import { CTABanner } from "@/components/cta-banner"
import { blogPosts as staticBlogPosts, blogCategories } from "@/lib/site-data"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface BlogPostRow {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  read_time: string
  date: string
  author: string
  content: string[]
  published: boolean
}

function mapRowToDisplay(row: BlogPostRow) {
  return {
    title: row.title,
    slug: row.slug,
    category: row.category,
    excerpt: row.excerpt,
    readTime: row.read_time,
    date: row.date,
    author: row.author,
    content: row.content,
  }
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [posts, setPosts] = useState(staticBlogPosts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false })

        if (!error && data && data.length > 0) {
          setPosts(data.map(mapRowToDisplay))
        }
      } catch {
        // Fallback to static data silently
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const filtered =
    activeCategory === "All"
      ? posts
      : posts.filter((p) => p.category === activeCategory)

  return (
    <>
      <SectionHero
        badge="Blog"
        title="Insights &"
        highlight="Resources"
        description="Guides, tips, comparisons, and industry trends from our team to help you make smarter technology decisions."
      />

      {/* Category filter */}
      <section className="border-b bg-secondary py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 px-4 lg:px-8">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                activeCategory === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground/70 hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No posts found in this category.
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <Card className="flex h-full flex-col overflow-hidden border transition-all hover:shadow-lg hover:-translate-y-1">
                    {/* Category bar */}
                    <div className="flex items-center justify-between bg-secondary px-6 py-3">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <CardContent className="flex flex-1 flex-col gap-3 p-6">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="size-3" />
                        {post.author}
                        <span className="text-border">|</span>
                        {post.date}
                      </div>

                      <h3
                        className="text-lg font-semibold leading-snug"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {post.title}
                      </h3>

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>

                      <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary transition-colors group-hover:gap-2">
                        Read article <ArrowRight className="size-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner
        title="Need expert help?"
        description="Our team builds the solutions we write about. Let us handle your next project."
      />
    </>
  )
}
