import type { Metadata } from "next"
import { Target, Eye, Compass } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SectionHero } from "@/components/section-hero"
import { CTABanner } from "@/components/cta-banner"

export const metadata: Metadata = {
  title: "Our Mission",
  description:
    "The vision, mission, and core values that drive Zarrar Innovations.",
}

const values = [
  "Excellence in every line of code",
  "Transparency and open communication",
  "Continuous learning and growth",
  "Respect for every team member and client",
  "Innovation over convention",
  "Delivering real business impact",
]

export default function MissionPage() {
  return (
    <>
      <SectionHero
        badge="Our Mission"
        title="Driven by purpose,"
        highlight="powered by passion."
        description="We exist to empower businesses with technology that makes a real difference."
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {[
              {
                icon: Eye,
                title: "Our Vision",
                body: "To be the go-to remote software partner for businesses worldwide — known for quality, speed, and genuine partnership.",
              },
              {
                icon: Target,
                title: "Our Mission",
                body: "To deliver scalable, beautifully crafted digital solutions that help businesses grow, operate efficiently, and connect with their audiences.",
              },
              {
                icon: Compass,
                title: "Core Values",
                body: "Everything we do is guided by a set of principles that keep us honest, ambitious, and client-focused.",
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-xl border bg-card p-8">
                  <div
                    className="mb-4 flex size-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#f5f3fa" }}
                  >
                    <Icon className="size-6" style={{ color: "#31028f" }} />
                  </div>
                  <h2
                    className="text-xl font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Values list */}
          <div className="mx-auto mt-20 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              What We Stand For
            </Badge>
            <h2
              className="text-balance text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Our core values
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 text-left">
              {values.map((v, i) => (
                <div
                  key={v}
                  className="flex items-center gap-3 rounded-lg bg-secondary p-4"
                >
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: "#31028f" }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  )
}
