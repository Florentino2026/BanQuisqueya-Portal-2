import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const sectors = [
  ['01','Energía & Recursos Naturales','Energías renovables, recursos estratégicos y proyectos energéticos.'],
  ['02','Infraestructura','Transporte, servicios públicos e infraestructura crítica y social.'],
  ['03','Desarrollo Urbano & Inmobiliario','Desarrollo residencial, comercial, regeneración urbana y vivienda.'],
  ['04','Turismo & Hospitalidad','Hoteles, resorts, ecoturismo y desarrollo de destinos.'],
  ['05','Salud & Bienestar','Hospitales, clínicas, tecnología médica y atención especializada.'],
  ['06','Tecnología & Telecomunicaciones','Transformación digital, FinTech, ciberseguridad y conectividad.'],
  ['07','Agroindustria','Producción agrícola, agrotecnología y procesamiento de alimentos.'],
  ['08','Industria & Manufactura','Parques industriales, manufactura, automotriz e innovación industrial.'],
]

const capabilities = [
  ['01','IDENTIFICAMOS','Analizamos necesidades, mercados, tendencias y oportunidades de desarrollo.'],
  ['02','EVALUAMOS','Realizamos análisis de viabilidad, modelos financieros, riesgos y evaluación de impacto.'],
  ['03','ESTRUCTURAMOS','Diseñamos alternativas de capital, financiación, alianzas y arquitectura de la transacción.'],
  ['04','ACOMPAÑAMOS','Apoyamos la ejecución mediante gestión de proyectos, monitoreo, transparencia y seguimiento.'],
]

const process = [
  ['01','OPORTUNIDAD','Identificación y análisis de mercado.'],
  ['02','DUE DILIGENCE','Viabilidad técnica, financiera y de riesgos.'],
  ['03','ESTRUCTURACIÓN','Diseño de la arquitectura financiera.'],
  ['04','CAPITAL','Movilización de fuentes de financiación.'],
  ['05','SOCIOS','Alianzas estratégicas y de ejecución.'],
  ['06','EJECUCIÓN','Gestión y seguimiento del proyecto.'],
  ['07','IMPACTO','Resultados económicos, sociales y ambientales.'],
]

