import { type } from "os"
import { useState } from "react";
import './Calculator.css'
let str=" ";
const Calculator=()=>
{
    const [res, setRes] = useState('')
    const onClick1=(data:string)=>
    {
      
        //    console.log(data)
           str+=data;
           setRes(res+data);
        //    console.log(str)

    }
    const onClickToShave=(event:any)=>
        {
            console.log(str+"=");

             str=eval(str);
             console.log(str);
             setRes(res+'='+eval(res))
             str=" ";
        }
        const onClickToDeleat=(event:any)=>
            {
                // console.log(str)                
                setRes('')
                // console.log(str)
            }
            const onClickToC=(event:any)=>
            {
                // console.log(str)                
              
                setRes(res.substring(res.length-1,1))
                // console.log(str)
            }
return <>
<h1>מחשבון</h1>
<div>
<h1>{res}</h1>

<Button2 Text="1" action={onClick1}/>
<Button2 Text="2"action={onClick1}/>
<Button2 Text="3"action={onClick1}/>
<Button2 Text="/"action={onClick1}/>
<br></br>
<Button2 Text="4"action={onClick1}/>
<Button2 Text="5"action={onClick1}/>
<Button2 Text="6"action={onClick1}/>
<Button2 Text="*"action={onClick1}/>
<br />
<Button2 Text="7"action={onClick1}/>
<Button2 Text="8"action={onClick1}/>
<Button2 Text="9"action={onClick1}/>
<Button2 Text="-"action={onClick1}/>
<br />
<Button2 Text="0"action={onClick1}/>
<Button2 Text="."action={onClick1}/>
<Button2 Text="c"action={onClickToC}/>

<Button2 Text="+"action={onClick1 }/>
<br />
<Button2  Text="="action={onClickToShave } />
<Button2 Text="d"action={onClickToDeleat }/>
</div>
 </>
}
type PropsType={
    Text:string,
    action:(event:any)=>void
}
const Button2=(props:PropsType)=>
{
 
const click=(enent:any)=>
{
    
            props.action(props.Text)
    
}
    return <>
    <button onClick={click}>{props.Text}</button> 

    {/* <button onClick ={()props.action(event)}>props.Text</button> */}
    </>

}
export default Calculator;

