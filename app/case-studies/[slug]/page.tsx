import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock,
  CheckCircle2,
  TrendingUp,
  Layers,
  Target,
  Lightbulb,
  ListChecks,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CTABanner } from "@/components/cta-banner"
import { caseStudies } from "@/lib/site-data"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return caseStudies.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const study = caseStudies.find((s) => s.slug === slug)
  if (!study) return {}
  return {
    title: study.title,
    description: study.excerpt,
  }
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params
  const study = caseStudies.find((s) => s.slug === slug)
  if (!study) notFound()

  const currentIndex = caseStudies.indexOf(study)
  const prev = currentIndex > 0 ? caseStudies[currentIndex - 1] : null
  const next =
    currentIndex < caseStudies.length - 1 ? caseStudies[currentIndex + 1] : null

  return (
    <>
      {/* ── Hero ── */}
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

        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href="/case-studies"
            className="mb-6 inline-flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-background"
          >
            <ArrowLeft className="size-4" />
            Back to Case Studies
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="outline"
              className="border-background/20 text-background/70"
            >
              {study.industry}
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-background/20 text-background/70"
            >
              <Clock className="size-3" />
              {study.duration}
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-background/20 text-background/70"
            >
              <Building2 className="size-3" />
              {study.client}
            </Badge>
          </div>

          <h1
            className="mt-6 max-w-4xl text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {study.title}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-background/70">
            {study.excerpt}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* ── Project Info Sidebar + Content ── */}
        <div className="grid gap-12 py-20 lg:grid-cols-3 lg:py-28">
          {/* Left content (2 cols) */}
          <div className="flex flex-col gap-16 lg:col-span-2">
            {/* Problem */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#f5f3fa" }}
                >
                  <Target className="size-5" style={{ color: "#31028f" }} />
                </div>
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  The Problem
                </h2>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                {study.problem}
              </p>
            </div>

            {/* Solution */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#f5f3fa" }}
                >
                  <Lightbulb className="size-5" style={{ color: "#31028f" }} />
                </div>
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  The Solution
                </h2>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                {study.solution}
              </p>
            </div>

            {/* Process */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#f5f3fa" }}
                >
                  <ListChecks className="size-5" style={{ color: "#31028f" }} />
                </div>
                <h2
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Our Process
                </h2>
              </div>
              <div className="relative ml-1">
                {study.process.map((step, i) => (
                  <div key={step} className="flex gap-5 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className="flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: "#31028f" }}
                      >
                        {i + 1}
                      </div>
                      {i < study.process.length - 1 && (
                        <div className="w-px flex-1 bg-border" />
                      )}
                    </div>
                    <p className="pb-4 text-sm leading-relaxed text-muted-foreground">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            {/* Tech Stack card */}
            <Card className="border">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Layers className="size-5" style={{ color: "#31028f" }} />
                  <h3
                    className="font-semibold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Tech Stack
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {study.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project details card */}
            <Card className="border">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Client</span>
                  <span className="font-medium">{study.client}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Industry</span>
                  <span className="font-medium">{study.industry}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duration</span>
                  <span className="font-medium">{study.duration}</span>
                </div>
              </CardContent>
            </Card>

            {/* CTA card */}
            <Card
              className="border-0"
              style={{ backgroundColor: "#31028f" }}
            >
              <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                <h3
                  className="font-semibold text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Want similar results?
                </h3>
                <p className="text-sm text-white/80">
                  {"Let's discuss your project and find the best solution."}
                </p>
                <Button
                  asChild
                  className="w-full bg-white text-[#31028f] hover:bg-white/90"
                >
                  <Link href="/contact">Get a Free Quote</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Results ── */}
        <section className="border-t py-20 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="size-6" style={{ color: "#31028f" }} />
              <h2
                className="text-3xl font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Results & Impact
              </h2>
            </div>
            <p className="text-muted-foreground">
              Measurable outcomes that speak for themselves.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {study.results.map((r) => (
              <div
                key={r.metric}
                className="flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm"
              >
                <CheckCircle2
                  className="mb-3 size-6"
                  style={{ color: "#31028f" }}
                />
                <p
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: "#31028f",
                  }}
                >
                  {r.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {r.metric}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Prev / Next ── */}
        <section className="border-t py-12">
          <div className="flex items-center justify-between gap-4">
            {prev ? (
              <Link
                href={`/case-studies/${prev.slug}`}
                className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Previous
                  </span>
                  <span className="font-medium text-foreground">
                    {prev.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/case-studies/${next.slug}`}
                className="group flex items-center gap-3 text-right text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <div>
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                    Next
                  </span>
                  <span className="font-medium text-foreground">
                    {next.title}
                  </span>
                </div>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      </div>

      <CTABanner
        title="Ready to start your project?"
        description="Get a free consultation and see how we can help achieve similar results for your business."
      />
    </>
  )
}
