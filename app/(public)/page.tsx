import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'
import { createClient } from '@/lib/supabase/server'

export default async function Home(){
 const supabase=await createClient()
 const {data}=await supabase.from('projects').select('name,sector,location,description,minimum_investment,projected_return').eq('status','open').limit(6)
 return <>
  <header className="nav"><div className="container" style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',gap:20}}>
   <Link href="/"><BrandLogo/></Link>
   <nav style={{display:'flex',gap:10,alignItems:'center'}}><a className="muted" href="#oportunidades">Oportunidades</a><a className="muted" href="#soluciones">Soluciones</a><a className="muted" href="#contacto">Contacto</a><Link className="btn secondary" href="/login">Acceso Inversionistas</Link></nav>
  </div></header>
  <main>
   <section className="hero"><div className="container">
    <div className="hero-brand"><span className="hero-kicker">Fondo de Inversión Privado</span></div>
    <h1>Capital privado para proyectos con visión de largo plazo.</h1>
    <p>BanQuisqueya &amp; Trust estructura, gestiona y acompaña oportunidades de inversión privada en América Latina y el Caribe, conectando capital con proyectos que requieren una gestión profesional, disciplina financiera y control de riesgos.</p>
    <div className="hero-actions"><Link className="btn primary" href="/register">Solicitar acceso</Link><a className="btn secondary" href="mailto:info@banquisqueya.com?subject=Presentar%20un%20proyecto">Presentar un Proyecto</a></div>
   </div></section>
   <section className="section" id="soluciones"><div className="container"><div className="section-title"><span className="pill">Plataforma institucional</span><h2>Gestión integral de capital y proyectos</h2><p className="muted">Un ecosistema para inversionistas, desarrolladores, suplidores y equipos corporativos, desde la evaluación inicial hasta la ejecución y seguimiento.</p></div><div className="grid">
    {['Inversión privada','Estructuración financiera','Due Diligence','Gestión de proyectos','Procurement y contratos','Supervisión y desembolsos'].map((x,i)=><div className="card" key={x}><div className="pill">0{i+1}</div><h3>{x}</h3><p className="muted">{['Acceso organizado a oportunidades seleccionadas y procesos de inversión.','Estructuración y gestión de capital de acuerdo con las necesidades del proyecto.','Evaluación documental, financiera, legal, técnica y de riesgos.','Control de presupuesto, contratos, avances, cubicaciones y cumplimiento.','Gestión de cotizaciones, suplidores, órdenes de compra y contratos.','Validación de avances y flujo de aprobación antes de cada desembolso.'][i]}</p></div>)}
   </div></div></section>
   <section className="section" id="oportunidades" style={{paddingTop:20}}><div className="container"><div className="section-title"><span className="pill">Oportunidades</span><h2>Proyectos seleccionados</h2><p className="muted">Las oportunidades publicadas en el portal estarán sujetas a los procesos de análisis, due diligence y aprobación correspondientes.</p></div><div className="grid">{data?.map(p=><div className="card" key={p.name}><h3>{p.name}</h3><p className="muted">{p.sector} · {p.location}</p><p>{p.description}</p><strong>Retorno proyectado: {p.projected_return}%</strong></div>)}</div>{!data?.length&&<div className="institutional"><p className="muted">Actualmente no hay oportunidades públicas disponibles. Puede contactarnos para conocer el proceso de presentación y evaluación de proyectos.</p></div>}</div></section>
   <section className="section" id="contacto"><div className="container"><div className="institutional contact-card"><div><span className="pill">Contacto institucional</span><h2>Hable con BanQuisqueya &amp; Trust</h2><p className="muted">Para información sobre inversiones, estructuración de proyectos o presentación de oportunidades.</p></div><a className="btn primary" href="mailto:info@banquisqueya.com">info@banquisqueya.com</a></div></div></section>
  </main>
  <footer className="footer"><div className="container footer-grid"><div><BrandLogo compact/><p className="muted" style={{maxWidth:420,marginTop:16}}>BanQuisqueya &amp; Trust · Fondo de Inversión Privado.</p></div><div><strong>Portal</strong><p><Link href="/login">Acceso Inversionistas</Link></p><p><Link href="/register">Solicitar acceso</Link></p></div><div><strong>Contacto</strong><p><a href="mailto:info@banquisqueya.com">info@banquisqueya.com</a></p><p className="muted">América Latina y el Caribe</p></div></div><div className="container" style={{borderTop:'1px solid #ffffff18',marginTop:30,paddingTop:18}}><small className="muted">© {new Date().getFullYear()} BanQuisqueya &amp; Trust. Fondo de Inversión Privado.</small></div></footer>
 </> 
}