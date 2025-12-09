import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'InfiniteFlow AI - Video Frame Interpolation',
  description: 'Optimize your videos with AI-generated interpolated frames',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white">{children}</body>
    </html>
  )
}
