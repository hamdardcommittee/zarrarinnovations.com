import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides, tips, comparisons, and industry trends from Zarrar Innovations.",
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
