'use client'

import { useState } from 'react'
import Link from 'next/link'
import { loginInvestor } from './actions'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMsg('')
    setLoading(true)

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    try {
      const result = await loginInvestor(formData)

      if (result?.error) {
        setMsg(result.error)
      }
    } catch {
      setMsg('No fue posible iniciar sesión. Intenta nuevamente.')
    }

    setLoading(false)
  }

  return (
    <main className="auth">
      <form className="form" onSubmit={submit}>
        <h1>Iniciar sesión</h1>

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
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>

        <p className="muted">
          ¿No tienes cuenta?{' '}
          <Link href="/register">Solicitar acceso</Link>
        </p>
      </form>
    </main>
  )
}
