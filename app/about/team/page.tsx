import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { SectionHero } from "@/components/section-hero"
import { CTABanner } from "@/components/cta-banner"

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the talented, globally distributed team behind Zarrar Innovations.",
}

const team = [
  { name: "Zarrar Ahmed", role: "Founder & CEO", location: "Pakistan" },
  { name: "Ayesha Khan", role: "Lead Designer", location: "UAE" },
  { name: "Ali Hassan", role: "Full Stack Developer", location: "Pakistan" },
  { name: "Sara Malik", role: "Project Manager", location: "UK" },
  { name: "Usman Raza", role: "Mobile Developer", location: "Canada" },
  { name: "Fatima Noor", role: "UI/UX Designer", location: "Pakistan" },
]

export default function TeamPage() {
  return (
    <>
      <SectionHero
        badge="Our Team"
        title="Meet the people behind"
        highlight="the innovation."
        description="A globally distributed team of engineers, designers, and strategists working together to build exceptional software."
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              Remote-First Culture
            </Badge>
            <h2
              className="text-balance text-3xl font-bold tracking-tight lg:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Talent has no geography
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Our team works across multiple time zones, bringing diverse
              perspectives and round-the-clock productivity to every project.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="flex flex-col items-center rounded-xl border bg-card p-8 text-center"
              >
                <div
                  className="mb-4 flex size-20 items-center justify-center rounded-full text-2xl font-bold text-white"
                  style={{ backgroundColor: "#31028f" }}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <h3
                  className="font-semibold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {member.name}
                </h3>
                <p className="mt-1 text-sm" style={{ color: "#31028f" }}>
                  {member.role}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {member.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Want to join our team?"
        description="We're always looking for talented people to join our remote-first company."
      />
    </>
  )
}
