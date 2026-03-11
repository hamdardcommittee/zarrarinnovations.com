"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Lock, Loader2, Eye, EyeOff, AlertCircle, Mail } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  function validateForm() {
    let valid = true
    setEmailError("")
    setPasswordError("")

    if (!email.trim()) {
      setEmailError("Email is required")
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address")
      valid = false
    }

    if (!password) {
      setPasswordError("Password is required")
      valid = false
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      valid = false
    }

    return valid
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        if (authError.message.includes("Invalid login")) {
          setError("Incorrect email or password. Please check your credentials and try again.")
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Your email has not been confirmed. Please check your inbox for a verification link.")
        } else if (authError.message.includes("Too many requests")) {
          setError("Too many login attempts. Please wait a moment and try again.")
        } else {
          setError(authError.message)
        }
        return
      }

      router.push("/admin")
      router.refresh()
    } catch {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to site
        </Link>

        <Card className="border-border/60 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
              <Lock className="size-6 text-primary" />
            </div>
            <CardTitle
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Admin Login
            </CardTitle>
            <CardDescription>
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError("")
                    }}
                    className={`pl-10 ${emailError ? "border-destructive" : ""}`}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-destructive">{emailError}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (passwordError) setPasswordError("")
                    }}
                    className={`pl-10 pr-10 ${passwordError ? "border-destructive" : ""}`}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-destructive">{passwordError}</p>
                )}
              </div>

              <Button type="submit" className="mt-1 w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Protected area. Only authorized administrators can access the dashboard.
        </p>
      </div>
    </div>
  )
}
