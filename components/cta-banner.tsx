import { Button } from "@/components/ui/button"
import { MessageCircle, Mail } from "lucide-react"

interface CTABannerProps {
  title?: string
  description?: string
}

export function CTABanner({
  title = "Let's build something amazing",
  description = "Ready to bring your vision to life? Get in touch with our team today.",
}: CTABannerProps) {
  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: "#31028f" }}>
      <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
        <h2
          className="text-balance text-3xl font-bold tracking-tight text-white lg:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-lg leading-relaxed text-white/80">
          {description}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-white text-[#31028f] hover:bg-white/90"
          >
            <a
              href="https://wa.me/923000000000"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" />
              WhatsApp Us
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <a href="mailto:info@zarrarinnovations.com">
              <Mail className="size-4" />
              Email Us
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
