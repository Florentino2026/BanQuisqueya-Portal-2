import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'

const sectors=[
  ['01','ENERGY','Renewables · Generation · Natural resources'],
  ['02','INFRASTRUCTURE','Transport · Logistics · Utilities'],
  ['03','TOURISM','Hotels · Resorts · Marinas · Destinations'],
  ['04','REAL ASSETS','Housing · Mixed-use · Urban development'],
  ['05','HEALTH','Hospitals · Clinics · Health platforms'],
  ['06','AGROINDUSTRY','Production · Processing · Value chains'],
  ['07','INDUSTRIAL','Manufacturing · Industrial parks · Supply chain'],
  ['08','TECHNOLOGY','Digital infrastructure · Innovation · Platforms'],
]

const stages=[
  ['01','ORIGINATE','Opportunity, sponsor and strategic fit'],
  ['02','ASSESS','Commercial, financial, technical and legal review'],
  ['03','STRUCTURE','Capital stack, partnership and transaction architecture'],
  ['04','DECIDE','Investment committee and governance controls'],
  ['05','CLOSE','Conditions precedent, contracts and financial close'],
  ['06','EXECUTE','Budget, procurement, reporting and controlled deployment'],
]

const capabilities=[
  ['CAPITAL DESK','Relationships with banks, institutional sources, strategic partners and private capital.'],
  ['PROJECT DEVELOPMENT','Structuring and development support from feasibility through execution.'],
  ['JOINT VENTURES','Partnership structures combining sponsor contributions with capital and execution resources.'],
  ['RISK & GOVERNANCE','Due diligence, approvals, documentation, controls and portfolio oversight.'],
]

