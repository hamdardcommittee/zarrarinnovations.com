"use client"

import { useEffect, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"

const IPINFO_TOKEN = "41891fde9e0253"

interface GeoData {
  ip: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  timezone: string
}

interface AnalyticsData {
  page_path: string
  page_title: string
  referrer: string
  user_agent: string
  screen_width: number
  screen_height: number
  language: string
  ip_address: string | null
  city: string | null
  region: string | null
  country: string | null
  timezone: string | null
  org: string | null
  session_id: string
  time_spent: number
  scroll_depth: number
  created_at: string
}

function generateSessionId(): string {
  if (typeof window === "undefined") return ""
  let sessionId = sessionStorage.getItem("zi_session_id")
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem("zi_session_id", sessionId)
  }
  return sessionId
}

async function getGeoData(): Promise<GeoData | null> {
  try {
    const res = await fetch(`https://ipinfo.io?token=${IPINFO_TOKEN}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function getScrollDepth(): number {
  if (typeof window === "undefined") return 0
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  )
  const winHeight = window.innerHeight
  const scrollPercent = Math.round((scrollTop / (docHeight - winHeight)) * 100) || 0
  return Math.min(100, Math.max(0, scrollPercent))
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const startTimeRef = useRef<number>(Date.now())
  const maxScrollRef = useRef<number>(0)
  const geoDataRef = useRef<GeoData | null>(null)
  const hasSentRef = useRef<boolean>(false)
  const sessionIdRef = useRef<string>("")

  const sendAnalytics = useCallback(async (isBeacon = false) => {
    if (hasSentRef.current) return
    hasSentRef.current = true

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000)
    
    const data: AnalyticsData = {
      page_path: pathname,
      page_title: document.title,
      referrer: document.referrer || "",
      user_agent: navigator.userAgent,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      language: navigator.language,
      ip_address: geoDataRef.current?.ip || null,
      city: geoDataRef.current?.city || null,
      region: geoDataRef.current?.region || null,
      country: geoDataRef.current?.country || null,
      timezone: geoDataRef.current?.timezone || null,
      org: geoDataRef.current?.org || null,
      session_id: sessionIdRef.current,
      time_spent: timeSpent,
      scroll_depth: maxScrollRef.current,
      created_at: new Date().toISOString(),
    }

    if (isBeacon) {
      navigator.sendBeacon("/api/analytics", JSON.stringify(data))
    } else {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
      } catch {
        // Silent fail
      }
    }
  }, [pathname])

  useEffect(() => {
    // Initialize session
    sessionIdRef.current = generateSessionId()

    // Fetch geo data once
    if (!geoDataRef.current) {
      getGeoData().then((data) => {
        geoDataRef.current = data
      })
    }
  }, [])

  useEffect(() => {
    // Reset tracking for new page
    startTimeRef.current = Date.now()
    maxScrollRef.current = 0
    hasSentRef.current = false

    // Track scroll depth
    const handleScroll = () => {
      const depth = getScrollDepth()
      if (depth > maxScrollRef.current) {
        maxScrollRef.current = depth
      }
    }

    // Handle visibility change (tab switch, minimize)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendAnalytics(true)
      }
    }

    // Handle page unload
    const handleBeforeUnload = () => {
      sendAnalytics(true)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("beforeunload", handleBeforeUnload)

    // Track initial scroll position
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      // Send analytics when navigating to a new page
      sendAnalytics(false)
    }
  }, [pathname, sendAnalytics])

  return null
}
