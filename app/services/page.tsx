import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHero } from "@/components/section-hero"
import { CTABanner } from "@/components/cta-banner"
import {
  designSection,
  developmentSection,
  managementsSection,
} from "@/lib/site-data"
import type { SectionData } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore all services offered by Zarrar Innovations including web development, UI/UX design, mobile apps, and management systems.",
}

/* ─── Category Block ─── */
function ServiceCategory({ section }: { section: SectionData }) {
  const SectionIcon = section.icon

  return (
    <div>
      {/* Category header */}
      <div className="mb-8 flex items-center gap-4">
        <div
          className="flex size-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: "#f5f3fa" }}
        >
          <SectionIcon className="size-6" style={{ color: "#31028f" }} />
        </div>
        <div>
          <Link
            href={`/${section.slug}`}
            className="group flex items-center gap-2"
          >
            <h2
              className="text-2xl font-bold tracking-tight lg:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {section.title}
            </h2>
            <ArrowRight className="size-5 text-primary opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
          </Link>
          <p className="mt-1 text-muted-foreground">{section.description}</p>
        </div>
      </div>

      {/* Service cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    className="flex size-11 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#f5f3fa" }}
                  >
                    <Icon className="size-5" style={{ color: "#31028f" }} />
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

                  {/* Feature checklist */}
                  <ul className="mt-1 flex flex-col gap-2">
                    {sub.features.slice(0, 4).map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-3.5 shrink-0"
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
  )
}

/* ─── Page ─── */
export default function ServicesPage() {
  const sections = [designSection, developmentSection, managementsSection]

  return (
    <>
      <SectionHero
        badge="Our Services"
        title="Everything You Need to"
        highlight="Build & Grow"
        description="From pixel-perfect designs to enterprise-grade management systems, we offer end-to-end digital solutions under one roof."
      />

      {/* All categories */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Quick nav pills */}
          <div className="mb-16 flex flex-wrap justify-center gap-3">
            {sections.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="size-4" style={{ color: "#31028f" }} />
                  {s.title}
                </a>
              )
            })}
          </div>

          {/* Section blocks */}
          <div className="flex flex-col gap-24">
            {sections.map((section) => (
              <div key={section.slug} id={section.slug}>
                <ServiceCategory section={section} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get a quote CTA */}
      <CTABanner
        title="Ready to get started?"
        description="Tell us about your project and get a free consultation with our team."
      />
    </>
  )
}
