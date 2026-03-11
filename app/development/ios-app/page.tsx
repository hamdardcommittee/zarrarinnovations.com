import type { Metadata } from "next"
import { ServiceSubpage } from "@/components/service-subpage"
import { developmentSection } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "iOS App Development",
  description:
    "Native iOS applications optimized for the Apple ecosystem with App Store deployment.",
}

export default function IOSAppPage() {
  const subPage = developmentSection.subPages.find(
    (s) => s.slug === "ios-app"
  )!
  return <ServiceSubpage section={developmentSection} subPage={subPage} />
}
