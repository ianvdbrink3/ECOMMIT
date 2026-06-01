import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TVB Allocator — Truin vdBrink Test Budget Allocator',
  description:
    'Professional ad spend management tool for e-commerce brands. Calculate economics, allocate test budgets, analyze creatives, and scale winners.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      >
        <body className="min-h-full bg-[#0a0a0a] text-[#f5f5f5]">
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
