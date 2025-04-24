import { useState } from "react"
import { BabyType } from "./baby.type";

const Babies=()=>
{
const [baby,SetBaby]=useState<BabyType[]>([]);


const Babies=()=>
{
  const getAllBabies=async()=>
  {
    const babylist=await getBabies()
    SetBaby(babylist)
  }

  
}
  return <div>
    <button onClick={getAllBabies}>Get Babies</button>
   

  </div>
    
}