import Link from 'next/link'
import {redirect} from 'next/navigation'
import {createClient} from '@/lib/supabase/server'
import InvestorNav from '@/components/InvestorNav'

const date=(v:string|null)=>v?new Date(v).toLocaleDateString('es-DO',{year:'numeric',month:'short',day:'2-digit'}):'—'
const labels:Record<string,string>={identity:'Identidad',corporate:'Corporativo',tax:'Fiscal',banking:'Bancario',kyc:'KYC',contract:'Contrato',other:'Otro'}

export default async function InvestorDocuments(){
  const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
  const {data:inv}=await s.from('investors').select('id,kyc_status').eq('user_id',user.id).maybeSingle()
  const {data:docs}=inv?.id?await s.from('documents').select('id,document_type,file_name,status,uploaded_at').eq('investor_id',inv.id).order('uploaded_at',{ascending:false})):{data:[] as any[]}
  return <div className="investor-portal"><header className="portal-topbar"><Link href="/investor" className="investor-topbar-brand"><span className="brand-logo"><img className="brand-mark" src="/banquisqueya-original-mark.webp" alt="BanQuisqueya & Trust"/><span className="brand-wordmark"><strong>BANQUISQUEYA</strong><span className="brand-subline"><i/> &amp; TRUST</span></span></span></Link><div className="topbar-right"><Link className="btn secondary" href="/investor/profile">Mi perfil</Link></div></header>
  <main className="dashboard"><div className="container dashboard-wide"><InvestorNav active="Documentos"/>
    <section className="dashboard-heading"><div><span className="eyebrow">DOCUMENT MANAGEMENT</span><h1>Documentos</h1><p className="muted">Expediente documental asociado a tu relación con BanQuisqueya &amp; Trust.</p></div></section>
    <section className="notice-panel"><div><strong>Estado KYC: {inv?.kyc_status||'Pendiente'}</strong><p>Los documentos son parte del expediente de cumplimiento. En esta etapa demo la consulta está habilitada; la descarga y carga documental se integrarán al Data Room seguro.</p></div><Link href="/investor/profile" className="btn primary">Revisar KYC</Link></section>
    <section className="panel"><div className="panel-heading"><div><span className="eyebrow">DOCUMENT REGISTER</span><h2>Registro documental</h2></div></div>{!docs?.length?<div className="empty-state">No hay documentos registrados en tu expediente.</div>:<div className="table-wrap"><table className="table professional-table"><thead><tr><th>Documento</th><th>Tipo</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>{docs.map(x=><tr key={x.id}><td><strong>{x.file_name}</strong></td><td>{labels[x.document_type]||x.document_type||'—'}</td><td><span className="status-chip">{x.status}</span></td><td>{date(x.uploaded_at)}</td></tr>)}</tbody></table></div>}</section>
  </div></main></div>
}
