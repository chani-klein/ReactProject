import { useState, useEffect } from "react"
import { getCalls } from "../services/call"
import { CallsType } from "../types/calls.types"

const Call = () => {
    const [calls, setCalls] = useState<CallsType[]>([])


    useEffect(() => {
        const getData = async () => {
            const data = await getCalls()
            setCalls(data)
        }
        getData()
    }, [])

    return <>{calls.map(call => (
        <div key={call.id}>{call.name}</div>
    ))}</>
}

export default Call