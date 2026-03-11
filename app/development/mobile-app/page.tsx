import type { Metadata } from "next"
import { ServiceSubpage } from "@/components/service-subpage"
import { developmentSection } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Mobile App Development",
  description:
    "Cross-platform mobile apps built with React Native and Flutter.",
}

export default function MobileAppPage() {
  const subPage = developmentSection.subPages.find(
    (s) => s.slug === "mobile-app"
  )!
  return <ServiceSubpage section={developmentSection} subPage={subPage} />
}
