import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'
import ProjectVideoCarousel from '@/components/ProjectVideoCarousel'

const sectors=[
 ['01','Energy & Natural Resources','Renewable energy, generation, mining and strategic resource projects.'],
 ['02','Infrastructure & Logistics','Transport, logistics, utilities, water and essential infrastructure.'],
 ['03','Tourism & Hospitality','Hotels, resorts, marinas and destination developments.'],
 ['04','Real Estate & Urban Development','Housing, mixed-use, planned communities and institutional real estate.'],
 ['05','Health & Life Sciences','Hospitals, clinics, specialized facilities and healthcare platforms.'],
 ['06','Agroindustry','Production, processing, storage, logistics and value-chain projects.'],
 ['07','Industrial & Manufacturing','Industrial parks, manufacturing, distribution and supply-chain platforms.'],
 ['08','Technology & Innovation','Digital infrastructure, fintech, technology transfer and scalable platforms.'],
]

const capabilities=[
 ['01','Capital Structuring','Design and coordinate capital solutions aligned with project economics, sponsor contribution and risk.'],
 ['02','Project Evaluation','Financial, commercial, technical, legal and risk assessment before investment decisions.'],
 ['03','Joint Ventures & Development','Partnership structures where sponsors contribute projects, rights, land or expertise and BanQuisqueya contributes capital, structuring and management resources.'],
 ['04','Capital Partnerships','Relationship management with banks, institutional sources, strategic partners and other capital providers.'],
 ['05','Execution & Governance','Budget control, procurement, contracts, milestones, reporting and controlled disbursement workflows.'],
 ['06','Regional Platform','A Dominican Republic-based platform designed to evaluate opportunities across Latin America and the Caribbean.'],
]

