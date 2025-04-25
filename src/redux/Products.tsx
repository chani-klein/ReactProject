import { addProduct, setProducts } from "./products/product.slice"
import { selectProducts } from "./products/product.selector"
import { useAppSelector, useAppDispatch } from "./store"

const Products = () => {
    const products = useAppSelector(selectProducts)
    const dispatch = useAppDispatch()

    const onClick = () => {
        dispatch(setProducts(['a', 'b', 'c']))
    }

    const add = () => {
        dispatch(addProduct('d'))
    }

    return <div>
        {products.map((p, index) => <h1 key={index}>{p}</h1>)}
        <button onClick={onClick}>set products</button>
        <button onClick={add}>add product</button>
    </div>
}

export default Products