import { Badge } from "@/components/ui/badge"

interface SectionHeroProps {
  badge?: string
  title: string
  highlight?: string
  description: string
}

export function SectionHero({
  badge,
  title,
  highlight,
  description,
}: SectionHeroProps) {
  return (
    <section className="relative overflow-hidden bg-foreground py-24 text-background lg:py-32">
      {/* Abstract decorative shapes */}
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

      <div className="relative mx-auto max-w-7xl px-4 text-center lg:px-8">
        {badge && (
          <Badge
            variant="outline"
            className="mb-4 border-background/20 text-background/70"
          >
            {badge}
          </Badge>
        )}
        <h1
          className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight lg:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}{" "}
          {highlight && (
            <span style={{ color: "#a78bfa" }}>{highlight}</span>
          )}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-background/70">
          {description}
        </p>
      </div>
    </section>
  )
}
