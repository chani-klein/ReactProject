import { KeyboardEvent, ReactNode, useState } from "react"
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
         
            setexercisesArr([{comp=false,dis=value,id=index}, ...exercisesArr])
            setindex(index+1)
            setvalue('')
        }
        const isDo = () => {
            if (comp==false) {
             setexercisesArr({comp:true ,dis:'do hw', id:1} style={{line: underline }})
               
            }
    }

return<>
  <input
            value={value}
            onChange={(e) => setvalue(e.target.value)isDo(comp)}
            onKeyUp={addexercisesArr}
        />
        <ul>{exercisesArradd}</ul>
     
</>
}
export default ToDoList;
