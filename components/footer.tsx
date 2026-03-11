import Link from "next/link"
import { Mail, Phone, MessageCircle, Facebook, Instagram, Linkedin, Github } from "lucide-react"

const footerLinks = {
  Services: [
    { label: "Web Development", href: "/development/web-development" },
    { label: "UI/UX Design", href: "/design/ui-ux" },
    { label: "Mobile Apps", href: "/development/mobile-app" },
    { label: "Management Systems", href: "/managements" },
    { label: "Shopify / WordPress", href: "/development/web-development" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Mission", href: "/about/mission" },
    { label: "Team", href: "/about/team" },
    { label: "Careers", href: "/careers" },
    { label: "Portfolio", href: "/portfolio" },
  ],
  Resources: [
    { label: "All Services", href: "/services" },
    { label: "Products", href: "/products" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="https://res.cloudinary.com/dey8xaf7r/image/upload/v1771421025/android-chrome-192x192_jc7jht.png"
                alt="Zarrar Innovations logo"
                className="size-8"
              />
              <span
                className="text-lg font-bold tracking-tight text-background"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Zarrar Innovations
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-background/70">
              Remote-first software company delivering scalable web, mobile, and
              design solutions to clients worldwide. Your Vision, Our
              Innovations.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="https://wa.me/96877627362"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-background"
              >
                <MessageCircle className="size-4" />
                WhatsApp (Oman)
              </a>
              <a
                href="https://wa.me/923058880172"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-background"
              >
                <MessageCircle className="size-4" />
                WhatsApp (Pakistan)
              </a>
              <a
                href="mailto:zarrarinnovations@gmail.com"
                className="flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-background"
              >
                <Mail className="size-4" />
                zarrarinnovations@gmail.com
              </a>
              <a
                href="tel:+96877627362"
                className="flex items-center gap-2 text-sm text-background/70 transition-colors hover:text-background"
              >
                <Phone className="size-4" />
                +968 7762 7362
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://www.facebook.com/zarrarinnovations"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full bg-background/10 text-background/70 transition-colors hover:bg-background/20 hover:text-background"
                aria-label="Facebook"
              >
                <Facebook className="size-5" />
              </a>
              <a
                href="https://www.instagram.com/zarrarinnovations"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full bg-background/10 text-background/70 transition-colors hover:bg-background/20 hover:text-background"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/zarrarinnovations"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full bg-background/10 text-background/70 transition-colors hover:bg-background/20 hover:text-background"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-5" />
              </a>
              <a
                href="https://github.com/zarrarinnovations"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full bg-background/10 text-background/70 transition-colors hover:bg-background/20 hover:text-background"
                aria-label="GitHub"
              >
                <Github className="size-5" />
              </a>
              <a
                href="https://www.tiktok.com/@zarrarinnovations"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full bg-background/10 text-background/70 transition-colors hover:bg-background/20 hover:text-background"
                aria-label="TikTok"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/50">
                {heading}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/70 transition-colors hover:text-background"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/10 pt-8 md:flex-row">
          <p className="text-xs text-background/50">
            {new Date().getFullYear()} Zarrar Innovations. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/contact"
              className="text-xs text-background/50 transition-colors hover:text-background"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="text-xs text-background/50 transition-colors hover:text-background"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
