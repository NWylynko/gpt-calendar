import './globals.css'
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'gpt-calendar',
  description: 'let ai build your calendar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
