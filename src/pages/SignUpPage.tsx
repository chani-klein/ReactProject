import { FormEvent } from "react"
import { Link } from "react-router"

export const SignUpPage = () => {

    const onSubmit = (event: FormEvent) => {
        event.preventDefault()
    }

    return <form onSubmit={onSubmit}>
        <input />
        <input />
        <input />
        <input />
        <button>Sign Up</button>
        רשום?
        <Link to='/auth/login'>התחבר</Link>
    </form>
}
