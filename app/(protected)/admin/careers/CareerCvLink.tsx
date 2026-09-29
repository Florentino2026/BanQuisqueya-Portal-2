'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
export default function CareerCvLink({path}:{path:string}){
 const [loading,setLoading]=useState(false)
 async function open(){
  setLoading(true); const {data,error}=await createClient().storage.from('career-cv').createSignedUrl(path,600);setLoading(false)
  if(!error&&data?.signedUrl) window.open(data.signedUrl,'_blank','noopener,noreferrer')
 }
 return <button type="button" className="text-link" onClick={open}>{loading?'Abriendo…':'Ver CV →'}</button>
}
