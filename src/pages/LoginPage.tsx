// import { FormEvent } from "react"
// import { Link, useNavigate } from "react-router"
// import { login } from "../services/auth.service"
// import { setSession } from "../auth/auth.utils"
// import { useAppDispatch } from "../redux/store"
// import { setAuth } from "../redux/auth/auth.slice"
// import { RoleType } from "../types/user.types"

// export const LoginPage = () => {
//     const navigate = useNavigate()
//     const dispatch = useAppDispatch()

//     const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
//         event.preventDefault()
//         const formData = new FormData(event.currentTarget)
//         try {
//             const name: string = formData.get('name')?.toString()!
//             const token = await login(name || '', formData.get('password')?.toString() || '')
//             setSession(token)
//             const user = {
//                 id: 1,
//                 name,
//                 role: RoleType.Admin,
//                 phone: '05246545614',
//                 email: 'sara@gmail.com',
//                 address: '',
//             }
//             dispatch(setAuth(user))
//             navigate('/home')
//         } catch (error) {

//         }
//     }

//     return <form onSubmit={onSubmit}>
//         <input name='name' />
//         <input name='password' />
//         <button>Login</button>
//         עדיין לא רשום?
//         <Link to='/auth/sign-up'>הרשם</Link>
//     </form>
// }
import React, { useState } from 'react';
import './RegistrationForm.css'; // חיבור ל-CSS

export const LoginPage=()=> {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('נשלח:', formData);
  };
  
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-box">
        <h2 className="form-title">טופס הרשמה</h2>

        <input
          type="text"
          name="firstName"
          placeholder="שם פרטי"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="שם משפחה"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="אימייל"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="טלפון"
          value={formData.phone}
          onChange={handleChange}
        />

        <button type="submit">הרשמה</button>
      </form>
    </div>
  );
}
