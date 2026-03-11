import type { Metadata } from "next"
import { ServiceSubpage } from "@/components/service-subpage"
import { designSection } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Logo Design",
  description:
    "Memorable brand identities with custom logo design and full branding packages.",
}

export default function LogoDesignPage() {
  const subPage = designSection.subPages.find((s) => s.slug === "logo-design")!
  return <ServiceSubpage section={designSection} subPage={subPage} />
}
