"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, Plus, Trash2, Save } from "lucide-react"
import Link from "next/link"

interface Feature {
  title: string
  description: string
}

interface PricingPackage {
  name: string
  price: string
  features: string[]
  popular: boolean
}

interface FaqItem {
  question: string
  answer: string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("System")
  const [demoVideoUrl, setDemoVideoUrl] = useState("")
  const [published, setPublished] = useState(false)
  const [featured, setFeatured] = useState(false)

  const [features, setFeatures] = useState<Feature[]>([{ title: "", description: "" }])
  const [pricing, setPricing] = useState<PricingPackage[]>([])
  const [faq, setFaq] = useState<FaqItem[]>([])
  const [screenshots, setScreenshots] = useState<string[]>([])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!title || !shortDescription || !description) {
      setError("Title, short description, and description are required.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || slugify(title),
          short_description: shortDescription,
          description,
          category,
          features: features.filter((f) => f.title),
          screenshots: screenshots.filter(Boolean),
          pricing: pricing.length > 0 ? { packages: pricing.filter((p) => p.name && p.price) } : null,
          demo_video_url: demoVideoUrl || null,
          faq: faq.filter((f) => f.question && f.answer),
          published,
          featured,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create product")
      }

      router.push("/admin/products")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/products"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Products
      </Link>

      <h1
        className="mb-6 text-2xl font-bold tracking-tight lg:text-3xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        New Product
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                placeholder="POS System for Retail Businesses"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (!slug) setSlug(slugify(e.target.value))
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                placeholder="pos-system"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="short-desc">Short Description *</Label>
              <Textarea
                id="short-desc"
                rows={2}
                placeholder="Brief product description for listing cards"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="desc">Full Description *</Label>
              <Textarea
                id="desc"
                rows={4}
                placeholder="Detailed product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="System">System</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="Template">Template</SelectItem>
                    <SelectItem value="Plugin">Plugin</SelectItem>
                    <SelectItem value="SaaS">SaaS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="video-url">Demo Video URL</Label>
                <Input
                  id="video-url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={demoVideoUrl}
                  onChange={(e) => setDemoVideoUrl(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <Switch id="published" checked={published} onCheckedChange={setPublished} />
                <Label htmlFor="published">Published</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Highlight key features of the product</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {features.map((feat, i) => (
              <div key={i} className="flex gap-3">
                <Input
                  placeholder="Feature title"
                  value={feat.title}
                  onChange={(e) => {
                    const updated = [...features]
                    updated[i] = { ...feat, title: e.target.value }
                    setFeatures(updated)
                  }}
                  className="flex-1"
                />
                <Input
                  placeholder="Description"
                  value={feat.description}
                  onChange={(e) => {
                    const updated = [...features]
                    updated[i] = { ...feat, description: e.target.value }
                    setFeatures(updated)
                  }}
                  className="flex-[2]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setFeatures(features.filter((_, j) => j !== i))}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFeatures([...features, { title: "", description: "" }])}
            >
              <Plus className="size-4" />
              Add Feature
            </Button>
          </CardContent>
        </Card>

        {/* Screenshots */}
        <Card>
          <CardHeader>
            <CardTitle>Screenshots</CardTitle>
            <CardDescription>Add URLs for product screenshots</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {screenshots.map((url, i) => (
              <div key={i} className="flex gap-3">
                <Input
                  placeholder="https://example.com/screenshot.png"
                  value={url}
                  onChange={(e) => {
                    const updated = [...screenshots]
                    updated[i] = e.target.value
                    setScreenshots(updated)
                  }}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setScreenshots(screenshots.filter((_, j) => j !== i))}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setScreenshots([...screenshots, ""])}
            >
              <Plus className="size-4" />
              Add Screenshot URL
            </Button>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Packages (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {pricing.map((pkg, i) => (
              <Card key={i} className="border-dashed">
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Package {i + 1}</Label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Switch
                          checked={pkg.popular}
                          onCheckedChange={(v) => {
                            const updated = [...pricing]
                            updated[i] = { ...pkg, popular: v }
                            setPricing(updated)
                          }}
                        />
                        <span className="text-xs text-muted-foreground">Popular</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setPricing(pricing.filter((_, j) => j !== i))}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      placeholder="Package name (e.g., Basic)"
                      value={pkg.name}
                      onChange={(e) => {
                        const updated = [...pricing]
                        updated[i] = { ...pkg, name: e.target.value }
                        setPricing(updated)
                      }}
                    />
                    <Input
                      placeholder="Price (e.g., $299)"
                      value={pkg.price}
                      onChange={(e) => {
                        const updated = [...pricing]
                        updated[i] = { ...pkg, price: e.target.value }
                        setPricing(updated)
                      }}
                    />
                  </div>
                  <Textarea
                    rows={2}
                    placeholder="Features (one per line)"
                    value={pkg.features.join("\n")}
                    onChange={(e) => {
                      const updated = [...pricing]
                      updated[i] = { ...pkg, features: e.target.value.split("\n") }
                      setPricing(updated)
                    }}
                  />
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setPricing([
                  ...pricing,
                  { name: "", price: "", features: [], popular: false },
                ])
              }
            >
              <Plus className="size-4" />
              Add Pricing Package
            </Button>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>FAQ</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {faq.map((item, i) => (
              <div key={i} className="flex gap-3">
                <Input
                  placeholder="Question"
                  value={item.question}
                  onChange={(e) => {
                    const updated = [...faq]
                    updated[i] = { ...item, question: e.target.value }
                    setFaq(updated)
                  }}
                  className="flex-1"
                />
                <Input
                  placeholder="Answer"
                  value={item.answer}
                  onChange={(e) => {
                    const updated = [...faq]
                    updated[i] = { ...item, answer: e.target.value }
                    setFaq(updated)
                  }}
                  className="flex-[2]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setFaq(faq.filter((_, j) => j !== i))}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setFaq([...faq, { question: "", answer: "" }])}
            >
              <Plus className="size-4" />
              Add FAQ Item
            </Button>
          </CardContent>
        </Card>

        {error && (
          <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  )
}