export default function Home(){
  return (
    <div className="bq-home-v2">
      <header className="bq2-header">
        <div className="container bq2-header-inner">
          <Link href="/" className="bq2-brand"><BrandLogo /></Link>

          <nav className="bq2-nav" aria-label="Navegación principal">
            <a href="#firma">Quiénes Somos</a>
            <a href="#capacidades">Qué Hacemos</a>
            <a href="#sectores">Sectores</a>
            <a href="#proyectos">Proyectos</a>
            <a href="#esg">ESG &amp; Impacto</a>
            <a href="#contacto">Contacto</a>
          </nav>

          <div className="bq2-actions">
            <LanguageSwitcher />
            <Link href="/login" className="bq2-access">Acceso Institucional</Link>
            <Link href="/register" className="btn bq2-gold">Presentar un Proyecto</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="bq2-hero">
          <div className="bq2-hero-glow" />
          <div className="container bq2-hero-grid">
            <div className="bq2-hero-copy">
              <div className="bq2-kicker"><span /> PRIVATE CAPITAL · PROJECT DEVELOPMENT · STRATEGIC PARTNERSHIPS</div>
              <h1>Capital para<br /><em>construir el futuro.</em></h1>
              <h2>Estructuramos oportunidades. Movilizamos capital. Desarrollamos proyectos estratégicos.</h2>
              <p>BanQuisqueya &amp; Trust identifica, evalúa, estructura y acompaña oportunidades de inversión y desarrollo en América Latina, el Caribe y otros mercados internacionales.</p>
              <div className="bq2-hero-actions">
                <Link href="/register" className="btn bq2-gold">Presentar un Proyecto <span>→</span></Link>
                <a href="#firma" className="btn bq2-outline-light">Conocer nuestra firma</a>
              </div>
              <div className="bq2-hero-meta">
                <span>REPÚBLICA DOMINICANA</span><i /> <span>CARIBE</span><i /> <span>AMÉRICA LATINA</span><i /> <span>GLOBAL PARTNERSHIPS</span>
              </div>
            </div>

            <div className="bq2-hero-visual" aria-hidden="true">
              <div className="bq2-visual-grid" />
              <div className="bq2-orbit orbit-a" />
              <div className="bq2-orbit orbit-b" />
              <div className="bq2-orbit orbit-c" />
              <div className="bq2-visual-core">
                <small>CAPITAL</small>
                <strong>BQ</strong>
                <span>&amp; TRUST</span>
              </div>
              <div className="bq2-node node-a"><b>01</b><strong>CAPITAL</strong><span>Fuentes de financiación</span></div>
              <div className="bq2-node node-b"><b>02</b><strong>PROJECTS</strong><span>Oportunidades estratégicas</span></div>
              <div className="bq2-node node-c"><b>03</b><strong>PARTNERS</strong><span>Alianzas de ejecución</span></div>
              <div className="bq2-node node-d"><b>04</b><strong>IMPACT</strong><span>Valor sostenible</span></div>
              <div className="bq2-visual-caption">OPPORTUNITY · STRUCTURE · CAPITAL · EXECUTION</div>
            </div>
          </div>
        </section>

        <section className="bq2-intro" id="firma">
          <div className="container bq2-two-col">
            <div>
              <div className="bq2-label">01 · QUIÉNES SOMOS</div>
              <h2>Una plataforma para convertir oportunidades en <em>proyectos financiables.</em></h2>
            </div>
            <div className="bq2-copy">
              <p>BanQuisqueya &amp; Trust es una plataforma de inversión, estructuración y desarrollo de proyectos que conecta oportunidades estratégicas con capital, conocimiento especializado y socios de ejecución.</p>
              <p>Combinamos análisis financiero, evaluación de proyectos, estructuración de capital, gestión de riesgos, alianzas estratégicas y acompañamiento al desarrollo.</p>
              <a href="#capacidades" className="bq2-link">Conocer nuestra plataforma <span>→</span></a>
            </div>
          </div>
          <div className="container bq2-principles">
            <div><b>01</b><strong>Transparencia</strong><span>Actuamos con claridad y apertura.</span></div>
            <div><b>02</b><strong>Responsabilidad</strong><span>Creación de valor a largo plazo.</span></div>
            <div><b>03</b><strong>Integridad</strong><span>Altos estándares éticos.</span></div>
            <div><b>04</b><strong>Sostenibilidad</strong><span>Valor económico, social y ambiental.</span></div>
          </div>
        </section>

        <section className="bq2-capabilities" id="capacidades">
          <div className="container">
            <div className="bq2-section-head">
              <div><div className="bq2-label">02 · QUÉ HACEMOS</div><h2>De la oportunidad a la <em>ejecución.</em></h2></div>
              <p>Trabajamos a través de las distintas etapas de una oportunidad, desde su identificación hasta la estructuración y el acompañamiento del proyecto.</p>
            </div>
            <div className="bq2-capability-grid">
              {capabilities.map(([n,t,d]) => (
                <article key={n}>
                  <b>{n}</b>
                  <div className="bq2-number-line" />
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bq2-sectors" id="sectores">
          <div className="container">
            <div className="bq2-section-head">
              <div><div className="bq2-label">03 · NUESTRO UNIVERSO DE PROYECTOS</div><h2>Sectores estratégicos.<br /><em>Oportunidades reales.</em></h2></div>
              <p>Participamos en sectores donde el capital y la ejecución pueden contribuir al crecimiento económico y al desarrollo sostenible.</p>
            </div>
            <div className="bq2-sector-grid">
              {sectors.map(([n,t,d]) => (
                <article key={n}>
                  <span className="bq2-sector-number">{n}</span>
                  <div className="bq2-sector-art"><span /></div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bq2-process" id="proyectos">
          <div className="container">
            <div className="bq2-section-head">
              <div><div className="bq2-label">04 · DE LA OPORTUNIDAD A LA EJECUCIÓN</div><h2>Una oportunidad necesita más que <em>capital.</em></h2></div>
              <p>Nuestra metodología integra análisis, estructuración, alianzas, ejecución, monitoreo y medición de resultados.</p>
            </div>
            <div className="bq2-process-grid">
              {process.map(([n,t,d]) => (
                <article key={n}>
                  <b>{n}</b>
                  <div className="bq2-process-icon">{n}</div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bq2-esg" id="esg">
          <div className="container bq2-esg-grid">
            <div>
              <div className="bq2-label light">05 · CAPITAL CON RESPONSABILIDAD</div>
              <h2>ESG integrado en nuestra estrategia.</h2>
              <p>La creación de valor se entiende desde una perspectiva económica, social y ambiental de largo plazo.</p>
            </div>
            <div className="bq2-esg-items">
              <article><b>E</b><h3>AMBIENTAL</h3><p>Energía limpia, eficiencia, conservación de recursos y sostenibilidad.</p></article>
              <article><b>S</b><h3>SOCIAL</h3><p>Empleo, educación, salud, vivienda y desarrollo de capacidades.</p></article>
              <article><b>G</b><h3>GOBERNANZA</h3><p>Transparencia, gestión de riesgos, controles e integridad.</p></article>
            </div>
          </div>
        </section>

        <section className="bq2-impact">
          <div className="container bq2-impact-grid">
            <div>
              <div className="bq2-label">06 · NUESTRO IMPACTO</div>
              <h2>Crear valor que <em>permanezca.</em></h2>
              <p>Medimos el desempeño de los proyectos mediante indicadores económicos, sociales y ambientales, con seguimiento y evaluación periódica.</p>
            </div>
            <div className="bq2-impact-list">
              <div><strong>ECONÓMICO</strong><span>Empleo · actividad productiva · nuevos modelos de negocio</span></div>
              <div><strong>SOCIAL</strong><span>Educación · salud · vivienda · servicios básicos</span></div>
              <div><strong>AMBIENTAL</strong><span>Energía renovable · eficiencia · conservación</span></div>
              <div><strong>INNOVACIÓN</strong><span>Tecnología · digitalización · mejora continua</span></div>
            </div>
          </div>
        </section>

        <section className="bq2-reach">
          <div className="container bq2-reach-grid">
            <div className="bq2-reach-map" aria-hidden="true">
              <div className="bq2-map-latam">LATAM</div>
              <span className="map-dot dot-1" /><span className="map-dot dot-2" /><span className="map-dot dot-3" /><span className="map-dot dot-4" />
              <div className="map-arc arc-1" /><div className="map-arc arc-2" /><div className="map-arc arc-3" />
            </div>
            <div className="bq2-reach-copy">
              <div className="bq2-label light">07 · DÓNDE TRABAJAMOS</div>
              <h2>Perspectiva regional.<br /><em>Conexiones globales.</em></h2>
              <p>Identificamos y estructuramos oportunidades en América Latina y el Caribe, trabajando con inversionistas, desarrolladores, entidades públicas, empresas y socios internacionales.</p>
              <div className="bq2-reach-tags"><span>REPÚBLICA DOMINICANA</span><span>CARIBE</span><span>AMÉRICA LATINA</span><span>MERCADOS INTERNACIONALES</span></div>
            </div>
          </div>
        </section>

        <section className="bq2-paths">
          <div className="container">
            <div className="bq2-label">08 · ¿QUÉ ESTÁS BUSCANDO?</div>
            <h2>Conectemos la oportunidad correcta con el <em>capital adecuado.</em></h2>
            <div className="bq2-path-grid">
              <article>
                <span className="bq2-path-index">A</span>
                <h3>Tengo un Proyecto</h3>
                <p>¿Tienes un proyecto que requiere capital, estructuración financiera o socios estratégicos?</p>
                <Link href="/register" className="btn bq2-gold">Presentar un Proyecto <span>→</span></Link>
              </article>
              <article>
                <span className="bq2-path-index">B</span>
                <h3>Soy Inversionista</h3>
                <p>¿Buscas oportunidades de inversión estructuradas en sectores estratégicos?</p>
                <Link href="/login" className="btn bq2-navy-btn">Acceder al Portal <span>→</span></Link>
              </article>
            </div>
          </div>
        </section>

        <section className="bq2-opportunities">
          <div className="container">
            <div className="bq2-label">09 · OPORTUNIDADES</div>
            <div className="bq2-opportunity-head">
              <h2>Oportunidades que pueden <em>transformar mercados.</em></h2>
              <p>La publicación de oportunidades estará sujeta a autorización, documentación y proceso de evaluación correspondiente.</p>
            </div>
            <div className="bq2-opportunity-grid">
              <div><span>01</span><strong>ENERGÍA</strong><p>Generación, transición energética y sostenibilidad.</p></div>
              <div><span>02</span><strong>INFRAESTRUCTURA</strong><p>Activos estratégicos y servicios esenciales.</p></div>
              <div><span>03</span><strong>DESARROLLO URBANO</strong><p>Proyectos residenciales, comerciales y de regeneración.</p></div>
              <div><span>04</span><strong>TURISMO</strong><p>Hoteles, resorts y desarrollo de destinos.</p></div>
            </div>
          </div>
        </section>

        <section className="bq2-mission">
          <div className="container bq2-mission-grid">
            <article><div className="bq2-label">10 · MISIÓN</div><h2>Impulsar el crecimiento económico y social a través de <em>inversiones responsables.</em></h2></article>
            <article><div className="bq2-label">VISIÓN</div><p>Transformar ideas y proyectos en realidades rentables y sostenibles, contribuyendo positivamente al desarrollo económico.</p></article>
          </div>
        </section>

        <section className="bq2-final" id="contacto">
          <div className="container">
            <div className="bq2-label light">11 · PRÓXIMA OPORTUNIDAD</div>
            <h2>Construyamos la próxima <em>oportunidad.</em></h2>
            <p>Un proyecto puede comenzar con una idea. Una inversión puede comenzar con una oportunidad.</p>
            <div className="bq2-final-actions">
              <Link href="/register" className="btn bq2-gold">Presentar un Proyecto <span>→</span></Link>
              <Link href="/login" className="btn bq2-outline-light">Acceder al Portal</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bq2-footer">
        <div className="container bq2-footer-grid">
          <div><BrandLogo/><p>Capital · Project Development · Strategic Partnerships<br />República Dominicana · América Latina · Caribe</p></div>
          <div><small>NAVEGACIÓN</small><a href="#firma">Quiénes Somos</a><a href="#capacidades">Qué Hacemos</a><a href="#sectores">Sectores</a><a href="#proyectos">Proyectos</a><a href="#esg">ESG &amp; Impacto</a></div>
          <div><small>PORTAL</small><Link href="/login">Acceso Institucional</Link><Link href="/register">Presentar un Proyecto</Link><Link href="/referidor/registro">Referidores de Proyectos</Link><Link href="/careers">Carreras</Link></div>
          <div><small>CONTACTO</small><a href="mailto:info@banquisqueya.com">info@banquisqueya.com</a><span>República Dominicana</span><span>Latinoamérica &amp; Caribe</span></div>
        </div>
        <div className="container bq2-footer-bottom"><span>© {new Date().getFullYear()} BanQuisqueya &amp; Trust</span><span>Private Capital · Project Development · Institutional Partnerships</span></div>
      </footer>
    </div>
  )
}
