import type { Metadata } from "next"
import { ServiceSubpage } from "@/components/service-subpage"
import { managementsSection } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "POS System",
  description:
    "Modern point-of-sale systems for retail, restaurants, and services.",
}

export default function POSPage() {
  const subPage = managementsSection.subPages.find((s) => s.slug === "pos")!
  return <ServiceSubpage section={managementsSection} subPage={subPage} />
}
