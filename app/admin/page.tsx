import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Eye,
  FolderOpen,
  Users,
  MessageSquare,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Package,
  Play,
} from "lucide-react"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Blog stats
  const { count: totalPosts } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })

  const { count: publishedPosts } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("published", true)

  const { count: draftPosts } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("published", false)

  const { count: categoryCount } = await supabase
    .from("blog_categories")
    .select("*", { count: "exact", head: true })

  // Leads stats
  const { count: totalLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })

  const { count: newLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("status", "new")

  const { count: followUpLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("status", "follow-up")

  // Products stats
  const { count: totalProducts } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })

  // Demo requests stats
  const { count: totalDemoRequests } = await supabase
    .from("demo_requests")
    .select("*", { count: "exact", head: true })

  const { count: pendingDemos } = await supabase
    .from("demo_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  // Recent demo requests
  const { data: recentDemos } = await supabase
    .from("demo_requests")
    .select("id, name, email, product_title, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  // Page views (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const { count: pageViews } = await supabase
    .from("site_analytics")
    .select("*", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo.toISOString())

  // Recent posts
  const { data: recentPosts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, category, published, date, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  // Recent leads
  const { data: recentLeads } = await supabase
    .from("leads")
    .select("id, name, email, service, status, subject, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  // Activity logs
  const { data: recentActivity } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8)

  const kpiStats = [
    { label: "Total Leads", value: totalLeads ?? 0, icon: Users, color: "#31028f", href: "/admin/leads" },
    { label: "New Inquiries", value: newLeads ?? 0, icon: MessageSquare, color: "#16a34a", href: "/admin/leads?status=new" },
    { label: "Follow-ups", value: followUpLeads ?? 0, icon: Clock, color: "#d97706", href: "/admin/leads?status=follow-up" },
    { label: "Page Views (30d)", value: pageViews ?? 0, icon: TrendingUp, color: "#0284c7", href: "#" },
    { label: "Products", value: totalProducts ?? 0, icon: Package, color: "#7c3aed", href: "/admin/products" },
    { label: "Demo Requests", value: totalDemoRequests ?? 0, icon: Play, color: "#dc2626", href: "/admin/demo-requests" },
    { label: "Pending Demos", value: pendingDemos ?? 0, icon: Clock, color: "#ea580c", href: "/admin/demo-requests" },
  ]

  const blogStats = [
    { label: "Total Posts", value: totalPosts ?? 0, icon: FileText, color: "#31028f" },
    { label: "Published", value: publishedPosts ?? 0, icon: Eye, color: "#16a34a" },
    { label: "Drafts", value: draftPosts ?? 0, icon: Clock, color: "#d97706" },
    { label: "Categories", value: categoryCount ?? 0, icon: FolderOpen, color: "#5b21b6" },
  ]

  const statusColors: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-green-100 text-green-700",
    "follow-up": "bg-amber-100 text-amber-700",
    closed: "bg-secondary text-muted-foreground",
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
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold tracking-tight lg:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your website performance, leads, and content.
        </p>
      </div>

      {/* KPI Stats */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Leads & Analytics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiStats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className="flex size-11 items-center justify-center rounded-lg"
                    style={{ backgroundColor: stat.color + "15" }}
                  >
                    <stat.icon className="size-5" style={{ color: stat.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                      {stat.value}
                    </p>
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground/40" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Blog Stats */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Blog Content
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {blogStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className="flex size-11 items-center justify-center rounded-lg"
                  style={{ backgroundColor: stat.color + "15" }}
                >
                  <stat.icon className="size-5" style={{ color: stat.color }} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "New Blog Post", href: "/admin/posts/new", desc: "Create new content" },
          { label: "View Leads", href: "/admin/leads", desc: "Manage inquiries" },
          { label: "All Posts", href: "/admin/posts", desc: "Manage blog content" },
          { label: "Products", href: "/admin/products", desc: "Manage products" },
          { label: "Demo Requests", href: "/admin/demo-requests", desc: "View demo requests" },
          { label: "Database Setup", href: "/admin/setup", desc: "Configure tables" },
        ].map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-0.5">
              <CardContent className="flex flex-col gap-1 p-5">
                <span className="text-sm font-semibold" style={{ color: "#31028f" }}>
                  {link.label}
                </span>
                <span className="text-xs text-muted-foreground">{link.desc}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Demo Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Recent Demo Requests
          </CardTitle>
          <Link href="/admin/demo-requests" className="text-xs font-medium text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {!recentDemos || recentDemos.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Play className="size-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                No demo requests yet. Requests from the products page will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {recentDemos.map((demo) => (
                <div key={demo.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-sm font-medium">{demo.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {demo.email} &middot; {demo.product_title}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] ${
                        demo.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : demo.status === "scheduled"
                            ? "bg-blue-100 text-blue-700"
                            : demo.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : ""
                      }`}
                    >
                      {demo.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {timeAgo(demo.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Two-column: Recent Leads + Recent Posts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Recent Leads
            </CardTitle>
            <Link href="/admin/leads" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {!recentLeads || recentLeads.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <Users className="size-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No leads yet. Leads from the contact form will appear here.
                </p>
              </div>
            ) : (
              <div className="flex flex-col divide-y">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-sm font-medium">{lead.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {lead.email} &middot; {lead.service}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${statusColors[lead.status] || ""}`}
                      >
                        {lead.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {timeAgo(lead.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-bold" style={{ fontFamily: "var(--font-heading)" }}>
              Recent Posts
            </CardTitle>
            <Link href="/admin/posts" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {!recentPosts || recentPosts.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <FileText className="size-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No posts yet.{" "}
                  <Link href="/admin/setup" className="text-primary hover:underline">
                    Seed the database
                  </Link>{" "}
                  to get started.
                </p>
              </div>
            ) : (
              <div className="flex flex-col divide-y">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/admin/posts/${post.id}/edit`}
                    className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-sm font-medium">{post.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {post.category} &middot; {post.date}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        post.published
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold" style={{ fontFamily: "var(--font-heading)" }}>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!recentActivity || recentActivity.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Clock className="size-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">
                No activity yet. Actions will be logged here as you manage content and leads.
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {recentActivity.map((log) => (
                <div key={log.id} className="flex items-center gap-3 py-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent">
                    <Clock className="size-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm">
                      <span className="font-medium">{log.user_email || "System"}</span>{" "}
                      <span className="text-muted-foreground">{log.action}</span>{" "}
                      {log.resource_title && (
                        <span className="font-medium">{log.resource_title}</span>
                      )}
                    </span>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {timeAgo(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
