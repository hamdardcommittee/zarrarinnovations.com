import type { Metadata } from "next"
import { ServiceSubpage } from "@/components/service-subpage"
import { managementsSection } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "School Management System",
  description:
    "Comprehensive school management with student, fee, attendance, and parent portals.",
}

export default function SchoolPage() {
  const subPage = managementsSection.subPages.find(
    (s) => s.slug === "school"
  )!
  return <ServiceSubpage section={managementsSection} subPage={subPage} />
}
