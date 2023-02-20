import { FC, useMemo } from "react";
import { toast } from "react-toastify";
import { BsHeart, BsHeartFill } from "react-icons/bs";

import useProducts from "../swr-hooks/useProducts";
import useFavoriteProductIds from "../swr-hooks/useFavoriteProductIds";

import type { Product } from "../types";

type Props = {
    addToCart(product: Product): void;
};

const ProductListSWR: FC<Props> = ({ addToCart }) => {
    const { isLoading, data: products = [] } = useProducts();
    const { data: favorites = [], toggleFavorite } = useFavoriteProductIds({
        revalidateOnFocus: false,
        onSuccess() {
            toast("Success fetching favorites!", { type: "success" });
        },
        onError() {
            toast("Failed fetching favorites!", { type: "error" });
        },
    });

    const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

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
