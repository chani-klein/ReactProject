import { ReactNode } from "react"
import { Navigate } from "react-router"
import { useAppSelector } from "../redux/store"
import { selectAuth } from "../redux/auth/auth.selector"
import { Paths } from "../routes/paths"

type Props = {
    children: ReactNode
}

const GuestGuard = ({ children }: Props) => {
    const { isAuthorized } = useAppSelector(selectAuth)

    if (isAuthorized) {
        return <Navigate to={`/${Paths.home}`} />
    }

    return <>{children}</>
}

export default GuestGuard