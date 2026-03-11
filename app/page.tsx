import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CTABanner } from "@/components/cta-banner"
import { TechStack } from "@/components/tech-stack"
import { HomeMediaSlider } from "@/components/home-media-slider"
import {
  coreServices,
  whyChooseUs,
  stats,
  portfolioProjects,
} from "@/lib/site-data"
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Zap,
  Shield,
  Code,
} from "lucide-react"

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-foreground py-28 text-background lg:py-36">
      {/* decorative blobs */}
      <div
        className="absolute -right-48 -top-48 size-[500px] rounded-full opacity-[0.07]"
        style={{ backgroundColor: "#31028f" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 size-[400px] rounded-full opacity-[0.07]"
        style={{ backgroundColor: "#31028f" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="mb-6 border-background/20 text-background/70"
          >
            Remote-First Software Company
          </Badge>

          <h1
            className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Your Vision, Our{" "}
            <span style={{ color: "#a78bfa" }}>Innovations</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-background/70 md:text-xl">
            We design, develop, and deliver scalable digital solutions — from
            stunning websites to enterprise management systems — for clients
            worldwide.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="px-8">
              <Link href="/contact">
                Get Started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background"
            >
              <Link href="/portfolio">View Portfolio</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Stats ---------- */
function Stats() {
  return (
    <section className="border-b" style={{ backgroundColor: "#31028f" }}>
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
  )
}

/* ---------- Core Services ---------- */
function CoreServices() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            What We Do
          </Badge>
          <h2
            className="text-balance text-3xl font-bold tracking-tight lg:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Our Core Services
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            From concept to launch, we cover every aspect of your digital
            presence with expert craftsmanship.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coreServices.map((service) => {
            const Icon = service.icon
            return (
              <Link key={service.title} href={service.href} className="group">
                <Card className="h-full border bg-card transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardContent className="flex flex-col items-start gap-4 p-6">
                    <div
                      className="flex size-12 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "#f5f3fa" }}
                    >
                      <Icon className="size-6" style={{ color: "#31028f" }} />
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                        {service.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
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
  )
}

/* ---------- Why Choose Us ---------- */
function WhyChooseUs() {
  return (
    <section className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <Badge variant="secondary" className="mb-4 border border-primary/20">
              Why Zarrar Innovations
            </Badge>
            <h2
              className="text-balance text-3xl font-bold tracking-tight lg:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Built for speed, designed for{" "}
              <span style={{ color: "#31028f" }}>scale</span>
            </h2>
            <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground">
              We combine a globally distributed team with modern technology to
              deliver products that grow with your business.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/about">
                  Learn About Us <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {whyChooseUs.map((item, i) => {
              const icons = [Globe, Zap, Shield, Code]
              const Icon = icons[i % icons.length]
              return (
                <div
                  key={item.title}
                  className="rounded-xl bg-card p-6 shadow-sm"
                >
                  <div
                    className="mb-3 flex size-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#f5f3fa" }}
                  >
                    <Icon className="size-5" style={{ color: "#31028f" }} />
                  </div>
                  <h3
                    className="font-semibold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Featured Portfolio ---------- */
function FeaturedPortfolio() {
  const featured = portfolioProjects.slice(0, 3)

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Our Work
          </Badge>
          <h2
            className="text-balance text-3xl font-bold tracking-tight lg:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Featured Portfolio
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            A glimpse of the projects we have brought to life for our clients
            around the globe.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {featured.map((project) => (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="group"
            >
              <Card className="overflow-hidden border transition-all hover:shadow-lg hover:-translate-y-1">
                <div
                  className="flex h-48 items-center justify-center"
                  style={{ backgroundColor: "#f5f3fa" }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#31028f" }}
                  >
                    {project.category}
                  </span>
                </div>
                <CardContent className="p-6">
                  <h3
                    className="font-semibold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:gap-2">
                    View Project <ArrowRight className="size-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/portfolio">
              View Full Portfolio <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ---------- Media Showcase ---------- */
function MediaShowcase() {
  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            Our Journey
          </Badge>
          <h2
            className="text-balance text-3xl font-bold tracking-tight lg:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Behind the Scenes
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Glimpses of our team, work process, and the innovations we create every day.
          </p>
        </div>
        <HomeMediaSlider />
      </div>
    </section>
  )
}

/* ---------- Page ---------- */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <MediaShowcase />
      <CoreServices />
      <TechStack />
      <WhyChooseUs />
      <FeaturedPortfolio />
      <CTABanner />
    </>
  )
}
