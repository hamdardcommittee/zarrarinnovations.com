"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Users,
  Search,
  Download,
  Loader2,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Trash2,
  Eye,
  X,
} from "lucide-react"

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  service: string
  status: string
  notes: string | null
  created_at: string
  updated_at: string
}

const statuses = [
  { value: "all", label: "All Statuses" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "follow-up", label: "Follow-up" },
  { value: "closed", label: "Closed" },
]

const services = [
  { value: "all", label: "All Services" },
  { value: "General", label: "General" },
  { value: "Web Development", label: "Web Development" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "E-Commerce", label: "E-Commerce" },
  { value: "Mobile Apps", label: "Mobile Apps" },
  { value: "Business Systems", label: "Business Systems" },
  { value: "Shopify", label: "Shopify" },
  { value: "WordPress", label: "WordPress" },
]

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-green-100 text-green-700",
  "follow-up": "bg-amber-100 text-amber-700",
  closed: "bg-secondary text-muted-foreground",
}

export default function LeadsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")
  const [serviceFilter, setServiceFilter] = useState(searchParams.get("service") || "all")
  const [fromDate, setFromDate] = useState(searchParams.get("from") || "")
  const [toDate, setToDate] = useState(searchParams.get("to") || "")

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (statusFilter !== "all") params.set("status", statusFilter)
    if (serviceFilter !== "all") params.set("service", serviceFilter)
    if (search) params.set("search", search)
    if (fromDate) params.set("from", fromDate)
    if (toDate) params.set("to", toDate)

    try {
      const res = await fetch(`/api/leads?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [statusFilter, serviceFilter, search, fromDate, toDate])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  async function updateLeadStatus(id: string, newStatus: string) {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        )
        if (selectedLead?.id === id) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null))
        }
      }
    } finally {
      setUpdatingId(null)
    }
  }

  async function updateLeadNotes(id: string, notes: string) {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      })
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, notes } : l))
        )
      }
    } catch {
      // silently fail
    }
  }

  async function deleteLead(id: string) {
    if (!confirm("Are you sure you want to delete this lead?")) return
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" })
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id))
        if (selectedLead?.id === id) setSelectedLead(null)
      }
    } catch {
      // silently fail
    }
  }

  async function handleExport() {
    window.open("/api/leads/export", "_blank")
  }

  function clearFilters() {
    setSearch("")
    setStatusFilter("all")
    setServiceFilter("all")
    setFromDate("")
    setToDate("")
    router.replace("/admin/leads")
  }

  const hasActiveFilters =
    search || statusFilter !== "all" || serviceFilter !== "all" || fromDate || toDate

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight lg:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Leads & Inquiries
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage contact form submissions and service requests.
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="shrink-0">
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="size-3.5" />
                Clear
              </Button>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">From Date</Label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">To Date</Label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="size-4" />
        <span>{leads.length} lead{leads.length !== 1 ? "s" : ""} found</span>
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : leads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-accent">
              <Users className="size-8 text-muted-foreground/40" />
            </div>
            <div>
              <h3 className="font-semibold">No leads found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasActiveFilters
                  ? "Try adjusting your filters."
                  : "Leads from the contact form will appear here."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {leads.map((lead) => (
            <Card key={lead.id} className="transition-shadow hover:shadow-sm">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{lead.name}</span>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${statusColors[lead.status] || ""}`}
                    >
                      {lead.status}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {lead.service}
                    </Badge>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{lead.subject}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="size-3" />
                      {lead.email}
                    </span>
                    {lead.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" />
                        {lead.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Select
                    value={lead.status}
                    onValueChange={(val) => updateLeadStatus(lead.id, val)}
                    disabled={updatingId === lead.id}
                  >
                    <SelectTrigger className="h-8 w-[130px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <Eye className="size-3.5" />
                    <span className="sr-only">View lead details</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => deleteLead(lead.id)}
                  >
                    <Trash2 className="size-3.5" />
                    <span className="sr-only">Delete lead</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-lg">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle
                  className="text-lg"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {selectedLead.name}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={statusColors[selectedLead.status] || ""}
                  >
                    {selectedLead.status}
                  </Badge>
                  <Badge variant="outline">{selectedLead.service}</Badge>
                </div>

                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-primary hover:underline"
                    >
                      {selectedLead.email}
                    </a>
                  </div>
                  {selectedLead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-muted-foreground" />
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="text-primary hover:underline"
                      >
                        {selectedLead.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span>{new Date(selectedLead.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <h4 className="mb-1.5 text-sm font-semibold">Subject</h4>
                  <p className="text-sm text-muted-foreground">{selectedLead.subject}</p>
                </div>

                <div>
                  <h4 className="mb-1.5 text-sm font-semibold">Message</h4>
                  <div className="rounded-lg bg-accent/50 p-3">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {selectedLead.message}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-1.5 text-sm font-semibold">Internal Notes</h4>
                  <Textarea
                    placeholder="Add internal notes about this lead..."
                    defaultValue={selectedLead.notes || ""}
                    rows={3}
                    onBlur={(e) =>
                      updateLeadNotes(selectedLead.id, e.target.value)
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold">Update Status</Label>
                  <Select
                    value={selectedLead.status}
                    onValueChange={(val) => updateLeadStatus(selectedLead.id, val)}
                  >
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    asChild
                    className="flex-1"
                    variant="outline"
                  >
                    <a href={`mailto:${selectedLead.email}?subject=Re: ${selectedLead.subject}`}>
                      <Mail className="size-4" />
                      Reply via Email
                    </a>
                  </Button>
                  {selectedLead.phone && (
                    <Button asChild variant="outline">
                      <a href={`https://wa.me/${selectedLead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                        <MessageSquare className="size-4" />
                        WhatsApp
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
