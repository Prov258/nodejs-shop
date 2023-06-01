const Product = require("../models/product")
const Cart = require("../models/cart")

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("shop/index", {
            prods: products,
            pageTitle: "Shop",
            path: "/",
        })
    })
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId, (product) => {
        res.render("shop/product-detail", {
            product,
            pageTitle: product.title,
            path: "/products",
        })
    })
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("shop/product-list", {
            prods: products,
            pageTitle: "All Products",
            path: "/products",
        })
    })
}

exports.getCart = (req, res, next) => {
    Cart.getCart((cart) => {
        Product.fetchAll((products) => {
            const cartProducts = []
            for (const prod of products) {
                const cartProduct = cart.products.find(
                    (cartProd) => cartProd.id === prod.id
                )
                if (cartProduct) {
                    cartProducts.push({
                        productData: prod,
                        qty: cartProduct.qty,
                    })
                }
            }

            res.render("shop/cart", {
                pageTitle: "Your cart",
                path: "/cart",
                products: cartProducts,
            })
        })
    })
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price)
    })
    res.redirect("/cart")
}

exports.postCartDeleteProduct = (req, res, next) => {
    Product.findById(req.body.productId, (p) => {
        Cart.deleteProduct(p.id, p.price)
        res.redirect("/cart")
    })
}

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", { pageTitle: "Your orders", path: "/orders" })
}

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout" })
}
