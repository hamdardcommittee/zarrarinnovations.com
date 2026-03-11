import type { Metadata } from "next"
import { ServiceSectionLanding } from "@/components/service-section-landing"
import { developmentSection } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "Development Services",
  description:
    "Web, mobile, custom software, and iOS development services by Zarrar Innovations.",
}

const devProcess = [
  {
    step: "Discovery",
    description:
      "We understand your goals, users, and technical requirements through in-depth discovery sessions.",
  },
  {
    step: "Architecture",
    description:
      "We design the system architecture, choose the right tech stack, and create a development roadmap.",
  },
  {
    step: "Development",
    description:
      "Agile sprints with continuous integration, code reviews, and regular demos keep the project on track.",
  },
  {
    step: "Testing & Launch",
    description:
      "Rigorous QA, performance testing, and seamless deployment ensure a successful launch every time.",
  },
]

export default function DevelopmentPage() {
  return (
    <ServiceSectionLanding
      section={developmentSection}
      processSteps={devProcess}
    />
  )
}