export default function Home(){
 return <div className="bq-home">
  <header className="bq-nav">
   <div className="container bq-nav-inner">
    <Link href="/" className="bq-brand"><BrandLogo/></Link>
    <nav className="bq-nav-links">
      <a href="#platform">Platform</a><a href="#approach">Approach</a><a href="#sectors">Sectors</a><a href="#process">Process</a><a href="#contact">Contact</a>
    </nav>
    <div className="bq-nav-actions"><Link href="/login" className="bq-nav-login">Institutional Access</Link><Link href="/register" className="btn primary">Present a Project</Link></div>
   </div>
  </header>

  <main>
   <section className="bq-hero-v2">
    <div className="bq-hero-v2-grid container">
      <div className="bq-hero-v2-copy">
        <div className="bq-overline"><span/> BANQUISQUEYA &amp; TRUST <em>·</em> DOMINICAN REPUBLIC</div>
        <div className="bq-hero-v2-kicker">CAPITAL · PROJECTS · PARTNERSHIPS</div>
        <h1>Structuring capital for the <i>real economy.</i></h1>
        <p>BanQuisqueya &amp; Trust is a Dominican Republic-based platform for evaluating, structuring and developing strategic projects across Latin America and the Caribbean.</p>
        <div className="bq-hero-actions"><Link href="/register" className="btn primary">Present an Opportunity</Link><a href="#platform" className="btn bq-outline">Explore Our Model</a></div>
        <div className="bq-hero-v2-meta"><span>LATAM &amp; CARIBBEAN</span><span>PRIVATE &amp; INSTITUTIONAL CAPITAL</span><span>PROJECT DEVELOPMENT</span></div>
      </div>
      <div className="bq-command-visual" aria-hidden="true">
        <div className="bq-command-grid"/>
        <div className="bq-command-ring ring-a"/><div className="bq-command-ring ring-b"/>
        <div className="bq-command-core"><small>CAPITAL + PROJECT</small><strong>STRUCTURE</strong><span>Evaluate · Partner · Execute</span></div>
        <div className="bq-float-card fc-one"><small>CAPITAL DESK</small><strong>Relationship<br/>Architecture</strong><span>Bank · Institutional · Strategic</span></div>
        <div className="bq-float-card fc-two"><small>PROJECT CONTROL</small><strong>Governance</strong><span>DD · Closing · Execution</span></div>
      </div>
    </div>
    <div className="bq-hero-v2-bottom"><div className="container"><span>DOMINICAN REPUBLIC</span><span>LATIN AMERICA</span><span>CARIBBEAN</span><span>INSTITUTIONAL PLATFORM</span></div></div>
   </section>

   <section className="bq-strip">
    <div className="container bq-strip-grid">
      <div><strong>01</strong><span>CAPITAL INTELLIGENCE</span><p>Understand the project before defining the capital.</p></div>
      <div><strong>02</strong><span>STRUCTURED PARTNERSHIPS</span><p>Align sponsors, capital sources and execution.</p></div>
      <div><strong>03</strong><span>CONTROLLED EXECUTION</span><p>Carry governance from approval through deployment.</p></div>
    </div>
   </section>

   <section className="bq-editorial" id="platform">
    <div className="container bq-editorial-head">
      <div><div className="bq-section-label">01 · THE PLATFORM</div><h2>Not a marketplace.<br/><span>A transaction platform.</span></h2></div>
      <div><p>Our role is to transform opportunities into structured transactions through disciplined evaluation, capital architecture, partnerships and execution controls.</p><p>Projects may be presented for financing, joint venture, development, strategic partnership, co-investment or other structures, subject to due diligence and applicable legal and regulatory requirements.</p></div>
    </div>
    <div className="container bq-capability-v2">{capabilities.map(([title,desc],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{desc}</p><b>↗</b></article>)}</div>
   </section>

   <section className="bq-architecture" id="approach">
    <div className="container">
      <div className="bq-section-head light"><div><div className="bq-section-label">02 · TRANSACTION ARCHITECTURE</div><h2>Capital follows <span>structure.</span></h2></div><p>Each mandate is developed around project economics, sponsor contribution, risk, governance and the appropriate capital relationships.</p></div>
      <div className="bq-architecture-map">
        <div className="arch-node arch-project"><small>01</small><strong>PROJECT</strong><span>Land · Rights · Permits · Know-how</span></div>
        <div className="arch-line l1"/><div className="arch-line l2"/><div className="arch-line l3"/>
        <div className="arch-node arch-structure"><small>02</small><strong>STRUCTURE</strong><span>SPV · Capital Stack · JV · Governance</span></div>
        <div className="arch-node arch-capital"><small>03</small><strong>CAPITAL SOURCES</strong><span>Banks · Institutional · Strategic · Private</span></div>
        <div className="arch-node arch-execution"><small>04</small><strong>EXECUTION</strong><span>Contracts · Procurement · Disbursement · Reporting</span></div>
      </div>
    </div>
   </section>

   <section className="bq-process-v2" id="process">
    <div className="container">
      <div className="bq-section-head"><div><div className="bq-section-label">03 · INSTITUTIONAL PROCESS</div><h2>From mandate to <span>execution.</span></h2></div><p>A defined workflow gives every project a clear path, documentation trail and decision point.</p></div>
      <div className="bq-process-v2-grid">{stages.map(([n,t,d])=><article key={n}><div className="stage-no">{n}</div><h3>{t}</h3><p>{d}</p></article>)}</div>
    </div>
   </section>

   <section className="bq-sectors-v2" id="sectors">
    <div className="container">
      <div className="bq-section-head"><div><div className="bq-section-label">04 · FOCUS AREAS</div><h2>Where capital meets <span>the real economy.</span></h2></div><p>Strategic sectors where project quality, sponsor capability and disciplined execution can support durable economic impact.</p></div>
      <div className="bq-sector-v2-grid">{sectors.map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><b>VIEW SECTOR ↗</b></article>)}</div>
    </div>
   </section>

   <section className="bq-sponsor">
    <div className="container bq-sponsor-grid">
      <div><div className="bq-section-label">05 · PROJECT SPONSORS</div><h2>You bring the opportunity.<br/><span>We build the architecture.</span></h2></div>
      <div><p>Bring us a project, development opportunity or strategic transaction. Our platform captures the opportunity, organizes the information required for evaluation and provides a controlled workflow for structuring, due diligence and decision-making.</p><div className="bq-sponsor-points"><span>✓ Financing</span><span>✓ Joint Venture</span><span>✓ Development</span><span>✓ Strategic Partnership</span><span>✓ Co-investment</span></div><Link href="/register" className="btn primary">Start a Project Submission</Link></div>
    </div>
   </section>

   <section className="bq-contact-v2" id="contact">
    <div className="container"><div className="bq-contact-v2-box"><div><div className="bq-section-label">06 · INSTITUTIONAL RELATIONSHIP</div><h2>Build the next transaction.</h2><p>Capital structuring · project development · strategic partnerships.</p></div><div className="bq-contact-actions"><a href="mailto:info@banquisqueya.com" className="btn primary">info@banquisqueya.com</a><Link href="/login" className="btn bq-outline-dark">Institutional Access</Link></div></div></div>
   </section>
  </main>

  <footer className="bq-footer"><div className="container bq-footer-grid"><div><BrandLogo compact/><p>Capital &amp; project development platform<br/>Dominican Republic · Latin America · Caribbean</p></div><div><small>PLATFORM</small><Link href="/register">Present a Project</Link><Link href="/login">Institutional Access</Link><Link href="/careers">Careers</Link></div><div><small>RELATIONSHIPS</small><a href="mailto:info@banquisqueya.com">info@banquisqueya.com</a><span>Dominican Republic</span><span>Latin America &amp; Caribbean</span></div></div><div className="container bq-footer-bottom"><span>© {new Date().getFullYear()} BanQuisqueya &amp; Trust</span><span>Private capital · Project development · Institutional partnerships</span></div></footer>
 </div>
}
