
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ReduxProvider from '@/store/provider'
import { ToastProvider } from '@/context/ToastContext'
import ConditionalLayout from './conditional-layout'
import WhatsAppButton from '@/components/whatsapp-button/WhatsAppButton'
import ScrollToTop from '@/components/scroll-to-top/ScrollToTop'
import { GoogleOAuthProvider } from '@react-oauth/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Esdaly',
    description: 'Esdaly Store',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ar" dir="rtl">
            <body className={inter.className}>
                <ReduxProvider>
                    <ToastProvider>
                        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy"}>
                            <ConditionalLayout>
                                {children}
                                <WhatsAppButton />
                                <ScrollToTop />
                            </ConditionalLayout>
                        </GoogleOAuthProvider>
                    </ToastProvider>
                </ReduxProvider>
            </body>
        </html>
    )
}
