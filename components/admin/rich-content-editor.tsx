"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Plus,
  Trash2,
  GripVertical,
  Image as ImageIcon,
  Type,
  AlignLeft,
  Link as LinkIcon,
  Code,
  Quote,
  List,
  ChevronUp,
  ChevronDown,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type ContentBlockType = 
  | "heading"
  | "paragraph" 
  | "image"
  | "video"
  | "quote"
  | "code"
  | "list"
  | "link"

export interface ContentBlock {
  id: string
  type: ContentBlockType
  content: string
  metadata?: {
    level?: 1 | 2 | 3 | 4 // For headings
    alt?: string // For images
    caption?: string // For images/videos
    language?: string // For code
    items?: string[] // For lists
    url?: string // For links/images/videos
    linkText?: string // For links
  }
}

interface RichContentEditorProps {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
  className?: string
}

const BLOCK_TYPES: { type: ContentBlockType; icon: React.ElementType; label: string }[] = [
  { type: "heading", icon: Type, label: "Heading" },
  { type: "paragraph", icon: AlignLeft, label: "Paragraph" },
  { type: "image", icon: ImageIcon, label: "Image" },
  { type: "video", icon: Video, label: "Video" },
  { type: "quote", icon: Quote, label: "Quote" },
  { type: "code", icon: Code, label: "Code Block" },
  { type: "list", icon: List, label: "List" },
  { type: "link", icon: LinkIcon, label: "Link/Backlink" },
]

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export function RichContentEditor({ blocks, onChange, className }: RichContentEditorProps) {
  const [showBlockPicker, setShowBlockPicker] = useState(false)

  const addBlock = useCallback((type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      content: "",
      metadata: type === "heading" ? { level: 2 } : type === "list" ? { items: [""] } : {},
    }
    onChange([...blocks, newBlock])
    setShowBlockPicker(false)
  }, [blocks, onChange])

  const updateBlock = useCallback((id: string, updates: Partial<ContentBlock>) => {
    onChange(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ))
  }, [blocks, onChange])

  const removeBlock = useCallback((id: string) => {
    onChange(blocks.filter(block => block.id !== id))
  }, [blocks, onChange])

  const moveBlock = useCallback((id: string, direction: "up" | "down") => {
    const index = blocks.findIndex(b => b.id === id)
    if (index === -1) return
    if (direction === "up" && index === 0) return
    if (direction === "down" && index === blocks.length - 1) return
    
    const newBlocks = [...blocks]
    const swapIndex = direction === "up" ? index - 1 : index + 1
    ;[newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]]
    onChange(newBlocks)
  }, [blocks, onChange])

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {blocks.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-8 text-center">
          <AlignLeft className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No content blocks yet. Add your first block below.
          </p>
        </div>
      )}

      {blocks.map((block, index) => (
        <BlockEditor
          key={block.id}
          block={block}
          index={index}
          total={blocks.length}
          onUpdate={(updates) => updateBlock(block.id, updates)}
          onRemove={() => removeBlock(block.id)}
          onMove={(dir) => moveBlock(block.id, dir)}
        />
      ))}

      {/* Add Block Button */}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={() => setShowBlockPicker(!showBlockPicker)}
        >
          <Plus className="size-4" />
          Add Content Block
        </Button>

        {showBlockPicker && (
          <Card className="absolute top-full left-0 z-10 mt-2 w-full">
            <CardContent className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4">
              {BLOCK_TYPES.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="flex flex-col items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-accent"
                >
                  <Icon className="size-5 text-primary" />
                  <span>{label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

interface BlockEditorProps {
  block: ContentBlock
  index: number
  total: number
  onUpdate: (updates: Partial<ContentBlock>) => void
  onRemove: () => void
  onMove: (direction: "up" | "down") => void
}

function BlockEditor({ block, index, total, onUpdate, onRemove, onMove }: BlockEditorProps) {
  const blockType = BLOCK_TYPES.find(t => t.type === block.type)
  const Icon = blockType?.icon || AlignLeft

  return (
    <Card className="group relative">
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <GripVertical className="size-4 cursor-grab text-muted-foreground" />
      </div>
      
      <CardContent className="flex flex-col gap-3 p-4">
        {/* Block Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="size-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase">
              {blockType?.label}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={index === 0}
              onClick={() => onMove("up")}
            >
              <ChevronUp className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={index === total - 1}
              onClick={() => onMove("down")}
            >
              <ChevronDown className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-destructive hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        {/* Block Content Editor */}
        {block.type === "heading" && (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              {([1, 2, 3, 4] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => onUpdate({ metadata: { ...block.metadata, level } })}
                  className={cn(
                    "rounded px-3 py-1 text-sm font-medium transition-colors",
                    block.metadata?.level === level
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-accent"
                  )}
                >
                  H{level}
                </button>
              ))}
            </div>
            <Input
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Enter heading text..."
              className="font-semibold"
            />
          </div>
        )}

        {block.type === "paragraph" && (
          <Textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Enter paragraph text..."
            rows={4}
          />
        )}

        {block.type === "image" && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Image URL</Label>
              <Input
                value={block.metadata?.url || ""}
                onChange={(e) => onUpdate({ metadata: { ...block.metadata, url: e.target.value } })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {block.metadata?.url && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-secondary">
                <img
                  src={block.metadata.url}
                  alt={block.metadata?.alt || ""}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f0f0f0' width='100' height='100'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage%3C/text%3E%3C/svg%3E"
                  }}
                />
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Alt Text</Label>
                <Input
                  value={block.metadata?.alt || ""}
                  onChange={(e) => onUpdate({ metadata: { ...block.metadata, alt: e.target.value } })}
                  placeholder="Describe the image..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs">Caption (optional)</Label>
                <Input
                  value={block.metadata?.caption || ""}
                  onChange={(e) => onUpdate({ metadata: { ...block.metadata, caption: e.target.value } })}
                  placeholder="Image caption..."
                />
              </div>
            </div>
          </div>
        )}

        {block.type === "video" && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Video URL (YouTube, Vimeo, or direct link)</Label>
              <Input
                value={block.metadata?.url || ""}
                onChange={(e) => onUpdate({ metadata: { ...block.metadata, url: e.target.value } })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Caption (optional)</Label>
              <Input
                value={block.metadata?.caption || ""}
                onChange={(e) => onUpdate({ metadata: { ...block.metadata, caption: e.target.value } })}
                placeholder="Video caption..."
              />
            </div>
          </div>
        )}

        {block.type === "quote" && (
          <div className="flex flex-col gap-3">
            <Textarea
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Enter quote text..."
              rows={3}
              className="border-l-4 border-primary pl-4 italic"
            />
            <Input
              value={block.metadata?.caption || ""}
              onChange={(e) => onUpdate({ metadata: { ...block.metadata, caption: e.target.value } })}
              placeholder="Quote attribution (optional)..."
            />
          </div>
        )}

        {block.type === "code" && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Language</Label>
              <Input
                value={block.metadata?.language || ""}
                onChange={(e) => onUpdate({ metadata: { ...block.metadata, language: e.target.value } })}
                placeholder="javascript, python, etc."
              />
            </div>
            <Textarea
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Enter code..."
              rows={6}
              className="font-mono text-sm"
            />
          </div>
        )}

        {block.type === "list" && (
          <div className="flex flex-col gap-2">
            {(block.metadata?.items || [""]).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-muted-foreground">{i + 1}.</span>
                <Input
                  value={item}
                  onChange={(e) => {
                    const newItems = [...(block.metadata?.items || [])]
                    newItems[i] = e.target.value
                    onUpdate({ metadata: { ...block.metadata, items: newItems } })
                  }}
                  placeholder="List item..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  onClick={() => {
                    const newItems = (block.metadata?.items || []).filter((_, idx) => idx !== i)
                    onUpdate({ metadata: { ...block.metadata, items: newItems.length ? newItems : [""] } })
                  }}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newItems = [...(block.metadata?.items || []), ""]
                onUpdate({ metadata: { ...block.metadata, items: newItems } })
              }}
            >
              <Plus className="size-3" />
              Add Item
            </Button>
          </div>
        )}

        {block.type === "link" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Link URL</Label>
              <Input
                value={block.metadata?.url || ""}
                onChange={(e) => onUpdate({ metadata: { ...block.metadata, url: e.target.value } })}
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs">Link Text</Label>
              <Input
                value={block.metadata?.linkText || ""}
                onChange={(e) => onUpdate({ metadata: { ...block.metadata, linkText: e.target.value } })}
                placeholder="Click here to read more..."
              />
            </div>
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label className="text-xs">Description (optional)</Label>
              <Input
                value={block.content}
                onChange={(e) => onUpdate({ content: e.target.value })}
                placeholder="Brief description of the linked resource..."
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Helper to render content blocks on frontend
export function renderContentBlocks(blocks: ContentBlock[]) {
  return blocks.map((block) => {
    switch (block.type) {
      case "heading":
        const HeadingTag = `h${block.metadata?.level || 2}` as keyof JSX.IntrinsicElements
        return (
          <HeadingTag
            key={block.id}
            className={cn(
              "font-bold tracking-tight",
              block.metadata?.level === 1 && "text-3xl lg:text-4xl",
              block.metadata?.level === 2 && "text-2xl lg:text-3xl",
              block.metadata?.level === 3 && "text-xl lg:text-2xl",
              block.metadata?.level === 4 && "text-lg lg:text-xl"
            )}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {block.content}
          </HeadingTag>
        )
      
      case "paragraph":
        return (
          <p key={block.id} className="leading-relaxed text-muted-foreground">
            {block.content}
          </p>
        )
      
      case "image":
        return (
          <figure key={block.id} className="my-6">
            <img
              src={block.metadata?.url}
              alt={block.metadata?.alt || ""}
              className="w-full rounded-lg"
            />
            {block.metadata?.caption && (
              <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                {block.metadata.caption}
              </figcaption>
            )}
          </figure>
        )
      
      case "video":
        const videoUrl = block.metadata?.url || ""
        const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")
        const isVimeo = videoUrl.includes("vimeo.com")
        
        let embedUrl = videoUrl
        if (isYouTube) {
          const videoId = videoUrl.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/)?.[1]
          embedUrl = `https://www.youtube.com/embed/${videoId}`
        } else if (isVimeo) {
          const videoId = videoUrl.match(/vimeo\.com\/(\d+)/)?.[1]
          embedUrl = `https://player.vimeo.com/video/${videoId}`
        }
        
        return (
          <figure key={block.id} className="my-6">
            {isYouTube || isVimeo ? (
              <div className="aspect-video overflow-hidden rounded-lg">
                <iframe
                  src={embedUrl}
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                src={videoUrl}
                controls
                className="w-full rounded-lg"
              />
            )}
            {block.metadata?.caption && (
              <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                {block.metadata.caption}
              </figcaption>
            )}
          </figure>
        )
      
      case "quote":
        return (
          <blockquote key={block.id} className="my-6 border-l-4 border-primary pl-4 italic">
            <p className="text-lg">{block.content}</p>
            {block.metadata?.caption && (
              <cite className="mt-2 block text-sm text-muted-foreground not-italic">
                — {block.metadata.caption}
              </cite>
            )}
          </blockquote>
        )
      
      case "code":
        return (
          <div key={block.id} className="my-6">
            {block.metadata?.language && (
              <div className="rounded-t-lg bg-secondary px-4 py-2 text-xs font-medium">
                {block.metadata.language}
              </div>
            )}
            <pre className={cn(
              "overflow-x-auto bg-foreground p-4 text-sm text-background",
              block.metadata?.language ? "rounded-b-lg" : "rounded-lg"
            )}>
              <code>{block.content}</code>
            </pre>
          </div>
        )
      
      case "list":
        return (
          <ul key={block.id} className="my-4 list-inside list-disc space-y-2 text-muted-foreground">
            {block.metadata?.items?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
      
      case "link":
        return (
          <div key={block.id} className="my-4 rounded-lg border p-4">
            <a
              href={block.metadata?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium text-primary hover:underline"
            >
              <LinkIcon className="size-4" />
              {block.metadata?.linkText || block.metadata?.url}
            </a>
            {block.content && (
              <p className="mt-1 text-sm text-muted-foreground">{block.content}</p>
            )}
          </div>
        )
      
      default:
        return null
    }
  })
}
