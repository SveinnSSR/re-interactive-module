// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ChatBubble from '@/components/chat/ChatBubble'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Reykjavik Excursions',
  description: 'Book your Iceland tours and activities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <ChatBubble />
        <Footer />
      </body>
    </html>
  )
}
