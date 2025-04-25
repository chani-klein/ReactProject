import axios from "./axios"

const url = 'Calls'

export const getCalls = async () => {
    const response = await axios.get(url)
    return response.data
}

export const signUp = async () => {

}