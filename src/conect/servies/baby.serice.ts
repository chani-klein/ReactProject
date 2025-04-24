import axios from "../axios"
import { BabyType } from "../Baby/baby.type"

const serviceUrl='/Baby'

export const getBabies=async()=>
{
    const response=await axios.get<BabyType[]>(serviceUrl)
    return response.data
}
export const addBaby=async(baby:BabyType)=>
{
    const response=await axios.post<BabyType>(serviceUrl,baby)
    return response.data
}
export const deleteBaby=async(baby:BabyType)=>
{
    const response=await axios.DELETE<BabyType>(serviceUrl,baby)
    return response.data
}