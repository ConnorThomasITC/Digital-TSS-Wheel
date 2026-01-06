import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import '@/styles/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'TSS Wheel - Technical Support Services',
  description: 'Interactive service wheel showcasing our comprehensive IT services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  )
}
