import './globals.css'
import type { Metadata } from 'next'
export const metadata: Metadata={title:'BanQuisqueya & Trust',description:'Fondo de Inversión Privado y plataforma para inversionistas.'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
