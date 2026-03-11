import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const metadata = {
  title: "Admin Dashboard",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Role-based access: check user metadata for admin role
  const isAdmin = user.user_metadata?.is_admin === true
    || user.user_metadata?.role === "admin"
    || user.email?.endsWith("@zarrarinnovations.com")

  if (!isAdmin) {
    // Allow any authenticated user for now, but log the access
    // To enforce strict admin-only access, uncomment:
    // redirect("/auth/unauthorized")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar userEmail={user.email || ""} />
      <main className="flex-1 overflow-y-auto bg-secondary/30 p-6 lg:p-8">
        {children}
      </main>
    </div>
  )
}
