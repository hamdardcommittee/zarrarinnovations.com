"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Package,
  Plus,
  ExternalLink,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react"

interface Product {
  id: string
  title: string
  slug: string
  short_description: string
  category: string
  published: boolean
  featured: boolean
  created_at: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchProducts() {
    setLoading(true)
    try {
      const res = await fetch("/api/products?admin=true")
      const data = await res.json()
      if (Array.isArray(data)) setProducts(data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    })
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    )
  }

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return
    await fetch(`/api/products/${id}`, { method: "DELETE" })
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight lg:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Products
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your ready-made products and solutions.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="size-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <Package className="size-12 text-muted-foreground/30" />
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              No Products Yet
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              Add your first product to showcase and sell through your website.
            </p>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="size-4" />
                Add Your First Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <Card key={product.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#31028f15" }}
                >
                  <Package className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                      {product.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    {product.featured && (
                      <Badge className="bg-primary/10 text-primary">Featured</Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className={
                        product.published
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }
                    >
                      {product.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {product.short_description}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    title={product.published ? "Unpublish" : "Publish"}
                    onClick={() => togglePublish(product.id, product.published)}
                  >
                    {product.published ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                  <Link href={`/products/${product.slug}`} target="_blank">
                    <Button variant="ghost" size="icon" title="View on site">
                      <ExternalLink className="size-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="ghost" size="icon" title="Edit">
                      <Pencil className="size-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Delete"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
