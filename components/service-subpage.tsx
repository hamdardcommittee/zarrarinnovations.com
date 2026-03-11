import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionHero } from "@/components/section-hero"
import { CTABanner } from "@/components/cta-banner"
import type { SubPage, SectionData } from "@/lib/site-data"

interface ServiceSubpageProps {
  section: SectionData
  subPage: SubPage
}

export function ServiceSubpage({ section, subPage }: ServiceSubpageProps) {
  const Icon = subPage.icon
  const otherPages = section.subPages.filter((s) => s.slug !== subPage.slug)

  return (
    <>
      <SectionHero
        badge={`${section.title} / ${subPage.title}`}
        title={subPage.title}
        description={subPage.description}
      />

      {/* Features grid */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-start gap-16 lg:grid-cols-2">
            {/* Left - description & CTA */}
            <div>
              <div
                className="mb-6 flex size-14 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#f5f3fa" }}
              >
                <Icon className="size-7" style={{ color: "#31028f" }} />
              </div>
              <h2
                className="text-balance text-3xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {subPage.title}
              </h2>
              <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground">
                {subPage.description} We deliver end-to-end solutions using
                industry best practices and the latest technologies. Our team
                works closely with you from ideation through deployment and
                beyond.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Get a Quote <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/portfolio">View Portfolio</Link>
                </Button>
              </div>
            </div>

            {/* Right - feature checklist */}
            <div className="rounded-2xl border bg-card p-8 shadow-sm">
              <h3
                className="mb-6 text-lg font-semibold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                What&apos;s Included
              </h3>
              <ul className="flex flex-col gap-4">
                {subPage.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-foreground/80"
                  >
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0"
                      style={{ color: "#31028f" }}
                    />
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related services */}
      {otherPages.length > 0 && (
        <section className="bg-secondary py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 border border-primary/20">
                Related Services
              </Badge>
              <h2
                className="text-balance text-3xl font-bold tracking-tight lg:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Explore more {section.title.toLowerCase()} services
              </h2>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherPages.map((other) => {
                const OtherIcon = other.icon
                return (
                  <Link
                    key={other.slug}
                    href={`/${section.slug}/${other.slug}`}
                    className="group flex items-start gap-4 rounded-xl bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "#f5f3fa" }}
                    >
                      <OtherIcon
                        className="size-5"
                        style={{ color: "#31028f" }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{other.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {other.description}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  )
}
