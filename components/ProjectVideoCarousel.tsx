'use client'

import { useEffect, useMemo, useState } from 'react'

type VideoItem = {
  category: string
  title: string
  description: string
  query: string
}

const videos: VideoItem[] = [
  {
    category: 'ENERGY',
    title: 'Renewable Energy & Infrastructure',
    description: 'Large-scale energy projects, infrastructure and transition investment.',
    query: 'renewable energy infrastructure project development Latin America',
  },
  {
    category: 'TOURISM',
    title: 'Tourism & Destination Development',
    description: 'Resorts, marinas, hospitality and integrated destination projects.',
    query: 'luxury resort marina tourism development project',
  },
  {
    category: 'REAL ESTATE',
    title: 'Urban & Real Estate Development',
    description: 'Master-planned communities, mixed-use developments and new urban platforms.',
    query: 'master planned community real estate development project',
  },
  {
    category: 'INFRASTRUCTURE',
    title: 'Infrastructure & Logistics',
    description: 'Ports, logistics, transportation and strategic infrastructure.',
    query: 'port logistics infrastructure development project',
  },
  {
    category: 'AGROINDUSTRY',
    title: 'Agroindustry & Industrial Projects',
    description: 'Production, processing, industrial platforms and regional value chains.',
    query: 'agroindustrial processing plant project development',
  },
]

export default function ProjectVideoCarousel() {
  const [active, setActive] = useState(0)
  const item = videos[active]

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % videos.length), 9000)
    return () => window.clearInterval(timer)
  }, [])

  const embedUrl = useMemo(
    () => 'https://www.youtube.com/embed?listType=search&list=' + encodeURIComponent(item.query),
    [item.query],
  )

  return (
    <section className="bq-video-section" id="projects">
      <div className="container">
        <div className="bq-video-heading">
          <div>
            <div className="bq-section-label">02 · PROJECT INTELLIGENCE</div>
            <h2>Projects that <span>shape economies.</span></h2>
          </div>
          <p>
            Explore visual references across the sectors in which BanQuisqueya &amp; Trust evaluates,
            structures and develops opportunities.
          </p>
        </div>

        <div className="bq-video-shell">
          <div className="bq-video-frame">
            <iframe
              key={item.query}
              src={embedUrl}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
            <div className="bq-video-overlay">
              <span>{item.category}</span>
              <strong>{item.title}</strong>
            </div>
          </div>

          <div className="bq-video-rail">
            {videos.map((video, index) => (
              <button
                key={video.category}
                type="button"
                className={'bq-video-card' + (index === active ? ' active' : '')}
                onClick={() => setActive(index)}
                aria-label={'Ver ' + video.title}
              >
                <span className="bq-video-number">0{index + 1}</span>
                <span className="bq-video-play">▶</span>
                <span className="bq-video-card-copy">
                  <small>{video.category}</small>
                  <strong>{video.title}</strong>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bq-video-controls">
          <button type="button" onClick={() => setActive((active - 1 + videos.length) % videos.length)} aria-label="Video anterior">←</button>
          <div className="bq-video-dots">
            {videos.map((video, index) => (
              <button
                key={video.category}
                type="button"
                className={index === active ? 'active' : ''}
                onClick={() => setActive(index)}
                aria-label={'Video ' + (index + 1)}
              />
            ))}
          </div>
          <button type="button" onClick={() => setActive((active + 1) % videos.length)} aria-label="Siguiente video">→</button>
        </div>
      </div>
    </section>
  )
}
