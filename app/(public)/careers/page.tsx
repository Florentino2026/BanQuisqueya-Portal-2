import BrandLogo from '@/components/BrandLogo'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CareerForm from './CareerForm'

export default async function CareersPage(){
 const supabase=await createClient()
 const {data:vacancies}=await supabase.from('job_vacancies').select('id,title,department,location,employment_type,description,requirements,closing_date').eq('status','open').order('published_at',{ascending:false})
 return <>
  <header className="nav"><div className="container" style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',gap:20}}>
   <Link href="/"><BrandLogo/></Link>
   <nav style={{display:'flex',gap:10,alignItems:'center'}}><Link className="muted" href="/#areas">Sectores</Link><Link className="muted" href="/#soluciones">Soluciones</Link><Link className="muted" href="/#contacto">Contacto</Link><Link className="btn secondary" href="/login">Acceso institucional</Link></nav>
  </div></header>
  <main>
   <section className="hero hero-premium"><div className="container hero-image-content">
    <span className="hero-kicker">Carreras · BanQuisqueya & Trust</span>
    <h1>Construye tu carrera con nosotros.</h1>
    <p>Buscamos profesionales para participar en la estructuración, desarrollo, gestión y ejecución de proyectos estratégicos en América Latina y el Caribe.</p>
    <div className="hero-actions"><a className="btn primary" href="#postular">Enviar CV</a><Link className="btn ghost-light" href="/">Volver al inicio</Link></div>
   </div></section>
   <section className="section"><div className="container">
    <div className="section-title"><span className="pill">Vacantes disponibles</span><h2>Oportunidades profesionales</h2><p className="muted">Las posiciones publicadas en esta sección representan vacantes actualmente abiertas. Si no encuentras una posición adecuada, puedes enviar tu CV para futuras oportunidades.</p></div>
    <div className="grid">{vacancies?.map(v=><article className="card" key={v.id}><div className="pill">{v.department}</div><h3>{v.title}</h3><p className="muted">{v.location||'América Latina y el Caribe'} · {v.employment_type||'Posición profesional'}</p>{v.description&&<p>{v.description}</p>}{v.requirements&&<><strong>Perfil requerido</strong><p className="muted">{v.requirements}</p></>}{v.closing_date&&<small className="muted">Cierre: {new Date(v.closing_date+'T12:00:00').toLocaleDateString('es-DO')}</small>}</article>)}</div>
    {!vacancies?.length&&<div className="institutional"><h3>No hay vacantes publicadas en este momento.</h3><p className="muted">Puedes enviarnos tu CV indicando el área en la que deseas trabajar. Lo incorporaremos a nuestro proceso de selección para futuras oportunidades, sujeto a nuestro proceso de evaluación.</p></div>}
   </div></section>
   <section className="section" id="postular"><div className="container"><div className="section-title"><span className="pill">Trabaja con nosotros</span><h2>Envía tu curriculum vitae</h2><p className="muted">Selecciona el área profesional en la que deseas desarrollarte y adjunta tu CV en PDF o Word.</p></div><CareerForm vacancies={vacancies||[]}/></div></section>
  </main>
  <footer className="footer"><div className="container footer-grid"><div><BrandLogo compact/><p className="muted" style={{maxWidth:420,marginTop:16}}>BanQuisqueya & Trust · Capital, estructuración, desarrollo y alianzas estratégicas.</p></div><div><strong>Portal</strong><p><Link href="/login">Acceso institucional</Link></p><p><Link href="/">Inicio</Link></p></div><div><strong>Contacto</strong><p><a href="mailto:info@banquisqueya.com">info@banquisqueya.com</a></p></div></div></footer>
 </>
}
