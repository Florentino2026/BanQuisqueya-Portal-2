'use client'
import {useState} from 'react'
import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'
import {registerReferrer} from './actions'

export default function ReferrerRegistration(){
 const [msg,setMsg]=useState('');const [loading,setLoading]=useState(false)
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setMsg('');const r=await registerReferrer(new FormData(e.currentTarget));setLoading(false);setMsg(r.error||r.success||'')}
 return <main className="auth"><div style={{width:'min(620px,100%)'}}><div style={{display:'flex',justifyContent:'center',marginBottom:24}}><Link href="/"><BrandLogo/></Link></div><form className="form" onSubmit={submit}><div className="eyebrow">BANQUISQUEYA & TRUST · REFERRER NETWORK</div><h1>Registro de Referidor / Finder</h1><p className="muted">Regístrate para solicitar aprobación y, una vez aprobado, presentar oportunidades de proyectos.</p><label>Nombre completo / contacto<input name="full_name" required disabled={loading}/></label><label>Email<input name="email" type="email" required disabled={loading}/></label><label>Teléfono<input name="phone" required disabled={loading}/></label><label>País<input name="country" required disabled={loading}/></label><label>Contraseña<input name="password" type="password" minLength={8} required disabled={loading}/></label>{msg&&<p>{msg}</p>}<button className="btn primary" disabled={loading}>{loading?'Registrando...':'Solicitar registro'}</button><p className="muted">¿Ya tienes cuenta? <Link href="/login">Iniciar sesión</Link></p></form><p className="muted" style={{textAlign:'center',fontSize:12,marginTop:16}}>La aprobación del referidor y cualquier esquema de compensación están sujetos a revisión de compliance, contrato aplicable y legislación de la jurisdicción correspondiente.</p></div></main>
}