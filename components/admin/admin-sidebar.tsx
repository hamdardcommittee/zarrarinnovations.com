"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, PlusCircle, Settings, LogOut, ExternalLink, Users, UserCircle, Briefcase, ClipboardList, Package, Play, ImageIcon, FolderKanban, FileBarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/auth/actions"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/leads", icon: Users },
  { label: "All Posts", href: "/admin/posts", icon: FileText },
  { label: "New Post", href: "/admin/posts/new", icon: PlusCircle },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Portfolio", href: "/admin/portfolio", icon: FolderKanban },
  { label: "Case Studies", href: "/admin/case-studies", icon: FileBarChart },
  { label: "Demo Requests", href: "/admin/demo-requests", icon: Play },
  { label: "Media Slider", href: "/admin/media", icon: ImageIcon },
  { label: "Careers", href: "/admin/careers", icon: Briefcase },
  { label: "Applications", href: "/admin/applications", icon: ClipboardList },
  { label: "Profile", href: "/admin/profile", icon: UserCircle },
  { label: "Setup DB", href: "/admin/setup", icon: Settings },
]

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-5 py-4">
        <img
          src="https://res.cloudinary.com/dey8xaf7r/image/upload/v1771421025/android-chrome-192x192_jc7jht.png"
          alt="Zarrar Innovations logo"
          className="size-8"
        />
        <div>
          <h2
            className="text-sm font-bold"
            style={{ fontFamily: "var(--font-heading)", color: "#31028f" }}
          >
            Admin Panel
          </h2>
          <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Admin navigation">
        {sidebarLinks.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="flex flex-col gap-2 border-t p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/60 transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ExternalLink className="size-4" />
          View Site
        </Link>
        <form>
          <Button
            formAction={logout}
            variant="ghost"
            className="w-full justify-start gap-3 text-foreground/60 hover:text-destructive"
            size="sm"
          >
            <LogOut className="size-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </aside>
  )
}
