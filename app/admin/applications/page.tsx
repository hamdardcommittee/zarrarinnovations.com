"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Loader2,
  Mail,
  Phone,
  Briefcase,
  Linkedin,
  Globe,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface Application {
  id: string
  full_name: string
  email: string
  phone: string | null
  cover_letter: string | null
  portfolio_url: string | null
  linkedin_url: string | null
  experience_years: string | null
  current_role: string | null
  status: string
  created_at: string
  job_postings: {
    title: string
    department: string
    slug: string
  } | null
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewing: "bg-amber-100 text-amber-700",
  shortlisted: "bg-purple-100 text-purple-700",
  interview: "bg-teal-100 text-teal-700",
  offered: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  hired: "bg-emerald-100 text-emerald-700",
}

const statusOptions = [
  "new",
  "reviewing",
  "shortlisted",
  "interview",
  "offered",
  "rejected",
  "hired",
]

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function fetchApplications() {
    try {
      const res = await fetch("/api/applications")
      if (res.ok) {
        const data = await res.json()
        setApplications(data)
      }
    } catch {
      // fail silently
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  async function updateStatus(id: string, status: string) {
    setUpdatingStatus(id)
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        )
      }
    } catch {
      // fail silently
    } finally {
      setUpdatingStatus(null)
    }
  }

  async function deleteApplication(id: string) {
    if (!confirm("Are you sure you want to delete this application?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/applications/${id}`, { method: "DELETE" })
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== id))
      }
    } catch {
      // fail silently
    } finally {
      setDeleting(null)
    }
  }

  const filtered =
    filterStatus === "all"
      ? applications
      : applications.filter((a) => a.status === filterStatus)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight lg:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Applications
          </h1>
          <p className="mt-1 text-muted-foreground">
            Review and manage job applications.
          </p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {filtered.length} application{filtered.length !== 1 ? "s" : ""}
            {filterStatus !== "all" ? ` (${filterStatus})` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <FileText className="size-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No applications found.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {filtered.map((app) => {
                const isExpanded = expandedId === app.id
                return (
                  <div key={app.id} className="py-4">
                    <div
                      className="flex cursor-pointer items-center justify-between gap-4"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : app.id)
                      }
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold">
                            {app.full_name}
                          </h3>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              statusColors[app.status] || statusColors.new
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="size-3" />
                            {app.email}
                          </span>
                          {app.jobs && (
                            <Badge variant="outline" className="text-xs">
                              {app.jobs.title}
                            </Badge>
                          )}
                          <span>
                            {new Date(app.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronUp className="size-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="size-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 flex flex-col gap-4 rounded-lg border bg-secondary/20 p-4">
                        <div className="grid gap-3 text-sm sm:grid-cols-2">
                          <div className="flex items-center gap-2">
                            <Mail className="size-3.5 text-muted-foreground" />
                            <a
                              href={`mailto:${app.email}`}
                              className="text-primary hover:underline"
                            >
                              {app.email}
                            </a>
                          </div>
                          {app.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="size-3.5 text-muted-foreground" />
                              {app.phone}
                            </div>
                          )}
                          {app.current_role && (
                            <div className="flex items-center gap-2">
                              <Briefcase className="size-3.5 text-muted-foreground" />
                              {app.current_role}
                            </div>
                          )}
                          {app.experience_years && (
                            <div className="flex items-center gap-2">
                              <Briefcase className="size-3.5 text-muted-foreground" />
                              {app.experience_years} years experience
                            </div>
                          )}
                          {app.linkedin_url && (
                            <div className="flex items-center gap-2">
                              <Linkedin className="size-3.5 text-muted-foreground" />
                              <a
                                href={app.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                LinkedIn Profile
                              </a>
                            </div>
                          )}
                          {app.portfolio_url && (
                            <div className="flex items-center gap-2">
                              <Globe className="size-3.5 text-muted-foreground" />
                              <a
                                href={app.portfolio_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Portfolio
                              </a>
                            </div>
                          )}
                        </div>

                        {app.cover_letter && (
                          <div>
                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                              Cover Letter
                            </p>
                            <p className="whitespace-pre-line text-sm leading-relaxed">
                              {app.cover_letter}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 border-t pt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Status:
                            </span>
                            <Select
                              value={app.status}
                              onValueChange={(v) =>
                                updateStatus(app.id, v)
                              }
                              disabled={updatingStatus === app.id}
                            >
                              <SelectTrigger className="h-8 w-32 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            disabled={deleting === app.id}
                            onClick={() => deleteApplication(app.id)}
                          >
                            {deleting === app.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
