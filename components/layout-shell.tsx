"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnalyticsTracker } from "@/components/analytics-tracker"

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")
  const isAuth = pathname.startsWith("/auth")

  if (isAdmin) {
    return (
      <>
        <AnalyticsTracker />
        {children}
      </>
    )
  }

  return (
    <>
      <AnalyticsTracker />
      {!isAuth && <Navbar />}
      <main>{children}</main>
      {!isAuth && <Footer />}
    </>
  )
}
