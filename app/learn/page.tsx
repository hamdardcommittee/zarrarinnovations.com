import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHero } from "@/components/section-hero"
import { CTABanner } from "@/components/cta-banner"

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Articles, guides, and insights on web development, design, and business systems from Zarrar Innovations.",
}

const categories = [
  "Web Development",
  "UI/UX Tips",
  "Business Systems",
  "Shopify",
  "WordPress",
]

const posts = [
  {
    title: "Why Next.js is the Future of Web Development",
    category: "Web Development",
    excerpt:
      "Explore why Next.js has become the framework of choice for modern web applications and how it can benefit your business.",
    readTime: "5 min read",
    date: "Feb 2026",
  },
  {
    title: "10 UI/UX Principles Every Designer Should Know",
    category: "UI/UX Tips",
    excerpt:
      "From visual hierarchy to accessibility, these core principles will elevate your design work to the next level.",
    readTime: "7 min read",
    date: "Jan 2026",
  },
  {
    title: "How a POS System Can Transform Your Retail Business",
    category: "Business Systems",
    excerpt:
      "Modern POS systems do more than process payments. Learn how they can streamline your entire retail operation.",
    readTime: "4 min read",
    date: "Jan 2026",
  },
  {
    title: "Getting Started with Shopify: A Complete Guide",
    category: "Shopify",
    excerpt:
      "Everything you need to know about launching your first Shopify store, from theme selection to payment setup.",
    readTime: "8 min read",
    date: "Dec 2025",
  },
  {
    title: "WordPress vs Custom Development: Which is Right for You?",
    category: "WordPress",
    excerpt:
      "A detailed comparison to help you decide between WordPress and a custom-built solution for your next project.",
    readTime: "6 min read",
    date: "Dec 2025",
  },
  {
    title: "Building Scalable Management Systems",
    category: "Business Systems",
    excerpt:
      "Key architectural decisions that ensure your management system can grow with your business.",
    readTime: "5 min read",
    date: "Nov 2025",
  },
]

export default function LearnPage() {
  return (
    <>
      <SectionHero
        badge="Learn"
        title="Insights &"
        highlight="Resources"
        description="Articles, guides, and tips from our team on web development, design, and building better business systems."
      />

      {/* Category badges */}
      <section className="border-b bg-secondary py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 px-4 lg:px-8">
          {categories.map((cat) => (
            <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-accent">
              {cat}
            </Badge>
          ))}
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card
                key={post.title}
                className="group overflow-hidden border transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className="flex h-40 items-center justify-center"
                  style={{ backgroundColor: "#f5f3fa" }}
                >
                  <Badge variant="secondary">{post.category}</Badge>
                </div>
                <CardContent className="flex flex-col gap-3 p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {post.readTime}
                    </span>
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
                  <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:gap-2">
                    Read article <ArrowRight className="size-3.5" />
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Need help with your project?"
        description="Our team is ready to turn your ideas into reality. Let's chat."
      />
    </>
  )
}
