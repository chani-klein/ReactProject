import { Outlet, NavLink } from 'react-router'
import './style.css'
import { Paths } from '../routes/paths'
import RoleGuard from '../auth/RoleGuard'
import { RoleType } from '../types/user.types'
import { removeSession } from '../auth/auth.utils'

export const Layout = () => {
    return <>
        <header><NavBar /><AcountButton /></header>
        {/* // מחזיר את האלמנט שתואם לתת ניתוב הנוכחי */}
        <main><Outlet /></main>
        <footer>React Course</footer>
    </>
}

export const NavBar = () => {
    return <nav>
        <NavLink to={`/${Paths.home}`} end>Home</NavLink>
        <NavLink to={`/${Paths.calls}`} end>Calls</NavLink>
        <RoleGuard roles={[RoleType.Admin]}><NavLink to={Paths.calls}>Products</NavLink></RoleGuard>
    </nav>
}


export const AcountButton = () => {

    const logout = () => {
        removeSession()
    }

    return <div>
        <button onClick={logout}>logout</button>
    </div>
}