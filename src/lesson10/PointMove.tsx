import { useState } from "react";
import './PointMove.css';

const Div = () => {
    const arr = ['green', 'brown', 'magenta','white']
    const [x, SetX] = useState(0)
    const [y, Sety] = useState(0)
    const [index,setindex]=useState(0)
    const [color,setcolor]=useState(arr[index])
   
    const handLeonMouse=(event:any)=>
   {
      SetX(event.clientX)
      Sety(event.clientY)
   }
   const ChangeColor=(Event:any)=>
   {

    if (index + 1 === arr.length) {
        setindex(0);
    }
    else {
        setindex(index + 1);
    }
    setcolor(arr[index]);  

   }

    return <div id='div' onPointerMove={handLeonMouse} >

        <div id='ball'style={{background:color, top:y - 25,left:x - 25}} onClick={ChangeColor}  >

        </div >
    </div>


}
export default Div