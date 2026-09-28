'use client'

import { useState } from 'react'
import Link from 'next/link'
import { registerInvestor } from './actions'
import BrandLogo from '@/components/BrandLogo'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMsg('')
    setLoading(true)

    const formData = new FormData()
    formData.append('name', name)
    formData.append('email', email)
    formData.append('password', password)

    const result = await registerInvestor(formData)

    setLoading(false)

    if (result.error) {
      setMsg(result.error)
      return
    }

    setMsg(result.success || 'Registro creado correctamente.')
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <main className="auth"><div style={{width:"min(470px,100%)"}}><div style={{display:"flex",justifyContent:"center",marginBottom:24}}><Link href="/"><BrandLogo/></Link></div><form className="form" onSubmit={submit}>
        <h1>Solicitar acceso</h1>

        <label>Nombre completo</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <label>Contraseña</label>
        <input
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        {msg && <p>{msg}</p>}

        <button
          type="submit"
          className="btn primary"
          disabled={loading}
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p className="muted">
          ¿Ya tienes cuenta? <Link href="/login">Iniciar sesión</Link>
        </p>
      </form><p className="muted" style={{textAlign:'center',fontSize:13,marginTop:16}}>BanQuisqueya &amp; Trust · Fondo de Inversión Privado · <a href="mailto:info@banquisqueya.com">info@banquisqueya.com</a></p></div></main>
  )
}
