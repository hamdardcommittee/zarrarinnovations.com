"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SectionHero } from "@/components/section-hero"
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  ArrowRight,
  Users,
  Zap,
  Globe,
  Heart,
  GraduationCap,
  Laptop,
  Loader2,
} from "lucide-react"

interface Job {
  id: string
  title: string
  slug: string
  department: string
  location: string
  type: string
  experience_level: string
  salary_range: string | null
  description: string
  published: boolean
  created_at: string
}

const cultureValues = [
  {
    icon: Globe,
    title: "Remote-First",
    description:
      "Work from anywhere in the world. We believe great talent is not limited by geography.",
  },
  {
    icon: Zap,
    title: "Innovation Driven",
    description:
      "We encourage experimentation. Ship fast, learn faster, and build solutions that matter.",
  },
  {
    icon: Users,
    title: "Collaborative Spirit",
    description:
      "Tight-knit teams that support each other. No silos, no politics, just great work together.",
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    description:
      "Flexible schedules, generous PTO, and a culture that respects your personal time.",
  },
  {
    icon: GraduationCap,
    title: "Growth & Learning",
    description:
      "Annual learning budgets, mentorship programs, and clear paths for career advancement.",
  },
  {
    icon: Laptop,
    title: "Modern Tools",
    description:
      "We invest in the best tools and tech stack so you can focus on doing your best work.",
  },
]

const departments = [
  "All Departments",
  "Engineering",
  "Design",
  "Marketing",
  "Operations",
  "Product",
  "Sales",
]

const jobTypes = [
  "All Types",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
]

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("All Departments")
  const [jobType, setJobType] = useState("All Types")

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs")
        if (res.ok) {
          const data = await res.json()
          setJobs(data)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase())
    const matchesDept =
      department === "All Departments" || job.department === department
    const matchesType = jobType === "All Types" || job.type === jobType
    return matchesSearch && matchesDept && matchesType
  })

  return (
    <>
      <SectionHero
        badge="Careers"
        title="Build the future"
        highlight="with us."
        description="Join a remote-first team of innovators, designers, and engineers shaping the digital landscape for businesses worldwide."
      />

      {/* Culture Section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              Our Culture
            </Badge>
            <h2
              className="text-balance text-3xl font-bold tracking-tight lg:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Why you will love working here
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              We are building more than software. We are building a place where
              talented people thrive, grow, and do the best work of their lives.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cultureValues.map((value) => (
              <Card
                key={value.title}
                className="group border transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="flex flex-col gap-4 p-6">
                  <div
                    className="flex size-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
                    style={{ backgroundColor: "#f5f3fa" }}
                  >
                    <value.icon className="size-6" style={{ color: "#31028f" }} />
                  </div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="border-t bg-secondary/30 py-20 lg:py-28" id="positions">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              Open Positions
            </Badge>
            <h2
              className="text-balance text-3xl font-bold tracking-tight lg:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Find your next role
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Explore current openings across our teams. Can not find the right
              fit? Send us your resume anyway.
            </p>
          </div>

          {/* Filters */}
          <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search positions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-background pl-9"
              />
            </div>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-full bg-background sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="w-full bg-background sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job Listings */}
          <div className="mx-auto mt-8 max-w-3xl">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                  <div
                    className="flex size-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#f5f3fa" }}
                  >
                    <Briefcase className="size-7 text-muted-foreground/40" />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      No positions found
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {jobs.length === 0
                        ? "We don't have any open positions right now. Check back soon!"
                        : "Try adjusting your search or filters."}
                    </p>
                  </div>
                  {jobs.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearch("")
                        setDepartment("All Departments")
                        setJobType("All Types")
                      }}
                    >
                      Clear filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">
                  {filtered.length} position{filtered.length !== 1 ? "s" : ""}{" "}
                  available
                </p>
                {filtered.map((job) => (
                  <Link key={job.id} href={`/careers/${job.slug}`}>
                    <Card className="group cursor-pointer border transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className="text-lg font-bold transition-colors group-hover:text-primary"
                              style={{ fontFamily: "var(--font-heading)" }}
                            >
                              {job.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {job.department}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="size-3.5" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="size-3.5" />
                              {job.type}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Briefcase className="size-3.5" />
                              {job.experience_level}
                            </span>
                            {job.salary_range && (
                              <span className="font-medium text-foreground">
                                {job.salary_range}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="flex items-center gap-1.5 text-sm font-medium text-primary">
                            View Details
                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Card
            className="overflow-hidden border-0"
            style={{ backgroundColor: "#0a0a1a" }}
          >
            <CardContent className="flex flex-col items-center gap-6 p-10 text-center lg:p-16">
              <h2
                className="max-w-xl text-balance text-3xl font-bold tracking-tight lg:text-4xl"
                style={{ fontFamily: "var(--font-heading)", color: "#ffffff" }}
              >
                {"Don't see the right role?"}
              </h2>
              <p className="max-w-lg text-pretty leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                We are always looking for talented people. Send us your resume
                and tell us how you would like to contribute.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90"
                >
                  <a href="mailto:zarrarinnovations@gmail.com">
                    Send Your Resume
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
