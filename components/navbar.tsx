"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { navLinks, servicesDropdown } from "@/lib/site-data"
import { cn } from "@/lib/utils"

/* ─── Desktop Services Mega Dropdown ─── */
function ServicesMegaDropdown({ pathname }: { pathname: string }) {
  const isServicesActive =
    pathname.startsWith("/design") ||
    pathname.startsWith("/development") ||
    pathname.startsWith("/managements")

  return (
    <div className="group relative">
      <button
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
          isServicesActive ? "text-primary" : "text-foreground/80"
        )}
      >
        Services
        <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180" />
      </button>

      {/* Mega dropdown panel */}
      <div className="pointer-events-none absolute left-1/2 top-full z-50 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 -translate-x-1/2">
        <div className="w-[640px] rounded-xl border bg-card p-6 shadow-xl">
          <div className="grid grid-cols-3 gap-6">
            {servicesDropdown.map((group) => (
              <div key={group.heading}>
                <Link
                  href={group.href}
                  className="mb-3 block text-xs font-semibold uppercase tracking-wider transition-colors hover:text-primary"
                  style={{ color: "#31028f" }}
                >
                  {group.heading}
                </Link>
                <ul className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          pathname === item.href
                            ? "bg-accent font-medium text-primary"
                            : "text-foreground/70"
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-5 flex items-center gap-3 border-t pt-4">
            <Link
              href="/services"
              className="flex-1 rounded-lg px-3 py-2 text-center text-xs font-semibold transition-colors hover:bg-accent"
              style={{ color: "#31028f" }}
            >
              View All Services
            </Link>
            {servicesDropdown.map((group) => (
              <Link
                key={group.href}
                href={group.href}
                className="flex-1 rounded-lg px-3 py-2 text-center text-xs font-medium text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
              >
                {group.heading}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Mobile Services Accordion ─── */
function MobileServicesAccordion({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate: () => void
}) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div>
      <button
        onClick={() => setExpanded(expanded === "services" ? null : "services")}
        className={cn(
          "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
          (pathname.startsWith("/design") ||
            pathname.startsWith("/development") ||
            pathname.startsWith("/managements"))
            ? "text-primary"
            : "text-foreground/80"
        )}
      >
        Services
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            expanded === "services" && "rotate-180"
          )}
        />
      </button>

      {expanded === "services" && (
        <div className="ml-3 flex flex-col gap-2 border-l pl-3 pt-1">
          {servicesDropdown.map((group) => (
            <MobileServiceGroup
              key={group.heading}
              group={group}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function MobileServiceGroup({
  group,
  pathname,
  onNavigate,
}: {
  group: (typeof servicesDropdown)[number]
  pathname: string
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
        style={{ color: "#31028f" }}
      >
        {group.heading}
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="ml-3 flex flex-col border-l pl-3">
          <Link
            href={group.href}
            onClick={onNavigate}
            className="rounded-md px-3 py-1.5 text-sm text-foreground/60 transition-colors hover:bg-accent"
          >
            Overview
          </Link>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent",
                pathname === item.href
                  ? "font-medium text-primary"
                  : "text-foreground/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Main Navbar ─── */
export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/dey8xaf7r/image/upload/v1771421025/android-chrome-192x192_jc7jht.png"
            alt="Zarrar Innovations logo"
            className="size-8"
          />
          <span
            className="text-lg font-bold tracking-tight"
            style={{
              fontFamily: "var(--font-heading)",
              color: "#31028f",
            }}
          >
            Zarrar Innovations
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-foreground/80"
            )}
          >
            Home
          </Link>

          <ServicesMegaDropdown pathname={pathname} />

          {navLinks
            .filter((l) => l.label !== "Home")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "text-primary"
                    : "text-foreground/80"
                )}
              >
                {item.label}
              </Link>
            ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button asChild size="lg">
            <a
              href="https://wa.me/96877627362"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get in Touch
            </a>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">Main site navigation links and services</SheetDescription>
            <div className="flex items-center justify-between border-b p-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                <img
                  src="https://res.cloudinary.com/dey8xaf7r/image/upload/v1771421025/android-chrome-192x192_jc7jht.png"
                  alt="Zarrar Innovations logo"
                  className="size-8"
                />
                <span className="font-bold" style={{ color: "#31028f" }}>
                  Zarrar Innovations
                </span>
              </Link>
            </div>
            <nav className="flex flex-col p-4" aria-label="Mobile navigation">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={cn(
                  "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                  pathname === "/" ? "text-primary" : "text-foreground/80"
                )}
              >
                Home
              </Link>

              <MobileServicesAccordion
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />

              {navLinks
                .filter((l) => l.label !== "Home")
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                      pathname === item.href
                        ? "text-primary"
                        : "text-foreground/80"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

              <div className="mt-4 border-t pt-4">
                <Button asChild className="w-full" size="lg">
                  <a
                    href="https://wa.me/96877627362"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get in Touch
                  </a>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
