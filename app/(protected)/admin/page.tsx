import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isStaffRole, ROLE_LABELS } from '@/lib/auth/roles'

const stages=[['submitted','Recibidas'],['pre_screening','Pre-screening'],['due_diligence','Due Diligence'],['underwriting','Underwriting'],['investment_committee','Comité'],['contracting','Contratación'],['funded','Financiadas']] as const

const money=(n:number)=>n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})
const date=(v:string)=>new Date(v).toLocaleDateString('es-DO',{day:'2-digit',month:'short',year:'numeric'})

export default async function Admin(){
 const s=await createClient()
 const {data:c}=await s.auth.getClaims()
 const uid=c?.claims?.sub as string|undefined
 const {data:p}=await s.from('profiles').select('role,full_name').eq('id',uid||'').maybeSingle()
 if(!isStaffRole(p?.role))return null

 const [{count:investors},{count:projects},{count:kyc},{count:applications},{count:dd},{count:funded},{data:recent},{data:portfolio},{data:capital}]=await Promise.all([
  s.from('investors').select('*',{count:'exact',head:true}),
  s.from('projects').select('*',{count:'exact',head:true}),
  s.from('investors').select('*',{count:'exact',head:true}).eq('kyc_status','in_review'),
  s.from('funding_applications').select('*',{count:'exact',head:true}).not('status','in','(funded,rejected,withdrawn)'),
  s.from('funding_applications').select('*',{count:'exact',head:true}).eq('status','due_diligence'),
  s.from('funding_applications').select('*',{count:'exact',head:true}).eq('status','funded'),
  s.from('funding_applications').select('id,application_number,project_name,requested_amount,currency,status,created_at').order('created_at',{ascending:false}).limit(8),
  s.from('projects').select('id,name,sector,location,status,target_amount').in('id',['11111111-1111-4111-8111-111111111111','22222222-2222-4222-8222-222222222222','33333333-3333-4333-8333-333333333333']).order('name'),
  s.from('capital_sources').select('id,name,source_type,jurisdiction,status').order('created_at',{ascending:false})
 ])
 const stageCounts=await Promise.all(stages.map(([status])=>s.from('funding_applications').select('*',{count:'exact',head:true}).eq('status',status)))
 const pipeline=stages.map(([status,label],i)=>({status,label,count:stageCounts[i].count||0}))
 const requested=(recent??[]).reduce((sum:any,x:any)=>sum+Number(x.requested_amount||0),0)
 const maxStage=Math.max(...pipeline.map(x=>x.count),1)
 const role=ROLE_LABELS[p.role]
 const portfolioIds=(portfolio??[]).map((x:any)=>x.id)
 const {data:progressRows}=portfolioIds.length?await s.from('project_execution_workstreams').select('project_id,progress_pct').in('project_id',portfolioIds):{data:[]}
 const progressByProject:Record<string,number>={}
 for(const x of progressRows??[]){if(!progressByProject[x.project_id])progressByProject[x.project_id]=0;progressByProject[x.project_id]+=Number(x.progress_pct||0)}
 const progressCount:Record<string,number>={}
 for(const x of progressRows??[]){progressCount[x.project_id]=(progressCount[x.project_id]||0)+1}
 const demoProjects=(portfolio??[]).map((x:any)=>({...x,progress:progressCount[x.id]?Math.round(progressByProject[x.id]/progressCount[x.id]):0}))

 return <div className="dashboard admin-dashboard institutional-v3">
  <div className="container dashboard-wide">
   <section className="institutional-command-header">
    <div>
     <span className="eyebrow">BANQUISQUEYA & TRUST · INSTITUTIONAL OPERATIONS</span>
     <h1>Capital & Project Control Room</h1>
     <p>Gobierno de operaciones, capital relationships, project development y ejecución.</p>
    </div>
    <div className="command-meta"><span>ACCESS LEVEL</span><strong>{role}</strong><small>Live operational environment</small></div>
   </section>

   <section className="institutional-kpi-strip">
    <div><span>CAPITAL REQUESTED</span><strong>{money(requested)}</strong><small>Latest active mandates</small></div>
    <div><span>ACTIVE PROJECTS</span><strong>{projects||0}</strong><small>Projects in platform</small></div>
    <div><span>ACTIVE PIPELINE</span><strong>{applications||0}</strong><small>Under evaluation</small></div>
    <div><span>CONTROL SIGNALS</span><strong>{(kyc||0)+(dd||0)}</strong><small>KYC + due diligence</small></div>
   </section>

   <div className="institutional-grid-main">
    <section className="institutional-panel pipeline-panel">
     <div className="institutional-panel-head"><div><span className="panel-kicker">01 · TRANSACTION PIPELINE</span><h2>Mandates by decision stage</h2><p>Current distribution of project opportunities through the institutional workflow.</p></div><Link href="/admin/applications" className="institutional-link">Open pipeline ↗</Link></div>
     <div className="institutional-pipeline">{pipeline.map(x=><div className="institutional-pipeline-row" key={x.status}><div><span>{x.label}</span><strong>{x.count.toString().padStart(2,'0')}</strong></div><div className="institutional-bar"><i style={{width:(x.count/maxStage)*100+'%'}}/></div></div>)}</div>
    </section>

    <section className="institutional-panel signal-panel">
     <div className="institutional-panel-head"><div><span className="panel-kicker">02 · CONTROL SIGNALS</span><h2>Attention required</h2><p>Items currently demanding review or follow-up.</p></div></div>
     <div className="signal-list">
      <Link href="/admin/investors" className="signal-item"><span className="signal-dot gold"/><div><strong>KYC review queue</strong><small>{kyc||0} expediente(s) awaiting review</small></div><b>→</b></Link>
      <Link href="/admin/applications" className="signal-item"><span className="signal-dot blue"/><div><strong>Due diligence</strong><small>{dd||0} mandate(s) in active DD</small></div><b>→</b></Link>
      <Link href="/admin/projects" className="signal-item"><span className="signal-dot red"/><div><strong>Execution controls</strong><small>Review blocked milestones and conditions</small></div><b>→</b></Link>
     </div>
    </section>
   </div>

   <section className="institutional-panel projects-panel">
    <div className="institutional-panel-head"><div><span className="panel-kicker">03 · PROJECT PORTFOLIO</span><h2>Selected active mandates</h2><p>Operational view of the current development portfolio.</p></div><Link href="/admin/projects" className="institutional-link">All projects ↗</Link></div>
    <div className="institutional-project-grid">{demoProjects.map((x:any)=><Link href={'/admin/projects/'+x.id} className="institutional-project-card" key={x.id}>
      <div className="project-card-top"><span>{x.sector||'Strategic Development'}</span><em>{x.status}</em></div>
      <h3>{x.name.replace(' — DEMO','')}</h3><p>{x.location||'Latin America & Caribbean'}</p>
      <div className="project-progress"><div><span>Execution readiness</span><strong>{x.progress}%</strong></div><div className="institutional-bar"><i style={{width:x.progress+'%'}}/></div></div>
      <div className="project-card-foot"><span>Project value</span><strong>{x.target_amount?money(Number(x.target_amount)):'Structured mandate'}</strong></div>
    </Link>)}</div>
   </section>

   <div className="institutional-grid-main lower">
    <section className="institutional-panel">
     <div className="institutional-panel-head"><div><span className="panel-kicker">04 · TRANSACTION REGISTER</span><h2>Recent mandates</h2></div><Link href="/admin/applications" className="institutional-link">View all ↗</Link></div>
     <div className="institutional-table-wrap"><table className="institutional-table"><thead><tr><th>Reference</th><th>Project</th><th>Amount</th><th>Stage</th><th>Date</th></tr></thead><tbody>{(recent??[]).map((x:any)=><tr key={x.id}><td><strong>{x.application_number}</strong></td><td>{x.project_name.replace(' — DEMO','')}</td><td>{x.requested_amount?money(Number(x.requested_amount)):'—'}</td><td><span className="institutional-status">{x.status.replaceAll('_',' ')}</span></td><td>{date(x.created_at)}</td></tr>)}</tbody></table></div>
    </section>
    <section className="institutional-panel">
     <div className="institutional-panel-head"><div><span className="panel-kicker">05 · CAPITAL DESK</span><h2>Relationship map</h2><p>Capital sources currently registered.</p></div><Link href="/admin/capital-sources" className="institutional-link">Capital Desk ↗</Link></div>
     <div className="capital-list">{(capital??[]).slice(0,6).map((x:any)=><div className="capital-row" key={x.id}><div><strong>{x.name}</strong><small>{x.source_type.replaceAll('_',' ')} · {x.jurisdiction||'International'}</small></div><span>{x.status}</span></div>)}</div>
    </section>
   </div>

   <section className="institutional-action-rail">
    <div><span className="panel-kicker">CONTROLLED ACCESS</span><strong>Move from dashboard to the transaction record.</strong><small>Every project should have a visible path from origination to close and execution.</small></div>
    <div className="institutional-action-links"><Link href="/admin/applications">Applications</Link><Link href="/admin/capital-desk">Capital Desk</Link><Link href="/admin/control-center">Risk & Compliance</Link><Link href="/admin/board-report">Board Reporting</Link></div>
   </section>
  </div>
 </div>
}
