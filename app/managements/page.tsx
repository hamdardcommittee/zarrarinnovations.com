import type { Metadata } from "next"
import { ServiceSectionLanding } from "@/components/service-section-landing"
import { managementsSection } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Management Systems",
  description:
    "POS systems, school management, and custom ERP solutions by Zarrar Innovations.",
}

const mgmtProcess = [
  {
    step: "Requirements Analysis",
    description:
      "We map your existing workflows, identify pain points, and define functional requirements for the system.",
  },
  {
    step: "System Design",
    description:
      "Database architecture, module planning, role-based access control, and integration points are designed.",
  },
  {
    step: "Iterative Development",
    description:
      "We build module by module with regular demos so you can test and give feedback throughout the process.",
  },
  {
    step: "Training & Deployment",
    description:
      "Full deployment with user training, documentation, and ongoing support to ensure smooth adoption.",
  },
]

export default function ManagementsPage() {
  return (
    <ServiceSectionLanding
      section={managementsSection}
      processSteps={mgmtProcess}
    />
  )
}
