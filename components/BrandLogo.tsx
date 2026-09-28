export default function BrandLogo({compact=false}:{compact?:boolean}){
return <div className={compact?'brand-logo compact':'brand-logo'} aria-label="BanQuisqueya & Trust">
<img className="brand-mark" src="/banquisqueya-original-mark.webp" alt="BanQuisqueya & Trust" />
{!compact&&<div className="brand-wordmark"><strong>BANQUISQUEYA</strong><span>&amp; TRUST</span></div>}
</div>}