import { createClient as createBrowserClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

function createAnonClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const anon = createAnonClient()
    
    let body
    const contentType = request.headers.get("content-type") || ""
    
    if (contentType.includes("text/plain") || !contentType) {
      // Handle sendBeacon which sends as text/plain
      const text = await request.text()
      body = JSON.parse(text)
    } else {
      body = await request.json()
    }

    const {
      page_path,
      page_title,
      referrer,
      user_agent,
      screen_width,
      screen_height,
      language,
      ip_address,
      city,
      region,
      country,
      timezone,
      org,
      session_id,
      time_spent,
      scroll_depth,
    } = body

    // Don't track admin pages
    if (page_path?.startsWith("/admin")) {
      return NextResponse.json({ success: true, skipped: true })
    }

    const { error } = await anon.from("site_analytics").insert({
      page_path,
      page_title,
      referrer,
      user_agent,
      screen_width,
      screen_height,
      language,
      ip_address,
      city,
      region,
      country,
      timezone,
      org,
      session_id,
      time_spent,
      scroll_depth,
    })

    if (error) {
      console.error("Analytics insert error:", error)
      // Don't return error to client, just log it
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Analytics error:", err)
    return NextResponse.json({ success: true })
  }
}
