import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldX, ArrowLeft, LogOut } from "lucide-react"
import { logout } from "@/app/auth/actions"

export const metadata = {
  title: "Unauthorized Access",
}

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Card className="border-destructive/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <ShieldX className="size-7 text-destructive" />
            </div>
            <CardTitle
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Unauthorized Access
            </CardTitle>
            <CardDescription className="text-base">
              You do not have admin privileges to access this area. Please contact the site administrator if you believe this is an error.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href="/">
              <Button variant="outline" className="w-full" size="lg">
                <ArrowLeft className="size-4" />
                Back to Website
              </Button>
            </Link>
            <form>
              <Button
                formAction={logout}
                variant="ghost"
                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                size="lg"
              >
                <LogOut className="size-4" />
                Sign Out
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
