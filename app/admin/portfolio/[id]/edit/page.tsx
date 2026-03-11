"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PortfolioForm } from "@/components/admin/portfolio-form"
import { Loader2 } from "lucide-react"

export default function EditPortfolioPage() {
  const params = useParams()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/portfolio/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setProject(data)
        }
      } catch {
        // Handle error
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    )
  }

  return <PortfolioForm project={project} />
}
