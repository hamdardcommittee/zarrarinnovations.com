import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PostForm } from "@/components/admin/post-form"

export const metadata = {
  title: "Edit Post",
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !post) {
    notFound()
  }

  return <PostForm post={post} />
}
