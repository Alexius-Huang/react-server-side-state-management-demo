import { FC } from "react";
import { CartItem, Product } from "../types";
import { toast } from "react-toastify";
import useCartCalculation from "../swr-hooks/useCartCalculation";
import useCartProducts from "../swr-hooks/useCartProductsSWR";

type Props = {
    cartItems: Array<CartItem>;
    setCartItems: (cartItems: Array<CartItem>) => void;
    addToCart(product: Product): void;
    removeFromCart(product: Product): void;
};

const CartSWR: FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
    const {
        isValidating: isCalculating,
        data: { cartTotalPrice: total } = { cartTotalPrice: 0 },
    } = useCartCalculation(cartItems, {
        onSuccess() {
            toast("Cart Calculation Complete!");
        },
    });

    const cartProducts = useCartProducts(cartItems);

    return (
        <div className="cart-wrapper">
            <div className="cart-inner-wrapper">
                {cartItems.length === 0 ? (
                    <h1>Cart is Empty!</h1>
                ) : (
                    <>
                        <h3>
                            Cart total:{" "}
                            {isCalculating ? "Calculating..." : `$ ${total}`}
                        </h3>
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

export default CartSWR;
