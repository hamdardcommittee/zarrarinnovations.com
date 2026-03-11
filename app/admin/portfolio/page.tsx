"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  FolderKanban,
  Plus,
  ExternalLink,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
} from "lucide-react"

interface PortfolioProject {
  id: string
  title: string
  slug: string
  category: string
  description: string
  published: boolean
  featured: boolean
  created_at: string
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchProjects() {
    setLoading(true)
    try {
      const res = await fetch("/api/portfolio?admin=true")
      const data = await res.json()
      if (Array.isArray(data)) setProjects(data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/portfolio/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    })
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    )
  }

  async function toggleFeatured(id: string, featured: boolean) {
    await fetch(`/api/portfolio/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    })
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    )
  }

  async function deleteProject(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return
    await fetch(`/api/portfolio/${id}`, { method: "DELETE" })
    setProjects((prev) => prev.filter((p) => p.id !== id))
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
            Portfolio Projects
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your portfolio showcase with rich content and multiple images.
          </p>
        </div>
        <Link href="/admin/portfolio/new">
          <Button>
            <Plus className="size-4" />
            Add Project
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <FolderKanban className="size-12 text-muted-foreground/30" />
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              No Projects Yet
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Add your first portfolio project to showcase your work.
            </p>
            <Link href="/admin/portfolio/new">
              <Button>
                <Plus className="size-4" />
                Add Your First Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#31028f15" }}
                >
                  <FolderKanban className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                      {project.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {project.category}
                    </Badge>
                    {project.featured && (
                      <Badge className="bg-amber-100 text-amber-700">
                        <Star className="size-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className={
                        project.published
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      {project.published ? "Published" : "Draft"}
                    </Badge>
                    {isStatic(project.id) && (
                      <Badge variant="outline" className="text-xs">
                        Static Data
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {project.description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {!isStatic(project.id) && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={project.featured ? "Remove from featured" : "Add to featured"}
                        onClick={() => toggleFeatured(project.id, project.featured)}
                      >
                        <Star className={`size-4 ${project.featured ? "fill-amber-500 text-amber-500" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={project.published ? "Unpublish" : "Publish"}
                        onClick={() => togglePublish(project.id, project.published)}
                      >
                        {project.published ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </>
                  )}
                  <Link href={`/portfolio/${project.slug}`} target="_blank">
                    <Button variant="ghost" size="icon" title="View on site">
                      <ExternalLink className="size-4" />
                    </Button>
                  </Link>
                  {!isStatic(project.id) && (
                    <>
                      <Link href={`/admin/portfolio/${project.id}/edit`}>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Pencil className="size-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteProject(project.id)}
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
