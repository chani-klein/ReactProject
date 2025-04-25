
export enum RoleType {
    Admin = 'admin',
    User = 'user'
}

export type UserType = {
    id: number,
    name: string,
    role: RoleType,
    phone: string,
    email: string,
    address: string,
}