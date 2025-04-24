// import { ChangeEvent, FormEvent, useState } from "react"

// type DataType = { name: string, age: string, phone: string }

// const Form = () => {
//     const [data, setData] = useState<DataType>({ name: '', age: '', phone: '' })

//     console.log(data);

//     const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = event.target
//         setData({ ...data, [name]: value })
//     }

//     // const onChangeHandler = (event: ChangeEvent<HTMLInputElement>, key: keyof DataType) => {
//     //     setData({ ...data, [key]: event.target.value })
//     // }

//     const onSubmitHandler = (event: FormEvent<HTMLFormElement>) => {
//         event.preventDefault()
//         const formData = new FormData(event.currentTarget)

//         // קריאת שרת

//     }

//     return <form onSubmit={onSubmitHandler}>
//         {/* controlled component */}
//         <input name="name" value={data.name} onChange={onChangeHandler} />
//         <input name="age" value={data.age} onChange={onChangeHandler} />
//         <input name="phone" value={data.phone} onChange={onChangeHandler} />
//         {/* <input name="phone" value={data.phone} onChange={(e) => onChangeHandler(e, "phone")} /> */}
//         {/*  */}
//         <input name="name" />
//         <input name="age" />
//         <input name="phone" />
//         <button>Submit</button>
//         <button onClick={() => setData({ name: '', age: '', phone: '' })} type="button">reset</button>
//         {/* <button type="button"></button> */}
//     </form>
// }

// export default Form

// const key = 'name'

// const object = { name: '', age: -1, phone: '' }

// object[key] = 'assadasds'


import { type } from "os"
import { ChangeEvent, FormEvent, useState } from "react"
type DataType = { name: string, password: string, gmail: string,city:string,descreption:string,correct:boolean }

const Form=()=>
{
    const [data,setData]=useState<DataType>({name:'',password:'',gmail:'',city:'',descreption:'',correct:true})

    return <Form> 
       <input name="name" value={data.name}/>
        <input password="password" value={data.password} />
        <input gmail="gmail" value={data.gmail} />
       <select name="city" id="">בחר עיר<option value={"בני ברק"}/></select>
       <input descreption="descreption" value={data.descreption} />
        <input correct="correct" value={data.correct} />
       
    </Form>
}