import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, FileText, Pencil, Eye } from "lucide-react"
import { DeletePostButton } from "@/components/admin/delete-post-button"

export default async function AdminPostsPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight lg:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            All Posts
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your blog posts.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">
            <PlusCircle className="size-4" />
            New Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {posts?.length ?? 0} posts total
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!posts || posts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <FileText className="size-12 text-muted-foreground/30" />
              <p className="text-muted-foreground">No posts found.</p>
              <Button asChild size="sm">
                <Link href="/admin/posts/new">Create your first post</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="truncate text-sm font-semibold">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {post.date}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          post.published
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.published && (
                      <Button asChild variant="ghost" size="icon" className="size-8">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Eye className="size-3.5" />
                          <span className="sr-only">View post</span>
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="ghost" size="icon" className="size-8">
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Pencil className="size-3.5" />
                        <span className="sr-only">Edit post</span>
                      </Link>
                    </Button>
                    <DeletePostButton postId={post.id} postTitle={post.title} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
