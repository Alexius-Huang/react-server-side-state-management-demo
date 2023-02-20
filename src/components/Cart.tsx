import { FC, useEffect, useState } from "react";
import { CartItem, Product } from "../types";
import { API_URL } from "../consts";
import { toast } from "react-toastify";
import useCartProducts from "../hooks/useCartProducts";

type Props = {
    products: Array<Product>;
    cartItems: Array<CartItem>;
    setCartItems: (cartItems: Array<CartItem>) => void;
    addToCart(product: Product): void;
    removeFromCart(product: Product): void;
    rollbackCart(): void;
    hasRolledBack: boolean;
};

const Cart: FC<Props> = ({
    products,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    hasRolledBack,
    rollbackCart
}) => {
    const [total, setTotal] = useState(0);

    /* Cart Calculation API */
    useEffect(() => {
        if (cartItems.length === 0 || hasRolledBack) return;

        fetch(`${API_URL}/cart-calculation`, {
            method: "POST",
            body: JSON.stringify({ cartItems }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then(({ cartTotalPrice = 0 }) => {
                setTotal(cartTotalPrice);
                toast("Cart Calculation Complete", { type: "success" });
            })
            .catch(() => {
                rollbackCart();
                toast("Cart Calculation Failed", { type: "error" });
            });
    }, [cartItems, setCartItems, rollbackCart, hasRolledBack]);

    const cartProducts = useCartProducts(products, cartItems);

    return (
        <div className="cart-wrapper">
            <div className="cart-inner-wrapper">
                {cartItems.length === 0 ? (
                    <h1>Cart is Empty!</h1>
                ) : (
                    <>
                        <h3>Cart total: $ {total}</h3>
                        <ul className="cart-item-list">
                            {cartProducts.map((item) => (
                                <li key={item.id}>
                                    <img src={item.url} alt="" />
                                    <p>
                                        {item.name} x {item.amount}
                                    </p>
                                    <button onClick={() => addToCart(item)}>
                                        +
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item)}
                                    >
                                        -
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;
