import { FC, useEffect, useMemo, useState } from "react";
import { Product } from "../types";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { API_URL } from "../consts";
import { toast } from "react-toastify";
import updateFavoriteProducts from "../api/update-favorite-products";

type Props = {
    products: Array<Product>;
    addToCart(product: Product): void;
};

const ProductList: FC<Props> = ({ addToCart, products }) => {
    const [favorites, setFavorites] = useState<Array<Product["id"]>>([]);

    // Fetching favorite Products...
    useEffect(() => {
        fetch(`${API_URL}/favorite-products`)
            .then((res) => res.json())
            .then((data) => {
                setFavorites(data);
            });
    }, []);

    const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

    const handleToggleFavorite = (product: Product) => {
        const oldFavorites = [...favorites];
        const favoriteIndex = favorites.findIndex((pid) => pid === product.id);

        let message: string;
        if (favoriteIndex === -1) {
            message = `Success adding ${product.name} as favorite!`;
        } else {
            message = `Success removing ${product.name} from favorite!`;
        }

        /* Optimistic Update */
        // const newFavorites = [...favorites];
        // if (favoriteIndex === -1) {
        //     newFavorites.push(product.id);
        // } else {
        //     newFavorites.splice(favoriteIndex, 1);
        // }
        // setFavorites(newFavorites);

        updateFavoriteProducts(product)
            .then((data) => {
                toast(message, { type: "success" });
                setFavorites(data);
            })
            .catch(() => {
                toast("Failed", { type: "error" });
                setFavorites(oldFavorites);
            });
    };

    if (products.length === 0) return <h1>Loading Products...</h1>;

    return (
        <ul className="product-list">
            {products.map((p) => (
                <li key={p.id}>
                    <div className="img-wrapper">
                        <span onClick={() => handleToggleFavorite(p)}>
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

export default ProductList;
