"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { SectionHero } from "@/components/section-hero"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  ArrowRight,
  Monitor,
  ShoppingCart,
  Layers,
  Code,
  Cloud,
  Loader2,
  Package,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  title: string
  slug: string
  short_description: string
  category: string
  featured: boolean
  pricing: { packages?: { name: string; price: string }[] } | null
  created_at: string
}

const categoryIcons: Record<string, React.ElementType> = {
  System: Monitor,
  Website: Code,
  Template: Layers,
  Plugin: ShoppingCart,
  SaaS: Cloud,
}

const categories = ["All", "System", "Website", "Template", "Plugin", "SaaS"]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.short_description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <SectionHero
        badge="Products & Solutions"
        title="Ready-Made"
        highlight="Digital Products"
        description="Launch your business faster with our pre-built websites, management systems, and SaaS solutions. Fully customizable and ready to deploy."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        {/* Filters */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
              <Package className="size-8 text-muted-foreground" />
            </div>
            <h3
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {products.length === 0 ? "No Products Yet" : "No Matching Products"}
            </h3>
            <p className="max-w-md text-muted-foreground">
              {products.length === 0
                ? "Products will appear here once they are added through the admin dashboard."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => {
              const Icon = categoryIcons[product.category] || Package
              const startingPrice = product.pricing?.packages?.[0]?.price

              return (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card className="group h-full border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="flex h-full flex-col p-6">
                      {/* Icon + Category */}
                      <div className="mb-5 flex items-center justify-between">
                        <div
                          className="flex size-12 items-center justify-center rounded-xl"
                          style={{ backgroundColor: "#31028f15" }}
                        >
                          <Icon className="size-6 text-primary" />
                        </div>
                        <div className="flex items-center gap-2">
                          {product.featured && (
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                              Featured
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Title + Description */}
                      <h3
                        className="mb-2 text-lg font-bold tracking-tight"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {product.title}
                      </h3>
                      <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {product.short_description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t pt-4">
                        {startingPrice ? (
                          <span className="text-sm font-semibold text-primary">
                            From {startingPrice}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Contact for pricing
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          View Details
                          <ArrowRight className="size-3.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t bg-secondary/50">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center lg:py-24">
          <h2
            className="text-balance text-3xl font-bold tracking-tight lg:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Need a Custom Solution?
          </h2>
          <p className="max-w-xl text-lg text-muted-foreground">
            {"Can't find exactly what you need? We build fully custom systems tailored to your specific business requirements."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact">
              <Button size="lg">
                Get a Custom Quote
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="lg" variant="outline">
                View Our Work
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
