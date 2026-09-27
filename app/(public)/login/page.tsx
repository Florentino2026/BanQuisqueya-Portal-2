import Link from 'next/link'
import { loginInvestor } from './actions'

export default function Login() {
  return (
    <main className="auth">
      <form className="form" action={loginInvestor}>
        <h1>Iniciar sesión</h1>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" required />
        <button type="submit" className="btn primary">Iniciar sesión</button>
        <p className="muted">¿No tienes cuenta? <Link href="/register">Solicitar acceso</Link></p>
      </form>
    </main>
  )
}
