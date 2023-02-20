import useSWR from "swr";
import { Product, SWRHookOptions } from "../types";
import { API_URL } from "../consts";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ResponseData = Array<Product>;

export default function useProducts(options: SWRHookOptions = {}) {
    return useSWR<ResponseData>(`${API_URL}/products`, fetcher, options);
}
