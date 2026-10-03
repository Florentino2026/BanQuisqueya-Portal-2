import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'
import LanguageSwitcher from '@/components/LanguageSwitcher'

const sectors=[
  ['01','Energía e infraestructura','Energía renovable, generación, utilities, logística y activos estratégicos.'],
  ['02','Turismo y hospitalidad','Hoteles, resorts, marinas, destinos y desarrollos de uso mixto.'],
  ['03','Real estate & urban development','Vivienda, comunidades, desarrollos urbanos y activos inmobiliarios.'],
  ['04','Salud','Hospitales, clínicas, plataformas de salud y proyectos especializados.'],
  ['05','Agroindustria','Producción, procesamiento, almacenamiento y cadenas de valor.'],
  ['06','Industria & tecnología','Manufactura, parques industriales, infraestructura digital e innovación.'],
]

const capabilities=[
  ['01','Estructuración de capital','Diseñamos la arquitectura financiera y el capital stack de cada oportunidad.'],
  ['02','Joint Ventures & desarrollo','Alineamos al sponsor, los activos, el capital y la ejecución bajo una estructura definida.'],
  ['03','Capital Desk','Conectamos oportunidades calificadas con bancos, instituciones y fuentes privadas o estratégicas.'],
  ['04','Due diligence & governance','Evaluamos riesgos, documentación, contratos, controles y condiciones de cierre.'],
]

const process=[
  ['01','Presentación','El sponsor presenta el proyecto y define el objetivo de la relación.'],
  ['02','Evaluación','Analizamos proyecto, sponsor, mercado, estructura y documentación.'],
  ['03','Estructuración','Definimos capital, JV, SPV, gobierno y arquitectura de la transacción.'],
  ['04','Decisión','La oportunidad avanza por los controles internos y el proceso de aprobación.'],
  ['05','Cierre','Contratos, condiciones precedentes y cierre financiero.'],
  ['06','Ejecución','Desembolso controlado, procurement, reporting y seguimiento.'],
]

