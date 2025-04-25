import { FormEvent } from "react"
import { Link, useNavigate } from "react-router"
import { login } from "../services/auth.service"
import { setSession } from "../auth/auth.utils"
import { useAppDispatch } from "../redux/store"
import { setAuth } from "../redux/auth/auth.slice"
import { RoleType } from "../types/user.types"

export const LoginPage = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        try {
            const name: string = formData.get('name')?.toString()!
            const token = await login(name || '', formData.get('password')?.toString() || '')
            setSession(token)
            const user = {
                id: 1,
                name,
                role: RoleType.Admin,
                phone: '05246545614',
                email: 'sara@gmail.com',
                address: '',
            }
            dispatch(setAuth(user))
            navigate('/home')
        } catch (error) {

        }
    }

    return <form onSubmit={onSubmit}>
        <input name='name' />
        <input name='password' />
        <button>Login</button>
        עדיין לא רשום?
        <Link to='/auth/sign-up'>הרשם</Link>
    </form>
}