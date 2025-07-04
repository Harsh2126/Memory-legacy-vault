import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { RealtimeProvider } from "@/components/realtime-provider"
import { RBACProvider } from "@/components/rbac-provider"
import { DarkModeScript } from "@/components/dark-mode-script"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Legacy - Family Memory Vault",
  description: "Preserve your family's precious memories in a shared digital vault.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DarkModeScript />
          <AuthProvider>
            <RBACProvider>
              <RealtimeProvider>
                {children}
                <Toaster />
              </RealtimeProvider>
            </RBACProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
