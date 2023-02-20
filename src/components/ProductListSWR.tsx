import { FC, useMemo } from "react";
import { toast } from "react-toastify";
import { BsHeart, BsHeartFill } from "react-icons/bs";

import useProducts from "../swr-hooks/useProducts";
import useFavoriteProductIds from "../swr-hooks/useFavoriteProductIds";
import updateFavoriteProducts from "../api/update-favorite-products";

import type { Product } from "../types";

type Props = {
    addToCart(product: Product): void;
};

const ProductListSWR: FC<Props> = ({ addToCart }) => {
    const { isLoading, data: products = [] } = useProducts();
    const {
        data: favorites = [],
        // toggleFavorite,
        mutate,
    } = useFavoriteProductIds({
        revalidateOnFocus: false,
        onSuccess() {
            toast("Success fetching favorites!", { type: "success" });
        },
        onError() {
            toast("Failed fetching favorites!", { type: "error" });
        },
    });

    const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

    const toggleFavorite = async (product: Product) => {
        toast(`Adding/Removing ${product.name} to favorites...`, {
            type: "info",
        });

        /* 1. Bound Mutation */
        await updateFavoriteProducts(product);
        mutate();

        /* 2. Bound Mutation with Optimistic Update */
        // const favoriteIndex = favorites.findIndex((pid) => pid === product.id);
        // const newFavorites = [...favorites];
        // let message;
        // if (favoriteIndex === -1) {
        //     newFavorites.push(product.id);
        //     message = `adding ${product.name} to favorites!`;
        // } else {
        //     newFavorites.splice(favoriteIndex, 1);
        //     message = `removing ${product.name} from favorites!`;
        // }
        // try {
        //     await mutate(
        //         updateFavoriteProducts(product),
        //         {
        //             optimisticData: newFavorites,
        //             rollbackOnError: true,
        //             populateCache: true,
        //             revalidate: false
        //         }
        //     );
        //     toast(`Successfully ${message}`, { type: 'success' });
        // } catch (err) {
        //     toast(`Failed ${message}`, { type: 'error' });
        // }
    };

    if (isLoading) return <h1>Loading Products...</h1>;

    return (
        <ul className="product-list">
            {products.map((p) => (
                <li key={p.id}>
                    <div className="img-wrapper">
                        <span onClick={() => toggleFavorite(p)}>
                            {favoriteSet.has(p.id) ? (
                                <BsHeartFill />
                            ) : (
                                <BsHeart />
                            )}
                        </span>
                        <img src={p.url} alt="" />
                    </div>
                    <p className="product-name">{p.name}</p>
                    <p className="product-price">${p.price}</p>
                    <button
                        className="product-add-to-cart"
                        onClick={() => addToCart(p)}
                    >
                        + Add
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default ProductListSWR;
