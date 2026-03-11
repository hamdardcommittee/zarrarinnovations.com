import type { Metadata } from "next"
import { ServiceSubpage } from "@/components/service-subpage"
import { managementsSection } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Custom ERP",
  description:
    "Tailored ERP solutions that unify your entire business workflow.",
}

export default function CustomERPPage() {
  const subPage = managementsSection.subPages.find(
    (s) => s.slug === "custom-erp"
  )!
  return <ServiceSubpage section={managementsSection} subPage={subPage} />
}
