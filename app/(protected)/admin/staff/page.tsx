import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { STAFF_ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS } from '@/lib/auth/roles'
import { updateStaffRole } from './actions'

export default async function AdminStaff({ searchParams }: { searchParams: Promise<{ success?: string; error?: string }> }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub as string | undefined
  if (!userId) redirect('/login')

  const { data: admin } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle()
  if (admin?.role !== 'admin') redirect('/investor')

  const { data: staff } = await supabase.from('profiles')
    .select('id,full_name,role,created_at,updated_at')
    .order('created_at', { ascending: true })

  return (
    <div className="dashboard">
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,marginBottom:24}}>
          <div>
            <div className="muted">BanQuisqueya & Trust</div>
            <h1 style={{marginBottom:6}}>Staff administrativo</h1>
            <p className="muted">Asigna funciones y limita el acceso según responsabilidad.</p>
          </div>
          <Link href="/admin" className="button secondary">Panel de administración</Link>
        </div>

        {params.success && <div className="card" style={{marginBottom:16}}>Rol actualizado correctamente.</div>}
        {params.error && <div className="card" style={{marginBottom:16}}>Error: {params.error}</div>}

        <section className="card" style={{marginBottom:20}}>
          <h2>Roles disponibles</h2>
          <div className="grid">
            {STAFF_ROLES.map(role => (
              <div key={role} style={{borderTop:'1px solid #e5e7eb',paddingTop:12}}>
                <strong>{ROLE_LABELS[role]}</strong>
                <p className="muted">{ROLE_DESCRIPTIONS[role]}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{overflowX:'auto'}}>
          <h2>Usuarios y funciones</h2>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr><th style={{textAlign:'left',padding:12}}>Usuario</th><th style={{textAlign:'left',padding:12}}>Rol actual</th><th style={{textAlign:'left',padding:12}}>Cambiar rol</th></tr></thead>
            <tbody>
              {(staff || []).map(person => (
                <tr key={person.id} style={{borderTop:'1px solid #e5e7eb'}}>
                  <td style={{padding:12}}><strong>{person.full_name || 'Sin nombre'}</strong><div className="muted" style={{fontSize:12}}>{person.id}</div></td>
                  <td style={{padding:12}}>{ROLE_LABELS[person.role as keyof typeof ROLE_LABELS] || (person.role === 'member' ? 'Inversionista / Usuario' : person.role)}</td>
                  <td style={{padding:12}}>
                    <form action={updateStaffRole} style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                      <input type="hidden" name="user_id" value={person.id} />
                      <select name="role" defaultValue={person.role}>
                        <option value="member">Inversionista / Usuario</option>
                        {STAFF_ROLES.map(role => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}
                      </select>
                      <button className="button" type="submit">Guardar rol</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
