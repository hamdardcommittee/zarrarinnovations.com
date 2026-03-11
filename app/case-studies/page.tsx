import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Clock, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHero } from "@/components/section-hero"
import { CTABanner } from "@/components/cta-banner"
import { caseStudies } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Deep dives into real client projects by Zarrar Innovations. See the problems we solved, the process, tech stack, and measurable results.",
}

export default function CaseStudiesPage() {
  return (
    <>
      <SectionHero
        badge="Case Studies"
        title="Proof in"
        highlight="Results"
        description="Explore detailed breakdowns of real projects - the problems we solved, the process we followed, and the measurable outcomes we delivered."
      />

      {/* Case study cards */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="group"
              >
                <Card className="flex h-full flex-col overflow-hidden border transition-all hover:shadow-lg hover:-translate-y-1">
                  {/* Header bar */}
                  <div
                    className="flex items-center gap-3 px-6 py-4"
                    style={{ backgroundColor: "#f5f3fa" }}
                  >
                    <Building2
                      className="size-5 shrink-0"
                      style={{ color: "#31028f" }}
                    />
                    <div className="flex flex-1 items-center justify-between text-sm">
                      <span className="font-medium" style={{ color: "#31028f" }}>
                        {study.industry}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="size-3" />
                        {study.duration}
                      </span>
                    </div>
                  </div>

                  <CardContent className="flex flex-1 flex-col gap-3 p-6">
                    <h3
                      className="text-lg font-semibold leading-snug"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {study.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {study.excerpt}
                    </p>

                    {/* Key results preview */}
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                      {study.results.slice(0, 2).map((r) => (
                        <Badge key={r.metric} variant="secondary" className="text-xs">
                          {r.metric}: {r.value}
                        </Badge>
                      ))}
                    </div>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {study.techStack.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:gap-2">
                      Read Case Study <ArrowRight className="size-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Want results like these?"
        description="Let us show you what we can build for your business. Get a free consultation today."
      />
    </>
  )
}
