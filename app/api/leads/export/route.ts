import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Build CSV
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Subject",
    "Service",
    "Message",
    "Status",
    "Notes",
    "Created At",
  ]

  const rows = (leads || []).map((lead) => [
    `"${(lead.name || "").replace(/"/g, '""')}"`,
    `"${(lead.email || "").replace(/"/g, '""')}"`,
    `"${(lead.phone || "").replace(/"/g, '""')}"`,
    `"${(lead.subject || "").replace(/"/g, '""')}"`,
    `"${(lead.service || "").replace(/"/g, '""')}"`,
    `"${(lead.message || "").replace(/"/g, '""')}"`,
    `"${(lead.status || "").replace(/"/g, '""')}"`,
    `"${(lead.notes || "").replace(/"/g, '""')}"`,
    `"${lead.created_at}"`,
  ])

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=leads-${new Date().toISOString().split("T")[0]}.csv`,
    },
  })
}
