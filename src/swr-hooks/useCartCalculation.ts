import useSWR from "swr";
import { API_URL } from "../consts";
import { CartItem, SWRHookOptions } from "../types";

type Arguments = [url: string, cartItems: Array<CartItem>];

const fetcher = ([url, cartItems]: Arguments) =>
    fetch(url, {
        method: "POST",
        body: JSON.stringify({ cartItems }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => res.json());

export default function useCartCalculation(
    cartItems: Array<CartItem>,
    hasRolledback: boolean,
    options: SWRHookOptions
) {
    const queryKeys =
        cartItems.length === 0 || hasRolledback
            ? null
            : [`${API_URL}/cart-calculation`, cartItems];

    return useSWR(queryKeys, fetcher, options);
}
