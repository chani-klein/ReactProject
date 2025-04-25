import { ReactNode } from "react"
import { useAppSelector } from "../redux/store"
import { selectAuth } from "../redux/auth/auth.selector"
import { RoleType } from "../types/user.types"

type Props = {
    children: ReactNode,
    roles?: RoleType[]
}

const RoleGuard = ({ children, roles }: Props) => {
    const { isAuthorized, isInitialized, user } = useAppSelector(selectAuth)


    if (!isInitialized || !isAuthorized || (roles?.length && !roles.includes(user!.role))) {
        return null
    }

    return <>{children}</>
}

export default RoleGuard