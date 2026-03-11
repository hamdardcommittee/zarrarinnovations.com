import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHero } from "@/components/section-hero"
import { CTABanner } from "@/components/cta-banner"
import type { SectionData } from "@/lib/site-data"

interface ServiceSectionLandingProps {
  section: SectionData
  processSteps?: { step: string; description: string }[]
}

export function ServiceSectionLanding({
  section,
  processSteps,
}: ServiceSectionLandingProps) {
  return (
    <>
      <SectionHero
        badge={section.title}
        title={`${section.title}`}
        highlight="Services"
        description={section.heroDescription}
      />

      {/* Subpage cards */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              Our {section.title} Services
            </Badge>
            <h2
              className="text-balance text-3xl font-bold tracking-tight lg:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What we offer
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {section.subPages.map((sub) => {
              const Icon = sub.icon
              return (
                <Link
                  key={sub.slug}
                  href={`/${section.slug}/${sub.slug}`}
                  className="group"
                >
                  <Card className="h-full border transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="flex flex-col gap-4 p-6">
                      <div
                        className="flex size-12 items-center justify-center rounded-lg"
                        style={{ backgroundColor: "#f5f3fa" }}
                      >
                        <Icon className="size-6" style={{ color: "#31028f" }} />
                      </div>
                      <div>
                        <h3
                          className="text-lg font-semibold"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {sub.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {sub.description}
                        </p>
                      </div>
                      <ul className="mt-2 flex flex-col gap-2">
                        {sub.features.slice(0, 4).map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle2
                              className="mt-0.5 size-4 shrink-0"
                              style={{ color: "#31028f" }}
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:gap-2">
                        Learn more <ArrowRight className="size-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process steps (optional) */}
      {processSteps && (
        <section className="bg-secondary py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 border border-primary/20">
                Our Process
              </Badge>
              <h2
                className="text-balance text-3xl font-bold tracking-tight lg:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                How we work
              </h2>
            </div>
            <div className="relative mx-auto mt-14 max-w-3xl">
              {processSteps.map((item, i) => (
                <div key={item.step} className="flex gap-6 pb-10 last:pb-0">
                  {/* timeline line */}
                  <div className="flex flex-col items-center">
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: "#31028f" }}
                    >
                      {i + 1}
                    </div>
                    {i < processSteps.length - 1 && (
                      <div className="w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3
                      className="font-semibold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {item.step}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  )
}
