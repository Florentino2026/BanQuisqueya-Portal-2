'use client'

import { useEffect, useState } from 'react'

export default function TimeGreeting({name}:{name:string}){
  const [greeting,setGreeting]=useState('Buenas tardes')

  useEffect(()=>{
    const hour=new Date().getHours()
    if(hour>=5 && hour<12) setGreeting('Buenos días')
    else if(hour>=12 && hour<19) setGreeting('Buenas tardes')
    else setGreeting('Buenas noches')
  },[])

  return <>{greeting}, {name}</>
}
