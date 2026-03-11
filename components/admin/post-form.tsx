"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Loader2, ArrowLeft, Plus, X, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { RichContentEditor, type ContentBlock } from "./rich-content-editor"

const CATEGORIES = [
  "Web Development",
  "UI/UX Design",
  "E-Commerce",
  "Business Systems",
  "Mobile Apps",
  "Tech Trends",
]

interface PostFormProps {
  post?: {
    id: string
    title: string
    slug: string
    category: string
    excerpt: string
    read_time: string
    date: string
    author: string
    content: string[]
    content_blocks?: ContentBlock[]
    featured_image?: string
    images?: string[]
    published: boolean
  }
}

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter()
  const isEditing = !!post

  const [title, setTitle] = useState(post?.title ?? "")
  const [slug, setSlug] = useState(post?.slug ?? "")
  const [category, setCategory] = useState(post?.category ?? CATEGORIES[0])
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "")
  const [readTime, setReadTime] = useState(post?.read_time ?? "5 min read")
  const [date, setDate] = useState(
    post?.date ?? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  )
  const [author, setAuthor] = useState(post?.author ?? "Zarrar Innovations")
  const [contentText, setContentText] = useState(
    post?.content?.join("\n\n") ?? ""
  )
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(post?.content_blocks ?? [])
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image ?? "")
  const [images, setImages] = useState<string[]>(post?.images ?? [])
  const [published, setPublished] = useState(post?.published ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editorMode, setEditorMode] = useState<"simple" | "rich">(
    post?.content_blocks && post.content_blocks.length > 0 ? "rich" : "simple"
  )
  const [newImage, setNewImage] = useState("")

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!isEditing) {
      setSlug(generateSlug(value))
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
      excerpt,
      read_time: readTime,
      date,
      author,
      content: editorMode === "simple" ? contentText.split("\n\n").filter(Boolean) : [],
      content_blocks: editorMode === "rich" ? contentBlocks : [],
      featured_image: featuredImage,
      images,
      published,
    }

    try {
      const url = isEditing ? `/api/blog/${post.id}` : "/api/blog"
      const method = isEditing ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to save post")
        return
      }

      router.push("/admin/posts")
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
            href="/admin/posts"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {isEditing ? "Edit Post" : "New Post"}
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
            {saving ? "Saving..." : "Save Post"}
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
              <CardTitle className="text-sm">Post Info</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title..."
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the post..."
                  rows={2}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Input
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="Featured image URL..."
              />
              {featuredImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-secondary">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage%3C/text%3E%3C/svg%3E"
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={editorMode} onValueChange={(v) => setEditorMode(v as "simple" | "rich")}>
                <TabsList className="mb-4">
                  <TabsTrigger value="simple">Simple Editor</TabsTrigger>
                  <TabsTrigger value="rich">Rich Editor</TabsTrigger>
                </TabsList>
                <TabsContent value="simple">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="content">
                      Content{" "}
                      <span className="font-normal text-muted-foreground">
                        (separate paragraphs with a blank line)
                      </span>
                    </Label>
                    <Textarea
                      id="content"
                      value={contentText}
                      onChange={(e) => setContentText(e.target.value)}
                      placeholder="Write your article content here..."
                      rows={14}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="rich">
                  <RichContentEditor
                    blocks={contentBlocks}
                    onChange={setContentBlocks}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Additional Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Additional Images</CardTitle>
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
                        alt={`Image ${i + 1}`}
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
                <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 text-center">
                  <ImageIcon className="size-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No additional images</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Post Details</CardTitle>
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
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="readTime">Read Time</Label>
                <Input
                  id="readTime"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="5 min read"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
