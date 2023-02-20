import { API_URL } from "../consts";
import { Product } from "../types";

export default async function updateFavoriteProducts(
    product: Product
): Promise<Array<Product["id"]>> {
    return fetch(`${API_URL}/favorite-products`, {
        method: "POST",
        body: JSON.stringify({ productId: product.id }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then((res) => res.json());
}
