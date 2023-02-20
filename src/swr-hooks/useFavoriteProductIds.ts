import useSWR from "swr";
import { API_URL } from "../consts";
import { Product, SWRHookOptions } from "../types";
import updateFavoriteProducts from "../api/update-favorite-products";
import { toast } from "react-toastify";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ResponseData = Array<Product["id"]>;

export default function useFavoriteProductIds(options: SWRHookOptions = {}) {
    const swrResponse = useSWR<ResponseData>(
        `${API_URL}/favorite-products`,
        fetcher,
        options
    );

    const toggleFavorite = async (product: Product) => {
        const { data: favorites = [], mutate } = swrResponse;

        toast(`Adding/Removing ${product.name} to favorites...`, {
            type: "info",
        });

        /* 1. Bound Mutation */
        // await updateFavoriteProducts(product);
        // mutate();

        /* 2. Bound Mutation with Optimistic Update */
        const favoriteIndex = favorites.findIndex((pid) => pid === product.id);
        const newFavorites = [...favorites];
        let message;
        if (favoriteIndex === -1) {
            newFavorites.push(product.id);
            message = `adding ${product.name} to favorites!`;
        } else {
            newFavorites.splice(favoriteIndex, 1);
            message = `removing ${product.name} from favorites!`;
        }

        try {
            await mutate(updateFavoriteProducts(product), {
                optimisticData: newFavorites,
                rollbackOnError: true,
                populateCache: true,
                revalidate: false,
            });
            toast(`Successfully ${message}`, { type: "success" });
        } catch (err) {
            toast(`Failed ${message}`, { type: "error" });
        }
    };

    return { ...swrResponse, toggleFavorite };
}
