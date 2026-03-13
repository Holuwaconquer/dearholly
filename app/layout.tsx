import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import './globals.css'

const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-manrope',
})

export const metadata: Metadata = {
  title: 'DearHolly | Luxury Fashion',
  description: 'Redefining luxury through the lens of modern street culture.',
  icons: {
    icon: [
      { url: '../../public/favicon.ico' },
      { url: '../../public/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '../../public/favicon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '../../public/favicon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '../../public/apple-icon.png' },
      { url: '../../public/apple-icon-152x152.png', sizes: '152x152' },
    ],
    shortcut: { url: '/favicon.ico' },
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.variable} font-display bg-background-light  text-slate-900 antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}