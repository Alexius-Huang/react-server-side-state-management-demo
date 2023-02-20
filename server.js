const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;

const productFilePath = path.join(__dirname, "products.json");

const favoriteProducts = new Set([3, 5]);

const getProducts = () => JSON.parse(fs.readFileSync(productFilePath, "utf8"));

app.use(cors());
app.use(express.json());

app.get("/products", (req, res) => {
    const data = getProducts();
    res.status(200).json(data);
});

app.post("/cart-calculation", (req, res) => {
    const { cartItems = [] } = req.body;
    const cartItemMap = new Map(cartItems.map((i) => [i.pid, i]));
    const products = getProducts();

    const cartTotalPrice = products
        .filter((p) => cartItemMap.has(p.id))
        .reduce((pre, cur) => {
            const amount = cartItemMap.get(cur.id).amount;
            return pre + cur.price * amount;
        }, 0);

    res.status(200).json({ cartTotalPrice });
});

app.get("/favorite-products", (req, res) => {
    res.status(200).json(Array.from(favoriteProducts));
});

app.post("/favorite-products", (req, res) => {
    const { productId: pid } = req.body;

    if (favoriteProducts.has(pid)) {
        favoriteProducts.delete(pid);
    } else {
        favoriteProducts.add(pid);
    }

    res.status(200).json(Array.from(favoriteProducts));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
