const { validationResult } = require("express-validator")

const Product = require("../models/product")

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
    })
}

exports.postAddProduct = (req, res, next) => {
    const { title, price, description, imageUrl } = req.body
    const product = new Product({
        title,
        price,
        description,
        imageUrl,
        userId: req.user,
    })
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            pageTitle: "Add Product",
            path: "/admin/add-product",
            editing: false,
            hasError: true,
            product: { title, price, description, imageUrl },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
        })
    }

    product
        .save()
        .then((result) => {
            console.log("Created Product")
            res.redirect("/admin/products")
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId)
        .then((product) => {
            if (!product) {
                return res.redirect("/")
            }
            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: "/admin/edit-product",
                editing: true,
                hasError: false,
                product,
                errorMessage: null,
                validationErrors: [],
            })
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postEditProduct = (req, res, next) => {
    const { productId, title, imageUrl, price, description } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            pageTitle: "Edit Product",
            path: "/admin/edit-product",
            editing: true,
            hasError: true,
            product: { title, price, description, imageUrl, _id: productId },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
        })
    }

    Product.findById(productId)
        .then((product) => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect("/")
            }
            product.title = title
            product.imageUrl = imageUrl
            product.price = price
            product.description = description
            return product.save().then((result) => {
                console.log("UPDATED PRODUCT")
                res.redirect("/admin/products")
            })
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId

    Product.deleteOne({ _id: prodId, userId: req.user._id })
        .then(() => {
            res.redirect("/admin/products")
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        .then((products) => {
            res.render("admin/products", {
                prods: products,
                pageTitle: "Admin Products",
                path: "/admin/products",
            })
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        })
}
