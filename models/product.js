const fs = require("fs")
const path = require("path")
const rootDir = require("../util/path")

const Cart = require("../models/cart")

const p = path.join(rootDir, "data", "products.json")

const getProductsFromFile = (cb) => {
    fs.readFile(p, (err, data) => {
        if (err) {
            cb([])
        } else {
            cb(JSON.parse(data))
        }
    })
}

module.exports = class Product {
    constructor(id, title, imageUrl, price, description) {
        this.id = id
        this.title = title
        this.imageUrl = imageUrl
        this.price = price
        this.description = description
    }

    save() {
        getProductsFromFile((products) => {
            if (this.id) {
                const existingProductIndex = products.findIndex(
                    (p) => p.id === this.id
                )
                products[existingProductIndex] = this
            } else {
                this.id = Math.random().toString()
                products.push(this)
            }
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err)
            })
        })
    }

    static deleteById(id) {
        getProductsFromFile((products) => {
            const product = products.find((p) => p.id === id)
            products = products.filter((p) => p.id !== id)
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if (!err) {
                    Cart.deleteProduct(id, product.price)
                }
            })
        })
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
    }

    static findById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find((p) => p.id === id)
            cb(product)
        })
    }
}
