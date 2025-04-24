
import { ChangeEvent, KeyboardEvent, ReactNode, useState } from "react"
import { once } from "events"
const ToDoList=()=>
{
    const [value, setvalue] = useState('')
    const [index, setindex] = useState(3)


    const [exercisesArr, setexercisesArr] = useState([{comp:false ,dis:'do hw', id:1},{comp:false ,dis:'go shopping',id:2}])
    const exercisesArradd = exercisesArr.map(exercisesArr => <li key={exercisesArr.id} >
        <input type="checkbox" />
        {exercisesArr.dis} </li>)
     const addexercisesArr = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
         
            setexercisesArr([{comp:false,dis:value,id:index}, ...exercisesArr])
            setindex(index+1)
            setvalue('')
        }
      
    }
    // const isDo = (id:number,e:ChangeEvent) => {
    //     if (e.target) {
    //      setexercisesArr({comp:true ,dis:'do hw', id:1})
           
    //     }

return<>
  <input
            value={value}
            onChange={(e) => setvalue(e.target.value)}
            onKeyUp={addexercisesArr}
        />
        <ul>{exercisesArradd}</ul>
     
</>
}
export default ToDoList;
