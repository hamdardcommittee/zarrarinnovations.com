import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, User, Calendar, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CTABanner } from "@/components/cta-banner"
import { createClient } from "@/lib/supabase/server"
import { blogPosts as staticBlogPosts } from "@/lib/site-data"
import type { Metadata } from "next"

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

async function getPost(slug: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()

    if (!error && data) {
      return data as BlogPostRow
    }
  } catch {
    // Fallback to static
  }

  const staticPost = staticBlogPosts.find((p) => p.slug === slug)
  if (!staticPost) return null

  return {
    id: staticPost.slug,
    title: staticPost.title,
    slug: staticPost.slug,
    category: staticPost.category,
    excerpt: staticPost.excerpt,
    read_time: staticPost.readTime,
    date: staticPost.date,
    author: staticPost.author,
    content: staticPost.content,
    published: true,
  } as BlogPostRow
}

async function getRelatedPosts(category: string, currentSlug: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("blog_posts")
      .select("title, slug, category, excerpt, read_time, date")
      .eq("published", true)
      .eq("category", category)
      .neq("slug", currentSlug)
      .order("created_at", { ascending: false })
      .limit(3)

    if (!error && data && data.length > 0) {
      return data
    }
  } catch {
    // Fallback
  }

  return staticBlogPosts
    .filter((p) => p.category === category && p.slug !== currentSlug)
    .slice(0, 3)
    .map((p) => ({
      title: p.title,
      slug: p.slug,
      category: p.category,
      excerpt: p.excerpt,
      read_time: p.readTime,
      date: p.date,
    }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.category, post.slug)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground py-24 text-background lg:py-32">
        <div
          className="absolute -right-40 -top-40 size-96 rounded-full opacity-10"
          style={{ backgroundColor: "#31028f" }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -left-20 size-64 rounded-full opacity-10"
          style={{ backgroundColor: "#31028f" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl px-4 lg:px-8">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-background"
          >
            <ArrowLeft className="size-4" />
            Back to Blog
          </Link>

          <Badge
            variant="outline"
            className="mb-4 border-background/20 text-background/70"
          >
            <Tag className="mr-1 size-3" />
            {post.category}
          </Badge>

          <h1
            className="text-balance text-3xl font-bold tracking-tight lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {post.title}
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-background/70">
            {post.excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-background/60">
            <span className="flex items-center gap-2">
              <User className="size-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="size-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="size-4" />
              {post.read_time}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <div className="flex flex-col gap-6">
            {post.content.map((paragraph, index) => (
              <p
                key={index}
                className="text-lg leading-relaxed text-foreground/80"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Share / Tags */}
          <div className="mt-16 flex items-center justify-between border-t pt-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Category:
              </span>
              <Badge variant="secondary">{post.category}</Badge>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/blog">
                <ArrowLeft className="size-3.5" />
                All posts
              </Link>
            </Button>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t bg-secondary py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2
              className="mb-10 text-center text-2xl font-bold tracking-tight lg:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Related Articles
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group"
                >
                  <div className="flex h-full flex-col rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                    <Badge variant="secondary" className="mb-3 w-fit">
                      {related.category}
                    </Badge>
                    <h3
                      className="mb-2 text-lg font-semibold leading-snug"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {related.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {related.excerpt}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-primary transition-colors group-hover:gap-2">
                      Read more <ArrowLeft className="size-3.5 rotate-180" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner
        title="Need expert help?"
        description="Our team builds the solutions we write about. Let us handle your next project."
      />
    </>
  )
}
