"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Save, ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"

interface JobData {
  id?: string
  title: string
  slug: string
  department: string
  location: string
  type: string
  experience_level: string
  salary_range: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  published: boolean
}

const defaultJob: JobData = {
  title: "",
  slug: "",
  department: "Engineering",
  location: "Remote",
  type: "Full-time",
  experience_level: "Mid-Level",
  salary_range: "",
  description: "",
  requirements: [""],
  responsibilities: [""],
  benefits: [""],
  published: false,
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function JobEditorForm({ initialData }: { initialData?: JobData }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [data, setData] = useState<JobData>(initialData || defaultJob)
  const isEdit = !!initialData?.id

  function updateField<K extends keyof JobData>(key: K, value: JobData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
    if (key === "title" && !isEdit) {
      setData((prev) => ({ ...prev, slug: slugify(value as string) }))
    }
  }

  function updateListItem(
    key: "requirements" | "responsibilities" | "benefits",
    index: number,
    value: string
  ) {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) => (i === index ? value : item)),
    }))
  }

  function addListItem(key: "requirements" | "responsibilities" | "benefits") {
    setData((prev) => ({ ...prev, [key]: [...prev[key], ""] }))
  }

  function removeListItem(
    key: "requirements" | "responsibilities" | "benefits",
    index: number
  ) {
    setData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const payload = {
      ...data,
      requirements: data.requirements.filter((r) => r.trim()),
      responsibilities: data.responsibilities.filter((r) => r.trim()),
      benefits: data.benefits.filter((b) => b.trim()),
    }

    try {
      const url = isEdit ? `/api/jobs/${initialData!.id}` : "/api/jobs"
      const method = isEdit ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || "Failed to save")
      }
      router.push("/admin/careers")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save job")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="size-8">
            <Link href="/admin/careers">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {isEdit ? "Edit Position" : "New Position"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={data.published ? "published" : "draft"}
            onValueChange={(v) => updateField("published", v === "published")}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Basic Info */}
      <Card>
        <CardContent className="flex flex-col gap-5 p-6">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Basic Information
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="title">
                Job Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
                required
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={data.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="auto-generated-from-title"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Department</Label>
              <Select
                value={data.department}
                onValueChange={(v) => updateField("department", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Engineering",
                    "Design",
                    "Marketing",
                    "Operations",
                    "Product",
                    "Sales",
                  ].map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={data.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="e.g. Remote, Islamabad"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Job Type</Label>
              <Select
                value={data.type}
                onValueChange={(v) => updateField("type", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Full-time",
                    "Part-time",
                    "Contract",
                    "Internship",
                    "Freelance",
                  ].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Experience Level</Label>
              <Select
                value={data.experience_level}
                onValueChange={(v) => updateField("experience_level", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Entry-Level",
                    "Junior",
                    "Mid-Level",
                    "Senior",
                    "Lead",
                    "Director",
                  ].map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label htmlFor="salary_range">Salary Range (optional)</Label>
              <Input
                id="salary_range"
                value={data.salary_range}
                onChange={(e) => updateField("salary_range", e.target.value)}
                placeholder="e.g. $80k - $120k"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Description
          </h2>
          <Textarea
            value={data.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe the role, team, and what the candidate will work on..."
            rows={8}
          />
        </CardContent>
      </Card>

      {/* Lists */}
      {(
        [
          { key: "responsibilities", title: "Responsibilities" },
          { key: "requirements", title: "Requirements" },
          { key: "benefits", title: "Benefits" },
        ] as const
      ).map(({ key, title }) => (
        <Card key={key}>
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <h2
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {title}
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addListItem(key)}
              >
                <Plus className="size-3.5" />
                Add
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {data[key].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={(e) => updateListItem(key, i, e.target.value)}
                    placeholder={`${title.slice(0, -1)} ${i + 1}`}
                  />
                  {data[key].length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0 text-destructive hover:text-destructive"
                      onClick={() => removeListItem(key, i)}
                    >
                      <X className="size-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </form>
  )
}
