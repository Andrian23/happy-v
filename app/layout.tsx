import React from "react"
import type { Metadata } from "next"
import { Hanken_Grotesk } from "next/font/google"
import { SessionProvider } from "next-auth/react"

import { Toaster } from "@/components/ui/Toaster"

import "./globals.css"

const hankenGrotesk = Hanken_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Happy V",
  description: "Generated by create next app",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={hankenGrotesk.className}>
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  )
}
