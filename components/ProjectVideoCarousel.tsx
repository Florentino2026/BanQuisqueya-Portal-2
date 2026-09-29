'use client'

import { useEffect, useState } from 'react'

type ProjectVisual = {
  category: string
  title: string
  description: string
  metric: string
  detail: string
  tone: string
}

const projects: ProjectVisual[] = [
  { category:'ENERGY · DEMO', title:'Caribbean Solar & Storage', description:'Utility-scale renewable generation and storage platform.', metric:'US$125M', detail:'Project capitalization', tone:'solar' },
  { category:'TOURISM · DEMO', title:'Bahía del Caribe', description:'Integrated resort, marina, residences and destination infrastructure.', metric:'US$280M', detail:'Development platform', tone:'resort' },
  { category:'INFRASTRUCTURE · DEMO', title:'Andean Logistics Hub', description:'Logistics, cold-chain and agroindustrial processing platform.', metric:'US$185M', detail:'Regional infrastructure', tone:'logistics' },
  { category:'URBAN DEVELOPMENT', title:'Institutional Real Estate', description:'Master-planned communities and mixed-use development platforms.', metric:'LATAM', detail:'Regional mandate', tone:'urban' },
  { category:'HEALTH · LIFE SCIENCES', title:'Healthcare Platforms', description:'Hospitals, clinics and specialized healthcare infrastructure.', metric:'PPP / JV', detail:'Potential structures', tone:'health' },
]

export default function ProjectVideoCarousel() {
  const [active, setActive] = useState(0)
  const item = projects[active]

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % projects.length), 7000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="bq-video-section" id="projects">
      <div className="container">
        <div className="bq-video-heading">
          <div>
            <div className="bq-section-label">02 · PROJECT INTELLIGENCE</div>
            <h2>Projects that <span>shape economies.</span></h2>
          </div>
          <p>Institutional visual references across the sectors in which BanQuisqueya &amp; Trust evaluates, structures and develops opportunities.</p>
        </div>

        <div className={'bq-project-stage bq-tone-' + item.tone}>
          <div className="bq-stage-grid"/>
          <div className="bq-stage-orbit"/>
          <div className="bq-stage-copy">
            <span>{item.category}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="bq-stage-metric"><strong>{item.metric}</strong><small>{item.detail}</small></div>
          </div>
          <div className="bq-stage-number">0{active + 1}</div>
          <div className="bq-stage-label">BANQUISQUEYA<br/><span>&amp; TRUST</span></div>
        </div>

        <div className="bq-video-rail">
          {projects.map((project, index) => (
            <button key={project.title} type="button" className={'bq-video-card' + (index === active ? ' active' : '')} onClick={() => setActive(index)}>
              <span className="bq-video-number">0{index + 1}</span>
              <span className={'bq-project-thumb bq-tone-' + project.tone}><i/></span>
              <span className="bq-video-card-copy"><small>{project.category}</small><strong>{project.title}</strong></span>
            </button>
          ))}
        </div>

        <div className="bq-video-controls">
          <button type="button" onClick={() => setActive((active - 1 + projects.length) % projects.length)} aria-label="Proyecto anterior">←</button>
          <div className="bq-video-dots">{projects.map((project,index)=><button key={project.title} type="button" className={index===active?'active':''} onClick={()=>setActive(index)} aria-label={'Proyecto '+(index+1)}/>)}</div>
          <button type="button" onClick={() => setActive((active + 1) % projects.length)} aria-label="Siguiente proyecto">→</button>
        </div>
      </div>
    </section>
  )
}
