"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  Loader2,
  Send,
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
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  published: boolean
  created_at: string
}

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [experienceYears, setExperienceYears] = useState("")

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch("/api/jobs")
        if (res.ok) {
          const jobs = await res.json()
          const found = jobs.find((j: Job) => j.slug === slug)
          if (found) {
            setJob(found)
          }
        }
      } catch {
        // fail silently
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [slug])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!job) return
    setSubmitting(true)
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job.id,
          full_name: formData.get("full_name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          cover_letter: formData.get("cover_letter"),
          portfolio_url: formData.get("portfolio_url"),
          linkedin_url: formData.get("linkedin_url"),
          experience_years: experienceYears,
          current_role: formData.get("current_role"),
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit application")
      }
      setSubmitted(true)
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Position not found
        </h1>
        <p className="text-muted-foreground">
          This job listing may have been removed or is no longer available.
        </p>
        <Button asChild>
          <Link href="/careers">View all positions</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground py-20 text-background lg:py-28">
        <div
          className="absolute -right-40 -top-40 size-96 rounded-full opacity-10"
          style={{ backgroundColor: "#31028f" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href="/careers"
            className="mb-6 inline-flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-background"
          >
            <ArrowLeft className="size-4" />
            All Positions
          </Link>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-background/20 text-background/70"
              >
                {job.department}
              </Badge>
              <Badge
                variant="outline"
                className="border-background/20 text-background/70"
              >
                {job.type}
              </Badge>
            </div>
            <h1
              className="max-w-2xl text-balance text-3xl font-bold tracking-tight lg:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-5 text-sm text-background/60">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                {job.type}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="size-4" />
                {job.experience_level}
              </span>
              {job.salary_range && (
                <span className="font-medium text-background/80">
                  {job.salary_range}
                </span>
              )}
            </div>
            <div className="mt-2">
              <Button
                asChild
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
              >
                <a href="#apply">Apply Now</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="flex flex-col gap-10 lg:col-span-2">
              {/* Description */}
              <div>
                <h2
                  className="mb-4 text-xl font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  About This Role
                </h2>
                <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {job.description}
                </div>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div>
                  <h2
                    className="mb-4 text-xl font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Responsibilities
                  </h2>
                  <ul className="flex flex-col gap-2.5">
                    {job.responsibilities.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0"
                          style={{ color: "#31028f" }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h2
                    className="mb-4 text-xl font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Requirements
                  </h2>
                  <ul className="flex flex-col gap-2.5">
                    {job.requirements.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <CheckCircle2
                          className="mt-0.5 size-4 shrink-0"
                          style={{ color: "#31028f" }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div>
                  <h2
                    className="mb-4 text-xl font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Benefits
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {job.benefits.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 rounded-lg border p-3 text-sm"
                      >
                        <CheckCircle2
                          className="size-4 shrink-0"
                          style={{ color: "#16a34a" }}
                        />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Quick Info */}
            <div className="flex flex-col gap-6">
              <Card className="sticky top-24">
                <CardContent className="flex flex-col gap-5 p-6">
                  <h3
                    className="text-lg font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Quick Details
                  </h3>
                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Department</span>
                      <span className="font-medium">{job.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium">{job.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Job Type</span>
                      <span className="font-medium">{job.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Experience</span>
                      <span className="font-medium">{job.experience_level}</span>
                    </div>
                    {job.salary_range && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Salary</span>
                        <span className="font-medium">{job.salary_range}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Posted</span>
                      <span className="font-medium">
                        {new Date(job.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <Button asChild size="lg" className="mt-2 w-full">
                    <a href="#apply">Apply for this role</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="border-t bg-secondary/30 py-16 lg:py-24" id="apply">
        <div className="mx-auto max-w-2xl px-4 lg:px-8">
          {submitted ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                <div
                  className="flex size-16 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#f5f3fa" }}
                >
                  <Send className="size-7" style={{ color: "#31028f" }} />
                </div>
                <h3
                  className="text-2xl font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Application Submitted!
                </h3>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Thank you for applying for <strong>{job.title}</strong>. We
                  will review your application and get back to you soon.
                </p>
                <Button asChild variant="outline" className="mt-2">
                  <Link href="/careers">View other positions</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h2
                  className="text-2xl font-bold tracking-tight lg:text-3xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Apply for {job.title}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Fill in the form below to submit your application.
                </p>
              </div>

              <Card>
                <CardContent className="p-6 lg:p-8">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="full_name">
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="email">
                          Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+92 300 000 0000"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="current_role">
                          Current Role (optional)
                        </Label>
                        <Input
                          id="current_role"
                          name="current_role"
                          placeholder="e.g. Frontend Developer"
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label>Years of Experience</Label>
                        <Select
                          value={experienceYears}
                          onValueChange={setExperienceYears}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5-8">5-8 years</SelectItem>
                            <SelectItem value="8+">8+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="portfolio_url">
                          Portfolio URL (optional)
                        </Label>
                        <Input
                          id="portfolio_url"
                          name="portfolio_url"
                          type="url"
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="linkedin_url">
                        LinkedIn Profile (optional)
                      </Label>
                      <Input
                        id="linkedin_url"
                        name="linkedin_url"
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cover_letter">Cover Letter</Label>
                      <Textarea
                        id="cover_letter"
                        name="cover_letter"
                        placeholder="Tell us why you are a great fit for this role..."
                        rows={6}
                      />
                    </div>

                    {error && (
                      <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <Send className="size-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>
    </>
  )
}
