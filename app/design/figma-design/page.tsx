import type { Metadata } from "next"
import { ServiceSubpage } from "@/components/service-subpage"
import { designSection } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Figma Design",
  description:
    "Expert Figma design systems, component libraries, and interactive prototypes.",
}

export default function FigmaDesignPage() {
  const subPage = designSection.subPages.find((s) => s.slug === "figma-design")!
  return <ServiceSubpage section={designSection} subPage={subPage} />
}
