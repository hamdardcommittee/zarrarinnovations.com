import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Globe, Users, Zap, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionHero } from "@/components/section-hero"
import { CTABanner } from "@/components/cta-banner"
import { stats } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Zarrar Innovations — a remote-first software company with a global team.",
}

export default function AboutPage() {
  return (
    <>
      <SectionHero
        badge="About Us"
        title="Building the future,"
        highlight="remotely."
        description="Zarrar Innovations is a remote-first software company bringing together talented engineers, designers, and strategists from around the world."
      />

      {/* Stats */}
      <section style={{ backgroundColor: "#31028f" }}>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p
                className="text-3xl font-bold text-white lg:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About content */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid items-start gap-16 lg:grid-cols-2">
            <div>
              <Badge variant="secondary" className="mb-4">
                Our Story
              </Badge>
              <h2
                className="text-balance text-3xl font-bold tracking-tight lg:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Innovation without{" "}
                <span style={{ color: "#31028f" }}>boundaries</span>
              </h2>
              <div className="mt-6 flex flex-col gap-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded with the belief that great software can be built from
                  anywhere, Zarrar Innovations operates as a fully remote company.
                  Our team spans multiple time zones, bringing diverse perspectives
                  to every project we undertake.
                </p>
                <p>
                  We specialize in web development, UI/UX design, mobile apps, and
                  enterprise management systems. From startups to established
                  businesses, we help our clients transform their digital presence
                  with scalable, modern solutions.
                </p>
                <p>
                  Our commitment to quality, fast delivery, and transparent
                  communication has earned us the trust of clients across the globe.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <Button asChild size="lg">
                  <Link href="/about/mission">
                    Our Mission <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/about/team">Meet the Team</Link>
                </Button>
              </div>
            </div>

            {/* Values */}
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: Globe,
                  title: "Global Presence",
                  description:
                    "Team members and clients across continents, collaborating seamlessly.",
                },
                {
                  icon: Zap,
                  title: "Fast Delivery",
                  description:
                    "Agile sprints and rapid prototyping get products to market quickly.",
                },
                {
                  icon: Users,
                  title: "Remote-First Culture",
                  description:
                    "Work from anywhere. We believe talent has no geography.",
                },
                {
                  icon: Heart,
                  title: "Client-Centric",
                  description:
                    "Your success is our success. We invest in long-term partnerships.",
                },
              ].map((value) => {
                const Icon = value.icon
                return (
                  <div
                    key={value.title}
                    className="rounded-xl bg-secondary p-6"
                  >
                    <div
                      className="mb-3 flex size-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "#eee9f7" }}
                    >
                      <Icon className="size-5" style={{ color: "#31028f" }} />
                    </div>
                    <h3
                      className="font-semibold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {value.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <CTABanner
        title="Want to join our team?"
        description="We're always looking for talented people. Check out our open positions."
      />
    </>
  )
}
