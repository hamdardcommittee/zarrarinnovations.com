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

interface CaseStudyFormProps {
  study?: {
    id: string
    title: string
    slug: string
    client: string
    industry: string
    duration: string
    problem: string
    solution: string
    process: string[]
    tech_stack: string[]
    results: { metric: string; value: string }[]
    images: string[]
    content_blocks: ContentBlock[]
    excerpt: string
    published: boolean
  }
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function CaseStudyForm({ study }: CaseStudyFormProps) {
  const router = useRouter()
  const isEditing = !!study

  const [title, setTitle] = useState(study?.title ?? "")
  const [slug, setSlug] = useState(study?.slug ?? "")
  const [client, setClient] = useState(study?.client ?? "")
  const [industry, setIndustry] = useState(study?.industry ?? "")
  const [duration, setDuration] = useState(study?.duration ?? "")
  const [problem, setProblem] = useState(study?.problem ?? "")
  const [solution, setSolution] = useState(study?.solution ?? "")
  const [excerpt, setExcerpt] = useState(study?.excerpt ?? "")
  const [process, setProcess] = useState<string[]>(study?.process ?? [])
  const [techStack, setTechStack] = useState<string[]>(study?.tech_stack ?? [])
  const [results, setResults] = useState<{ metric: string; value: string }[]>(study?.results ?? [])
  const [images, setImages] = useState<string[]>(study?.images ?? [])
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(study?.content_blocks ?? [])
  const [published, setPublished] = useState(study?.published ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [newProcess, setNewProcess] = useState("")
  const [newTech, setNewTech] = useState("")
  const [newImage, setNewImage] = useState("")
  const [newResultMetric, setNewResultMetric] = useState("")
  const [newResultValue, setNewResultValue] = useState("")

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isEditing) {
      setSlug(generateSlug(value))
    }
  }

  function addProcess() {
    if (newProcess.trim()) {
      setProcess([...process, newProcess.trim()])
      setNewProcess("")
    }
  }

  function addTech() {
    if (newTech.trim()) {
      setTechStack([...techStack, newTech.trim()])
      setNewTech("")
    }
  }

  function addResult() {
    if (newResultMetric.trim() && newResultValue.trim()) {
      setResults([...results, { metric: newResultMetric.trim(), value: newResultValue.trim() }])
      setNewResultMetric("")
      setNewResultValue("")
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
      client,
      industry,
      duration,
      problem,
      solution,
      process,
      tech_stack: techStack,
      results,
      images,
      content_blocks: contentBlocks,
      excerpt,
      published,
    }

    try {
      const url = isEditing ? `/api/case-studies/${study.id}` : "/api/case-studies"
      const method = isEditing ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to save case study")
        return
      }

      router.push("/admin/case-studies")
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
            href="/admin/case-studies"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {isEditing ? "Edit Case Study" : "New Case Study"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
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
            {saving ? "Saving..." : "Save Case Study"}
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
                    placeholder="Case study title..."
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="case-study-slug"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="Client name..."
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="E-Commerce, Healthcare..."
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="3 Months..."
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary for cards..."
                  rows={2}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Problem & Solution</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="problem">The Problem</Label>
                <Textarea
                  id="problem"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="What challenge did the client face..."
                  rows={4}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="solution">Our Solution</Label>
                <Textarea
                  id="solution"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="How we solved it..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Screenshots / Images</CardTitle>
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
                        alt={`Screenshot ${i + 1}`}
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
              <CardTitle className="text-sm">Additional Content (Optional)</CardTitle>
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
              <CardTitle className="text-sm">Process Steps</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  value={newProcess}
                  onChange={(e) => setNewProcess(e.target.value)}
                  placeholder="Add process step..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addProcess())}
                />
                <Button type="button" onClick={addProcess} size="icon">
                  <Plus className="size-4" />
                </Button>
              </div>
              <ol className="flex flex-col gap-2 list-decimal list-inside">
                {process.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="flex-1">{step}</span>
                    <button
                      type="button"
                      onClick={() => setProcess(process.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tech Stack</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="Add technology..."
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                />
                <Button type="button" onClick={addTech} size="icon">
                  <Plus className="size-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => setTechStack(techStack.filter((t) => t !== tech))}
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
              <CardTitle className="text-sm">Key Results</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Input
                  value={newResultMetric}
                  onChange={(e) => setNewResultMetric(e.target.value)}
                  placeholder="Metric (e.g., Revenue Growth)"
                />
                <div className="flex gap-2">
                  <Input
                    value={newResultValue}
                    onChange={(e) => setNewResultValue(e.target.value)}
                    placeholder="Value (e.g., +45%)"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addResult())}
                  />
                  <Button type="button" onClick={addResult} size="icon">
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
              {results.map((result, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                  <div>
                    <p className="text-sm font-medium">{result.metric}</p>
                    <p className="text-lg font-bold text-primary">{result.value}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResults(results.filter((_, idx) => idx !== i))}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
