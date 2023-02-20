import { useRef, useState } from "react";
import { CartItem, Product } from "../types";

export default function useCart() {
    const [cartItems, setCartItems] = useState<Array<CartItem>>([]);
    const [hasRolledback, setHasRolledback] = useState(false);
    const previousCartItemsRef = useRef<Array<CartItem>>([]);

    const addToCart = (product: Product) => {
        previousCartItemsRef.current = cartItems;
        setHasRolledback(false);

        const cartItemIndex = cartItems.findIndex(
            (item) => item.pid === product.id
        );

        if (cartItemIndex === -1) {
            setCartItems((cartItems) => [
                ...cartItems,
                { pid: product.id, amount: 1 },
            ]);
        } else {
            const newCartItems = [...cartItems];
            const item = cartItems[cartItemIndex];
            newCartItems[cartItemIndex] = {
                ...item,
                amount: item.amount + 1,
            };
            setCartItems(newCartItems);
        }
    };

    const removeFromCart = (product: Product) => {
        previousCartItemsRef.current = cartItems;
        setHasRolledback(false);

        const cartItemIndex = cartItems.findIndex(
            (item) => item.pid === product.id
        );
        if (cartItemIndex === -1) return;

        const newCartItems = [...cartItems];
        if (newCartItems[cartItemIndex].amount === 1) {
            newCartItems.splice(cartItemIndex, 1);
            setCartItems(newCartItems);
        } else {
            const item = cartItems[cartItemIndex];
            newCartItems[cartItemIndex] = {
                ...item,
                amount: item.amount - 1,
            };
            setCartItems(newCartItems);
        }
    };

    const rollbackCart = () => {
        setHasRolledback(true);
        setCartItems(previousCartItemsRef.current);
    };

    return {
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        hasRolledback,
        rollbackCart
    };
}
