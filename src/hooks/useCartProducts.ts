import { useMemo } from "react";
import { CartItem, ProduceWithAmount, Product } from "../types";

export default function useCartProducts(
    products: Array<Product>,
    cartItems: Array<CartItem>
) {
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

    return cartItemProducts;
}
