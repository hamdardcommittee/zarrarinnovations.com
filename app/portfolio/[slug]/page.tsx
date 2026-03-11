import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CTABanner } from "@/components/cta-banner"
import { portfolioProjects } from "@/lib/site-data"

export async function generateStaticParams() {
  return portfolioProjects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = portfolioProjects.find((p) => p.slug === slug)
  if (!project) return { title: "Project Not Found" }
  return {
    title: project.title,
    description: project.description,
  }
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = portfolioProjects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  // Get related projects (same category, excluding current)
  const related = portfolioProjects
    .filter((p) => p.category === project.category && p.slug !== project.slug)
    .slice(0, 2)

  // Get prev/next projects for navigation
  const currentIndex = portfolioProjects.findIndex((p) => p.slug === slug)
  const prevProject =
    currentIndex > 0 ? portfolioProjects[currentIndex - 1] : null
  const nextProject =
    currentIndex < portfolioProjects.length - 1
      ? portfolioProjects[currentIndex + 1]
      : null

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground py-20 text-background lg:py-28">
        <div
          className="absolute -right-48 -top-48 size-[500px] rounded-full opacity-[0.07]"
          style={{ backgroundColor: "#31028f" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href="/portfolio"
            className="mb-6 inline-flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-background"
          >
            <ArrowLeft className="size-4" />
            Back to Portfolio
          </Link>

          <Badge
            variant="outline"
            className="mb-4 border-background/20 text-background/70"
          >
            {project.category}
          </Badge>

          <h1
            className="text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {project.title}
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-background/70">
            {project.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-background/20 text-background/70"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Project details */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-5">
            {/* Main content */}
            <div className="lg:col-span-3">
              <h2
                className="text-2xl font-bold tracking-tight lg:text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                About This Project
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                {project.longDescription}
              </p>

              {/* Project preview */}
              <div
                className="mt-10 flex aspect-video items-center justify-center rounded-xl"
                style={{ backgroundColor: "#f5f3fa" }}
              >
                <div className="text-center">
                  <span
                    className="text-lg font-semibold"
                    style={{ color: "#31028f" }}
                  >
                    {project.title}
                  </span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Project Preview
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 flex flex-col gap-8">
                {/* Features */}
                <div className="rounded-xl border p-6">
                  <h3
                    className="mb-4 text-lg font-semibold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Key Features
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {project.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-foreground/80"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0"
                          style={{ color: "#31028f" }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Project info */}
                <div className="rounded-xl border p-6">
                  <h3
                    className="mb-4 text-lg font-semibold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Project Info
                  </h3>
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium">{project.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tech Stack</span>
                      <span className="font-medium">
                        {project.tags.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Button asChild size="lg" className="w-full">
                  <Link href="/contact">
                    Start a Similar Project
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="border-t py-20 lg:py-28" style={{ backgroundColor: "#f5f3fa" }}>
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2
              className="text-center text-2xl font-bold tracking-tight lg:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Related Projects
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {related.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/portfolio/${rp.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden border bg-background transition-all hover:shadow-lg hover:-translate-y-1">
                    <div
                      className="flex h-40 items-center justify-center"
                      style={{ backgroundColor: "#eee9f7" }}
                    >
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#31028f" }}
                      >
                        {rp.category}
                      </span>
                    </div>
                    <CardContent className="p-6">
                      <h3
                        className="font-semibold"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {rp.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {rp.description}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                        View Project <ArrowRight className="size-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Prev / Next navigation */}
      <section className="border-t py-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
          {prevProject ? (
            <Link
              href={`/portfolio/${prevProject.slug}`}
              className="group flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-4" />
              {prevProject.title}
            </Link>
          ) : (
            <div />
          )}
          {nextProject ? (
            <Link
              href={`/portfolio/${nextProject.slug}`}
              className="group flex items-center gap-2 text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {nextProject.title}
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>

      <CTABanner
        title="Ready to build something great?"
        description="Let's discuss your project and bring your ideas to life."
      />
    </>
  )
}
