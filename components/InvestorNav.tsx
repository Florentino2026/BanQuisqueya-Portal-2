import Link from 'next/link'

const items=[
  ['Dashboard','/investor'],
  ['Portfolio','/investor/investments'],
  ['Oportunidades','/investor/projects'],
  ['Movimientos','/investor/transactions'],
  ['Documentos','/investor/documents'],
  ['KYC / Compliance','/investor/profile'],
  ['Solicitudes','/investor/applications'],
]

export default function InvestorNav({active}:{active:string}){
  return <nav className="investor-module-nav" aria-label="Investor portal navigation">
    {items.map(([label,href])=><Link key={href} href={href} className={active===label?'active':''}>{label}</Link>)}
  </nav>
}
