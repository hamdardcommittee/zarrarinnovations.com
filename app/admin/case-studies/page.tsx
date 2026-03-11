"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  FileBarChart,
  Plus,
  ExternalLink,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react"

interface CaseStudy {
  id: string
  title: string
  slug: string
  client: string
  industry: string
  published: boolean
  created_at: string
}

export default function AdminCaseStudiesPage() {
  const [studies, setStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchStudies() {
    setLoading(true)
    try {
      const res = await fetch("/api/case-studies?admin=true")
      const data = await res.json()
      if (Array.isArray(data)) setStudies(data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchStudies() }, [])

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/case-studies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    })
    setStudies((prev) =>
      prev.map((s) => (s.id === id ? { ...s, published: !s.published } : s))
    )
  }

  async function deleteStudy(id: string) {
    if (!confirm("Are you sure you want to delete this case study?")) return
    await fetch(`/api/case-studies/${id}`, { method: "DELETE" })
    setStudies((prev) => prev.filter((s) => s.id !== id))
  }

  const isStatic = (id: string) => id.startsWith("static-")

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight lg:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Case Studies
          </h1>
          <p className="mt-1 text-muted-foreground">
            Showcase detailed success stories with rich content.
          </p>
        </div>
        <Link href="/admin/case-studies/new">
          <Button>
            <Plus className="size-4" />
            Add Case Study
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : studies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <FileBarChart className="size-12 text-muted-foreground/30" />
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              No Case Studies Yet
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Add your first case study to showcase your success stories.
            </p>
            <Link href="/admin/case-studies/new">
              <Button>
                <Plus className="size-4" />
                Add Your First Case Study
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {studies.map((study) => (
            <Card key={study.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#31028f15" }}
                >
                  <FileBarChart className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                      {study.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {study.industry}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        study.published
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      {study.published ? "Published" : "Draft"}
                    </Badge>
                    {isStatic(study.id) && (
                      <Badge variant="outline" className="text-xs">
                        Static Data
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Client: {study.client}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {!isStatic(study.id) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title={study.published ? "Unpublish" : "Publish"}
                      onClick={() => togglePublish(study.id, study.published)}
                    >
                      {study.published ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  )}
                  <Link href={`/case-studies/${study.slug}`} target="_blank">
                    <Button variant="ghost" size="icon" title="View on site">
                      <ExternalLink className="size-4" />
                    </Button>
                  </Link>
                  {!isStatic(study.id) && (
                    <>
                      <Link href={`/admin/case-studies/${study.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Pencil className="size-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteStudy(study.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
