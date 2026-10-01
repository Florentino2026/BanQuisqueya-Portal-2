import './globals.css'
import type { Metadata } from 'next'
import { getServerLocale } from '@/lib/i18n'
export const metadata: Metadata={title:'BanQuisqueya & Trust',description:'Fondo de Inversión Privado y plataforma para inversionistas.'}
export default async function RootLayout({children}:{children:React.ReactNode}){const locale=await getServerLocale(); return <html lang={locale}><body>{children}</body></html>}
