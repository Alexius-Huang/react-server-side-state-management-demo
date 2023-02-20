import useSWR from "swr";

export type Product = {
    id: number;
    name: string;
    price: number;
    url: string;
};

export type CartItem = {
    pid: number;
    amount: number;
};

export type ProduceWithAmount = Product & {
    amount: CartItem["amount"];
};

export type SWRHookOptions<T = any> = Parameters<typeof useSWR<T>>[2];
