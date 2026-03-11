import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { LayoutShell } from '@/components/layout-shell'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export const metadata: Metadata = {
  title: {
    default: 'Zarrar Innovations | Web Development, UI/UX Design & Software Solutions',
    template: '%s | Zarrar Innovations',
  },
  description:
    'Zarrar Innovations is a leading software company specializing in web development, mobile apps, UI/UX design, Shopify stores, WordPress, e-commerce solutions, POS systems, school management, and custom ERP systems. Serving clients in Oman, Pakistan, and worldwide.',
  keywords: [
    'web development',
    'mobile app development',
    'UI/UX design',
    'Shopify development',
    'WordPress development',
    'e-commerce solutions',
    'POS systems',
    'school management software',
    'custom ERP',
    'software company Oman',
    'software company Pakistan',
    'React development',
    'Next.js development',
    'Flutter apps',
    'Zarrar Innovations',
  ],
  authors: [{ name: 'Zarrar Innovations', url: 'https://zarrarinnovations.com' }],
  creator: 'Zarrar Innovations',
  publisher: 'Zarrar Innovations',
  openGraph: {
    title: 'Zarrar Innovations | Web Development, UI/UX Design & Software Solutions',
    description:
      'Leading software company delivering scalable web, mobile, and design solutions. Specializing in e-commerce, POS, school management, and custom ERP systems. Serving clients in Oman, Pakistan, and globally.',
    siteName: 'Zarrar Innovations',
    type: 'website',
    locale: 'en_US',
    url: 'https://zarrarinnovations.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zarrar Innovations | Software Solutions',
    description:
      'Leading software company delivering scalable web, mobile, and design solutions globally.',
    creator: '@zarrarinnovations',
  },
  icons: {
    icon: 'https://res.cloudinary.com/dey8xaf7r/image/upload/v1771421025/android-chrome-192x192_jc7jht.png',
    apple:
      'https://res.cloudinary.com/dey8xaf7r/image/upload/v1771421025/apple-touch-icon_hpckvg.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://zarrarinnovations.com',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <LayoutShell>{children}</LayoutShell>
        <Analytics />
      </body>
    </html>
  )
}
