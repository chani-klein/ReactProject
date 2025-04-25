import { createSlice } from "@reduxjs/toolkit";

const initialState: string[] = []

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            // type //  'product/setProducts'
            return action.payload
        },
        addProduct: (state, action) => {
            state.push(action.payload)
        }
    }
})

export const { setProducts, addProduct } = productSlice.actions

export default productSlice.reducer