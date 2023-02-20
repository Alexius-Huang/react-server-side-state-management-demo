import { FC, useMemo } from "react";
import { CartItem, Product, ProduceWithAmount } from "../types";
import { toast } from "react-toastify";
import useCartCalculation from "../swr-hooks/useCartCalculation";
import useProducts from "../swr-hooks/useProducts";
// import useCartItemProducts from "../swr-hooks/useCartItemProducts";

type Props = {
    cartItems: Array<CartItem>;
    setCartItems: (cartItems: Array<CartItem>) => void;
    addToCart(product: Product): void;
    removeFromCart(product: Product): void;
};

const CartSWR: FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
    const { data: products = [] } = useProducts();
    const {
        isValidating: isCalculating,
        data: { cartTotalPrice: total } = { cartTotalPrice: 0 },
    } = useCartCalculation(cartItems, {
        onSuccess() {
            toast("Cart Calculation Complete!");
        },
    });

    const cartItemMap = useMemo(
        () => new Map(cartItems.map((item) => [item.pid, item])),
        [cartItems]
    );

    const cartItemProducts = useMemo<Array<ProduceWithAmount>>(() => {
        const filteredProducts = products.filter((p) => cartItemMap.has(p.id));
        return filteredProducts.map((p) => ({
            ...p,
            amount: cartItemMap.get(p.id)?.amount || 0,
        }));
    }, [products, cartItemMap]);

    // const cartItemProducts = useCartItemProducts(cartItems);

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
                            {cartItemProducts.map((item) => (
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
