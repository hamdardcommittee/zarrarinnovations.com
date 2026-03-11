import type { Metadata } from "next"
import { ServiceSubpage } from "@/components/service-subpage"
import { developmentSection } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Custom Development",
  description:
    "Tailored software solutions, API integrations, and automation systems.",
}

export default function CustomDevelopmentPage() {
  const subPage = developmentSection.subPages.find(
    (s) => s.slug === "custom-development"
  )!
  return <ServiceSubpage section={developmentSection} subPage={subPage} />
}
