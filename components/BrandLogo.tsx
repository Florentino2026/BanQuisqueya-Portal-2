export default function BrandLogo({compact=false}:{compact?:boolean}){
return <div className={compact?'brand-logo compact':'brand-logo'} aria-label="BanQuisqueya & Trust">
<svg className="brand-mark" viewBox="0 0 100 100" role="img">
<defs>
<linearGradient id="bq1-brand-logo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#18a8ff"/><stop offset=".55" stopColor="#0757a8"/><stop offset="1" stopColor="#071d3d"/></linearGradient>
<linearGradient id="bq2-brand-logo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#dce4ec"/><stop offset=".5" stopColor="#ffffff"/><stop offset="1" stopColor="#8996a5"/></linearGradient>
</defs>
{/* Symmetrical BQ monogram */}
<path d="M17 12h39c18 0 29 8 29 22 0 8-4 14-11 18 9 4 14 11 14 20 0 15-12 26-31 26H17V12Zm18 15v18h20c8 0 12-3 12-9s-4-9-12-9H35Zm0 33v21h22c8 0 13-4 13-10s-5-11-13-11H35Z" fill="url(#bq1-brand-logo)" stroke="#06396f" strokeWidth="1.5"/>
{/* Q stroke, centered and balanced */}
<path d="M30 64c7-8 17-12 29-12 17 0 28 9 28 20 0 10-8 17-20 17-12 0-22-6-27-15-3-5-3-7-10-10Z" fill="none" stroke="url(#bq2-brand-logo)" strokeWidth="5.5" strokeLinecap="round"/>
<path d="M58 76l18 12" fill="none" stroke="url(#bq2-brand-logo)" strokeWidth="5.5" strokeLinecap="round"/>
</svg>
{!compact&&<div className="brand-wordmark"><strong>BANQUISQUEYA</strong><span>&amp; TRUST</span></div>}
</div>}