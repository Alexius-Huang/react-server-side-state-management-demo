import { useEffect, useState } from "react";
import { Product } from "./types";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import { API_URL } from "./consts";
import { ToastContainer, toast } from "react-toastify";
import useCart from "./hooks/useCart";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
    const { cartItems, setCartItems, addToCart, removeFromCart } = useCart();
    const [isLoaded, setIsLoaded] = useState(false);
    const [products, setProducts] = useState<Array<Product>>([]);

    // Fetching Products...
    useEffect(() => {
        if (isLoaded) return;

        fetch(`${API_URL}/products`)
            .then((res) => res.json())
            .then((data) => {
                toast("Fetching products complete!", { type: "success" });
                setProducts(data);
                setIsLoaded(true);
            })
            .catch(() => {
                toast("Failed to fetch products!", { type: "error" });
            });
    }, [isLoaded, products]);

    return (
        <div className="App">
            <h2>Products</h2>

            <ProductList products={products} addToCart={addToCart} />
            <Cart
                products={products}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                cartItems={cartItems}
                setCartItems={setCartItems}
            />

            <ToastContainer />
        </div>
    );
}

export default App;