export default function Home(){
 return <div className="bq-institutional-home">
  <header className="bq5-nav">
   <div className="container bq5-nav-inner">
    <Link href="/" className="bq5-brand"><BrandLogo/></Link>
    <nav className="bq5-nav-links" aria-label="Navegación principal">
      <a href="#about">Quiénes Somos</a>
      <a href="#services">Qué Hacemos</a>
      <a href="#sectors">Sectores</a>
      <a href="#projects">Proyectos</a>
      <a href="#capital">Capital Partners</a>
      <a href="#contact">Contacto</a>
    </nav>
    <div className="bq5-nav-actions">
      <LanguageSwitcher/>
      <Link href="/login" className="bq5-access">Acceso Institucional</Link>
      <Link href="/register" className="btn bq5-gold-btn">Presentar Proyecto</Link>
    </div>
   </div>
  </header>

  <main>
   <section className="bq5-hero bq5-hero-editorial">
    <div className="container bq5-hero-editorial-grid">
      <div className="bq5-hero-copy">
        <div className="bq5-label"><span/> BANQUISQUEYA &amp; TRUST <i>·</i> PRIVATE CAPITAL PLATFORM</div>
        <h1>Capital que <em>estructura.</em><br/>Proyectos que <em>transforman.</em></h1>
        <p>Evaluamos, estructuramos y acompañamos oportunidades de inversión y desarrollo en América Latina y el Caribe.</p>
        <div className="bq5-actions">
          <Link href="/register" className="btn bq5-gold-btn">Presentar una Oportunidad</Link>
          <a href="#about" className="btn bq5-outline-btn">Conocer BanQuisqueya</a>
        </div>
        <div className="bq5-hero-signature">
          <span>DOMINICANA</span><b>01</b><span>LATAM</span><b>02</b><span>CARIBE</span><b>03</b>
        </div>
      </div>
    </div>
   </section>
   <section className="bq5-intro" id="about">
    <div className="container bq5-two-col">
      <div>
        <div className="bq5-section-label">01 · QUIÉNES SOMOS</div>
        <h2>Una plataforma para convertir oportunidades en <em>transacciones estructuradas.</em></h2>
      </div>
      <div className="bq5-copy">
        <p>BanQuisqueya &amp; Trust trabaja desde República Dominicana con una visión regional para América Latina y el Caribe.</p>
        <p>Evaluamos oportunidades, estructuramos relaciones de capital y acompañamos proyectos desde la definición de la estrategia hasta el cierre y la ejecución.</p>
        <Link href="#services" className="bq5-text-link">Conocer nuestra plataforma <span>→</span></Link>
      </div>
    </div>
    <div className="container bq5-principles">
      <div><b>01</b><strong>Disciplina</strong><span>Evaluación antes de estructurar.</span></div>
      <div><b>02</b><strong>Alineación</strong><span>Sponsor, capital y proyecto bajo una misma arquitectura.</span></div>
      <div><b>03</b><strong>Gobernanza</strong><span>Controles desde la aprobación hasta la ejecución.</span></div>
      <div><b>04</b><strong>Relaciones</strong><span>Capital institucional, bancario y estratégico.</span></div>
    </div>
   </section>

   <section className="bq5-services" id="services">
    <div className="container">
      <div className="bq5-section-head">
        <div><div className="bq5-section-label">02 · QUÉ HACEMOS</div><h2>De la oportunidad a la <em>arquitectura financiera.</em></h2></div>
        <p>Una metodología institucional para proyectos que requieren capital, socios, desarrollo y capacidad de ejecución.</p>
      </div>
      <div className="bq5-service-grid">
        {capabilities.map(([n,t,d])=><article key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p><a href="#contact">Explorar <span>→</span></a></article>)}
      </div>
    </div>
   </section>

   <section className="bq5-capital" id="capital">
    <div className="container bq5-capital-grid">
      <div>
        <div className="bq5-section-label light">03 · CAPITAL PARTNERS</div>
        <h2>Relaciones de capital construidas alrededor del <em>proyecto.</em></h2>
      </div>
      <div className="bq5-capital-copy">
        <p>Trabajamos con relaciones bancarias, institucionales, privadas y estratégicas de acuerdo con las características y necesidades de cada transacción.</p>
        <div className="bq5-capital-list"><span>Bancos y entidades financieras</span><span>Capital institucional</span><span>Private capital &amp; family offices</span><span>Strategic investors</span><span>Development &amp; infrastructure partners</span></div>
        <a href="#contact" className="btn bq5-light-btn">Iniciar una conversación</a>
      </div>
    </div>
   </section>

   <section className="bq5-sectors" id="sectors">
    <div className="container">
      <div className="bq5-section-head">
        <div><div className="bq5-section-label">04 · SECTORES</div><h2>Donde el capital encuentra <em>economía real.</em></h2></div>
        <p>Seleccionamos oportunidades donde la estructura, el sponsor y la ejecución pueden sostener un proyecto viable.</p>
      </div>
      <div className="bq5-sector-grid">
       {sectors.map(([n,t,d])=><article key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p><a href="#contact">Ver enfoque <span>→</span></a></article>)}
      </div>
    </div>
   </section>

   <section className="bq5-projects" id="projects">
    <div className="container bq5-projects-grid">
      <div>
        <div className="bq5-section-label">05 · PROYECTOS</div>
        <h2>Presenta una oportunidad. <em>Construyamos la estructura.</em></h2>
        <p>El portal permite presentar proyectos para evaluación y establecer una relación de trabajo bajo financiamiento, Joint Venture, desarrollo, alianza estratégica o co-inversión, sujeto a due diligence y a la documentación aplicable.</p>
      </div>
      <div className="bq5-project-actions">
        <Link href="/register" className="btn bq5-gold-btn">Presentar un Proyecto</Link>
        <Link href="/login" className="btn bq5-dark-btn">Acceso al Portal</Link>
        <span>El portal institucional permite dar seguimiento a la información y al proceso de evaluación.</span>
      </div>
    </div>
   </section>

   <section className="bq5-process" id="process">
    <div className="container">
      <div className="bq5-section-head">
        <div><div className="bq5-section-label">06 · PROCESO</div><h2>Una ruta clara desde el <em>mandato hasta la ejecución.</em></h2></div>
        <p>El flujo combina evaluación, estructuración, due diligence, aprobación, cierre y ejecución controlada.</p>
      </div>
      <div className="bq5-process-grid">
       {process.map(([n,t,d])=><article key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></article>)}
      </div>
    </div>
   </section>

   <section className="bq5-contact" id="contact">
    <div className="container bq5-contact-box">
      <div><div className="bq5-section-label">07 · CONTACTO</div><h2>Hablemos de la próxima <em>transacción.</em></h2><p>Capital structuring · Project development · Strategic partnerships</p></div>
      <div className="bq5-contact-actions">
        <a href="mailto:info@banquisqueya.com" className="btn bq5-gold-btn">info@banquisqueya.com</a>
        <Link href="/register" className="btn bq5-dark-btn">Presentar Proyecto</Link>
      </div>
    </div>
   </section>
  </main>

  <footer className="bq5-footer">
   <div className="container bq5-footer-grid">
    <div><BrandLogo/><p>Capital · Project Development · Strategic Partnerships<br/>República Dominicana · LATAM · Caribe</p></div>
    <div><small>NAVEGACIÓN</small><a href="#about">Quiénes Somos</a><a href="#services">Qué Hacemos</a><a href="#sectors">Sectores</a><a href="#process">Proceso</a></div>
    <div><small>PORTAL</small><Link href="/register">Presentar Proyecto</Link><Link href="/login">Acceso Institucional</Link><Link href="/referidor/registro">Referidores de Proyectos</Link><Link href="/careers">Carreras</Link></div>
    <div><small>CONTACTO</small><a href="mailto:info@banquisqueya.com">info@banquisqueya.com</a><span>República Dominicana</span><span>Latinoamérica &amp; Caribe</span></div>
   </div>
   <div className="container bq5-footer-bottom"><span>© {new Date().getFullYear()} BanQuisqueya &amp; Trust</span><span>Private capital · Project development · Institutional partnerships</span></div>
  </footer>
 </div>
}