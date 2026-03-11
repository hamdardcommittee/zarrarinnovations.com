import type { Metadata } from "next"
import { ServiceSectionLanding } from "@/components/service-section-landing"
import { designSection } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Design Services",
  description:
    "UI/UX design, Figma prototyping, logo design, and branding services by Zarrar Innovations.",
}

const designProcess = [
  {
    step: "Research",
    description:
      "We deep-dive into your market, audience, and competitors to build a solid foundation for every design decision.",
  },
  {
    step: "Wireframe",
    description:
      "Low-fidelity wireframes map out the user journey and page structure before any visual design begins.",
  },
  {
    step: "Design",
    description:
      "High-fidelity mockups with your brand identity, interactive prototypes, and comprehensive design systems.",
  },
  {
    step: "Delivery",
    description:
      "Pixel-perfect handoff with design tokens, assets, and documentation your development team can run with.",
  },
]

export default function DesignPage() {
  return (
    <ServiceSectionLanding section={designSection} processSteps={designProcess} />
  )
}
