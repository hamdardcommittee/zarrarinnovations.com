"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Loader2,
  Plus,
  Trash2,
  Pencil,
  Image,
  Video,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react"

interface MediaItem {
  id: string
  type: "image" | "video"
  src: string
  thumbnail: string | null
  title: string | null
  description: string | null
  published: boolean
  sort_order: number
  created_at: string
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Form state
  const [type, setType] = useState<"image" | "video">("image")
  const [src, setSrc] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [published, setPublished] = useState(true)
  const [sortOrder, setSortOrder] = useState(0)

  async function fetchItems() {
    try {
      const res = await fetch("/api/media-slider")
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch {
      // fail silently
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  function resetForm() {
    setType("image")
    setSrc("")
    setThumbnail("")
    setTitle("")
    setDescription("")
    setPublished(true)
    setSortOrder(items.length)
    setEditingItem(null)
  }

  function openEditDialog(item: MediaItem) {
    setEditingItem(item)
    setType(item.type)
    setSrc(item.src)
    setThumbnail(item.thumbnail || "")
    setTitle(item.title || "")
    setDescription(item.description || "")
    setPublished(item.published)
    setSortOrder(item.sort_order)
    setIsDialogOpen(true)
  }

  function openNewDialog() {
    resetForm()
    setIsDialogOpen(true)
  }

  async function handleSave() {
    if (!src) return
    setSaving(true)

    try {
      const body = {
        type,
        src,
        thumbnail: thumbnail || null,
        title: title || null,
        description: description || null,
        published,
        sort_order: sortOrder,
      }

      if (editingItem) {
        const res = await fetch(`/api/media-slider/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          await fetchItems()
        }
      } else {
        const res = await fetch("/api/media-slider", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          await fetchItems()
        }
      }
      setIsDialogOpen(false)
      resetForm()
    } catch {
      // fail silently
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this media item?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/media-slider/${id}`, { method: "DELETE" })
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id))
      }
    } catch {
      // fail silently
    } finally {
      setDeleting(null)
    }
  }

  async function togglePublished(item: MediaItem) {
    try {
      const res = await fetch(`/api/media-slider/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, published: !item.published }),
      })
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, published: !i.published } : i
          )
        )
      }
    } catch {
      // fail silently
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight lg:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Media Slider
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage images and videos displayed on the homepage slider.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <Plus className="size-4" />
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Media Item" : "Add New Media"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col gap-2">
                <Label>Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as "image" | "video")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>
                  {type === "image" ? "Image URL" : "Video URL"}{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder={
                    type === "image"
                      ? "https://example.com/image.jpg"
                      : "https://example.com/video.mp4"
                  }
                  value={src}
                  onChange={(e) => setSrc(e.target.value)}
                />
              </div>

              {type === "video" && (
                <div className="flex flex-col gap-2">
                  <Label>Thumbnail URL (optional)</Label>
                  <Input
                    placeholder="https://example.com/thumbnail.jpg"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label>Title (optional)</Label>
                <Input
                  placeholder="Media title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Description (optional)</Label>
                <Textarea
                  placeholder="Short description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={published}
                  onCheckedChange={setPublished}
                  id="published"
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={!src || saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingItem ? (
                    "Update"
                  ) : (
                    "Add Media"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {items.length} media item{items.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Image className="size-12 text-muted-foreground/30" />
              <div>
                <p className="font-medium">No media items yet</p>
                <p className="text-sm text-muted-foreground">
                  Add images or videos to display on the homepage slider.
                </p>
              </div>
              <Button onClick={openNewDialog}>
                <Plus className="size-4" />
                Add First Media
              </Button>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 py-4"
                >
                  <div className="flex size-5 items-center justify-center text-muted-foreground/40">
                    <GripVertical className="size-4" />
                  </div>

                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                    {item.type === "image" ? (
                      <img
                        src={item.src}
                        alt={item.title || "Media"}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <Video className="size-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">
                        {item.title || "Untitled"}
                      </span>
                      <Badge
                        variant="outline"
                        className="shrink-0 text-xs"
                      >
                        {item.type}
                      </Badge>
                      {!item.published && (
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-xs"
                        >
                          Draft
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="truncate text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                    <p className="truncate text-xs text-muted-foreground">
                      Order: {item.sort_order}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePublished(item)}
                      title={item.published ? "Unpublish" : "Publish"}
                    >
                      {item.published ? (
                        <Eye className="size-4" />
                      ) : (
                        <EyeOff className="size-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                    >
                      {deleting === item.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
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
