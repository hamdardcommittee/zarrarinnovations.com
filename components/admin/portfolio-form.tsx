"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Save, Loader2, ArrowLeft, Plus, X, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { RichContentEditor, type ContentBlock } from "./rich-content-editor"

const CATEGORIES = [
  "Web Development",
  "UI/UX Design",
  "E-Commerce",
  "Management Systems",
  "Mobile Apps",
]

interface PortfolioFormProps {
  project?: {
    id: string
    title: string
    slug: string
    category: string
    description: string
    long_description: string
    tags: string[]
    features: string[]
    images: string[]
    content_blocks: ContentBlock[]
    live_url: string
    published: boolean
    featured: boolean
  }
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function PortfolioForm({ project }: PortfolioFormProps) {
  const router = useRouter()
  const isEditing = !!project

  const [title, setTitle] = useState(project?.title ?? "")
  const [slug, setSlug] = useState(project?.slug ?? "")
  const [category, setCategory] = useState(project?.category ?? CATEGORIES[0])
  const [description, setDescription] = useState(project?.description ?? "")
  const [longDescription, setLongDescription] = useState(project?.long_description ?? "")
  const [tags, setTags] = useState<string[]>(project?.tags ?? [])
  const [features, setFeatures] = useState<string[]>(project?.features ?? [])
  const [images, setImages] = useState<string[]>(project?.images ?? [])
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(project?.content_blocks ?? [])
  const [liveUrl, setLiveUrl] = useState(project?.live_url ?? "")
  const [published, setPublished] = useState(project?.published ?? false)
  const [featured, setFeatured] = useState(project?.featured ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [newTag, setNewTag] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [newImage, setNewImage] = useState("")

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isEditing) {
      setSlug(generateSlug(value))
    }
  }

  function addTag() {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  function addFeature() {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  function addImage() {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()])
      setNewImage("")
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const body = {
      title,
      slug,
      category,
      description,
      long_description: longDescription,
      tags,
      features,
      images,
      content_blocks: contentBlocks,
      live_url: liveUrl,
      published,
      featured,
    }

    try {
      const url = isEditing ? `/api/portfolio/${project.id}` : "/api/portfolio"
      const method = isEditing ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to save project")
        return
      }

      router.push("/admin/portfolio")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/portfolio"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {isEditing ? "Edit Project" : "New Project"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={featured}
              onCheckedChange={setFeatured}
              id="featured"
            />
            <Label htmlFor="featured" className="text-sm">Featured</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={published}
              onCheckedChange={setPublished}
              id="published"
            />
            <Label htmlFor="published" className="text-sm">
              {published ? "Published" : "Draft"}
            </Label>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {saving ? "Saving..." : "Save Project"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Project title..."
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="project-url-slug"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for cards..."
                  rows={2}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="longDescription">Long Description</Label>
                <Textarea
                  id="longDescription"
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Detailed project description..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Project Images</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Image URL..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                />
                <Button type="button" onClick={addImage} size="icon">
                  <Plus className="size-4" />
                </Button>
              </div>
              {images.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((img, i) => (
                    <div key={i} className="group relative aspect-video overflow-hidden rounded-lg bg-secondary">
                      <img
                        src={img}
                        alt={`Project image ${i + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage%3C/text%3E%3C/svg%3E"
                        }}
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {images.length === 0 && (
                <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 text-center">
                  <ImageIcon className="size-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No images added yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rich Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Rich Content (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <RichContentEditor
                blocks={contentBlocks}
                onChange={setContentBlocks}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input
                  id="liveUrl"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tags</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="icon">
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                      className="hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Features</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add feature..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} size="icon">
                  <Plus className="size-4" />
                </Button>
              </div>
              <ul className="flex flex-col gap-2">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="flex-1">{feature}</span>
                    <button
                      type="button"
                      onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
