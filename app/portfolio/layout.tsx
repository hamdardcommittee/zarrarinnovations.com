import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "View our portfolio of web, mobile, design, and management system projects.",
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
