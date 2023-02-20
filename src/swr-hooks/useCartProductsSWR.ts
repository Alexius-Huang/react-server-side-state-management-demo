import { useMemo } from "react";
import { CartItem, ProduceWithAmount } from "../types";
import useProducts from "./useProducts";

export default function useCartProducts(cartItems: Array<CartItem>) {
    const { data: products = [] } = useProducts();

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
