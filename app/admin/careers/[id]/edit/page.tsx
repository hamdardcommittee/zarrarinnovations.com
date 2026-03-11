"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { JobEditorForm } from "@/components/admin/job-editor-form"
import { Loader2 } from "lucide-react"

export default function EditJobPage() {
  const params = useParams()
  const id = params.id as string
  const [job, setJob] = useState<null | Record<string, unknown>>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${id}`)
        if (res.ok) {
          const data = await res.json()
          setJob(data)
        }
      } catch {
        // fail silently
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold">Job not found</p>
        <p className="text-sm text-muted-foreground">
          This job posting may have been deleted.
        </p>
      </div>
    )
  }

  return (
    <JobEditorForm
      initialData={{
        id: job.id as string,
        title: (job.title as string) || "",
        slug: (job.slug as string) || "",
        department: (job.department as string) || "Engineering",
        location: (job.location as string) || "Remote",
        type: (job.type as string) || "Full-time",
        experience_level: (job.experience_level as string) || "Mid-Level",
        salary_range: (job.salary_range as string) || "",
        description: (job.description as string) || "",
        requirements: (job.requirements as string[]) || [""],
        responsibilities: (job.responsibilities as string[]) || [""],
        benefits: (job.benefits as string[]) || [""],
        published: (job.published as boolean) || false,
      }}
    />
  )
}