export default function Home(){
 return <div className="bq-home">
  <header className="bq-nav">
   <div className="container bq-nav-inner">
    <Link href="/" className="bq-brand"><BrandLogo/></Link>
    <nav className="bq-nav-links">
      <a href="#platform">Platform</a><a href="#sectors">Sectors</a><a href="#process">Process</a><a href="#contact">Contact</a>
    </nav>
    <div className="bq-nav-actions"><Link href="/login" className="bq-nav-login">Institutional Access</Link><Link href="/register" className="btn primary">Present a Project</Link></div>
   </div>
  </header>

  <main>
   <section className="bq-hero">
    <div className="bq-hero-grid container">
      <div className="bq-hero-copy">
        <div className="bq-overline"><span/> BANQUISQUEYA &amp; TRUST <em>·</em> CAPITAL &amp; PROJECTS</div>
        <h1>Capital intelligence for <span>strategic projects.</span></h1>
        <p>We structure capital, evaluate opportunities and build partnerships for projects with long-term economic and regional impact across Latin America and the Caribbean.</p>
        <div className="bq-hero-actions"><Link href="/register" className="btn primary">Present an Opportunity</Link><a href="#platform" className="btn bq-outline">Explore the Platform</a></div>
        <div className="bq-trust-line"><span>PRIVATE CAPITAL</span><i/> <span>PROJECT DEVELOPMENT</span><i/> <span>LATAM &amp; CARIBBEAN</span></div>
      </div>
      <div className="bq-hero-visual" aria-hidden="true">
        <div className="bq-orbit orbit-one"/><div className="bq-orbit orbit-two"/>
        <div className="bq-monogram">BQ</div>
        <div className="bq-visual-card bq-card-top"><small>CAPITAL DESK</small><strong>Strategic<br/>Capital</strong><span>Structuring · Matching</span></div>
        <div className="bq-visual-card bq-card-bottom"><small>PROJECT PIPELINE</small><strong>Evaluate · Structure · Execute</strong><span>Controlled institutional workflow</span></div>
      </div>
    </div>
    <div className="bq-hero-bottom"><div className="container"><span>DOMINICAN REPUBLIC</span><span>LATIN AMERICA</span><span>CARIBBEAN</span><span>INSTITUTIONAL PARTNERSHIPS</span></div></div>
   </section>

   <section className="bq-intro" id="platform">
    <div className="container bq-intro-grid">
      <div><div className="bq-section-label">01 · THE PLATFORM</div><h2>From opportunity to <span>bankable structure.</span></h2></div>
      <div><p>BanQuisqueya &amp; Trust operates as a project and capital structuring platform connecting sponsors, projects and appropriate sources of capital.</p><p className="muted">Our model is built around disciplined evaluation, transparent governance, financial structuring and execution controls—not simply the placement of capital.</p></div>
    </div>
    <div className="container bq-capability-grid">{capabilities.map(([n,t,d])=><article className="bq-capability" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><div className="bq-arrow">↗</div></article>)}</div>
   </section>

   <ProjectVideoCarousel />

   <section className="bq-dark-section" id="process">
    <div className="container">
      <div className="bq-section-head light"><div><div className="bq-section-label">02 · INSTITUTIONAL PROCESS</div><h2>A disciplined path from <span>mandate to execution.</span></h2></div><p>Each opportunity moves through defined stages, documentation and decision controls before capital deployment.</p></div>
      <div className="bq-process"><div><b>01</b><strong>Origination</strong><span>Opportunity &amp; sponsor profile</span></div><div><b>02</b><strong>Pre-screening</strong><span>Strategic &amp; commercial fit</span></div><div><b>03</b><strong>Due Diligence</strong><span>Financial · legal · technical · risk</span></div><div><b>04</b><strong>Structuring</strong><span>Capital stack &amp; partnership</span></div><div><b>05</b><strong>Decision</strong><span>Investment committee controls</span></div><div><b>06</b><strong>Closing &amp; Execution</strong><span>Governance &amp; monitored deployment</span></div></div>
    </div>
   </section>

   <section className="bq-sectors" id="sectors">
    <div className="container">
      <div className="bq-section-head"><div><div className="bq-section-label">03 · SECTORS</div><h2>Where capital meets <span>real economy.</span></h2></div><p>We focus on strategic sectors where strong sponsors, sound economics and disciplined execution can create durable value.</p></div>
      <div className="bq-sector-grid">{sectors.map(([n,t,d])=><article className="bq-sector" key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p><div>Explore mandate <b>↗</b></div></article>)}</div>
    </div>
   </section>

   <section className="bq-partner">
    <div className="container bq-partner-grid"><div><div className="bq-section-label">04 · FOR PROJECT SPONSORS</div><h2>Bring the opportunity.<br/><span>Build the structure.</span></h2></div><div><p>Projects may be presented for financing, joint venture, development, strategic partnership, co-investment or other structured arrangements subject to evaluation and applicable legal and regulatory requirements.</p><Link href="/register" className="btn primary">Start a Project Submission</Link></div></div>
   </section>

   <section className="bq-contact" id="contact"><div className="container"><div className="bq-contact-box"><div><div className="bq-section-label">05 · INSTITUTIONAL RELATIONSHIP</div><h2>Let's discuss the opportunity.</h2><p>For capital structuring, project development, strategic partnerships or institutional relationships.</p></div><div className="bq-contact-actions"><a href="mailto:info@banquisqueya.com" className="btn primary">info@banquisqueya.com</a><Link href="/login" className="btn bq-outline-dark">Institutional Access</Link></div></div></div></section>
  </main>

  <footer className="bq-footer"><div className="container bq-footer-grid"><div><BrandLogo compact/><p>Capital &amp; project development platform<br/>Dominican Republic · Latin America · Caribbean</p></div><div><small>PLATFORM</small><Link href="/register">Present a Project</Link><Link href="/login">Institutional Access</Link><Link href="/careers">Careers</Link></div><div><small>CONTACT</small><a href="mailto:info@banquisqueya.com">info@banquisqueya.com</a><span>Dominican Republic</span></div></div><div className="container bq-footer-bottom"><span>© {new Date().getFullYear()} BanQuisqueya &amp; Trust</span><span>Private capital · Project development · Institutional partnerships</span></div></footer>
 </div>
}
