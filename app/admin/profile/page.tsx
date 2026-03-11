"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import {
  User,
  Lock,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Shield,
} from "lucide-react"

export default function ProfilePage() {
  const supabase = createClient()
  const [user, setUser] = useState<{ email: string; id: string; created_at: string } | null>(null)
  const [loading, setLoading] = useState(true)

  // Password change
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [pwLoading, setPwLoading] = useState(false)
  const [pwResult, setPwResult] = useState<{ success: boolean; message: string } | null>(null)

  // Email change
  const [newEmail, setNewEmail] = useState("")
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailResult, setEmailResult] = useState<{ success: boolean; message: string } | null>(null)

  // Activity logs
  const [logs, setLogs] = useState<Array<{ id: string; action: string; resource_type: string; resource_title: string; created_at: string }>>([])

  useEffect(() => {
    async function loadData() {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (u) {
        setUser({ email: u.email || "", id: u.id, created_at: u.created_at })
      }

      // Load activity logs for this user
      const { data: logData } = await supabase
        .from("activity_logs")
        .select("id, action, resource_type, resource_title, created_at")
        .order("created_at", { ascending: false })
        .limit(20)

      if (logData) setLogs(logData)
      setLoading(false)
    }
    loadData()
  }, [supabase])

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPwResult(null)

    if (newPassword.length < 6) {
      setPwResult({ success: false, message: "Password must be at least 6 characters." })
      return
    }

    if (newPassword !== confirmPassword) {
      setPwResult({ success: false, message: "Passwords do not match." })
      return
    }

    setPwLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPwResult({ success: false, message: error.message })
    } else {
      setPwResult({ success: true, message: "Password updated successfully." })
      setNewPassword("")
      setConfirmPassword("")
    }
    setPwLoading(false)
  }

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault()
    setEmailResult(null)

    if (!newEmail) {
      setEmailResult({ success: false, message: "Please enter a valid email." })
      return
    }

    setEmailLoading(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) {
      setEmailResult({ success: false, message: error.message })
    } else {
      setEmailResult({
        success: true,
        message: "Confirmation email sent to both old and new address. Check your inbox.",
      })
      setNewEmail("")
    }
    setEmailLoading(false)
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight lg:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Account Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your admin account, security, and activity.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account Info */}
        <Card>
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="size-5 text-primary" />
            </div>
            <CardTitle className="mt-3">Account Info</CardTitle>
            <CardDescription>Your current admin account details.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">User ID</Label>
              <p className="break-all font-mono text-xs text-muted-foreground">{user?.id}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Account Created</Label>
              <p className="text-sm">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Change Email */}
        <Card>
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="size-5 text-primary" />
            </div>
            <CardTitle className="mt-3">Change Email</CardTitle>
            <CardDescription>Update your admin email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailChange} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="newEmail">New Email Address</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new@example.com"
                  required
                />
              </div>
              {emailResult && (
                <div
                  className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
                    emailResult.success
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-destructive/20 bg-destructive/10 text-destructive"
                  }`}
                >
                  {emailResult.success ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  )}
                  {emailResult.message}
                </div>
              )}
              <Button type="submit" disabled={emailLoading}>
                {emailLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Shield className="size-4" />
                )}
                {emailLoading ? "Updating..." : "Update Email"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="size-5 text-primary" />
            </div>
            <CardTitle className="mt-3">Change Password</CardTitle>
            <CardDescription>Update your admin password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                />
              </div>
              {pwResult && (
                <div
                  className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
                    pwResult.success
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-destructive/20 bg-destructive/10 text-destructive"
                  }`}
                >
                  {pwResult.success ? (
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  )}
                  {pwResult.message}
                </div>
              )}
              <Button type="submit" disabled={pwLoading}>
                {pwLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Lock className="size-4" />
                )}
                {pwLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Activity Logs */}
        <Card>
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="size-5 text-primary" />
            </div>
            <CardTitle className="mt-3">Activity Log</CardTitle>
            <CardDescription>Your recent admin actions.</CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <Clock className="size-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No activity recorded yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-col divide-y max-h-80 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 py-2.5">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent">
                      <Clock className="size-3 text-muted-foreground" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm">
                        {log.action}{" "}
                        {log.resource_title && (
                          <span className="font-medium">{log.resource_title}</span>
                        )}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {log.resource_type} &middot; {timeAgo(log.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
