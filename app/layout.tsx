
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ReduxProvider from '@/store/provider'
import { ToastProvider } from '@/context/ToastContext'
import ConditionalLayout from './conditional-layout'

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
                        <ConditionalLayout>
                            {children}
                        </ConditionalLayout>
                    </ToastProvider>
                </ReduxProvider>
            </body>
        </html>
    )
}
