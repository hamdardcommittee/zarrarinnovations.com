"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/dialog"
import {
  Loader2,
  Play,
  Calendar,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Clock,
  MessageSquare,
  Trash2,
} from "lucide-react"

interface DemoRequest {
  id: string
  product_id: string | null
  product_title: string
  name: string
  company_name: string | null
  email: string
  phone: string | null
  business_type: string | null
  preferred_demo_time: string | null
  message: string | null
  status: string
  notes: string | null
  created_at: string
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-secondary text-muted-foreground",
}

export default function AdminDemoRequestsPage() {
  const [requests, setRequests] = useState<DemoRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")
  const [selected, setSelected] = useState<DemoRequest | null>(null)

  async function fetchRequests() {
    setLoading(true)
    try {
      const url = statusFilter === "all"
        ? "/api/demo-requests"
        : `/api/demo-requests?status=${statusFilter}`
      const res = await fetch(url)
      const data = await res.json()
      if (Array.isArray(data)) setRequests(data)
    } catch { /* ignore */ }
    setLoading(false)
  }

  useEffect(() => { fetchRequests() }, [statusFilter])

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/demo-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
    if (selected?.id === id) setSelected({ ...selected, status })
  }

  async function deleteRequest(id: string) {
    if (!confirm("Are you sure you want to delete this demo request?")) return
    await fetch(`/api/demo-requests/${id}`, { method: "DELETE" })
    setRequests((prev) => prev.filter((r) => r.id !== id))
    setSelected(null)
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight lg:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Demo Requests
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage product demo requests from potential clients.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: requests.length, color: "#31028f" },
          { label: "Pending", value: requests.filter((r) => r.status === "pending").length, color: "#d97706" },
          { label: "Scheduled", value: requests.filter((r) => r.status === "scheduled").length, color: "#0284c7" },
          { label: "Completed", value: requests.filter((r) => r.status === "completed").length, color: "#16a34a" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div
                className="flex size-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: stat.color + "15" }}
              >
                <Play className="size-4" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Play className="size-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No demo requests yet. Requests from the products page will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">Email</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {requests.map((req) => (
                    <tr
                      key={req.id}
                      className="cursor-pointer transition-colors hover:bg-accent/50"
                      onClick={() => setSelected(req)}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{req.name}</p>
                          {req.company_name && (
                            <p className="text-xs text-muted-foreground">{req.company_name}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{req.product_title}</td>
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                        {req.email}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={statusColors[req.status] || ""}>
                          {req.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {timeAgo(req.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={req.status}
                          onValueChange={(v) => {
                            updateStatus(req.id, v)
                          }}
                        >
                          <SelectTrigger
                            className="h-8 w-28 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle
                  className="text-lg font-bold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Demo Request Details
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={`text-sm ${statusColors[selected.status] || ""}`}
                  >
                    {selected.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(selected.created_at).toLocaleString()}
                  </span>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="size-4 text-muted-foreground" />
                      <span className="font-medium">{selected.name}</span>
                      {selected.company_name && (
                        <span className="text-muted-foreground">at {selected.company_name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="size-4 text-muted-foreground" />
                      <a href={`mailto:${selected.email}`} className="text-primary hover:underline">
                        {selected.email}
                      </a>
                    </div>
                    {selected.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="size-4 text-muted-foreground" />
                        {selected.phone}
                      </div>
                    )}
                    {selected.business_type && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="size-4 text-muted-foreground" />
                        {selected.business_type}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Request Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Play className="size-4 text-muted-foreground" />
                      <span className="font-medium">Product:</span> {selected.product_title}
                    </div>
                    {selected.preferred_demo_time && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="font-medium">Preferred Time:</span>{" "}
                        {new Date(selected.preferred_demo_time).toLocaleString()}
                      </div>
                    )}
                    {selected.message && (
                      <div className="flex items-start gap-2 text-sm">
                        <MessageSquare className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Message:</span>
                          <p className="mt-1 text-muted-foreground">{selected.message}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex items-center justify-between pt-2">
                  <Select
                    value={selected.status}
                    onValueChange={(v) => updateStatus(selected.id, v)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => deleteRequest(selected.id)}
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
