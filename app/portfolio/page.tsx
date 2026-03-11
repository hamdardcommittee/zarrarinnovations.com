"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHero } from "@/components/section-hero"
import { CTABanner } from "@/components/cta-banner"
import { portfolioProjects } from "@/lib/site-data"
import { cn } from "@/lib/utils"

const categories = [
  "All",
  "Web Development",
  "UI/UX Design",
  "Management Systems",
  "Mobile Apps",
  "E-Commerce",
]

export default function PortfolioPage() {
  const [filter, setFilter] = useState("All")
  const filtered =
    filter === "All"
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.category === filter)

  return (
    <>
      <SectionHero
        badge="Portfolio"
        title="Our recent"
        highlight="work."
        description="A selection of projects we've delivered for clients across industries and geographies."
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  filter === cat
                    ? "text-white"
                    : "bg-secondary text-foreground/70 hover:bg-accent"
                )}
                style={
                  filter === cat ? { backgroundColor: "#31028f" } : undefined
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project grid */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className="group"
              >
                <Card className="h-full overflow-hidden border transition-all hover:shadow-lg hover:-translate-y-1">
                  <div
                    className="flex h-48 items-center justify-center"
                    style={{ backgroundColor: "#f5f3fa" }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: "#31028f" }}
                    >
                      {project.category}
                    </span>
                  </div>
                  <CardContent className="flex flex-col p-6">
                    <h3
                      className="font-semibold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                      View Project <ArrowRight className="size-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              No projects found in this category.
            </div>
          )}
        </div>
      </section>

      <CTABanner
        title="Want a project like these?"
        description="Let's discuss how we can bring your idea to life."
      />
    </>
  )
}
