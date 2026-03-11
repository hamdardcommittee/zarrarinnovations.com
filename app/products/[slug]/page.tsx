"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { RequestDemoModal } from "@/components/request-demo-modal"
import {
  ArrowLeft,
  CheckCircle2,
  Play,
  Monitor,
  Loader2,
  ArrowRight,
  Star,
} from "lucide-react"

interface Product {
  id: string
  title: string
  slug: string
  short_description: string
  description: string
  category: string
  features: { icon?: string; title: string; description: string }[]
  screenshots: string[]
  pricing: {
    packages?: { name: string; price: string; features: string[]; popular?: boolean }[]
  } | null
  demo_video_url: string | null
  faq: { question: string; answer: string }[]
  published: boolean
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const found = data.find((p: Product) => p.slug === slug)
          if (found) {
            setProduct(found)
          } else {
            setError("Product not found")
          }
        }
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <Monitor className="size-12 text-muted-foreground/30" />
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Product Not Found
        </h2>
        <p className="text-muted-foreground">{error || "This product does not exist."}</p>
        <Link href="/products">
          <Button variant="outline">
            <ArrowLeft className="size-4" />
            Back to Products
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-foreground py-20 text-background lg:py-28">
        <div
          className="absolute -right-40 -top-40 size-96 rounded-full opacity-10"
          style={{ backgroundColor: "#31028f" }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -left-20 size-64 rounded-full opacity-10"
          style={{ backgroundColor: "#31028f" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href="/products"
            className="mb-6 inline-flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-background"
          >
            <ArrowLeft className="size-4" />
            All Products
          </Link>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="mb-4 border-background/20 text-background/70"
              >
                {product.category}
              </Badge>
              <h1
                className="text-balance text-4xl font-bold tracking-tight lg:text-5xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {product.title}
              </h1>
              <p className="mt-4 text-pretty text-lg leading-relaxed text-background/70">
                {product.short_description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <RequestDemoModal productId={product.id} productTitle={product.title}>
                  <Button
                    size="lg"
                    className="bg-background text-foreground hover:bg-background/90"
                  >
                    <Play className="size-4" />
                    Request Live Demo
                  </Button>
                </RequestDemoModal>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-background/20 text-background hover:bg-background/10"
                  >
                    Get Custom Quote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Description */}
      <section className="mx-auto max-w-4xl px-4 py-16 lg:px-8 lg:py-20">
        <p className="text-lg leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </section>

      {/* 3. Features Section */}
      {product.features && product.features.length > 0 && (
        <section className="border-t bg-secondary/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="mb-3">
                Key Features
              </Badge>
              <h2
                className="text-3xl font-bold tracking-tight lg:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Everything You Need
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {product.features.map((feature, i) => (
                <Card key={i} className="border-border/40">
                  <CardContent className="flex flex-col gap-3 p-6">
                    <div
                      className="flex size-10 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "#31028f15" }}
                    >
                      <CheckCircle2 className="size-5 text-primary" />
                    </div>
                    <h3 className="text-base font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Screenshots */}
      {product.screenshots && product.screenshots.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="mb-3">
                Product Preview
              </Badge>
              <h2
                className="text-3xl font-bold tracking-tight lg:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                See It In Action
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {product.screenshots.map((url, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border bg-secondary"
                >
                  <img
                    src={url}
                    alt={`${product.title} screenshot ${i + 1}`}
                    className="w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Demo Video */}
      {product.demo_video_url && (
        <section className="border-t bg-secondary/30 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 lg:px-8">
            <div className="mb-10 text-center">
              <Badge variant="secondary" className="mb-3">
                Demo Video
              </Badge>
              <h2
                className="text-3xl font-bold tracking-tight lg:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Watch the Demo
              </h2>
            </div>
            <div className="aspect-video overflow-hidden rounded-xl border shadow-lg">
              <iframe
                src={product.demo_video_url.replace("watch?v=", "embed/")}
                title={`${product.title} demo video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="size-full"
              />
            </div>
          </div>
        </section>
      )}

      {/* 6. Pricing */}
      {product.pricing?.packages && product.pricing.packages.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-12 text-center">
              <Badge variant="secondary" className="mb-3">
                Pricing
              </Badge>
              <h2
                className="text-3xl font-bold tracking-tight lg:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Choose Your Plan
              </h2>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
              {product.pricing.packages.map((pkg, i) => (
                <Card
                  key={i}
                  className={`relative ${pkg.popular ? "border-primary shadow-lg shadow-primary/10" : "border-border/60"}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="mr-1 size-3" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle
                      className="text-lg"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {pkg.name}
                    </CardTitle>
                    <p
                      className="text-3xl font-bold text-primary"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {pkg.price}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="mb-6 flex flex-col gap-2.5">
                      {pkg.features?.map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <RequestDemoModal productId={product.id} productTitle={`${product.title} - ${pkg.name}`}>
                      <Button
                        className="w-full"
                        variant={pkg.popular ? "default" : "outline"}
                      >
                        Get Started
                      </Button>
                    </RequestDemoModal>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. FAQ */}
      {product.faq && product.faq.length > 0 && (
        <section className="border-t bg-secondary/30 py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 lg:px-8">
            <div className="mb-10 text-center">
              <Badge variant="secondary" className="mb-3">
                FAQ
              </Badge>
              <h2
                className="text-3xl font-bold tracking-tight lg:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {product.faq.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Sticky CTA */}
      <section className="border-t bg-foreground py-12 text-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row lg:px-8">
          <div>
            <h3
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Ready to get started with {product.title}?
            </h3>
            <p className="mt-1 text-background/70">
              Schedule a personalized demo or get a custom quote today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <RequestDemoModal productId={product.id} productTitle={product.title}>
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
              >
                <Play className="size-4" />
                See It In Action
              </Button>
            </RequestDemoModal>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-background/20 text-background hover:bg-background/10"
              >
                Contact Sales
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
