const Product = require("../models/product")

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
    res.render("shop/cart", { pageTitle: "Your cart", path: "/cart" })
}

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", { pageTitle: "Your orders", path: "/orders" })
}

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout" })
}
