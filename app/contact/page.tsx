"use client"

import { useState } from "react"
import { MessageCircle, Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SectionHero } from "@/components/section-hero"

const services = [
  "General",
  "Web Development",
  "UI/UX Design",
  "E-Commerce",
  "Mobile Apps",
  "Business Systems",
  "Shopify",
  "WordPress",
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [service, setService] = useState("General")

  return (
    <>
      <SectionHero
        badge="Contact"
        title="Get in touch"
        highlight="with us."
        description="Have a project in mind? Let's talk about how we can help bring your vision to life."
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Contact info */}
            <div>
              <Badge variant="secondary" className="mb-4">
                Reach Out
              </Badge>
              <h2
                className="text-balance text-3xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                We would love to hear from you
              </h2>
              <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground">
                Whether you need a quote, have a question, or want to explore a
                partnership — reach out through any of the channels below.
              </p>

              <div className="mt-10 flex flex-col gap-6">
                <a
                  href="https://wa.me/96877627362"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#f5f3fa" }}
                  >
                    <MessageCircle
                      className="size-6"
                      style={{ color: "#31028f" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp (Oman)</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      +968 7762 7362
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/923058880172"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#f5f3fa" }}
                  >
                    <MessageCircle
                      className="size-6"
                      style={{ color: "#31028f" }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp (Pakistan)</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      +92 305 888 0172
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:zarrarinnovations@gmail.com"
                  className="group flex items-start gap-4 rounded-xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#f5f3fa" }}
                  >
                    <Mail className="size-6" style={{ color: "#31028f" }} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      zarrarinnovations@gmail.com
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+96877627362"
                  className="group flex items-start gap-4 rounded-xl border p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#f5f3fa" }}
                  >
                    <Phone className="size-6" style={{ color: "#31028f" }} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      +968 7762 7362
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 rounded-xl border p-5">
                  <div
                    className="flex size-12 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "#f5f3fa" }}
                  >
                    <MapPin className="size-6" style={{ color: "#31028f" }} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Remote-first — serving clients in Oman, Pakistan & globally
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <Card className="border shadow-sm">
              <CardContent className="p-8">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div
                      className="mb-4 flex size-16 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#f5f3fa" }}
                    >
                      <Send
                        className="size-7"
                        style={{ color: "#31028f" }}
                      />
                    </div>
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Message Sent!
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Thank you for reaching out. We will get back to you soon.
                    </p>
                    <Button
                      className="mt-6"
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      setLoading(true)
                      setError("")
                      const form = e.currentTarget
                      const formData = new FormData(form)
                      try {
                        const res = await fetch("/api/leads", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            name: formData.get("name"),
                            email: formData.get("email"),
                            phone: formData.get("phone"),
                            subject: formData.get("subject"),
                            message: formData.get("message"),
                            service,
                          }),
                        })
                        if (!res.ok) {
                          const data = await res.json()
                          throw new Error(data.error || "Failed to send message")
                        }
                        setSubmitted(true)
                      } catch (err: unknown) {
                        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
                      } finally {
                        setLoading(false)
                      }
                    }}
                    className="flex flex-col gap-6"
                  >
                    <h3
                      className="text-lg font-semibold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Send us a message
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+92 300 000 0000"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="service">Service Interested In</Label>
                        <Select value={service} onValueChange={setService}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Project inquiry"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your project..."
                        rows={5}
                        required
                      />
                    </div>
                    {error && (
                      <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {error}
                      </p>
                    )}
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="size-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
