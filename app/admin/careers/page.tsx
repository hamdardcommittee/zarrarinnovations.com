"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  PlusCircle,
  Briefcase,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  ExternalLink,
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
  published: boolean
  created_at: string
}

export default function AdminCareersPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  async function fetchJobs() {
    try {
      const res = await fetch("/api/admin/jobs")
      if (res.ok) {
        const data = await res.json()
        setJobs(data)
      }
    } catch {
      // fail silently
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  async function togglePublished(job: Job) {
    setToggling(job.id)
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !job.published }),
      })
      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id ? { ...j, published: !j.published } : j
          )
        )
      }
    } catch {
      // fail silently
    } finally {
      setToggling(null)
    }
  }

  async function deleteJob(id: string) {
    if (!confirm("Are you sure you want to delete this job posting?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" })
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== id))
      }
    } catch {
      // fail silently
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight lg:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Career Postings
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage job listings and career opportunities.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/careers/new">
            <PlusCircle className="size-4" />
            New Position
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} total
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Briefcase className="size-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No job postings yet.</p>
              <Button asChild size="sm">
                <Link href="/admin/careers/new">Create your first posting</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="truncate text-sm font-semibold">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {job.department}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {job.location}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {job.type}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          job.published
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {job.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {job.published && (
                      <Button
                        asChild
                        variant="ghost"
                        size="icon"
                        className="size-8"
                      >
                        <Link
                          href={`/careers/${job.slug}`}
                          target="_blank"
                        >
                          <ExternalLink className="size-3.5" />
                          <span className="sr-only">View live</span>
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      disabled={toggling === job.id}
                      onClick={() => togglePublished(job)}
                    >
                      {toggling === job.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : job.published ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                      <span className="sr-only">
                        {job.published ? "Unpublish" : "Publish"}
                      </span>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      className="size-8"
                    >
                      <Link href={`/admin/careers/${job.id}/edit`}>
                        <Pencil className="size-3.5" />
                        <span className="sr-only">Edit</span>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      disabled={deleting === job.id}
                      onClick={() => deleteJob(job.id)}
                    >
                      {deleting === job.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
