const Product = require("../models/product")

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
    })
}

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, price, description } = req.body
    req.user
        .createProduct({
            title,
            price,
            imageUrl,
            description,
        })
        .then((result) => {
            console.log("Created Product")
            res.redirect("/admin/products")
        })
        .catch((err) => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.productId
    // Product.findByPk(prodId)
    req.user
        .getProducts({ where: { id: prodId } })
        .then((products) => {
            const product = products[0]
            if (!product) {
                return res.redirect("/")
            }
            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: true,
                product,
            })
        })
        .catch((err) => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const { productId, title, imageUrl, price, description } = req.body
    Product.findByPk(productId)
        .then((product) => {
            product.title = title
            product.price = price
            product.imageUrl = imageUrl
            product.description = description
            return product.save()
        })
        .then((result) => {
            console.log("UPDATED PRODUCT")
            res.redirect("/admin/products")
        })
        .catch((err) => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId

    Product.findByPk(prodId)
        .then((product) => {
            return product.destroy()
        })
        .then((result) => {
            console.log("DESTROYED PRODUCT")
            res.redirect("/admin/products")
        })
        .catch((err) => console.log(err))
}

exports.getProducts = (req, res, next) => {
    req.user
        .getProducts()
        .then((products) => {
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
            })
        })
        .catch((err) => console.log(err))
}
