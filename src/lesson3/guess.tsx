import { clear } from "console";
import { randomInt } from "crypto"

const GuessNumber = () => {
    let count = 0;
    const number1 = Math.round(Math.random() * 100)
    console.log(number1)
    let isWin = (data: number) => {
        count++;
  
        if (data == number1)
            console.log(` you win ${count} experiences`)
        else if (data > number1)
            console.log("big")
        else
            console.log("small")
    }
    return <>
        <h1>enter number:</h1>
        <NumberInput action={isWin} />
    </>
   
}
type PropsType = {

    action: (data:number) => void
}
const NumberInput = (props: PropsType) => {
    const n = <input type="text" />

    const isenter = (event: any) => {
      
        if (event.key == "Enter"){
       
            props.action(event.target.value)
            
        }
        
          
    }
    return <><input onKeyUp={ isenter }></input></>

}
export default GuessNumber