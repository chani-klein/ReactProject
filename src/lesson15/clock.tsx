import { useState,useEffect } from "react";

const Clock=()=>
{
    const [clock, setClock] = useState(new Date())
    useEffect(() => {
        setInterval(() => setClock(new Date()), 1000)
    },
        []
    )


    return (
        <div>{clock.getHours()+" " +clock.getMinutes()+" "+clock.getSeconds()+ ""}</div>
    )

}
export default Clock;