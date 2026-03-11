import type { Metadata } from "next"
import { ServiceSubpage } from "@/components/service-subpage"
import { developmentSection } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Web Development",
  description:
    "Business websites, SaaS apps, and dashboards built with Next.js, React, and Node.js.",
}

export default function WebDevelopmentPage() {
  const subPage = developmentSection.subPages.find(
    (s) => s.slug === "web-development"
  )!
  return <ServiceSubpage section={developmentSection} subPage={subPage} />
}
