"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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
import { Loader2, CheckCircle2, Play } from "lucide-react"

const businessTypes = [
  "Retail",
  "Restaurant / Cafe",
  "Healthcare",
  "Education",
  "Real Estate",
  "E-Commerce",
  "Agency / Studio",
  "Startup",
  "Enterprise",
  "Other",
]

interface RequestDemoModalProps {
  productId?: string
  productTitle: string
  children?: React.ReactNode
}

export function RequestDemoModal({
  productId,
  productTitle,
  children,
}: RequestDemoModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [preferredTime, setPreferredTime] = useState("")
  const [message, setMessage] = useState("")

  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")

  function resetForm() {
    setName("")
    setCompanyName("")
    setEmail("")
    setPhone("")
    setBusinessType("")
    setPreferredTime("")
    setMessage("")
    setError("")
    setNameError("")
    setEmailError("")
    setSubmitted(false)
  }

  function validate() {
    let valid = true
    setNameError("")
    setEmailError("")

    if (!name.trim()) {
      setNameError("Name is required")
      valid = false
    }
    if (!email.trim()) {
      setEmailError("Email is required")
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email")
      valid = false
    }
    return valid
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId || null,
          product_title: productTitle,
          name,
          company_name: companyName || null,
          email,
          phone: phone || null,
          business_type: businessType || null,
          preferred_demo_time: preferredTime || null,
          message: message || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit request")
      }

      setSubmitted(true)
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) setTimeout(resetForm, 300)
      }}
    >
      <DialogTrigger asChild>
        {children || (
          <Button size="lg">
            <Play className="size-4" />
            Request Live Demo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {submitted ? "Demo Request Submitted" : "Book a Free Demo"}
          </DialogTitle>
          <DialogDescription>
            {submitted
              ? `Thank you! We'll be in touch shortly about ${productTitle}.`
              : `See ${productTitle} in action. Fill in your details and we'll schedule a personalized demo.`}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
            <div>
              <h3
                className="text-lg font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Request Received!
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Our team will review your request and contact you within 24 hours to schedule the demo.
              </p>
            </div>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="demo-name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="demo-name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setNameError("") }}
                  className={nameError ? "border-destructive" : ""}
                  disabled={loading}
                />
                {nameError && <p className="text-xs text-destructive">{nameError}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="demo-company">Company Name</Label>
                <Input
                  id="demo-company"
                  placeholder="Acme Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="demo-email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="demo-email"
                  type="email"
                  placeholder="john@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError("") }}
                  className={emailError ? "border-destructive" : ""}
                  disabled={loading}
                />
                {emailError && <p className="text-xs text-destructive">{emailError}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="demo-phone">Phone</Label>
                <Input
                  id="demo-phone"
                  type="tel"
                  placeholder="+92 300 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="demo-business">Business Type</Label>
                <Select value={businessType} onValueChange={setBusinessType} disabled={loading}>
                  <SelectTrigger id="demo-business">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((bt) => (
                      <SelectItem key={bt} value={bt}>
                        {bt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="demo-time">Preferred Demo Time</Label>
                <Input
                  id="demo-time"
                  type="datetime-local"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="demo-message">Additional Message</Label>
              <Textarea
                id="demo-message"
                placeholder="Tell us about your needs or any specific features you'd like to see..."
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="mt-1 w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  Book Free Demo
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
