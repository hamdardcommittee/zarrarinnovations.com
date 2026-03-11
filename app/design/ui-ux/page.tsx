import type { Metadata } from "next"
import { ServiceSubpage } from "@/components/service-subpage"
import { designSection } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "UI/UX Design",
  description:
    "Research-driven UI/UX design that creates intuitive, user-friendly experiences.",
}

export default function UIUXPage() {
  const subPage = designSection.subPages.find((s) => s.slug === "ui-ux")!
  return <ServiceSubpage section={designSection} subPage={subPage} />
}
