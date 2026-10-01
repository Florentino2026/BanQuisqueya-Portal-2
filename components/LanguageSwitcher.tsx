'use client'

import {useEffect,useState} from 'react'

const translations:Record<string,string>={
'Platform':'Plataforma','Approach':'Enfoque','Sectors':'Sectores','Process':'Proceso','Contact':'Contacto',
'Institutional Access':'Acceso Institucional','Present a Project':'Presentar un Proyecto','Present an Opportunity':'Presentar una Oportunidad','Explore Our Model':'Explorar Nuestro Modelo',
'CAPITAL · PROJECTS · PARTNERSHIPS':'CAPITAL · PROYECTOS · ALIANZAS','Structuring capital for the':'Estructurando capital para la','real economy.':'economía real.',
'BanQuisqueya & Trust is a Dominican Republic-based platform for evaluating, structuring and developing strategic projects across Latin America and the Caribbean.':'BanQuisqueya & Trust es una plataforma con sede en República Dominicana para evaluar, estructurar y desarrollar proyectos estratégicos en América Latina y el Caribe.',
'LATAM & CARIBBEAN':'LATAM Y CARIBE','PRIVATE & INSTITUTIONAL CAPITAL':'CAPITAL PRIVADO E INSTITUCIONAL','PROJECT DEVELOPMENT':'DESARROLLO DE PROYECTOS',
'Not a marketplace.':'No somos un marketplace.','A transaction platform.':'Somos una plataforma transaccional.','Capital follows':'El capital sigue la','structure.':'estructura.',
'From mandate to':'Del mandato a la','execution.':'ejecución.','Where capital meets':'Donde el capital encuentra','the real economy.':'la economía real.',
'You bring the opportunity.':'Tú aportas la oportunidad.','We build the architecture.':'Nosotros construimos la arquitectura.',
'Build the next transaction.':'Construyamos la próxima transacción.','Start a Project Submission':'Iniciar Presentación de Proyecto',
'Private capital · Project development · Institutional partnerships':'Capital privado · Desarrollo de proyectos · Alianzas institucionales'
}

export default function LanguageSwitcher(){
 const [lang,setLang]=useState<'EN'|'ES'>('EN')
 useEffect(()=>{const saved=(localStorage.getItem('bq_lang')||'EN') as 'EN'|'ES';setLang(saved)},[])
 function apply(next:'EN'|'ES'){
   localStorage.setItem('bq_lang',next);setLang(next);document.documentElement.lang=next==='ES'?'es':'en'
   const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT)
   let n:Node|null
   while(n=walker.nextNode()){const text=n.textContent?.trim()||'';if(!text)continue;if(next==='ES'){if(translations[text])n.textContent=n.textContent!.replace(text,translations[text])}else{const original=Object.entries(translations).find(([,v])=>v===text)?.[0];if(original)n.textContent=n.textContent!.replace(text,original)}}
 }
 return <div className="bq-language-switcher" aria-label="Language"><button type="button" className={lang==='ES'?'active':''} onClick={()=>apply('ES')}>ES</button><span>/</span><button type="button" className={lang==='EN'?'active':''} onClick={()=>apply('EN')}>EN</button></div>
}
