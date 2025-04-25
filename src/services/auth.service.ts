import axios from "./axios"

const url = 'Login'

export const login = async (userName: string, password: string) => 
{
    const response = await axios.post<string>(url + '/login', { userName, password })
    return response.data
}

export const signUp = async () => {

}