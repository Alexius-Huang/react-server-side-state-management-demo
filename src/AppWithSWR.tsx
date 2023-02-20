import ProductListSWR from "./components/ProductListSWR";
import CartSWR from "./components/CartSWR";
import useCart from "./hooks/useCart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function AppWithSWR() {
    const { cartItems, setCartItems, addToCart, removeFromCart } = useCart();

    return (
        <div className="App">
            <h2>Products</h2>

            <ProductListSWR addToCart={addToCart} />

            <CartSWR
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                cartItems={cartItems}
                setCartItems={setCartItems}
            />

            <ToastContainer />
        </div>
    );
}

export default AppWithSWR;
