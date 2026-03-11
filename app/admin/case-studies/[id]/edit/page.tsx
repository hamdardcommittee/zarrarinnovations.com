"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { CaseStudyForm } from "@/components/admin/case-study-form"
import { Loader2 } from "lucide-react"

export default function EditCaseStudyPage() {
  const params = useParams()
  const [study, setStudy] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStudy() {
      try {
        const res = await fetch(`/api/case-studies/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setStudy(data)
        }
      } catch {
        // Handle error
      } finally {
        setLoading(false)
      }
    }
    fetchStudy()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!study) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Case study not found</p>
      </div>
    )
  }

  return <CaseStudyForm study={study} />
}
